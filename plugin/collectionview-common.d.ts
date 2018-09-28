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
import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from 'ui/core/view';
import { ItemsSource } from 'ui/list-view';
import { CollectionView as CollectionViewDefinition, Orientation } from './collectionview';
import { ChangedData } from 'data/observable-array';
export * from 'ui/core/view';
export declare namespace knownTemplates {
    const itemTemplate = "itemTemplate";
}
export declare namespace knownMultiTemplates {
    const itemTemplates = "itemTemplates";
}
export declare abstract class CollectionViewBase extends View implements CollectionViewDefinition {
    static itemLoadingEvent: string;
    static scrollEvent: string;
    static itemTapEvent: string;
    static loadMoreItemsEvent: string;
    static knownFunctions: string[];
    _defaultTemplate: KeyedTemplate;
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
    protected _itemTemplatesInternal: Map<string, KeyedTemplate>;
    private _itemTemplateSelectorBindable;
    private _itemTemplateSelector;
    constructor();
    itemTemplateSelector: string | ((item: any, index: number, items: any) => string);
    itemIdGenerator: (item: any, index: number, items: any) => number;
    abstract onItemsChanged(event: ChangedData<any>): any;
    abstract refresh(): any;
    abstract scrollToIndex(index: number, animated: boolean): any;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    _getItemTemplateByIndex(index: number): KeyedTemplate;
    _getItemTemplateKey(dataItem: any, index: number, isHeader?: boolean): string;
    _getItemTemplateKeyByIndex(index: number, isHeader?: boolean): string;
    _getItemTemplate(index: number, isHeader?: boolean): KeyedTemplate;
    items: any[] | ItemsSource;
    _prepareItem(item: View, index: number): void;
    _getDataItem(index: number): any;
    _onRowHeightPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
    _onColWidthPropertyChanged(oldValue: PercentLength, newValue: PercentLength): void;
}
export declare const itemsProperty: Property<CollectionViewBase, any[] | ItemsSource>;
export declare const itemTemplateProperty: Property<CollectionViewBase, string | Template>;
export declare const itemTemplatesProperty: Property<CollectionViewBase, string | KeyedTemplate[]>;
export declare const rowHeightProperty: CoercibleProperty<CollectionViewBase, PercentLength>;
export declare const colWidthProperty: CoercibleProperty<CollectionViewBase, PercentLength>;
export declare const orientationProperty: Property<CollectionViewBase, Orientation>;
