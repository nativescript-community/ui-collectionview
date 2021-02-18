import {
    ChangeType,
    ChangedData,
    EventData,
    KeyedTemplate,
    Length,
    Observable,
    Property,
    ProxyViewContainer,
    TouchGestureEventData,
    Trace,
    Utils,
    View,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty,
    profile,
    ContentView,
} from '@nativescript/core';
import { Pointer } from '@nativescript/core/ui/gestures';
import { layout } from '@nativescript/core/utils/utils';
import { CollectionViewItemDisplayEventData, CollectionViewItemEventData, Orientation, reorderLongPressEnabledProperty, reorderingEnabledProperty, reverseLayoutProperty, scrollBarIndicatorVisibleProperty } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isBounceEnabledProperty, isScrollEnabledProperty, itemTemplatesProperty, orientationProperty } from './collectionview-common';

export * from './collectionview-common';

const infinity = layout.makeMeasureSpec(0, layout.UNSPECIFIED);

export enum ContentInsetAdjustmentBehavior {
    Always = UIScrollViewContentInsetAdjustmentBehavior.Always,
    Automatic = UIScrollViewContentInsetAdjustmentBehavior.Automatic,
    Never = UIScrollViewContentInsetAdjustmentBehavior.Never,
    ScrollableAxes = UIScrollViewContentInsetAdjustmentBehavior.ScrollableAxes
}

