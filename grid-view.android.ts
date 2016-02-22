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
import definition = require("nativescript-grid-view");
import common = require("./grid-view-common");
import utils = require("utils/utils");
import layoutBase = require("ui/layouts/layout-base");
import stackLayout = require("ui/layouts/stack-layout");
import view = require("ui/core/view");
import style = require("ui/styling/style");

const ITEMLOADING = common.GridView.itemLoadingEvent;
const LOADMOREITEMS = common.GridView.loadMoreItemsEvent;
const ITEMTAP = common.GridView.itemTapEvent;
const REALIZED_INDEX = "realizedIndex";

global.moduleMerge(common, exports);

function notifyForItemAtIndex(gridView: definition.GridView, view: any, eventName: string, index: number)
{
    let args =
        <definition.GridItemEventData>
        {
            eventName: eventName
            , object: gridView
            , index: index
            , view: view
        };
    gridView.notify(args);
    return args;
}

export class GridView extends common.GridView
{
    private _android: android.widget.GridView;
    private _androidViewId: number;
    public _realizedItems = {};

    public _createUI()
    {
        this._android = new android.widget.GridView(this._context);
        this._android.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        // Fixes issue with black random black items when scrolling
        this._android.setCacheColorHint(android.graphics.Color.TRANSPARENT);

        if (!this._androidViewId)
        {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);

        this.android.setAdapter(new GridViewAdapter(this));
        this.android.setNumColumns(android.widget.GridView.AUTO_FIT);
        this.android.setStretchMode(android.widget.GridView.STRETCH_SPACING);
        this._resetNativeColumnAndSpacingSettings();

        let that = new WeakRef(this);

        this.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener(<utils.Owned & android.widget.AbsListView.IOnScrollListener>{
            onScrollStateChanged:
            function (view: android.widget.AbsListView, scrollState: number)
            {
                // Empty
            },
            onScroll:
            function (view: android.widget.AbsListView, firstVisibleItem: number, visibleItemCount: number, totalItemCount: number)
            {
                let owner: GridView = this.owner;
                if (!owner)
                {
                    return;
                }

                if (totalItemCount > 0
                    && firstVisibleItem + visibleItemCount === totalItemCount
                )
                {
                    owner.notify(<observable.EventData>{ eventName: LOADMOREITEMS, object: owner });
                }
            },
            get owner() { return that.get(); }
        }));

        this.android.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
            onItemClick:
            function (parent: any, convertView: android.view.View, index: number, id: number)
            {
                let owner = that.get();

                notifyForItemAtIndex(owner, owner._getRealizedView(convertView), ITEMTAP, index);
            }
        }));
    }

    get android(): android.widget.GridView
    {
        return this._android;
    }

    private _resetNativeColumnAndSpacingSettings()
    {
        this.android.setColumnWidth(this.colWidth * utils.layout.getDisplayDensity());
        this.android.setVerticalSpacing(this.verticalSpacing * utils.layout.getDisplayDensity());
        this.android.setHorizontalSpacing(this.horizontalSpacing * utils.layout.getDisplayDensity());
    }

    public refresh()
    {
        if (!this._android
            || !this._android.getAdapter()
            )
        {
            return;
        }

        this._resetNativeColumnAndSpacingSettings();
        (<GridViewAdapter>this.android.getAdapter()).notifyDataSetChanged();
    }

    public _onDetached(force?: boolean)
    {
        super._onDetached(force);

        // clear the cache
        let keys = Object.keys(this._realizedItems);
        let i;
        let length = keys.length;
        let view: view.View;
        let key;

        for (i = 0; i < length; i++)
        {
            key = keys[i];
            view = this._realizedItems[key];
            view.parent._removeView(view);
            delete this._realizedItems[key];
        }
    }

    public _getRealizedView(convertView: android.view.View)
    {
        if (!convertView)
        {
            return this._getItemTemplateContent();
        }

        return this._realizedItems[convertView.hashCode()];
    }
}

class GridViewAdapter extends android.widget.BaseAdapter
{
    private _gridView: GridView;

    constructor(gridView: GridView)
    {
        super();

        this._gridView = gridView;

        return global.__native(this);
    }

    public getCount()
    {
        return this._gridView && this._gridView.items ? this._gridView.items.length : 0;
    }

    public getItem(i: number)
    {
        if (this._gridView
            && this._gridView.items
            && i < this._gridView.items.length
            )
        {
            return this._gridView.items.getItem ? this._gridView.items.getItem(i) : this._gridView.items[i];
        }

        return null;
    }

    public getItemId(i: number)
    {
        return long(i);
    }

    public hasStableIds(): boolean
    {
        return true;
    }

