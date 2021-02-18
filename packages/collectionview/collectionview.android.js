import { ChangeType, Property, ProxyViewContainer, Trace, View, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty, profile, ContentView, } from '@nativescript/core';
import { layout } from '@nativescript/core/utils/utils';
import { reorderLongPressEnabledProperty, reorderingEnabledProperty, reverseLayoutProperty, scrollBarIndicatorVisibleProperty } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isScrollEnabledProperty, orientationProperty } from './collectionview-common';
export * from './collectionview-common';
var SimpleCallback = /** @class */ (function (_super) {
    __extends(SimpleCallback, _super);
    function SimpleCallback(param1, param2) {
        var _this = _super.call(this, param1, param2) || this;
        _this.startPosition = -1;
        _this.endPosition = -1;
        return global.__native(_this);
    }
    SimpleCallback.prototype.onMove = function (recyclerview, viewHolder, target) {
        var startPosition = viewHolder.getAdapterPosition();
        var endPosition = target.getAdapterPosition();
        if (this.startPosition === -1) {
            this.startPosition = startPosition;
        }
        this.endPosition = endPosition;
        var owner = this.owner && this.owner.get();
        if (owner) {
            owner._reorderItemInSource(startPosition, endPosition);
            return true;
        }
        return false;
    };
    SimpleCallback.prototype.onSelectedChanged = function (viewHolder, state) {
        console.log('onSelectedChanged', viewHolder, this.startPosition, this.endPosition);
        if (viewHolder) {
            if (this.startPosition === -1) {
                this.startPosition = viewHolder.getAdapterPosition();
            }
        }
        if (!viewHolder) {
            // this is where we identify the end of the drag and call the end event
            var owner = this.owner && this.owner.get();
            if (this.endPosition === -1) {
                this.endPosition = this.startPosition;
            }
            if (owner) {
                var item = owner.getItemAtIndex(this.startPosition);
                owner._callItemReorderedEvent(this.startPosition, this.endPosition, item);
            }
            this.startPosition = -1;
            this.endPosition = -1;
            owner.isDragging = false;
        }
    };
    SimpleCallback.prototype.onSwiped = function (viewHolder, direction) {
    };
    SimpleCallback.prototype.isItemViewSwipeEnabled = function () {
        // disabled for now
        return false;
    };
    SimpleCallback.prototype.isLongPressDragEnabled = function () {
        // we use our custom longpress gesture handler
        return false;
    };
    return SimpleCallback;
}(androidx.recyclerview.widget.ItemTouchHelper.SimpleCallback));
var LongPressGestureListenerImpl = /** @class */ (function (_super) {
    __extends(LongPressGestureListenerImpl, _super);
    function LongPressGestureListenerImpl(_owner) {
        var _this = _super.call(this) || this;
        _this._owner = _owner;
        return global.__native(_this);
    }
    LongPressGestureListenerImpl.prototype.onLongPress = function (motionEvent) {
        var owner = this._owner && this._owner.get();
        if (owner) {
            owner.onReorderLongPress(motionEvent);
        }
    };
    return LongPressGestureListenerImpl;
}(android.view.GestureDetector.SimpleOnGestureListener));
let CellViewHolder;
let LayoutParams;
const extraLayoutSpaceProperty = new Property({
    name: 'extraLayoutSpace',
});
const itemViewCacheSizeProperty = new Property({
    name: 'itemViewCacheSize',
});
export class CollectionView extends CollectionViewBase {
    constructor() {
        super(...arguments);
        this.templateTypeNumberString = new Map();
        this.templateStringTypeNumber = new Map();
        this._currentNativeItemType = 0;
        this._viewHolders = new Array();
        this._viewHolderChildren = new Array();
        this._scrollOrLoadMoreChangeCount = 0;
        this.scrolling = false;
        this.isDragging = false;
    }
    createNativeView() {
        if (!CollectionViewRecyclerView) {
            CollectionViewRecyclerView = com.nativescript.collectionview.RecyclerView;
        }
        const recyclerView = CollectionViewRecyclerView.createRecyclerView(this._context);
        return recyclerView;
    }
    initNativeView() {
        this.setOnLayoutChangeListener();
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        nativeView.owner = new WeakRef(this);
        let layoutManager;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layoutManager = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        }
        else {
            layoutManager = new com.nativescript.collectionview.PreCachingGridLayoutManager(this._context, 1);
        }
        nativeView.setLayoutManager(layoutManager);
        nativeView.layoutManager = layoutManager;
        this.spanSize = this._getSpanSize;
        const animator = new com.h6ah4i.android.widget.advrecyclerview.animator.RefactoredDefaultItemAnimator();
        animator.setSupportsChangeAnimations(false);
        nativeView.setItemAnimator(animator);
        this.refresh();
    }
    getViewForItemAtIndex(index) {
        let result;
        this._viewHolders.some(function (cellItemView, key) {
            if (cellItemView && cellItemView.getAdapterPosition() === index) {
                result = cellItemView.view;
                return true;
            }
            return false;
        });
        return result;
    }
    set spanSize(inter) {
        if (!(typeof inter === 'function')) {
            return;
        }
        this._getSpanSize = inter;
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setSpanSizeLookup']) {
            layoutManager['setSpanSizeLookup'](inter
                ? new com.nativescript.collectionview.SpanSizeLookup(new com.nativescript.collectionview.SpanSizeLookup.Interface({
                    getSpanSize: inter,
                }))
                : null);
        }
    }
    get spanSize() {
        return this._getSpanSize;
    }
    onLoaded() {
        super.onLoaded();
        this.attachScrollListener();
    }
    attachScrollListener() {
        if (this._scrollOrLoadMoreChangeCount > 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (!nativeView.scrollListener) {
                this._nScrollListener = new com.nativescript.collectionview.OnScrollListener.Listener({
                    onScrollStateChanged: this.onScrollStateChanged.bind(this),
                    onScrolled: this.onScrolled.bind(this),
                });
                const scrollListener = new com.nativescript.collectionview.OnScrollListener(this._nScrollListener);
                nativeView.addOnScrollListener(scrollListener);
                nativeView.scrollListener = scrollListener;
            }
        }
    }
    dettachScrollListener() {
        if (this._scrollOrLoadMoreChangeCount === 0 && this.isLoaded) {
            const nativeView = this.nativeViewProtected;
            if (nativeView.scrollListener) {
                this.nativeView.removeOnScrollListener(nativeView.scrollListener);
                nativeView.scrollListener = null;
                this._nScrollListener = null;
            }
        }
    }
    onScrolled(view, dx, dy) {
        if (!this || !this.scrolling) {
            return;
        }
        if (this.hasListeners(CollectionViewBase.scrollEvent)) {
            this.notify({
                object: this,
                eventName: CollectionViewBase.scrollEvent,
                scrollOffset: (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / layout.getDisplayDensity(),
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
                        object: this,
                    });
                }
            }
        }
    }
    onScrollStateChanged(view, newState) {
        if (this.scrolling && newState === 0) {
            this.scrolling = false;
            if (this.hasListeners(CollectionViewBase.scrollEndEvent)) {
                this.notify({
                    object: this,
                    eventName: CollectionViewBase.scrollEndEvent,
                    scrollOffset: (this.isHorizontal() ? view.computeHorizontalScrollOffset() : view.computeVerticalScrollOffset()) / layout.getDisplayDensity(),
                });
            }
        }
        else if (!this.scrolling && newState === 1) {
            this.scrolling = true;
        }
    }
    addEventListener(arg, callback, thisArg) {
        super.addEventListener(arg, callback, thisArg);
        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount++;
            this.attachScrollListener();
        }
    }
    removeEventListener(arg, callback, thisArg) {
        super.removeEventListener(arg, callback, thisArg);
        if (arg === CollectionViewBase.scrollEvent || arg === CollectionViewBase.loadMoreItemsEvent) {
            this._scrollOrLoadMoreChangeCount--;
            this.dettachScrollListener();
        }
    }
    disposeNativeView() {
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
    get android() {
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
        }
        else {
            if (!this._vlayoutParams) {
                LayoutParams = LayoutParams || android.view.ViewGroup.LayoutParams;
                this._vlayoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
            }
            return this._vlayoutParams;
        }
    }
    [paddingTopProperty.getDefault]() {
        return { value: this._defaultPaddingTop, unit: 'px' };
    }
    [paddingTopProperty.setNative](value) {
        this._setPadding({ top: this.effectivePaddingTop });
    }
    [paddingRightProperty.getDefault]() {
        return { value: this._defaultPaddingRight, unit: 'px' };
    }
    [paddingRightProperty.setNative](value) {
        this._setPadding({ right: this.effectivePaddingRight });
    }
    [paddingBottomProperty.getDefault]() {
        return { value: this._defaultPaddingBottom, unit: 'px' };
    }
    [paddingBottomProperty.setNative](value) {
        this._setPadding({ bottom: this.effectivePaddingBottom });
    }
    [paddingLeftProperty.getDefault]() {
        return { value: this._defaultPaddingLeft, unit: 'px' };
    }
    [paddingLeftProperty.setNative](value) {
        this._setPadding({ left: this.effectivePaddingLeft });
    }
    [orientationProperty.getDefault]() {
        return 'vertical';
    }
    [orientationProperty.setNative](value) {
        const layoutManager = this.layoutManager;
        if (!layoutManager || !layoutManager['setOrientation']) {
            return;
        }
        if (this.isHorizontal()) {
            layoutManager['setOrientation'](0);
        }
        else {
            layoutManager['setOrientation'](1);
        }
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
    }
    [isScrollEnabledProperty.setNative](value) {
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager.setScrollEnabled) {
            layoutManager.setScrollEnabled(value);
        }
    }
    [reverseLayoutProperty.setNative](value) {
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager.setReverseLayout) {
            layoutManager.setReverseLayout(value);
        }
    }
    [extraLayoutSpaceProperty.setNative](value) {
        const layoutManager = this.layoutManager;
        if (layoutManager && layoutManager['setExtraLayoutSpace']) {
            layoutManager['setExtraLayoutSpace'](value);
        }
    }
    [itemViewCacheSizeProperty.setNative](value) {
        this.nativeViewProtected.setItemViewCacheSize(value);
    }
    [scrollBarIndicatorVisibleProperty.getDefault]() {
        return true;
    }
    [scrollBarIndicatorVisibleProperty.setNative](value) {
        this.updateScrollBarVisibility(value);
    }
    updateScrollBarVisibility(value) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (this.orientation === 'horizontal') {
            this.nativeViewProtected.setHorizontalScrollBarEnabled(value);
        }
        else {
            this.nativeViewProtected.setVerticalScrollBarEnabled(value);
        }
    }
    startDragging(index) {
        if (this.reorderEnabled && this._itemTouchHelper) {
            let viewHolder;
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
    startViewHolderDragging(index, viewHolder) {
        if (!this.isDragging && this.shouldMoveItemAtIndex(index)) {
            this.isDragging = true;
            this._itemTouchHelper.startDrag(viewHolder);
        }
    }
    onReorderLongPress(motionEvent) {
        const collectionView = this.nativeViewProtected;
        if (!collectionView) {
            return;
        }
        const view = collectionView.findChildViewUnder(motionEvent.getX(), motionEvent.getY());
        const viewHolder = view != null ? collectionView.getChildViewHolder(view) : null;
        if (viewHolder) {
            this.startViewHolderDragging(viewHolder.getAdapterPosition(), viewHolder);
        }
    }
    _reorderItemInSource(oldPosition, newPosition) {
        const adapter = this._listViewAdapter;
        adapter.notifyItemMoved(oldPosition, newPosition);
        super._reorderItemInSource(oldPosition, newPosition, false);
    }
    [reorderLongPressEnabledProperty.setNative](value) {
        if (value) {
            if (!this._longPressGesture) {
                this._longPressGesture = new androidx.core.view.GestureDetectorCompat(this._context, new LongPressGestureListenerImpl(new WeakRef(this)));
                this._itemTouchListerner = new androidx.recyclerview.widget.RecyclerView.OnItemTouchListener({
                    onInterceptTouchEvent: (view, event) => {
                        if (this.reorderEnabled && this._longPressGesture) {
                            this._longPressGesture.onTouchEvent(event);
                        }
                        return false;
                    },
                    onTouchEvent: (param0, param1) => {
                    },
                    onRequestDisallowInterceptTouchEvent: (disallowIntercept) => {
                    }
                });
            }
            this.nativeViewProtected.addOnItemTouchListener(this._itemTouchListerner);
        }
        else {
            if (this._itemTouchListerner) {
                this.nativeViewProtected.removeOnItemTouchListener(this._itemTouchListerner);
            }
        }
    }
    [reorderingEnabledProperty.setNative](value) {
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
        super.onItemTemplateChanged(oldValue, newValue);
        this.refresh();
    }
    onItemTemplatesChanged(oldValue, newValue) {
        super.onItemTemplatesChanged(oldValue, newValue);
        this.refresh();
    }
    setOnLayoutChangeListener() {
        if (this.nativeViewProtected) {
            const owner = this;
            this.layoutChangeListenerIsSet = true;
            this.layoutChangeListener =
                this.layoutChangeListener ||
                    new android.view.View.OnLayoutChangeListener({
                        onLayoutChange(v, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom) {
                            if (left !== oldLeft || top !== oldTop || right !== oldRight || bottom !== oldBottom) {
                                owner.onLayout(left, top, right, bottom);
                                if (owner.hasListeners(View.layoutChangedEvent)) {
                                    owner._raiseLayoutChangedEvent();
                                }
                            }
                        },
                    });
            this.nativeViewProtected.addOnLayoutChangeListener(this.layoutChangeListener);
        }
    }
    onLayout(left, top, right, bottom) {
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
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._lastLayoutKey !== layoutKey) {
            setTimeout(() => this.refresh(), 0);
        }
    }
    onSourceCollectionChanged(event) {
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
                return;
            }
            case ChangeType.Update: {
                if (event.addedCount > 0) {
                    this._listViewAdapter.notifyItemRangeChanged(event.index, event.addedCount);
                }
                return;
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
    refreshVisibleItems() {
        const view = this.nativeViewProtected;
        if (!view) {
            return;
        }
        const layoutManager = this.layoutManager;
        if (layoutManager['findFirstVisibleItemPosition']) {
            const first = layoutManager.findFirstVisibleItemPosition();
            const last = layoutManager.findLastVisibleItemPosition();
            this._listViewAdapter.notifyItemRangeChanged(first, last - first);
        }
    }
    refresh() {
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
        }
        else if (!view.getAdapter()) {
            view.setAdapter(adapter);
        }
        const layoutManager = view.getLayoutManager();
        if (layoutManager['setSpanCount']) {
            layoutManager['setSpanCount'](this.computeSpanCount());
        }
        adapter.notifyDataSetChanged();
        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this,
        };
        this.notify(args);
    }
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
    scrollToIndex(index, animated = true) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (animated) {
            this.nativeViewProtected.smoothScrollToPosition(index);
        }
        else {
            this.nativeViewProtected.scrollToPosition(index);
        }
    }
    _setPadding(newPadding) {
        const nativeView = this.nativeViewProtected;
        const padding = {
            top: nativeView.getPaddingTop(),
            right: nativeView.getPaddingRight(),
            bottom: nativeView.getPaddingBottom(),
            left: nativeView.getPaddingLeft(),
        };
        const newValue = Object.assign(padding, newPadding);
        nativeView.setPadding(newValue.left, newValue.top, newValue.right, newValue.bottom);
    }
    createComposedAdapter(recyclerView) {
        const adapter = new com.nativescript.collectionview.Adapter();
        adapter.adapterInterface = new com.nativescript.collectionview.AdapterInterface({
            getItemId: this.getItemId.bind(this),
            getItemViewType: this.getItemViewType.bind(this),
            getItemCount: this.getItemCount.bind(this),
            onCreateViewHolder: this.onCreateViewHolder.bind(this),
            onBindViewHolder: this.onBindViewHolder.bind(this),
        });
        return adapter;
    }
    getItemCount() {
        return this.items ? this.items.length : 0;
    }
    getItem(i) {
        if (this.items && i < this.items.length) {
            return this.getItemAtIndex(i);
        }
        return null;
    }
    getItemId(i) {
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
    clearTemplateTypes() {
        this._currentNativeItemType = 0;
        this.templateTypeNumberString.clear();
        this.templateStringTypeNumber.clear();
    }
    getItemViewType(position) {
        let resultType = 0;
        let selectorType = 'default';
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
        }
        else {
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
    getKeyByValue(viewType) {
        return this.templateStringTypeNumber.get(viewType);
    }
    onCreateViewHolder(parent, viewType) {
        let view = this.getViewForViewType(ListViewViewTypes.ItemView, this.getKeyByValue(viewType));
        const isNonSync = view === undefined;
        if (isNonSync || view instanceof ProxyViewContainer) {
            const parentView = new ContentView();
            parentView.id = 'collectionViewHolder';
            view = parentView;
        }
        this._viewHolderChildren.push(view);
        this._addView(view);
        if (!CollectionViewCellHolder) {
            CollectionViewCellHolder = com.nativescript.collectionview.CollectionViewCellHolder;
        }
        const holder = new CollectionViewCellHolder(view.nativeView);
        const collectionView = this;
        const clickListener = new android.view.View.OnClickListener({
            onClick: () => {
                const position = holder.getAdapterPosition();
                collectionView.notify({
                    eventName: CollectionViewBase.itemTapEvent,
                    object: collectionView,
                    index: position,
                    item: collectionView.getItem(position),
                    view: holder.view,
                });
            },
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
    onBindViewHolder(holder, position) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder', position);
        }
        let view = holder.view;
        const bindingContext = this._prepareItem(view, position);
        const isNonSync = holder['defaultItemView'] === true;
        view = isNonSync ? view.content : view;
        const args = {
            eventName: CollectionViewBase.itemLoadingEvent,
            index: position,
            object: this,
            view,
            bindingContext,
            android: holder,
        };
        this.notify(args);
        if (isNonSync && args.view !== view) {
            view = args.view;
            holder.view.content = (args.view);
        }
        let width = this._effectiveColWidth;
        let height = this._effectiveRowHeight;
        if (this._getSpanSize) {
            const spanSize = this._getSpanSize(position);
            const horizontal = this.isHorizontal();
            if (horizontal) {
                height *= spanSize;
            }
            else {
                width *= spanSize;
            }
        }
        if (width || !view.width) {
            view.width = layout.toDeviceIndependentPixels(width);
        }
        if (height || !view.height) {
            view.height = layout.toDeviceIndependentPixels(height);
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onBindViewHolder done ', position);
        }
    }
}
CollectionView.DEFAULT_TEMPLATE_VIEW_TYPE = 0;
CollectionView.CUSTOM_TEMPLATE_ITEM_TYPE = 1;
__decorate([
    profile
], CollectionView.prototype, "createNativeView", null);
__decorate([
    profile
], CollectionView.prototype, "initNativeView", null);
__decorate([
    profile
], CollectionView.prototype, "refresh", null);
__decorate([
    profile
], CollectionView.prototype, "onCreateViewHolder", null);
__decorate([
    profile
], CollectionView.prototype, "onBindViewHolder", null);
let CollectionViewCellHolder;
let CollectionViewRecyclerView;
itemViewCacheSizeProperty.register(CollectionViewBase);
extraLayoutSpaceProperty.register(CollectionViewBase);
//# sourceMappingURL=collectionview.android.js.map