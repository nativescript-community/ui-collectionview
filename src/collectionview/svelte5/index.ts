// Svelte 5 binding, for @nativescript-community/svelte-native >= 5. The Svelte 4 one is in ../svelte.
// Its view fields have their own names so both bindings can be compiled together.
import { ContentView, ItemEventData, View, ViewBase, profile } from '@nativescript/core';
import { NativeViewElementNode, TemplateElement, TemplateInstance, ViewNode, createElement, registerElement } from '@nativescript-community/svelte-native/dom';
import { CollectionView } from '..';

declare module '@nativescript/core/ui/core/view-base' {
    interface ViewBase {
        __Svelte5Instance__?: TemplateInstance;
        __Svelte5Builder__?: (parentView: ViewNode, item: any, index: number) => void;
        __Svelte5Index__?: number;
    }
}

// views created by the update (a changed {#if} block) are not suspended: resuming them too would
// decrement their load flags and leave them suspended forever, so we only resume what we suspended
function suspendNativeUpdates(view: ViewBase, suspended: ViewBase[]) {
    //@ts-ignore
    view._suspendNativeUpdates(0, false, true);
    suspended.push(view);
    view.eachChild((child) => {
        suspendNativeUpdates(child, suspended);
        return true;
    });
}

class SvelteKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    constructor(key: string, templateEl: TemplateElement) {
        this._key = key;
        this._templateEl = templateEl;
    }
    get key() {
        return this._key;
    }
    createView() {
        // create a proxy element to eventually contain our item (once we have one to render)
        // TODO is StackLayout the best choice here?
        // const wrapper = createElement('StackLayout') as NativeViewElementNode<View>;

        const nativeEl = new ContentView();

        // because of the way {N} works we cant use that wrapper as the target for the component
        // it will trigger uncessary {N} component updates because the parent view is already attached

        nativeEl.__Svelte5Builder__ = (parentView, item, index) => {
            nativeEl.__Svelte5Instance__ = this._templateEl.mount(parentView, item, index);
        };
        return nativeEl;
    }
}

export default class CollectionViewViewElement extends NativeViewElementNode<CollectionView> {
    constructor() {
        super('collectionview', CollectionView);
        const nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType);
        this.nativeView.on(CollectionView.itemLoadingEvent, this.updateListItem, this);
        this.nativeView.on(CollectionView.itemDisposingEvent, this.disposeListItem, this);
    }

    private loadView(viewType: string): View {
        if (Array.isArray(this.nativeElement.itemTemplates)) {
            const keyedTemplate = this.nativeElement.itemTemplates.find((t) => t.key === 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }

        const templateEl = this.getTemplateForView(viewType);
        if (!templateEl) return null;

        const nativeEl = new ContentView();

        // in svelte we want to add the wrapper as a child of the collectionview ourselves
        nativeEl.__Svelte5Builder__ = (parentView, item, index) => {
            nativeEl.__Svelte5Instance__ = templateEl.mount(parentView, item, index);
        };
        return nativeEl;
    }

    // For some reason itemTemplateSelector isn't defined as a "property" on radListView, so when we set the property, it is lowercase (due to svelte's forced downcasing)
    // we intercept and fix the case here.
    setAttribute(fullkey: string, value: any): void {
        if (fullkey.toLowerCase() === 'itemtemplateselector') {
            fullkey = 'itemTemplateSelector';
        }
        super.setAttribute(fullkey, value);
    }

    private getTemplateForView(viewType: string) {
        const normalizedViewType = viewType.toLowerCase();
        return this.childNodes.find((n) => n.tagName === 'template' && String(n.getAttribute('type')).toLowerCase() === normalizedViewType) as TemplateElement | undefined;
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute('key') || 'default';
            // const templates = !this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates === 'string' ? [] : (this.nativeView.itemTemplates as any[]);
            // we need to reassign or the update wont be seen
            this.nativeView.addTemplate(key, new SvelteKeyedTemplate(key, childNode));
            // = templates.concat([new SvelteKeyedTemplate(key, childNode)]);
        }
    }

    onRemovedChild(childNode: ViewNode) {
        super.onRemovedChild(childNode);
        if (childNode instanceof TemplateElement) {
            // the template's instances live in cells the native view may still hold
            childNode.unmountInstances();
            const key = childNode.getAttribute('key') || 'default';
            this.nativeView.removeTemplate(key);
        }
    }

    @profile
    private disposeListItem(args: ItemEventData) {
        const _view = args.view;
        if (_view.__Svelte5Instance__) {
            _view.__Svelte5Instance__.unmount();
            _view.__Svelte5Instance__ = null;
        }
    }
    @profile
    private updateListItem(args: ItemEventData & { bindingContext }) {
        const _view = args.view;
        const item = args.bindingContext;
        const index = args.index;
        const instance = _view.__Svelte5Instance__;
        if (!instance) {
            if (_view.__Svelte5Builder__) {
                const dummy = createElement('fragment');
                _view.__Svelte5Builder__(dummy, item, index);
                _view.__Svelte5Builder__ = null;
                _view.__Svelte5Index__ = index;
                const nativeEl = (dummy.firstElement() as NativeViewElementNode<View>).nativeView;
                (_view as ContentView).content = nativeEl;
            }
        } else {
            _view.__Svelte5Index__ = index;
            // _suspendNativeUpdates with special parameters for Akylas fork to preven requestLayout
            const suspended: ViewBase[] = [];
            suspendNativeUpdates(_view, suspended);
            try {
                _view._batchUpdate(() => {
                    // applied right away, and only what changed: rebinding to what the cell shows does nothing
                    instance.update(item, index);
                });
            } finally {
                // resuming replays the layout requests made during the update, once, so that the cell is measured again
                for (let index = suspended.length - 1; index >= 0; index--) {
                    //@ts-ignore
                    suspended[index]._resumeNativeUpdates(0, false, true);
                }
            }
        }
    }

    static register() {
        registerElement('collectionview', () => new CollectionViewViewElement());
    }
}
