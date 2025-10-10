import {
    ChangeType,
    ChangedData,
    ContentView,
    CoreTypes,
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
    ViewBase,
    booleanConverter,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty,
    profile
} from '@nativescript/core';
import { Pointer } from '@nativescript/core/ui/gestures';
import {
    CollectionViewItemDisplayEventData,
    CollectionViewItemEventData,
    Orientation,
    reorderLongPressEnabledProperty,
    reorderingEnabledProperty,
    reverseLayoutProperty,
    scrollBarIndicatorVisibleProperty
} from '.';
import { CLog, CLogTypes, CollectionViewBase, ListViewViewTypes, isBounceEnabledProperty, isScrollEnabledProperty, itemTemplatesProperty, orientationProperty } from './index-common';

export * from './index-common';

const infinity = Utils.layout.makeMeasureSpec(0, Utils.layout.UNSPECIFIED);

export enum ContentInsetAdjustmentBehavior {
    Always = UIScrollViewContentInsetAdjustmentBehavior.Always,
    Automatic = UIScrollViewContentInsetAdjustmentBehavior.Automatic,
    Never = UIScrollViewContentInsetAdjustmentBehavior.Never,
    ScrollableAxes = UIScrollViewContentInsetAdjustmentBehavior.ScrollableAxes
}

function parseContentInsetAdjustmentBehavior(value: string | number) {
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
    } else {
        return value;
    }
}
export const contentInsetAdjustmentBehaviorProperty = new Property<CollectionView, ContentInsetAdjustmentBehavior>({
    name: 'contentInsetAdjustmentBehavior',
    valueConverter: parseContentInsetAdjustmentBehavior,
    defaultValue: ContentInsetAdjustmentBehavior.Automatic
});

export const estimatedItemSizeProperty = new Property<CollectionView, boolean>({
    name: 'estimatedItemSize',
    defaultValue: true,
    valueConverter: booleanConverter
});

export const autoSizeProperty = new Property<CollectionView, boolean>({
    name: 'autoSize',
    defaultValue: false,
    valueConverter: booleanConverter
});

export enum SnapPosition {
    START = -1, // = androidx.recyclerview.widget.LinearSmoothScroller.SNAP_TO_START,
    END = 1 // = androidx.recyclerview.widget.LinearSmoothScroller.SNAP_TO_END
}


export class CollectionView extends CollectionViewBase {
    //TODO: remove as it needs to be added after TS 5.7 change https://github.com/microsoft/TypeScript/pull/59860
    [key: symbol]: (...args: any[]) => any | void;

    _layout: UICollectionViewLayout;
    _dataSource: CollectionViewDataSource;
    _delegate: UICollectionViewDelegateImpl | UICollectionViewDelegateFixedSizeImpl;
    private _preparingCell: boolean = false;
    private _refreshingVisible: boolean = false;
    // private _sizes: number[][];
    private _map: Map<CollectionViewCell, ItemView>;
    _measureCellMap: Map<string, { cell: CollectionViewCell; view: View }>;
    _lastLayoutKey: string;

    autoSize = false;

    reorderLongPressGesture: UILongPressGestureRecognizer;
    reorderLongPressHandler: ReorderLongPressImpl;
    reorderStartingRow = -1;
    reorderEndingRow = -1;

    manualDragging = false;
    scrollEnabledBeforeDragging = true;
    estimatedItemSize = true;
    draggingStartDelta: [number, number];

    nativeViewProtected: UICollectionView;
    // dragDelegate: UICollectionViewDragDelegateImpl;
    // dropDelegate: UICollectionViewDropDelegateImpl;

    constructor() {
        super();
        this._map = new Map<CollectionViewCell, View>();
        // this._sizes = new Array<number[]>();
    }

    public createNativeView() {
        let layout: UICollectionViewLayout;
        if (CollectionViewBase.layoutStyles[this.layoutStyle]) {
            layout = this._layout = CollectionViewBase.layoutStyles[this.layoutStyle].createLayout(this);
        } else {
            layout = this._layout = UICollectionViewFlowLayoutImpl.initWithOwner(this);
            // layout = this._layout = UICollectionViewFlowLayout.new();
        }
        if (layout instanceof UICollectionViewFlowLayout) {
            layout.minimumLineSpacing = 0;
            layout.minimumInteritemSpacing = 0;
        }
        // const view = UICollectionViewImpl.initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), layout) as UICollectionViewImpl;

        const view = UICollectionViewImpl.initWithOwner(this, layout);
        view.backgroundColor = UIColor.clearColor;
        this._itemTemplatesInternal.forEach((t) => {
            view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        });
        view.autoresizesSubviews = false;
        view.autoresizingMask = UIViewAutoresizing.None;
        this.lastContentOffset = view.contentOffset;

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

        const nativeView = this.nativeViewProtected;
        this._dataSource = CollectionViewDataSource.initWithOwner(this);
        nativeView.dataSource = this._dataSource;

        // this.dragDelegate = nativeView.dragDelegate = UICollectionViewDragDelegateImpl.initWithOwner(this);
        // this.dropDelegate = nativeView.dropDelegate = UICollectionViewDropDelegateImpl.initWithOwner(this);

        // delegate will be set in first onLayout because we need computed _effectiveColWidth and _effectiveRowHeight

        this._measureCellMap = new Map<string, { cell: CollectionViewCell; view: View }>();

        // waterfall requires the delegate to be set as soon as possible
        // but default delegates need _effectiveRowHeight and _effectiveColWidth
        // so we need to wait
        const layoutStyle = CollectionViewBase.layoutStyles[this.layoutStyle];
        if (layoutStyle && layoutStyle.createDelegate) {
            this._delegate = layoutStyle.createDelegate(this);
            this.nativeViewProtected.delegate = this._delegate;
        } else if (this.autoSize) {
            this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
            this.nativeViewProtected.delegate = this._delegate;
        }

        this._setNativeClipToBounds();
    }

