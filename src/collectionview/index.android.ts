import {
    ChangeType,
    ChangedData,
    ContentView,
    CoreTypes,
    Length,
    Property,
    ProxyViewContainer,
    Trace,
    Utils,
    View,
    ViewBase,
    booleanConverter,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty,
    profile
} from '@nativescript/core';
import {
    CollectionViewItemDisplayEventData,
    CollectionViewItemEventData,
    Orientation,
    itemOverlapProperty,
    reorderLongPressEnabledProperty,
    reorderingEnabledProperty,
    reverseLayoutProperty,
    scrollBarIndicatorVisibleProperty
} from '.';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isScrollEnabledProperty, orientationProperty } from './index-common';
import { TypedArray, createArrayBuffer } from '@nativescript-community/arraybuffers';

export * from './index-common';

declare module '@nativescript/core/ui/core/view' {
    interface ViewCommon {
        layoutChangeListenerIsSet: boolean;
        layoutChangeListener: android.view.View.OnLayoutChangeListener;
        //@ts-ignore
        _raiseLayoutChangedEvent();
        handleGestureTouch(event: android.view.MotionEvent);
    }
}

@NativeClass
class SimpleCallback extends androidx.recyclerview.widget.ItemTouchHelper.SimpleCallback {
    owner: WeakRef<CollectionView>;
    constructor(param1: number, param2: number) {
        super(param1, param2);
        return global.__native(this);
    }
    onMove(
        recyclerview: androidx.recyclerview.widget.RecyclerView,
        viewHolder: androidx.recyclerview.widget.RecyclerView.ViewHolder,
        target: androidx.recyclerview.widget.RecyclerView.ViewHolder
    ): boolean {
        const startPosition = viewHolder.getAdapterPosition();
        const endPosition = target.getAdapterPosition();
        const owner = this.owner?.get();
        if (owner && !owner._canReorderToPosition(startPosition, endPosition, owner.getItemAtIndex(endPosition))) {
            return false;
        }
        if (this.startPosition === -1) {
            this.startPosition = startPosition;
        }
        this.endPosition = endPosition;
        if (owner) {
            owner._reorderItemInSource(startPosition, endPosition);
            return true;
        }
        return false;
    }
    startPosition = -1;
    endPosition = -1;
    onSelectedChanged(viewHolder: androidx.recyclerview.widget.RecyclerView.ViewHolder, state: number) {
        if (viewHolder) {
            if (this.startPosition === -1) {
                this.startPosition = viewHolder.getAdapterPosition();
            }
        }
        if (!viewHolder) {
            // this is where we identify the end of the drag and call the end event
            const owner = this.owner?.get();

            if (this.endPosition === -1) {
                this.endPosition = this.startPosition;
            }
            if (owner) {
                const item = owner.getItemAtIndex(this.startPosition);
                owner._callItemReorderedEvent(this.startPosition, this.endPosition, item);
            }
            this.startPosition = -1;
            this.endPosition = -1;
            owner.isDragging = false;
        }
    }
    onSwiped(viewHolder: androidx.recyclerview.widget.RecyclerView.ViewHolder, direction: number) {}
    isItemViewSwipeEnabled() {
        // disabled for now
        return false;
    }
    isLongPressDragEnabled() {
        // we use our custom longpress gesture handler
        return false;
    }
}

@NativeClass
class LongPressGestureListenerImpl extends android.view.GestureDetector.SimpleOnGestureListener {
    constructor(private _owner: WeakRef<CollectionView>) {
        super();
        return global.__native(this);
    }
    public onLongPress(motionEvent: android.view.MotionEvent): void {
        const owner = this._owner?.get();
        if (owner) {
            owner.onReorderLongPress(motionEvent);
        }
    }
}

let LayoutParams: typeof android.view.ViewGroup.LayoutParams;

const extraLayoutSpaceProperty = new Property<CollectionViewBase, number>({
    name: 'extraLayoutSpace'
});
const itemViewCacheSizeProperty = new Property<CollectionViewBase, number>({
    name: 'itemViewCacheSize'
});

const nestedScrollingEnabledProperty = new Property<CollectionViewBase, boolean>({
    name: 'nestedScrollingEnabled',
    defaultValue: true,
    valueConverter: booleanConverter
});

export enum SnapPosition {
    START = 0,
    END = 1
}

export class CollectionView extends CollectionViewBase {
    //TODO: remove as it needs to be added after TS 5.7 change https://github.com/microsoft/TypeScript/pull/59860
    [key: symbol]: (...args: any[]) => any | void;

    public static layoutCompletedEvent = 'layoutCompleted';
    public static DEFAULT_TEMPLATE_VIEW_TYPE = 0;
    public static CUSTOM_TEMPLATE_ITEM_TYPE = 1;
    public nativeViewProtected: CollectionViewRecyclerView & {
        scrollListener: com.nativescript.collectionview.OnScrollListener;
        layoutManager: androidx.recyclerview.widget.RecyclerView.LayoutManager;
        owner?: WeakRef<CollectionView>;
    };

    private recyclerListener: androidx.recyclerview.widget.RecyclerView.RecyclerListener;

    private templateTypeNumberString = new Map<string, number>();
    private templateStringTypeNumber = new Map<number, string>();
    private _currentNativeItemType = 0;

    private currentSpanCount = 1;

    // used to store viewHolder and thus their corresponding Views
    // used to "destroy" cells when possible
    private _viewHolders = new Set<CollectionViewCellHolder>();

    private _scrollOrLoadMoreChangeCount = 0;
    private _nScrollListener: com.nativescript.collectionview.OnScrollListener.Listener;
    scrolling = false;
    needsScrollStartEvent = false;

    private _hlayoutParams: android.view.ViewGroup.LayoutParams;
    private _vlayoutParams: android.view.ViewGroup.LayoutParams;
    private _lastLayoutKey: string;

    private _listViewAdapter: com.nativescript.collectionview.Adapter;

    // reordering
    private _simpleItemTouchCallback: SimpleCallback;
    private _itemTouchHelper: androidx.recyclerview.widget.ItemTouchHelper;

    public animateItemUpdate = false;

