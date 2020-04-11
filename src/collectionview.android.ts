import { ChangedData, ChangeType } from '@nativescript/core/data/observable-array';
import { profile } from '@nativescript/core/profiling';
import { isEnabled } from '@nativescript/core/trace';
import { Length, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty, View, Property } from '@nativescript/core/ui/core/view';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { ProxyViewContainer } from '@nativescript/core/ui/proxy-view-container';
import { screen } from '@nativescript/core/platform';
import * as utils from '@nativescript/core/utils/utils';
import { CollectionViewItemEventData, Orientation } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, isScrollEnabledProperty, ListViewViewTypes, orientationProperty } from './collectionview-common';

export * from './collectionview-common';

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

    private _listViewAdapter: CollectionViewAdapter;

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
        layoutManager.setOrientation(orientation);
        nativeView.layoutManager = layoutManager;

        initCollectionViewAdapter();

        this.attach();
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

    _scrollOrLoadMoreChangeCount = 0;
    private attach() {
        if (this._scrollOrLoadMoreChangeCount > 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (!nativeView.scrollListener) {
                console.log('attaching scroll listener');
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
        if (this._listViewAdapter) {
            this._listViewAdapter.clearTemplateTypes();
        }
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
        if (!this.nativeView) {
            return;
        }
        if (!this.isLoaded) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        if (!this._listViewAdapter) {
            this._listViewAdapter = this.createComposedAdapter(this.nativeViewProtected);
            this.nativeViewProtected.setAdapter(this._listViewAdapter);
        } else if (!this.nativeView.getAdapter()) {
            this.nativeViewProtected.setAdapter(this._listViewAdapter);
        }

        // nativeView.adapter.owner = new WeakRef(this);

        const layoutManager = this.nativeView.getLayoutManager() as com.nativescript.collectionview.GridLayoutManager;
        layoutManager.setSpanCount(this.computeSpanCount());
        this.nativeView.getAdapter().notifyDataSetChanged();
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
        // const composedAdapter = new com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedAdapter();
        // composedAdapter.addAdapter(new CollectionViewAdapter(new WeakRef(this)));
        return new CollectionViewAdapter(new WeakRef(this));
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
            if (!owner) {
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

        public onScrollStateChanged(view: androidx.recyclerview.widget.RecyclerView, newState: number) {
            // Not Needed
        }
    }

    CollectionViewScrollListener = CollectionViewScrollListenerImpl as any;
}

interface CollectionViewAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<any> {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<CollectionView>): CollectionViewAdapter;
    clearTemplateTypes();
    disposeViewHolderViews();
}
let CollectionViewAdapter: CollectionViewAdapter;

// Snapshot friendly CollectionViewAdapter
interface CollectionViewCellHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new (androidView: android.view.View): CollectionViewCellHolder;
    view: View;
}

let CollectionViewCellHolder: CollectionViewCellHolder;

