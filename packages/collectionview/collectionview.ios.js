import { ChangeType, Observable, Property, ProxyViewContainer, Trace, Utils, View, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty, profile, ContentView, } from '@nativescript/core';
import { layout } from '@nativescript/core/utils/utils';
import { reorderLongPressEnabledProperty, reorderingEnabledProperty, reverseLayoutProperty, scrollBarIndicatorVisibleProperty } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isBounceEnabledProperty, isScrollEnabledProperty, itemTemplatesProperty, orientationProperty } from './collectionview-common';
export * from './collectionview-common';
const infinity = layout.makeMeasureSpec(0, layout.UNSPECIFIED);
export var ContentInsetAdjustmentBehavior;
(function (ContentInsetAdjustmentBehavior) {
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Always"] = 3] = "Always";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Automatic"] = 0] = "Automatic";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Never"] = 2] = "Never";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["ScrollableAxes"] = 1] = "ScrollableAxes";
})(ContentInsetAdjustmentBehavior || (ContentInsetAdjustmentBehavior = {}));
function parseContentInsetAdjustmentBehavior(value) {
    if (typeof value === 'string') {
        switch (value) {
            case 'always':
                return ContentInsetAdjustmentBehavior.Always;
            case 'never':
                return ContentInsetAdjustmentBehavior.Never;
            case 'scrollableAxes':
                return ContentInsetAdjustmentBehavior.ScrollableAxes;
            default:
            case 'automatic':
                return ContentInsetAdjustmentBehavior.Automatic;
        }
    }
    else {
        return value;
    }
}
export const contentInsetAdjustmentBehaviorProperty = new Property({
    name: 'contentInsetAdjustmentBehavior',
    valueConverter: parseContentInsetAdjustmentBehavior,
    defaultValue: ContentInsetAdjustmentBehavior.Automatic
});
export class CollectionView extends CollectionViewBase {
    constructor() {
        super();
        this._preparingCell = false;
        this.reorderStartingRow = -1;
        this.reorderEndingRow = -1;
        this.manualDragging = false;
        this.scrollEnabledBeforeDragging = true;
        this._map = new Map();
        this._sizes = new Array();
    }
    createNativeView() {
        let layout;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layout = this._layout = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        }
        else {
            layout = this._layout = UICollectionViewFlowLayout.alloc().init();
        }
        if (layout instanceof UICollectionViewFlowLayout) {
            layout.minimumLineSpacing = 0;
            layout.minimumInteritemSpacing = 0;
        }
        const view = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), layout);
        view.backgroundColor = UIColor.clearColor;
        this._itemTemplatesInternal.forEach((t) => {
            view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        });
        view.autoresizesSubviews = false;
        view.autoresizingMask = 0;
        return view;
    }
    onTemplateAdded(t) {
        super.onTemplateAdded(t);
        if (this.nativeViewProtected) {
            this.nativeViewProtected.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        }
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeView;
        this._dataSource = CollectionViewDataSource.initWithOwner(this);
        nativeView.dataSource = this._dataSource;
        const layoutStyle = CollectionViewBase.layoutStyles[this.layoutStyle];
        if (layoutStyle && layoutStyle.createDelegate) {
            this._delegate = layoutStyle.createDelegate();
        }
        else {
            this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
        }
        this._delegate._owner = new WeakRef(this);
        this._measureCellMap = new Map();
        this.nativeView.delegate = this._delegate;
        this._setNativeClipToBounds();
    }
    disposeNativeView() {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'disposeNativeView');
        }
        const nativeView = this.nativeView;
        nativeView.delegate = null;
        this._delegate = null;
        nativeView.dataSource = null;
        this._dataSource = null;
        this._layout = null;
        this.reorderLongPressHandler = null;
        this.reorderLongPressGesture = null;
        this.clearRealizedCells();
        super.disposeNativeView();
    }
    get _childrenCount() {
        return this._map.size;
    }
    getViewForItemAtIndex(index) {
        let result;
        if (this.nativeViewProtected) {
            const cell = this.nativeViewProtected.cellForItemAtIndexPath(NSIndexPath.indexPathForRowInSection(index, 0));
            ;
            return cell === null || cell === void 0 ? void 0 : cell.view;
        }
        return result;
    }
    startDragging(index, pointer) {
        if (this.reorderEnabled && this.nativeViewProtected) {
            this.manualDragging = true;
            this.draggingStartDelta = null;
            if (pointer) {
                const view = this.getViewForItemAtIndex(index);
                if (view) {
                    const size = view.nativeViewProtected.bounds.size;
                    const point = pointer.ios.locationInView(view.nativeViewProtected);
                    this.draggingStartDelta = [point.x - size.width / 2, point.y - size.height / 2];
                }
            }
            this.nativeViewProtected.beginInteractiveMovementForItemAtIndexPath(NSIndexPath.indexPathForRowInSection(index, 0));
            this.scrollEnabledBeforeDragging = this.isScrollEnabled;
            this.nativeViewProtected.scrollEnabled = false;
        }
    }
    onReorderingTouch(event) {
        if (!this.manualDragging) {
            return;
        }
        const collectionView = this.nativeViewProtected;
        const pointer = event.getActivePointers()[0];
        switch (event.action) {
            case 'move':
                let x = pointer.getX();
                let y = pointer.getY();
                if (this.draggingStartDelta) {
                    x -= this.draggingStartDelta[0];
                    y -= this.draggingStartDelta[1];
                }
                collectionView.updateInteractiveMovementTargetPosition(CGPointMake(x, y));
                break;
            case 'up':
                this.manualDragging = false;
                collectionView && collectionView.endInteractiveMovement();
                this.nativeViewProtected.scrollEnabled = this.scrollEnabledBeforeDragging;
                this.handleReorderEnd();
                break;
            case 'cancel':
                this.manualDragging = false;
                collectionView && collectionView.cancelInteractiveMovement();
                this.nativeViewProtected.scrollEnabled = this.scrollEnabledBeforeDragging;
                this.handleReorderEnd();
                break;
        }
    }
    handleReorderEnd() {
        if (!this.reorderEndingRow) {
            this.reorderEndingRow = this.reorderStartingRow;
        }
        const item = this.getItemAtIndex(this.reorderStartingRow);
        this._callItemReorderedEvent(this.reorderStartingRow, this.reorderEndingRow, item);
        this.reorderEndingRow = -1;
        this.reorderEndingRow = -1;
    }
    onReorderLongPress(gesture) {
        const collectionView = this.nativeViewProtected;
        if (!collectionView) {
            return;
        }
        switch (gesture.state) {
            case 1:
                const selectedIndexPath = collectionView.indexPathForItemAtPoint(gesture.locationInView(collectionView));
                collectionView.beginInteractiveMovementForItemAtIndexPath(selectedIndexPath);
                break;
            case 2:
                collectionView.updateInteractiveMovementTargetPosition(gesture.locationInView(collectionView));
                break;
            case 3:
                collectionView.endInteractiveMovement();
                this.handleReorderEnd();
                break;
            default:
                collectionView.cancelInteractiveMovement();
                this.handleReorderEnd();
                break;
        }
    }
    [contentInsetAdjustmentBehaviorProperty.setNative](value) {
        this.nativeViewProtected.contentInsetAdjustmentBehavior = value;
    }
    [paddingTopProperty.setNative](value) {
        this._setPadding({ top: layout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }
    [paddingRightProperty.setNative](value) {
        this._setPadding({ right: layout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }
    [paddingBottomProperty.setNative](value) {
        this._setPadding({ bottom: layout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }
    [paddingLeftProperty.setNative](value) {
        this._setPadding({ left: layout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    }
    [orientationProperty.setNative](value) {
        const layout = this._layout;
        if (layout instanceof UICollectionViewFlowLayout) {
            if (value === 'horizontal') {
                layout.scrollDirection = 1;
            }
            else {
                layout.scrollDirection = 0;
            }
        }
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
    }
    [isScrollEnabledProperty.setNative](value) {
        this.nativeViewProtected.scrollEnabled = value;
        this.scrollEnabledBeforeDragging = value;
    }
    [isBounceEnabledProperty.setNative](value) {
        this.nativeViewProtected.bounces = value;
    }
    [itemTemplatesProperty.getDefault]() {
        return null;
    }
    [reverseLayoutProperty.setNative](value) {
        this.nativeViewProtected.transform = value ? CGAffineTransformMakeRotation(-Math.PI) : null;
    }
    [reorderLongPressEnabledProperty.setNative](value) {
        if (value) {
            if (!this.reorderLongPressGesture) {
                this.reorderLongPressHandler = ReorderLongPressImpl.initWithOwner(new WeakRef(this));
                this.reorderLongPressGesture = UILongPressGestureRecognizer.alloc().initWithTargetAction(this.reorderLongPressHandler, 'longPress');
                this.nativeViewProtected.addGestureRecognizer(this.reorderLongPressGesture);
            }
            else {
                this.reorderLongPressGesture.enabled = true;
            }
        }
        else {
            if (this.reorderLongPressGesture) {
                this.reorderLongPressGesture.enabled = false;
            }
        }
    }
    [reorderingEnabledProperty.setNative](value) {
        if (value) {
            this.on('touch', this.onReorderingTouch, this);
        }
        else {
            this.off('touch', this.onReorderingTouch, this);
        }
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
            this.nativeViewProtected.showsHorizontalScrollIndicator = value;
        }
        else {
            this.nativeViewProtected.showsVerticalScrollIndicator = value;
        }
    }
    eachChildView(callback) {
        this._map.forEach((view, key) => {
            callback(view);
        });
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
        const layoutView = this.nativeViewProtected.collectionViewLayout;
        if ((layoutView instanceof UICollectionViewFlowLayout && this._effectiveColWidth) || this._effectiveRowHeight) {
            layoutView.estimatedItemSize = layoutView.itemSize = CGSizeMake(layout.toDeviceIndependentPixels(this._effectiveColWidth), layout.toDeviceIndependentPixels(this._effectiveRowHeight));
        }
        layoutView.invalidateLayout();
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._lastLayoutKey !== layoutKey) {
            this.refresh();
        }
    }
    isHorizontal() {
        return this.orientation === 'horizontal';
    }
    onSourceCollectionChanged(event) {
        const view = this.nativeViewProtected;
        if (!view || this._dataUpdatesSuspended) {
            return;
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged', ChangeType.Update, event.action, event.index, event.addedCount, event.removed && event.removed.length);
        }
        this.clearCellSize();
        switch (event.action) {
            case ChangeType.Delete: {
                const indexes = NSMutableArray.new();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                }
                this.unbindUnusedCells(event.removed);
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                }
                view.performBatchUpdatesCompletion(() => {
                    view.deleteItemsAtIndexPaths(indexes);
                }, null);
                return;
            }
            case ChangeType.Update: {
                const indexes = NSMutableArray.new();
                indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index, 0));
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'reloadItemsAtIndexPaths', event.index, indexes.count);
                }
                UIView.performWithoutAnimation(() => {
                    view.performBatchUpdatesCompletion(() => {
                        view.reloadItemsAtIndexPaths(indexes);
                    }, null);
                });
                return;
            }
            case ChangeType.Add: {
                const indexes = NSMutableArray.new();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                }
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'insertItemsAtIndexPaths', indexes.count);
                }
                view.performBatchUpdatesCompletion(() => {
                    view.insertItemsAtIndexPaths(indexes);
                }, null);
                return;
            }
            case ChangeType.Splice: {
                view.performBatchUpdatesCompletion(() => {
                    if (event.addedCount > 0) {
                        const indexes = NSMutableArray.alloc().init();
                        for (let index = 0; index < event.addedCount; index++) {
                            indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                        }
                        view.insertItemsAtIndexPaths(indexes);
                    }
                    if (event.removed && event.removed.length > 0) {
                        const indexes = NSMutableArray.new();
                        for (let index = 0; index < event.removed.length; index++) {
                            indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                        }
                        this.unbindUnusedCells(event.removed);
                        if (Trace.isEnabled()) {
                            CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                        }
                        view.performBatchUpdatesCompletion(() => {
                            view.deleteItemsAtIndexPaths(indexes);
                        }, null);
                    }
                }, null);
                return;
            }
        }
        this.refresh();
    }
    onItemTemplatesChanged(oldValue, newValue) {
        super.onItemTemplatesChanged(oldValue, newValue);
        if (!this.nativeViewProtected) {
            return;
        }
        const view = this.nativeViewProtected;
        this._itemTemplatesInternal.forEach((t) => {
            view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        });
    }
    unbindUnusedCells(removedDataItems) {
        this._map.forEach((view, nativeView, map) => {
            if (!view || !view.bindingContext) {
                return;
            }
            if (removedDataItems.indexOf(view.bindingContext) !== -1) {
                view.bindingContext = undefined;
            }
        }, this);
    }
    refreshVisibleItems() {
        const view = this.nativeViewProtected;
        if (!view) {
            return;
        }
        const visibles = view.indexPathsForVisibleItems;
        UIView.performWithoutAnimation(() => {
            view.performBatchUpdatesCompletion(() => {
                view.reloadItemsAtIndexPaths(visibles);
            }, null);
        });
    }
    refresh() {
        if (!this.isLoaded || !this.nativeView) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        this._lastLayoutKey = this._innerWidth + '_' + this._innerHeight;
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'refresh');
        }
        this.clearCellSize();
        this._map.forEach((view, nativeView, map) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }
        });
        this.nativeViewProtected.reloadData();
        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this,
        };
        this.notify(args);
    }
    get scrollOffset() {
        const view = this.nativeViewProtected;
        return (this.isHorizontal() ? view === null || view === void 0 ? void 0 : view.contentOffset.x : view === null || view === void 0 ? void 0 : view.contentOffset.y) || 0;
    }
    get verticalOffsetX() {
        var _a;
        return ((_a = this.nativeViewProtected) === null || _a === void 0 ? void 0 : _a.contentOffset.x) || 0;
    }
    get verticalOffsetY() {
        var _a;
        return ((_a = this.nativeViewProtected) === null || _a === void 0 ? void 0 : _a.contentOffset.y) || 0;
    }
    scrollToIndex(index, animated = true) {
        this.nativeViewProtected.scrollToItemAtIndexPathAtScrollPositionAnimated(NSIndexPath.indexPathForItemInSection(index, 0), this.orientation === 'vertical' ? 1 : 8, animated);
    }
    requestLayout() {
        if (!this._preparingCell) {
            super.requestLayout();
        }
    }
    measure(widthMeasureSpec, heightMeasureSpec) {
        const changed = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        super.measure(widthMeasureSpec, heightMeasureSpec);
        if (changed && this.nativeView) {
            this.nativeView.reloadData();
        }
    }
    _setNativeClipToBounds() {
        this.nativeView.clipsToBounds = true;
    }
    notifyForItemAtIndex(listView, cell, view, eventName, indexPath, bindingContext) {
        const args = { eventName, object: listView, index: indexPath.row, view, ios: cell, bindingContext };
        listView.notify(args);
        return args;
    }
    _getItemTemplateType(indexPath) {
        const selector = this._itemTemplateSelector;
        let type = this._defaultTemplate.key;
        if (selector) {
            type = selector(this.getItemAtIndex(indexPath.item), indexPath.item, this.items);
        }
        return type.toLowerCase();
    }
    getItemTemplateContent(index, templateType) {
        return this.getViewForViewType(ListViewViewTypes.ItemView, templateType);
    }
    _prepareCell(cell, indexPath, templateType, addToMap = true) {
        let cellSize;
        try {
            this._preparingCell = true;
            let view = cell.view;
            const index = indexPath.row;
            let needsLayout = false;
            if (!view) {
                needsLayout = true;
                view = this.getItemTemplateContent(index, templateType);
            }
            const oldBindingContext = view && view.bindingContext;
            const bindingContext = this._prepareItem(view, index);
            needsLayout = needsLayout || oldBindingContext !== bindingContext;
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell', index, !!cell.view, !!view, cell.view !== view, needsLayout, JSON.stringify(oldBindingContext), JSON.stringify(bindingContext));
            }
            const args = this.notifyForItemAtIndex(this, cell, view, CollectionViewBase.itemLoadingEvent, indexPath, bindingContext);
            view = args.view;
            if (view instanceof ProxyViewContainer) {
                const sp = new ContentView();
                sp.content = (view);
                view = sp;
            }
            if (!cell.view) {
                cell.owner = new WeakRef(view);
            }
            else if (cell.view !== view) {
                this._removeContainer(cell);
                cell.view.nativeViewProtected.removeFromSuperview();
                cell.owner = new WeakRef(view);
            }
            if (addToMap) {
                this._map.set(cell, view);
            }
            if (view && !view.parent) {
                this._addView(view);
                const innerView = NSCellView.new();
                innerView.view = new WeakRef(view);
                innerView.addSubview(view.nativeViewProtected);
                cell.contentView.addSubview(innerView);
            }
            cellSize = this.measureCell(cell, view, indexPath);
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell done', index, cellSize);
            }
        }
        finally {
            this._preparingCell = false;
        }
        return cellSize;
    }
    getCellSize(index) {
        let result = this._sizes[index];
        if (!result) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            if (this.spanSize) {
                const spanSize = this.spanSize(index);
                const horizontal = this.isHorizontal();
                if (horizontal) {
                    height *= spanSize;
                }
                else {
                    width *= spanSize;
                }
            }
            if (width && height) {
                result = [width, height];
            }
            else if (height && this.orientation === 'vertical') {
                result = [this.getMeasuredWidth(), height];
            }
            else if (width && this.orientation === 'horizontal') {
                result = [width, this.getMeasuredHeight()];
            }
        }
        return result;
    }
    storeCellSize(index, value) {
        this._sizes[index] = value;
    }
    clearCellSize() {
        this._sizes = new Array();
    }
    measureCell(cell, cellView, index) {
        if (cellView) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            const horizontal = this.isHorizontal();
            if (this.spanSize) {
                const spanSize = this.spanSize(index.row);
                if (horizontal) {
                    height *= spanSize;
                }
                else {
                    width *= spanSize;
                }
            }
            const widthMeasureSpec = width ? layout.makeMeasureSpec(width, layout.EXACTLY) : horizontal ? infinity : layout.makeMeasureSpec(this._innerWidth, layout.UNSPECIFIED);
            const heightMeasureSpec = height ? layout.makeMeasureSpec(height, layout.EXACTLY) : horizontal ? layout.makeMeasureSpec(this._innerHeight, layout.UNSPECIFIED) : infinity;
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, 'measureCell', width, height, widthMeasureSpec, heightMeasureSpec);
            }
            const measuredSize = View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
            const result = [measuredSize.measuredWidth, measuredSize.measuredHeight];
            this.storeCellSize(index.row, result);
            return result;
        }
        return undefined;
    }
    layoutCell(index, cell, cellView) {
        const cellSize = this.getCellSize(index);
        cellView['iosIgnoreSafeArea'] = true;
        View.layoutChild(this, cellView, 0, 0, cellSize[0], cellSize[1]);
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'layoutCell', index, cellView, cellView.getMeasuredWidth(), cellView.getMeasuredHeight());
        }
    }
    clearRealizedCells() {
        const that = new WeakRef(this);
        this._map.forEach(function (value, key) {
            that.get()._removeContainer(key);
            that.get()._clearCellViews(key);
        }, that);
        this._map.clear();
    }
    _clearCellViews(cell) {
        if (cell && cell.view) {
            if (cell.view.nativeViewProtected) {
                cell.view.nativeViewProtected.removeFromSuperview();
            }
            cell.owner = undefined;
        }
    }
    _removeContainer(cell) {
        const view = cell.view;
        if (!(view.parent instanceof CollectionView)) {
            this._removeView(view.parent);
        }
        const preparing = this._preparingCell;
        this._preparingCell = true;
        view.parent._removeView(view);
        this._preparingCell = preparing;
        this._map.delete(cell);
    }
    _setPadding(newPadding) {
        const layout = this._layout;
        if (layout.hasOwnProperty('sectionInset')) {
            const padding = {
                top: layout['sectionInset'].top,
                right: layout['sectionInset'].right,
                bottom: layout['sectionInset'].bottom,
                left: layout['sectionInset'].left,
            };
            const newValue = Object.assign(padding, newPadding);
            layout['sectionInset'] = UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
        }
    }
    numberOfSectionsInCollectionView(collectionView) {
        return 1;
    }
    collectionViewNumberOfItemsInSection(collectionView, section) {
        var _a;
        return ((_a = this.items) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
    collectionViewCellForItemAtIndexPath(collectionView, indexPath) {
        const templateType = this._getItemTemplateType(indexPath);
        let cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(templateType, indexPath);
        if (!cell) {
            cell = CollectionViewCell.new();
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewCellForItemAtIndexPath', indexPath.row, templateType, !!cell.view, cell);
        }
        this._prepareCell(cell, indexPath, templateType);
        const cellView = cell.view;
        if (cellView['isLayoutRequired']) {
            this.layoutCell(indexPath.row, cell, cellView);
        }
        return cell;
    }
    collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath) {
        if (this.reverseLayout) {
            cell.transform = CGAffineTransformMakeRotation(-Math.PI);
        }
        if (this.items) {
            const loadMoreItemIndex = this.items.length - this.loadMoreThreshold;
            if (indexPath.row === loadMoreItemIndex && this.hasListeners(CollectionViewBase.loadMoreItemsEvent)) {
                this.notify({
                    eventName: CollectionViewBase.loadMoreItemsEvent,
                    object: this
                });
            }
        }
        if (cell.preservesSuperviewLayoutMargins) {
            cell.preservesSuperviewLayoutMargins = false;
        }
        if (cell.layoutMargins) {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }
    collectionViewDidSelectItemAtIndexPath(collectionView, indexPath) {
        const cell = collectionView.cellForItemAtIndexPath(indexPath);
        const position = indexPath.row;
        this.notify({
            eventName: CollectionViewBase.itemTapEvent,
            object: this,
            item: this.getItemAtIndex(position),
            index: position,
            view: cell.view,
        });
        cell.highlighted = false;
        return indexPath;
    }
    collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath) {
        const row = indexPath.row;
        let measuredSize = this.getCellSize(row);
        if (!measuredSize) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row);
            }
            const templateType = this._getItemTemplateType(indexPath);
            if (templateType) {
                const measureData = this._measureCellMap.get(templateType);
                let cell = measureData && measureData.cell;
                if (!cell) {
                    cell = CollectionViewCell.new();
                }
                else if (!cell.view) {
                    cell.owner = new WeakRef(measureData.view);
                }
                measuredSize = this._prepareCell(cell, indexPath, templateType, false);
                this._measureCellMap.set(templateType, { cell, view: cell.view });
            }
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row, measuredSize);
        }
        if (measuredSize) {
            return CGSizeMake(layout.toDeviceIndependentPixels(measuredSize[0]), layout.toDeviceIndependentPixels(measuredSize[1]));
        }
        return CGSizeZero;
    }
    scrollViewDidScroll(scrollView) {
        this.notify({
            object: this,
            eventName: CollectionViewBase.scrollEvent,
            scrollOffset: this.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y,
        });
    }
    scrollViewDidEndDecelerating(scrollView) {
        this.notify({
            object: this,
            eventName: CollectionViewBase.scrollEndEvent,
            scrollOffset: this.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y,
        });
    }
    scrollViewWillEndDraggingWithVelocityTargetContentOffset(scrollView, velocity, targetContentOffset) {
    }
}
__decorate([
    profile
], CollectionView.prototype, "refresh", null);
contentInsetAdjustmentBehaviorProperty.register(CollectionView);
var NSCellView = /** @class */ (function (_super) {
    __extends(NSCellView, _super);
    function NSCellView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NSCellView.prototype.layoutSubviews = function () {
        _super.prototype.layoutSubviews.call(this);
        var view = this.view && this.view.get();
        if (!view) {
            return;
        }
        this.frame = this.superview.bounds;
        var size = this.bounds.size;
        View.layoutChild(null, view, 0, 0, Utils.layout.toDevicePixels(size.width), Utils.layout.toDevicePixels(size.height));
    };
    return NSCellView;
}(UIView));
var CollectionViewCell = /** @class */ (function (_super) {
    __extends(CollectionViewCell, _super);
    function CollectionViewCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CollectionViewCell.prototype, "view", {
        get: function () {
            return this.owner ? this.owner.get() : null;
        },
        enumerable: true,
        configurable: true
    });
    return CollectionViewCell;
}(UICollectionViewCell));
var CollectionViewDataSource = /** @class */ (function (_super) {
    __extends(CollectionViewDataSource, _super);
    function CollectionViewDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionViewDataSource.initWithOwner = function (owner) {
        var delegate = CollectionViewDataSource.new();
        delegate._owner = new WeakRef(owner);
        return delegate;
    };
    CollectionViewDataSource.prototype.numberOfSectionsInCollectionView = function (collectionView) {
        var owner = this._owner.get();
        if (owner) {
            return owner.numberOfSectionsInCollectionView(collectionView);
        }
        return 0;
    };
    CollectionViewDataSource.prototype.collectionViewNumberOfItemsInSection = function (collectionView, section) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewNumberOfItemsInSection(collectionView, section);
        }
        return 0;
    };
    CollectionViewDataSource.prototype.collectionViewCellForItemAtIndexPath = function (collectionView, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewCellForItemAtIndexPath(collectionView, indexPath);
        }
        return null;
    };
    CollectionViewDataSource.prototype.collectionViewMoveItemAtIndexPathToIndexPath = function (collectionView, sourceIndexPath, destinationIndexPath) {
        var owner = this._owner.get();
        if (owner) {
            owner.reorderStartingRow = sourceIndexPath.row;
            owner.reorderEndingRow = destinationIndexPath.row;
            owner._reorderItemInSource(sourceIndexPath.row, destinationIndexPath.row, false);
        }
    };
    CollectionViewDataSource.prototype.collectionViewTargetIndexPathForMoveFromItemAtIndexPathToProposedIndexPath = function (collectionView, originalIndexPath, proposedIndexPath) {
        var owner = this._owner.get();
        if (owner) {
            owner.reorderEndingRow = proposedIndexPath.row;
        }
        return proposedIndexPath;
    };
    CollectionViewDataSource.prototype.collectionViewCanMoveItemAtIndexPath = function (collectionView, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            var result = owner.shouldMoveItemAtIndex(indexPath.row);
            if (result) {
                owner.reorderStartingRow = indexPath.row;
            }
            return result;
        }
        return false;
    };
    CollectionViewDataSource.ObjCProtocols = [UICollectionViewDataSource];
    return CollectionViewDataSource;
}(NSObject));
var UICollectionViewDelegateImpl = /** @class */ (function (_super) {
    __extends(UICollectionViewDelegateImpl, _super);
    function UICollectionViewDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UICollectionViewDelegateImpl.initWithOwner = function (owner) {
        var delegate = UICollectionViewDelegateImpl.new();
        delegate._owner = new WeakRef(owner);
        return delegate;
    };
    UICollectionViewDelegateImpl.prototype.collectionViewWillDisplayCellForItemAtIndexPath = function (collectionView, cell, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            owner.collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath);
        }
    };
    UICollectionViewDelegateImpl.prototype.collectionViewDidSelectItemAtIndexPath = function (collectionView, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewDidSelectItemAtIndexPath(collectionView, indexPath);
        }
        return indexPath;
    };
    UICollectionViewDelegateImpl.prototype.collectionViewLayoutSizeForItemAtIndexPath = function (collectionView, collectionViewLayout, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath);
        }
        return CGSizeZero;
    };
    UICollectionViewDelegateImpl.prototype.scrollViewDidScroll = function (scrollView) {
        var owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidScroll(scrollView);
        }
    };
    UICollectionViewDelegateImpl.prototype.scrollViewDidEndDecelerating = function (scrollView) {
        var owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDecelerating(scrollView);
        }
    };
    UICollectionViewDelegateImpl.prototype.scrollViewWillEndDraggingWithVelocityTargetContentOffset = function (scrollView, velocity, targetContentOffset) {
        var owner = this._owner.get();
        if (owner) {
            owner.scrollViewWillEndDraggingWithVelocityTargetContentOffset(scrollView, velocity, targetContentOffset);
        }
    };
    UICollectionViewDelegateImpl.ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];
    return UICollectionViewDelegateImpl;
}(NSObject));
var ReorderLongPressImpl = /** @class */ (function (_super) {
    __extends(ReorderLongPressImpl, _super);
    function ReorderLongPressImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReorderLongPressImpl.initWithOwner = function (owner) {
        var handler = ReorderLongPressImpl.new();
        handler._owner = owner;
        return handler;
    };
    ReorderLongPressImpl.prototype.longPress = function (recognizer) {
        var owner = this._owner && this._owner.get();
        if (owner) {
            owner.onReorderLongPress(recognizer);
        }
    };
    ReorderLongPressImpl.ObjCExposedMethods = {
        longPress: { returns: interop.types.void, params: [interop.types.id] },
    };
    return ReorderLongPressImpl;
}(NSObject));
//# sourceMappingURL=collectionview.ios.js.map