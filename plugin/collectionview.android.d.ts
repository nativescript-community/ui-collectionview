import { KeyedTemplate } from "ui/core/view";
import { CollectionViewBase } from "./collectionview-common";
export * from "./collectionview-common";
export interface ViewTypeTemplate extends KeyedTemplate {
    viewType?: number;
}
export declare const knownTemplates: {
    itemTemplate: string;
};
export declare const knownMultiTemplates: {
    itemTemplates: string;
};
import RecyclerView = android.support.v7.widget.RecyclerView;
import { ChangedData } from "data/observable-array";
export declare class CollectionView extends CollectionViewBase {
    static DEFAULT_TEMPLATE_VIEW_TYPE: number;
    static CUSTOM_TEMPLATE_ITEM_TYPE: number;
    nativeView: RecyclerView;
    private _listViewAdapter;
    private layoutManager;
    private itemTypeCount;
    constructor();
    createNativeView(): CollectionViewRecyclerView;
    initNativeView(): void;
    disposeNativeView(): void;
    readonly android: RecyclerView;
    _getViewLayoutParams(): org.nativescript.widgets.CommonLayoutParams;
    onItemViewLoaderChanged(): void;
    onItemTemplateSelectorChanged(oldValue: any, newValue: any): void;
    onItemTemplateChanged(oldValue: any, newValue: any): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onSourceCollectionChanged(event: ChangedData<any>): void;
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