    public disposeNativeView() {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'disposeNativeView');
        }
        const nativeView = this.nativeViewProtected;
        nativeView.delegate = null;
        // nativeView.dragDelegate = null;
        // nativeView.dropDelegate = null;
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
    onLoaded() {
        super.onLoaded();
        // we need refreshVisibleItems
        // if some items were updated while unloaded they wont re layout
        // after this (because we are not a Layout view)
        this.refreshVisibleItems();
    }
    eachChild(callback: (child: ViewBase) => boolean) {
        // used for css updates (like theme change)
        this._map.forEach((view) => {
            if (view.parent instanceof CollectionView) {
                callback(view);
            } else {
                // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                if (view.parent) {
                    callback(view.parent);
                }
            }
        });
        // we need to call on measure cells too
        // otherwise they would not get notified of some css changes
        // like fontScale change
        this._measureCellMap?.forEach((view) => {
            callback(view.view);
        });
    }

    async eachChildAsync(callback) {
        // used for css updates (like theme change)
        const children = [...this._map.values()];
        for (let index = 0; index < children.length; index++) {
            const view = children[index];
            if (view.parent instanceof CollectionView) {
                await callback(view);
            } else {
                // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                if (view.parent) {
                    await callback(view.parent);
                }
            }
        }
    }
    public getViewForItemAtIndex(index: number): View {
        let result: View;
        if (this.nativeViewProtected) {
            // when the collectionview is not loaded anymore, cellForItemAtIndexPath wont return
            // then we use our cached map to get the view
            const cell = this.nativeViewProtected.cellForItemAtIndexPath(NSIndexPath.indexPathForRowInSection(index, 0)) as CollectionViewCell;
            if (cell) {
                return cell?.view;
            } else {
                for (const [cell, view] of this._map) {
                    if (cell.currentIndex === index) {
                        return view;
                    }
                }
            }
        }

        return result;
    }
    public startDragging(index: number, pointer?: Pointer) {
        if (this.reorderEnabled && this.nativeViewProtected) {
            this.manualDragging = true;
            this.draggingStartDelta = null;
            if (pointer) {
                const view = this.getViewForItemAtIndex(index);
                if (view) {
                    const size = view.nativeViewProtected.bounds.size;
                    const point = (pointer.ios as UITouch).locationInView(view.nativeViewProtected);
                    this.draggingStartDelta = [point.x - size.width / 2, point.y - size.height / 2];
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
        if (!this.draggingStartDelta) {
            return;
        }
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
        this.draggingStartDelta = null;
    }
    onReorderLongPress(gesture: UILongPressGestureRecognizer) {
        const collectionView = this.nativeViewProtected;
        if (!collectionView) {
            return;
        }
        switch (gesture.state) {
            case UIGestureRecognizerState.Began: {
                let point = gesture.locationInView(collectionView);
                const selectedIndexPath = collectionView.indexPathForItemAtPoint(point);
                if (selectedIndexPath) {
                    const view = this.getViewForItemAtIndex(selectedIndexPath.row);
                    if (view) {
                        const size = view.nativeViewProtected.bounds.size;
                        point = gesture.locationInView(view.nativeViewProtected);
                        this.draggingStartDelta = [point.x - size.width / 2, point.y - size.height / 2];
                    }
                    collectionView.beginInteractiveMovementForItemAtIndexPath(selectedIndexPath);
                } else {
                    // disable and enable to cancel the current gesture
                    gesture.enabled = false;
                    gesture.enabled = true;
                }
                
                break;
            }
            case UIGestureRecognizerState.Changed: {
                const point = gesture.locationInView(collectionView);
                let x = point.x;
                let y = point.y;
                if (this.draggingStartDelta) {
                    x -= this.draggingStartDelta[0];
                    y -= this.draggingStartDelta[1];
                }
                collectionView.updateInteractiveMovementTargetPosition(CGPointMake(x, y));
                break;
            }
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

    [paddingTopProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ top: Utils.layout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }

    [paddingRightProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ right: Utils.layout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }

    [paddingBottomProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ bottom: Utils.layout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }

    [paddingLeftProperty.setNative](value: CoreTypes.LengthType) {
        this._setPadding({ left: Utils.layout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
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

        const layoutView = this.nativeViewProtected?.collectionViewLayout;
        if (!layoutView) {
            return;
        }
        const p = CollectionViewBase.plugins[this.layoutStyle];
        if (p && p.onLayout) {
            p.onLayout(this, left, top, right, bottom);
        }
        this.plugins.forEach((k) => {
            const p = CollectionViewBase.plugins[k];
            p.onLayout && p.onLayout(this, left, top, right, bottom);
        });

        if (!this._delegate) {
            const layoutStyle = CollectionViewBase.layoutStyles[this.layoutStyle];
            if (layoutStyle && layoutStyle.createDelegate) {
                this._delegate = layoutStyle.createDelegate(this);
            } else {
                // if we use fixed col and row size we want a delegate
                // without collectionViewLayoutSizeForItemAtIndexPath
                // because it is not needed and faster
                if (this._effectiveColWidth && this._effectiveRowHeight) {
                    this._delegate = UICollectionViewDelegateFixedSizeImpl.initWithOwner(this);
                } else {
                    this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
                }
            }
            // this._delegate._owner = new WeakRef(this);
            this.nativeViewProtected.delegate = this._delegate;
        }
        this.updateRowColSize();

        // there is no need to call refresh if it was triggered before with same size.
        // this refresh is just to handle size change
        const layoutKey = this._innerWidth + '_' + this._innerHeight;
        if (this._lastLayoutKey !== layoutKey) {
            this.refresh();
        }
    }

    updateRowColSize() {
        const layoutView = this.nativeViewProtected?.collectionViewLayout;
        if (layoutView instanceof UICollectionViewFlowLayout) {
            if (this._effectiveRowHeight && this._effectiveColWidth) {
                layoutView.itemSize = CGSizeMake(Utils.layout.toDeviceIndependentPixels(this._effectiveColWidth), Utils.layout.toDeviceIndependentPixels(this._effectiveRowHeight));
            } else if (this.estimatedItemSize && !this.autoSize) {
                layoutView.estimatedItemSize = CGSizeMake(Utils.layout.toDeviceIndependentPixels(this._effectiveColWidth), Utils.layout.toDeviceIndependentPixels(this._effectiveRowHeight));
            }
            layoutView.invalidateLayout();
        }
    }

    _onRowHeightPropertyChanged(oldValue, newValue) {
        this.updateRowColSize();
        this.refresh();
    }
    _onColWidthPropertyChanged(oldValue, newValue) {
        this.updateRowColSize();
        this.refresh();
    }

    public isHorizontal() {
        return this.orientation === 'horizontal';
    }

    public clearCachedSize(...indexes: number[]) {
        const sizes: NSMutableArray<NSValue> = this._delegate instanceof UICollectionViewDelegateImpl ? this._delegate.cachedSizes : null;
        if (sizes) {
            indexes.forEach((index) => {
                if (index < sizes.count) {
                    sizes.replaceObjectAtIndexWithObject(index, NSValue.valueWithCGSize(CGSizeZero));
                }
            });
        }
    }
    public layoutAttributesForElementsInRect(attributesArray: NSArray<UICollectionViewLayoutAttributes>, rect: CGRect) {
        if (this.itemOverlap) {
            let currentDeltaX = 0;
            let currentDeltaY = 0;
            for (let index = 0; index < attributesArray.count; index++) {
                const attributes = attributesArray.objectAtIndex(index);
                if (attributes.representedElementCategory === UICollectionElementCategory.Cell) {
                    const row = attributes.indexPath.row;
                    if (this.itemOverlap) {
                        attributes.zIndex = row;
                    }
                    const itemOverlap = this.itemOverlap(this.getItemAtIndex(row), row);
                    currentDeltaX += Utils.layout.toDeviceIndependentPixels(Length.toDevicePixels(itemOverlap[1], 0) + Length.toDevicePixels(itemOverlap[3], 0));
                    currentDeltaY += Utils.layout.toDeviceIndependentPixels(Length.toDevicePixels(itemOverlap[0], 0) + Length.toDevicePixels(itemOverlap[2], 0));
                    attributes.center = CGPointMake(attributes.center.x + currentDeltaX, attributes.center.y + currentDeltaY);
                }
            }
        }
    }

    public onSourceCollectionChanged(event: ChangedData<any>) {
        const view = this.nativeViewProtected;
        if (!view || this._dataUpdatesSuspended || !this._lastLayoutKey) {
            return;
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged', ChangeType.Update, event.action, event.index, event.addedCount, event.removed && event.removed.length);
        }

        // we need to clear stored cell sizes and it wont be correct anymore
        // this.clearCellSize();

        const sizes: NSMutableArray<NSValue> = this._delegate instanceof UICollectionViewDelegateImpl ? this._delegate.cachedSizes : null;
        const performBatchUpdatesCompletion = (c) => {
            // if we are not "presented" (viewController hidden) then performBatchUpdatesCompletion would crash
            const viewIsLoaded = !!this.page?.viewController ? !!this.page.viewController.view.window : true;
            if (viewIsLoaded) {
                view.performBatchUpdatesCompletion(c, null);
            } else {
                this.refresh();
            }
        };

        switch (event.action) {
            case ChangeType.Delete: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                    if (sizes) {
                        sizes.removeObjectAtIndex(event.index);
                    }
                }
                // this._sizes.splice(event.index, event.addedCount);
                this.unbindUnusedCells(event.removed);
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                }
                performBatchUpdatesCompletion(() => {
                    view.deleteItemsAtIndexPaths(indexes);
                });
                return;
            }
            case ChangeType.Update: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index, 0));
                if (sizes && event.index < sizes.count) {
                    sizes.replaceObjectAtIndexWithObject(event.index, NSValue.valueWithCGSize(CGSizeZero));
                }
                // this._sizes[event.index] = null;
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'reloadItemsAtIndexPaths', event.index, indexes.count);
                }

                performBatchUpdatesCompletion(() => {
                    view.reloadItemsAtIndexPaths(indexes);
                });
                return;
            }
            case ChangeType.Add: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                    if (sizes) {
                        sizes.insertObjectAtIndex(NSValue.valueWithCGSize(CGSizeZero), event.index);
                    }
                    // this._sizes.splice(index, 0, null);
                }
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'insertItemsAtIndexPaths', indexes.count);
                }
                performBatchUpdatesCompletion(() => {
                    view.insertItemsAtIndexPaths(indexes);
                });
                return;
            }
            case ChangeType.Splice: {
                performBatchUpdatesCompletion(() => {
                    const added = event.addedCount;
                    const removed = (event.removed && event.removed.length) || 0;
                    if (added > 0 && added === removed) {
                        const indexes = NSMutableArray.new<NSIndexPath>();
                        for (let index = 0; index < added; index++) {
                            indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                            if (sizes && event.index + index < sizes.count) {
                                sizes.replaceObjectAtIndexWithObject(event.index + index, NSValue.valueWithCGSize(CGSizeZero));
                            }
                            // this._sizes[event.index + index] = null;
                        }
                        view.reloadItemsAtIndexPaths(indexes);
                    } else {
                        if (event.removed && event.removed.length > 0) {
                            const indexes = NSMutableArray.new<NSIndexPath>();
                            for (let index = 0; index < event.removed.length; index++) {
                                indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                                if (sizes) {
                                    sizes.removeObjectAtIndex(event.index);
                                }
                            }
                            // this._sizes.splice(event.index, event.removed.length);
                            this.unbindUnusedCells(event.removed);
                            if (Trace.isEnabled()) {
                                CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                            }
                            view.deleteItemsAtIndexPaths(indexes);
                        }
                        if (event.addedCount > 0) {
                            const indexes = NSMutableArray.alloc<NSIndexPath>().init();
                            for (let index = 0; index < event.addedCount; index++) {
                                indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                                if (sizes) {
                                    sizes.insertObjectAtIndex(NSValue.valueWithCGSize(CGSizeZero), event.index);
                                }
                                // this._sizes.splice(event.index, 0, null);
                            }
                            if (Trace.isEnabled()) {
                                CLog(CLogTypes.info, 'insertItemsAtIndexPaths', indexes.count);
                            }
                            view.insertItemsAtIndexPaths(indexes);
                        }
                    }
                    // view.collectionViewLayout.invalidateLayout();
                });
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
        this._refreshingVisible = true;
        const sizes: NSMutableArray<NSValue> = this._delegate instanceof UICollectionViewDelegateImpl ? this._delegate.cachedSizes : null;

        const visibles = view.indexPathsForVisibleItems;
        if (visibles.count <= 0) {
            return;
        }

        if (sizes) {
            const indexes: NSIndexPath[] = Array.from(visibles);
            indexes.forEach((value) => {
                if (value.row < sizes.count) {
                    sizes.replaceObjectAtIndexWithObject(value.row, NSValue.valueWithCGSize(CGSizeZero));
                }
            });
        }

        UIView.performWithoutAnimation(() => {
            view.performBatchUpdatesCompletion(
                () => {
                    view.reloadItemsAtIndexPaths(visibles);
                },
                () => {
                    this._refreshingVisible = false;
                }
            );
        });
    }
    public isItemAtIndexVisible(itemIndex: number): boolean {
        const view = this.nativeViewProtected;
        if (!view) {
            return false;
        }
        const indexes: NSIndexPath[] = Array.from(view.indexPathsForVisibleItems);

        return indexes.some((visIndex) => visIndex.row === itemIndex);
    }
    public findFirstVisibleItemIndex() {
        const view = this.nativeViewProtected;
        if (!view) {
            return -1;
        }

        return this.getRowIndexPath(view)[0] ?? -1;
    }
    public findLastVisibleItemIndex() {
        const view = this.nativeViewProtected;
        if (!view) {
            return -1;
        }
        return this.getRowIndexPath(view).at(-1) ?? -1;
    }

    private getRowIndexPath(view: UICollectionView) {
        return Array.from<NSIndexPath>(view.indexPathsForVisibleItems)
            .map((e) => e.row)
            .sort((a, b) => a - b);
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
        // this.clearCellSize();
        const sizes: NSMutableArray<NSValue> = this._delegate instanceof UICollectionViewDelegateImpl ? this._delegate.cachedSizes : null;
        if (sizes) {
            sizes.removeAllObjects();
        }

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
        this.notify({ eventName: CollectionViewBase.dataPopulatedEvent });
    }
    //@ts-ignore
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
    public scrollToIndex(index: number, animated: boolean = true, snap: SnapPosition = SnapPosition.START) {
        const nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return;
        }
        const nbItems = nativeView.numberOfItemsInSection(0);
        if (nbItems > 0 && index < nbItems) {
            let scrollPosition = UICollectionViewScrollPosition.Top;
            if (this.orientation === 'vertical') {
                scrollPosition = snap === SnapPosition.START ? UICollectionViewScrollPosition.Top : UICollectionViewScrollPosition.Bottom;
            } else {
                scrollPosition = snap === SnapPosition.START ? UICollectionViewScrollPosition.Left : UICollectionViewScrollPosition.Right;
            }
            nativeView.scrollToItemAtIndexPathAtScrollPositionAnimated(NSIndexPath.indexPathForItemInSection(index, 0), scrollPosition, animated);
        }
    }

    scrollToOffset(value, animated) {
        const view = this.nativeViewProtected;
        if (view && this.isScrollEnabled) {
            const { width, height } = view.bounds.size;
            let rect: CGRect;
            if (this.orientation === 'vertical') {
                rect = CGRectMake(0, value, width, height);
            } else {
                rect = CGRectMake(value, 0, width, height);
            }
            if (rect) {
                view.scrollRectToVisibleAnimated(rect, animated);
            }
        }
    }

    public requestLayout(): void {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell) {
            super.requestLayout();
        }
    }

    public _setNativeClipToBounds() {
        this.nativeView.clipsToBounds = true;
    }
    notifyForItemAtIndex(eventName: string, view: View, index: number, bindingContext?, native?: any) {
        const args = { eventName, object: this, index, view, ios: native, bindingContext };
        this.notify(args);
        return args as any;
    }
    _getItemTemplateType(indexPath) {
        const selector = this._itemTemplateSelector;
        let type = this._defaultTemplate.key;
        if (selector) {
            type = selector.call(this, this.getItemAtIndex(indexPath.item), indexPath.item, this.items);
        }
        const result = type.toLowerCase();
        if (this._itemTemplatesInternal.has(result)) {
            return result;
        }
        return 'default';
    }
    getItemTemplateContent(index, templateType) {
        return this.getViewForViewType(ListViewViewTypes.ItemView, templateType);
    }
    public _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, templateType: string, notForCellSizeComp = true) {
        let cellSize: [number, number];
        try {
            this._preparingCell = true;
            const firstRender = !cell.view;
            let view = cell.view;
            const index = indexPath.row;
            if (!view) {
                view = this.getItemTemplateContent(index, templateType);
            }
            const bindingContext = this._prepareItem(view, index);

            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell', index, templateType, !!cell.view, !!view, cell.view !== view, notForCellSizeComp);
            }
            const args = this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, indexPath.row, bindingContext, cell);
            view = args.view;
            if (firstRender) {
                view['iosIgnoreSafeArea'] = true;
            }
            view.bindingContext = bindingContext;

            if (view instanceof ProxyViewContainer) {
                const sp = new ContentView();
                sp.content = view;
                view = sp;
            }

            if (!cell.view) {
                cell.owner = new WeakRef(view);
            } else if (cell.view !== view) {
                this._removeContainer(cell);
                if (cell.view.nativeViewProtected) {
                    cell.view.nativeViewProtected.removeFromSuperview();
                }
                cell.owner = new WeakRef(view);
            }
            cell.currentIndex = indexPath.row;

            if (notForCellSizeComp) {
                this._map.set(cell, view);
            }

            if (view && !view.parent) {
                this._addView(view);
                const innerView = NSCellView.new() as NSCellView;
                innerView.autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleHeight;
                innerView.view = new WeakRef(view);
                if (notForCellSizeComp && this.autoReloadItemOnLayout) {
                    // for a cell to update correctly on cell layout change we need
                    // to do it ourself instead of "propagating it"
                    view['performLayout'] = () => {
                        if (!this._preparingCell && !this._refreshingVisible && !view['inPerformLayout']) {
                            view['inPerformLayout'] = true;
                            const index = cell.currentIndex;
                            const nativeView = this.nativeViewProtected;
                            const sizes: NSMutableArray<NSValue> = this._delegate instanceof UICollectionViewDelegateImpl ? this._delegate.cachedSizes : null;
                            if (sizes && index < sizes.count) {
                                sizes.replaceObjectAtIndexWithObject(index, NSValue.valueWithCGSize(CGSizeZero));
                            }

                            nativeView.performBatchUpdatesCompletion(() => {
                                this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, indexPath.row, view.bindingContext, cell);
                                // the order is important because measureCell will set layout as requested and notifyForItemAtIndex would call requestLayout => endless loop
                                this.measureCell(cell, view, index);
                                cell.contentView.subviews.objectAtIndex(0)?.layoutSubviews();
                                // nativeView.collectionViewLayout.invalidateLayout();
                            }, null);
                            view['inPerformLayout'] = false;
                        }
                    };
                }
                innerView.addSubview(view.nativeViewProtected);
                cell.contentView.addSubview(innerView);
            }
            cellSize = this.measureCell(cell, view, indexPath.row);
            if (notForCellSizeComp) {
                view.notify({ eventName: CollectionViewBase.bindedEvent });
            }

            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell done', index, cellSize);
            }
        } finally {
            this._preparingCell = false;
        }
        return cellSize;
    }
    public getCellSize(index: number) {
        // let result = this._sizes[index];
        let result;
        // CLog(CLogTypes.log, 'getCellSize', index, result, this._effectiveColWidth, this._effectiveRowHeight, this.getMeasuredWidth(), this.getMeasuredHeight());
        if (!result) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            if (this.spanSize) {
                const dataItem = this.getItemAtIndex(index);
                const spanSize = this.spanSize(dataItem, index);
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
    // public storeCellSize(index: number, value) {
    //     this._sizes[index] = value;
    // }
    // public clearCellSize() {
    //     this._sizes = new Array<number[]>();
    // }
    private measureCell(cell: CollectionViewCell, cellView: View, position: number): [number, number] {
        if (cellView) {
            let width = this._effectiveColWidth;
            let height = this._effectiveRowHeight;
            const horizontal = this.isHorizontal();
            if (this.spanSize) {
                const dataItem = this.getItemAtIndex(position);
                const spanSize = this.spanSize(dataItem, position);
                if (horizontal) {
                    height *= spanSize;
                } else {
                    width *= spanSize;
                }
            }

            const widthMeasureSpec = width ? Utils.layout.makeMeasureSpec(width, Utils.layout.EXACTLY) : horizontal ? infinity : Utils.layout.makeMeasureSpec(this._innerWidth, Utils.layout.EXACTLY);
            const heightMeasureSpec = height
                ? Utils.layout.makeMeasureSpec(height, Utils.layout.EXACTLY)
                : horizontal
                  ? Utils.layout.makeMeasureSpec(this._innerHeight, Utils.layout.EXACTLY)
                  : infinity;
            if (Trace.isEnabled()) {
                CLog(CLogTypes.log, 'measureCell', position, width, height, this._innerWidth, this._innerHeight, widthMeasureSpec, heightMeasureSpec);
            }
            const measuredSize = View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
            const result: [number, number] = [measuredSize.measuredWidth, measuredSize.measuredHeight];

            // this.storeCellSize(index.row, result);
            return result;
        }
        return undefined;
    }
    layoutCell(index: number, cell: CollectionViewCell, cellView: View): any {
        // const cellSize = this.getCellSize(index);
        const size = cell.bounds.size;
        View.layoutChild(this, cellView, 0, 0, Utils.layout.toDevicePixels(size.width), Utils.layout.toDevicePixels(size.height));
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'layoutCell', index, cellView.getMeasuredWidth(), cellView.getMeasuredHeight());
        }
    }

    private clearRealizedCells() {
        this._map.forEach((value, key: CollectionViewCell) => {
            this._removeContainer(key);
            this._clearCellViews(key);
        });
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
        this.notifyForItemAtIndex(CollectionViewBase.itemDisposingEvent, view, cell.currentIndex, view.bindingContext, cell);
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
        const padding = {
            top: layout['sectionInset'].top,
            right: layout['sectionInset'].right,
            bottom: layout['sectionInset'].bottom,
            left: layout['sectionInset'].left
        };
        // tslint:disable-next-line:prefer-object-spread
        const newValue = Object.assign(padding, newPadding);
        layout['sectionInset'] = newValue;
    }

    numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        if (!this._lastLayoutKey) {
            return 0;
        }
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
        if (this.itemOverlap) {
            // should we force clipsToBounds? not doing so allows more complex layouts like overlapping
            // we set zPosition to allow overlap. Should we make it an option?
            cell.layer.zPosition = indexPath.row;
        }
        cell.clipsToBounds = true;
        const firstRender = !cell.view;
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewCellForItemAtIndexPath', indexPath.row, templateType, !!cell.view, cell);
        }
        this._prepareCell(cell, indexPath, templateType);

        // the cell layout will be called from NSCellView layoutSubviews
        const cellView: View = cell.view;
        if (!firstRender && cellView['isLayoutRequired']) {
            this.layoutCell(indexPath.row, cell, cellView);
        }
        // if the cell view is a canvas we need to ensure redraw is called
        ((cellView as ContentView).content || cellView).nativeViewProtected.setNeedsDisplay();
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
        if (this.hasListeners(CollectionViewBase.displayItemEvent)) {
            this.notify<CollectionViewItemDisplayEventData>({
                eventName: CollectionViewBase.displayItemEvent,
                index: indexPath.row,
                object: this
            });
        }

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
            view: cell.view
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
                let needsSet = false;
                if (!cell) {
                    cell = CollectionViewCell.new();
                    needsSet = true;
                } else if (!cell.view) {
                    cell.owner = new WeakRef(measureData.view);
                    needsSet = true;
                }
                measuredSize = this._prepareCell(cell, indexPath, templateType, false);
                if (needsSet) {
                    this._measureCellMap.set(templateType, { cell, view: cell.view });
                }
            }
        }
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row, measuredSize);
        }
        if (measuredSize) {
            return CGSizeMake(Utils.layout.toDeviceIndependentPixels(measuredSize[0]), Utils.layout.toDeviceIndependentPixels(measuredSize[1]));
        }
        return CGSizeZero;
    }

    private computeScrollEventData(scrollView: UIScrollView, eventName: string, dx?: number, dy?: number) {
        const horizontal = this.isHorizontal();
        const safeAreaInsetsTop = this.iosIgnoreSafeArea ? 0 : scrollView.safeAreaInsets.top;
        const offset = horizontal ? scrollView.contentOffset.x : scrollView.contentOffset.y + safeAreaInsetsTop;
        const size = horizontal ? scrollView.contentSize.width - scrollView.bounds.size.width : scrollView.contentSize.height - scrollView.bounds.size.height + safeAreaInsetsTop;
        return {
            object: this,
            eventName,
            scrollOffset: offset,
            scrollSize: size,
            scrollOffsetPercentage: offset / size,
            dx,
            dy: dy + safeAreaInsetsTop
        };
    }
    lastContentOffset: CGPoint;
    needsScrollStartEvent = false;
    isScrolling = false;
    scrollViewWillBeginDragging(scrollView: UIScrollView): void {
        this.lastContentOffset = scrollView.contentOffset;
        this.needsScrollStartEvent = true;
        this.isScrolling = true;
    }
    scrollViewDidScroll(scrollView: UIScrollView): void {
        const contentOffset = scrollView.contentOffset;
        const dx = contentOffset.x - this.lastContentOffset.x;
        const dy = contentOffset.y - this.lastContentOffset.y;
        this.lastContentOffset = scrollView.contentOffset;
        if (this.needsScrollStartEvent) {
            this.needsScrollStartEvent = false;
            if (this.hasListeners(CollectionViewBase.scrollStartEvent)) {
                this.notify(this.computeScrollEventData(scrollView, CollectionViewBase.scrollStartEvent, dx, dy));
            }
        }
        this.notify(this.computeScrollEventData(scrollView, CollectionViewBase.scrollEvent, dx, dy));
    }
    stopScrolling(scrollView: UIScrollView) {
        if (this.isScrolling) {
            this.isScrolling = false;
            this.notify(this.computeScrollEventData(scrollView, CollectionViewBase.scrollEndEvent));
        }
    }
    scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        this.stopScrolling(scrollView);
    }
    scrollViewWillEndDraggingWithVelocityTargetContentOffset?(scrollView: UIScrollView, velocity: CGPoint, targetContentOffset: interop.Pointer | interop.Reference<CGPoint>): void {
        this.stopScrolling(scrollView);
    }
    scrollViewDidEndDraggingWillDecelerate(scrollView: UIScrollView, decelerate: boolean): void {
        this.stopScrolling(scrollView);
    }

    scrollViewDidEndScrollingAnimation(scrollView: UIScrollView): void {
        this.stopScrolling(scrollView);
    }
}
contentInsetAdjustmentBehaviorProperty.register(CollectionView);
estimatedItemSizeProperty.register(CollectionView);
autoSizeProperty.register(CollectionView);

