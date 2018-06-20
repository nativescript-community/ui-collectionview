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
import { KeyedTemplate, View } from 'ui/core/view';
import { GridViewBase } from './grid-view-common';
export * from './grid-view-common';
export interface ViewTypeTemplate extends KeyedTemplate {
    viewType?: number;
}
export declare class GridView extends GridViewBase {
    nativeView: android.support.v7.widget.RecyclerView;
    _realizedItems: Map<android.view.View, View>;
    static DEFAULT_TEMPLATE_VIEW_TYPE: number;
    static CUSTOM_TEMPLATE_ITEM_TYPE: number;
    _itemTemplatesByViewType: Map<number, KeyedTemplate>;
    itemTypeCount: number;
    constructor();
    createNativeView(): GridViewRecyclerView;
    initNativeView(): void;
    disposeNativeView(): void;
    readonly android: android.support.v7.widget.RecyclerView;
    readonly _childrenCount: number;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    refresh(): void;
    scrollToIndex(index: number, animated?: boolean): void;
    private _setPadding(newPadding);
    private _getLayoutManagarOrientation();
}
export interface GridViewRecyclerView extends android.support.v7.widget.RecyclerView {
    new (context: any, owner: WeakRef<GridView>): GridViewRecyclerView;
}
