import { Observable } from '@nativescript/core/data/observable';
import { ObservableArray } from '@nativescript/core/data/observable-array';
function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key];
    }
    return to;
}
const VUE_VIEW = '__vueVNodeRef__';
export default {
    props: {
        items: {
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
                }
            },
            deep: true,
        },
    },
    created() {
        const listeners = Object.assign({}, this.$listeners);
        delete listeners.itemTap;
        this.listeners = listeners;
        this.getItemContext = getItemContext.bind(this);
    },
    mounted() {
        const listView = this.$refs.listView;
        this.listView = listView.nativeView;
        listView.setAttribute('itemTemplates', this.$templates.getKeyedTemplates());
        const itemTemplateSelector = this.itemTemplateSelector
            ? this.itemTemplateSelector
            : (item, index, items) => {
                return this.$templates.selectorFn(this.getItemContext(item, index));
            };
        listView.setAttribute('itemTemplateSelector', itemTemplateSelector);
    },
    methods: {
        getItem(index) {
            return this.listView.getItemAtIndex(index);
        },
        onItemTap(args) {
            this.$emit('itemTap', extend({ item: this.getItem(args.index) }, args));
        },
        updateViewTemplate(args) {
            const listView = args.object;
            const index = args.index;
            const items = args.object.items;
            const currentItem = args.bindingContext;
            const name = listView._itemTemplateSelector(currentItem, index, items);
            const context = this.getItemContext(currentItem, index);
            const oldVnode = args.view && args.view[VUE_VIEW];
            args.view = this.$templates.patchTemplate(name, context, oldVnode);
        },
        onItemLoadingInternal(args) {
            this.updateViewTemplate(args);
        },
        refresh() {
            this.listView.refresh();
        },
        scrollToIndex(index, animate = false) {
            this.listView.scrollToIndex(index, animate);
        },
    },
};
function getItemContext(item, index = -1, alias = this.$props['+alias'], index_alias = this.$props['+index']) {
    return {
        [alias]: item,
        [index_alias || '$index']: index,
        $even: index % 2 === 0,
        $odd: index % 2 !== 0,
    };
}
//# sourceMappingURL=component.js.map