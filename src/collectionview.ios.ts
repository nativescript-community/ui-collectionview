import { EventData, Observable } from '@nativescript/core/data/observable';
import { ChangeType } from '@nativescript/core/data/observable-array/observable-array';
import { KeyedTemplate, Length, View, paddingBottomProperty, paddingLeftProperty, paddingRightProperty, paddingTopProperty } from '@nativescript/core/ui/core/view';
import * as util from '@nativescript/core/utils/utils';
import { CollectionViewItemEventData, Orientation } from './collectionview';
import { CollectionViewBase, isBounceEnabledProperty, isScrollEnabledProperty, itemTemplatesProperty, ListViewViewTypes, orientationProperty, CLog, CLogTypes } from './collectionview-common';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout/stack-layout';
import { profile } from '@nativescript/core/profiling';
import { ProxyViewContainer } from '@nativescript/core/ui/proxy-view-container';

const utilLayout = util.layout;

// import { isScrollEnabledProperty } from '@nativescript/core/ui/scroll-view/scroll-view';

export * from './collectionview-common';

const infinity = utilLayout.makeMeasureSpec(0, utilLayout.UNSPECIFIED);

export class CollectionView extends CollectionViewBase {
    private _layout: UICollectionViewFlowLayout;
    private _dataSource: CollectionViewDataSource;
    private _delegate: UICollectionViewDelegateImpl;
    private _preparingCell: boolean = false;
    private _sizes: number[][];
    private _map: Map<CollectionViewCell, ItemView>;

    nativeViewProtected: UICollectionView;

    constructor() {
        super();
        this._map = new Map<CollectionViewCell, View>();
        this._sizes = new Array<number[]>();
    }

