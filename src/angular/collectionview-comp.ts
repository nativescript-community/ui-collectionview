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
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    DoCheck,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    Host,
    Inject,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ɵisListLikeIterable as isListLikeIterable,
    HostListener,
} from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { profile } from "tns-core-modules/profiling";
import { KeyedTemplate, View } from "tns-core-modules/ui/core/view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { CollectionViewItemEventData, CollectionView, ListViewViewTypes } from "../collectionview";
import { collectionViewError, collectionViewLog } from "./trace";

import { getSingleViewRecursive, isKnownView, registerElement } from "nativescript-angular/element-registry";

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

export interface SetupItemViewArgs {
    view: EmbeddedViewRef<any>;
    data: any;
    index: number;
    context: GridItemContext;
}

@Component({
    selector: "CollectionView",
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionViewComponent implements DoCheck, OnDestroy, AfterContentInit {
    public get nativeElement(): any {
        return this._collectionView;
    }    
    public get listView(): any {
        return this._collectionView;
    }

    @ViewChild("loader", { read: ViewContainerRef }) public loader: ViewContainerRef;
    @Output() public setupItemView = new EventEmitter<SetupItemViewArgs>();
    @ContentChild(TemplateRef) public itemTemplateQuery: TemplateRef<GridItemContext>;

    @Input()
    public get itemTemplate() {
        return this._itemTemplate;
    }
    public set itemTemplate(value: any) {
        this._itemTemplate = value;
        this._collectionView.refresh();
    }
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
                .create((_index, item) => item);
        }

        this._collectionView.items = this._items;
    }

    private _collectionView: CollectionView;
    private _items: any;
    private _differ: IterableDiffer<KeyedTemplate>;
    private _itemTemplate: TemplateRef<GridItemContext>;
    private _templateMap: Map<string, KeyedTemplate>;

    constructor(
        @Inject(ElementRef) _elementRef: ElementRef,
        @Inject(IterableDiffers) private _iterableDiffers: IterableDiffers,
    ) {
        this._collectionView = _elementRef.nativeElement;

        this._collectionView.on(CollectionView.itemLoadingEvent, this.onItemLoading, this);
        this._collectionView.itemViewLoader = this.itemViewLoader;
    }


    private itemViewLoader = (viewType) => {
        switch (viewType) {
            case ListViewViewTypes.ItemView:
                if (this._itemTemplate && this.loader) {
                    var nativeItem = this.loader.createEmbeddedView(this._itemTemplate, new GridItemContext(), 0);
                    var typedView = getItemViewRoot(nativeItem);
                    typedView[NG_VIEW] = nativeItem;
                    return typedView;
                }
                break;
            }
            return null;
    }

    public ngAfterContentInit() {
        collectionViewLog("CollectionView.ngAfterContentInit()");
        this.setItemTemplates();
    }

    public ngOnDestroy() {
        this._collectionView.off(CollectionView.itemLoadingEvent, this.onItemLoading, this);
    }

    public ngDoCheck() {
        collectionViewLog("ngDoCheck() - execute differ? " + this._differ);
        if (this._differ) {
            collectionViewLog("ngDoCheck() - execute differ");
            const changes = this._differ.diff(this._items);
            if (changes) {
                collectionViewLog("ngDoCheck() - refresh");
                this.refresh();
            }
        }
    }

    public registerTemplate(key: string, template: TemplateRef<GridItemContext>) {
        collectionViewLog("registerTemplate for key: " + key);
        if (!this._templateMap) {
            this._templateMap = new Map<string, KeyedTemplate>();
        }

        const keyedTemplate = {
            key,
            createView: this.createNativeViewFactoryFromTemplate(template),
        };

        this._templateMap.set(key, keyedTemplate);
    }

    // @HostListener('itemLoadingInternal', ['$event'])
    public onItemLoading(args: CollectionViewItemEventData) {
        var index = args.index;
        var currentItem = args.view.bindingContext;
        var ngView = args.view[NG_VIEW];
        if (ngView) {
            this.setupViewRef(ngView, currentItem, index);
            this.detectChangesOnChild(ngView, index);
        }
    }

    public setupViewRef(view: EmbeddedViewRef<GridItemContext>, data: any, index: number): void {
        const context = view.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;

        this.setupItemView.next({
          context,
          data,
          index,
          view,
        });
    }

    private createNativeViewFactoryFromTemplate(template: TemplateRef<GridItemContext>) {
        return () => {
            const viewRef = this.loader.createEmbeddedView(template, new GridItemContext(), 0);
            const resultView = getItemViewRoot(viewRef);
            resultView[NG_VIEW] = viewRef;

            return resultView;
        };
    }

    private setItemTemplates() {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;

        if (this._templateMap) {
            collectionViewLog("Setting templates");

            const templates: KeyedTemplate[] = [];
            this._templateMap.forEach((value) => {
                templates.push(value);
            });
            this._collectionView.itemTemplates = templates;
        }
        else { // If the map was not initialized this means that there are no named templates, so we register the default one. 
            this._collectionView.itemTemplate = this.createNativeViewFactoryFromTemplate(this.itemTemplate);
        }
    }

    @profile
    private detectChangesOnChild(viewRef: EmbeddedViewRef<GridItemContext>, index: number) {
        collectionViewLog("Manually detect changes in child: " + index);
        viewRef.markForCheck();
        viewRef.detectChanges();
    }

    private refresh() {
      if (this._collectionView) {
        this._collectionView.refresh();
      }
    }
}

export interface ComponentView {
    rootNodes: any[];
    destroy(): void;
}

export type RootLocator = (nodes: any[], nestLevel: number) => View;

export function getItemViewRoot(viewRef: ComponentView, rootLocator: RootLocator = getSingleViewRecursive): View {
    const rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
}

@Directive({ selector: "[cvTemplateKey]" })
export class TemplateKeyDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        @Host() private collectionView: CollectionViewComponent,
    ) {
    }

    @Input()
    set cvTemplateKey(value: any) {
        collectionViewLog("cvTemplateKey: " + value);
        if (this.collectionView && this.templateRef) {
            this.collectionView.registerTemplate(value, this.templateRef);
        }
    }
}

if (!isKnownView("CollectionView")) {
  registerElement("CollectionView", () => CollectionView);
}
