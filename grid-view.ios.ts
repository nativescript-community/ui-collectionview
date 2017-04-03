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

class GridViewCell extends UICollectionViewCell {
    static new(): GridViewCell {
        return <GridViewCell>super.new();
    }
    static class(): any {
        return GridViewCell;
    }
}

function notifyForItemAtIndex(gridView: definition.GridView, cell: any, eventName: string, indexPath: NSIndexPath) {
    let args =
        <definition.GridItemEventData>
        {
            eventName: eventName,
            object: gridView,
            index: indexPath.row,
            view: cell.view,
        };
    gridView.notify(args);
    return args;
}

class GridViewDataSource extends NSObject implements UICollectionViewDataSource {
    public static ObjCProtocols = [UICollectionViewDataSource];

    private _owner: GridView;

    public static initWithOwner(owner: GridView): GridViewDataSource {
        let dataSource = <GridViewDataSource>GridViewDataSource.new();
        dataSource._owner = owner;
        return dataSource;
    }

    public numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        return 1;
    }

    public collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
        return this._owner.items ? this._owner.items.length : 0;
    }

    public collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        let cell: any = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(CELLIDENTIFIER, indexPath) || GridViewCell.new();
        this._owner._prepareCell(cell, indexPath);

        let cellView: view.View = cell.view;
        if (cellView) {
            view.View.layoutChild(this._owner, cellView, 0, 0, this._owner.colWidth, this._owner.rowHeight);
        }

        return cell;
    }
}

class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    public static ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];

    private _owner: GridView;

    public static initWithOwner(owner: GridView): UICollectionViewDelegateImpl {
        let delegate = <UICollectionViewDelegateImpl>UICollectionViewDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    }

    public collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        if (indexPath.row === this._owner.items.length - 1) {
            this._owner.notify(<observable.EventData>{ eventName: LOADMOREITEMS, object: this._owner });
        }

        if (cell.preservesSuperviewLayoutMargins) {
            cell.preservesSuperviewLayoutMargins = false;
        }

        if (cell.layoutMargins) {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }

    public collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        let cell = collectionView.cellForItemAtIndexPath(indexPath);
        notifyForItemAtIndex(this._owner, cell, ITEMTAP, indexPath);
        cell.highlighted = false;
        return indexPath;
    }

    public collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        return CGSizeMake(this._owner.colWidth, this._owner.rowHeight);
    }
}

export class GridView extends common.GridView {
    private _ios: UICollectionView;
    private _layout: UICollectionViewFlowLayout;
    private _dataSource;
    private _delegate;
    private _preparingCell: boolean = false;

    constructor() {
        super();

        this._layout = UICollectionViewFlowLayout.alloc().init();
        this._ios = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), this._layout);
        this._ios.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
        this._ios.registerClassForCellWithReuseIdentifier(GridViewCell.class(), CELLIDENTIFIER);
        this._ios.autoresizesSubviews = false;
        this._ios.autoresizingMask = UIViewAutoresizing.None;

        this._dataSource = GridViewDataSource.initWithOwner(this);
        this._ios.dataSource = this._dataSource;

        this._delegate = UICollectionViewDelegateImpl.initWithOwner(this);
    }

    public onLoaded() {
        super.onLoaded();
        this._ios.delegate = this._delegate;
    }

    public onUnloaded() {
        this._ios.delegate = null;
        super.onUnloaded();
    }

    get ios(): UICollectionView {
        return this._ios;
    }

    public refresh() {
        (<UICollectionViewFlowLayout>this._ios.collectionViewLayout).minimumLineSpacing = this.verticalSpacing;
        (<UICollectionViewFlowLayout>this._ios.collectionViewLayout).minimumInteritemSpacing = this.horizontalSpacing;

        this._ios.reloadData();
        this.requestLayout();
    }

    public requestLayout(): void {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell) {
            super.requestLayout();
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        let changed = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        super.measure(widthMeasureSpec, heightMeasureSpec);
        if (changed) {
            this._ios.reloadData();
        }
    }

    private _layoutCell(cellView: view.View, index: NSIndexPath) {

        if (cellView) {
            let widthMeasureSpec = utils.layout.makeMeasureSpec(this.colWidth, utils.layout.EXACTLY),
                heightMeasureSpec = utils.layout.makeMeasureSpec(this.rowHeight, utils.layout.EXACTLY);

            view.View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
        }
    }

    public _prepareCell(tableCell: UICollectionViewCell, indexPath: NSIndexPath) {
        let cell: any = tableCell;

        try {
            this._preparingCell = true;
            if (!cell.view) {
                cell.view = this._getItemTemplateContent();
            }

            notifyForItemAtIndex(this, cell, ITEMLOADING, indexPath);

            let view = cell.view;
            if (view && !view.parent && view.ios) {
                cell.contentView.addSubview(view.ios);
                this._addView(view);
            }

            this._prepareItem(view, indexPath.row);
            this._layoutCell(view, indexPath);
        }
        finally {
            this._preparingCell = false;
        }
    }
}

//#region Styling
export class GridViewStyler implements style.Styler {
    private static setNativePaddingsProperty(view: GridView, newValue: any) {
        (<UICollectionViewFlowLayout>view.ios.collectionViewLayout).sectionInset =
            UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
    }

    private static resetNativePaddingsProperty(view: GridView, nativeValue: any) {
        (<UICollectionViewFlowLayout>view.ios.collectionViewLayout).sectionInset = UIEdgeInsetsFromString("{0,0,0,0}");
    }

    public static registerHandlers() {
        style.registerHandler(style.nativePaddingsProperty,
            new style.StylePropertyChangedHandler(GridViewStyler.setNativePaddingsProperty,
                GridViewStyler.resetNativePaddingsProperty),
            "GridView");
    }

}
GridViewStyler.registerHandlers();
//#endregion