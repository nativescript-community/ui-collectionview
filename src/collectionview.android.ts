import { ChangedData, ChangeType } from '@nativescript/core/data/observable-array';
import { profile } from '@nativescript/core/profiling';
import { isEnabled } from '@nativescript/core/trace';
import { Length, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty, View, Property } from '@nativescript/core/ui/core/view';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { ProxyViewContainer } from '@nativescript/core/ui/proxy-view-container';
import * as utils from '@nativescript/core/utils/utils';
import { Orientation, CollectionViewItemEventData } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, isScrollEnabledProperty, ListViewViewTypes, orientationProperty } from './collectionview-common';

export * from './collectionview-common';


// Snapshot friendly GridViewAdapter
interface CellViewHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new(owner: WeakRef<View>,  collectionView: WeakRef<CollectionView>): CellViewHolder;
}
let CellViewHolder: CellViewHolder;

function initCellViewHolder() {
    if (CellViewHolder) {
        return;
    }
    @Interfaces([android.view.View.OnClickListener])
    class CellViewHolderImpl extends com.nativescript.collectionview.CollectionViewCellHolder implements android.view.View.OnClickListener {
        constructor(private owner: WeakRef<View>, private collectionView: WeakRef<CollectionView>) {
            super(owner.get().android);

            const nativeThis = global.__native(this);
            const nativeView = owner.get().android as android.view.View;
            nativeView.setOnClickListener(nativeThis);

            return nativeThis;
        }

        get view(): View {
            return this.owner ? this.owner.get() : null;
        }

        public onClick(v: android.view.View) {
            const collectionView = this.collectionView.get();
            const position = this.getAdapterPosition();
            collectionView.notify<CollectionViewItemEventData>({
                eventName: CollectionViewBase.itemTapEvent,
                object: collectionView,
                index: position,
                item: collectionView.getItem(position),
                view: this.view
            });
        }

    }
    CellViewHolder = CellViewHolderImpl as any;
}
const extraLayoutSpaceProperty = new Property<CollectionViewBase, number>({
    name: 'extraLayoutSpace',
});
const itemViewCacheSizeProperty = new Property<CollectionViewBase, number>({
    name: 'itemViewCacheSize',
});
export class CollectionView extends CollectionViewBase {
    public static DEFAULT_TEMPLATE_VIEW_TYPE = 0;
    public static CUSTOM_TEMPLATE_ITEM_TYPE = 1;
    public nativeViewProtected: CollectionViewRecyclerView & {
        scrollListener: CollectionViewScrollListener;
        owner: WeakRef<CollectionView>;
        layoutManager: com.nativescript.collectionview.GridLayoutManager;
    };

    templateTypeNumberString = new Map<string, number>();
    templateStringTypeNumber = new Map<number, string>();
    _currentNativeItemType = 0;

    // used to store viewHolder and make sure they are not garbaged
    _viewHolders = new Array();

    // used to "destroy" cells when possible
    _viewHolderChildren = new Array();

    private _listViewAdapter: com.nativescript.collectionview.Adapter;

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
        super.initNativeView();

        const nativeView = this.nativeView;
        nativeView.owner = new WeakRef(this);

        const orientation = this._getLayoutManagarOrientation();

        // initGridLayoutManager();
        const layoutManager = new com.nativescript.collectionview.PreCachingGridLayoutManager(this._context, 1);
        nativeView.setLayoutManager(layoutManager);
        layoutManager.isScrollEnabled = this.isScrollEnabled;
        layoutManager.setOrientation(orientation);
        nativeView.layoutManager = layoutManager;

        // tslint:disable-next-line:no-unused-expression
        // new CollectionViewCellHolder(new android.widget.TextView(this._context));

        const animator = new com.h6ah4i.android.widget.advrecyclerview.animator.RefactoredDefaultItemAnimator();

        // Change animations are enabled by default since support-v7-recyclerview v22.
        // Need to disable them when using animation indicator.
        animator.setSupportsChangeAnimations(false);

        nativeView.setItemAnimator(animator);
        this.refresh();