function initCollectionViewAdapter() {
    if (CollectionViewAdapter) {
        return;
    }
    class CollectionViewAdapterImpl extends androidx.recyclerview.widget.RecyclerView.Adapter<CollectionViewCellHolder> {
        templateTypeNumberString = new Map<string, number>();
        templateStringTypeNumber = new Map<number, string>();
        _currentNativeItemType = 0;

        // used to store viewHolder and make sure they are not garbaged
        _viewHolders = new Array();

        // used to "destroy" cells when possible
        _viewHolderChildren = new Array();

        constructor(private owner: WeakRef<CollectionView>, adapter: androidx.recyclerview.widget.RecyclerView.Adapter<any>) {
            super();
            return global.__native(this);
        }

        public getItemCount() {
            const owner = this.owner.get();
            return owner.items ? owner.items.length : 0;
        }

        public getItem(i: number) {
            const owner = this.owner.get();
            if (owner && owner.items && i < owner.items.length) {
                return owner.getItemAtIndex(i);
            }
            return null;
        }

        public getItemId(i: number) {
            const owner = this.owner.get();
            let id = i;
            if (owner && owner.itemIdGenerator && owner.items) {
                id = owner.itemIdGenerator(owner.getItemAtIndex(i), i, owner.items);
            }
            return long(id);
        }

        public hasStableIds(): boolean {
            // const owner = this.owner.get();
            // return !!owner && !!owner.itemIdGenerator;
            return true;
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
            const owner = this.owner.get();
            let resultType = 0;

            if (owner._itemTemplateSelector) {
                const selector = owner._itemTemplateSelector;
                const dataItem = owner.getItemAtIndex(position);
                if (dataItem) {
                    const selectorType:string = selector(dataItem, position, owner.items);

                    if (!this.templateTypeNumberString.has(selectorType)) {
                        resultType = this._currentNativeItemType
                        this.templateTypeNumberString.set(selectorType, resultType);
                        this.templateStringTypeNumber.set(resultType, selectorType);
                        this._currentNativeItemType++;
                    } else {
                        resultType = this.templateTypeNumberString.get(selectorType);
                    }
                }
            }
            return resultType;
        }

        @profile
        disposeViewHolderViews() {
            this._viewHolders = new Array();
            const owner = this.owner.get();
            this._viewHolderChildren.forEach(function (element) {
                owner._removeViewCore(element);
            });
        }
        @profile
        getKeyByValue(viewType: number) {
            // let result;
            return this.templateStringTypeNumber.get(viewType);
            // this.templateTypeNumberString.forEach(function (value, key, map) {
            //     if (value === inputValue) {
            //         result = key;
            //     }
            // }, this);
            // return result;
        }

        @profile
        public onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
            const owner = this.owner.get();

            let view: View = owner.getViewForViewType(ListViewViewTypes.ItemView, this.getKeyByValue(viewType));
            const isVue = view === undefined;
            // dont create unecessary StackLayout if template.createView returns. Will happend when not using Vue or angular
            if (isVue || view instanceof ProxyViewContainer) {
                const parentView = new GridLayout();
                view = parentView;
            }
            this._viewHolderChildren.push(view);
            owner._addView(view);
            if (!CollectionViewCellHolder) {
                CollectionViewCellHolder = com.nativescript.collectionview.CollectionViewCellHolder as any;
            }
            const holder = new CollectionViewCellHolder(view.nativeView);
            holder.view = view;
            const layoutParams = owner._getViewLayoutParams();
            view.nativeView.setLayoutParams(layoutParams);
            if (isVue) {
                holder['defaultItemView'] = true;
            }
            this._viewHolders.push(holder);

            return holder;
        }

        @profile
        public onBindViewHolder(holder: CollectionViewCellHolder, position: number) {
            const owner = this.owner.get();
            if (isEnabled()) {
                CLog(CLogTypes.log, 'onBindViewHolder', position);
            }
            let view = holder.view;
            const bindingContext = owner._prepareItem(view, position);
            const isVue = !!holder['defaultItemView'];

            view = isVue ? (view as GridLayout).getChildAt(0) : view;

            const args = {
                eventName: CollectionViewBase.itemLoadingEvent,
                index: position,
                object: owner,
                view,
                bindingContext,
                android: holder,
            };
            owner.notify(args);

            if (isVue && args.view !== view) {
                view = args.view;
                // the view has been changed on the event handler
                (holder.view as GridLayout).addChild(args.view);
            }

            if (owner._effectiveColWidth || !view.width) {
                view.width = utils.layout.toDeviceIndependentPixels(owner._effectiveColWidth);
            }
            if (owner._effectiveRowHeight || !view.height) {
                view.height = utils.layout.toDeviceIndependentPixels(owner._effectiveRowHeight);
            }
            if (isEnabled()) {
                CLog(CLogTypes.log, 'onBindViewHolder done ', position);
            }
        }
    }

    CollectionViewAdapter = CollectionViewAdapterImpl as any;
}

export interface CollectionViewRecyclerView extends androidx.recyclerview.widget.RecyclerView {
    // tslint:disable-next-line:no-misused-new
    // new (context: any, owner: WeakRef<CollectionView>): CollectionViewRecyclerView;
    new (context: any): CollectionViewRecyclerView;
}

let CollectionViewRecyclerView: CollectionViewRecyclerView;
itemViewCacheSizeProperty.register(CollectionViewBase);
extraLayoutSpaceProperty.register(CollectionViewBase);