interface ViewItemIndex {}

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
    currentIndex: number;

    get view(): ItemView {
        return this.owner ? this.owner.get() : null;
    }
}

@NativeClass
class UICollectionViewImpl extends UICollectionView {
    _owner: WeakRef<CollectionView>;
    sizeThatFits(size: CGSize): CGSize {
        const owner = this._owner?.get();
        if (owner?.autoSize) {
            if (this.superview) {
                this.superview?.layoutIfNeeded();
            }
            const horizontal = owner.orientation === 'horizontal';
            // Calculate the total size based on the cells' sizes
            let width = 0;
            let height = 0;
            const dataSource = owner._dataSource;
            const delegate = owner._delegate as UICollectionViewDelegateFlowLayout;
            if (dataSource && delegate) {
                const numberOfItems = dataSource.collectionViewNumberOfItemsInSection(this, 0);
                for (let index = 0; index < numberOfItems; index++) {
                    const indexPath = NSIndexPath.indexPathForItemInSection(index, 0);
                    const estimatedSize = delegate.collectionViewLayoutSizeForItemAtIndexPath(this, owner._layout, indexPath) ?? CGSizeZero;
                    if (horizontal) {
                        width = Math.max(width, estimatedSize.width);
                        height += estimatedSize.height;
                    } else {
                        height = Math.max(height, estimatedSize.height);
                        width += estimatedSize.width;
                    }
                }
                return CGSizeMake(width, height);
            }
        }
        return super.sizeThatFits(size);
    }
    static initWithOwner(owner: CollectionView, layout) {
        const view = UICollectionViewImpl.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), layout) as UICollectionViewImpl;
        view._owner = new WeakRef(owner);
        return view;
    }
}

