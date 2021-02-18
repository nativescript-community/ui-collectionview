import { ChangeDetectionStrategy, Component, ContentChild, Directive, ElementRef, EventEmitter, Host, Inject, Input, IterableDiffers, Output, TemplateRef, ViewChild, ViewContainerRef, ɵisListLikeIterable as isListLikeIterable, } from '@angular/core';
import { LayoutBase, ObservableArray, Trace } from '@nativescript/core';
import { CLog, CLogTypes, CollectionView, ListViewViewTypes } from '@nativescript-community/ui-collectionview';
import { getSingleViewRecursive, registerElement } from '@nativescript/angular';
import * as i0 from "@angular/core";
const _c0 = ["loader"];
registerElement('CollectionView', () => CollectionView);
const NG_VIEW = '_ngViewRef';
export class ItemContext {
    constructor($implicit, item, index, even, odd) {
        this.$implicit = $implicit;
        this.item = item;
        this.index = index;
        this.even = even;
        this.odd = odd;
    }
}
export class CollectionViewComponent {
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
        if (needDiffer && !this._differ && isListLikeIterable(value)) {
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
CollectionViewComponent.ɵfac = function CollectionViewComponent_Factory(t) { return new (t || CollectionViewComponent)(i0.ɵɵdirectiveInject(ElementRef), i0.ɵɵdirectiveInject(IterableDiffers)); };
CollectionViewComponent.ɵcmp = i0.ɵɵdefineComponent({ type: CollectionViewComponent, selectors: [["CollectionView"]], contentQueries: function CollectionViewComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        i0.ɵɵstaticContentQuery(dirIndex, TemplateRef, true, TemplateRef);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemTemplateQuery = _t.first);
    } }, viewQuery: function CollectionViewComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵstaticViewQuery(_c0, true, ViewContainerRef);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.loader = _t.first);
    } }, inputs: { itemTemplate: "itemTemplate", items: "items" }, outputs: { setupItemView: "setupItemView" }, decls: 3, vars: 0, consts: [["loader", ""]], template: function CollectionViewComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "DetachedContainer");
        i0.ɵɵelement(1, "Placeholder", null, 0);
        i0.ɵɵelementEnd();
    } }, encapsulation: 2, changeDetection: 0 });
