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
import style = require("ui/styling/style");

const CELLIDENTIFIER = "gridcell";
const ITEMLOADING = common.GridView.itemLoadingEvent;
const LOADMOREITEMS = common.GridView.loadMoreItemsEvent;
const ITEMTAP = common.GridView.itemTapEvent;

global.moduleMerge(common, exports);

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
    let args =
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

    private _owner: GridView;

    public static initWithOwner(owner: GridView): GridViewDataSource
    {
        let dataSource = <GridViewDataSource>GridViewDataSource.new();
        dataSource._owner = owner;
        return dataSource;
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
        let cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(CELLIDENTIFIER, indexPath) || GridViewCell.new();
        this._owner._prepareCell(cell, indexPath);

        let cellView: view.View = cell.view;
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

    private _owner: GridView;

    public static initWithOwner(owner: GridView): UICollectionViewDelegateImpl
    {
        let delegate = <UICollectionViewDelegateImpl>UICollectionViewDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
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
        let cell = collectionView.cellForItemAtIndexPath(indexPath);
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

        this._dataSource = GridViewDataSource.initWithOwner(this);
        this._ios.dataSource = this._dataSource;

        this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
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
        let changed = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
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
            let widthMeasureSpec = utils.layout.makeMeasureSpec(this.colWidth, utils.layout.EXACTLY)
                , heightMeasureSpec = utils.layout.makeMeasureSpec(this.rowHeight, utils.layout.EXACTLY);

            view.View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
        }
    }

    public _prepareCell(tableCell: UICollectionViewCell, indexPath: NSIndexPath)
    {
        let cell: any = tableCell;

        try
        {
            this._preparingCell = true;
            if (!cell.view)
            {
                cell.view = this._getItemTemplateContent();
            }

            notifyForItemAtIndex(this, cell, ITEMLOADING, indexPath);

            let view = cell.view;
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
export class GridViewStyler implements style.Styler
{
    private static setSectionInset(gridView: GridView, padding: common.Padding)
    {
        let flowLayout = <UICollectionViewFlowLayout>gridView.ios.collectionViewLayout;
        let currentInset = flowLayout.sectionInset;

        flowLayout.sectionInset = {
            top: padding.top !== undefined ? padding.top : currentInset.top
            , right: padding.right !== undefined ? padding.right : currentInset.right
            , bottom: padding.bottom !== undefined ? padding.bottom : currentInset.bottom
            , left: padding.left !== undefined ? padding.left : currentInset.left
        };
    }

    //#region Padding Top Property
    private static setPaddingTop(gridView: GridView, newValue: number)
    {
        GridViewStyler.setSectionInset(gridView, { top: newValue });
    }
    private static resetPaddingTop(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingTop(gridView, nativeValue);
    }
    private static getNativePaddingTopValue(gridView: GridView): any
    {
        return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.top;
    }
    //#endregion

    //#region Padding Right Property
    private static setPaddingRight(gridView: GridView, newValue: number)
    {
        GridViewStyler.setSectionInset(gridView, { right: newValue });
    }
    private static resetPaddingRight(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingRight(gridView, nativeValue);
    }
    private static getNativePaddingRightValue(gridView: GridView): any
    {
        return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.right;
    }
    //#endregion

    //#region Padding Bottom Property
    private static setPaddingBottom(gridView: GridView, newValue: number)
    {
        GridViewStyler.setSectionInset(gridView, { bottom: newValue });
    }
    private static resetPaddingBottom(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingBottom(gridView, nativeValue);
    }
    private static getNativePaddingBottomValue(gridView: GridView): any
    {
        return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.bottom;
    }
    //#endregion

    //#region Padding Left Property
    private static setPaddingLeft(gridView: GridView, newValue: number)
    {
        GridViewStyler.setSectionInset(gridView, { left: newValue });
    }
    private static resetPaddingLeft(gridView: GridView, nativeValue: number)
    {
        GridViewStyler.setPaddingLeft(gridView, nativeValue);
    }
    private static getNativePaddingLeftValue(gridView: GridView): any
    {
        return (<UICollectionViewFlowLayout>gridView.ios.collectionViewLayout).sectionInset.left;
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