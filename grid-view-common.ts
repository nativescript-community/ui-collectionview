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

import { ObservableArray } from "data/observable-array";
import { parse, parseMultipleTemplates } from "ui/builder";
import { makeParser, makeValidator } from "ui/content-view";
import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from "ui/core/view";
import { addWeakEventListener, removeWeakEventListener } from "ui/core/weak-event-listener";
import { Label } from "ui/label";
import { ItemsSource } from "ui/list-view";
import { GridView as GridViewDefinition, Orientation } from ".";

const autoEffectiveRowHeight = 100;
const autoEffectiveColWidth = 100;

export * from "ui/core/view";

// tslint:disable-next-line
export module knownTemplates {
    export const itemTemplate = "itemTemplate";
}

// tslint:disable-next-line
export module knownMultiTemplates {
    export const itemTemplates = "itemTemplates";
}

export abstract class GridViewBase extends View implements GridViewDefinition {
    public static itemLoadingEvent = "itemLoading";
    public static itemTapEvent = "itemTap";
    public static loadMoreItemsEvent = "loadMoreItems";
    public static knownFunctions = ["itemTemplateSelector", "itemIdGenerator"]; // See component-builder.ts isKnownFunction

    public _defaultTemplate: KeyedTemplate = {
        key: "default",
        createView: () => {
            if (this.itemTemplate) {
                return parse(this.itemTemplate, this);
            }
            return undefined;
        }
    };
    public _itemTemplatesInternal = new Array<KeyedTemplate>(this._defaultTemplate);

    public orientation: Orientation;
    public itemTemplate: string | Template;
    public itemTemplates: string | KeyedTemplate[];
    public items: any[] | ItemsSource;
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
    
    get itemTemplateSelector(): string | ((item: any, index: number, items: any) => string) {
        return this._itemTemplateSelector;
    }
    set itemTemplateSelector(value: string | ((item: any, index: number, items: any) => string)) {
        if (typeof value === "string") {
            this._itemTemplateSelectorBindable.bind({
                sourceProperty: null,
                targetProperty: "templateKey",
                expression: value
            });
            this._itemTemplateSelector = (item: any, index: number, items: any) => {
                item["$index"] = index;
                this._itemTemplateSelectorBindable.bindingContext = item;
                return this._itemTemplateSelectorBindable.get("templateKey");
            };
        }
        else if (typeof value === "function") {
            this._itemTemplateSelector = value;
        }
    }

    public itemIdGenerator: (item: any, index: number, items: any) => number = (_item: any, index: number) => index;

    public abstract refresh();
    public abstract scrollToIndex(index: number, animated: boolean);

    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);

        this._innerWidth = right - left - this.effectivePaddingLeft - this.effectivePaddingRight;
        this._effectiveColWidth = PercentLength.toDevicePixels(this.colWidth, autoEffectiveColWidth, this._innerWidth); // We cannot use 0 for auto as it throws for android. 

        this._innerHeight = bottom - top - this.effectivePaddingTop - this.effectivePaddingBottom;
        this._effectiveRowHeight = PercentLength.toDevicePixels(this.rowHeight, autoEffectiveRowHeight, this._innerHeight);
    }
    
    public _getItemTemplate(index: number): KeyedTemplate {
        let templateKey = "default";
        if (this.itemTemplateSelector) {
            const dataItem = this._getDataItem(index);
            templateKey = this._itemTemplateSelector(dataItem, index, this.items);
        }

        for (const template of this._itemTemplatesInternal) {
            if (template.key === templateKey) {
                return template;
            }
        }

        // This is the default template
        return this._itemTemplatesInternal[0];
    }

    public _prepareItem(item: View, index: number) {
        if (item) {
            item.bindingContext = this._getDataItem(index);
        }
    }

    public _getDataItem(index: number): any {
        return this.isItemsSourceIn ? (this.items as ItemsSource).getItem(index) : this.items[index];
    }
}

export const itemsProperty = new Property<GridViewBase, any[] | ItemsSource>({
    name: "items",
    valueChanged: (target, oldValue, newValue) => {
        const getItem = newValue && (newValue as ItemsSource).getItem;

        target.isItemsSourceIn = typeof getItem === "function";

        if (oldValue instanceof ObservableArray) {
            removeWeakEventListener(oldValue, ObservableArray.changeEvent, target.refresh, target);
        }

        if (newValue instanceof ObservableArray) {
            addWeakEventListener(newValue, ObservableArray.changeEvent, target.refresh, target);
        }

        target.refresh();
    }
});
itemsProperty.register(GridViewBase);

export const itemTemplateProperty = new Property<GridViewBase, string | Template>({
    name: "itemTemplate",
    valueChanged: (target) => {
        target.refresh();
    }
});
itemTemplateProperty.register(GridViewBase);

const defaultRowHeight: PercentLength = "auto";
export const rowHeightProperty = new CoercibleProperty<GridViewBase, PercentLength>({
    name: "rowHeight",
    defaultValue: defaultRowHeight,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultRowHeight;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = PercentLength.toDevicePixels(newValue, autoEffectiveRowHeight, target._innerHeight);
        target.refresh();
    }
});
rowHeightProperty.register(GridViewBase);

const defaultColWidth: PercentLength = "auto";
export const colWidthProperty = new CoercibleProperty<GridViewBase, PercentLength>({
    name: "colWidth",
    defaultValue: PercentLength.parse("100"),
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultColWidth;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveColWidth = PercentLength.toDevicePixels(newValue, autoEffectiveColWidth, target._innerWidth);
        target.refresh();
    }
});
colWidthProperty.register(GridViewBase);

const converter = makeParser<Orientation>(makeValidator("horizontal", "vertical"));
export const orientationProperty = new Property<GridViewBase, Orientation>({
    name: "orientation",
    defaultValue: "vertical",
    affectsLayout: true,
    valueChanged: (target: GridViewBase, oldValue: Orientation, newValue: Orientation) => {
        target.refresh();
    },
    valueConverter: converter
});
orientationProperty.register(GridViewBase);

export const itemTemplatesProperty = new Property<GridViewBase, string | KeyedTemplate[]>({
    name: "itemTemplates",
    valueConverter: (value) => {
        if (typeof value === "string") {
            return parseMultipleTemplates(value);
        }

        return value;
    }
});
itemTemplatesProperty.register(GridViewBase);