    public createNativeView() {
        this._layout = UICollectionViewFlowLayout.alloc().init();
        this._layout.minimumLineSpacing = 0;
        this._layout.minimumInteritemSpacing = 0;

        const view = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), this._layout);
        view.backgroundColor = UIColor.clearColor;
        view.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), this._defaultTemplate.key);
        view.autoresizesSubviews = false;
        view.autoresizingMask = UIViewAutoresizing.None;

        return view;
    }

    public initNativeView() {
        super.initNativeView();

        const nativeView = this.nativeView;
        this._dataSource = CollectionViewDataSource.initWithOwner(new WeakRef(this));
        nativeView.dataSource = this._dataSource;

        this._delegate = UICollectionViewDelegateImpl.initWithOwner(new WeakRef(this));
        this.nativeView.delegate = this._delegate;

        this._setNativeClipToBounds();
    }

    public disposeNativeView() {
        const nativeView = this.nativeView;
        nativeView.delegate = null;
        this._delegate = null;
        nativeView.dataSource = null;
        this._dataSource = null;
        this._layout = null;
        super.disposeNativeView();
    }

    // get ios(): UICollectionView {
    //     return this.nativeView;
    // }

    get _childrenCount(): number {
        return this._map.size;
    }

    public [paddingTopProperty.getDefault](): number {
        return this._layout.sectionInset.top;
    }
    public [paddingTopProperty.setNative](value: Length) {
        this._setPadding({ top: utilLayout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }

    public [paddingRightProperty.getDefault](): number {
        return this._layout.sectionInset.right;
    }
    public [paddingRightProperty.setNative](value: Length) {
        this._setPadding({ right: utilLayout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }

    public [paddingBottomProperty.getDefault](): number {
        return this._layout.sectionInset.bottom;
    }
    public [paddingBottomProperty.setNative](value: Length) {
        this._setPadding({ bottom: utilLayout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }

    public [paddingLeftProperty.getDefault](): number {
        return this._layout.sectionInset.left;
    }
    public [paddingLeftProperty.setNative](value: Length) {
        this._setPadding({ left: utilLayout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    }

    public [orientationProperty.getDefault](): Orientation {
        if (this.isHorizontal()) {
            return 'horizontal';
        }

        return 'vertical';
    }
    public [orientationProperty.setNative](value: Orientation) {
        if (value === 'horizontal') {
            this._layout.scrollDirection = UICollectionViewScrollDirection.Horizontal;
        } else {
            this._layout.scrollDirection = UICollectionViewScrollDirection.Vertical;
        }
    }
    public [isScrollEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.scrollEnabled = value;
    }
    public [isBounceEnabledProperty.setNative](value: boolean) {
        this.nativeViewProtected.alwaysBounceVertical = value;
        this.nativeViewProtected.alwaysBounceHorizontal = value;
    }

    public [itemTemplatesProperty.getDefault](): KeyedTemplate[] {
        return null;
    }

    public eachChildView(callback: (child: View) => boolean): void {
        this._map.forEach((view, key) => {
            callback(view);
        });
    }

    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);

        const layout = this.nativeViewProtected.collectionViewLayout as UICollectionViewFlowLayout;
        if (this._effectiveColWidth || this._effectiveRowHeight) {
            layout.estimatedItemSize = layout.itemSize = CGSizeMake(utilLayout.toDeviceIndependentPixels(this._effectiveColWidth), utilLayout.toDeviceIndependentPixels(this._effectiveRowHeight));
        }
        this._map.forEach((cellView, cell) => {
            // console.log('onLayout', 'cell', cellView._listViewItemIndex);
            this.layoutCell(cellView._listViewItemIndex, cell, cellView);
        });
    }

    public isHorizontal() {
        return this._layout.scrollDirection === UICollectionViewScrollDirection.Horizontal;
    }

    public onSourceCollectionChanged(event /*: ChangedData<any>*/) {
        if (!this.nativeViewProtected) {
            return;
        }
        CLog(CLogTypes.info, 'onItemsChanged', event.action, event.index, event.addedCount, event.removed && event.removed.length);

        // return;
        switch (event.action) {
            case ChangeType.Delete: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index, 0));
                this.unbindUnusedCells(event.removed);
                CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
                this.nativeViewProtected.performBatchUpdatesCompletion(() => {
                    this.nativeViewProtected.deleteItemsAtIndexPaths(indexes);
                }, null);
                return;
            }
            case ChangeType.Add: {
                const indexes = NSMutableArray.new<NSIndexPath>();
                for (let index = 0; index < event.addedCount; index++) {
                    indexes.addObject(NSIndexPath.indexPathForRowInSection(event.index + index, 0));
                }
                // if (this._nativeView.collectionView.dragging) {
                //     // Adjust the content offset to force stop the drag:
                //     this._nativeView.collectionView.setContentOffsetAnimated(this._nativeView.collectionView.contentOffset, false);
                // }
                CLog(CLogTypes.info, 'insertItemsAtIndexPaths', indexes.count);
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
                        CLog(CLogTypes.info, 'deleteItemsAtIndexPaths', indexes.count);
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
        // console.log('onItemTemplatesChanged');
        if (!this.nativeViewProtected) {
            return;
        }
        for (let i = 0, length_1 = this._itemTemplatesInternal.length; i < length_1; i++) {
            this.nativeViewProtected.registerClassForCellWithReuseIdentifier(CollectionViewCell.class(), this._itemTemplatesInternal[i].key.toLowerCase());
        }
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
        if (!this.isLoaded) {
            this._isDataDirty = true;
            return;
        }
        this._isDataDirty = false;
        // CLog(CLogTypes.info, 'refresh', new Error().stack);

        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this._map.forEach((view, nativeView, map) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }
        });

        // TODO: this is ugly look here: https://github.com/nativescript-vue/nativescript-vue/issues/525
        this.clearRealizedCells();
        if (this.nativeView) {
            this.nativeView.reloadData();
        }
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
    public _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, templateType: string) {
        let cellSize: [number, number];
        try {
            this._preparingCell = true;
            let view = cell.view;
            if (!view) {
                view = this.getItemTemplateContent(indexPath.item, templateType);
            }

            const oldBindingContext = view && view.bindingContext;
            const bindingContext = this._prepareItem(view, indexPath.row);
            const args = this.notifyForItemAtIndex(this, cell, view, CollectionViewBase.itemLoadingEvent, indexPath, bindingContext);
            view = args.view;

            if (view instanceof ProxyViewContainer) {
                let sp = new StackLayout();
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
            view._listViewItemIndex = indexPath.row;

            if (oldBindingContext !== bindingContext) {
                view.requestLayout();
            }
            // const oldBindingContext = view && view.bindingContext;
            // const bindingContext = this._prepareItem(view, indexPath.row);
            // console.log('_prepareCell', indexPath.row, oldBindingContext, bindingContext);
            // if (oldBindingContext !== bindingContext) {
            //     // view['isLayoutRequired'] = true;
            //     view.requestLayout();
            // }
            // view.bindingContext = bindingContext;
            // this.notify({
            //     eventName: CollectionViewBase.itemLoadingInternalEvent,
            //     object: this,
            //     index: indexPath.row,
            //     ios: cell,
            //     view
            // });
            // Proxy containers should not get treated as layouts.
            // Wrap them in a real layout as well.
            // if (view instanceof ProxyViewContainer) {
            //     let sp = new StackLayout();
            //     sp.addChild(view);
            //     view = sp;
            // }

            // If cell is reused it have old content - remove it first.

            this._map.set(cell, view);

            if (view && !view.parent) {
                this._addView(view);
                cell.contentView.addSubview(view.nativeViewProtected);
            }

            cellSize = this.measureCell(cell, view, indexPath);

            // this.notifyForItemAtIndex(this, cell, view, CollectionViewBase.itemLoadingEvent, indexPath);
            // this.notify({
            //     eventName: CollectionViewBase.itemLoadingEvent,
            //     object: this,
            //     index: indexPath.row,
            //     ios: cell,
            //     view
            // });
            // console.log('_prepareCell done', indexPath.row, bindingContext['image'], bindingContext['name']);
        } finally {
            this._preparingCell = false;
        }
        return cellSize;
    }
    public getCellSize(index: number) {
        let result = this._sizes[index];
        // console.log('getCellSize', index, this._effectiveColWidth, this._effectiveRowHeight, this.getMeasuredWidth(), this.getMeasuredHeight());
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
    private measureCell(cell: CollectionViewCell, cellView: View, index: NSIndexPath): [number, number] {
        if (cellView) {
            let result: [number, number];
            const width = this._effectiveColWidth;
            const height = this._effectiveRowHeight;
            // if (width > 0 && height > 0) {
            //     result = [width, height];
            //     cellView.setMeasuredDimension(width, height);
            // } else {
                const horizontal = this.isHorizontal();
                const widthMeasureSpec = width ? utilLayout.makeMeasureSpec(width, utilLayout.EXACTLY) : horizontal ? infinity : utilLayout.makeMeasureSpec(this._innerWidth, utilLayout.UNSPECIFIED);
                const heightMeasureSpec = height
                    ? utilLayout.makeMeasureSpec(height, utilLayout.EXACTLY)
                    : horizontal
                    ? utilLayout.makeMeasureSpec(this._innerHeight, utilLayout.UNSPECIFIED)
                    : infinity;
                // console.log('measureCell', width, height, widthMeasureSpec, heightMeasureSpec);
                const measuredSize = View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
                // console.log(
                //     'measureCell',
                //     index.row,
                //     horizontal,
                //     this._innerWidth,
                //     this._innerHeight,
                //     width,
                //     height,
                //     widthMeasureSpec,
                //     heightMeasureSpec,
                //     cellView.getMeasuredWidth(),
                //     cellView.getMeasuredHeight(),
                //     measuredSize
                // );
                result = [measuredSize.measuredWidth, measuredSize.measuredHeight];
            // }

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
        // console.log('layoutCell', index, colWidth, rowHeight, cellWidth, cellHeight, cellView.getMeasuredWidth(), cellView.getMeasuredHeight());
    }

    private clearRealizedCells() {
        const that = new WeakRef<CollectionView>(this);
        this._map.forEach(function(value, key: CollectionViewCell) {
            that.get()._removeContainer(key);
            that.get()._clearCellViews(key);
        }, that);
        this._map.clear();
    }

    private _clearCellViews(cell: CollectionViewCell) {
        if (cell && cell.view) {
            if (cell.view.nativeViewProtected) {
                (cell.view.nativeViewProtected as UIView).removeFromSuperview();
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
        view._listViewItemIndex = undefined;
        this._preparingCell = preparing;
        this._map.delete(cell);
    }

    private _setPadding(newPadding: { top?: number; right?: number; bottom?: number; left?: number }) {
        const padding = {
            top: this._layout.sectionInset.top,
            right: this._layout.sectionInset.right,
            bottom: this._layout.sectionInset.bottom,
            left: this._layout.sectionInset.left
        };
        // tslint:disable-next-line:prefer-object-spread
        const newValue = Object.assign(padding, newPadding);
        this._layout.sectionInset = UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
    }
}

interface ViewItemIndex {
    _listViewItemIndex?: number;
}

type ItemView = View & ViewItemIndex;
export class CollectionViewCell extends UICollectionViewCell {
    public static new(): CollectionViewCell {
        return UICollectionViewCell.new() as CollectionViewCell;
    }
    public static class(): any {
        return CollectionViewCell;
    }

    public owner: WeakRef<ItemView>;

    get view(): ItemView {
        return this.owner ? this.owner.get() : null;
    }
}

@ObjCClass(UICollectionViewDataSource)
class CollectionViewDataSource extends NSObject implements UICollectionViewDataSource {
    public static initWithOwner(owner: WeakRef<CollectionView>): CollectionViewDataSource {
        const dataSource = CollectionViewDataSource.new() as CollectionViewDataSource;
        dataSource._owner = owner;
        return dataSource;
    }

    private _owner: WeakRef<CollectionView>;

    public numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        return 1;
    }

    public collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
        const owner = this._owner.get();
        return owner.items ? owner.items.length : 0;
    }

    @profile
    public collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        const owner = this._owner.get();
        const templateType = owner._getItemTemplateType(indexPath);
        const cell: any = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(templateType, indexPath) || CollectionViewCell.new();

        owner._prepareCell(cell, indexPath, templateType);

        const cellView: View = cell.view;
        if (cellView && cellView['isLayoutRequired']) {
            owner.layoutCell(indexPath.row, cell, cellView);
        }

        return cell;
    }
}

@ObjCClass(UICollectionViewDelegate, UICollectionViewDelegateFlowLayout)
class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    public static initWithOwner(owner: WeakRef<CollectionView>): UICollectionViewDelegateImpl {
        const delegate = UICollectionViewDelegateImpl.new() as UICollectionViewDelegateImpl;
        delegate._owner = owner;
        delegate._measureCellMap = new Map<string, CollectionViewCell>();
        return delegate;
    }
    private _measureCellMap: Map<string, CollectionViewCell>;

    private _owner: WeakRef<CollectionView>;

    public collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        const owner = this._owner.get();

        if (indexPath.row === owner.items.length - 1) {
            owner.notify<EventData>({
                eventName: CollectionViewBase.loadMoreItemsEvent,
                object: owner
            });
        }

        if (cell.preservesSuperviewLayoutMargins) {
            cell.preservesSuperviewLayoutMargins = false;
        }

        if (cell.layoutMargins) {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }

    public collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const cell = collectionView.cellForItemAtIndexPath(indexPath);
        const owner = this._owner.get();

        owner.notify<CollectionViewItemEventData>({
            eventName: CollectionViewBase.itemTapEvent,
            object: owner,
            index: indexPath.row,
            view: (cell as CollectionViewCell).view
        });

        cell.highlighted = false;

        return indexPath;
    }

    @profile
    public collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        const row = indexPath.row;
        const dataItem = owner.getItemAtIndex(row);
        if (dataItem.visible === false) {
            return CGSizeZero;
        }

        let measuredSize = owner.getCellSize(row);
        // if (measuredSize === undefined) {
        if (!measuredSize) {
            // console.log('collectionViewLayoutSizeForItemAtIndexPath', indexPath.row);
            const templateType = owner._getItemTemplateType(indexPath);
            if (templateType) {
                let cell = this._measureCellMap.get(templateType);
                if (!cell) {
                    cell = CollectionViewCell.new();
                    // cell = (<any>tableView.dequeueReusableCellWithIdentifier(template.key)) || ListViewCell.initWithEmptyBackground();
                    this._measureCellMap.set(templateType, cell);
                }
                measuredSize = owner._prepareCell(cell, indexPath, templateType);
            }
        }
        // console.log('collectionViewLayoutSizeForItemAtIndexPath', row, measuredSize);
        // }
        if (measuredSize) {
            return CGSizeMake(utilLayout.toDeviceIndependentPixels(measuredSize[0]), utilLayout.toDeviceIndependentPixels(measuredSize[1]));
        }
        return CGSizeZero;
    }

    public scrollViewDidScroll(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.notify({
                object: owner,
                eventName: 'scroll',
                scrollOffset: owner.isHorizontal() ? scrollView.contentOffset.x : scrollView.contentOffset.y
            });
        }
    }
}