    public nestedScrollingEnabled: boolean;
    public itemViewCacheSize: number;
    public extraLayoutSpace: number;
    recycledViewPool: com.nativescript.collectionview.RecycledViewPool;
    recycledViewPoolDisposeListener: com.nativescript.collectionview.RecycledViewPool.ViewPoolListener;

    mInPropertiesSet = false;
    mShouldUpdateInnerSize = false;
    mShouldUpdateSpanCount = false;
    mShouldRefresh = false;
    public onResumeNativeUpdates(): void {
        // {N} suspends properties update on `_suspendNativeUpdates`. So we only need to do this in onResumeNativeUpdates
        this.mInPropertiesSet = true;
        super.onResumeNativeUpdates();
        this.mInPropertiesSet = false;
        if (this.mShouldUpdateInnerSize) {
            this.updateInnerSize();
        }
        if (this.mShouldUpdateSpanCount) {
            this.updateSpanCount();
        }
        if (this.mShouldRefresh) {
            this.refresh();
        }
    }

    @profile
    public createNativeView() {
        // storing the class in a property for reuse in the future cause a materializing which is pretty slow!
        if (!CollectionViewRecyclerView) {
            CollectionViewRecyclerView = com.nativescript.collectionview.RecyclerView as any;
        }
        const recyclerView = (CollectionViewRecyclerView as any).createRecyclerView(this._context) as com.nativescript.collectionview.RecyclerView;
        // const expMgr = new RecyclerViewExpandableItemManager(null);
        // adapter.setDisplayHeadersAtStartUp(true).setStickyHeaders(true); //Make headers sticky
        // Endless scroll with 1 item threshold
        // .setLoadingMoreAtStartUp(true)
        // .setEndlessScrollListener(this, new ProgressItem())
        // .setEndlessScrollThreshold(1); //Default=1

        // const fastScroller = new com.l4digital.fastscroll.FastScroller(this._context);
        // fastScroller.setSectionIndexer(adapter);
        // fastScroller.attachRecyclerView(recyclerView);

        return recyclerView;
    }

