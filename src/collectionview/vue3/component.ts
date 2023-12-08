import { CollectionView as NSCollectionView } from '..';
import { ItemEventData, Observable, ObservableArray } from '@nativescript/core';
import { ELEMENT_REF, NSVElement, NSVRoot, PropType, VNode, computed, defineComponent, getCurrentInstance, h, ref, render, toRaw, warn, watch } from 'nativescript-vue';

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
const LIST_CELL_CONTAINER = Symbol('list_cell_container');

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
            const item = defineComponent(event.bindingContext, vm);

            const itemCtx = getItemCtx(item, index, props.alias, props.itemIdGenerator);
            // const itemCtx: ListItem = getItemCtx(props.items instanceof ObservableArray ? props.items.getItem(index) : props.items[index], index, props.alias, props.itemIdGenerator);

            // update the cell data with the current row
            const slotName = getSlotName(itemCtx, index, event.object.items);
            cells.value[id] = {
                itemCtx,
                slotName
            };

            // trigger an update!
            // vm?.update();

            // find the vnode rendering this cell
            const container = event.view?.[LIST_CELL_CONTAINER] ?? new NSVRoot();
            const vnode = ctx.slots[slotName]?.(itemCtx)[0];

            if (event.view) {
                event.view._batchUpdate(() => {
                    // todo: handle the case where the slot is not found
                    render(vnode, container);
                });
            } else {
                // todo: handle the case where the slot is not found
                render(vnode, container);
            }

            const cellEl = toRaw(vnode?.el?.nativeView);
            cellEl[LIST_CELL_ID] = id;
            cellEl[LIST_CELL_CONTAINER] = container;
            event.view = cellEl;
        }

        // render all realized templates as children
        // const cellVNODES = () =>
        //     Object.entries(cells.value).map(([id, entry]) => {
        //         const vnodes: VNode[] = ctx.slots[entry.slotName]?.(entry.itemCtx) ?? [
        //             // default template is just a label
        //             h('Label', {
        //                 text: entry.itemCtx[props.alias]
        //             })
        //         ];

        //         if (vnodes.length > 1) {
        //             warn(`ListView template must contain a single root element. Found: ${vnodes.length}. Only the first one will be used.`);
        //         }

        //         const vnode: VNode = vnodes[0];
        //         // set the key to the list cell id, so we can find this cell later...
        //         vnode.key = id;

        //         return vnode;
        //     });

        return () =>
            h('NativeCollectionView', {
                ref: collectionView,
                items: props.items,
                itemTemplates,
                onItemLoading
            });
    }
});
