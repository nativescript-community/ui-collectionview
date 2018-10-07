import { CollectionView } from '../collectionview';

// Note: most of the code taken from nativescript-vue/platform/nativescript/runtime/components/list-view
// TODO: reuse code from list-view component instead of copying
const VUE_VIEW = '__vueVNodeRef__';
exports.default = {
    props: {
        items: {
            type: [Array, Object],
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
    template: `<NativeCollectionView ref="listView" :items="items" v-bind="$attrs" v-on="listeners" @itemTap="onItemTap" @itemLoading="onItemLoading"
  >
  <slot /></NativeCollectionView>`,
    // computed: {
    //   scrollDirection: function() {
    //     return this.orientation !== "vertical" ? "Horizontal" : "Vertical";
    //   }
    // },
    watch: {
        items: {
            handler(newVal) {
                // console.log("items changed", newVal);
                this.$refs.listView.setAttribute('items', newVal);
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
    },
    mounted() {
        const _this = this;
        const listView: any & { nativeView: CollectionView } = (this.listView = this.$refs.listView);
        this.getItemContext = function(item, index) {
            return getItemContext(item, index, _this.$props['+alias'], _this.$props['+index']);
        };
        listView.setAttribute('items', this.items);
        const templates = this.$templates.getKeyedTemplates();
        listView.setAttribute('itemTemplates', templates);
        // (listView.nativeView as CollectionView).onItemTemplatesPropertyChanged(null, templates);

        const itemTemplateSelector = this.itemTemplateSelector
            ? this.itemTemplateSelector // custom template selector if any
            : function(item, index, items) {
                return _this.$templates.selectorFn(_this.getItemContext(item, index));
            };
        this.listView.setAttribute('itemTemplateSelector', itemTemplateSelector);
        // this.listView.setAttribute('itemViewLoader', function (itemType) {
        //     // TODO: add other itemTypes
        //     switch (itemType) {
        //         case 'headerview':
        //             if (~availableTemplates.indexOf('header')) {
        //                 return _this.$templates.patchTemplate('header', _this.$parent);
        //             }
        //             break;
        //         case 'footerview':
        //             if (~availableTemplates.indexOf('footer')) {
        //                 return _this.$templates.patchTemplate('footer', _this.$parent);
        //             }
        //             break;
        //         case 'ItemSwipeView':
        //             if (~availableTemplates.indexOf('itemswipe')) {
        //                 return _this.$templates.patchTemplate('itemswipe', _this.$parent);
        //             }
        //             break;
        //     }
        // });
    },
    methods: {
        onItemTap(args) {
            this.$emit('itemTap', Object.assign({ item: this.items[args.index] }, args));
        },
        onItemLoading(args) {
            const index = args.index;
            const items = args.object.items;
            const currentItem = typeof items.getItem === 'function' ? items.getItem(index) : items[index];
            const name = args.object.itemTemplateSelector(currentItem, index, items);
            const context = this.getItemContext(currentItem, index);
            const oldVnode = args.view && args.view[VUE_VIEW];
            args.view = this.$templates.patchTemplate(name, context, oldVnode);
        },
        refresh() {
            this.listView.nativeView.refresh();
        },
        scrollToIndex(index, animate = false, snapMode = 0) {
            this.listView.nativeView.scrollToIndex(index, animate, snapMode);
        },
        getSelectedItems() {
            return this.listView.nativeView.getSelectedItems();
        }
    }
};
function getItemContext(item, index, alias, index_alias) {
    let _a;
    return (_a = {}), (_a[alias] = item), (_a[index_alias || '$index'] = index), (_a.$even = index % 2 === 0), (_a.$odd = index % 2 !== 0), _a;
}
