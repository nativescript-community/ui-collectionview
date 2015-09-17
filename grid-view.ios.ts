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
import view = require("ui/core/view");
import style = require("ui/styling");
import stylingStyle = require("ui/styling/style");

var CELLIDENTIFIER = "gridcell";
var ITEMLOADING = common.GridView.itemLoadingEvent;
var LOADMOREITEMS = common.GridView.loadMoreItemsEvent;
var ITEMTAP = common.GridView.itemTapEvent;

// merge the exports of the common file with the exports of this file
declare var exports;
require("utils/module-merge").merge(common, exports);

class GridViewCell extends UICollectionViewCell
{
    static new(): GridViewCell
    {
        return <GridViewCell>super.new();
    }
    static class(): any
    {
        return GridViewCell;
    }
}

function notifyForItemAtIndex(gridView: definition.GridView, cell: any, eventName: string, indexPath: NSIndexPath)
{
    var args =
        <definition.GridItemEventData>
        {
            eventName: eventName
            , object: gridView
            , index: indexPath.row
            , view: cell.view
        };
    gridView.notify(args);
    return args;
}

class GridViewDataSource extends NSObject implements UICollectionViewDataSource
{
    public static ObjCProtocols = [UICollectionViewDataSource];

    static new(): GridViewDataSource
    {
        return <GridViewDataSource>super.new();
    }

    private _owner: GridView;

    public initWithOwner(owner: GridView): GridViewDataSource
    {
        this._owner = owner;
        return this;
    }

    public numberOfSectionsInCollectionView(collectionView: UICollectionView)
    {
        return 1;
    }

    public collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number)
    {
        return this._owner.items ? this._owner.items.length : 0;
    }

    public collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell
    {
        var cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(CELLIDENTIFIER, indexPath) || GridViewCell.new();
        this._owner._prepareCell(cell, indexPath);
        
        var cellView: view.View = cell.view;
        if (cellView)
        {
            view.View.layoutChild(this._owner, cellView, 0, 0, this._owner.colWidth, this._owner.rowHeight);
        }

        return cell;
    }
}

class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout
{
    public static ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];

    static new(): UICollectionViewDelegateImpl
    {
        return <UICollectionViewDelegateImpl>super.new();
    }

    private _owner: GridView;
    private _measureCell: UICollectionViewCell;
    public initWithOwner(owner: GridView): UICollectionViewDelegateImpl
    {
        this._owner = owner;
        return this;
    }

    public collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath)
    {
        if (indexPath.row === this._owner.items.length - 1)
        {
            this._owner.notify(<observable.EventData>{ eventName: LOADMOREITEMS, object: this._owner });
        }

        if (cell.preservesSuperviewLayoutMargins)
        {
            cell.preservesSuperviewLayoutMargins = false;
        }

        if (cell.layoutMargins)
        {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }

    public collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath)
    {
        var cell = collectionView.cellForItemAtIndexPath(indexPath);
        notifyForItemAtIndex(this._owner, cell, ITEMTAP, indexPath);
        cell.highlighted = false;
        return indexPath;
    }

    public collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath)
    {
        return CGSizeMake(this._owner.colWidth, this._owner.rowHeight);
    }
}

export class GridView extends common.GridView
{
    private _ios: UICollectionView;
    private _layout: UICollectionViewFlowLayout;
    private _dataSource;
    private _delegate;
    private _preparingCell: boolean = false;

