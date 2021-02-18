import { profile } from '@nativescript/core/profiling';
import { ContentView } from '@nativescript/core/ui';
import { NativeViewElementNode, TemplateElement, createElement, registerElement } from 'svelte-native/dom';
import { flush } from 'svelte/internal';
import { CollectionView } from '../collectionview';
class SvelteKeyedTemplate {
    constructor(key, templateEl) {
        this._key = key;
        this._templateEl = templateEl;
    }
    get component() {
        return this._templateEl.component;
    }
    get key() {
        return this._key;
    }
    createView() {
        const nativeEl = new ContentView();
        nativeEl.__SvelteComponentBuilder__ = (parentView, props) => {
            profile('__SvelteComponentBuilder__', () => {
                nativeEl.__SvelteComponent__ = new this.component({
                    target: parentView,
                    props,
                });
            })();
        };
        return nativeEl;
    }
}
export default class CollectionViewViewElement extends NativeViewElementNode {
    constructor() {
        super('collectionview', CollectionView);
        const nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType) => this.loadView(viewType);
        this.nativeView.on(CollectionView.itemLoadingEvent, this.updateListItem, this);
    }
    loadView(viewType) {
        if (Array.isArray(this.nativeElement.itemTemplates)) {
            const keyedTemplate = this.nativeElement.itemTemplates.find((t) => t.key === 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }
        const componentClass = this.getComponentForView(viewType);
        if (!componentClass)
            return null;
        const nativeEl = new ContentView();
        const builder = (parentView, props) => {
            nativeEl.__SvelteComponent__ = new componentClass({
                target: parentView,
                props,
            });
        };
        nativeEl.__SvelteComponentBuilder__ = builder;
        return nativeEl;
    }
    setAttribute(fullkey, value) {
        if (fullkey.toLowerCase() === 'itemtemplateselector') {
            fullkey = 'itemTemplateSelector';
        }
        super.setAttribute(fullkey, value);
    }
    getComponentForView(viewType) {
        const normalizedViewType = viewType.toLowerCase();
        const templateEl = this.childNodes.find((n) => n.tagName === 'template' && String(n.getAttribute('type')).toLowerCase() === normalizedViewType);
        if (!templateEl)
            return null;
        return templateEl.component;
    }
    onInsertedChild(childNode, index) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute('key') || 'default';
            this.nativeView.addTemplate(key, new SvelteKeyedTemplate(key, childNode));
        }
    }
    onRemovedChild(childNode) {
        super.onRemovedChild(childNode);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute('key') || 'default';
            this.nativeView.removeTemplate(key);
        }
    }
    updateListItem(args) {
        const _view = args.view;
        const props = { item: args.bindingContext, index: args.index };
        const componentInstance = _view.__SvelteComponent__;
        if (!componentInstance) {
            if (_view.__SvelteComponentBuilder__) {
                const dummy = createElement('fragment');
                _view.__SvelteComponentBuilder__(dummy, props);
                _view.__SvelteComponentBuilder__ = null;
                _view.__CollectionViewCurrentIndex__ = args.index;
                const nativeEl = dummy.firstElement().nativeView;
                _view.content = nativeEl;
            }
        }
        else {
            _view.__CollectionViewCurrentIndex__ = args.index;
            componentInstance.$set(props);
            flush();
        }
    }
    static register() {
        registerElement('collectionview', () => new CollectionViewViewElement());
    }
}
//# sourceMappingURL=index.js.map