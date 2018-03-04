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

import { KeyedTemplate, PercentLength, Template, View } from "ui/core/view";
import { ItemsSource } from "ui/list-view";
import { EventData } from "data/observable";

export type Orientation = "horizontal" | "vertical"

export class GridView extends View {
    public static itemLoadingEvent: string;
    public static itemTapEvent: string;
    public static loadMoreItemsEvent: string;

    public items: any[] | ItemsSource;
    public itemTemplate: string | Template;
    public itemTemplates: string | KeyedTemplate[];
    public rowHeight: PercentLength;
    public colWidth: PercentLength;
    public orientation: Orientation;

    public ios: any; /* UICollectionView */
    public android: any; /* android.support.v7.widget.RecyclerView */

    public refresh();
    public scrollToIndex(index: number, animated?: boolean);
}

export interface GridItemEventData extends EventData {
    eventName: string;
    object: GridView;
    index: number;
    view: View;
}