@NativeClass
class UICollectionViewFlowLayoutImpl extends UICollectionViewFlowLayout {
    _owner: WeakRef<CollectionView>;
    static initWithOwner(owner: CollectionView) {
        const layout = UICollectionViewFlowLayoutImpl.new() as UICollectionViewFlowLayoutImpl;
        layout._owner = new WeakRef(owner);
        return layout;
    }
    invalidationContextForInteractivelyMovingItemsWithTargetPositionPreviousIndexPathsPreviousPosition(
        targetIndexPaths: NSArray<NSIndexPath>,
        targetPosition: CGPoint,
        previousIndexPaths: NSArray<NSIndexPath>,
        previousPosition: CGPoint
    ): UICollectionViewLayoutInvalidationContext {
        const owner = this._owner?.get();
        if (owner && targetIndexPaths.count) {
            owner.clearCachedSize(targetIndexPaths.objectAtIndex(0).row, previousIndexPaths.objectAtIndex(0).row);
        }
        return super.invalidationContextForInteractivelyMovingItemsWithTargetPositionPreviousIndexPathsPreviousPosition(targetIndexPaths, targetPosition, previousIndexPaths, previousPosition);
    }
    layoutAttributesForElementsInRect(rect: CGRect) {
        const attributesArray = super.layoutAttributesForElementsInRect(rect);
        const owner = this._owner?.get();
        owner?.layoutAttributesForElementsInRect(attributesArray, rect);
        return attributesArray;
    }
    shouldInvalidateLayoutForBoundsChange(newBounds: CGRect) {
        const owner = this._owner?.get();
        if (owner?.itemOverlap) {
            return true;
        }
        return super.shouldInvalidateLayoutForBoundsChange(newBounds);
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
            // owner._reorderItemInSource(sourceIndexPath.row, destinationIndexPath.row, false);
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
// @NativeClass
// class UICollectionViewDragDelegateImpl extends NSObject implements UICollectionViewDragDelegate {
//     public static ObjCProtocols = [UICollectionViewDragDelegate];

//     _owner: WeakRef<CollectionView>;
//     static initWithOwner(owner: CollectionView) {
//         const delegate = UICollectionViewDragDelegateImpl.new() as UICollectionViewDragDelegateImpl;
//         delegate._owner = new WeakRef(owner);
//         return delegate;
//     }
//     // collectionViewDragPreviewParametersForItemAtIndexPath?(collectionView: UICollectionView, indexPath: NSIndexPath): UIDragPreviewParameters {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDragSessionAllowsMoveOperation?(collectionView: UICollectionView, session: UIDragSession): boolean {
//     //     console.log('collectionViewDragSessionAllowsMoveOperation', session, session.items.objectAtIndex(0))
//     //     return true;
//     // }
//     // collectionViewDragSessionDidEnd?(collectionView: UICollectionView, session: UIDragSession): void {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDragSessionIsRestrictedToDraggingApplication?(collectionView: UICollectionView, session: UIDragSession): boolean {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDragSessionWillBegin?(collectionView: UICollectionView, session: UIDragSession): void {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewItemsForAddingToDragSessionAtIndexPathPoint?(collectionView: UICollectionView, session: UIDragSession, indexPath: NSIndexPath, point: CGPoint): NSArray<UIDragItem> {
//     //     throw new Error('Method not implemented.');
//     // }
//     collectionViewItemsForBeginningDragSessionAtIndexPath(collectionView: UICollectionView, session: UIDragSession, indexPath: NSIndexPath): NSArray<UIDragItem> {
//         let owner = this._owner?.get();
//         if (owner) {
//             const result = owner.shouldMoveItemAtIndex(indexPath.row);
//             console.log('collectionViewItemsForBeginningDragSessionAtIndexPath', indexPath.row, result)
//             if (result) {
//                 let item  = owner.getItemAtIndex(indexPath.row)
//                 let itemProvider = NSItemProvider.alloc().initWithObject(NSString.stringWithString(indexPath.row + ''))
//                 let dragItem = UIDragItem.alloc().initWithItemProvider(itemProvider)
//                 dragItem.localObject = item;
//                 return NSArray.arrayWithObject(dragItem);
//             }
//         }
//             }
// }

// @NativeClass
// class UICollectionViewDropDelegateImpl extends NSObject implements UICollectionViewDropDelegate {

//     public static ObjCProtocols = [UICollectionViewDropDelegate];

//     _owner: WeakRef<CollectionView>;
//     static initWithOwner(owner: CollectionView) {
//         const delegate = UICollectionViewDropDelegateImpl.new() as UICollectionViewDropDelegateImpl;
//         delegate._owner = new WeakRef(owner);
//         return delegate;
//     }

//     // collectionViewCanHandleDropSession?(collectionView: UICollectionView, session: UIDropSession): boolean {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDropPreviewParametersForItemAtIndexPath?(collectionView: UICollectionView, indexPath: NSIndexPath): UIDragPreviewParameters {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDropSessionDidEnd?(collectionView: UICollectionView, session: UIDropSession): void {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDropSessionDidEnter?(collectionView: UICollectionView, session: UIDropSession): void {
//     //     throw new Error('Method not implemented.');
//     // }
//     // collectionViewDropSessionDidExit?(collectionView: UICollectionView, session: UIDropSession): void {
//     //     throw new Error('Method not implemented.');
//     // }
//     collectionViewDropSessionDidUpdateWithDestinationIndexPath?(collectionView: UICollectionView, session: UIDropSession, destinationIndexPath: NSIndexPath): UICollectionViewDropProposal {
//         let owner = this._owner?.get();
//         if (!owner || !destinationIndexPath) {
//             return UICollectionViewDropProposal.alloc().initWithDropOperation(UIDropOperation.Forbidden);
//         }
//         const startPosition = (session.items.objectAtIndex(0).localObject as NSNumber).intValue;
//         const endPosition = destinationIndexPath.row;
//         if (owner) {
//             if (!collectionView.hasActiveDrag || !owner._canReorderToPosition(startPosition, endPosition, endPosition)) {
//                 return UICollectionViewDropProposal.alloc().initWithDropOperation(UIDropOperation.Forbidden);
//             }
//         }
//         owner._reorderItemInSource(startPosition, endPosition);
//         return UICollectionViewDropProposal.alloc().initWithDropOperationIntent(UIDropOperation.Move, UICollectionViewDropIntent.InsertAtDestinationIndexPath);
//     }
//     collectionViewPerformDropWithCoordinator(collectionView: UICollectionView, coordinator: UICollectionViewDropCoordinator): void {
//        let owner = this._owner?.get();
//        if (owner) {
//         const item  =coordinator.items.objectAtIndex(0);
//         if (item) {

//             const destinationIndexPath  = coordinator?.destinationIndexPath ?? {row:(collectionView.numberOfItemsInSection(0) -1), section:0} as NSIndexPath;
//             console.log('dropItem', item, item.performSelector('sourceIndexPath'));
//             const sourceIndexPath = item.performSelector('sourceIndexPath');
//             console.log('collectionViewPerformDropWithCoordinator', destinationIndexPath, sourceIndexPath);
//         // UIView.performWithoutAnimation(() => {
//             collectionView.performBatchUpdatesCompletion(() => {
//                 owner._reorderItemInSource(sourceIndexPath.row, destinationIndexPath.row, false);
//                 owner._callItemReorderedEvent(sourceIndexPath.row, destinationIndexPath, owner.getItemAtIndex(sourceIndexPath.row));
//                 collectionView.deleteItemsAtIndexPaths(NSArray.arrayWithObject(sourceIndexPath));
//                 collectionView.insertItemsAtIndexPaths(NSArray.arrayWithObject(destinationIndexPath));
//             }, null);
//         // });
//         coordinator.dropItemToItemAtIndexPath(item.performSelector('dragItem'), destinationIndexPath);

//         }

//        }
//     }
// }
@NativeClass
class UICollectionViewDelegateImpl extends UICollectionViewCacheDelegateFlowLayout implements UICollectionViewDelegate {
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
    collectionViewLayoutComputedSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
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
    scrollViewWillBeginDragging(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewWillBeginDragging(scrollView);
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
    scrollViewDidEndDraggingWillDecelerate(scrollView: UIScrollView, decelerate: boolean): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDraggingWillDecelerate(scrollView, decelerate);
        }
    }

    scrollViewDidEndScrollingAnimation(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndScrollingAnimation(scrollView);
        }
    }
    collectionViewTargetIndexPathForMoveFromItemAtIndexPathToProposedIndexPath(collectionView: UICollectionView, currentIndexPath: NSIndexPath, proposedIndexPath: NSIndexPath): NSIndexPath {
        if (currentIndexPath === proposedIndexPath) {
            return proposedIndexPath;
        }
        const owner = this._owner?.get();
        if (owner && !owner._canReorderToPosition(currentIndexPath.row, proposedIndexPath.row, owner.getItemAtIndex(proposedIndexPath.row))) {
            return currentIndexPath;
        }
        owner._reorderItemInSource(currentIndexPath.row, proposedIndexPath.row, false);
        owner.clearCachedSize(currentIndexPath.row, proposedIndexPath.row);

        return proposedIndexPath;
    }
}

