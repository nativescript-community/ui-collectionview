import { ChangedData, TouchGestureEventData, View } from '@nativescript/core';
import { Pointer } from '@nativescript/core/ui/gestures';
import { CollectionViewBase } from './collectionview-common';
export * from './collectionview-common';
export declare enum ContentInsetAdjustmentBehavior {
    Always = 3,
    Automatic = 0,
    Never = 2,
    ScrollableAxes = 1
}
export declare const contentInsetAdjustmentBehaviorProperty: any;
export declare class CollectionView extends CollectionViewBase {
    private _layout;
    private _dataSource;
    private _delegate;
    private _preparingCell;
    private _sizes;
    private _map;
    _measureCellMap: Map<string, {
        cell: CollectionViewCell;
        view: View;
    }>;
    _lastLayoutKey: string;
    reorderLongPressGesture: UILongPressGestureRecognizer;
    reorderLongPressHandler: ReorderLongPressImpl;
    reorderStartingRow: number;
    reorderEndingRow: number;
    manualDragging: boolean;
    scrollEnabledBeforeDragging: boolean;
    draggingStartDelta: [number, number];
    nativeViewProtected: UICollectionView;
    constructor();
    createNativeView(): UICollectionView;
    onTemplateAdded(t: any): void;
    initNativeView(): void;
    disposeNativeView(): void;
    get _childrenCount(): number;
    getViewForItemAtIndex(index: number): View;
    startDragging(index: number, pointer?: Pointer): void;
    onReorderingTouch(event: TouchGestureEventData): void;
    handleReorderEnd(): void;
    onReorderLongPress(gesture: UILongPressGestureRecognizer): void;
    protected updateScrollBarVisibility(value: any): void;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    isHorizontal(): boolean;
    onSourceCollectionChanged(event: ChangedData<any>): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    private unbindUnusedCells;
    refreshVisibleItems(): void;
    refresh(): void;
    get scrollOffset(): number;
    get verticalOffsetX(): number;
    get verticalOffsetY(): number;
    scrollToIndex(index: number, animated?: boolean): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    _setNativeClipToBounds(): void;
    notifyForItemAtIndex(listView: CollectionViewBase, cell: any, view: View, eventName: string, indexPath: NSIndexPath, bindingContext?: any): {
        eventName: string;
        object: CollectionViewBase;
        index: number;
        view: View;
        ios: any;
        bindingContext: any;
    };
    _getItemTemplateType(indexPath: any): string;
    getItemTemplateContent(index: any, templateType: any): any;
    _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, templateType: string, addToMap?: boolean): [number, number];
    getCellSize(index: number): number[];
    storeCellSize(index: number, value: any): void;
    clearCellSize(): void;
    private measureCell;
    layoutCell(index: number, cell: CollectionViewCell, cellView: View): any;
    private clearRealizedCells;
    private _clearCellViews;
    private _removeContainer;
    private _setPadding;
    numberOfSectionsInCollectionView(collectionView: UICollectionView): number;
    collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number): number;
    collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell;
    collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath): void;
    collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): NSIndexPath;
    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath): CGSize;
    scrollViewDidScroll(scrollView: UIScrollView): void;
    scrollViewDidEndDecelerating(scrollView: UIScrollView): void;
    scrollViewWillEndDraggingWithVelocityTargetContentOffset?(scrollView: UIScrollView, velocity: CGPoint, targetContentOffset: interop.Pointer | interop.Reference<CGPoint>): void;
}
interface ViewItemIndex {
}
declare type ItemView = View & ViewItemIndex;
declare class CollectionViewCell extends UICollectionViewCell {
    owner: WeakRef<ItemView>;
    get view(): ItemView;
}
declare class ReorderLongPressImpl extends NSObject {
    private _owner;
    static initWithOwner(owner: WeakRef<CollectionView>): ReorderLongPressImpl;
    longPress(recognizer: UILongPressGestureRecognizer): void;
    static ObjCExposedMethods: {
        longPress: {
            returns: interop.Type<void>;
            params: interop.Type<any>[];
        };
    };
}
