import { Observable } from '@nativescript/core/data/observable';
import { ObservableArray } from '@nativescript/core/data/observable-array';
import { CollectionView } from '..';

const VUE_VIEW = '__vueVNodeRef__';
export default {
    props: {
        items: {
            validator: (val) => !val || Array.isArray(val) || val instanceof ObservableArray,
            required: true
        },
        '+alias': {
            type: String,
            default: 'item'
        },
        '+index': {
            type: String
        },
        itemTemplateSelector: {
            type: Function,
            default: undefined
        }
    },
    template: `<NativeCollectionView ref="listView" :items="items" v-bind="$attrs" v-on="listeners" @itemTap="onItemTap" @itemLoading="onItemLoadingInternal" @itemDisposing="onItemDisposingInternal"
  >
  <slot /></NativeCollectionView>`,
    watch: {
        items: {
            handler(newVal, oldVal) {
                if (!(oldVal instanceof Observable)) {
                    this.$refs.listView.setAttribute('items', newVal);
                }
            },
            deep: true
        }
    },
    created() {
        // we need to remove the itemTap handler from a clone of the $listeners
        // object because we are emitting the event ourselves with added data.
        const listeners = Object.assign({}, this.$listeners);
        delete listeners.itemTap;
        this.listeners = listeners;
        this.getItemContext = getItemContext.bind(this);
    },
    mounted() {
        const listView: any & { nativeView: CollectionView } = this.$refs.listView;
        this.listView = listView.nativeView;
        listView.setAttribute('itemTemplates', this.$templates.getKeyedTemplates());

        const itemTemplateSelector = this.itemTemplateSelector
            ? this.itemTemplateSelector // custom template selector if any
            : (item, index, items) => this.$templates.selectorFn(this.getItemContext(item, index));
        listView.setAttribute('itemTemplateSelector', itemTemplateSelector);
    },
    methods: {
        getItem(index) {
            return (this.listView as CollectionView).getItemAtIndex(index);
        },
        onItemTap(args) {
            this.$emit('itemTap', { item: this.getItem(args.index), ...args });
        },
        updateViewTemplate(args) {
            const listView = args.object as CollectionView;
            const index = args.index;
            const items = args.object.items;
            const currentItem = args.bindingContext;
            const name = (listView as any)._itemTemplateSelector(currentItem, index, items);
            const context = this.getItemContext(currentItem, index);
            const oldVnode = args.view && args.view[VUE_VIEW];
            if (args.view) {
                args.view._batchUpdate(() => {
                    args.view = this.$templates.patchTemplate(name, context, oldVnode);
                });
            } else {
                args.view = this.$templates.patchTemplate(name, context, oldVnode);
            }
        },
        onItemLoadingInternal(args) {
            console.log('onItemLoadingInternal');
            this.updateViewTemplate(args);
        },
        onItemDisposingInternal(args) {
            console.log('onItemDisposingInternal');
            const oldVnode = args.view && args.view[VUE_VIEW];
            if (oldVnode) {
                oldVnode.$destroy();
                args.view[VUE_VIEW] = null;
            }
        },
        refresh() {
            (this.listView as CollectionView).refresh();
        },
        scrollToIndex(index, animate = false) {
            (this.listView as CollectionView).scrollToIndex(index, animate);
        }
        // getSelectedItems() {
        //     return (this.listView as CollectionView).getSelectedItems();
        // }
    }
};
function getItemContext(item, index = -1, alias = this.$props['+alias'], index_alias = this.$props['+index']) {
    return {
        [alias]: item,
        [index_alias || '$index']: index,
        $even: index % 2 === 0,
        $odd: index % 2 !== 0
    };
}
