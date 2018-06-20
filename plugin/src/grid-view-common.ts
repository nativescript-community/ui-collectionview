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

// import { ObservableArray } from 'data/observable-array';
import * as observable from 'data/observable';
import { parse, parseMultipleTemplates } from 'ui/builder';
import { makeParser, makeValidator } from 'ui/content-view';
import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from 'ui/core/view';
import { addWeakEventListener, removeWeakEventListener } from 'ui/core/weak-event-listener';
import { Label } from 'ui/label';
import { ItemsSource } from 'ui/list-view';
import { GridView as GridViewDefinition, Orientation } from './grid-view';
import * as dependencyObservable from "ui/core/dependency-observable";
import {ObservableArray} from "data/observable-array";
import * as weakEventsModule from "ui/core/weak-event-listener";

const autoEffectiveRowHeight = 0;
const autoEffectiveColWidth = 0;

export * from 'ui/core/view';

// tslint:disable-next-line
export namespace knownTemplates {
    export const itemTemplate = 'itemTemplate';
}

// tslint:disable-next-line
export namespace knownMultiTemplates {
    export const itemTemplates = 'itemTemplates';
}

export abstract class GridViewBase extends View implements GridViewDefinition {
    public static itemLoadingEvent = 'itemLoading';
    public static itemTapEvent = 'itemTap';
    public static loadMoreItemsEvent = 'loadMoreItems';
    public static knownFunctions = ['itemTemplateSelector', 'itemIdGenerator']; // See component-builder.ts isKnownFunction

    public _defaultTemplate: KeyedTemplate = {
        key: 'default',
        createView: () => {
            if (this.itemTemplate) {
                return parse(this.itemTemplate, this);
            }
            return undefined;
        }
    };
    protected _itemTemplatesInternal: Map<string, KeyedTemplate>;

    public orientation: Orientation;
    public itemTemplate: string | Template;
    public itemTemplates: string | KeyedTemplate[];
    // public items: any[] | ItemsSource;
    public isItemsSourceIn: boolean;
    public rowHeight: PercentLength;
    public colWidth: PercentLength;
    public verticalSpacing: Length;
    public horizontalSpacing: Length;
    public _innerWidth: number = 0;
    public _innerHeight: number = 0;
    public _effectiveRowHeight: number;
    public _effectiveColWidth: number;

    private _itemTemplateSelectorBindable = new Label();
    private _itemTemplateSelector: (item: any, index: number, items: any) => string;

    constructor() {
        super();
        this._itemTemplatesInternal = new Map<string, KeyedTemplate>();
        this._itemTemplatesInternal.set('default', this._defaultTemplate);
    }

    get itemTemplateSelector(): string | ((item: any, index: number, items: any) => string) {
        return this._itemTemplateSelector;
    }
    set itemTemplateSelector(value: string | ((item: any, index: number, items: any) => string)) {
        if (typeof value === 'string') {
            this._itemTemplateSelectorBindable.bind({
                sourceProperty: null,
                targetProperty: 'templateKey',
                expression: value
            });
            this._itemTemplateSelector = (item: any, index: number, items: any) => {
                item['$index'] = index;
                this._itemTemplateSelectorBindable.bindingContext = item;
                return this._itemTemplateSelectorBindable.get('templateKey');
            };
        } else if (typeof value === 'function') {
            this._itemTemplateSelector = value;
        }
    }

    public itemIdGenerator: (item: any, index: number, items: any) => number = (_item: any, index: number) => index;