@NativeClass
class UICollectionViewDelegateFixedSizeImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    _owner: WeakRef<CollectionView>;
    public static ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];

    static initWithOwner(owner: CollectionView) {
        const delegate = UICollectionViewDelegateFixedSizeImpl.new() as UICollectionViewDelegateFixedSizeImpl;
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
    scrollViewDidScroll(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidScroll(scrollView);
        }
    }
    scrollViewWillBeginDragging(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewWillBeginDragging(scrollView);
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
    scrollViewDidEndDraggingWillDecelerate(scrollView: UIScrollView, decelerate: boolean): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDraggingWillDecelerate(scrollView, decelerate);
        }
    }

    scrollViewDidEndScrollingAnimation(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndScrollingAnimation(scrollView);
        }
    }
    collectionViewTargetIndexPathForMoveFromItemAtIndexPathToProposedIndexPath(collectionView: UICollectionView, currentIndexPath: NSIndexPath, proposedIndexPath: NSIndexPath): NSIndexPath {
        if (currentIndexPath === proposedIndexPath) {
            return proposedIndexPath;
        }
        const owner = this._owner?.get();
        if (owner && !owner._canReorderToPosition(currentIndexPath.row, proposedIndexPath.row, owner.getItemAtIndex(proposedIndexPath.row))) {
            return currentIndexPath;
        }
        owner._reorderItemInSource(currentIndexPath.row, proposedIndexPath.row, false);
        owner.clearCachedSize(currentIndexPath.row, proposedIndexPath.row);

        return proposedIndexPath;
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
        longPress: { returns: interop.types.void, params: [interop.types.id] }
    };
}
