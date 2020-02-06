/// <reference path="../../node_modules/svelte-native/index.d.ts" />
import { ItemEventData, ItemsSource } from "@nativescript/core/ui/list-view";
import { View } from "@nativescript/core/ui/core/view";
import {
    NativeViewElementNode,
    TemplateElement,
    ViewNode,
    createElement,
    logger,
    registerElement
} from "svelte-native/dom";
import { CollectionView, setDebug } from "../collectionview";

class SvelteKeyedTemplate {
    _key;
    _templateEl;
    constructor(key, templateEl) {
        this._key = key;
        this._templateEl = templateEl;
    }
    get component() {
        return this._templateEl.component as typeof SvelteComponent;
    }
    get key() {
        return this._key;
    }
    createView() {
        // create a proxy element to eventually contain our item (once we have one to render)
        // TODO is StackLayout the best choice here?
        const wrapper = createElement("StackLayout") as NativeViewElementNode<
            View
        >;
        const nativeEl = wrapper.nativeView;

        (nativeEl as any).__SvelteComponentBuilder__ = props => {
            const instance = new this.component({
                target: wrapper,
                props
            });
            (nativeEl as any).__SvelteComponent__ = instance;
        };
        return nativeEl;

    }
}

export default class CollectionViewViewElement extends NativeViewElementNode<
    CollectionView
> {
    constructor() {
        super("collectionview", CollectionView);
        const nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType: any): View =>
            this.loadView(viewType);
        this.nativeView.on(CollectionView.itemLoadingEvent, args => {
            this.updateListItem(args as ItemEventData);
        });
    }

    private loadView(viewType: string): View {
        if (Array.isArray(this.nativeElement.itemTemplates)) {
            const keyedTemplate = this.nativeElement.itemTemplates.find(
                t => t.key === "default"
            );
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }

        const componentClass = this.getComponentForView(viewType);
        if (!componentClass) return null;

        // const wrapper = createElement('ProxyViewContainer') as NativeViewElementNode<View>;
        const wrapper = createElement("StackLayout") as NativeViewElementNode<
            View
        >;
        const nativeEl = wrapper.nativeView;

        const builder = (props: any) => {
            const componentInstance = new componentClass({
                target: wrapper,
                props
            });
            (nativeEl as any).__SvelteComponent__ = componentInstance;
        };

        (nativeEl as any).__SvelteComponentBuilder__ = builder;
 
        return nativeEl;
    }

    // For some reason itemTemplateSelector isn't defined as a "property" on radListView, so when we set the property, it is lowercase (due to svelte's forced downcasing)
    // we intercept and fix the case here.
    setAttribute(fullkey: string, value: any): void {
        if (fullkey.toLowerCase() === "itemtemplateselector") {
            fullkey = "itemTemplateSelector";
        }
        super.setAttribute(fullkey, value);
    }

    private getComponentForView(viewType: string) {
        const normalizedViewType = viewType.toLowerCase();

        const templateEl = this.childNodes.find(
            n =>
                n.tagName === "template" &&
                String(n.getAttribute("type")).toLowerCase() ===
                    normalizedViewType
        ) as any;
        if (!templateEl) return null;
        return templateEl.component as typeof SvelteComponent;
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute("key") || "default";
            if (
                !this.nativeView.itemTemplates ||
                typeof this.nativeView.itemTemplates === "string"
            ) {
                this.nativeView.itemTemplates = [];
            }
            this.nativeView.itemTemplates.push(
                new SvelteKeyedTemplate(key, childNode)
            );
        }
    }

    onRemovedChild(childNode: ViewNode) {
        super.onRemovedChild(childNode);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute("key") || "default";
            if (
                this.nativeView.itemTemplates &&
                typeof this.nativeView.itemTemplates !== "string"
            ) {
                this.nativeView.itemTemplates = this.nativeView.itemTemplates.filter(
                    t => t.key !== key
                );
            }
        }
    }

    private updateViewWithProps(view: View, props: any) {
        let componentInstance: SvelteComponent;
        const _view = view as any;
        if (!_view.__SvelteComponent__) {
            if (_view.__SvelteComponentBuilder__) {
                _view.__SvelteComponentBuilder__(props);
                _view.__SvelteComponentBuilder__ = null;
                return;
            }
        }

        if (_view.__SvelteComponent__) {
            componentInstance = _view.__SvelteComponent__;
        }

        if (componentInstance) {
            componentInstance.$set(props);
        } else {
            console.error("Couldn't find component for ", view);
        }
    }

    private updateListItem(args: ItemEventData) {
        let item;
        const listView = this.nativeView;
        const items = listView.items;

        if (args.index >= items.length) {
            logger.warn("Got request for item at index that didn't exist");
            return;
        }

        if ((items as any).getItem) {
            item = (items as any).getItem(args.index);
        } else {
            item = items[args.index];
        }

        this.updateViewWithProps(args.view, { item });
    }

    static register() {
        registerElement(
            "collectionview",
            () => new CollectionViewViewElement()
        );
    }
}
