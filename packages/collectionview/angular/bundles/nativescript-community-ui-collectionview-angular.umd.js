(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@nativescript/core'), require('@nativescript-community/ui-collectionview'), require('@nativescript/angular')) :
    typeof define === 'function' && define.amd ? define('@nativescript-community/ui-collectionview-angular', ['exports', '@angular/core', '@nativescript/core', '@nativescript-community/ui-collectionview', '@nativescript/angular'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['nativescript-community'] = global['nativescript-community'] || {}, global['nativescript-community']['ui-collectionview-angular'] = {}), global.ng.core, global['ns-core'], global['ns-ui-collectionview'], global['ns-angular']));
}(this, (function (exports, i0, core, uiCollectionview, angular) { 'use strict';

    var _c0 = ["loader"];
    angular.registerElement('CollectionView', function () { return uiCollectionview.CollectionView; });
    var NG_VIEW = '_ngViewRef';
    var ItemContext = /** @class */ (function () {
        function ItemContext($implicit, item, index, even, odd) {
            this.$implicit = $implicit;
            this.item = item;
            this.index = index;
            this.even = even;
            this.odd = odd;
        }
        return ItemContext;
    }());
    var CollectionViewComponent = /** @class */ (function () {
        function CollectionViewComponent(_elementRef, _iterableDiffers) {
            var _this = this;
            this._iterableDiffers = _iterableDiffers;
            this.setupItemView = new i0.EventEmitter();
            this.itemViewLoader = function (viewType) {
                switch (viewType) {
                    case uiCollectionview.ListViewViewTypes.ItemView:
                        if (_this._itemTemplate && _this.loader) {
                            var nativeItem = _this.loader.createEmbeddedView(_this._itemTemplate, new ItemContext(), 0);
                            var typedView = getItemViewRoot(nativeItem);
                            typedView[NG_VIEW] = nativeItem;
                            return typedView;
                        }
                        break;
                }
                return null;
            };
            this._collectionView = _elementRef.nativeElement;
            this._collectionView.on(uiCollectionview.CollectionView.itemLoadingEvent, this.onItemLoading, this);
            this._collectionView.itemViewLoader = this.itemViewLoader;
        }
        Object.defineProperty(CollectionViewComponent.prototype, "nativeElement", {
            get: function () {
                return this._collectionView;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CollectionViewComponent.prototype, "listView", {
            get: function () {
                return this._collectionView;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CollectionViewComponent.prototype, "itemTemplate", {
            get: function () {
                return this._itemTemplate;
            },
            set: function (value) {
                this._itemTemplate = value;
                this._collectionView.refresh();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CollectionViewComponent.prototype, "items", {
            get: function () {
                return this._items;
            },
            set: function (value) {
                this._items = value;
                var needDiffer = true;
                if (value instanceof core.ObservableArray) {
                    needDiffer = false;
                }
                if (needDiffer && !this._differ && i0.ɵisListLikeIterable(value)) {
                    this._differ = this._iterableDiffers.find(this._items).create(function (_index, item) { return item; });
                }
                this._collectionView.items = this._items;
            },
            enumerable: false,
            configurable: true
        });
        CollectionViewComponent.prototype.ngAfterContentInit = function () {
            if (core.Trace.isEnabled()) {
                uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'CollectionView.ngAfterContentInit()');
            }
            this.setItemTemplates();
        };
        CollectionViewComponent.prototype.ngOnDestroy = function () {
            this._collectionView.off(uiCollectionview.CollectionView.itemLoadingEvent, this.onItemLoading, this);
        };
        CollectionViewComponent.prototype.ngDoCheck = function () {
            if (core.Trace.isEnabled()) {
                uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'ngDoCheck() - execute differ? ' + this._differ);
            }
            if (this._differ) {
                if (core.Trace.isEnabled()) {
                    uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'ngDoCheck() - execute differ');
                }
                var changes = this._differ.diff(this._items);
                if (changes) {
                    if (core.Trace.isEnabled()) {
                        uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'ngDoCheck() - refresh');
                    }
                    this.refresh();
                }
            }
        };
        CollectionViewComponent.prototype.registerTemplate = function (key, template) {
            if (core.Trace.isEnabled()) {
                uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'registerTemplate for key: ' + key);
            }
            if (!this._templateMap) {
                this._templateMap = new Map();
            }
            var keyedTemplate = {
                key: key,
                createView: this.getItemTemplateViewFactory(template),
            };
            this._templateMap.set(key, keyedTemplate);
        };
        CollectionViewComponent.prototype.onItemLoading = function (args) {
            if (!args.view && !this.itemTemplate) {
                return;
            }
            if (!this.items)
                return;
            var index = args.index;
            var items = args.object.items;
            var currentItem = typeof items.getItem === 'function'
                ? items.getItem(index)
                : items[index];
            var viewRef;
            if (core.Trace.isEnabled()) {
                uiCollectionview.CLog(uiCollectionview.CLogTypes.info, "onItemLoading: " + index + " - Reusing existing view");
            }
            viewRef = args.view[NG_VIEW];
            if (!viewRef &&
                args.view instanceof core.LayoutBase &&
                args.view.getChildrenCount() > 0) {
                viewRef = args.view.getChildAt(0)[NG_VIEW];
            }
            if (!viewRef && core.Trace.isEnabled()) {
                if (core.Trace.isEnabled()) {
                    uiCollectionview.CLog(uiCollectionview.CLogTypes.info, "ViewReference not found for item " + index + ". View recycling is not working");
                }
            }
            if (!viewRef) {
                if (core.Trace.isEnabled()) {
                    uiCollectionview.CLog(uiCollectionview.CLogTypes.info, "onItemLoading: " + index + " - Creating view from template");
                }
                viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ItemContext(), 0);
                args.view = getItemViewRoot(viewRef);
                args.view[NG_VIEW] = viewRef;
            }
            this.setupViewRef(viewRef, currentItem, index);
            this.detectChangesOnChild(viewRef, index);
        };
        CollectionViewComponent.prototype.setupViewRef = function (view, data, index) {
            var context = view.context;
            context.$implicit = data;
            context.item = data;
            context.index = index;
            context.even = index % 2 === 0;
            context.odd = !context.even;
            this.setupItemView.next({
                context: context,
                data: data,
                index: index,
                view: view,
            });
        };
        CollectionViewComponent.prototype.getItemTemplateViewFactory = function (template) {
            var _this = this;
            return function () {
                var viewRef = _this.loader.createEmbeddedView(template, new ItemContext(), 0);
                var resultView = getItemViewRoot(viewRef);
                resultView[NG_VIEW] = viewRef;
                return resultView;
            };
        };
        CollectionViewComponent.prototype.setItemTemplates = function () {
            this.itemTemplate = this.itemTemplateQuery;
            if (this._templateMap) {
                if (core.Trace.isEnabled()) {
                    uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'Setting templates');
                }
                var templates_1 = [];
                this._templateMap.forEach(function (value) {
                    templates_1.push(value);
                });
                this._collectionView.itemTemplates = templates_1;
            }
            else {
                this._collectionView.itemTemplate = this.getItemTemplateViewFactory(this.itemTemplate);
            }
        };
        CollectionViewComponent.prototype.detectChangesOnChild = function (viewRef, index) {
            if (core.Trace.isEnabled()) {
                uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'Manually detect changes in child: ' + index);
            }
            viewRef.markForCheck();
            viewRef.detectChanges();
        };
        CollectionViewComponent.prototype.refresh = function () {
            if (this._collectionView) {
                this._collectionView.refresh();
            }
        };
        return CollectionViewComponent;
    }());
    CollectionViewComponent.ɵfac = function CollectionViewComponent_Factory(t) { return new (t || CollectionViewComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.IterableDiffers)); };
    CollectionViewComponent.ɵcmp = i0.ɵɵdefineComponent({ type: CollectionViewComponent, selectors: [["CollectionView"]], contentQueries: function CollectionViewComponent_ContentQueries(rf, ctx, dirIndex) {
            if (rf & 1) {
                i0.ɵɵstaticContentQuery(dirIndex, i0.TemplateRef, true, i0.TemplateRef);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemTemplateQuery = _t.first);
            }
        }, viewQuery: function CollectionViewComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵstaticViewQuery(_c0, true, i0.ViewContainerRef);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.loader = _t.first);
            }
        }, inputs: { itemTemplate: "itemTemplate", items: "items" }, outputs: { setupItemView: "setupItemView" }, decls: 3, vars: 0, consts: [["loader", ""]], template: function CollectionViewComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "DetachedContainer");
                i0.ɵɵelement(1, "Placeholder", null, 0);
                i0.ɵɵelementEnd();
            }
        }, encapsulation: 2, changeDetection: 0 });
    (function () {
        i0.ɵsetClassMetadata(CollectionViewComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'CollectionView',
                        template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>\n    ",
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    }]
            }], function () {
            return [{ type: i0.ElementRef, decorators: [{
                            type: i0.Inject,
                            args: [i0.ElementRef]
                        }] }, { type: i0.IterableDiffers, decorators: [{
                            type: i0.Inject,
                            args: [i0.IterableDiffers]
                        }] }];
        }, { loader: [{
                    type: i0.ViewChild,
                    args: ['loader', { read: i0.ViewContainerRef, static: true }]
                }], setupItemView: [{
                    type: i0.Output
                }], itemTemplateQuery: [{
                    type: i0.ContentChild,
                    args: [i0.TemplateRef, { read: i0.TemplateRef, static: true }]
                }], itemTemplate: [{
                    type: i0.Input
                }], items: [{
                    type: i0.Input
                }] });
    })();
    function getItemViewRoot(viewRef, rootLocator) {
        if (rootLocator === void 0) { rootLocator = angular.getSingleViewRecursive; }
        var rootView = rootLocator(viewRef.rootNodes, 0);
        return rootView;
    }
    var TemplateKeyDirective = /** @class */ (function () {
        function TemplateKeyDirective(templateRef, collectionView) {
            this.templateRef = templateRef;
            this.collectionView = collectionView;
        }
        Object.defineProperty(TemplateKeyDirective.prototype, "cvTemplateKey", {
            set: function (value) {
                if (core.Trace.isEnabled()) {
                    uiCollectionview.CLog(uiCollectionview.CLogTypes.info, 'cvTemplateKey: ' + value);
                }
                if (this.collectionView && this.templateRef) {
                    this.collectionView.registerTemplate(value.toLowerCase(), this.templateRef);
                }
            },
            enumerable: false,
            configurable: true
        });
        return TemplateKeyDirective;
    }());
    TemplateKeyDirective.ɵfac = function TemplateKeyDirective_Factory(t) { return new (t || TemplateKeyDirective)(i0.ɵɵdirectiveInject(i0.TemplateRef), i0.ɵɵdirectiveInject(CollectionViewComponent, 1)); };
    TemplateKeyDirective.ɵdir = i0.ɵɵdefineDirective({ type: TemplateKeyDirective, selectors: [["", "cvTemplateKey", ""]], inputs: { cvTemplateKey: "cvTemplateKey" } });
    (function () {
        i0.ɵsetClassMetadata(TemplateKeyDirective, [{
                type: i0.Directive,
                args: [{ selector: '[cvTemplateKey]' }]
            }], function () {
            return [{ type: i0.TemplateRef }, { type: CollectionViewComponent, decorators: [{
                            type: i0.Host
                        }] }];
        }, { cvTemplateKey: [{
                    type: i0.Input
                }] });
    })();

    var CollectionViewModule = /** @class */ (function () {
        function CollectionViewModule() {
        }
        return CollectionViewModule;
    }());
    CollectionViewModule.ɵmod = i0.ɵɵdefineNgModule({ type: CollectionViewModule });
    CollectionViewModule.ɵinj = i0.ɵɵdefineInjector({ factory: function CollectionViewModule_Factory(t) { return new (t || CollectionViewModule)(); } });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CollectionViewModule, { declarations: [CollectionViewComponent, TemplateKeyDirective], exports: [CollectionViewComponent, TemplateKeyDirective] }); })();
    (function () {
        i0.ɵsetClassMetadata(CollectionViewModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [CollectionViewComponent, TemplateKeyDirective],
                        exports: [CollectionViewComponent, TemplateKeyDirective],
                        schemas: [i0.NO_ERRORS_SCHEMA],
                    }]
            }], null, null);
    })();

    exports.CollectionViewComponent = CollectionViewComponent;
    exports.CollectionViewModule = CollectionViewModule;
    exports.TemplateKeyDirective = TemplateKeyDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=nativescript-community-ui-collectionview-angular.umd.js.map
