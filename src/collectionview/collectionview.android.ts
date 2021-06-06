/* eslint-disable no-redeclare */
import {
    ChangeType,
    ChangedData,
    ContentView,
    CoreTypes,
    FlexboxLayout,
    Property,
    ProxyViewContainer,
    Trace,
    View,
    ViewBase,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty,
    profile
} from '@nativescript/core';
import { layout } from '@nativescript/core/utils/utils';
import {
    CollectionViewItemDisplayEventData,
    CollectionViewItemEventData,
    Orientation,
    reorderLongPressEnabledProperty,
    reorderingEnabledProperty,
    reverseLayoutProperty,
    scrollBarIndicatorVisibleProperty
} from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isScrollEnabledProperty, orientationProperty } from './collectionview-common';

export * from './collectionview-common';

declare module '@nativescript/core/ui/core/view' {
    interface View {
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
        if (this.startPosition === -1) {
            this.startPosition = startPosition;
        }
        this.endPosition = endPosition;
        const owner = this.owner && this.owner.get();
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
            const owner = this.owner && this.owner.get();

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
        const owner = this._owner && this._owner.get();
        if (owner) {
            owner.onReorderLongPress(motionEvent);
        }
    }
}

// @NativeClass
// class PreCachingGridLayoutManager extends com.nativescript.collectionview.PreCachingGridLayoutManager {
//     owner: WeakRef<CollectionView>;
//     constructor(context, span) {
//         super(context, span);
//         return global.__native(this);
//     }
//     onLayoutCompleted(state) {
//         super.onLayoutCompleted(state);
//         const owner = this.owner  && this.owner.get();
//         if (owner) {
//             owner.notify({
//                 eventName: 'layoutCompleted',
//                 object: owner,
//             });
//         }
//     }
// }

declare module '@nativescript/core/ui/core/view' {
    interface View {
        layoutChangeListenerIsSet: boolean;
        layoutChangeListener: android.view.View.OnLayoutChangeListener;
        _raiseLayoutChangedEvent();
    }
}

// Snapshot friendly GridViewAdapter
interface CellViewHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<View>, collectionView: WeakRef<CollectionView>): CellViewHolder;
}
// eslint-disable-next-line no-redeclare
let CellViewHolder: CellViewHolder;

let LayoutParams: typeof android.view.ViewGroup.LayoutParams;

// function initCellViewHolder() {
//     if (CellViewHolder) {
//         return;
//     }
//     @Interfaces([android.view.View.OnClickListener])
//     class CellViewHolderImpl extends com.nativescript.collectionview.CollectionViewCellHolder implements android.view.View.OnClickListener {
//         constructor(private owner: WeakRef<View>, private collectionView: WeakRef<CollectionView>) {
//             super(owner.get().android);

//             const nativeThis = global.__native(this);
//             const nativeView = owner.get().android as android.view.View;
//             nativeView.setOnClickListener(nativeThis);

//             return nativeThis;
//         }

//         get view(): View {
//             return this.owner ? this.owner.get() : null;
//         }

//         public onClick(v: android.view.View) {
//             const collectionView = this.collectionView.get();
//             const position = this.getAdapterPosition();
//             collectionView.notify<CollectionViewItemEventData>({
//                 eventName: CollectionViewBase.itemTapEvent,
//                 object: collectionView,
//                 index: position,
//                 item: collectionView.getItem(position),
//                 view: this.view,
//             });
//         }
//     }
//     CellViewHolder = CellViewHolderImpl as any;
// }
const extraLayoutSpaceProperty = new Property<CollectionViewBase, number>({
    name: 'extraLayoutSpace'
});
const itemViewCacheSizeProperty = new Property<CollectionViewBase, number>({
    name: 'itemViewCacheSize'
});
export class CollectionView extends CollectionViewBase {
    public static DEFAULT_TEMPLATE_VIEW_TYPE = 0;
    public static CUSTOM_TEMPLATE_ITEM_TYPE = 1;
    public nativeViewProtected: CollectionViewRecyclerView & {
        scrollListener: com.nativescript.collectionview.OnScrollListener;
        layoutManager: androidx.recyclerview.widget.RecyclerView.LayoutManager;
        owner?: WeakRef<CollectionView>;
    };

