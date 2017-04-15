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

import { Observable } from "data/observable";
import { parse } from "ui/builder";
import { CoercibleProperty, Length, Property, Template, View } from "ui/core/view";
import { ItemsSource } from "ui/list-view";
import { GridView as GridViewDefinition } from ".";

const GRIDVIEW = "GridView";
const CHANGE = "change";

const autoEffectiveRowHeight = 100;
const autoEffectiveColWidth = 100;
const autoEffectiveSpacing = 10;

export * from "ui/core/view";

export module knownTemplates {
    export const itemTemplate = "itemTemplate";
}

export abstract class GridViewBase extends View implements GridViewDefinition {
    public static itemLoadingEvent = "itemLoading";
    public static itemTapEvent = "itemTap";
    public static loadMoreItemsEvent = "loadMoreItems";

    public itemTemplate: string | Template;
    public items: any[] | ItemsSource;
    public isItemsSourceIn: boolean;
    public rowHeight: Length;
    public colWidth: Length;
    public verticalSpacing: Length;
    public horizontalSpacing: Length;
    public _effectiveRowHeight: number;
    public _effectiveColWidth: number;
    public _effectiveVerticalSpacing: number;
    public _effectiveHorizontalSpacing: number;

    public abstract refresh();

    public _getItemTemplateContent(): View {
        let view;

        if (this.itemTemplate) {
            view = parse(this.itemTemplate, this);
        }

        return view;
    }

    public _prepareItem(item: View, index: number) {
        if (item) {
            item.bindingContext = this._getDataItem(index);
        }
    }

    private _getDataItem(index: number): any {
        return this.isItemsSourceIn ? (this.items as ItemsSource).getItem(index) : this.items[index];
    }
}

export const itemsProperty = new Property<GridViewBase, any[] | ItemsSource>({
    name: "items",
    valueChanged: (target, oldValue, newValue) => {
        const getItem = newValue && (newValue as ItemsSource).getItem;

        target.isItemsSourceIn = typeof getItem === "function";
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

const defaultRowHeight: Length = "auto";
export const rowHeightProperty = new CoercibleProperty<GridViewBase, Length>({
    name: "rowHeight",
    defaultValue: defaultRowHeight,
    equalityComparer: Length.equals,
    valueConverter: Length.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultRowHeight;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = Length.toDevicePixels(newValue, autoEffectiveRowHeight);
        target.refresh();
    }
});
rowHeightProperty.register(GridViewBase);

const defaultColWidth: Length = "auto";
export const colWidthProperty = new CoercibleProperty<GridViewBase, Length>({
    name: "colWidth",
    defaultValue: defaultColWidth,
    equalityComparer: Length.equals,
    valueConverter: Length.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultColWidth;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveColWidth = Length.toDevicePixels(newValue, autoEffectiveColWidth);
        target.refresh();
    }
});
colWidthProperty.register(GridViewBase);

const defaultSpacing: Length = "auto";
export const verticalSpacingProperty = new CoercibleProperty<GridViewBase, Length>({
    name: "verticalSpacing",
    defaultValue: defaultColWidth,
    equalityComparer: Length.equals,
    valueConverter: Length.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultSpacing;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveVerticalSpacing = Length.toDevicePixels(newValue, autoEffectiveSpacing);
        target.refresh();
    }
});
verticalSpacingProperty.register(GridViewBase);

export const horizontalSpacingProperty = new CoercibleProperty<GridViewBase, Length>({
    name: "horizontalSpacing",
    defaultValue: defaultSpacing,
    equalityComparer: Length.equals,
    valueConverter: Length.parse,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeView ? value : defaultSpacing;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveHorizontalSpacing = Length.toDevicePixels(newValue, autoEffectiveSpacing);
        target.refresh();
    }
});
horizontalSpacingProperty.register(GridViewBase);