        // colWidthProperty.coerce(this);
        // rowHeightProperty.coerce(this);
    }

    onLoaded() {
        super.onLoaded();
        this.attach();
    }

    _scrollOrLoadMoreChangeCount = 0;
    private attach() {
        if (this._scrollOrLoadMoreChangeCount > 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (!nativeView.scrollListener) {
                initCollectionViewScrollListener();
                const scrollListener = new CollectionViewScrollListener(new WeakRef(this));
                nativeView.addOnScrollListener(scrollListener);
                nativeView.scrollListener = scrollListener;
            }
        }
    }

    private dettach() {
        if (this._scrollOrLoadMoreChangeCount === 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (nativeView.scrollListener) {
                this.nativeView.removeOnScrollListener(nativeView.scrollListener);
                nativeView.scrollListener = null;
            }
        }
    }
    public addEventListener(arg: string, callback: any, thisArg?: any) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === CollectionViewBase.scrollEvent) {
            this._scrollOrLoadMoreChangeCount++;
            this.attach();
        }
    }

    public removeEventListener(arg: string, callback: any, thisArg?: any) {
        super.removeEventListener(arg, callback, thisArg);

        if (arg === CollectionViewBase.scrollEvent) {
            this._scrollOrLoadMoreChangeCount--;
            this.dettach();
        }
    }

    public disposeNativeView() {
        // clear the cache
        this.eachChildView((view) => {
            view.parent._removeView(view);
            return true;
        });
        // this._realizedItems.clear();

        const nativeView = this.nativeView;

        if (nativeView.scrollListener) {
            this.nativeView.removeOnScrollListener(nativeView.scrollListener);
            nativeView.scrollListener = null;
        }
        nativeView.layoutManager = null;

        super.disposeNativeView();
    }

    get android(): androidx.recyclerview.widget.RecyclerView {
        return this.nativeView;
    }
    get layoutManager(): com.nativescript.collectionview.PreCachingGridLayoutManager {
        return this.nativeView.getLayoutManager() as com.nativescript.collectionview.PreCachingGridLayoutManager;
    }
    _layoutParams: org.nativescript.widgets.CommonLayoutParams;
    _getViewLayoutParams() {
        if (!this._layoutParams) {
            const layoutParams = (this._layoutParams = new org.nativescript.widgets.CommonLayoutParams());
            // if (this.listViewLayout instanceof ListViewLinearLayout) {
            // if (this.listViewLayout.scrollDirection.toLowerCase() === listViewCommonModule.ListViewScrollDirection.Vertical.toLowerCase()) {
            layoutParams.width = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
            layoutParams.height = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
        }
        // }
        // else if (this.listViewLayout.scrollDirection.toLowerCase() === listViewCommonModule.ListViewScrollDirection.Horizontal.toLowerCase()) {
        //     layoutParams.width = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
        //     layoutParams.height = org.nativescript.widgets.CommonLayoutParams.MATCH_PARENT;
        // }
        // }
        return this._layoutParams;
    }
    //     private listViewItemHeights = new java.util.Hashtable<java.util.Integer, Integer>();
    //    private listViewItemWidth = new java.util.Hashtable<Integer, Integer>();
    //     getScroll() {
    //         const firstVisibleItem = this.layoutManager.findFirstVisibleItemPosition();

    //         const c = this.nativeViewProtected.getChildAt(0); //this is the first visible row
    //         let scrollX = -c.getLeft();
    //         let scrollY = -c.getTop();
    //         listViewItemHeights.put(firstVisibleItem, c.getHeight());
    //         listViewItemWidth.put(firstVisibleItem, c.getWidth());
    //         for (let i = 0; i < firstVisibleItem; ++i) {
    //             if (this.listViewItemWidth.get(i) != null) { // (this is a sanity check)
    //                 scrollX += this.listViewItemWidth.get(i); //add all heights of the views that are gone
    //             }
    //             if (this.listViewItemHeights.get(i) != null) { // (this is a sanity check)
    //                 scrollY += this.listViewItemHeights.get(i); //add all heights of the views that are gone
    //             }
    //         }
    //         return [scrollX, scrollY];
    //     }

    // get _childrenCount(): number {
    //     return this._realizedItems.size;
    // }

    public [paddingTopProperty.getDefault](): number {
        return (this.nativeView as android.view.View).getPaddingTop();
    }
    public [paddingTopProperty.setNative](value: Length) {
        this._setPadding({ top: this.effectivePaddingTop });
    }

    public [paddingRightProperty.getDefault](): number {
        return (this.nativeView as android.view.View).getPaddingRight();
    }
    public [paddingRightProperty.setNative](value: Length) {
        this._setPadding({ right: this.effectivePaddingRight });
    }

    public [paddingBottomProperty.getDefault](): number {
        return (this.nativeView as android.view.View).getPaddingBottom();
    }
    public [paddingBottomProperty.setNative](value: Length) {
        this._setPadding({ bottom: this.effectivePaddingBottom });
    }

    public [paddingLeftProperty.getDefault](): number {
        return (this.nativeView as android.view.View).getPaddingLeft();
    }
    public [paddingLeftProperty.setNative](value: Length) {
        this._setPadding({ left: this.effectivePaddingLeft });
    }

    public [orientationProperty.getDefault](): Orientation {
        const layoutManager = this.nativeView.getLayoutManager() as com.nativescript.collectionview.GridLayoutManager;
        if (layoutManager.getOrientation() === androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL) {
            return 'horizontal';
        }

        return 'vertical';
    }
    public [orientationProperty.setNative](value: Orientation) {
        const layoutManager = this.nativeView.getLayoutManager() as com.nativescript.collectionview.GridLayoutManager;
        if (this.isHorizontal()) {
            layoutManager.setOrientation(androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL);
        } else {
            layoutManager.setOrientation(androidx.recyclerview.widget.LinearLayoutManager.VERTICAL);
        }
    }
    isScrollEnabled = true;
    public [isScrollEnabledProperty.setNative](value: boolean) {
        this.isScrollEnabled = value;
        if (this.layoutManager) {
            this.layoutManager.isScrollEnabled = value;
        }
    }
    public [extraLayoutSpaceProperty.setNative](value: number) {
        this.layoutManager.setExtraLayoutSpace(value);
    }
    public [itemViewCacheSizeProperty.setNative](value: number) {
        this.nativeViewProtected.setItemViewCacheSize(value);
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

    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);
        if (this.nativeView) {
            this.layoutManager.setSpanCount(this.computeSpanCount());
        }
    }
    public onSourceCollectionChanged(event: ChangedData<any>) {
        if (!this._listViewAdapter) {
            return;
        }
        if (isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged', event.action, event.index, event.addedCount, event.removed);
        }
        switch (event.action) {
            case ChangeType.Delete: {
                this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                break;
            }
            case ChangeType.Add: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeChanged(event.index, event.addedCount);
                    return;
                }
                // Reload the items to avoid duplicate Load on Demand indicators:
                return;
            }
            case ChangeType.Update: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeChanged(event.index, event.addedCount);
                    return;
                }
                if (event.removed && event.removed.length > 0) {
                    this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                    return;
                }
                break;
            }
            case ChangeType.Splice: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeInserted(event.index, event.addedCount);
                }
                if (event.removed && event.removed.length > 0) {
                    this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                }
                return;
            }
        }
        this._listViewAdapter.notifyDataSetChanged();
    }
    public isHorizontal() {
        return this.orientation === 'horizontal';
    }

    private computeSpanCount() {
        let spanCount = 1;
        if (this.isHorizontal()) {
            if (this._effectiveRowHeight) {
                spanCount = Math.max(Math.floor(this._innerHeight / this._effectiveRowHeight), 1) || 1;
            }
        } else {
            if (this._effectiveColWidth) {
                spanCount = Math.max(Math.floor(this._innerWidth / this._effectiveColWidth), 1) || 1;
            }
        }
        return spanCount;
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
        let adapter = this._listViewAdapter;
        if (!adapter) {
            adapter = this._listViewAdapter = this.createComposedAdapter(this.nativeViewProtected);
            console.log('refresh setHasStableIds', !!this._itemIdGenerator);
            adapter.setHasStableIds(!!this._itemIdGenerator);
            view.setAdapter(adapter);
        } else if (!view.getAdapter()) {
            view.setAdapter(adapter);
        }

        // nativeView.adapter.owner = new WeakRef(this);

        const layoutManager = view.getLayoutManager() as com.nativescript.collectionview.GridLayoutManager;
        layoutManager.setSpanCount(this.computeSpanCount());
        adapter.notifyDataSetChanged();
        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this,
        };
        this.notify(args);
    }

    public scrollToIndex(index: number, animated: boolean = true) {
        if (animated) {
            this.nativeView.smoothScrollToPosition(index);
        } else {
            this.nativeView.scrollToPosition(index);
        }
    }

    private _setPadding(newPadding: { top?: number; right?: number; bottom?: number; left?: number }) {
        const nativeView: android.view.View = this.nativeView;
        const padding = {
            top: nativeView.getPaddingTop(),
            right: nativeView.getPaddingRight(),
            bottom: nativeView.getPaddingBottom(),
            left: nativeView.getPaddingLeft(),
        };
        // tslint:disable-next-line:prefer-object-spread
        const newValue = Object.assign(padding, newPadding);
        nativeView.setPadding(newValue.left, newValue.top, newValue.right, newValue.bottom);
    }

    private _getLayoutManagarOrientation() {
        let orientation = androidx.recyclerview.widget.LinearLayoutManager.VERTICAL;
        if (this.isHorizontal()) {
            orientation = androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL;
        }

        return orientation;
    }
    private createComposedAdapter(recyclerView: CollectionViewRecyclerView) {
        const adapter = new com.nativescript.collectionview.Adapter();
        adapter.adapterInterface = new com.nativescript.collectionview.AdapterInterface({
            getItemId: this.getItemId.bind(this),
            getItemViewType: this.getItemViewType.bind(this),
            getItemCount: this.getItemCount.bind(this),
            onCreateViewHolder: this.onCreateViewHolder.bind(this),
            onBindViewHolder: this.onBindViewHolder.bind(this),
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
            console.log('onItemIdGeneratorChanged setHasStableIds', !!newValue);
            this._listViewAdapter.setHasStableIds(!!newValue);
        }
    }

    public clearTemplateTypes() {
        this._currentNativeItemType = 0;
        this.templateTypeNumberString.clear();
        this.templateStringTypeNumber.clear();
    }

    // public notifyDataSetChanged() {
    //     this.disposeViewHolderViews();
    //     super.notifyDataSetChanged();
    // }

    @profile
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

    @profile
    disposeViewHolderViews() {
        this._viewHolders = new Array();
        this._viewHolderChildren.forEach(this._removeViewCore);
    }
    @profile
    getKeyByValue(viewType: number) {
        return this.templateStringTypeNumber.get(viewType);
    }

    @profile
    public onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
        let view: View = this.getViewForViewType(ListViewViewTypes.ItemView, this.getKeyByValue(viewType));
        const isNonSync = view === undefined;
        // dont create unecessary StackLayout if template.createView returns. Will happend when not using Vue or angular
        if (isNonSync || view instanceof ProxyViewContainer) {
            const parentView = new GridLayout();
            parentView.id = 'collectionViewHolder';
            view = parentView;
        }
        this._viewHolderChildren.push(view);
        this._addView(view);
        // if (!CollectionViewCellHolder) {
        //     CollectionViewCellHolder = com.nativescript.collectionview.CollectionViewCellHolder as any;
        // }
        initCellViewHolder();
        const holder = new CellViewHolder(new WeakRef(view), new WeakRef(this));
        // holder.view = view;
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
        if (isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder', position);
        }
        let view = holder.view;
        const bindingContext = this._prepareItem(view, position);
        const isNonSync = !!holder['defaultItemView'];

        view = isNonSync ? (view as GridLayout).getChildAt(0) : view;

        const args = {
            eventName: CollectionViewBase.itemLoadingEvent,
            index: position,
            object: this,
            view,
            bindingContext,
            android: holder,
        };
        this.notifyLoading(args);

        if (isNonSync && args.view !== view) {
            view = args.view;
            // the view has been changed on the event handler
            (holder.view as GridLayout).addChild(args.view);
        }

        if (this._effectiveColWidth || !view.width) {
            view.width = utils.layout.toDeviceIndependentPixels(this._effectiveColWidth);
        }
        if (this._effectiveRowHeight || !view.height) {
            view.height = utils.layout.toDeviceIndependentPixels(this._effectiveRowHeight);
        }
        if (isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder done ', position);
        }
    }
}

