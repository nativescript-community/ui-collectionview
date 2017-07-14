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
import { Length, View } from "ui/core/view";
import * as utils from "utils/utils";

import {
    GridViewBase,
    paddingBottomProperty,
    paddingLeftProperty,
    paddingRightProperty,
    paddingTopProperty
} from "./grid-view-common";

import { GridItemEventData } from ".";

export * from "./grid-view-common";

const CELLIDENTIFIER = "gridcell";

export class GridView extends GridViewBase {
    private _layout: UICollectionViewFlowLayout;
    private _dataSource: GridViewDataSource;
    private _delegate: UICollectionViewDelegateImpl;
    private _preparingCell: boolean = false;
    private _map: Map<GridViewCell, View>;

    constructor() {
        super();

        this._layout = UICollectionViewFlowLayout.alloc().init();
        this._layout.minimumLineSpacing = 0;
        this._layout.minimumInteritemSpacing = 0;

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
    public onLayout(left: number, top: number, right: number, bottom: number) {
        super.onLayout(left, top, right, bottom);

        const layout = this.ios.collectionViewLayout as UICollectionViewFlowLayout;
        layout.itemSize = CGSizeMake(utils.layout.toDeviceIndependentPixels(this._effectiveColWidth), utils.layout.toDeviceIndependentPixels(this._effectiveRowHeight));

    }
    public refresh() {
        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this.eachChildView((view) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }

            return true;
        });
        
        this.ios.reloadData();
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

    public _prepareCell(cell: GridViewCell, indexPath: NSIndexPath) {
        try {
            this._preparingCell = true;

            let view = cell.view;
            if (!view) {
                view = this._getItemTemplateContent();
            }

            this.notify<GridItemEventData>({
                eventName: GridViewBase.itemLoadingEvent,
                object: this,
                index: indexPath.row,
                view
            });

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

    private _layoutCell(cellView: View, index: NSIndexPath) {
        if (cellView) {
            const widthMeasureSpec = utils.layout.makeMeasureSpec(this._effectiveColWidth, utils.layout.EXACTLY);
            const heightMeasureSpec = utils.layout.makeMeasureSpec(this._effectiveRowHeight, utils.layout.EXACTLY);

            View.measureChild(this, cellView, widthMeasureSpec, heightMeasureSpec);
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
        // tslint:disable-next-line:prefer-object-spread
        const newValue = Object.assign(padding, newPadding);
        this._layout.sectionInset =
            UIEdgeInsetsFromString(`{${newValue.top},${newValue.left},${newValue.bottom},${newValue.right}}`);
    }
}

class GridViewCell extends UICollectionViewCell {
    public static new(): GridViewCell {
        return super.new() as GridViewCell;
    }
    public static class(): any {
        return GridViewCell;
    }

    public owner: WeakRef<View>;

    get view(): View {
        return this.owner ? this.owner.get() : null;
    }
}

@ObjCClass(UICollectionViewDataSource)
class GridViewDataSource extends NSObject implements UICollectionViewDataSource {
    public static initWithOwner(owner: WeakRef<GridView>): GridViewDataSource {
        const dataSource = GridViewDataSource.new() as GridViewDataSource;
        dataSource._owner = owner;
        return dataSource;
    }

    private _owner: WeakRef<GridView>;

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

@ObjCClass(UICollectionViewDelegate, UICollectionViewDelegateFlowLayout)
class UICollectionViewDelegateImpl extends NSObject implements UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {
    public static initWithOwner(owner: WeakRef<GridView>): UICollectionViewDelegateImpl {
        const delegate = UICollectionViewDelegateImpl.new() as UICollectionViewDelegateImpl;
        delegate._owner = owner;
        return delegate;
    }

    private _owner: WeakRef<GridView>;

    public collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        const owner = this._owner.get();

        if (indexPath.row === owner.items.length - 1) {
            owner.notify<EventData>({
                eventName: GridViewBase.loadMoreItemsEvent,
                object: owner
            });
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
        
        owner.notify<GridItemEventData>({
            eventName: GridViewBase.itemTapEvent,
            object: owner,
            index: indexPath.row,
            view: (cell as GridViewCell).view
        });

        cell.highlighted = false;

        return indexPath;
    }
}