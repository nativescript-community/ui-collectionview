import { View } from 'ui/core/view';
import { CollectionViewBase } from './collectionview-common';
export * from './collectionview-common';
export declare class CollectionView extends CollectionViewBase {
    private _layout;
    private _dataSource;
    private _delegate;
    private _preparingCell;
    private _sizes;
    private _map;
    constructor();
    onLoaded(): void;
    onUnloaded(): void;
    readonly ios: UICollectionView;
    readonly _childrenCount: number;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    isHorizontal(): boolean;
    onSourceCollectionChanged(event: any): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    private unbindUnusedCells(removedDataItems);
    refresh(): void;
    scrollToIndex(index: number, animated?: boolean): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    _setNativeClipToBounds(): void;
    notifyForItemAtIndex(listView: CollectionViewBase, cell: any, view: View, eventName: string, indexPath: NSIndexPath): {
        eventName: string;
        object: CollectionViewBase;
        index: number;
        view: View;
        ios: any;
        android: any;
    };
    _getItemTemplateType(indexPath: any): string;
    getItemTemplateContent(index: any, templateType: any): any;
    _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, templateType: string): [number, number];
    getCellSize(index: number): number[];
    storeCellSize(index: number, value: any): void;
    private _layoutCell(cell, cellView, index);
    private _removeContainer(cell);
    private _setPadding(newPadding);
}
export declare class CollectionViewCell extends UICollectionViewCell {
    static new(): CollectionViewCell;
    static class(): any;
    owner: WeakRef<View>;
    readonly view: View;
}
