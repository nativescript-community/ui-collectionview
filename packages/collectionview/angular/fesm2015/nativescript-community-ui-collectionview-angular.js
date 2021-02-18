import { EventEmitter, ɵisListLikeIterable, ɵɵdirectiveInject, ElementRef, IterableDiffers, ɵɵdefineComponent, ɵɵstaticContentQuery, TemplateRef, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵstaticViewQuery, ViewContainerRef, ɵɵelementStart, ɵɵelement, ɵɵelementEnd, ɵsetClassMetadata, Component, ChangeDetectionStrategy, Inject, ViewChild, Output, ContentChild, Input, ɵɵdefineDirective, Directive, Host, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ObservableArray, Trace, LayoutBase } from '@nativescript/core';
import { CollectionView, ListViewViewTypes, CLog, CLogTypes } from '@nativescript-community/ui-collectionview';
import { registerElement, getSingleViewRecursive } from '@nativescript/angular';

const _c0 = ["loader"];
registerElement('CollectionView', () => CollectionView);
const NG_VIEW = '_ngViewRef';
class ItemContext {
    constructor($implicit, item, index, even, odd) {
        this.$implicit = $implicit;
        this.item = item;
        this.index = index;
        this.even = even;
        this.odd = odd;
    }
}
class CollectionViewComponent {
    constructor(_elementRef, _iterableDiffers) {
        this._iterableDiffers = _iterableDiffers;
        this.setupItemView = new EventEmitter();
        this.itemViewLoader = (viewType) => {
            switch (viewType) {
                case ListViewViewTypes.ItemView:
                    if (this._itemTemplate && this.loader) {
                        const nativeItem = this.loader.createEmbeddedView(this._itemTemplate, new ItemContext(), 0);
                        const typedView = getItemViewRoot(nativeItem);
                        typedView[NG_VIEW] = nativeItem;
                        return typedView;
                    }
                    break;
            }
            return null;
        };
        this._collectionView = _elementRef.nativeElement;
        this._collectionView.on(CollectionView.itemLoadingEvent, this.onItemLoading, this);
        this._collectionView.itemViewLoader = this.itemViewLoader;
    }
    get nativeElement() {
        return this._collectionView;
    }
    get listView() {
        return this._collectionView;
    }
    get itemTemplate() {
        return this._itemTemplate;
    }
    set itemTemplate(value) {
        this._itemTemplate = value;
        this._collectionView.refresh();
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
        let needDiffer = true;
        if (value instanceof ObservableArray) {
            needDiffer = false;
        }
        if (needDiffer && !this._differ && ɵisListLikeIterable(value)) {
            this._differ = this._iterableDiffers.find(this._items).create((_index, item) => item);
        }
        this._collectionView.items = this._items;
    }
    ngAfterContentInit() {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'CollectionView.ngAfterContentInit()');
        }
        this.setItemTemplates();
    }
    ngOnDestroy() {
        this._collectionView.off(CollectionView.itemLoadingEvent, this.onItemLoading, this);
    }
    ngDoCheck() {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'ngDoCheck() - execute differ? ' + this._differ);
        }
        if (this._differ) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, 'ngDoCheck() - execute differ');
            }
            const changes = this._differ.diff(this._items);
            if (changes) {
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.info, 'ngDoCheck() - refresh');
                }
                this.refresh();
            }
        }
    }
    registerTemplate(key, template) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'registerTemplate for key: ' + key);
        }
        if (!this._templateMap) {
            this._templateMap = new Map();
        }
        const keyedTemplate = {
            key,
            createView: this.getItemTemplateViewFactory(template),
        };
        this._templateMap.set(key, keyedTemplate);
    }
    onItemLoading(args) {
        if (!args.view && !this.itemTemplate) {
            return;
        }
        if (!this.items)
            return;
        const index = args.index;
        const items = args.object.items;
        const currentItem = typeof items.getItem === 'function'
            ? items.getItem(index)
            : items[index];
        let viewRef;
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, `onItemLoading: ${index} - Reusing existing view`);
        }
        viewRef = args.view[NG_VIEW];
        if (!viewRef &&
            args.view instanceof LayoutBase &&
            args.view.getChildrenCount() > 0) {
            viewRef = args.view.getChildAt(0)[NG_VIEW];
        }
        if (!viewRef && Trace.isEnabled()) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, `ViewReference not found for item ${index}. View recycling is not working`);
            }
        }
        if (!viewRef) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, `onItemLoading: ${index} - Creating view from template`);
            }
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ItemContext(), 0);
            args.view = getItemViewRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
        }
        this.setupViewRef(viewRef, currentItem, index);
        this.detectChangesOnChild(viewRef, index);
    }
    setupViewRef(view, data, index) {
        const context = view.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = index % 2 === 0;
        context.odd = !context.even;
        this.setupItemView.next({
            context,
            data,
            index,
            view,
        });
    }
    getItemTemplateViewFactory(template) {
        return () => {
            const viewRef = this.loader.createEmbeddedView(template, new ItemContext(), 0);
            const resultView = getItemViewRoot(viewRef);
            resultView[NG_VIEW] = viewRef;
            return resultView;
        };
    }
    setItemTemplates() {
        this.itemTemplate = this.itemTemplateQuery;
        if (this._templateMap) {
            if (Trace.isEnabled()) {
                CLog(CLogTypes.info, 'Setting templates');
            }
            const templates = [];
            this._templateMap.forEach((value) => {
                templates.push(value);
            });
            this._collectionView.itemTemplates = templates;
        }
        else {
            this._collectionView.itemTemplate = this.getItemTemplateViewFactory(this.itemTemplate);
        }
    }
    detectChangesOnChild(viewRef, index) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'Manually detect changes in child: ' + index);
        }
        viewRef.markForCheck();
        viewRef.detectChanges();
    }
    refresh() {
        if (this._collectionView) {
            this._collectionView.refresh();
        }
    }
}
CollectionViewComponent.ɵfac = function CollectionViewComponent_Factory(t) { return new (t || CollectionViewComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(IterableDiffers)); };
CollectionViewComponent.ɵcmp = ɵɵdefineComponent({ type: CollectionViewComponent, selectors: [["CollectionView"]], contentQueries: function CollectionViewComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        ɵɵstaticContentQuery(dirIndex, TemplateRef, true, TemplateRef);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemTemplateQuery = _t.first);
    } }, viewQuery: function CollectionViewComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵstaticViewQuery(_c0, true, ViewContainerRef);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.loader = _t.first);
    } }, inputs: { itemTemplate: "itemTemplate", items: "items" }, outputs: { setupItemView: "setupItemView" }, decls: 3, vars: 0, consts: [["loader", ""]], template: function CollectionViewComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "DetachedContainer");
        ɵɵelement(1, "Placeholder", null, 0);
        ɵɵelementEnd();
    } }, encapsulation: 2, changeDetection: 0 });
