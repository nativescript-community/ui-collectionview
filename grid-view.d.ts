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

declare module "nativescript-grid-view"
{
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import observable = require("data/observable");

    export class GridView extends view.View
    {
        public static itemLoadingEvent: string;
        public static itemTapEvent: string;
        public static loadMoreItemsEvent: string;

        public static itemsProperty: dependencyObservable.Property;
        public static itemTemplateProperty: dependencyObservable.Property;
        public static colWidthProperty: dependencyObservable.Property;
        public static rowHeightProperty: dependencyObservable.Property;
        public static verticalSpacingProperty: dependencyObservable.Property;
        public static horizontalSpacingProperty: dependencyObservable.Property;

        items: any;
        itemTemplate: string;
        rowHeight: number;
        colWidth: number;
        verticalSpacing: number;
        horizontalSpacing: number;

        ios: UICollectionView;
        android: android.widget.GridView;

        public refresh();
    }

    export interface GridItemEventData extends observable.EventData
    {
        eventName: string;
        object: GridView;
        index: number;
        view: view.View;
    }
}