    private templateTypeNumberString = new Map<string, number>();
    private templateStringTypeNumber = new Map<number, string>();
    private _currentNativeItemType = 0;

    // used to store viewHolder and make sure they are not garbaged
    private _viewHolders = new Array<CollectionViewCellHolder>();

    // used to "destroy" cells when possible
    private _viewHolderChildren = new Array();

    private _scrollOrLoadMoreChangeCount = 0;
    private _nScrollListener: com.nativescript.collectionview.OnScrollListener.Listener;
    scrolling = false;

    private _hlayoutParams: android.view.ViewGroup.LayoutParams;
    private _vlayoutParams: android.view.ViewGroup.LayoutParams;
    private _lastLayoutKey: string;

    private _listViewAdapter: com.nativescript.collectionview.Adapter;

    // reordering
    private _simpleItemTouchCallback: SimpleCallback;
    private _itemTouchHelper: androidx.recyclerview.widget.ItemTouchHelper;

    public animateItemUpdate = false;

    @profile
    public createNativeView() {
        // storing the class in a property for reuse in the future cause a materializing which is pretty slow!
        if (!CollectionViewRecyclerView) {
            CollectionViewRecyclerView = com.nativescript.collectionview.RecyclerView as any;
        }
        const recyclerView = (CollectionViewRecyclerView as any).createRecyclerView(this._context);
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
        this.setOnLayoutChangeListener();
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        nativeView.owner = new WeakRef(this);
        // nativeView.sizeChangedListener = new com.nativescript.collectionview.SizeChangedListener({
        //     onSizeChanged: (w, h, oldW, oldH) => this.onSizeChanged(w, h),
        // });

        // const orientation = this._getLayoutManagarOrientation();

        // initGridLayoutManager();
        let layoutManager: androidx.recyclerview.widget.RecyclerView.LayoutManager;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layoutManager = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        } else {
            layoutManager = new com.nativescript.collectionview.PreCachingGridLayoutManager(this._context, 1);
            // layoutManager = new PreCachingGridLayoutManager(this._context, 1);
            // (layoutManager as any).owner = new WeakRef(this);
        }
        // this.spanSize
        nativeView.setLayoutManager(layoutManager);
        nativeView.layoutManager = layoutManager;
        this.spanSize = this._getSpanSize;

        const animator = new com.h6ah4i.android.widget.advrecyclerview.animator.RefactoredDefaultItemAnimator();

        // Change animations are enabled by default since support-v7-recyclerview v22.
        // Need to disable them when using animation indicator.
        animator.setSupportsChangeAnimations(false);

        nativeView.setItemAnimator(animator);
        this.refresh();