(function () { ɵsetClassMetadata(CollectionViewComponent, [{
        type: Component,
        args: [{
                selector: 'CollectionView',
                template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], function () { return [{ type: ElementRef, decorators: [{
                type: Inject,
                args: [ElementRef]
            }] }, { type: IterableDiffers, decorators: [{
                type: Inject,
                args: [IterableDiffers]
            }] }]; }, { loader: [{
            type: ViewChild,
            args: ['loader', { read: ViewContainerRef, static: true }]
        }], setupItemView: [{
            type: Output
        }], itemTemplateQuery: [{
            type: ContentChild,
            args: [TemplateRef, { read: TemplateRef, static: true }]
        }], itemTemplate: [{
            type: Input
        }], items: [{
            type: Input
        }] }); })();
function getItemViewRoot(viewRef, rootLocator = getSingleViewRecursive) {
    const rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
}
class TemplateKeyDirective {
    constructor(templateRef, collectionView) {
        this.templateRef = templateRef;
        this.collectionView = collectionView;
    }
    set cvTemplateKey(value) {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.info, 'cvTemplateKey: ' + value);
        }
        if (this.collectionView && this.templateRef) {
            this.collectionView.registerTemplate(value.toLowerCase(), this.templateRef);
        }
    }
}
TemplateKeyDirective.ɵfac = function TemplateKeyDirective_Factory(t) { return new (t || TemplateKeyDirective)(ɵɵdirectiveInject(TemplateRef), ɵɵdirectiveInject(CollectionViewComponent, 1)); };
TemplateKeyDirective.ɵdir = ɵɵdefineDirective({ type: TemplateKeyDirective, selectors: [["", "cvTemplateKey", ""]], inputs: { cvTemplateKey: "cvTemplateKey" } });
(function () { ɵsetClassMetadata(TemplateKeyDirective, [{
        type: Directive,
        args: [{ selector: '[cvTemplateKey]' }]
    }], function () { return [{ type: TemplateRef }, { type: CollectionViewComponent, decorators: [{
                type: Host
            }] }]; }, { cvTemplateKey: [{
            type: Input
        }] }); })();

class CollectionViewModule {
}
CollectionViewModule.ɵmod = ɵɵdefineNgModule({ type: CollectionViewModule });
CollectionViewModule.ɵinj = ɵɵdefineInjector({ factory: function CollectionViewModule_Factory(t) { return new (t || CollectionViewModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(CollectionViewModule, { declarations: [CollectionViewComponent, TemplateKeyDirective], exports: [CollectionViewComponent, TemplateKeyDirective] }); })();
(function () { ɵsetClassMetadata(CollectionViewModule, [{
        type: NgModule,
        args: [{
                declarations: [CollectionViewComponent, TemplateKeyDirective],
                exports: [CollectionViewComponent, TemplateKeyDirective],
                schemas: [NO_ERRORS_SCHEMA],
            }]
    }], null, null); })();

export { CollectionViewComponent, CollectionViewModule, TemplateKeyDirective };
//# sourceMappingURL=nativescript-community-ui-collectionview-angular.js.map