    public abstract onItemsChanged();
    public abstract refresh();
    public abstract scrollToIndex(index: number, animated: boolean);

    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);
        this._innerWidth = right - left - this.effectivePaddingLeft - this.effectivePaddingRight;
        // console.log('onLayout', this.colWidth, this.rowHeight);
        if (this.colWidth) {
            this._effectiveColWidth = PercentLength.toDevicePixels(this.colWidth, autoEffectiveColWidth, this._innerWidth); // We cannot use 0 for auto as it throws for android.
        }

        this._innerHeight = bottom - top - this.effectivePaddingTop - this.effectivePaddingBottom;
        if (this.rowHeight) {
            this._effectiveRowHeight = PercentLength.toDevicePixels(this.rowHeight, autoEffectiveRowHeight, this._innerHeight);
        }
    }

    // public _getItemTemplateKey(index: number, section:number): string {
    //     let templateKey = 'default';
    //     let dataItem = this._getDataItem(index, section);
    //     if (typeof dataItem.template === 'string') {
    //         templateKey = dataItem.template;
    //     // } else if (this.itemTemplateSelector) {
    //         // templateKey = this._itemTemplateSelector(dataItem, index, section, this.sections);
    //     }
    //     return templateKey;
    // }

    public _getItemTemplateByIndex(index: number): KeyedTemplate {
        // let templateKey = this._getItemTemplateKey(index, section);
        return this._getItemTemplate(this._getDataItem(index))
    }

    public _getItemTemplateKey(dataItem, index:number, isHeader = false): string {
        let templateKey = isHeader?'header':'default';
        if (typeof dataItem.template === 'string') {
            templateKey = dataItem.template;
        } else if (this.itemTemplateSelector) {
            templateKey = this._itemTemplateSelector(dataItem, index, this.items);
        }
        return templateKey;
    }
    public _getItemTemplateKeyByIndex(index: number, isHeader = false): string {
        // let templateKey = this._getItemTemplateKey(index, section);
        return this._getItemTemplateKey(this._getDataItem(index), index, isHeader)
    }

    public _getItemTemplate(index:number, isHeader = false): KeyedTemplate {
        return this._itemTemplatesInternal.get(this._getItemTemplateKeyByIndex(index, isHeader));
    }

    get items(): any[] | ItemsSource {
        return this._getValue(itemsProperty);
    }
    set items(value: any[] | ItemsSource) {
        this._setValue(itemsProperty, value);
    }

    // public _prepareItem(item: View, index: number) {
    //     if (item) {
    //         item.bindingContext = this._getDataItem(index);
    //     }
    // }

    // public _getDataItem(index: number): any {
    //     return this.isItemsSourceIn ? (this.items as ItemsSource).getItem(index) : this.items[index];
    // }

    // public _getItemTemplateContent(row: number, section:number =0): view.View {
    //     var v;

    //     if (this.itemTemplate && this.items) {
    //         var builder : typeof builderModule = require("ui/builder");

    //         v = builder.parse(this.itemTemplate, this);
    //     }

    //     return v;
    // }
    
    // public _getHeaderTemplateContent(section:number =0): view.View {
    //     var v;

    //     if (this.headerTemplate) {
    //         var builder : typeof builderModule = require("ui/builder");

    //         v = builder.parse(this.headerTemplate, this);
    //     }

    //     return v;
    // }

    public _prepareItem(item: View, row: number) {
        if (item) {
            var dataItem = this._getDataItem(row);
            if (!(dataItem instanceof observable.Observable)) {
                item.bindingContext = null;
            }
            item.bindingContext = dataItem;
        }
    }

    public _getDataItem(index: number): any {
        // if(this.sections.getItem()) {
            // return this.items.getItem(row);
        // }
        return this.isItemsSourceIn ? (this.items as ItemsSource).getItem(index) : this.items[index];
    }

    // public _getDefaultHeaderContent(row: number, section:number = 0): View {
    //     var label: typeof labelModule = require("ui/label");

    //     var lbl = new label.Label();
    //     lbl.bind({
    //         targetProperty: "text",
    //         sourceProperty: "$value"
    //     });
    //     return lbl;
    // }


    public _onRowHeightPropertyChanged(oldValue: PercentLength, newValue: PercentLength) {
        this.refresh();
    }
    public _onColWidthPropertyChanged(oldValue: PercentLength, newValue: PercentLength) {
        this.refresh();
    }

}

export const itemsProperty = new Property<GridViewBase, any[] | ItemsSource>({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        const getItem = newValue && (newValue as ItemsSource).getItem;

        target.isItemsSourceIn = typeof getItem === 'function';

        if (oldValue instanceof observable.Observable) {
            removeWeakEventListener(oldValue, ObservableArray.changeEvent, target.refresh, target);
        }

        if (newValue instanceof observable.Observable) {
            addWeakEventListener(newValue, ObservableArray.changeEvent, target.refresh, target);
        }

        target.onItemsChanged();
    }
});
itemsProperty.register(GridViewBase);

export const itemTemplateProperty = new Property<GridViewBase, string | Template>({
    name: 'itemTemplate',
    valueChanged: target => {
        target.refresh();
    }
});
itemTemplateProperty.register(GridViewBase);

export const itemTemplatesProperty = new Property<GridViewBase, string | KeyedTemplate[]>({
    name: 'itemTemplates',
    valueConverter: value => {
        if (typeof value === 'string') {
            return parseMultipleTemplates(value);
        }

        return value;
    }
});
itemTemplatesProperty.register(GridViewBase);

const defaultRowHeight: Length = "auto";
export const rowHeightProperty = new CoercibleProperty<GridViewBase, PercentLength>({
    name: 'rowHeight',
    defaultValue: defaultRowHeight,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultRowHeight;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = PercentLength.toDevicePixels(newValue, autoEffectiveRowHeight, target._innerHeight);
        target._onRowHeightPropertyChanged(oldValue, newValue);
        // target.refresh();
    }
});
rowHeightProperty.register(GridViewBase);

const defaultColWidth: PercentLength = 'auto';
export const colWidthProperty = new CoercibleProperty<GridViewBase, PercentLength>({
    name: 'colWidth',
    defaultValue: defaultColWidth,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultColWidth;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveColWidth = PercentLength.toDevicePixels(newValue, autoEffectiveColWidth, target._innerWidth);
        target._onColWidthPropertyChanged(oldValue, newValue);
        // target.refresh();
    }
});
colWidthProperty.register(GridViewBase);

const converter = makeParser<Orientation>(makeValidator('horizontal', 'vertical'));
export const orientationProperty = new Property<GridViewBase, Orientation>({
    name: 'orientation',
    defaultValue: 'vertical',
    affectsLayout: true,
    valueChanged: (target: GridViewBase, oldValue: Orientation, newValue: Orientation) => {
        target.refresh();
    },
    valueConverter: converter
});
orientationProperty.register(GridViewBase);
