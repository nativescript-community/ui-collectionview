/*! *****************************************************************************
Copyright (c) 2017 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from "ui/core/view";
import { Label } from "ui/label";
import { ItemsSource } from "ui/list-view";
import { CollectionView as CollectionViewDefinition, Orientation } from "./collectionview";
import { ChangedData } from "data/observable-array";
export * from "ui/core/view";
export declare enum ListViewViewTypes {
    ItemView = 0,
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
    private _itemTemplateSelector;
    constructor();
    itemIdGenerator: (item: any, index: number, items: any) => number;
    abstract refresh(): any;
    abstract scrollToIndex(index: number, animated: boolean): any;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    items: any[] | ItemsSource;
    _prepareItem(item: View, index: number): void;
    getItemAtIndex(index: number): any;
    _onRowHeightPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
    _onColWidthPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
    onItemViewLoaderChanged(): void;
    _itemViewLoader: any;
    itemViewLoader: any;
    resolveTemplateView(template: any): View;
    _getDefaultItemContent(): Label;
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
