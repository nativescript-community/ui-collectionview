import { ChangedData, ChangeType } from 'data/observable-array';
import { profile } from 'tns-core-modules/profiling';
import { Length, View } from 'tns-core-modules/ui/core/view';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import * as utils from 'tns-core-modules/utils/utils';
import { CollectionViewItemEventData, Orientation } from './collectionview';
import {
    CollectionViewBase,
    colWidthProperty,
    isScrollEnabledProperty,
    ListViewViewTypes,
    orientationProperty,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty,
    rowHeightProperty
} from './collectionview-common';

export * from './collectionview-common';

export class CollectionView extends CollectionViewBase {
    public static DEFAULT_TEMPLATE_VIEW_TYPE = 0;
    public static CUSTOM_TEMPLATE_ITEM_TYPE = 1;
    public nativeViewProtected: CollectionViewRecyclerView;
    public nativeView: CollectionViewRecyclerView & {
        scrollListener: CollectionViewScrollListener;
        owner: WeakRef<CollectionView>;
        layoutManager: GridLayoutManager;
    };
    // public _realizedItems = new Map<android.view.View, View>();

    // public _itemTemplatesByViewType: Map<number, KeyedTemplate>;

    // private items:java.util.List<Item>;

    private _listViewAdapter: CollectionViewAdapter;
    private itemTypeCount = CollectionView.CUSTOM_TEMPLATE_ITEM_TYPE;
    constructor() {
        super();
        // this._itemTemplatesByViewType = new Map<number, KeyedTemplate>();
        // (this._defaultTemplate as ViewTypeTemplate).viewType =
        //   CollectionView.DEFAULT_TEMPLATE_VIEW_TYPE;
        // this._itemTemplatesByViewType.set(
        //   CollectionView.DEFAULT_TEMPLATE_VIEW_TYPE,
        //   this._defaultTemplate
        // );
    }

