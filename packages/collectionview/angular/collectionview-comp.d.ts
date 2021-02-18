import { AfterContentInit, DoCheck, ElementRef, EmbeddedViewRef, EventEmitter, IterableDiffers, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { View } from '@nativescript/core';
import { CollectionViewItemEventData } from '@nativescript-community/ui-collectionview';
import * as i0 from "@angular/core";
export declare class ItemContext {
    $implicit?: any;
    item?: any;
    index?: number;
    even?: boolean;
    odd?: boolean;
    constructor($implicit?: any, item?: any, index?: number, even?: boolean, odd?: boolean);
}
export interface SetupItemViewArgs {
    view: EmbeddedViewRef<any>;
    data: any;
    index: number;
    context: ItemContext;
}
export declare class CollectionViewComponent implements DoCheck, OnDestroy, AfterContentInit {
    private _iterableDiffers;
    get nativeElement(): any;
    get listView(): any;
    loader: ViewContainerRef;
    setupItemView: EventEmitter<SetupItemViewArgs>;
    itemTemplateQuery: TemplateRef<ItemContext>;
    get itemTemplate(): any;
    set itemTemplate(value: any);
    get items(): any;
    set items(value: any);
    private _collectionView;
    private _items;
    private _differ;
    private _itemTemplate;
    private _templateMap;
    constructor(_elementRef: ElementRef, _iterableDiffers: IterableDiffers);
    private itemViewLoader;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    registerTemplate(key: string, template: TemplateRef<ItemContext>): void;
    onItemLoading(args: CollectionViewItemEventData): void;
    setupViewRef(view: EmbeddedViewRef<ItemContext>, data: any, index: number): void;
    protected getItemTemplateViewFactory(template: TemplateRef<ItemContext>): () => View;
    private setItemTemplates;
    private detectChangesOnChild;
    private refresh;
    static ɵfac: i0.ɵɵFactoryDef<CollectionViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<CollectionViewComponent, "CollectionView", never, { "itemTemplate": "itemTemplate"; "items": "items"; }, { "setupItemView": "setupItemView"; }, ["itemTemplateQuery"], never>;
}
export interface ComponentView {
    rootNodes: any[];
    destroy(): void;
}
export declare type RootLocator = (nodes: any[], nestLevel: number) => View;
export declare function getItemViewRoot(viewRef: ComponentView, rootLocator?: RootLocator): View;
export declare class TemplateKeyDirective {
    private templateRef;
    private collectionView;
    constructor(templateRef: TemplateRef<any>, collectionView: CollectionViewComponent);
    set cvTemplateKey(value: any);
    static ɵfac: i0.ɵɵFactoryDef<TemplateKeyDirective, [null, { host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<TemplateKeyDirective, "[cvTemplateKey]", never, { "cvTemplateKey": "cvTemplateKey"; }, {}, never>;
}