function parseContentInsetAdjustmentBehavior(value: string |  number) {
    if (typeof value === 'string') {
        switch(value) {
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
    } else {
        return value;
    }
}
export const contentInsetAdjustmentBehaviorProperty = new Property<CollectionView, ContentInsetAdjustmentBehavior>({
    name: 'contentInsetAdjustmentBehavior',
    valueConverter: parseContentInsetAdjustmentBehavior,
    defaultValue: ContentInsetAdjustmentBehavior.Automatic
});

export class CollectionView extends CollectionViewBase {
    private _layout: UICollectionViewLayout;
    private _dataSource: CollectionViewDataSource;
    private _delegate: UICollectionViewDelegateImpl;
    private _preparingCell: boolean = false;
    private _sizes: number[][];
    private _map: Map<CollectionViewCell, ItemView>;
    _measureCellMap: Map<string, { cell: CollectionViewCell; view: View }>;
    _lastLayoutKey: string;

    reorderLongPressGesture: UILongPressGestureRecognizer;
    reorderLongPressHandler: ReorderLongPressImpl;
    reorderStartingRow = -1;
    reorderEndingRow = -1;

    manualDragging = false;
    scrollEnabledBeforeDragging = true;
    draggingStartDelta: [number, number];

    nativeViewProtected: UICollectionView;

    constructor() {
        super();
        this._map = new Map<CollectionViewCell, View>();
        this._sizes = new Array<number[]>();
    }

    public createNativeView() {
        let layout: UICollectionViewLayout;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layout = this._layout = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        } else {
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
        view.autoresizingMask = UIViewAutoresizing.None;

        return view;
    }

    onTemplateAdded(t) {
        super.onTemplateAdded(t);
        if (this.nativeViewProtected) {
            this.nativeViewProtected.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        }
    }

    public initNativeView() {
        super.initNativeView();

        const nativeView = this.nativeView;
        this._dataSource = CollectionViewDataSource.initWithOwner(this);
        nativeView.dataSource = this._dataSource;

        const layoutStyle = CollectionViewBase.layoutStyles[this.layoutStyle];
        if (layoutStyle && layoutStyle.createDelegate) {
            this._delegate = layoutStyle.createDelegate();
        } else {
            this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
        }
        this._delegate._owner = new WeakRef(this);
        this._measureCellMap = new Map<string, { cell: CollectionViewCell; view: View }>();
        this.nativeView.delegate = this._delegate;

        this._setNativeClipToBounds();
    }

    public disposeNativeView() {
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

    // _onSizeChanged() {
    //     super._onSizeChanged();
    //     this.onSizeChanged(this.getMeasuredWidth(), this.getMeasuredHeight());
    // }

    get _childrenCount(): number {
        return this._map.size;
    }
    public getViewForItemAtIndex(index: number): View {
        let result: View;
        if (this.nativeViewProtected) {
            const cell = this.nativeViewProtected.cellForItemAtIndexPath(NSIndexPath.indexPathForRowInSection(index, 0)) as CollectionViewCell;;
            return cell?.view;
        }

        return result;
    }
    public startDragging(index: number, pointer?: Pointer) {
        if (this.reorderEnabled && this.nativeViewProtected) {
            this.manualDragging = true;
            this.draggingStartDelta = null;
            if (pointer) {
                const view =  this.getViewForItemAtIndex(index);
                if (view) {
                    const size = view.nativeViewProtected.bounds.size;
                    const point = (pointer.ios as UITouch).locationInView(view.nativeViewProtected);
                    this.draggingStartDelta = [point.x - size.width/2, point.y - size.height/2];
                }
            }
            this.nativeViewProtected.beginInteractiveMovementForItemAtIndexPath(NSIndexPath.indexPathForRowInSection(index, 0));
            this.scrollEnabledBeforeDragging = this.isScrollEnabled;
            this.nativeViewProtected.scrollEnabled = false;
        }
    }
    onReorderingTouch(event: TouchGestureEventData) {
        if (!this.manualDragging) {
            return;
        }
        const collectionView = this.nativeViewProtected;
        const pointer  = event.getActivePointers()[0];
        switch(event.action) {
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
        // we call all events from here because the delegate
        // does not handle the case start dragging => cancel or
        // start dragging => end over the same item
        if (!this.reorderEndingRow) {
            this.reorderEndingRow = this.reorderStartingRow;
        }
        const item = this.getItemAtIndex(this.reorderStartingRow);
        this._callItemReorderedEvent(this.reorderStartingRow, this.reorderEndingRow, item);
        this.reorderEndingRow = -1;
        this.reorderEndingRow = -1;
    }
    onReorderLongPress(gesture: UILongPressGestureRecognizer) {
        const collectionView = this.nativeViewProtected;
        if (!collectionView) {
            return;
        }
        switch(gesture.state) {
            case UIGestureRecognizerState.Began:
                const selectedIndexPath = collectionView.indexPathForItemAtPoint(gesture.locationInView(collectionView)) ;
                collectionView.beginInteractiveMovementForItemAtIndexPath(selectedIndexPath);
                break;
            case UIGestureRecognizerState.Changed:
                collectionView.updateInteractiveMovementTargetPosition(gesture.locationInView(collectionView));
                break;
            case UIGestureRecognizerState.Ended:
                collectionView.endInteractiveMovement();
                this.handleReorderEnd();
                break;
            default:
                collectionView.cancelInteractiveMovement();
                this.handleReorderEnd();
                break;
        }
    }

    [contentInsetAdjustmentBehaviorProperty.setNative](value: ContentInsetAdjustmentBehavior) {
        this.nativeViewProtected.contentInsetAdjustmentBehavior = value as any;
    }

    [paddingTopProperty.setNative](value: Length) {
        this._setPadding({ top: layout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }

    [paddingRightProperty.setNative](value: Length) {
        this._setPadding({ right: layout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }

    [paddingBottomProperty.setNative](value: Length) {
        this._setPadding({ bottom: layout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }

    [paddingLeftProperty.setNative](value: Length) {
        this._setPadding({ left: layout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    }

    [orientationProperty.setNative](value: Orientation) {
        const layout = this._layout;
        if (layout instanceof UICollectionViewFlowLayout) {
            if (value === 'horizontal') {
                layout.scrollDirection = UICollectionViewScrollDirection.Horizontal;
            } else {
                layout.scrollDirection = UICollectionViewScrollDirection.Vertical;
            }
        }
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
    }
    [isScrollEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.scrollEnabled = value;
        this.scrollEnabledBeforeDragging = value;
    }
    [isBounceEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.bounces = value;
        // this.nativeViewProtected.alwaysBounceHorizontal = value;
    }

    [itemTemplatesProperty.getDefault](): KeyedTemplate[] {
        return null;
    }
    [reverseLayoutProperty.setNative](value: boolean) {
        this.nativeViewProtected.transform = value ? CGAffineTransformMakeRotation(-Math.PI) : null;
    }
    [reorderLongPressEnabledProperty.setNative](value: boolean) {
        if (value) {
            if (!this.reorderLongPressGesture) {
                this.reorderLongPressHandler = ReorderLongPressImpl.initWithOwner(new WeakRef(this));
                this.reorderLongPressGesture = UILongPressGestureRecognizer.alloc().initWithTargetAction(this.reorderLongPressHandler, 'longPress');
                this.nativeViewProtected.addGestureRecognizer(this.reorderLongPressGesture);
            } else {
                this.reorderLongPressGesture.enabled = true;
            }
        } else {
            if (this.reorderLongPressGesture) {
                this.reorderLongPressGesture.enabled = false;
            }
        }

    }
    [reorderingEnabledProperty.setNative](value: boolean) {
        if (value) {
            this.on('touch', this.onReorderingTouch, this);
        } else {
            this.off('touch', this.onReorderingTouch, this);
        }
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
            this.nativeViewProtected.showsHorizontalScrollIndicator = value;
        } else {
            this.nativeViewProtected.showsVerticalScrollIndicator = value;
        }
    }
    public eachChildView(callback: (child: View) => boolean): void {
        this._map.forEach((view, key) => {
            callback(view);
        });
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

        const layoutView = this.nativeViewProtected.collectionViewLayout;
        if ((layoutView instanceof UICollectionViewFlowLayout && this._effectiveColWidth) || this._effectiveRowHeight) {
            // @ts-ignore
            layoutView.estimatedItemSize = layoutView.itemSize = CGSizeMake(layout.toDeviceIndependentPixels(this._effectiveColWidth), layout.toDeviceIndependentPixels(this._effectiveRowHeight));
        }

        layoutView.invalidateLayout();

        // there is no need to call refresh if it was triggered before with same size.
        // this refresh is just to handle size change
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._lastLayoutKey !== layoutKey) {
            this.refresh();
        }
    }

    public isHorizontal() {
        return this.orientation === 'horizontal';
    }

    public onSourceCollectionChanged(event: ChangedData<any>) {
        const view = this.nativeViewProtected;
        if (!view || this._dataUpdatesSuspended) {
            return;
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged',ChangeType.Update,  event.action, event.index, event.addedCount, event.removed && event.removed.length);
        }
        // we need to clear stored cell sizes and it wont be correct anymore
        this.clearCellSize();

        switch (event.action) {
            case ChangeType.Delete: {
                const indexes = NSMutableArray.new<NSIndexPath>();
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
                const indexes = NSMutableArray.new<NSIndexPath>();
                indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index, 0));
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'reloadItemsAtIndexPaths',event.index, indexes.count);
                }
                UIView.performWithoutAnimation(()=>{
                    view.performBatchUpdatesCompletion(() => {
                        view.reloadItemsAtIndexPaths(indexes);
                    }, null);
                });
                return;
            }
            case ChangeType.Add: {
                const indexes = NSMutableArray.new<NSIndexPath>();
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
                        const indexes = NSMutableArray.alloc<NSIndexPath>().init();
                        for (let index = 0; index < event.addedCount; index++) {
                            indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                        }
                        view.insertItemsAtIndexPaths(indexes);
                    }
                    if (event.removed && event.removed.length > 0) {
                        const indexes = NSMutableArray.new<NSIndexPath>();
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

    private unbindUnusedCells(removedDataItems) {
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
        UIView.performWithoutAnimation(()=>{
            view.performBatchUpdatesCompletion(() => {
                view.reloadItemsAtIndexPaths(visibles);
            }, null);
        });
    }


    @profile
    public refresh() {
        if (!this.isLoaded || !this.nativeView) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        this._lastLayoutKey = this._innerWidth + '_' + this._innerHeight;
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'refresh');
        }
        // we need to clear stored cell sizes and it wont be correct anymore
        this.clearCellSize();

        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this._map.forEach((view, nativeView, map) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }
        });

        // TODO: this is ugly look here: https://github.com/nativescript-vue/nativescript-vue/issues/525
        // this.clearRealizedCells();
        // dispatch_async(main_queue, () => {
        this.nativeViewProtected.reloadData();
        // });

        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this,
        };
        this.notify(args);
    }
    get scrollOffset() {
        const view = this.nativeViewProtected;
        return (this.isHorizontal() ? view?.contentOffset.x : view?.contentOffset.y) || 0;
    }
    get verticalOffsetX() {
        return this.nativeViewProtected?.contentOffset.x || 0;
    }
    get verticalOffsetY() {
        return this.nativeViewProtected?.contentOffset.y || 0;
    }
    public scrollToIndex(index: number, animated: boolean = true) {
        this.nativeViewProtected.scrollToItemAtIndexPathAtScrollPositionAnimated(
            NSIndexPath.indexPathForItemInSection(index, 0),
            this.orientation === 'vertical' ? UICollectionViewScrollPosition.Top : UICollectionViewScrollPosition.Left,
            animated
        );
    }


    public requestLayout(): void {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell) {
            super.requestLayout();
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        const changed = (this as any)._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        super.measure(widthMeasureSpec, heightMeasureSpec);
        if (changed && this.nativeView) {
            this.nativeView.reloadData();
        }
    }

    public _setNativeClipToBounds() {
        this.nativeView.clipsToBounds = true;
    }
    notifyForItemAtIndex(listView: CollectionViewBase, cell: any, view: View, eventName: string, indexPath: NSIndexPath, bindingContext?) {
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
    public _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, templateType: string, addToMap = true) {
        let cellSize: [number, number];
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
            } else if (cell.view !== view) {
                this._removeContainer(cell);
                cell.view.nativeViewProtected.removeFromSuperview();
                cell.owner = new WeakRef(view);
            }

            if (addToMap) {
                this._map.set(cell, view);
            }

            if (view && !view.parent) {
                this._addView(view);
                const innerView = NSCellView.new() as NSCellView;
                innerView.view = new WeakRef(view);
                // view['performLayout'] = ()=>{};
                innerView.addSubview(view.nativeViewProtected);
                cell.contentView.addSubview(innerView);
            }
            cellSize = this.measureCell(cell, view, indexPath);

            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell done', index, cellSize);
            }
        } finally {
            this._preparingCell = false;
        }
        return cellSize;
    }
    public getCellSize(index: number) {
        let result = this._sizes[index];
        // CLog(CLogTypes.log, 'getCellSize', index, result, this._effectiveColWidth, this._effectiveRowHeight, this.getMeasuredWidth(), this.getMeasuredHeight());
        if (!result) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            if (this.spanSize) {
                const spanSize = this.spanSize(index);
                const horizontal = this.isHorizontal();
                if (horizontal) {
                    height *= spanSize;
                } else {
                    width *= spanSize;
                }
            }
            if (width && height) {
                result = [width, height];
            } else if (height && this.orientation === 'vertical') {
                result = [this.getMeasuredWidth(), height];
            } else if (width && this.orientation === 'horizontal') {
                result = [width, this.getMeasuredHeight()];
            }
        }

        // return undefined;
        return result;
    }
    public storeCellSize(index: number, value) {
        this._sizes[index] = value;
    }
    public clearCellSize() {
        this._sizes = new Array<number[]>();
    }
    private measureCell(cell: CollectionViewCell, cellView: View, index: NSIndexPath): [number, number] {
        if (cellView) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            const horizontal = this.isHorizontal();
            if (this.spanSize) {
                const spanSize = this.spanSize(index.row);
                if (horizontal) {
                    height *= spanSize;
                } else {
                    width *= spanSize;
                }
            }

            const widthMeasureSpec = width ? layout.makeMeasureSpec(width, layout.EXACTLY) : horizontal ? infinity : layout.makeMeasureSpec(this._innerWidth, layout.UNSPECIFIED);
            const heightMeasureSpec = height ? layout.makeMeasureSpec(height, layout.EXACTLY) : horizontal ? layout.makeMeasureSpec(this._innerHeight, layout.UNSPECIFIED) : infinity;
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, 'measureCell', width, height, widthMeasureSpec, heightMeasureSpec);
            }
            const measuredSize = View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
            const result: [number, number] = [measuredSize.measuredWidth, measuredSize.measuredHeight];

            this.storeCellSize(index.row, result);
            return result;
        }
        return undefined;
    }
    layoutCell(index: number, cell: CollectionViewCell, cellView: View): any {
        const cellSize = this.getCellSize(index);
        cellView['iosIgnoreSafeArea'] = true;
        View.layoutChild(this, cellView, 0, 0, cellSize[0], cellSize[1]);
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'layoutCell', index, cellView,  cellView.getMeasuredWidth(), cellView.getMeasuredHeight());
        }
    }

    private clearRealizedCells() {
        const that = new WeakRef<CollectionView>(this);
        this._map.forEach(function (value, key: CollectionViewCell) {
            that.get()._removeContainer(key);
            that.get()._clearCellViews(key);
        }, that);
        this._map.clear();
    }

    private _clearCellViews(cell: CollectionViewCell) {
        if (cell && cell.view) {
            if (cell.view.nativeViewProtected) {
                cell.view.nativeViewProtected.removeFromSuperview();
            }

            cell.owner = undefined;
        }
    }

    private _removeContainer(cell: CollectionViewCell): void {
        const view = cell.view;
        // This is to clear the StackLayout that is used to wrap ProxyViewContainer instances.
        if (!(view.parent instanceof CollectionView)) {
            this._removeView(view.parent);
        }
        // No need to request layout when we are removing cells.
        const preparing = this._preparingCell;
        this._preparingCell = true;
        view.parent._removeView(view);
        this._preparingCell = preparing;
        this._map.delete(cell);
    }

    private _setPadding(newPadding: { top?: number; right?: number; bottom?: number; left?: number }) {
        const layout = this._layout;
        if (layout.hasOwnProperty('sectionInset')) {
            const padding = {
                top: layout['sectionInset'].top,
                right: layout['sectionInset'].right,
                bottom: layout['sectionInset'].bottom,
                left: layout['sectionInset'].left,
            };
            // tslint:disable-next-line:prefer-object-spread
            const newValue = Object.assign(padding, newPadding);
            layout['sectionInset'] = UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
        }
    }

    numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        return 1;
    }

    collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
        return this.items?.length || 0;
    }

    collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        const templateType = this._getItemTemplateType(indexPath);
        let cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(templateType, indexPath) as CollectionViewCell;
        if (!cell) {
            cell = CollectionViewCell.new() as CollectionViewCell;
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewCellForItemAtIndexPath', indexPath.row, templateType, !!cell.view, cell);
        }
        this._prepareCell(cell, indexPath, templateType);

        const cellView: View = cell.view;
        if (cellView['isLayoutRequired']) {
            this.layoutCell(indexPath.row, cell, cellView);
        }
        return cell;
    }
    collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        if (this.reverseLayout) {
            cell.transform = CGAffineTransformMakeRotation(-Math.PI);
        }
        if (this.items) {
            const loadMoreItemIndex = this.items.length - this.loadMoreThreshold;
            if (indexPath.row === loadMoreItemIndex && this.hasListeners(CollectionViewBase.loadMoreItemsEvent)) {
                this.notify<EventData>({
                    eventName: CollectionViewBase.loadMoreItemsEvent,
                    object: this
                });
            }
        }
        // if (this.hasListeners(CollectionViewBase.displayItemEvent) ) {
        //     this.notify<CollectionViewItemDisplayEventData>({
        //         eventName: CollectionViewBase.displayItemEvent,
        //         index:indexPath.row,
        //         object: this,
        //     });
        // }

        if (cell.preservesSuperviewLayoutMargins) {
            cell.preservesSuperviewLayoutMargins = false;
        }

        if (cell.layoutMargins) {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }
    collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const cell = collectionView.cellForItemAtIndexPath(indexPath) as CollectionViewCell;
        const position = indexPath.row;
        this.notify<CollectionViewItemEventData>({
            eventName: CollectionViewBase.itemTapEvent,
            object: this,
            item: this.getItemAtIndex(position),
            index: position,
            view: cell.view,
        });

        cell.highlighted = false;

        return indexPath;
    }
    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        const row = indexPath.row;
        let measuredSize = this.getCellSize(row);
        if (!measuredSize) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row);
            }
            const templateType = this._getItemTemplateType(indexPath);
            if (templateType) {
                const measureData: any = this._measureCellMap.get(templateType);
                let cell: any = measureData && measureData.cell;
                if (!cell) {
                    cell = CollectionViewCell.new();
                } else if (!cell.view) {
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
    scrollViewDidScroll(scrollView: UIScrollView): void {
        this.notify({
            object: this,
            eventName: CollectionViewBase.scrollEvent,
            scrollOffset: this.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y,
        });
    }
    scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        this.notify({
            object: this,
            eventName: CollectionViewBase.scrollEndEvent,
            scrollOffset: this.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y,
        });
    }
    scrollViewWillEndDraggingWithVelocityTargetContentOffset?(scrollView: UIScrollView, velocity: CGPoint, targetContentOffset: interop.Pointer | interop.Reference<CGPoint>): void {
    //     this.notify({
    //         object: this,
    //         eventName: CollectionViewBase.scrollWillEndEvent,
    //         scrollOffset: this.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y,
    //     });
    }
}
contentInsetAdjustmentBehaviorProperty.register(CollectionView);