    @profile
    public initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        if (!this.recycledViewPool) {
            this.recycledViewPool = new com.nativescript.collectionview.RecycledViewPool();
            this.recycledViewPoolDisposeListener = new com.nativescript.collectionview.RecycledViewPool.ViewPoolListener({
                onViewHolderDisposed: (holder: CollectionViewCellHolder) => {
                    if (Trace.isEnabled()) {
                        CLog(CLogTypes.log, 'onViewHolderDisposed', holder);
                    }
                    if (this._viewHolders) {
                        this._viewHolders.delete(holder);
                    }
                    const isNonSync = holder['defaultItemView'] === true;
                    const view = isNonSync ? (holder.view as ContentView).content : holder.view;
                    this.notifyForItemAtIndex(CollectionViewBase.itemDisposingEvent, view, holder.getAdapterPosition(), view.bindingContext, holder);
                    if (view && view.isLoaded) {
                        view.callUnloaded();
                    }
                    view._isAddedToNativeVisualTree = false;
                    view.parent = null;
                    view._tearDownUI();
                }
            });
            (this.recycledViewPool as any).mListener = this.recycledViewPoolDisposeListener;
        }
        if (Trace.isEnabled() || this.hasListeners(CollectionViewBase.itemRecyclingEvent)) {
            const recyclerListener = (this.recyclerListener = new androidx.recyclerview.widget.RecyclerView.RecyclerListener({
                onViewRecycled: (holder: CollectionViewCellHolder) => {
                    if (Trace.isEnabled()) {
                        CLog(CLogTypes.log, 'onViewRecycled', this, nativeView, holder);
                    }
                    const isNonSync = holder['defaultItemView'] === true;
                    const view = isNonSync ? (holder.view as ContentView).content : holder.view;
                    this.notifyForItemAtIndex(CollectionViewBase.itemRecyclingEvent, view, holder.getAdapterPosition(), view.bindingContext, holder);
                }
            }));
            nativeView.setRecyclerListener(recyclerListener);
        }
        nativeView.setRecycledViewPool(this.recycledViewPool);
        let layoutManager: androidx.recyclerview.widget.RecyclerView.LayoutManager;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layoutManager = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        } else {
            layoutManager = new com.nativescript.collectionview.PreCachingGridLayoutManager(this._context, 1);
            if (this.hasListeners(CollectionView.layoutCompletedEvent)) {
                (layoutManager as com.nativescript.collectionview.GridLayoutManager).layoutCompletedListener = new com.nativescript.collectionview.GridLayoutManager.LayoutCompletedListener({
                    onLayoutCompleted: () => {
                        this.notify({ eventName: CollectionView.layoutCompletedEvent });
                    }
                });
            }
            // layoutManager = new PreCachingGridLayoutManager(this._context, 1);
            // (layoutManager as any).owner = new WeakRef(this);
        }
        // this.spanSize
        nativeView.setLayoutManager(layoutManager);
        nativeView.layoutManager = layoutManager;

        nativeView.sizeChangedListener = new com.nativescript.collectionview.SizeChangedListener({
            onLayout: (changed, left, top, right, bottom) => changed && this.onLayout(left, top, right, bottom),
            onMeasure: (widthMeasureSpec, heightMeasureSpec) => this.onMeasure(widthMeasureSpec, heightMeasureSpec)
        });
        this.spanSize = this._getSpanSize;

        // const animator = new jp.wasabeef.recyclerview.animators.FadeInAnimator();
        // // animator.setInterpolator(new android.view.animation.OvershootInterpolator());
        // animator.setMoveDuration(200);
        // Change animations are enabled by default since support-v7-recyclerview v22.
        // Need to disable them when using animation indicator.
        // animator.setSupportsChangeAnimations(false);

        // nativeView.setItemAnimator(animator);

        // enforce the first refresh for the collectionview to be ready as soon as possible
        this.refresh(true);
    }
    @profile
    public disposeNativeView() {
        // this.eachChildView((view) => {
        //     view.parent._removeView(view);
        //     return true;
        // });
        // this._realizedItems.clear();

        const nativeView = this.nativeViewProtected;
        nativeView.setRecyclerListener(null);
        nativeView.setRecycledViewPool(null);
        this.recycledViewPoolDisposeListener = null;
        this.recycledViewPool = null;
        this.detachScrollListenerIfNecessary(true);
        nativeView.sizeChangedListener = null;
        nativeView.layoutManager = null;
        this._listViewAdapter = null;
        this._itemTouchHelper = null;
        this._simpleItemTouchCallback = null;
        this.disposeViewHolderViews();
        this.clearTemplateTypes();

        super.disposeNativeView();
    }

    onLoaded() {
        super.onLoaded();
        this.attachScrollListenerIfNecessary();
    }
    // onUnloaded() {
    //     super.onUnloaded();
    //     this.detachScrollListenerIfNecessary();
    // }
    public getViewForItemAtIndex(index: number): View {
        return this.enumerateViewHolders<View>((v) => (v.getAdapterPosition() === index ? v.view : undefined));
    }

    _getSpanSize: (item, index) => number;
    //@ts-ignore
    set spanSize(inter: (item, index) => number) {
        if (!(typeof inter === 'function')) {
            return;
        }
        this._getSpanSize = inter;
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setSpanSizeLookup']) {
            if (inter) {
                layoutManager['setSpanSizeLookup'](
                    new com.nativescript.collectionview.SpanSizeLookup(
                        new com.nativescript.collectionview.SpanSizeLookup.Interface({
                            getSpanSize: (position) => {
                                const dataItem = this.getItemAtIndex(position);
                                return Math.min(inter(dataItem, position), this.currentSpanCount);
                            }
                        })
                    )
                );
            } else {
                layoutManager['setSpanSizeLookup'](null);
            }
        }
    }
    get spanSize() {
        return this._getSpanSize;
    }

    decorator: com.nativescript.collectionview.OverlapDecoration;
    decoratorBuffer: TypedArray;
    decoratorListener: com.nativescript.collectionview.OverlapDecoration.OverlapDecorationListener;

    nativeGetItemOverlap(position: number) {
        const item = this.getItemAtIndex(position);
        const result = this.itemOverlap(item, position);

        this.decoratorBuffer[0] = Length.toDevicePixels(result[0], 0);
        this.decoratorBuffer[1] = Length.toDevicePixels(result[1], 0);
        this.decoratorBuffer[2] = Length.toDevicePixels(result[2], 0);
        this.decoratorBuffer[3] = Length.toDevicePixels(result[3], 0);
        return this.decoratorBuffer;
    }

    [itemOverlapProperty.setNative](value: Function | string) {
        if (typeof value === 'function') {
            if (!this.decorator) {
                this.decoratorListener = new com.nativescript.collectionview.OverlapDecoration.OverlapDecorationListener({
                    getItemOverlap: this.nativeGetItemOverlap.bind(this)
                });
                this.decorator = new com.nativescript.collectionview.OverlapDecoration(this.decoratorListener);
                this.nativeViewProtected.addItemDecoration(this.decorator);
            }
            if (!this.decoratorBuffer) {
                this.decoratorBuffer = createArrayBuffer(4, false, true);
            }
        } else {
            if (this.decorator) {
                this.nativeViewProtected.removeItemDecoration(this.decorator);
                this.decorator = null;
            }
            this.decoratorListener = null;
        }
    }

    private attachScrollListenerIfNecessary() {
        const nativeView = this.nativeViewProtected;
        if (this._scrollOrLoadMoreChangeCount > 0 && nativeView && !nativeView.scrollListener) {
            this._nScrollListener = new com.nativescript.collectionview.OnScrollListener.Listener({
                onScrollStateChanged: this.onScrollStateChanged.bind(this),
                onScrolled: this.onScrolled.bind(this)
            });
            const scrollListener = new com.nativescript.collectionview.OnScrollListener(this._nScrollListener);
            nativeView.addOnScrollListener(scrollListener);
            nativeView.scrollListener = scrollListener;
        }
    }
    private detachScrollListenerIfNecessary(force = false) {
        const nativeView = this.nativeViewProtected;
        if (force || (this._scrollOrLoadMoreChangeCount === 0 && nativeView)) {
            if (nativeView.scrollListener) {
                this.nativeView.removeOnScrollListener(nativeView.scrollListener);
                nativeView.scrollListener = null;
            }
            this._nScrollListener = null;
        }
    }
    private computeScrollEventData(view: androidx.recyclerview.widget.RecyclerView, eventName: string, dx?: number, dy?: number) {
        const horizontal = this.isHorizontal();
        const offset = horizontal ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset();
        const range = horizontal ? view.computeHorizontalScrollRange() : view.computeVerticalScrollRange();
        const extent = horizontal ? view.computeHorizontalScrollExtent() : view.computeVerticalScrollExtent();
        return {
            object: this,
            eventName,
            scrollOffset: offset / Utils.layout.getDisplayDensity(),
            scrollSize: (range - extent) / Utils.layout.getDisplayDensity(),
            scrollOffsetPercentage: offset / (range - extent),
            dx,
            dy
        };
    }

    public onScrolled(view: androidx.recyclerview.widget.RecyclerView, dx: number, dy: number) {
        if (!this || !this.scrolling) {
            return;
        }
        if (this.needsScrollStartEvent) {
            this.needsScrollStartEvent = false;
            if (this.hasListeners(CollectionViewBase.scrollStartEvent)) {
                this.notify(this.computeScrollEventData(view, CollectionViewBase.scrollStartEvent, dx, dy));
            }
        }

        if (this.hasListeners(CollectionViewBase.scrollEvent)) {
            this.notify(this.computeScrollEventData(view, CollectionViewBase.scrollEvent, dx, dy));
        }

        if (this.hasListeners(CollectionViewBase.loadMoreItemsEvent) && this.items) {
            const layoutManager = view.getLayoutManager();
            if (layoutManager['findLastCompletelyVisibleItemPosition']) {
                const lastVisibleItemPos = layoutManager['findLastCompletelyVisibleItemPosition']();
                const loadMoreItemIndex = this.items.length - this.loadMoreThreshold;
                if (lastVisibleItemPos === loadMoreItemIndex) {
                    this.notify({ eventName: CollectionViewBase.loadMoreItemsEvent });
                }
            } else if (layoutManager['findLastCompletelyVisibleItemPositions'] && layoutManager['getSpanCount']) {
                let positions = Array.create('int', layoutManager['getSpanCount']());
                positions = layoutManager['findLastCompletelyVisibleItemPositions'](positions);
                let lastVisibleItemPos = 0;
                for (let i = 0; i < positions.length; i++) {
                    if (positions[i] > lastVisibleItemPos) {
                        lastVisibleItemPos = positions[i];
                    }
                }
                const loadMoreItemIndex = this.items.length - this.loadMoreThreshold;
                if (lastVisibleItemPos >= loadMoreItemIndex) {
                    this.notify({ eventName: CollectionViewBase.loadMoreItemsEvent });
                }
            }
        }
    }

    public onScrollStateChanged(view: androidx.recyclerview.widget.RecyclerView, newState: number) {
        if (this.scrolling && newState === 0) {
            // SCROLL_STATE_IDLE
            this.scrolling = false;

            if (this.hasListeners(CollectionViewBase.scrollEndEvent)) {
                this.notify(this.computeScrollEventData(view, CollectionViewBase.scrollEndEvent));
            }
        } else if (!this.scrolling && newState === 1) {
            //SCROLL_STATE_DRAGGING
            this.needsScrollStartEvent = true;
            this.scrolling = true;
        }
    }

    public addEventListener(arg: string, callback: any, thisArg?: any) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.scrollStartEvent || arg === CollectionViewBase.scrollEndEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount++;
            this.attachScrollListenerIfNecessary();
        }
    }

    public removeEventListener(arg: string, callback: any, thisArg?: any) {
        super.removeEventListener(arg, callback, thisArg);

        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.scrollStartEvent || arg === CollectionViewBase.scrollEndEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount--;
            this.detachScrollListenerIfNecessary();
        }
    }

    //@ts-ignore
    get android(): androidx.recyclerview.widget.RecyclerView {
        return this.nativeView;
    }
    get layoutManager() {
        return this.nativeViewProtected && this.nativeViewProtected.layoutManager;
    }
    _getViewLayoutParams() {
        if (this.isHorizontal()) {
            if (!this._hlayoutParams) {
                LayoutParams = LayoutParams || android.view.ViewGroup.LayoutParams;
                this._hlayoutParams = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.MATCH_PARENT);
            }
            return this._hlayoutParams;
        } else {
            if (!this._vlayoutParams) {
                LayoutParams = LayoutParams || android.view.ViewGroup.LayoutParams;
                this._vlayoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
            }
            return this._vlayoutParams;
        }
    }

    defaultPoolSize = 10;
    desiredPoolSize: Map<string, number> = new Map();

    @profile
    private setNativePoolSize(key: string, nativeIndex: number) {
        if (this.desiredPoolSize.has(key)) {
            this.nativeViewProtected.getRecycledViewPool().setMaxRecycledViews(nativeIndex, this.desiredPoolSize.get(key));
        } else {
            if (this.defaultPoolSize >= 0) {
                this.nativeViewProtected.getRecycledViewPool().setMaxRecycledViews(nativeIndex, this.defaultPoolSize);
            }
        }
    }
    @profile
    private setPoolSizes() {
        if (!this.nativeViewProtected || !this.templateTypeNumberString) {
            return;
        }
        this.desiredPoolSize.forEach((v, k) => {
            if (this.templateTypeNumberString.has(k)) {
                this.nativeViewProtected.getRecycledViewPool().setMaxRecycledViews(this.templateTypeNumberString.get(k), v);
            }
        });
    }

    public setPoolSize(key: string, size: number) {
        this.desiredPoolSize.set(key, size);
        this.setPoolSizes();
    }

    [paddingTopProperty.getDefault](): CoreTypes.LengthType {
        return { value: this._defaultPaddingTop, unit: 'px' };
    }
    [paddingTopProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ top: this.effectivePaddingTop });
    }

    [paddingRightProperty.getDefault](): CoreTypes.LengthType {
        return { value: this._defaultPaddingRight, unit: 'px' };
    }
    [paddingRightProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ right: this.effectivePaddingRight });
    }

    [paddingBottomProperty.getDefault](): CoreTypes.LengthType {
        return { value: this._defaultPaddingBottom, unit: 'px' };
    }
    [paddingBottomProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ bottom: this.effectivePaddingBottom });
    }

    [paddingLeftProperty.getDefault](): CoreTypes.LengthType {
        return { value: this._defaultPaddingLeft, unit: 'px' };
    }
    [paddingLeftProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ left: this.effectivePaddingLeft });
    }
    public [orientationProperty.getDefault](): Orientation {
        return 'vertical';
    }
    [orientationProperty.setNative](value: Orientation) {
        const layoutManager = this.layoutManager;
        if (!layoutManager || !layoutManager['setOrientation']) {
            return;
        }
        if (this.isHorizontal()) {
            layoutManager['setOrientation'](0);
        } else {
            layoutManager['setOrientation'](1);
        }
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
    }
    [isScrollEnabledProperty.setNative](value: boolean) {
        const layoutManager = this.layoutManager;
        if (layoutManager && (layoutManager as any).setScrollEnabled) {
            (layoutManager as any).setScrollEnabled(value);
        }
    }
    [reverseLayoutProperty.setNative](value: boolean) {
        const layoutManager = this.layoutManager;
        if (layoutManager && (layoutManager as any).setReverseLayout) {
            (layoutManager as any).setReverseLayout(value);
            // layoutManager['setStackFromEnd'](value);
        }
    }
    [nestedScrollingEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.setNestedScrollingEnabled(value);
    }
    [extraLayoutSpaceProperty.setNative](value: number) {
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setExtraLayoutSpace']) {
            layoutManager['setExtraLayoutSpace'](value);
        }
    }
    [itemViewCacheSizeProperty.setNative](value: number) {
        this.nativeViewProtected.setItemViewCacheSize(value);
    }
    [scrollBarIndicatorVisibleProperty.getDefault](): boolean {
        return true;
    }
    [scrollBarIndicatorVisibleProperty.setNative](value: boolean) {
        this.updateScrollBarVisibility(value);
    }
    protected updateScrollBarVisibility(value) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (this.orientation === 'horizontal') {
            this.nativeViewProtected.setHorizontalScrollBarEnabled(value);
        } else {
            this.nativeViewProtected.setVerticalScrollBarEnabled(value);
        }
    }
    private enumerateViewHolders<T = any>(cb: (v: CollectionViewCellHolder) => T) {
        let result: T, v: CollectionViewCellHolder;
        for (let it = this._viewHolders.values(), cellItemView: CollectionViewCellHolder = null; (cellItemView = it.next().value); ) {
            if (cellItemView['position'] === undefined) {
                continue;
            }
            result = cb(cellItemView);
            if (result) {
                return result;
            }
        }
        return result;
    }
    private async enumerateViewHoldersAsync<T = any>(cb: (v: CollectionViewCellHolder) => Promise<T>) {
        let result: T, v: CollectionViewCellHolder;
        for (let it = this._viewHolders.values(), cellItemView: CollectionViewCellHolder = null; (cellItemView = it.next().value); ) {
            if (cellItemView['position'] === undefined) {
                continue;
            }
            result = await cb(cellItemView);
            if (result) {
                return result;
            }
        }
        return result;
    }
    public startDragging(index: number) {
        if (this.reorderEnabled && this._itemTouchHelper) {
            // let viewHolder: CollectionViewCellHolder;
            const viewHolder = this.enumerateViewHolders<CollectionViewCellHolder>((v) => (v.getAdapterPosition() === index ? v : undefined));
            if (viewHolder) {
                this.startViewHolderDragging(index, viewHolder);
            }
        }
    }
    isDragging = false;
    startViewHolderDragging(index, viewHolder: CollectionViewCellHolder) {
        // isDragging is to prevent longPress from triggering and starting a new drag
        // when triggered manually
        if (!this.isDragging && this.shouldMoveItemAtIndex(index)) {
            this.isDragging = true;
            this._itemTouchHelper.startDrag(viewHolder);
        }
    }
    onReorderLongPress(motionEvent: android.view.MotionEvent) {
        const collectionView = this.nativeViewProtected;
        if (!collectionView) {
            return;
        }
        const view = collectionView.findChildViewUnder(motionEvent.getX(), motionEvent.getY());
        const viewHolder = view != null ? collectionView.getChildViewHolder(view) : null;
        if (viewHolder) {
            this.startViewHolderDragging(viewHolder.getAdapterPosition(), viewHolder as CollectionViewCellHolder);
        }
    }
    _reorderItemInSource(oldPosition: number, newPosition: number) {
        const adapter = this._listViewAdapter;
        // 3. Tell adapter to render the model update.
        adapter.notifyItemMoved(oldPosition, newPosition);
        // on android _reorderItemInSource is call on every "move" and needs to update the adapter/items
        // we will call events only at then end
        super._reorderItemInSource(oldPosition, newPosition, false);
    }

    _longPressGesture: androidx.core.view.GestureDetectorCompat;
    _itemTouchListerner: androidx.recyclerview.widget.RecyclerView.OnItemTouchListener;
    @profile
    public [reorderLongPressEnabledProperty.setNative](value: boolean) {
        if (value) {
            if (!this._longPressGesture) {
                this._longPressGesture = new androidx.core.view.GestureDetectorCompat(this._context, new LongPressGestureListenerImpl(new WeakRef(this)));
                this._itemTouchListerner = new androidx.recyclerview.widget.RecyclerView.OnItemTouchListener({
                    onInterceptTouchEvent: (view: android.view.View, event: android.view.MotionEvent) => {
                        if (this.reorderEnabled && this._longPressGesture) {
                            this._longPressGesture.onTouchEvent(event);
                        }
                        return false;
                    },
                    onTouchEvent: (param0: androidx.recyclerview.widget.RecyclerView, param1: globalAndroid.view.MotionEvent) => {},
                    onRequestDisallowInterceptTouchEvent: (disallowIntercept: boolean) => {}
                });
            }
            this.nativeViewProtected.addOnItemTouchListener(this._itemTouchListerner);
        } else {
            if (this._itemTouchListerner) {
                this.nativeViewProtected.removeOnItemTouchListener(this._itemTouchListerner);
            }
        }
    }
    @profile
    public [reorderingEnabledProperty.setNative](value: boolean) {
        if (value) {
            if (!this._simpleItemTouchCallback) {
                const ItemTouchHelper = androidx.recyclerview.widget.ItemTouchHelper;
                this._simpleItemTouchCallback = new SimpleCallback(ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.START | ItemTouchHelper.END, 0);
                this._simpleItemTouchCallback.owner = new WeakRef(this);
                this._itemTouchHelper = new androidx.recyclerview.widget.ItemTouchHelper(this._simpleItemTouchCallback);
                this._itemTouchHelper.attachToRecyclerView(this.nativeViewProtected);
            }
        }
    }

    @profile
    onItemViewLoaderChanged() {
        if (this.itemViewLoader) {
            this.refresh();
        }
    }
    @profile
    onItemTemplateSelectorChanged(oldValue, newValue) {
        super.onItemTemplateSelectorChanged(oldValue, newValue);
        this.clearTemplateTypes();
        this.refresh();
    }

    @profile
    onItemTemplateChanged(oldValue, newValue) {
        super.onItemTemplateChanged(oldValue, newValue); // TODO: update current template with the new one
        this.refresh();
    }
    @profile
    onItemTemplatesChanged(oldValue, newValue) {
        super.onItemTemplatesChanged(oldValue, newValue); // TODO: update current template with the new one
        this.refresh();
    }

    @profile
    updateSpanCount(requestLayout = true) {
        if (this.mInPropertiesSet) {
            this.mShouldUpdateSpanCount = true;
            return false;
        }
        this.mShouldUpdateSpanCount = false;
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setSpanCount']) {
            const newValue = (this.currentSpanCount = this.computeSpanCount());
            if (newValue !== layoutManager['getSpanCount']()) {
                layoutManager['setSpanCount'](newValue);
                if (requestLayout) {
                    layoutManager.requestLayout();
                }
                return true;
            }
        }
        return false;
    }

    @profile
    updateInnerSize() {
        if (this.mInPropertiesSet) {
            this.mShouldUpdateInnerSize = true;
            return false;
        }
        this.mShouldUpdateInnerSize = false;
        const result = super.updateInnerSize();
        if (result) {
            this.updateSpanCount();
        }
        // there is no need to call refresh if it was triggered before with same size.
        // this refresh is just to handle size change
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._isDataDirty || (this._lastLayoutKey && this._lastLayoutKey !== layoutKey)) {
            // setTimeout(() => this.refresh(false), 0);
        }
        this._lastLayoutKey = layoutKey;
        return result;
    }
    @profile
    _onColWidthPropertyChanged(oldValue: CoreTypes.PercentLengthType, newValue: CoreTypes.PercentLengthType) {
        this.updateSpanCount();
        super._onColWidthPropertyChanged(oldValue, newValue);
    }
    @profile
    _onRowHeightPropertyChanged(oldValue: CoreTypes.PercentLengthType, newValue: CoreTypes.PercentLengthType) {
        this.updateSpanCount();
        super._onRowHeightPropertyChanged(oldValue, newValue);
    }
    @profile
    public onLayout(left: number, top: number, right: number, bottom: number) {
        this._layedOut = true;
        // super.onLayout(left, top, right, bottom);
        const p = CollectionViewBase.plugins[this.layoutStyle];
        if (p && p.onLayout) {
            p.onLayout(this, left, top, right, bottom);
        }
        this.plugins.forEach((k) => {
            const p = CollectionViewBase.plugins[k];
            p.onLayout && p.onLayout(this, left, top, right, bottom);
        });
    }
    @profile
    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        const lastLayoutKey = this._lastLayoutKey;
        this.updateInnerSize();

        if (lastLayoutKey !== this._lastLayoutKey) {
            //we need to refresh visible cells so that they measure to the new size
            // for some reason it gets animated even with setSupportsChangeAnimations(false)
            // so we clear until it is done
            const nativeView = this.nativeViewProtected;
            const animator = nativeView.getItemAnimator();
            nativeView.setItemAnimator(null);
            this.refreshVisibleItems();
            setTimeout(() => {
                nativeView.setItemAnimator(animator);
            }, 0);
        }
        const p = CollectionViewBase.plugins[this.layoutStyle];
        if (p && p.onMeasure) {
            p.onMeasure(this, widthMeasureSpec, heightMeasureSpec);
        }
        this.plugins.forEach((k) => {
            const p = CollectionViewBase.plugins[k];
            p.onMeasure && p.onMeasure(this, widthMeasureSpec, heightMeasureSpec);
        });
    }
    public onSourceCollectionChanged(event: ChangedData<any>) {
        if (!this._listViewAdapter || this._dataUpdatesSuspended) {
            return;
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged', event.action, event.index, event.addedCount, event.removed, event.removed && event.removed.length);
        }
        switch (event.action) {
            case ChangeType.Delete: {
                this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                return;
            }
            case ChangeType.Add: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeInserted(event.index, event.addedCount);
                }
                // Reload the items to avoid duplicate Load on Demand indicators:
                return;
            }
            case ChangeType.Update: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeChanged(event.index, event.addedCount);
                }
                return;
            }
            case ChangeType.Splice: {
                const added = event.addedCount;
                const removed = (event.removed && event.removed.length) || 0;
                if (added > 0 && added === removed) {
                    // notifyItemRangeChanged wont create a fade effect
                    if (!this.animateItemUpdate) {
                        this._listViewAdapter.notifyItemRangeChanged(event.index, added);
                    } else {
                        this._listViewAdapter.notifyItemRangeRemoved(event.index, added);
                        this._listViewAdapter.notifyItemRangeInserted(event.index, added);
                    }
                } else {
                    if (!this.animateItemUpdate) {
                        if (added > removed) {
                            if (removed > 0) {
                                this._listViewAdapter.notifyItemRangeChanged(event.index, removed);
                            }
                            this._listViewAdapter.notifyItemRangeInserted(event.index + removed, added - removed);
                        } else {
                            if (added > 0) {
                                this._listViewAdapter.notifyItemRangeChanged(event.index, added);
                            }
                            this._listViewAdapter.notifyItemRangeRemoved(event.index + added, removed - added);
                        }
                    } else {
                        if (event.removed && event.removed.length > 0) {
                            this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                        }
                        if (event.addedCount > 0) {
                            this._listViewAdapter.notifyItemRangeInserted(event.index, event.addedCount);
                        }
                    }
                }
                return;
            }
        }
        this._listViewAdapter.notifyDataSetChanged();
    }

    eachChild(callback: (child: ViewBase) => boolean) {
        // used for css updates (like theme change)
        this.enumerateViewHolders((v) => {
            const view = v.view;
            if (view) {
                if (view.parent instanceof CollectionView) {
                    callback(view);
                } else {
                    // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                    if (view.parent) {
                        callback(view.parent);
                    }
                }
            }
        });
    }

    async eachChildAsync(callback) {
        return this.enumerateViewHoldersAsync(async (v) => {
            const view = v.view;
            if (view) {
                if (view.parent instanceof CollectionView) {
                    await callback(view);
                } else {
                    // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                    if (view.parent) {
                        await callback(view.parent);
                    }
                }
            }
        });
    }
    refreshVisibleItems() {
        const view = this.nativeViewProtected;
        if (!view) {
            return;
        }
        const layoutManager = this.layoutManager as androidx.recyclerview.widget.LinearLayoutManager;
        if (layoutManager['findFirstVisibleItemPosition']) {
            const first = layoutManager.findFirstVisibleItemPosition();
            const last = layoutManager.findLastVisibleItemPosition();
            this._listViewAdapter.notifyItemRangeChanged(first, last + 1);
        } else {
            const ids = Array.from(this.bindedViewHolders).sort((a, b) => a - b);
            this._listViewAdapter.notifyItemRangeChanged(ids[0], ids[ids.length - 1] - ids[0] + 1);
        }
    }
    public isItemAtIndexVisible(index: number): boolean {
        const view = this.nativeViewProtected;
        if (!view) {
            return false;
        }
        const layoutManager = this.layoutManager as androidx.recyclerview.widget.LinearLayoutManager;
        if (layoutManager['findFirstVisibleItemPosition']) {
            const first = layoutManager.findFirstVisibleItemPosition();
            const last = layoutManager.findLastVisibleItemPosition();
            return index >= first && index <= last;
        }
        return false;
    }
    public findFirstVisibleItemIndex() {
        const view = this.nativeViewProtected;
        if (!view) {
            return -1;
        }
        const layoutManager = this.layoutManager as androidx.recyclerview.widget.LinearLayoutManager;
        if (layoutManager['findFirstVisibleItemPosition']) {
            return layoutManager.findFirstVisibleItemPosition();
        }
        return -1;
    }
    public findLastVisibleItemIndex() {
        const view = this.nativeViewProtected;
        if (!view) {
            return -1;
        }
        const layoutManager = this.layoutManager as androidx.recyclerview.widget.LinearLayoutManager;
        if (layoutManager['findLastVisibleItemPosition']) {
            return layoutManager.findLastVisibleItemPosition();
        }
        return -1;
    }

    _layedOut = false;
    @profile
    public refresh(forceRefresh = false, updateSpanCountRequestsLayout = false) {
        if (this.mInPropertiesSet) {
            this.mShouldRefresh = true;
            return;
        }
        this.mShouldRefresh = false;
        const view = this.nativeViewProtected;
        if (!view) {
            return;
        }
        // seems like we refresh sooner
        // not sure why it was needed before and not now.
        if (!forceRefresh && (!this.isLoaded || !this.nativeView)) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        this._lastLayoutKey = this._innerWidth + '_' + this._innerHeight;
        let adapter = this._listViewAdapter;
        if (!adapter) {
            adapter = this._listViewAdapter = this.createComposedAdapter(view);
            adapter.setHasStableIds(!!this._itemIdGenerator);
            view.setAdapter(adapter);
        } else if (!view.getAdapter()) {
            view.setAdapter(adapter);
        }
        this.updateSpanCount(updateSpanCountRequestsLayout);
        adapter.notifyDataSetChanged();
        this.notify({ eventName: CollectionViewBase.dataPopulatedEvent });
    }

    //@ts-ignore
    get scrollOffset() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / Utils.layout.getDisplayDensity();
    }
    get verticalOffsetX() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return view.computeHorizontalScrollOffset() / Utils.layout.getDisplayDensity();
    }
    get verticalOffsetY() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return view.computeVerticalScrollOffset() / Utils.layout.getDisplayDensity();
    }
    public scrollToIndex(index: number, animated: boolean = true, snap: SnapPosition = SnapPosition.START) {
        const view = this.nativeViewProtected;
        if (!view) {
            return;
        }
        if (animated) {
            view.smoothScrollToPosition(index, snap);
        } else {
            view.scrollToPosition(index);
        }
    }

    scrollToOffset(offSetValue) {
        const view = this.nativeViewProtected;
        if (view && this.isScrollEnabled) {
            if (this.orientation === 'horizontal') {
                view.scrollBy(offSetValue, 0);
            } else {
                view.scrollBy(0, offSetValue);
            }
        }
    }

    @profile
    private _setPadding(newPadding: { top?: number; right?: number; bottom?: number; left?: number }) {
        const nativeView = this.nativeViewProtected;
        const padding = {
            top: nativeView.getPaddingTop(),
            right: nativeView.getPaddingRight(),
            bottom: nativeView.getPaddingBottom(),
            left: nativeView.getPaddingLeft()
        };
        // tslint:disable-next-line:prefer-object-spread
        const newValue = Object.assign(padding, newPadding);
        nativeView.setClipToPadding(false);
        nativeView.setPadding(newValue.left, newValue.top, newValue.right, newValue.bottom);
        this.updateInnerSize();
    }

    @profile
    private createComposedAdapter(recyclerView: CollectionViewRecyclerView) {
        const adapter = new com.nativescript.collectionview.Adapter();
        adapter.adapterInterface = new com.nativescript.collectionview.AdapterInterface({
            getItemId: this.getItemId.bind(this),
            getItemViewType: this.getItemViewType.bind(this),
            getItemCount: this.getItemCount.bind(this),
            onCreateViewHolder: this.onCreateViewHolder.bind(this),
            onBindViewHolder: this.onBindViewHolder.bind(this),
            onViewRecycled: this.onViewRecycled.bind(this)
        });
        // const composedAdapter = new com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedAdapter();
        // composedAdapter.addAdapter(new CollectionViewAdapter(new WeakRef(this)));
        return adapter;
    }

    public getItemCount() {
        return this.items ? this.items.length : 0;
    }

    public getItem(i: number) {
        if (this.items && i < this.items.length) {
            return this.getItemAtIndex(i);
        }
        return null;
    }

    public getItemId(i: number) {
        let id = -1;
        if (this._itemIdGenerator && this.items) {
            const item = this.getItemAtIndex(i);
            id = this._itemIdGenerator(item, i, this.items);
        }
        return long(id);
    }
    onItemIdGeneratorChanged(oldValue, newValue) {
        super.onItemIdGeneratorChanged(oldValue, newValue);
        if (this._listViewAdapter) {
            this._listViewAdapter.setHasStableIds(!!newValue);
        }
    }

    @profile
    public clearTemplateTypes() {
        this._currentNativeItemType = 0;
        this.templateTypeNumberString.clear();
        this.templateStringTypeNumber.clear();
    }

    @profile
    public getItemViewType(position: number) {
        let selectorType: string = 'default';
        if (this._itemTemplateSelector) {
            const selector = this._itemTemplateSelector;
            const dataItem = this.getItemAtIndex(position);
            if (dataItem) {
                selectorType = selector.call(this, dataItem, position, this.items);
            }
        }
        return this.templateKeyToNativeItem(selectorType);
        // if (!this.templateTypeNumberString.has(selectorType)) {
        //     resultType = this._currentNativeItemType;
        //     this.templateTypeNumberString.set(selectorType, resultType);
        //     this.templateStringTypeNumber.set(resultType, selectorType);
        //     this._currentNativeItemType++;
        // } else {
        //     resultType = this.templateTypeNumberString.get(selectorType);
        // }
        // return resultType;
    }
    @profile
    public templateKeyToNativeItem(key: string): number {
        if (!this.templateTypeNumberString) {
            this.templateTypeNumberString = new Map<string, number>();
            this._currentNativeItemType = 0;
            this._itemTemplatesInternal.forEach((v, i) => {
                this.templateTypeNumberString.set(v.key, this._currentNativeItemType);
                this.templateStringTypeNumber.set(this._currentNativeItemType, v.key);
                this.setNativePoolSize(v.key, this._currentNativeItemType);
                this._currentNativeItemType++;
            });
            this._currentNativeItemType = Math.max(this._itemTemplatesInternal.size, 100);
            // templates will be numbered 0,1,2,3... for named templates
            // default/unnamed templates will be numbered 100, 101, 102, 103...
        }
        if (!this.templateTypeNumberString.has(key)) {
            this.templateTypeNumberString.set(key, this._currentNativeItemType);
            this.templateStringTypeNumber.set(this._currentNativeItemType, key);
            this.setNativePoolSize(key, this._currentNativeItemType);
            this._currentNativeItemType++;
        }
        return this.templateTypeNumberString.get(key);
    }
    // public nativeItemToTemplateKey(item: number): string {
    //     let result: string;
    //     this.templateTypeNumberString?.forEach((value, key, map) => {
    //         if (value === item) {
    //             result = key;
    //         }
    //     }, this);

    //     return result;
    // }

    @profile
    disposeViewHolderViews() {
        this.enumerateViewHolders((v) => {
            const view = v.view;
            if (view) {
                this.notifyForItemAtIndex(CollectionViewBase.itemDisposingEvent, view, v.getAdapterPosition(), view.bindingContext, v);
                if (view.isLoaded) {
                    view.callUnloaded();
                }
                view._isAddedToNativeVisualTree = false;
                view._tearDownUI();
            }
            v.view = null;
            v.clickListener = null;
        });
        this._viewHolders = new Set();
    }

    getKeyByValue(viewType: number) {
        return this.templateStringTypeNumber.get(viewType);
    }

    @profile
    public onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
        const start = Date.now();
        let view: View = this.getViewForViewType(ListViewViewTypes.ItemView, this.getKeyByValue(viewType));
        const isNonSync = view === undefined;
        // dont create unecessary StackLayout if template.createView returns. Will happend when not using Vue or angular
        if (isNonSync || view instanceof ProxyViewContainer) {
            const parentView = new ContentView();
            parentView.id = 'collectionViewHolder';
            view = parentView;
        }

        if (this.allowCssPropagation) {
            this._addView(view);
        } else {
            view.parent = this;
            view._setupAsRootView(this._context);
            view._isAddedToNativeVisualTree = true;
            view.callLoaded();
        }
        if (!CollectionViewCellHolder) {
            CollectionViewCellHolder = com.nativescript.collectionview.CollectionViewCellHolder as any;
        }

        const holder = new CollectionViewCellHolder(view.nativeView);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const collectionView = this;
        const clickListener = new android.view.View.OnClickListener({
            onClick: () => {
                const position = holder.getAdapterPosition();
                collectionView.notify<CollectionViewItemEventData>({
                    eventName: CollectionViewBase.itemTapEvent,
                    object: collectionView,
                    index: position,
                    item: collectionView.getItem(position),
                    view: holder.view
                });
            }
        });
        view.nativeView.setOnClickListener(clickListener);
        holder.clickListener = clickListener;
        holder.view = view;
        const layoutParams = this._getViewLayoutParams();
        view.nativeView.setLayoutParams(layoutParams);
        if (isNonSync) {
            holder['defaultItemView'] = true;
        }
        this._viewHolders.add(holder);

        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onCreateViewHolder', this, this.nativeView, viewType, this.getKeyByValue(viewType), holder, Date.now() - start, 'ms');
        }
        return holder;
    }

    @profile
    notifyForItemAtIndex(eventName: string, view: View, index: number, bindingContext?, native?: any) {
        const args = { eventName, object: this, index, view, android: native, bindingContext };
        this.notify(args);
        return args as any;
    }

    bindedViewHolders: Set<number> = new Set();
    @profile
    public onBindViewHolder(holder: CollectionViewCellHolder, position: number) {
        const start = Date.now();
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder', this, this.nativeView, position, holder, holder.view);
        }
        let view = holder.view;
        const isNonSync = holder['defaultItemView'] === true;
        view = isNonSync ? (view as ContentView).content : view;
        const bindingContext = this._prepareItem(view, position);
        if (holder['position'] !== undefined) {
            this.bindedViewHolders.delete(holder['position']);
        }
        holder['position'] = position;
        this.bindedViewHolders.add(holder['position']);

        const args = this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, position, bindingContext, holder);

        if (isNonSync && args.view !== view) {
            view = args.view;

            // Set binding context before adding view to parent to ensure it's available during view loaded event
            view.bindingContext = bindingContext;

            // the view has been changed on the event handler
            (holder.view as ContentView).content = view;
        } else {
            view.bindingContext = bindingContext;
        }
        view.notify({ eventName: CollectionViewBase.bindedEvent });
        let width = this._effectiveColWidth;
        let height = this.getEffectiveRowHeightForIndex(position);
        if (this._getSpanSize) {
            const spanSize = this._getSpanSize(bindingContext, position);
            const horizontal = this.isHorizontal();
            if (horizontal) {
                width *= spanSize;
            } else {
                height *= spanSize;
            }
        }
        if (width || !view.width) {
            view.width = Utils.layout.toDeviceIndependentPixels(width);
        }
        if (height || !view.height) {
            view.height = Utils.layout.toDeviceIndependentPixels(height);
        }

        if (this.hasListeners(CollectionViewBase.displayItemEvent)) {
            this.notify<CollectionViewItemDisplayEventData>({
                eventName: CollectionViewBase.displayItemEvent,
                index: position,
                object: this
            });
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder done ', position, Date.now() - start, 'ms');
        }
    }

    onViewRecycled(holder) {
        delete this.bindedViewHolders[holder['position']];
        holder['position'] = undefined;
    }
}
interface CollectionViewCellHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new (androidView: android.view.View): CollectionViewCellHolder;
    view: View;
    clickListener: android.view.View.OnClickListener;
}

let CollectionViewCellHolder: CollectionViewCellHolder;

export interface CollectionViewRecyclerView extends com.nativescript.collectionview.RecyclerView {
    // tslint:disable-next-line:no-misused-new
    new (context: any): CollectionViewRecyclerView;
}

let CollectionViewRecyclerView: CollectionViewRecyclerView;
itemViewCacheSizeProperty.register(CollectionViewBase);
extraLayoutSpaceProperty.register(CollectionViewBase);
nestedScrollingEnabledProperty.register(CollectionViewBase);