    public getView(index: number, convertView: android.view.View, parent: android.view.ViewGroup): android.view.View
    {
        if (!this._gridView)
        {
            return null;
        }

        let view = this._gridView._getRealizedView(convertView);

        notifyForItemAtIndex(this._gridView, view, ITEMLOADING, index);

        if (view)
        {
            this._gridView._prepareItem(view, index);
            if (!view.parent)
            {
                if (view instanceof layoutBase.LayoutBase)
                {
                    view.height = this._gridView.rowHeight;
                    view.width = this._gridView.colWidth;
                    this._gridView._addView(view);
                    convertView = view.android;
                }
                else
                {
                    let sp = new stackLayout.StackLayout();
                    sp.height = this._gridView.rowHeight;
                    sp.addChild(view);
                    this._gridView._addView(sp);

                    convertView = sp.android;
                }

            }

            this._gridView._realizedItems[convertView.hashCode()] = view;
            view[REALIZED_INDEX] = index;
        }

        return convertView;
    }
}

//#region Styling
export class GridViewStyler implements style.Styler
{
    private static setPadding(gridView: GridView, padding: common.Padding)
    {
        let finalPadding: common.Padding = {
            top: padding.top !== undefined ? padding.top * utils.layout.getDisplayDensity() : gridView.android.getPaddingTop()
            , right: padding.right !== undefined ? padding.right * utils.layout.getDisplayDensity() : gridView.android.getPaddingRight()
            , bottom: padding.bottom !== undefined ? padding.bottom * utils.layout.getDisplayDensity() : gridView.android.getPaddingBottom()
            , left: padding.left !== undefined ? padding.left * utils.layout.getDisplayDensity() : gridView.android.getPaddingLeft()
        };

        gridView.android.setPadding(finalPadding.left, finalPadding.top, finalPadding.right, finalPadding.bottom);
    }

    //#region Padding Top Property
    private static setPaddingTop(gridView: GridView, newValue: number)
    {
        GridViewStyler.setPadding(gridView, { top: newValue });
    }
    private static resetPaddingTop(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingTop(gridView, nativeValue);
    }
    private static getNativePaddingTopValue(gridView: GridView): any
    {
        return gridView.android.getPaddingTop();
    }
    //#endregion

    //#region Padding Right Property
    private static setPaddingRight(gridView: GridView, newValue: number)
    {
        GridViewStyler.setPadding(gridView, { right: newValue });
    }
    private static resetPaddingRight(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingRight(gridView, nativeValue);
    }
    private static getNativePaddingRightValue(gridView: GridView): any
    {
        return gridView.android.getPaddingRight();
    }
    //#endregion

    //#region Padding Bottom Property
    private static setPaddingBottom(gridView: GridView, newValue: number)
    {
        GridViewStyler.setPadding(gridView, { bottom: newValue });
    }
    private static resetPaddingBottom(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingBottom(gridView, nativeValue);
    }
    private static getNativePaddingBottomValue(gridView: GridView): any
    {
        return gridView.android.getPaddingBottom();
    }
    //#endregion

    //#region Padding Left Property
    private static setPaddingLeft(gridView: GridView, newValue: number)
    {
        GridViewStyler.setPadding(gridView, { left: newValue });
    }
    private static resetPaddingLeft(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingLeft(gridView, nativeValue);
    }
    private static getNativePaddingLeftValue(gridView: GridView): any
    {
        return gridView.android.getPaddingLeft();
    }
    //#endregion

    public static registerHandlers()
    {
        style.registerHandler(style.paddingTopProperty
            , new style.StylePropertyChangedHandler(GridViewStyler.setPaddingTop
                , GridViewStyler.resetPaddingTop
                , GridViewStyler.getNativePaddingTopValue)
            , "GridView");

        style.registerHandler(style.paddingRightProperty
            , new style.StylePropertyChangedHandler(GridViewStyler.setPaddingRight
                , GridViewStyler.resetPaddingRight
                , GridViewStyler.getNativePaddingRightValue)
            , "GridView");

        style.registerHandler(style.paddingBottomProperty
            , new style.StylePropertyChangedHandler(GridViewStyler.setPaddingBottom
                , GridViewStyler.resetPaddingBottom
                , GridViewStyler.getNativePaddingBottomValue)
            , "GridView");

        style.registerHandler(style.paddingLeftProperty
            , new style.StylePropertyChangedHandler(GridViewStyler.setPaddingLeft
                , GridViewStyler.resetPaddingLeft
                , GridViewStyler.getNativePaddingLeftValue)
            , "GridView");
    }
}

GridViewStyler.registerHandlers();
//#endregion