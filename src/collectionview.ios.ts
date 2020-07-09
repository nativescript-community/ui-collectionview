import { EventData, Observable } from '@nativescript/core/data/observable';
import { ChangeType } from '@nativescript/core/data/observable-array';
import { profile } from '@nativescript/core/profiling';
import { isEnabled } from '@nativescript/core/trace';
import { KeyedTemplate, layout, Length, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty, View } from '@nativescript/core/ui/core/view';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { ProxyViewContainer } from '@nativescript/core/ui/proxy-view-container';
import * as util from '@nativescript/core/utils/utils';
import { CollectionViewItemEventData, Orientation, reverseLayoutProperty } from './collectionview';
import { CLog, CLogTypes, CollectionViewBase, isBounceEnabledProperty, isScrollEnabledProperty, itemTemplatesProperty, ListViewViewTypes, orientationProperty } from './collectionview-common';

const utilLayout = util.layout;

export * from './collectionview-common';

const infinity = utilLayout.makeMeasureSpec(0, utilLayout.UNSPECIFIED);

declare module '@nativescript/core/ui/core/view' {
    interface View {
        _onSizeChanged();
    }
}

export class CollectionView extends CollectionViewBase {
    private _layout: UICollectionViewLayout;
    private _dataSource: ICollectionViewDataSource;
    private _delegate: IUICollectionViewDelegateImpl;
    private _preparingCell: boolean = false;
    private _sizes: number[][];
    private _map: Map<ICollectionViewCell, ItemView>;
    _measureCellMap: Map<string, { cell: ICollectionViewCell; view: View }>;

    nativeViewProtected: UICollectionView;

