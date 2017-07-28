/*
Based on https://github.com/NativeScript/nativescript-angular/blob/3.1.0/nativescript-angular/directives/list-view-comp.ts
Original License
   Copyright (c) 2015-2016 Telerik AD

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
END - original License
 */

import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    DoCheck,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    Inject,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { profile } from "tns-core-modules/profiling";
import { messageType, write } from "tns-core-modules/trace";
import {
  KeyedTemplate,
  View,
} from "tns-core-modules/ui/core/view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import {
  GridItemEventData,
  GridView,
} from "../grid-view";

import { isListLikeIterable } from "nativescript-angular/collection-facade";
import {
  getSingleViewRecursive,
  isKnownView,
  registerElement,
} from "nativescript-angular/element-registry";

export const gridViewTraceCategory = "ns-grid-view";

export function gridViewLog(message: string): void {
    write(message, gridViewTraceCategory);
}

export function listViewError(message: string): void {
    write(message, gridViewTraceCategory, messageType.error);
}

const NG_VIEW = "_ngViewRef";

export class GridItemContext {
    constructor(
        public $implicit?: any,
        public item?: any,
        public index?: number,
        public even?: boolean,
        public odd?: boolean
    ) {
    }
}

export interface SetupGridViewArgs {
    view: EmbeddedViewRef<any>;
    data: any;
    index: number;
    context: GridItemContext;
}

@Component({
    selector: "GridView",
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridViewComponent implements DoCheck, OnDestroy, AfterContentInit, AfterViewInit {
    public get nativeElement(): GridView {
        return this.gridView;
    }

    @ViewChild("loader", { read: ViewContainerRef }) public loader: ViewContainerRef;

    @Output() public setupGridView = new EventEmitter<SetupGridViewArgs>();

    @ContentChild(TemplateRef) public itemTemplateQuery: TemplateRef<GridItemContext>;

    @Input()
    public get items() {
        return this._items;
    }

    public set items(value: any) {
        this._items = value;
        let needDiffer = true;
        if (value instanceof ObservableArray) {
            needDiffer = false;
        }
        if (needDiffer && !this._differ && isListLikeIterable(value)) {
            this._differ = this._iterableDiffers.find(this._items)
                .create(this._cdr, (_index, item) => item);
        }

        this.gridView.items = this._items;
    }

    private gridView: GridView;
    private _items: any;
    private _differ: IterableDiffer<KeyedTemplate>;
    private itemTemplate: TemplateRef<GridItemContext>;

    constructor(@Inject(ElementRef) _elementRef: ElementRef,
                @Inject(IterableDiffers) private _iterableDiffers: IterableDiffers,
                @Inject(ChangeDetectorRef) private _cdr: ChangeDetectorRef) {
        this.gridView = _elementRef.nativeElement;

        this.gridView.on(GridView.itemLoadingEvent, this.onItemLoading, this);
    }

    public ngAfterContentInit() {
        gridViewLog("GridView.ngAfterContentInit()");
        this.setItemTemplates();
    }

    public ngAfterViewInit() {
        gridViewLog("GridView.ngAfterViewInit()");
    }

    public ngOnDestroy() {
        this.gridView.off(GridView.itemLoadingEvent, this.onItemLoading, this);
    }

    public ngDoCheck() {
        gridViewLog("ngDoCheck() - execute differ? " + this._differ);
        if (this._differ) {
            gridViewLog("ngDoCheck() - execute differ");
            const changes = this._differ.diff(this._items);
            if (changes) {
                gridViewLog("ngDoCheck() - refresh");
                this.refresh();
            }
        }
    }

    @profile
    public onItemLoading(args: GridItemEventData) {
        if (!args.view && !this.itemTemplate) {
            return;
        }

        const index = args.index;
        const items = args.object.items as any;
        const currentItem = typeof items.getItem === "function" ? items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef<GridItemContext>;

        if (args.view) {
            gridViewLog("onItemLoading: " + index + " - Reusing existing view");
            viewRef = args.view[NG_VIEW];
            // Getting angular view from original element (in cases when ProxyViewContainer
            // is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef && args.view instanceof LayoutBase && args.view.getChildrenCount() > 0) {
                viewRef = args.view.getChildAt(0)[NG_VIEW];
            }

            if (!viewRef) {
                listViewError("ViewReference not found for item " + index + ". View recycling is not working");
            }
        }

        if (!viewRef) {
            gridViewLog("onItemLoading: " + index + " - Creating view from template");
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new GridItemContext(), 0);
            args.view = getGridItemRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
        }

        this.setupViewRef(viewRef, currentItem, index);

        this.detectChangesOnChild(viewRef, index);
    }

    public setupViewRef(view: EmbeddedViewRef<GridItemContext>, data: any, index: number): void {
        const context = view.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;

        this.setupGridView.next({
          context,
          data,
          index,
          view,
        });
    }

    private setItemTemplates() {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;

        this.gridView.itemTemplate = () => {
            const viewRef = this.loader.createEmbeddedView(this.itemTemplate, new GridItemContext(), 0);
            const resultView = getGridItemRoot(viewRef);
            resultView[NG_VIEW] = viewRef;

            return resultView;
        };
    }

    @profile
    private detectChangesOnChild(viewRef: EmbeddedViewRef<GridItemContext>, index: number) {
        gridViewLog("Manually detect changes in child: " + index);
        viewRef.markForCheck();
        viewRef.detectChanges();
    }

    private refresh() {
      if (this.gridView) {
        this.gridView.refresh();
      }
    }
}

export interface ComponentView {
    rootNodes: any[];
    destroy(): void;
}

export type RootLocator = (nodes: any[], nestLevel: number) => View;

export function getGridItemRoot(viewRef: ComponentView, rootLocator: RootLocator = getSingleViewRecursive): View {
    const rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
}

if (!isKnownView("GridView")) {
  registerElement("GridView", () => GridView);
}
