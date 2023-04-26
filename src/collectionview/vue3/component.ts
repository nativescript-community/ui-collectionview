import { CollectionView as NSCollectionView } from '..';
import { ItemEventData, Observable, ObservableArray } from '@nativescript/core';
import { PropType, VNode, computed, defineComponent, getCurrentInstance, h, ref, toRaw, warn, watch } from 'nativescript-vue';

interface ListItem {
    [key: string]: any;
    index: number;
    even: boolean;
    odd: boolean;
}

interface ItemCellData {
    itemCtx: ListItem;
    slotName: string;
}

const LIST_CELL_ID = Symbol('list_cell_id');

function getItemCtx(item: any, index: number, itemAlias: string, indexAlias: string): ListItem {
    return {
        [itemAlias]: item,
        [indexAlias]: index,
        index,
        even: index % 2 === 0,
        odd: index % 2 !== 0
    };
}

export const CollectionView = defineComponent({
    props: {
        items: {
            type: Object as PropType<any[] | ObservableArray<any>>,
            required: true
        },
        alias: {
            type: String,
            default: 'item'
        },
        itemIdGenerator: {
            type: String,
            default: '$index'
        },
        itemTemplateSelector: Function
    },
    setup(props, ctx) {
        // const itemsCtx = computed(() => (props.items as []).map((item, index) => getItemCtx(item, index, props.alias, props.itemIdGenerator)));

        const itemTemplates = Object.keys(ctx.slots).map((slotName) => ({
            key: slotName,
            createView() {
                // no need to return anything here
            }
        }));

        const getSlotName = (itemCtx: ListItem, index: number, items: ListItem[]) => props.itemTemplateSelector?.(itemCtx, index, items) ?? 'default';

        const collectionView = ref<any & { nativeView: NSCollectionView }>(null);

        const vm = getCurrentInstance();

        watch(
            () => props.items,
            (oldVal, newVal) => {
                if (!(oldVal instanceof Observable)) {
                    collectionView.value.setAttribute('items', newVal);
                }
            }
        );

        let cellId = 0;
        const cells = ref<Record<string, ItemCellData>>({});

        function onItemLoading(event: any & ItemEventData) {
            const index = event.index;
            const id = event.view?.[LIST_CELL_ID] ?? `${cellId++}`;

            const itemCtx = getItemCtx(event.bindingContext, index, props.alias, props.itemIdGenerator);
            // const itemCtx: ListItem = getItemCtx(props.items instanceof ObservableArray ? props.items.getItem(index) : props.items[index], index, props.alias, props.itemIdGenerator);

            // update the cell data with the current row
            cells.value[id] = {
                itemCtx,
                slotName: getSlotName(itemCtx, index, event.object.items)
            };

            // trigger an update!
            vm?.update();

            // find the vnode rendering this cell
            const vnode = (vm?.subTree.children as VNode[]).find((vnode) => vnode.key === id);
            const cellEl = toRaw(vnode?.el?.nativeView);
            cellEl[LIST_CELL_ID] = id;

            if (event.view) {
                event.view._batchUpdate(() => {
                    event.view = cellEl;
                });
            } else {
                event.view = cellEl;
            }
        }

        // render all realized templates as children
        const cellVNODES = () =>
            Object.entries(cells.value).map(([id, entry]) => {
                const vnodes: VNode[] = ctx.slots[entry.slotName]?.(entry.itemCtx) ?? [
                    // default template is just a label
                    h('Label', {
                        text: entry.itemCtx[props.alias]
                    })
                ];

                if (vnodes.length > 1) {
                    warn(`ListView template must contain a single root element. Found: ${vnodes.length}. Only the first one will be used.`);
                }

                const vnode: VNode = vnodes[0];
                // set the key to the list cell id, so we can find this cell later...
                vnode.key = id;

                return vnode;
            });

        function scrollToIndex(index: number, animate = false) {
            (collectionView.value.nativeView as NSCollectionView).scrollToIndex(index, animate);
        }

        return () =>
            h(
                'NativeCollectionView',
                {
                    ref: collectionView,
                    items: props.items,
                    itemTemplates,
                    onItemLoading,
                    scrollToIndex
                },
                cellVNODES()
            );
    }
});
