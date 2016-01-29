/*! *****************************************************************************
Copyright (c) 2015 Tangra Inc.

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

import observable = require("data/observable");
import proxy = require("ui/core/proxy");
import definition = require("nativescript-grid-view");
import dependencyObservable = require("ui/core/dependency-observable");
import builder = require("ui/builder");
import view = require("ui/core/view");

const ITEMSCHANGED = "_itemsChanged";
const GRIDVIEW = "GridView";
const CHANGE = "change";

export module knownTemplates
{
    export var itemTemplate = "itemTemplate";
}

function onItemsPropertyChanged(data: dependencyObservable.PropertyChangeData)
{
    let gridView = <definition.GridView>data.object;
    let itemsChanged = gridView[ITEMSCHANGED];

    if (data.oldValue instanceof observable.Observable)
    {
        (<observable.Observable>data.oldValue).off(CHANGE, itemsChanged);
    }

    if (data.newValue instanceof observable.Observable)
    {
        (<observable.Observable>data.newValue).on(CHANGE, itemsChanged);
    }

    gridView.refresh();
}

function onItemTemplatePropertyChanged(data: dependencyObservable.PropertyChangeData)
{
    let gridView = <definition.GridView>data.object;
    gridView.refresh();
}

function onColWidthPropertyChanged(data: dependencyObservable.PropertyChangeData)
{
    let gridView = <definition.GridView>data.object;
    gridView.refresh();
}

function onRowHeightPropertyChanged(data: dependencyObservable.PropertyChangeData)
{
    let gridView = <definition.GridView>data.object;
    gridView.refresh();
}

function onSpacingPropertyChanged(data: dependencyObservable.PropertyChangeData)
{
    let gridView = <definition.GridView>data.object;
    gridView.refresh();
}

function getExports(instance: view.View): any
{
    let parent = instance.parent;

    while (parent && (<any>parent).exports === undefined)
    {
        parent = parent.parent;
    }

    return parent ? (<any>parent).exports : undefined;
}

export class GridView extends view.View implements definition.GridView
{
    public static itemLoadingEvent = "itemLoading";
    public static itemTapEvent = "itemTap";
    public static loadMoreItemsEvent = "loadMoreItems";

    public static itemsProperty = new dependencyObservable.Property(
        "items"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onItemsPropertyChanged
            )
        );

    public static itemTemplateProperty = new dependencyObservable.Property(
        "itemTemplate"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onItemTemplatePropertyChanged
            )
        );

    public static colWidthProperty = new dependencyObservable.Property(
        "colWidth"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            100,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onColWidthPropertyChanged
            )
        );

    public static rowHeightProperty = new dependencyObservable.Property(
        "rowHeight"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            100,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onRowHeightPropertyChanged
            )
        );

    public static verticalSpacingProperty = new dependencyObservable.Property(
        "verticalSpacing"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            10,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onSpacingPropertyChanged
            )
        );

    public static horizontalSpacingProperty = new dependencyObservable.Property(
        "horizontalSpacing"
        , GRIDVIEW
        , new proxy.PropertyMetadata(
            10,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            onSpacingPropertyChanged
            )
        );

    private _itemsChanged: (args: observable.EventData) => void;

    constructor()
    {
        super();
        this._itemsChanged = (args: observable.EventData) => { this.refresh(); };
    }

    get items(): any
    {
        return this._getValue(GridView.itemsProperty);
    }
    set items(value: any)
    {
        this._setValue(GridView.itemsProperty, value);
    }

    get itemTemplate(): string
    {
        return this._getValue(GridView.itemTemplateProperty);
    }
    set itemTemplate(value: string)
    {
        this._setValue(GridView.itemTemplateProperty, value);
    }

    get colWidth(): number
    {
        return this._getValue(GridView.colWidthProperty);
    }
    set colWidth(value: number)
    {
        this._setValue(GridView.colWidthProperty, value);
    }

    get rowHeight(): number
    {
        return this._getValue(GridView.rowHeightProperty);
    }
    set rowHeight(value: number)
    {
        this._setValue(GridView.rowHeightProperty, value);
    }

    get verticalSpacing(): number
    {
        return this._getValue(GridView.verticalSpacingProperty);
    }
    set verticalSpacing(value: number)
    {
        this._setValue(GridView.verticalSpacingProperty, value);
    }

    get horizontalSpacing(): number
    {
        return this._getValue(GridView.horizontalSpacingProperty);
    }
    set horizontalSpacing(value: number)
    {
        this._setValue(GridView.horizontalSpacingProperty, value);
    }

    public refresh() { }

    public _getItemTemplateContent(): view.View
    {
        let v;

        if (this.itemTemplate && this.items)
        {
            v = builder.parse(this.itemTemplate, getExports(this));
        }

        return v;
    }

    public _prepareItem(item: view.View, index: number)
    {
        if (item)
        {
            item.bindingContext = this._getDataItem(index);
        }
    }

    private _getDataItem(index: number): any
    {
        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    }
}