export interface CollectionViewScrollListener extends androidx.recyclerview.widget.RecyclerView.OnScrollListener {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<CollectionView>): CollectionViewScrollListener;
}

let CollectionViewScrollListener: CollectionViewScrollListener;

function initCollectionViewScrollListener() {
    if (CollectionViewScrollListener) {
        return;
    }

    class CollectionViewScrollListenerImpl extends androidx.recyclerview.widget.RecyclerView.OnScrollListener {
        constructor(private owner: WeakRef<CollectionView>) {
            super();

            return global.__native(this);
        }

        public onScrolled(view: androidx.recyclerview.widget.RecyclerView, dx: number, dy: number) {
            const owner: CollectionView = this.owner.get();
            if (!owner || !this.scrolling) {
                return;
            }

            const lastVisibleItemPos = (view.getLayoutManager() as com.nativescript.collectionview.GridLayoutManager).findLastCompletelyVisibleItemPosition();
            if (owner.hasListeners(CollectionViewBase.scrollEvent)) {
                owner.notify({
                    object: owner,
                    eventName: CollectionViewBase.scrollEvent,
                    scrollOffset: (owner.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / utils.layout.getDisplayDensity(),
                });
            }

            if (owner.hasListeners(CollectionViewBase.loadMoreItemsEvent) && owner.items) {
                const itemCount = owner.items.length - 1;
                if (lastVisibleItemPos === itemCount) {
                    owner.notify({
                        eventName: CollectionViewBase.loadMoreItemsEvent,
                        object: owner,
                    });
                }
            }
        }

        scrolling = false;
        public onScrollStateChanged(view: androidx.recyclerview.widget.RecyclerView, newState: number) {
            if (this.scrolling && newState === 0) {
                // SCROLL_STATE_IDLE
                this.scrolling = false;
                const owner: CollectionView = this.owner.get();
                if (!owner) {
                    return;
                }
                if (owner.hasListeners(CollectionViewBase.scrollEndEvent)) {
                    owner.notify({
                        object: owner,
                        eventName: CollectionViewBase.scrollEndEvent,
                        scrollOffset: (owner.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / utils.layout.getDisplayDensity(),
                    });
                }
            } else if (!this.scrolling && newState === 1) {
                //SCROLL_STATE_DRAGGING
                this.scrolling = true;
            }
        }
    }

    CollectionViewScrollListener = CollectionViewScrollListenerImpl as any;
}

// interface CollectionViewAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<any> {
//     // tslint:disable-next-line:no-misused-new
//     new (owner: WeakRef<CollectionView>): CollectionViewAdapter;
//     clearTemplateTypes();
//     disposeViewHolderViews();
// }
// let CollectionViewAdapter: CollectionViewAdapter;

// Snapshot friendly CollectionViewAdapter
interface CollectionViewCellHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new (androidView: android.view.View): CollectionViewCellHolder;
    view: View;
}

let CollectionViewCellHolder: CollectionViewCellHolder;

export interface CollectionViewRecyclerView extends androidx.recyclerview.widget.RecyclerView {
    // tslint:disable-next-line:no-misused-new
    // new (context: any, owner: WeakRef<CollectionView>): CollectionViewRecyclerView;
    new (context: any): CollectionViewRecyclerView;
}

let CollectionViewRecyclerView: CollectionViewRecyclerView;
itemViewCacheSizeProperty.register(CollectionViewBase);
extraLayoutSpaceProperty.register(CollectionViewBase);