(function () { i0.ɵsetClassMetadata(CollectionViewComponent, [{
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
    }], function () { return [{ type: i0.ElementRef, decorators: [{
                type: Inject,
                args: [ElementRef]
            }] }, { type: i0.IterableDiffers, decorators: [{
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
export function getItemViewRoot(viewRef, rootLocator = getSingleViewRecursive) {
    const rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
}
export class TemplateKeyDirective {
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
TemplateKeyDirective.ɵfac = function TemplateKeyDirective_Factory(t) { return new (t || TemplateKeyDirective)(i0.ɵɵdirectiveInject(i0.TemplateRef), i0.ɵɵdirectiveInject(CollectionViewComponent, 1)); };
TemplateKeyDirective.ɵdir = i0.ɵɵdefineDirective({ type: TemplateKeyDirective, selectors: [["", "cvTemplateKey", ""]], inputs: { cvTemplateKey: "cvTemplateKey" } });
(function () { i0.ɵsetClassMetadata(TemplateKeyDirective, [{
        type: Directive,
        args: [{ selector: '[cvTemplateKey]' }]
    }], function () { return [{ type: i0.TemplateRef }, { type: CollectionViewComponent, decorators: [{
                type: Host
            }] }]; }, { cvTemplateKey: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbnZpZXctY29tcC5qcyIsInNvdXJjZVJvb3QiOiIvVm9sdW1lcy9kZXYvbmF0aXZlc2NyaXB0L25hdGl2ZVNjcmlwdC1jb2xsZWN0aW9udmlldy9zcmMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImNvbGxlY3Rpb252aWV3LWNvbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFFVCxVQUFVLEVBRVYsWUFBWSxFQUNaLElBQUksRUFDSixNQUFNLEVBQ04sS0FBSyxFQUVMLGVBQWUsRUFFZixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsbUJBQW1CLElBQUksa0JBQWtCLEdBQzVDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBaUIsVUFBVSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUM3RixPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQStCLGlCQUFpQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFNUksT0FBTyxFQUFFLHNCQUFzQixFQUFlLGVBQWUsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7QUFFN0YsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXhELE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztBQUU3QixNQUFNLE9BQU8sV0FBVztJQUNwQixZQUNXLFNBQWUsRUFDZixJQUFVLEVBQ1YsS0FBYyxFQUNkLElBQWMsRUFDZCxHQUFhO1FBSmIsY0FBUyxHQUFULFNBQVMsQ0FBTTtRQUNmLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBVTtRQUNkLFFBQUcsR0FBSCxHQUFHLENBQVU7SUFDckIsQ0FBQztDQUNQO0FBa0JELE1B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QXlCO0lBQUcsQ0FBQztJQUU5RyxJQUNJLGFBQWEsQ0FBQyxLQUFVO1FBQ3hCLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQy9FO0lBQ0wsQ0FBQzs7d0ZBWFEsb0JBQW9CLDZEQUNzRCx1QkFBdUI7eURBRGpHLG9CQUFvQjtvQ0FBcEIsb0JBQW9CO2NBRGhDLFNBQVM7ZUFBQyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRTtnRUFFNkMsdUJBQXVCO3NCQUF0RCxJQUFJO3dCQUdwRCxhQUFhO2tCQURoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgRGlyZWN0aXZlLFxuICAgIERvQ2hlY2ssXG4gICAgRWxlbWVudFJlZixcbiAgICBFbWJlZGRlZFZpZXdSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3QsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIEl0ZXJhYmxlRGlmZmVyLFxuICAgIEl0ZXJhYmxlRGlmZmVycyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3V0cHV0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3Q29udGFpbmVyUmVmLFxuICAgIMm1aXNMaXN0TGlrZUl0ZXJhYmxlIGFzIGlzTGlzdExpa2VJdGVyYWJsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBLZXllZFRlbXBsYXRlLCBMYXlvdXRCYXNlLCBPYnNlcnZhYmxlQXJyYXksIFRyYWNlLCBWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlJztcbmltcG9ydCB7IENMb2csIENMb2dUeXBlcywgQ29sbGVjdGlvblZpZXcsIENvbGxlY3Rpb25WaWV3SXRlbUV2ZW50RGF0YSwgTGlzdFZpZXdWaWV3VHlwZXMgfSBmcm9tICdAbmF0aXZlc2NyaXB0LWNvbW11bml0eS91aS1jb2xsZWN0aW9udmlldyc7XG5cbmltcG9ydCB7IGdldFNpbmdsZVZpZXdSZWN1cnNpdmUsIGlzS25vd25WaWV3LCByZWdpc3RlckVsZW1lbnQgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2FuZ3VsYXInO1xuXG5yZWdpc3RlckVsZW1lbnQoJ0NvbGxlY3Rpb25WaWV3JywgKCkgPT4gQ29sbGVjdGlvblZpZXcpO1xuXG5jb25zdCBOR19WSUVXID0gJ19uZ1ZpZXdSZWYnO1xuXG5leHBvcnQgY2xhc3MgSXRlbUNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgJGltcGxpY2l0PzogYW55LFxuICAgICAgICBwdWJsaWMgaXRlbT86IGFueSxcbiAgICAgICAgcHVibGljIGluZGV4PzogbnVtYmVyLFxuICAgICAgICBwdWJsaWMgZXZlbj86IGJvb2xlYW4sXG4gICAgICAgIHB1YmxpYyBvZGQ/OiBib29sZWFuXG4gICAgKSB7fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNldHVwSXRlbVZpZXdBcmdzIHtcbiAgICB2aWV3OiBFbWJlZGRlZFZpZXdSZWY8YW55PjtcbiAgICBkYXRhOiBhbnk7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBjb250ZXh0OiBJdGVtQ29udGV4dDtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdDb2xsZWN0aW9uVmlldycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPERldGFjaGVkQ29udGFpbmVyPlxuICAgICAgICAgICAgPFBsYWNlaG9sZGVyICNsb2FkZXI+PC9QbGFjZWhvbGRlcj5cbiAgICAgICAgPC9EZXRhY2hlZENvbnRhaW5lcj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uVmlldztcbiAgICB9XG4gICAgcHVibGljIGdldCBsaXN0VmlldygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvblZpZXc7XG4gICAgfVxuXG4gICAgQFZpZXdDaGlsZCgnbG9hZGVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIGxvYWRlcjogVmlld0NvbnRhaW5lclJlZjtcbiAgICBAT3V0cHV0KCkgcHVibGljIHNldHVwSXRlbVZpZXcgPSBuZXcgRXZlbnRFbWl0dGVyPFNldHVwSXRlbVZpZXdBcmdzPigpO1xuICAgIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgaXRlbVRlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPEl0ZW1Db250ZXh0PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBpdGVtVGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtVGVtcGxhdGU7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgaXRlbVRlbXBsYXRlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5faXRlbVRlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3LnJlZnJlc2goKTtcbiAgICB9XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgaXRlbXModmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICAgICAgICBsZXQgbmVlZERpZmZlciA9IHRydWU7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9ic2VydmFibGVBcnJheSkge1xuICAgICAgICAgICAgbmVlZERpZmZlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZWVkRGlmZmVyICYmICF0aGlzLl9kaWZmZXIgJiYgaXNMaXN0TGlrZUl0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlmZmVyID0gdGhpcy5faXRlcmFibGVEaWZmZXJzLmZpbmQodGhpcy5faXRlbXMpLmNyZWF0ZSgoX2luZGV4LCBpdGVtKSA9PiBpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3Lml0ZW1zID0gdGhpcy5faXRlbXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY29sbGVjdGlvblZpZXc6IENvbGxlY3Rpb25WaWV3O1xuICAgIHByaXZhdGUgX2l0ZW1zOiBhbnk7XG4gICAgcHJpdmF0ZSBfZGlmZmVyOiBJdGVyYWJsZURpZmZlcjxLZXllZFRlbXBsYXRlPjtcbiAgICBwcml2YXRlIF9pdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPEl0ZW1Db250ZXh0PjtcbiAgICBwcml2YXRlIF90ZW1wbGF0ZU1hcDogTWFwPHN0cmluZywgS2V5ZWRUZW1wbGF0ZT47XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBASW5qZWN0KEl0ZXJhYmxlRGlmZmVycykgcHJpdmF0ZSBfaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMpIHtcbiAgICAgICAgdGhpcy5fY29sbGVjdGlvblZpZXcgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3Lm9uKENvbGxlY3Rpb25WaWV3Lml0ZW1Mb2FkaW5nRXZlbnQsIHRoaXMub25JdGVtTG9hZGluZywgdGhpcyk7XG4gICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3Lml0ZW1WaWV3TG9hZGVyID0gdGhpcy5pdGVtVmlld0xvYWRlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGl0ZW1WaWV3TG9hZGVyID0gKHZpZXdUeXBlKSA9PiB7XG4gICAgICAgIHN3aXRjaCAodmlld1R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgTGlzdFZpZXdWaWV3VHlwZXMuSXRlbVZpZXc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2l0ZW1UZW1wbGF0ZSAmJiB0aGlzLmxvYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVJdGVtID0gdGhpcy5sb2FkZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX2l0ZW1UZW1wbGF0ZSwgbmV3IEl0ZW1Db250ZXh0KCksIDApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlZFZpZXcgPSBnZXRJdGVtVmlld1Jvb3QobmF0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVkVmlld1tOR19WSUVXXSA9IG5hdGl2ZUl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlZFZpZXc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICBpZiAoVHJhY2UuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIENMb2coQ0xvZ1R5cGVzLmluZm8sICdDb2xsZWN0aW9uVmlldy5uZ0FmdGVyQ29udGVudEluaXQoKScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SXRlbVRlbXBsYXRlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fY29sbGVjdGlvblZpZXcub2ZmKENvbGxlY3Rpb25WaWV3Lml0ZW1Mb2FkaW5nRXZlbnQsIHRoaXMub25JdGVtTG9hZGluZywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nRG9DaGVjaygpIHtcbiAgICAgICAgaWYgKFRyYWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBDTG9nKENMb2dUeXBlcy5pbmZvLCAnbmdEb0NoZWNrKCkgLSBleGVjdXRlIGRpZmZlcj8gJyArIHRoaXMuX2RpZmZlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgICAgICAgaWYgKFRyYWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgQ0xvZyhDTG9nVHlwZXMuaW5mbywgJ25nRG9DaGVjaygpIC0gZXhlY3V0ZSBkaWZmZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9pdGVtcyk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcykge1xuICAgICAgICAgICAgICAgIGlmIChUcmFjZS5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBDTG9nKENMb2dUeXBlcy5pbmZvLCAnbmdEb0NoZWNrKCkgLSByZWZyZXNoJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyVGVtcGxhdGUoa2V5OiBzdHJpbmcsIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJdGVtQ29udGV4dD4pIHtcbiAgICAgICAgaWYgKFRyYWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBDTG9nKENMb2dUeXBlcy5pbmZvLCAncmVnaXN0ZXJUZW1wbGF0ZSBmb3Iga2V5OiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RlbXBsYXRlTWFwKSB7XG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBLZXllZFRlbXBsYXRlPigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5ZWRUZW1wbGF0ZSA9IHtcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIGNyZWF0ZVZpZXc6IHRoaXMuZ2V0SXRlbVRlbXBsYXRlVmlld0ZhY3RvcnkodGVtcGxhdGUpLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlTWFwLnNldChrZXksIGtleWVkVGVtcGxhdGUpO1xuICAgIH1cblxuICAgIC8vIEBIb3N0TGlzdGVuZXIoJ2l0ZW1Mb2FkaW5nSW50ZXJuYWwnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbkl0ZW1Mb2FkaW5nKGFyZ3M6IENvbGxlY3Rpb25WaWV3SXRlbUV2ZW50RGF0YSkge1xuICAgICAgICBpZiAoIWFyZ3MudmlldyAmJiAhdGhpcy5pdGVtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXRlbXMpIHJldHVybjtcbiAgICAgICAgY29uc3QgaW5kZXggPSBhcmdzLmluZGV4O1xuICAgICAgICBjb25zdCBpdGVtcyA9IChhcmdzLm9iamVjdCBhcyBhbnkpLml0ZW1zO1xuICAgICAgICBjb25zdCBjdXJyZW50SXRlbSA9XG4gICAgICAgICAgICB0eXBlb2YgaXRlbXMuZ2V0SXRlbSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgID8gaXRlbXMuZ2V0SXRlbShpbmRleClcbiAgICAgICAgICAgICAgICA6IGl0ZW1zW2luZGV4XTtcbiAgICAgICAgbGV0IHZpZXdSZWY6IEVtYmVkZGVkVmlld1JlZjxJdGVtQ29udGV4dD47XG5cbiAgICAgICAgaWYgKFRyYWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBDTG9nKENMb2dUeXBlcy5pbmZvLCBgb25JdGVtTG9hZGluZzogJHtpbmRleH0gLSBSZXVzaW5nIGV4aXN0aW5nIHZpZXdgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXdSZWYgPSBhcmdzLnZpZXdbTkdfVklFV107XG4gICAgICAgIC8vIEdldHRpbmcgYW5ndWxhciB2aWV3IGZyb20gb3JpZ2luYWwgZWxlbWVudCAoaW4gY2FzZXMgd2hlbiBQcm94eVZpZXdDb250YWluZXJcbiAgICAgICAgLy8gaXMgdXNlZCBOYXRpdmVTY3JpcHQgaW50ZXJuYWxseSB3cmFwcyBpdCBpbiBhIFN0YWNrTGF5b3V0KVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdmlld1JlZiAmJlxuICAgICAgICAgICAgYXJncy52aWV3IGluc3RhbmNlb2YgTGF5b3V0QmFzZSAmJlxuICAgICAgICAgICAgYXJncy52aWV3LmdldENoaWxkcmVuQ291bnQoKSA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB2aWV3UmVmID0gYXJncy52aWV3LmdldENoaWxkQXQoMClbTkdfVklFV107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXZpZXdSZWYgJiYgVHJhY2UuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIGlmIChUcmFjZS5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIENMb2coQ0xvZ1R5cGVzLmluZm8sIGBWaWV3UmVmZXJlbmNlIG5vdCBmb3VuZCBmb3IgaXRlbSAke2luZGV4fS4gVmlldyByZWN5Y2xpbmcgaXMgbm90IHdvcmtpbmdgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdmlld1JlZikge1xuICAgICAgICAgICAgaWYgKFRyYWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgQ0xvZyhDTG9nVHlwZXMuaW5mbywgYG9uSXRlbUxvYWRpbmc6ICR7aW5kZXh9IC0gQ3JlYXRpbmcgdmlldyBmcm9tIHRlbXBsYXRlYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdSZWYgPSB0aGlzLmxvYWRlci5jcmVhdGVFbWJlZGRlZFZpZXcoXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgbmV3IEl0ZW1Db250ZXh0KCksXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGFyZ3MudmlldyA9IGdldEl0ZW1WaWV3Um9vdCh2aWV3UmVmKTtcbiAgICAgICAgICAgIGFyZ3Mudmlld1tOR19WSUVXXSA9IHZpZXdSZWY7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldHVwVmlld1JlZih2aWV3UmVmLCBjdXJyZW50SXRlbSwgaW5kZXgpO1xuXG4gICAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlc09uQ2hpbGQodmlld1JlZiwgaW5kZXgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cFZpZXdSZWYodmlldzogRW1iZWRkZWRWaWV3UmVmPEl0ZW1Db250ZXh0PiwgZGF0YTogYW55LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB2aWV3LmNvbnRleHQ7XG4gICAgICAgIGNvbnRleHQuJGltcGxpY2l0ID0gZGF0YTtcbiAgICAgICAgY29udGV4dC5pdGVtID0gZGF0YTtcbiAgICAgICAgY29udGV4dC5pbmRleCA9IGluZGV4O1xuICAgICAgICBjb250ZXh0LmV2ZW4gPSBpbmRleCAlIDIgPT09IDA7XG4gICAgICAgIGNvbnRleHQub2RkID0gIWNvbnRleHQuZXZlbjtcblxuICAgICAgICB0aGlzLnNldHVwSXRlbVZpZXcubmV4dCh7XG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgdmlldyxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1UZW1wbGF0ZVZpZXdGYWN0b3J5KFxuICAgICAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8SXRlbUNvbnRleHQ+XG4gICAgKTogKCkgPT4gVmlldyB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy5sb2FkZXIuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgIG5ldyBJdGVtQ29udGV4dCgpLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRWaWV3ID0gZ2V0SXRlbVZpZXdSb290KHZpZXdSZWYpO1xuICAgICAgICAgICAgcmVzdWx0Vmlld1tOR19WSUVXXSA9IHZpZXdSZWY7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRWaWV3O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SXRlbVRlbXBsYXRlcygpIHtcbiAgICAgICAgLy8gVGhlIGl0ZW1UZW1wbGF0ZVF1ZXJ5IG1heSBiZSBjaGFuZ2VkIGFmdGVyIGxpc3QgaXRlbXMgYXJlIGFkZGVkIHRoYXQgY29udGFpbiA8dGVtcGxhdGU+IGluc2lkZSxcbiAgICAgICAgLy8gc28gY2FjaGUgYW5kIHVzZSBvbmx5IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0byBhdm9pZCBlcnJvcnMuXG4gICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gdGhpcy5pdGVtVGVtcGxhdGVRdWVyeTtcblxuICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGVNYXApIHtcbiAgICAgICAgICAgIGlmIChUcmFjZS5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIENMb2coQ0xvZ1R5cGVzLmluZm8sICdTZXR0aW5nIHRlbXBsYXRlcycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZXM6IEtleWVkVGVtcGxhdGVbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVNYXAuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3Lml0ZW1UZW1wbGF0ZXMgPSB0ZW1wbGF0ZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgbWFwIHdhcyBub3QgaW5pdGlhbGl6ZWQgdGhpcyBtZWFucyB0aGF0IHRoZXJlIGFyZSBubyBuYW1lZCB0ZW1wbGF0ZXMsIHNvIHdlIHJlZ2lzdGVyIHRoZSBkZWZhdWx0IG9uZS5cbiAgICAgICAgICAgIHRoaXMuX2NvbGxlY3Rpb25WaWV3Lml0ZW1UZW1wbGF0ZSA9IHRoaXMuZ2V0SXRlbVRlbXBsYXRlVmlld0ZhY3RvcnkodGhpcy5pdGVtVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlY3RDaGFuZ2VzT25DaGlsZCh2aWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8SXRlbUNvbnRleHQ+LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChUcmFjZS5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgQ0xvZyhDTG9nVHlwZXMuaW5mbywgJ01hbnVhbGx5IGRldGVjdCBjaGFuZ2VzIGluIGNoaWxkOiAnICsgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHZpZXdSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVmcmVzaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbGxlY3Rpb25WaWV3KSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xsZWN0aW9uVmlldy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50VmlldyB7XG4gICAgcm9vdE5vZGVzOiBhbnlbXTtcbiAgICBkZXN0cm95KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIFJvb3RMb2NhdG9yID0gKG5vZGVzOiBhbnlbXSwgbmVzdExldmVsOiBudW1iZXIpID0+IFZpZXc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJdGVtVmlld1Jvb3Qodmlld1JlZjogQ29tcG9uZW50Vmlldywgcm9vdExvY2F0b3I6IFJvb3RMb2NhdG9yID0gZ2V0U2luZ2xlVmlld1JlY3Vyc2l2ZSk6IFZpZXcge1xuICAgIGNvbnN0IHJvb3RWaWV3ID0gcm9vdExvY2F0b3Iodmlld1JlZi5yb290Tm9kZXMsIDApO1xuICAgIHJldHVybiByb290Vmlldztcbn1cblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2N2VGVtcGxhdGVLZXldJyB9KVxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlS2V5RGlyZWN0aXZlIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBASG9zdCgpIHByaXZhdGUgY29sbGVjdGlvblZpZXc6IENvbGxlY3Rpb25WaWV3Q29tcG9uZW50KSB7fVxuXG4gICAgQElucHV0KClcbiAgICBzZXQgY3ZUZW1wbGF0ZUtleSh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmIChUcmFjZS5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgQ0xvZyhDTG9nVHlwZXMuaW5mbywgJ2N2VGVtcGxhdGVLZXk6ICcgKyB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29sbGVjdGlvblZpZXcgJiYgdGhpcy50ZW1wbGF0ZVJlZikge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uVmlldy5yZWdpc3RlclRlbXBsYXRlKHZhbHVlLnRvTG93ZXJDYXNlKCksIHRoaXMudGVtcGxhdGVSZWYpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19