    public createNativeView() {
        initCollectionViewRecyclerView();
        const recyclerView = new CollectionViewRecyclerView(this._context, new WeakRef(this));
        recyclerView.setHorizontalScrollBarEnabled(true);
        recyclerView.setVerticalScrollBarEnabled(true);
        recyclerView.setHasFixedSize(true);
        recyclerView.setItemViewCacheSize(-1);
        recyclerView.setDrawingCacheEnabled(true);
        recyclerView.setDrawingCacheQuality(android.view.View.DRAWING_CACHE_QUALITY_HIGH);
        recyclerView.setFocusable(true);
        // recyclerView.setNestedScrollingEnabled(false);

        recyclerView.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
        // const expMgr = new RecyclerViewExpandableItemManager(null);

        initCollectionViewAdapter();
        // tslint:disable-next-line:no-unused-expression
        new CollectionViewCellHolder(null, null, new android.widget.TextView(this._context));
        this.refresh();

        const animator = new com.h6ah4i.android.widget.advrecyclerview.animator.RefactoredDefaultItemAnimator();

        // Change animations are enabled by default since support-v7-recyclerview v22.
        // Need to disable them when using animation indicator.
        animator.setSupportsChangeAnimations(false);

        recyclerView.setItemAnimator(animator);

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

    public initNativeView() {
        super.initNativeView();

        const nativeView = this.nativeView;
        nativeView.owner = new WeakRef(this);

        const orientation = this._getLayoutManagarOrientation();

        initGridLayoutManager();
        const layoutManager = new GridLayoutManager(this._context, new WeakRef(this));
        nativeView.setLayoutManager(layoutManager);
        layoutManager.setOrientation(orientation);
        layoutManager.setSmoothScrollbarEnabled(true);
        nativeView.layoutManager = layoutManager;

        initCollectionViewScrollListener();
        const scrollListener = new CollectionViewScrollListener(new WeakRef(this));
        nativeView.addOnScrollListener(scrollListener);
        nativeView.scrollListener = scrollListener;

        // colWidthProperty.coerce(this);
        // rowHeightProperty.coerce(this);
    }

    public disposeNativeView() {
        // clear the cache
        this.eachChildView(view => {
            view.parent._removeView(view);
            return true;
        });
        // this._realizedItems.clear();

        const nativeView = this.nativeView;
        this.nativeView.removeOnScrollListener(nativeView.scrollListener);

        nativeView.scrollListener = null;
        nativeView.layoutManager = null;

        super.disposeNativeView();
    }

    get android(): androidx.recyclerview.widget.RecyclerView {
        return this.nativeView;
    }
    get layoutManager(): GridLayoutManager {
        return this.nativeView.getLayoutManager() as GridLayoutManager;
    }

    _getViewLayoutParams() {
        const layoutParams = new org.nativescript.widgets.CommonLayoutParams();
        // if (this.listViewLayout instanceof ListViewLinearLayout) {
        // if (this.listViewLayout.scrollDirection.toLowerCase() === listViewCommonModule.ListViewScrollDirection.Vertical.toLowerCase()) {
        layoutParams.width = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
        layoutParams.height = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
        // }
        // else if (this.listViewLayout.scrollDirection.toLowerCase() === listViewCommonModule.ListViewScrollDirection.Horizontal.toLowerCase()) {
        //     layoutParams.width = org.nativescript.widgets.CommonLayoutParams.WRAP_CONTENT;
        //     layoutParams.height = org.nativescript.widgets.CommonLayoutParams.MATCH_PARENT;
        // }
        // }
        return layoutParams;
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
        const layoutManager = this.nativeView.getLayoutManager() as GridLayoutManager;
        if (layoutManager.getOrientation() === androidx.recyclerview.widget.LinearLayoutManager.HORIZONTAL) {
            return 'horizontal';
        }

        return 'vertical';
    }
    public [orientationProperty.setNative](value: Orientation) {
        const layoutManager = this.nativeView.getLayoutManager() as GridLayoutManager;
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
        // console.log('onItemsChanged', event.action, event.index, event.addedCount, event.removed);
        switch (event.action) {
            case ChangeType.Delete: {
                this._listViewAdapter.notifyItemRangeRemoved(event.index, event.removed.length);
                break;
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
    public refresh() {
        if (!this.nativeView) {
            return;
        }
        if (!this._listViewAdapter) {
            this._listViewAdapter = this.createComposedAdapter(this.nativeViewProtected);
        } else {
            this._listViewAdapter.disposeViewHolderViews();
        }

        // nativeView.adapter.owner = new WeakRef(this);
        this.nativeViewProtected.setAdapter(this._listViewAdapter);
        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this
        };
        this.notify(args);

        const layoutManager = this.nativeView.getLayoutManager() as GridLayoutManager;
        layoutManager.setSpanCount(this.computeSpanCount());
        this.nativeView.getAdapter().notifyDataSetChanged();
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
            left: nativeView.getPaddingLeft()
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

// Snapshot friendly CollectionViewScrollListener
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

            const lastVisibleItemPos = (view.getLayoutManager() as GridLayoutManager).findLastCompletelyVisibleItemPosition();
            if (owner.hasListeners(CollectionViewBase.scrollEvent)) {
                owner.notify({
                    object: owner,
                    eventName: CollectionViewBase.scrollEvent,
                    scrollOffset: (owner.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / utils.layout.getDisplayDensity()
                });
            }

            if (owner.hasListeners(CollectionViewBase.loadMoreItemsEvent) && owner.items) {
                const itemCount = owner.items.length - 1;
                if (lastVisibleItemPos === itemCount) {
                    owner.notify({
                        eventName: CollectionViewBase.loadMoreItemsEvent,
                        object: owner
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
// END snapshot friendly CollectionViewScrollListener

// Snapshot friendly CollectionViewAdapter
interface CollectionViewAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<any> {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<CollectionView>): CollectionViewAdapter;
    clearTemplateTypes();
    disposeViewHolderViews();
}
let CollectionViewAdapter: CollectionViewAdapter;

// Snapshot friendly CollectionViewAdapter
interface CollectionViewCellHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<View>, gridView: WeakRef<CollectionView>, androidView?: android.view.View): CollectionViewCellHolder;
    view: View;
}

let CollectionViewCellHolder: CollectionViewCellHolder;

function initCollectionViewAdapter() {
    if (CollectionViewAdapter) {
        return;
    }

    // class ViewHolder extends android.support.v7.widget.RecyclerView.ViewHolder {
    //   private textView: android.widget.TextView;

    //   public constructor(v: android.view.View) {
    //     super(v);
    //     // Define click listener for the ViewHolder's View.
    //     this.textView = v.findViewById(
    //       getId("textView")
    //     ) as android.widget.TextView;
    //   }

    //   public getTextView() {
    //     return this.textView;
    //   }
    // }

    @Interfaces([android.view.View.OnClickListener])
    class CollectionViewCellHolderImpl extends androidx.recyclerview.widget.RecyclerView.ViewHolder implements android.view.View.OnClickListener {
        constructor(private owner: WeakRef<View>, private collectionView: WeakRef<CollectionView>, androidView?: android.view.View) {
            super(androidView || owner.get().android);
            const nativeThis = global.__native(this);
            if (owner) {
                const nativeView = owner.get().android as android.view.View;
                nativeView.setOnClickListener(nativeThis);
            }

            return nativeThis;
        }

        get view(): View {
            return this.owner ? this.owner.get() : null;
        }

        public onClick(v: android.view.View) {
            const gridView = this.collectionView.get();

            gridView.notify<CollectionViewItemEventData>({
                eventName: CollectionViewBase.itemTapEvent,
                object: gridView,
                index: this.getAdapterPosition(),
                view: this.view
            });
        }
    }
    CollectionViewCellHolder = CollectionViewCellHolderImpl as any;

    class CollectionViewAdapterImpl extends androidx.recyclerview.widget.RecyclerView.Adapter<CollectionViewCellHolder> {
        templateTypeNumberString = new Map();
        _currentNativeItemType = 0;

        _viewHolders = new Array();
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
            const item = this.getItem(i);
            let id = i;
            if (this.owner && item && owner.items) {
                id = owner.itemIdGenerator(item, i, owner.items);
            }
            return long(id);
        }

        // public hasStableIds(): boolean {
        //     return true;
        // }

        public clearTemplateTypes() {
            this._currentNativeItemType = 0;
            this.templateTypeNumberString.clear();
        }

        // public notifyDataSetChanged() {
        //     this.disposeViewHolderViews();
        //     super.notifyDataSetChanged();
        // }

        public getItemViewType(position: number) {
            const owner = this.owner.get();
            let resultType = 0;

            if (owner.itemTemplateSelector) {
                const selector = owner.itemTemplateSelector;
                const dataItem = owner.getItemAtIndex(position);
                if (dataItem) {
                    const selectorType = selector(dataItem, position, owner.items);
                    if (!this.templateTypeNumberString.has(selectorType)) {
                        this.templateTypeNumberString.set(selectorType, this._currentNativeItemType);
                        this._currentNativeItemType++;
                    }
                    resultType = this.templateTypeNumberString.get(selectorType);
                }
            }
            return resultType;
        }

        disposeViewHolderViews() {
            this._viewHolders = new Array();
            const owner = this.owner.get();
            this._viewHolderChildren.forEach(function(element) {
                owner._removeViewCore(element);
                // if (!(element.parent instanceof CollectionView)) {
                //   owner._removeView(element.parent);
                // }
                // element.parent._removeView(element);
            });
        }
        getKeyByValue(inputValue) {
            let result;
            this.templateTypeNumberString.forEach(function(value, key, map) {
                if (value === inputValue) {
                    result = key;
                }
            }, this);
            return result;
        }

        @profile('CV_onCreateViewHolder')
        public onCreateViewHolder(parent: android.view.ViewGroup, viewType: number) {
            const owner = this.owner.get();

            const templateType = this.getKeyByValue(viewType);
            let view: View = owner.getViewForViewType(ListViewViewTypes.ItemView, templateType);
            // console.log('onCreateViewHolder', viewType, templateType, view);
            // const isVue = !!view["defaultItemView"];
            const isVue = view === undefined;
            // dont create unecessary StackLayout if template.createView returns. Will happend when not using Vue or angular
            if (isVue) {
                const parentView = new StackLayout();
                parentView.orientation = 'vertical';
                // parentView.addChild(view);

                view = parentView;
            }
            this._viewHolderChildren.push(view);
            // owner._addView(view);
            // (view as any).parent = owner;
            owner._addViewCore(view);
            // view._parentChanged(null);

            const holder = new CollectionViewCellHolder(new WeakRef(view), new WeakRef(owner));

            if (isVue) {
                const layoutParams = owner._getViewLayoutParams();
                view.nativeView.setLayoutParams(layoutParams);
                holder['defaultItemView'] = true;
            }
            this._viewHolders.push(holder);

            return holder;
        }
        // @profile("onCreateViewHolder")
        // public onCreateViewHolder(
        //   parent: android.view.ViewGroup,
        //   viewType: number
        // ) {
        //   const v = this.inflateLayout('text_row_item', parent);
        //   return new ViewHolder(v);
        // }

        // @profile("inflateLayout")
        // private inflateLayout(str:string, parent) {
        //   return android.view.LayoutInflater.from(parent.getContext()).inflate(getLayout(str), parent, false)
        // }

        // public onFailedToRecycleView(vh: CollectionViewCellHolder) {
        //     console.log('onFailedToRecycleView');
        //     return super.onFailedToRecycleView(vh);
        // }
        // public onViewRecycled(vh: CollectionViewCellHolder) {
        //     console.log('onViewRecycled');
        //     super.onViewRecycled(vh);
        // }

        // patchHolderViewIfChanged(holder: CollectionViewCellHolder, view) {
        // console.log("patchHolderViewIfChanged", !!holder["defaultItemView"], (holder.view as StackLayout).getChildAt(0), view);

        // }

        @profile('CV_onBindViewHolder')
        public onBindViewHolder(holder: CollectionViewCellHolder, position: number) {
            const owner = this.owner.get();
            let view = holder.view;
            const oldBindingContext = view && view.bindingContext;
            const bindingContext = owner._prepareItem(view, position);
            const isVue = !!holder['defaultItemView'];

            view = isVue ? (view as StackLayout).getChildAt(0) : view;

            const args = {
                eventName: CollectionViewBase.itemLoadingEvent,
                index: position,
                object: owner,
                view,
                bindingContext,
                android: holder
            };
            owner.notify(args);

            if (isVue && args.view !== view) {
                view = args.view;
                // the view has been changed on the event handler
                // (holder.view as StackLayout).removeChildren();
                (holder.view as StackLayout).addChild(args.view);
                // holder["defaultItemView"] = false;
            }
            // view.bindingContext = bindingContext;
            if (owner._effectiveColWidth || !view.width) {
                view.width = utils.layout.toDeviceIndependentPixels(owner._effectiveColWidth);
            }
            if (owner._effectiveRowHeight || !view.height) {
                view.height = utils.layout.toDeviceIndependentPixels(owner._effectiveRowHeight);
            }
            if (oldBindingContext !== bindingContext) {
                view.requestLayout();
            }
        }
        // @profile("onBindViewHolder")
        // public onBindViewHolder(
        //   holder: CollectionViewCellHolder,
        //   position: number
        // ) {
        //   const owner = this.owner.get();
        //   const data = owner.getItemAtIndex(position);
        //   holder.getTextView().setText(data.value);
        // }

        public onClick(v: android.view.View) {
            const rv = com.h6ah4i.android.widget.advrecyclerview.utils.RecyclerViewAdapterUtils.getParentRecyclerView(v);
            const vh = rv.findContainingViewHolder(v);

            const rootPosition = vh.getAdapterPosition();
            if (rootPosition === androidx.recyclerview.widget.RecyclerView.NO_POSITION) {
                return;
            }

            // need to determine adapter local position like this:
            const rootAdapter = rv.getAdapter();
            const localPosition = com.h6ah4i.android.widget.advrecyclerview.utils.WrapperAdapterUtils.unwrapPosition(rootAdapter, this, rootPosition);
        }
    }

    CollectionViewAdapter = CollectionViewAdapterImpl as any;
}
// END Snapshot friendly CollectionViewAdapter

// Snapshot friendly CollectionViewRecyclerView
export interface CollectionViewRecyclerView extends androidx.recyclerview.widget.RecyclerView {
    // tslint:disable-next-line:no-misused-new
    new (context: any, owner: WeakRef<CollectionView>): CollectionViewRecyclerView;
}

let CollectionViewRecyclerView: CollectionViewRecyclerView;

function initCollectionViewRecyclerView() {
    if (CollectionViewRecyclerView) {
        return;
    }

    class CollectionViewRecyclerViewImpl extends androidx.recyclerview.widget.RecyclerView {
        constructor(context: android.content.Context, private owner: WeakRef<CollectionView>) {
            super(context);
            return global.__native(this);
        }
        // public setMeasuredDimension(w: number, h: number) {
        //   console.log('test setMeasuredDimension', w, h);
        //   super.setMeasuredDimension(w, h);
        //   const owner = this.owner.get();
        //   owner.setMeasuredDimension(w, h);
        // }

        public onMeasure(widthMeasureSpec, heightMeasureSpec) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
            const owner = this.owner.get();
            if (owner) {
                owner.setMeasuredDimension(this.getMeasuredWidth(), this.getMeasuredHeight());
            }
        }

        // public onLayout(
        //   changed: boolean,
        //   l: number,
        //   t: number,
        //   r: number,
        //   b: number
        // ) {
        //   if (changed) {
        //     const owner = this.owner.get();
        //     owner.onLayout(l, t, r, b);
        //   }
        //   super.onLayout(changed, l, t, r, b);
        // }
    }

    CollectionViewRecyclerView = CollectionViewRecyclerViewImpl as any;
}
// END Snapshot friendly CollectionViewRecyclerView

// Snapshot friendly GridLayoutManager
export interface GridLayoutManager extends androidx.recyclerview.widget.GridLayoutManager {
    // tslint:disable-next-line:no-misused-new
    new (context: any, owner: WeakRef<CollectionView>): GridLayoutManager;
}

let GridLayoutManager: GridLayoutManager;

function initGridLayoutManager() {
    if (GridLayoutManager) {
        return;
    }

    class GridLayoutManagerImpl extends androidx.recyclerview.widget.GridLayoutManager {
        private childSizesMap = new Map<number, number>();
        constructor(context: android.content.Context, private owner: WeakRef<CollectionView>) {
            super(context, 1);

            return global.__native(this);
        }

        onLayoutCompleted(state) {
            super.onLayoutCompleted(state);
            for (let i = 0; i < this.getChildCount(); i++) {
                const child = this.getChildAt(i);
                this.childSizesMap.set(this.getPosition(child), child.getHeight());
            }
        }

        computeVerticalScrollOffset(state) {
            if (this.getChildCount() === 0) {
                return 0;
            }
            const firstChildPosition = this.findFirstVisibleItemPosition();
            const firstChild = this.findViewByPosition(firstChildPosition);
            let scrolledY = -firstChild.getY();
            for (let i = 0; i < firstChildPosition; i++) {
                scrolledY += this.childSizesMap.get(i) || 0;
            }
            return Math.round(scrolledY);
        }

        canScrollVertically() {
            const owner = this.owner.get();
            if (owner) {
                return owner.isScrollEnabled && super.canScrollVertically();
            }
            return super.canScrollVertically();
        }
        canScrollHorizontally() {
            const owner = this.owner.get();
            if (owner) {
                return owner.isScrollEnabled && super.canScrollHorizontally();
            }
            return super.canScrollHorizontally();
        }

        // computeScrollVectorForPosition( targetPosition) {
        //     if (this.getChildCount() == 0) {
        //         return null;
        //     }
        //     const firstChildPos = this.getPosition(this.getChildAt(0));
        //     const direction = targetPosition < firstChildPos != this.getReverseLayout()
        //             ? 1 : -1;
        //     if (this.getOrientation() == HORIZONTAL) {
        //         return new PointF(direction, 0);
        //     } else {
        //         return new PointF(0, direction);
        //     }
        // }

        // public supportsPredictiveItemAnimations() {
        //     return false;
        // }
    }

    GridLayoutManager = GridLayoutManagerImpl as any;
}
// END Snapshot friendly GridLayoutManager
