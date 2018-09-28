import { KeyedTemplate } from 'ui/core/view';
import { CollectionViewBase } from './collectionview-common';
export * from './collectionview-common';
export interface ViewTypeTemplate extends KeyedTemplate {
    viewType?: number;
}
import RecyclerView = android.support.v7.widget.RecyclerView;
import { ChangedData } from 'tns-core-modules/data/observable-array/observable-array';
export declare class CollectionView extends CollectionViewBase {
    static DEFAULT_TEMPLATE_VIEW_TYPE: number;
    static CUSTOM_TEMPLATE_ITEM_TYPE: number;
    nativeView: RecyclerView;
    _itemTemplatesByViewType: Map<number, KeyedTemplate>;
    private adapter;
    private layoutManager;
    private itemTypeCount;
    constructor();
    createNativeView(): CollectionViewRecyclerView;
    initNativeView(): void;
    disposeNativeView(): void;
    readonly android: RecyclerView;
    _getViewLayoutParams(): org.nativescript.widgets.CommonLayoutParams;
    addTemplate(template: any): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onItemsChanged(event: ChangedData<any>): void;
    isHorizontal(): boolean;
    refresh(): void;
    scrollToIndex(index: number, animated?: boolean): void;
    private _setPadding(newPadding);
    private _getLayoutManagarOrientation();
    private createComposedAdapter(recyclerView);
}
export interface CollectionViewRecyclerView extends android.support.v7.widget.RecyclerView {
    new (context: any, owner: WeakRef<CollectionView>): CollectionViewRecyclerView;
}
export interface GridLayoutManager extends android.support.v7.widget.GridLayoutManager {
    new (context: any, owner: WeakRef<CollectionView>): GridLayoutManager;
}
