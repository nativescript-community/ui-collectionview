import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from "ui/core/view";
import { ItemsSource } from "ui/list-view";
import { CollectionView as CollectionViewDefinition, Orientation } from "./collectionview";
import { ChangedData } from "data/observable-array";
export * from "ui/core/view";
export declare enum ListViewViewTypes {
    ItemView = 0,
}
export declare namespace knownTemplates {
    const itemTemplate = "itemTemplate";
}
export declare namespace knownMultiTemplates {
    const itemTemplates = "itemTemplates";
}
export declare abstract class CollectionViewBase extends View implements CollectionViewDefinition {
    static itemLoadingEvent: string;
    static cellCreateEvent: string;
    static scrollEvent: string;
    static itemTapEvent: string;
    static loadMoreItemsEvent: string;
    static dataPopulatedEvent: string;
    static knownFunctions: string[];
    orientation: Orientation;
    itemTemplate: string | Template;
    itemTemplates: string | KeyedTemplate[];
    isItemsSourceIn: boolean;
    rowHeight: PercentLength;
    colWidth: PercentLength;
    verticalSpacing: Length;
    horizontalSpacing: Length;
    _innerWidth: number;
    _innerHeight: number;
    _effectiveRowHeight: number;
    _effectiveColWidth: number;
    protected _itemTemplatesInternal: KeyedTemplate[];
    protected _defaultTemplate: KeyedTemplate;
    private _itemTemplateSelectorBindable;
    constructor();
    itemIdGenerator: (item: any, index: number, items: any) => number;
    abstract refresh(): any;
    abstract scrollToIndex(index: number, animated: boolean): any;
    setMeasuredDimension(measuredWidth: number, measuredHeight: number): void;
    items: any[] | ItemsSource;
    _prepareItem(item: View, index: number): void;
    getItemAtIndex(index: number): any;
    _onRowHeightPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
    _onColWidthPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
    onItemViewLoaderChanged(): void;
    _itemViewLoader: any;
    itemViewLoader: any;
    resolveTemplateView(template: any): View;
    getTemplateFromSelector(templateKey: any): KeyedTemplate;
    getViewForViewType(viewType: any, templateKey: any): any;
    itemTemplateSelector: Function;
    onItemTemplateSelectorChanged(oldValue: any, newValue: any): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    onItemTemplateChanged(oldValue: any, newValue: any): void;
    onItemTemplateSelectorPropertyChanged(oldValue: any, newValue: any): void;
    onItemTemplatesPropertyChanged(oldValue: any, newValue: any): void;
    onItemTemplatePropertyChanged(oldValue: any, newValue: any): void;
    onItemsChangedInternal: (oldValue: any, newValue: any) => void;
    onLoaded(): void;
    onSourceCollectionChanged(event: ChangedData<any>): void;
    onSourceCollectionChangedInternal(event: ChangedData<any>): void;
    onItemsChanged(oldValue: any, newValue: any): void;
}
export declare const rowHeightProperty: CoercibleProperty<CollectionViewBase, PercentLength>;
export declare const colWidthProperty: CoercibleProperty<CollectionViewBase, PercentLength>;
export declare const orientationProperty: Property<CollectionViewBase, Orientation>;
export declare const itemTemplateProperty: Property<CollectionViewBase, string | Template>;
export declare const itemTemplatesProperty: Property<CollectionViewBase, KeyedTemplate[]>;
export declare const itemTemplateSelectorProperty: Property<CollectionViewBase, Function>;
export declare const itemsProperty: Property<CollectionViewBase, Function>;