        // colWidthProperty.coerce(this);
        // rowHeightProperty.coerce(this);
    }
    _getSpanSize: (position: number) => number;
    public getViewForItemAtIndex(index: number): View {
        let result: View;
        this._viewHolders.some(function (cellItemView, key) {
            if (cellItemView && cellItemView.getAdapterPosition() === index) {
                result = cellItemView.view;
                return true;
            }
            return false;
        });

        return result;
    }
    //@ts-ignore
    set spanSize(inter: (position: number) => number) {
        if (!(typeof inter === 'function')) {
            return;
        }
        this._getSpanSize = inter;
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setSpanSizeLookup']) {
            layoutManager['setSpanSizeLookup'](
                inter
                    ? new com.nativescript.collectionview.SpanSizeLookup(
                        new com.nativescript.collectionview.SpanSizeLookup.Interface({
                            getSpanSize: inter
                        })
                    )
                    : null
            );
        }
    }
    get spanSize() {
        return this._getSpanSize;
    }
    onLoaded() {
        super.onLoaded();
        this.attachScrollListener();
    }

    private attachScrollListener() {
        if (this._scrollOrLoadMoreChangeCount > 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (!nativeView.scrollListener) {
                this._nScrollListener = new com.nativescript.collectionview.OnScrollListener.Listener({
                    onScrollStateChanged: this.onScrollStateChanged.bind(this),
                    onScrolled: this.onScrolled.bind(this)
                });
                const scrollListener = new com.nativescript.collectionview.OnScrollListener(this._nScrollListener);
                nativeView.addOnScrollListener(scrollListener);
                nativeView.scrollListener = scrollListener;
            }
        }
    }

    private dettachScrollListener() {
        if (this._scrollOrLoadMoreChangeCount === 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (nativeView.scrollListener) {
                this.nativeView.removeOnScrollListener(nativeView.scrollListener);
                nativeView.scrollListener = null;
                this._nScrollListener = null;
            }
        }
    }

    public onScrolled(view: androidx.recyclerview.widget.RecyclerView, dx: number, dy: number) {
        if (!this || !this.scrolling) {
            return;
        }

        if (this.hasListeners(CollectionViewBase.scrollEvent)) {
            this.notify({
                object: this,
                eventName: CollectionViewBase.scrollEvent,
                scrollOffset: (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / layout.getDisplayDensity()
            });
        }

        if (this.hasListeners(CollectionViewBase.loadMoreItemsEvent) && this.items) {
            const layoutManager = view.getLayoutManager();
            if (layoutManager['findLastCompletelyVisibleItemPosition']) {
                const lastVisibleItemPos = layoutManager['findLastCompletelyVisibleItemPosition']();
                const loadMoreItemIndex = this.items.length - this.loadMoreThreshold;
                if (lastVisibleItemPos === loadMoreItemIndex) {
                    this.notify({
                        eventName: CollectionViewBase.loadMoreItemsEvent,
                        object: this
                    });
                }
            }
        }
    }

    public onScrollStateChanged(view: androidx.recyclerview.widget.RecyclerView, newState: number) {
        if (this.scrolling && newState === 0) {
            // SCROLL_STATE_IDLE
            this.scrolling = false;

            if (this.hasListeners(CollectionViewBase.scrollEndEvent)) {
                this.notify({
                    object: this,
                    eventName: CollectionViewBase.scrollEndEvent,
                    scrollOffset: (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / layout.getDisplayDensity()
                });
            }
        } else if (!this.scrolling && newState === 1) {
            //SCROLL_STATE_DRAGGING
            this.scrolling = true;
        }
    }

    public addEventListener(arg: string, callback: any, thisArg?: any) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount++;
            this.attachScrollListener();
        }
    }

    public removeEventListener(arg: string, callback: any, thisArg?: any) {
        super.removeEventListener(arg, callback, thisArg);

        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount--;
            this.dettachScrollListener();
        }
    }

    public disposeNativeView() {
        // clear the cache
        // this.eachChildView((view) => {
        //     view.parent._removeView(view);
        //     return true;
        // });
        // this._realizedItems.clear();

        const nativeView = this.nativeView;
        if (nativeView.scrollListener) {
            this.nativeView.removeOnScrollListener(nativeView.scrollListener);
            nativeView.scrollListener = null;
            this._nScrollListener = null;
        }
        nativeView.layoutManager = null;
        this._listViewAdapter = null;
        this._itemTouchHelper = null;
        this._simpleItemTouchCallback = null;
        this.disposeViewHolderViews();
        this._hlayoutParams = null;
        this._vlayoutParams = null;
        this.clearTemplateTypes();

        super.disposeNativeView();
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
    public startDragging(index: number) {
        if (this.reorderEnabled && this._itemTouchHelper) {
            let viewHolder: CollectionViewCellHolder;
            this._viewHolders.some((v) => {
                if (v.getAdapterPosition() === index) {
                    viewHolder = v;
                    return true;
                }
                return false;
            });
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

    onItemViewLoaderChanged() {
        if (this.itemViewLoader) {
            this.refresh();
        }
    }
    onItemTemplateSelectorChanged(oldValue, newValue) {
        super.onItemTemplateSelectorChanged(oldValue, newValue);
        this.clearTemplateTypes();
        this.refresh();
    }

    onItemTemplateChanged(oldValue, newValue) {
        super.onItemTemplateChanged(oldValue, newValue); // TODO: update current template with the new one
        this.refresh();
    }
    onItemTemplatesChanged(oldValue, newValue) {
        super.onItemTemplatesChanged(oldValue, newValue); // TODO: update current template with the new one
        this.refresh();
    }
    // public eachChildView(callback: (child: View) => boolean): void {
    //     this._realizedItems.forEach((view, key) => {
    //         callback(view);
    //     });
    // }

    private setOnLayoutChangeListener() {
        if (this.nativeViewProtected) {
            const owner = this;
            this.layoutChangeListenerIsSet = true;
            this.layoutChangeListener =
                this.layoutChangeListener ||
                new android.view.View.OnLayoutChangeListener({
                    onLayoutChange(v: android.view.View, left: number, top: number, right: number, bottom: number, oldLeft: number, oldTop: number, oldRight: number, oldBottom: number): void {
                        if (left !== oldLeft || top !== oldTop || right !== oldRight || bottom !== oldBottom) {
                            owner.onLayout(left, top, right, bottom);
                            if (owner.hasListeners(View.layoutChangedEvent)) {
                                owner._raiseLayoutChangedEvent();
                            }
                        }
                    }
                });

            this.nativeViewProtected.addOnLayoutChangeListener(this.layoutChangeListener);
        }
    }
    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);
        const p = CollectionViewBase.plugins[this.layoutStyle];
        if (p && p.onLayout) {
            p.onLayout(this, left, top, right, bottom);
        }
        this.plugins.forEach((k) => {
            const p = CollectionViewBase.plugins[k];
            p.onLayout && p.onLayout(this, left, top, right, bottom);
        });
        if (this.layoutManager && this.layoutManager['setSpanCount']) {
            this.layoutManager['setSpanCount'](this.computeSpanCount());
        }
        // there is no need to call refresh if it was triggered before with same size.
        // this refresh is just to handle size change
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._lastLayoutKey !== layoutKey) {
            setTimeout(() => this.refresh(), 0);
        }
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
        this._viewHolders.forEach(({ view }, nativeView) => {
            if (view.parent instanceof CollectionView) {
                callback(view);
            } else {
                // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                if (view.parent) {
                    callback(view.parent);
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
            this._listViewAdapter.notifyItemRangeChanged(first, last - first + 1);
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

    @profile
    public refresh() {
        if (!this.nativeViewProtected) {
            return;
        }
        const view = this.nativeViewProtected;
        if (!this.isLoaded) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        this._lastLayoutKey = this._innerWidth + '_' + this._innerHeight;
        let adapter = this._listViewAdapter;
        if (!adapter) {
            adapter = this._listViewAdapter = this.createComposedAdapter(this.nativeViewProtected);
            adapter.setHasStableIds(!!this._itemIdGenerator);
            view.setAdapter(adapter);
        } else if (!view.getAdapter()) {
            view.setAdapter(adapter);
        }

        const layoutManager = view.getLayoutManager();
        if (layoutManager['setSpanCount']) {
            layoutManager['setSpanCount'](this.computeSpanCount());
        }
        adapter.notifyDataSetChanged();
        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this
        };
        this.notify(args);
    }

    //@ts-ignore
    get scrollOffset() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / layout.getDisplayDensity();
    }
    get verticalOffsetX() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return view.computeHorizontalScrollOffset() / layout.getDisplayDensity();
    }
    get verticalOffsetY() {
        const view = this.nativeViewProtected;
        if (!view) {
            return 0;
        }
        return view.computeVerticalScrollOffset() / layout.getDisplayDensity();
    }
    public scrollToIndex(index: number, animated: boolean = true) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (animated) {
            this.nativeViewProtected.smoothScrollToPosition(index);
        } else {
            this.nativeViewProtected.scrollToPosition(index);
        }
    }

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
        nativeView.setPadding(newValue.left, newValue.top, newValue.right, newValue.bottom);
    }

    private createComposedAdapter(recyclerView: CollectionViewRecyclerView) {
        const adapter = new com.nativescript.collectionview.Adapter();
        adapter.adapterInterface = new com.nativescript.collectionview.AdapterInterface({
            getItemId: this.getItemId.bind(this),
            getItemViewType: this.getItemViewType.bind(this),
            getItemCount: this.getItemCount.bind(this),
            onCreateViewHolder: this.onCreateViewHolder.bind(this),
            onBindViewHolder: this.onBindViewHolder.bind(this)
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
        let id = i;
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

    public clearTemplateTypes() {
        this._currentNativeItemType = 0;
        this.templateTypeNumberString.clear();
        this.templateStringTypeNumber.clear();
    }

    public getItemViewType(position: number) {
        let resultType = 0;
        let selectorType: string = 'default';
        if (this._itemTemplateSelector) {
            const selector = this._itemTemplateSelector;
            const dataItem = this.getItemAtIndex(position);
            if (dataItem) {
                selectorType = selector(dataItem, position, this.items);
            }
        }
        if (!this.templateTypeNumberString.has(selectorType)) {
            resultType = this._currentNativeItemType;
            this.templateTypeNumberString.set(selectorType, resultType);
            this.templateStringTypeNumber.set(resultType, selectorType);
            this._currentNativeItemType++;
        } else {
            resultType = this.templateTypeNumberString.get(selectorType);
        }
        return resultType;
    }

    disposeViewHolderViews() {
        this._viewHolders.forEach((v) => {
            v.view = null;
            v.clickListener = null;
        });
        this._viewHolders = new Array();
        this._viewHolderChildren.forEach((v) => this._removeViewCore(v));
        this._viewHolderChildren = new Array();
    }
    getKeyByValue(viewType: number) {
        return this.templateStringTypeNumber.get(viewType);
    }

    @profile
    public onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
        let view: View = this.getViewForViewType(ListViewViewTypes.ItemView, this.getKeyByValue(viewType));
        const isNonSync = view === undefined;
        // dont create unecessary StackLayout if template.createView returns. Will happend when not using Vue or angular
        if (isNonSync || view instanceof ProxyViewContainer) {
            const parentView = new ContentView();
            parentView.id = 'collectionViewHolder';
            view = parentView;
        }
        this._viewHolderChildren.push(view);
        this._addView(view);
        if (!CollectionViewCellHolder) {
            CollectionViewCellHolder = com.nativescript.collectionview.CollectionViewCellHolder as any;
        }

        const holder = new CollectionViewCellHolder(view.nativeView);

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
        this._viewHolders.push(holder);

        return holder;
    }

    @profile
    public onBindViewHolder(holder: CollectionViewCellHolder, position: number) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder', position);
        }
        let view = holder.view;
        const bindingContext = this._prepareItem(view, position);
        const isNonSync = holder['defaultItemView'] === true;

        view = isNonSync ? (view as ContentView).content : view;

        const args = {
            eventName: CollectionViewBase.itemLoadingEvent,
            index: position,
            object: this,
            view,
            bindingContext,
            android: holder
        };
        this.notify(args);

        if (isNonSync && args.view !== view) {
            view = args.view;
            // the view has been changed on the event handler
            (holder.view as ContentView).content = args.view;
        }
        let width = this._effectiveColWidth;
        let height = this._effectiveRowHeight;
        if (this._getSpanSize) {
            const spanSize = this._getSpanSize(position);
            const horizontal = this.isHorizontal();
            if (horizontal) {
                height *= spanSize;
            } else {
                width *= spanSize;
            }
        }
        if (width || !view.width) {
            view.width = layout.toDeviceIndependentPixels(width);
        }
        if (height || !view.height) {
            view.height = layout.toDeviceIndependentPixels(height);
        }

        // if (this.hasListeners(CollectionViewBase.displayItemEvent) ) {
        //     this.notify<CollectionViewItemDisplayEventData>({
        //         eventName: CollectionViewBase.displayItemEvent,
        //         index:position,
        //         object: this,
        //     });
        // }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder done ', position);
        }
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