    constructor()
    {
        super();

        this._layout = new UICollectionViewFlowLayout();
        this._ios = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), this._layout);
        this._ios.backgroundColor = UIColor.clearColor();
        this._ios.registerClassForCellWithReuseIdentifier(GridViewCell.class(), CELLIDENTIFIER);
        this._ios.autoresizesSubviews = false;
        this._ios.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;

        this._dataSource = GridViewDataSource.new().initWithOwner(this);
        this._ios.dataSource = this._dataSource;

        this._delegate = UICollectionViewDelegateImpl.new().initWithOwner(this);
    }

    public onLoaded()
    {
        super.onLoaded();
        this._ios.delegate = this._delegate;
    }

    public onUnloaded()
    {
        this._ios.delegate = null;
        super.onUnloaded();
    }

    get ios(): UICollectionView
    {
        return this._ios;
    }

    public refresh()
    {
        (<UICollectionViewFlowLayout>this._ios.collectionViewLayout).minimumLineSpacing = this.verticalSpacing;
        (<UICollectionViewFlowLayout>this._ios.collectionViewLayout).minimumInteritemSpacing = this.horizontalSpacing;

        this._ios.reloadData();
        this.requestLayout();
    }

    public requestLayout(): void
    {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell)
        {
            super.requestLayout();
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void
    {
        var changed = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        super.measure(widthMeasureSpec, heightMeasureSpec);
        if (changed)
        {
            this._ios.reloadData();
        }
    }

    private _layoutCell(cellView: view.View, index: NSIndexPath)
    {

        if (cellView)
        {
            var widthMeasureSpec = utils.layout.makeMeasureSpec(this.colWidth, utils.layout.EXACTLY)
                , heightMeasureSpec = utils.layout.makeMeasureSpec(this.rowHeight, utils.layout.EXACTLY)

            view.View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
        }
    }

    public _prepareCell(tableCell: UICollectionViewCell, indexPath: NSIndexPath)
    {
        var cell: any = tableCell;

        try
        {
            this._preparingCell = true;
            if (!cell.view)
            {
                cell.view = this._getItemTemplateContent();
            }

            var args = notifyForItemAtIndex(this, cell, ITEMLOADING, indexPath);
            var view = cell.view;

            if (view && !view.parent && view.ios)
            {
                cell.contentView.addSubview(view.ios);
                this._addView(view);
            }

            this._prepareItem(view, indexPath.row);
            this._layoutCell(view, indexPath);
        }
        finally
        {
            this._preparingCell = false;
        }
    }
}

//#region Styling
function setSectionInset(gridView: GridView, newInset: UIEdgeInsets)
{
    var flowLayout = <UICollectionViewFlowLayout>gridView.ios.collectionViewLayout
        , sectionInset = flowLayout.sectionInset;

    flowLayout.sectionInset =
    {
        top: newInset.top || sectionInset.top
        , right: newInset.right || sectionInset.right
        , bottom: newInset.bottom || sectionInset.bottom
        , left: newInset.left || sectionInset.left
    };
}

//#region Padding Top Property
function setPaddingTop(gridView: GridView, newValue: number)
{
    setSectionInset(gridView, { top: newValue, right: undefined, bottom: undefined, left: undefined });
}
function resetPaddingTop(gridView: GridView, nativeValue: number)
{
    setPaddingTop(gridView, nativeValue);
}
function getNativePaddingTopValue(gridView: GridView): any
{
    return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.top;
}
var paddingTopChangedHandler = new style.stylers.StylePropertyChangedHandler(setPaddingTop, resetPaddingTop, getNativePaddingTopValue);
style.stylers.registerHandler(stylingStyle.paddingTopProperty, paddingTopChangedHandler, "GridView");
//#endregion

//#region Padding Right Property
function setPaddingRight(gridView: GridView, newValue: number)
{
    setSectionInset(gridView, { top: undefined, right: newValue, bottom: undefined, left: undefined });
}
function resetPaddingRight(gridView: GridView, nativeValue: number)
{
    setPaddingRight(gridView, nativeValue);
}
function getNativePaddingRightValue(gridView: GridView): any
{
    return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.right;
}
var paddingRightChangedHandler = new style.stylers.StylePropertyChangedHandler(setPaddingRight, resetPaddingRight, getNativePaddingRightValue);
style.stylers.registerHandler(stylingStyle.paddingRightProperty, paddingRightChangedHandler, "GridView");
//#endregion

//#region Padding Bottom Property
function setPaddingBottom(gridView: GridView, newValue: number)
{
    setSectionInset(gridView, { top: undefined, right: undefined, bottom: newValue, left: undefined });
}
function resetPaddingBottom(gridView: GridView, nativeValue: number)
{
    setPaddingBottom(gridView, nativeValue);
}
function getNativePaddingBottomValue(gridView: GridView): any
{
    return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.bottom;
}
var paddingBottomChangedHandler = new style.stylers.StylePropertyChangedHandler(setPaddingBottom, resetPaddingBottom, getNativePaddingBottomValue);
style.stylers.registerHandler(stylingStyle.paddingBottomProperty, paddingBottomChangedHandler, "GridView");
//#endregion

//#region Padding Left Property
function setPaddingLeft(gridView: GridView, newValue: number)
{
    setSectionInset(gridView, { top: undefined, right: undefined, bottom: undefined, left: newValue });
}
function resetPaddingLeft(gridView: GridView, nativeValue: number)
{
    setPaddingLeft(gridView, nativeValue);
}
function getNativePaddingLeftValue(gridView: GridView): any
{
    return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.left;
}
var paddingLeftChangedHandler = new style.stylers.StylePropertyChangedHandler(setPaddingLeft, resetPaddingLeft, getNativePaddingLeftValue);
style.stylers.registerHandler(stylingStyle.paddingLeftProperty, paddingLeftChangedHandler, "GridView");
//#endregion

//#endregion