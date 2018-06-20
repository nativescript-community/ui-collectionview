/// <reference path="typings/android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="typings/arv.d.ts" />
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
import { KeyedTemplate } from 'ui/core/view';
import { GridViewBase } from './grid-view-common';
export * from './grid-view-common';
export interface ViewTypeTemplate extends KeyedTemplate {
    viewType?: number;
}
import RecyclerView = android.support.v7.widget.RecyclerView;
export declare class GridView extends GridViewBase {
    static DEFAULT_TEMPLATE_VIEW_TYPE: number;
    static CUSTOM_TEMPLATE_ITEM_TYPE: number;
    nativeView: RecyclerView;
    _itemTemplatesByViewType: Map<number, KeyedTemplate>;
    private itemTypeCount;
    constructor();
    createNativeView(): GridViewRecyclerView;
    initNativeView(): void;
    disposeNativeView(): void;
    readonly android: RecyclerView;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onItemsChanged(): void;
    refresh(): void;
    scrollToIndex(index: number, animated?: boolean): void;
    private _setPadding(newPadding);
    private _getLayoutManagarOrientation();
}
export interface GridViewRecyclerView extends android.support.v7.widget.RecyclerView {
    new (context: any, owner: WeakRef<GridView>): GridViewRecyclerView;
}
