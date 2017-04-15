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

import { EventData, Observable } from "data/observable";
// import definition = require("nativescript-grid-view");
import {
    GridViewBase,
    paddingTopProperty,
    paddingRightProperty,
    paddingBottomProperty,
    paddingLeftProperty
} from "./grid-view-common";
import * as utils from "utils/utils";
import { Length, PercentLength, View } from "ui/core/view";
import { GridItemEventData } from ".";
// import style = require("ui/styling/style");

const CELLIDENTIFIER = "gridcell";
// const ITEMLOADING = common.GridView.itemLoadingEvent;
// const LOADMOREITEMS = common.GridView.loadMoreItemsEvent;
// const ITEMTAP = common.GridView.itemTapEvent;

export * from "./grid-view-common";

class GridViewCell extends UICollectionViewCell {
    static new(): GridViewCell {
        return <GridViewCell>super.new();
    }
    static class(): any {
        return GridViewCell;
    }

    public owner: WeakRef<View>;

    get view(): View {
        return this.owner ? this.owner.get() : null;
    }
}

class GridViewDataSource extends NSObject implements UICollectionViewDataSource {
    public static ObjCProtocols = [UICollectionViewDataSource];

    private _owner: WeakRef<GridView>;

    public static initWithOwner(owner: WeakRef<GridView>): GridViewDataSource {
        const dataSource = <GridViewDataSource>GridViewDataSource.new();
        dataSource._owner = owner;
        return dataSource;
    }

    public numberOfSectionsInCollectionView(collectionView: UICollectionView) {
        return 1;
    }

    public collectionViewNumberOfItemsInSection(collectionView: UICollectionView, section: number) {
        const owner = this._owner.get();
        return owner.items ? owner.items.length : 0;
    }

    public collectionViewCellForItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath): UICollectionViewCell {
        const owner = this._owner.get();
        const cell: any = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath(CELLIDENTIFIER, indexPath) || GridViewCell.new();
        
        owner._prepareCell(cell, indexPath);

        const cellView: View = cell.view;
        if (cellView) {
            View.layoutChild(owner, cellView, 0, 0, owner._effectiveColWidth, owner._effectiveRowHeight);
        }

        return cell;
    }
}

class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    public static ObjCProtocols = [UICollectionViewDelegate, UICollectionViewDelegateFlowLayout];

    private _owner: WeakRef<GridView>;

    public static initWithOwner(owner: WeakRef<GridView>): UICollectionViewDelegateImpl {
        const delegate = UICollectionViewDelegateImpl.new() as UICollectionViewDelegateImpl;
        delegate._owner = owner;
        return delegate;
    }

    public collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        const owner = this._owner.get();

        if (indexPath.row === owner.items.length - 1) {
            owner.notify({
                eventName: GridViewBase.loadMoreItemsEvent,
                object: owner
            } as EventData);
        }

        if (cell.preservesSuperviewLayoutMargins) {
            cell.preservesSuperviewLayoutMargins = false;
        }

        if (cell.layoutMargins) {
            cell.layoutMargins = UIEdgeInsetsZero;
        }
    }

    public collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const cell = collectionView.cellForItemAtIndexPath(indexPath);
        const owner = this._owner.get();
        
        owner.notify({
            eventName: GridViewBase.itemTapEvent,
            object: owner,
            index: indexPath.row,
            view: (cell as GridViewCell).view,
        } as GridItemEventData);

        cell.highlighted = false;

        return indexPath;
    }

    // public collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
    //     const owner = this._owner.get();
    //     return CGSizeMake(owner._effectiveColWidth, owner._effectiveRowHeight);
    // }
}

export class GridView extends GridViewBase {
    private _layout: UICollectionViewFlowLayout;
    private _dataSource: GridViewDataSource;
    private _delegate: UICollectionViewDelegateImpl;
    private _preparingCell: boolean = false;
    private _map: Map<GridViewCell, View>;

    constructor() {
        super();

        this._layout = UICollectionViewFlowLayout.alloc().init();
        this.nativeView = UICollectionView.alloc().initWithFrameCollectionViewLayout(CGRectMake(0, 0, 0, 0), this._layout);
        this.nativeView.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
        this.nativeView.registerClassForCellWithReuseIdentifier(GridViewCell.class(), CELLIDENTIFIER);
        this.nativeView.autoresizesSubviews = false;
        this.nativeView.autoresizingMask = UIViewAutoresizing.None;

        this._dataSource = GridViewDataSource.initWithOwner(new WeakRef(this));
        this.nativeView.dataSource = this._dataSource;

        this._delegate = UICollectionViewDelegateImpl.initWithOwner(new WeakRef(this));

        this._map = new Map<GridViewCell, View>();

        this._setNativeClipToBounds();
    }

    public onLoaded() {
        super.onLoaded();
        this.nativeView.delegate = this._delegate;
    }

    public onUnloaded() {
        this.nativeView.delegate = null;
        this._layout = null;
        this._dataSource = null;
        this._delegate = null;
        super.onUnloaded();
    }

