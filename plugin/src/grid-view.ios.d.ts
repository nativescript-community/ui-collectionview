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
import { View } from 'ui/core/view';
import { GridViewBase } from './grid-view-common';
export * from './grid-view-common';
export declare class GridView extends GridViewBase {
    private _layout;
    private _dataSource;
    private _delegate;
    private _preparingCell;
    private _map;
    constructor();
    onLoaded(): void;
    onUnloaded(): void;
    readonly ios: UICollectionView;
    readonly _childrenCount: number;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    isHorizontal(): boolean;
    onItemsChanged(): void;
    refresh(): void;
    scrollToIndex(index: number, animated?: boolean): void;
    requestLayout(): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    _setNativeClipToBounds(): void;
    _prepareCell(cell: GridViewCell, indexPath: NSIndexPath): [number, number];
    private _layoutCell(cell, cellView, index);
    private _removeContainer(cell);
    private _setPadding(newPadding);
}
export declare class GridViewCell extends UICollectionViewCell {
    static new(): GridViewCell;
    static class(): any;
    owner: WeakRef<View>;
    readonly view: View;
}
