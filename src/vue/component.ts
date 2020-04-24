import { CollectionView } from '../collectionview';
import { Observable } from '@nativescript/core/data/observable';
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { View } from '@nativescript/core/ui/page/page';

function extend(to, _from): any {
    for (const key in _from) {
        to[key] = _from[key];
    }
    return to;
}

// Note: most of the code taken from nativescript-vue/platform/nativescript/runtime/components/list-view
// TODO: reuse code from list-view component instead of copying
const VUE_VIEW = '__vueVNodeRef__';
exports.default = {
    props: {
        items: {
            type: [Object, Array],
            validator: (val) => !val || Array.isArray(val) || val instanceof ObservableArray,
            required: true,
        },
        '+alias': {
            type: String,
            default: 'item',
        },
        '+index': {
            type: String,
        },
        itemTemplateSelector: {
            type: Function,
            default: undefined,
        },
    },
    template: `<NativeCollectionView ref="listView" :items="items" v-bind="$attrs" v-on="listeners" @itemTap="onItemTap" @itemLoading="onItemLoadingInternal"
  >
  <slot /></NativeCollectionView>`,

    watch: {
        items: {
            handler(newVal, oldVal) {
                if (!(oldVal instanceof Observable)) {
                    this.$refs.listView.setAttribute('items', newVal);
                    this.refresh();
                }
            },
            deep: true,
        },
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
            : (item, index, items) => {
                  const isSelected = false;
                  return this.$templates.selectorFn(this.getItemContext(item, index, isSelected));
              };
        listView.setAttribute('itemTemplateSelector', itemTemplateSelector);
    },
    methods: {
        getItem(index) {
            return (this.listView as CollectionView).getItemAtIndex(index);
        },
        onItemTap(args) {
            this.$emit('itemTap', extend({ item: this.getItem(args.index) }, args));
        },
        updateViewTemplate(args) {
            const listView = args.object as CollectionView;
            const index = args.index;
            const items = args.object.items;
            const currentItem = args.bindingContext;
            const name = (listView as any)._itemTemplateSelector(currentItem, index, items);
            // const isSelected = this.listView.nativeView.isItemSelected(currentItem);
            const isSelected = false;
            const context = this.getItemContext(currentItem, index, isSelected);
            const oldVnode = args.view && args.view[VUE_VIEW];
            if (args.view) {
                // reusing
                args.view._recursiveBatchUpdates(() => {
                    args.view = this.$templates.patchTemplate(name, context, oldVnode);
                });
            } else {
                args.view = this.$templates.patchTemplate(name, context, oldVnode);
            }
        },
        onItemLoadingInternal(args) {
            this.updateViewTemplate(args);
        },
        onItemSelected(args) {
            this.updateViewTemplate(args);
        },
        onItemDeselected(args) {
            this.updateViewTemplate(args);
        },
        refresh() {
            (this.listView as CollectionView).refresh();
        },
        scrollToIndex(index, animate = false) {
            (this.listView as CollectionView).scrollToIndex(index, animate);
        },
        // getSelectedItems() {
        //     return (this.listView as CollectionView).getSelectedItems();
        // }
    },
};
function getItemContext(item, index = -1, selected = false, alias = this.$props['+alias'], index_alias = this.$props['+index']) {
    return {
        [alias]: item,
        [index_alias || '$index']: index,
        $even: index % 2 === 0,
        $odd: index % 2 !== 0,
        $selected: selected,
    };
}
