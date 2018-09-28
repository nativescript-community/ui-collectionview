import { KeyedTemplate, View } from 'ui/core/view';
import { CollectionViewBase } from './collectionview-common';
import { ChangedData } from 'tns-core-modules/data/observable-array/observable-array';
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
    addTemplate(template: any): void;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    isHorizontal(): boolean;
    onItemsChanged(event: ChangedData<any>): void;
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
    _prepareCell(cell: CollectionViewCell, indexPath: NSIndexPath, template?: KeyedTemplate): [number, number];
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