    constructor() {
        super();
        this._map = new Map<ICollectionViewCell, View>();
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
        console.log('createNativeView', layout);
        const view = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), layout);
        view.backgroundColor = UIColor.clearColor;
        // view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), this._defaultTemplate.key);
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
        this._dataSource = CollectionViewDataSource.new();
        this._dataSource._owner = new WeakRef(this);
        nativeView.dataSource = this._dataSource;

        const layoutStyle = CollectionViewBase.layoutStyles[this.layoutStyle];
        if (layoutStyle && layoutStyle.createDelegate) {
            this._delegate = layoutStyle.createDelegate();
        } else {
            this._delegate = UICollectionViewDelegateImpl.new();
        }
        this._delegate._owner = new WeakRef(this);
        this._measureCellMap = new Map<string, { cell: ICollectionViewCell; view: View }>();
        this.nativeView.delegate = this._delegate;

        this._setNativeClipToBounds();
    }

    public disposeNativeView() {
        if (isEnabled()) {
            CLog(CLogTypes.log, 'disposeNativeView');
        }
        const nativeView = this.nativeView;
        nativeView.delegate = null;
        this._delegate = null;
        nativeView.dataSource = null;
        this._dataSource = null;
        this._layout = null;
        this.clearRealizedCells();
        super.disposeNativeView();
    }

    _onSizeChanged() {
        super._onSizeChanged();
        this.onSizeChanged(layout.toDeviceIndependentPixels(this.getMeasuredWidth()), layout.toDeviceIndependentPixels(this.getMeasuredHeight()));
    }

    // get ios(): UICollectionView {
    //     return this.nativeView;
    // }

    get _childrenCount(): number {
        return this._map.size;
    }

    // public [paddingTopProperty.getDefault](): number {
    //     return this._layout.sectionInset.top;
    // }
    public [paddingTopProperty.setNative](value: Length) {
        this._setPadding({ top: utilLayout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }

    // public [paddingRightProperty.getDefault](): number {
    //     return this._layout.sectionInset.right;
    // }
    public [paddingRightProperty.setNative](value: Length) {
        this._setPadding({ right: utilLayout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }

    // public [paddingBottomProperty.getDefault](): number {
    //     return this._layout.sectionInset.bottom;
    // }
    public [paddingBottomProperty.setNative](value: Length) {
        this._setPadding({ bottom: utilLayout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }

    // public [paddingLeftProperty.getDefault](): number {
    //     return this._layout.sectionInset.left;
    // }
    public [paddingLeftProperty.setNative](value: Length) {
        this._setPadding({ left: utilLayout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    }

    // public [orientationProperty.getDefault](): Orientation {
    //     if (this.isHorizontal()) {
    //         return 'horizontal';
    //     }

    //     return 'vertical';
    // }
    public [orientationProperty.setNative](value: Orientation) {
        const layout = this._layout;
        if (layout instanceof UICollectionViewFlowLayout) {
            if (value === 'horizontal') {
                layout.scrollDirection = UICollectionViewScrollDirection.Horizontal;
            } else {
                layout.scrollDirection = UICollectionViewScrollDirection.Vertical;
            }
        }
    }
    public [isScrollEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.scrollEnabled = value;
    }
    public [isBounceEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.bounces = value;
        // this.nativeViewProtected.alwaysBounceHorizontal = value;
    }

    public [itemTemplatesProperty.getDefault](): KeyedTemplate[] {
        return null;
    }
    public [reverseLayoutProperty.setNative](value: boolean) {
        this.nativeViewProtected.transform = value ? CGAffineTransformMakeRotation(-Math.PI) : null;
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

        const layout = this.nativeViewProtected.collectionViewLayout as UICollectionViewFlowLayout;
        if (this._effectiveColWidth || this._effectiveRowHeight) {
            layout.estimatedItemSize = layout.itemSize = CGSizeMake(utilLayout.toDeviceIndependentPixels(this._effectiveColWidth), utilLayout.toDeviceIndependentPixels(this._effectiveRowHeight));
        }
        this._map.forEach((cellView, cell) => {
            if (isEnabled()) {
                CLog(CLogTypes.log, 'onLayout', 'cell', cellView._listViewItemIndex);
            }
            this.layoutCell(cellView._listViewItemIndex, cell, cellView);
        });
    }

    public isHorizontal() {
        return this.orientation === 'horizontal';
    }

    public onSourceCollectionChanged(event /*: ChangedData<any>*/) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (isEnabled()) {
            CLog(CLogTypes.log, 'onItemsChanged', event.action, event.index, event.addedCount, event.removed && event.removed.length);
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
                if (isEnabled()) {
                    CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                }
                this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                    this.nativeViewProtected.deleteItemsAtIndexPaths(indexes);
                }, null);
                return;
            }
            case ChangeType.Update: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index, 0));
                if (isEnabled()) {
                    CLog(CLogTypes.info, 'reloadItemsAtIndexPaths', indexes.count);
                }
                this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                    this.nativeViewProtected.reloadItemsAtIndexPaths(indexes);
                }, null);
                return;
            }
            case ChangeType.Add: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                }
                if (isEnabled()) {
                    CLog(CLogTypes.info, 'insertItemsAtIndexPaths', indexes.count);
                }
                this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                    this.nativeViewProtected.insertItemsAtIndexPaths(indexes);
                    // this.nativeViewProtected.reloadItemsAtIndexPaths(nativeSource);
                }, null);
                // Reload the items to avoid duplicate Load on Demand indicators:
                return;
            }
            case ChangeType.Splice: {
                this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                    if (event.addedCount > 0) {
                        const indexes = NSMutableArray.alloc<NSIndexPath>().init();
                        for (let index = 0; index < event.addedCount; index++) {
                            indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                        }
                        this.nativeViewProtected.insertItemsAtIndexPaths(indexes);
                    }
                    if (event.removed && event.removed.length > 0) {
                        const indexes = NSMutableArray.new<NSIndexPath>();
                        for (let index = 0; index < event.removed.length; index++) {
                            indexes.addObject(NSIndexPath.indexPathForItemInSection(event.index + index, 0));
                        }
                        this.unbindUnusedCells(event.removed);
                        if (isEnabled()) {
                            CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                        }
                        this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                            this.nativeViewProtected.deleteItemsAtIndexPaths(indexes);
                        }, null);
                    }
                }, null);

                return;
            }
            // break;
        }
        this.refresh();
    }

    onItemTemplatesChanged(oldValue, newValue) {
        super.onItemTemplatesChanged(oldValue, newValue);
        // CLog(CLogTypes.log, 'onItemTemplatesChanged');
        if (!this.nativeViewProtected) {
            return;
        }
        const view = this.nativeViewProtected;
        this._itemTemplatesInternal.forEach((t) => {
            view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), t.key.toLowerCase());
        });
        // for (let i = 0, length_1 = this._itemTemplatesInternal.length; i < length_1; i++) {
        //     this.nativeViewProtected.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), this._itemTemplatesInternal[i].key.toLowerCase());
        // }
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
    @profile
    public refresh() {
        if (!this.isLoaded || !this.nativeView) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        if (isEnabled()) {
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
        this.nativeViewProtected.reloadData();

        const args = {
            eventName: CollectionViewBase.dataPopulatedEvent,
            object: this,
        };
        this.notify(args);
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
    public _prepareCell(cell: ICollectionViewCell, indexPath: NSIndexPath, templateType: string, addToMap = true) {
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

            if (isEnabled()) {
                CLog(CLogTypes.log, '_prepareCell', index, !!cell.view, !!view, cell.view !== view, needsLayout);
            }
            const args = this.notifyForItemAtIndex(this, cell, view, CollectionViewBase.itemLoadingEvent, indexPath, bindingContext);
            view = args.view;

            if (view instanceof ProxyViewContainer) {
                let sp = new GridLayout();
                sp.addChild(view);
                view = sp;
            }

            if (!cell.view) {
                cell.owner = new WeakRef(view);
            } else if (cell.view !== view) {
                this._removeContainer(cell);
                (cell.view.nativeViewProtected as UIView).removeFromSuperview();
                cell.owner = new WeakRef(view);
            }
            view._listViewItemIndex = index;

            if (addToMap) {
                this._map.set(cell, view);
            }

            if (view && !view.parent) {
                this._addView(view);
                cell.contentView.addSubview(view.nativeViewProtected);
            }

            cellSize = this.measureCell(cell, view, indexPath);

            if (needsLayout) {
                view.requestLayout();
            }

            if (isEnabled()) {
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
            if (this._effectiveColWidth && this._effectiveRowHeight) {
                result = [this._effectiveColWidth, this._effectiveRowHeight];
            } else if (this._effectiveRowHeight && this.orientation === 'vertical') {
                result = [this.getMeasuredWidth(), this._effectiveRowHeight];
            } else if (this._effectiveColWidth && this.orientation === 'horizontal') {
                result = [this._effectiveColWidth, this.getMeasuredHeight()];
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
    private measureCell(cell: ICollectionViewCell, cellView: View, index: NSIndexPath): [number, number] {
        if (cellView) {
            let result: [number, number];
            const width = this._effectiveColWidth;
            const height = this._effectiveRowHeight;

            const horizontal = this.isHorizontal();
            const widthMeasureSpec = width ? utilLayout.makeMeasureSpec(width, utilLayout.EXACTLY) : horizontal ? infinity : utilLayout.makeMeasureSpec(this._innerWidth, utilLayout.UNSPECIFIED);
            const heightMeasureSpec = height ? utilLayout.makeMeasureSpec(height, utilLayout.EXACTLY) : horizontal ? utilLayout.makeMeasureSpec(this._innerHeight, utilLayout.UNSPECIFIED) : infinity;
            if (isEnabled()) {
                CLog(CLogTypes.log, 'measureCell', width, height, widthMeasureSpec, heightMeasureSpec);
            }
            const measuredSize = View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
            result = [measuredSize.measuredWidth, measuredSize.measuredHeight];

            this.storeCellSize(index.row, result);
            return result;
        }
        return undefined;
    }
    layoutCell(index: number, cell: any, cellView: View): any {
        const rowHeight = this._effectiveRowHeight;
        const colWidth = this._effectiveColWidth;
        const cellSize = this.getCellSize(index);
        const cellWidth = colWidth > 0 ? colWidth : cellSize[0];
        const cellHeight = rowHeight > 0 ? rowHeight : cellSize[1];
        cellView.iosOverflowSafeAreaEnabled = false;
        View.layoutChild(this, cellView, 0, 0, cellWidth, cellHeight);
        if (isEnabled()) {
            CLog(CLogTypes.log, 'layoutCell', index, colWidth, rowHeight, cellWidth, cellHeight, cellView.getMeasuredWidth(), cellView.getMeasuredHeight());
        }
    }

    private clearRealizedCells() {
        const that = new WeakRef<CollectionView>(this);
        this._map.forEach(function (value, key: ICollectionViewCell) {
            that.get()._removeContainer(key);
            that.get()._clearCellViews(key);
        }, that);
        this._map.clear();
    }

    private _clearCellViews(cell: ICollectionViewCell) {
        if (cell && cell.view) {
            if (cell.view.nativeViewProtected) {
                (cell.view.nativeViewProtected as UIView).removeFromSuperview();
            }

            cell.owner = undefined;
        }
    }

    private _removeContainer(cell: ICollectionViewCell): void {
        const view = cell.view;
        // This is to clear the StackLayout that is used to wrap ProxyViewContainer instances.
        if (!(view.parent instanceof CollectionView)) {
            this._removeView(view.parent);
        }
        // No need to request layout when we are removing cells.
        const preparing = this._preparingCell;
        this._preparingCell = true;
        view.parent._removeView(view);
        view._listViewItemIndex = undefined;
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
        return this.items ? this.items.length : 0;
    }

    collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        const templateType = this._getItemTemplateType(indexPath);
        let cell: any = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(templateType, indexPath);
        if (!cell) {
            cell = CollectionViewCell.new();
        }
        if (isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewCellForItemAtIndexPath', indexPath.row, templateType, !!cell.view, cell);
        }
        this._prepareCell(cell, indexPath, templateType);

        const cellView: View = cell.view;
        if (cellView && cellView['isLayoutRequired']) {
            this.layoutCell(indexPath.row, cell, cellView);
        }

        return cell;
    }
    collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        if (this.reverseLayout) {
            cell.transform = CGAffineTransformMakeRotation(-Math.PI);
        }

        if (indexPath.row === this.items.length - 1) {
            this.notify<EventData>({
                eventName: CollectionViewBase.loadMoreItemsEvent,
                object: this,
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
        const cell = collectionView.cellForItemAtIndexPath(indexPath);
        const position = indexPath.row;
        this.notify<CollectionViewItemEventData>({
            eventName: CollectionViewBase.itemTapEvent,
            object: this,
            item: this.getItemAtIndex(position),
            index: position,
            view: (cell as ICollectionViewCell).view,
        });

        cell.highlighted = false;

        return indexPath;
    }
    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        const row = indexPath.row;
        const dataItem = this.getItemAtIndex(row);
        if (dataItem.visible === false) {
            return CGSizeZero;
        }

        let measuredSize = this.getCellSize(row);
        if (!measuredSize) {
            if (isEnabled()) {
                CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row);
            }
            const templateType = this._getItemTemplateType(indexPath);
            if (templateType) {
                let measureData: any = this._measureCellMap.get(templateType);
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
        if (isEnabled()) {
            CLog(CLogTypes.log, 'collectionViewLayoutSizeForItemAtIndexPath', row, measuredSize);
        }
        if (measuredSize) {
            return CGSizeMake(utilLayout.toDeviceIndependentPixels(measuredSize[0]), utilLayout.toDeviceIndependentPixels(measuredSize[1]));
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
}

interface ViewItemIndex {
    _listViewItemIndex?: number;
}

type ItemView = View & ViewItemIndex;
declare class ICollectionViewCell extends UICollectionViewCell {
    static new(): ICollectionViewCell;
    owner: WeakRef<ItemView>;
    view:ItemView
}
const CollectionViewCell = (UICollectionViewCell as any).extend({
    get view(): ItemView {
        return this.owner ? this.owner.get() : null;
    }
}) as typeof ICollectionViewCell;

// export class CollectionViewCell extends UICollectionViewCell {
//     public static class(): any {
//         return CollectionViewCell;
//     }

//     public owner: WeakRef<ItemView>;

//     get view(): ItemView {
//         return this.owner ? this.owner.get() : null;
//     }
// }

declare class ICollectionViewDataSource extends NSObject {
    static new(): ICollectionViewDataSource;
    _owner: WeakRef<CollectionView>;
}
const CollectionViewDataSource = (NSObject as any).extend(
    {
        numberOfSectionsInCollectionView(collectionView: UICollectionView) {
            const owner = this._owner.get();
            if (owner) {
                return owner.numberOfSectionsInCollectionView(collectionView);
            }
            return 0;
        },

        collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
            const owner = this._owner.get();
            if (owner) {
                return owner.collectionViewNumberOfItemsInSection(collectionView, section);
            }
            return 0;
        },

        collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
            const owner = this._owner.get();
            if (owner) {
                return owner.collectionViewCellForItemAtIndexPath(collectionView, indexPath);
            }
            return null;
        },
    },
    {
        protocols: [UICollectionViewDataSource],
    }
) as typeof ICollectionViewDataSource;

declare class IUICollectionViewDelegateImpl extends NSObject {
    static new(): IUICollectionViewDelegateImpl;
    _owner: WeakRef<CollectionView>;
}
const UICollectionViewDelegateImpl = (NSObject as any).extend(
    {
        collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
            const owner = this._owner.get() as CollectionView;
            if (owner) {
                owner.collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath);
            }
        },
        collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
            const owner = this._owner.get() as CollectionView;
            if (owner) {
                return owner.collectionViewDidSelectItemAtIndexPath(collectionView, indexPath);
            }
            return indexPath;
        },
        collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
            const owner = this._owner.get() as CollectionView;
            if (owner) {
                return owner.collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath);
            }
            return CGSizeZero;
        },
        scrollViewDidScroll(scrollView: UIScrollView): void {
            const owner = this._owner.get() as CollectionView;
            if (owner) {
                owner.scrollViewDidScroll(scrollView);
            }
        },
        scrollViewDidEndDecelerating(scrollView: UIScrollView) {
            const owner = this._owner.get() as CollectionView;
            if (owner) {
                owner.scrollViewDidEndDecelerating(scrollView);
            }
        },
    },
    {
        protocols: [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout],
    }
) as typeof IUICollectionViewDelegateImpl;