    get ios(): UICollectionView {
        return this.nativeView;
    }

    get _childrenCount(): number {
        return this._map.size;
    }

    public [paddingTopProperty.getDefault](): number {
        return this._layout.sectionInset.top;
    }
    public [paddingTopProperty.setNative](value: Length) {
        this._setPadding({ top: utils.layout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    }

    public [paddingRightProperty.getDefault](): number {
        return this._layout.sectionInset.right;
    }
    public [paddingRightProperty.setNative](value: Length) {
        this._setPadding({ right: utils.layout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    }

    public [paddingBottomProperty.getDefault](): number {
        return this._layout.sectionInset.bottom;
    }
    public [paddingBottomProperty.setNative](value: Length) {
        this._setPadding({ bottom: utils.layout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    }

    public [paddingLeftProperty.getDefault](): number {
        return this._layout.sectionInset.left;
    }
    public [paddingLeftProperty.setNative](value: Length) {
        this._setPadding({ left: utils.layout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    }

    public eachChildView(callback: (child: View) => boolean): void {
        this._map.forEach((view, key) => {
            callback(view);
        });
    }

    public refresh() {
        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this.eachChildView((view) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }

            return true;
        });
        
        const layout = this.ios.collectionViewLayout as UICollectionViewFlowLayout;

        // Note we need to divide by the density as the effective values are in DIPs
        layout.minimumLineSpacing = utils.layout.toDeviceIndependentPixels(this._effectiveVerticalSpacing);
        layout.minimumInteritemSpacing = utils.layout.toDeviceIndependentPixels(this._effectiveHorizontalSpacing);
        layout.itemSize = CGSizeMake(utils.layout.toDeviceIndependentPixels(this._effectiveColWidth), utils.layout.toDeviceIndependentPixels(this._effectiveRowHeight));

        this.ios.reloadData();
        this.requestLayout();
    }

    public requestLayout(): void {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell) {
            super.requestLayout();
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        const changed = (this as any)._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        super.measure(widthMeasureSpec, heightMeasureSpec);
        if (changed) {
            this.ios.reloadData();
        }
    }

    public _setNativeClipToBounds() {
        this.nativeView.clipsToBounds = true;
    }    
    private _layoutCell(cellView: View, index: NSIndexPath) {
        if (cellView) {
            const widthMeasureSpec = utils.layout.makeMeasureSpec(this._effectiveColWidth, utils.layout.EXACTLY);
            const heightMeasureSpec = utils.layout.makeMeasureSpec(this._effectiveRowHeight, utils.layout.EXACTLY);

            View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
        }
    }

    public _prepareCell(cell: GridViewCell, indexPath: NSIndexPath) {
        try {
            this._preparingCell = true;

            let view = cell.view;
            if (!view) {
                view = this._getItemTemplateContent();
            }

            this.notify({
                eventName: GridViewBase.itemLoadingEvent,
                object: this,
                index: indexPath.row,
                view,
            } as GridItemEventData);

            // If cell is reused it have old content - remove it first.
            if (!cell.view) {
                cell.owner = new WeakRef(view);
            }
            else if (cell.view !== view) {
                this._removeContainer(cell);
                (cell.view.nativeView as UIView).removeFromSuperview();
                cell.owner = new WeakRef(view);
            }

            this._prepareItem(view, indexPath.row);
            this._map.set(cell, view);

            if (view && !view.parent && view.ios) {
                cell.contentView.addSubview(view.ios);
                this._addView(view);
            }

            this._layoutCell(view, indexPath);
        }
        finally {
            this._preparingCell = false;
        }
    }

    private _removeContainer(cell: GridViewCell): void {
        const view = cell.view;

        view.parent._removeView(view);
        this._map.delete(cell);
    }
    
    private _setPadding(newPadding: { top?: number, right?: number, bottom?: number, left?: number }) {
        const padding = {
            top: this._layout.sectionInset.top,
            right: this._layout.sectionInset.right, 
            bottom: this._layout.sectionInset.bottom,
            left: this._layout.sectionInset.left
        };
        const newValue = Object.assign(padding, newPadding);
        this._layout.sectionInset =
            UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
    }
}

// //#region Styling
// export class GridViewStyler implements style.Styler {
//     private static setNativePaddingsProperty(view: GridView, newValue: any) {
//         (<UICollectionViewFlowLayout>view.ios.collectionViewLayout).sectionInset =
//             UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
//     }

//     private static resetNativePaddingsProperty(view: GridView, nativeValue: any) {
//         (<UICollectionViewFlowLayout>view.ios.collectionViewLayout).sectionInset = UIEdgeInsetsFromString("{0,0,0,0}");
//     }

//     public static registerHandlers() {
//         style.registerHandler(style.nativePaddingsProperty,
//             new style.StylePropertyChangedHandler(GridViewStyler.setNativePaddingsProperty,
//                 GridViewStyler.resetNativePaddingsProperty),
//             "GridView");
//     }

// }
// GridViewStyler.registerHandlers();
// //#endregion