interface ViewItemIndex {
}

type ItemView = View & ViewItemIndex;

@NativeClass
class NSCellView extends UIView {
    view: WeakRef<View>;
    layoutSubviews() {
        super.layoutSubviews();
        const view = this.view && this.view.get();
        if (!view) {
            return;
        }
        this.frame = this.superview.bounds;
        const size = this.bounds.size;
        View.layoutChild(null, view, 0, 0, Utils.layout.toDevicePixels(size.width), Utils.layout.toDevicePixels(size.height));
    }
}

@NativeClass
class CollectionViewCell extends UICollectionViewCell {
    owner: WeakRef<ItemView>;

    get view(): ItemView {
        return this.owner ? this.owner.get() : null;
    }
}

@NativeClass
class CollectionViewDataSource extends NSObject implements UICollectionViewDataSource {
    _owner: WeakRef<CollectionView>;
    public static ObjCProtocols = [UICollectionViewDataSource];

    static initWithOwner(owner: CollectionView) {
        const delegate = CollectionViewDataSource.new() as CollectionViewDataSource;
        delegate._owner = new WeakRef(owner);
        return delegate;
    }
    numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        const owner = this._owner.get();
        if (owner) {
            return owner.numberOfSectionsInCollectionView(collectionView);
        }
        return 0;
    }

    collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewNumberOfItemsInSection(collectionView, section);
        }
        return 0;
    }

    collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewCellForItemAtIndexPath(collectionView, indexPath);
        }
        return null;
    }
    collectionViewMoveItemAtIndexPathToIndexPath(collectionView: UICollectionView, sourceIndexPath: NSIndexPath, destinationIndexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            owner.reorderStartingRow = sourceIndexPath.row;
            owner.reorderEndingRow = destinationIndexPath.row;
            owner._reorderItemInSource(sourceIndexPath.row, destinationIndexPath.row, false);
        }
    }
    collectionViewTargetIndexPathForMoveFromItemAtIndexPathToProposedIndexPath?(collectionView: UICollectionView, originalIndexPath: NSIndexPath, proposedIndexPath: NSIndexPath): NSIndexPath {
        const owner = this._owner.get();
        if (owner) {
            owner.reorderEndingRow = proposedIndexPath.row;
        }
        return proposedIndexPath;
    }
    collectionViewCanMoveItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            const result = owner.shouldMoveItemAtIndex(indexPath.row);
            if (result) {
                owner.reorderStartingRow = indexPath.row;
            }
            return result;
        }
        return false;
    }
}
@NativeClass
class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    _owner: WeakRef<CollectionView>;
    public static ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];

    static initWithOwner(owner: CollectionView) {
        const delegate = UICollectionViewDelegateImpl.new() as UICollectionViewDelegateImpl;
        delegate._owner = new WeakRef(owner);
        return delegate;
    }
    collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            owner.collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath);
        }
    }
    collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewDidSelectItemAtIndexPath(collectionView, indexPath);
        }
        return indexPath;
    }
    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath);
        }
        return CGSizeZero;
    }
    scrollViewDidScroll(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidScroll(scrollView);
        }
    }
    scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDecelerating(scrollView);
        }
    }
    scrollViewWillEndDraggingWithVelocityTargetContentOffset?(scrollView: UIScrollView, velocity: CGPoint, targetContentOffset: interop.Pointer | interop.Reference<CGPoint>): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewWillEndDraggingWithVelocityTargetContentOffset(scrollView, velocity, targetContentOffset);
        }
    }
}


@NativeClass
class ReorderLongPressImpl extends NSObject {
    private _owner: WeakRef<CollectionView>;

    public static initWithOwner(owner: WeakRef<CollectionView>): ReorderLongPressImpl {
        const handler = ReorderLongPressImpl.new() as ReorderLongPressImpl;
        handler._owner = owner;
        return handler;
    }

    public longPress(recognizer: UILongPressGestureRecognizer): void {
        const owner = this._owner && this._owner.get();
        if (owner) {
            owner.onReorderLongPress(recognizer);
        }
    }

    public static ObjCExposedMethods = {
        longPress: { returns: interop.types.void, params: [interop.types.id] },
    };
}

