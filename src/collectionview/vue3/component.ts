
import { CollectionView as NSCollectionView } from '..';
import { ItemEventData, Observable, ObservableArray } from '@nativescript/core';
import { NSVRoot, PropType, VNode, defineComponent, getCurrentInstance, AppContext, h, ref, render, toRaw, watch } from 'nativescript-vue';

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

function propagateAppContext(vnode: VNode, appContext?: AppContext) {
    if (!vnode || !appContext) return;

    vnode.appContext = appContext;
    if (Array.isArray(vnode.children)) {
        vnode.children.forEach((child) => propagateAppContext(child as VNode, appContext));
    }
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

        const getSlotName = (item: any, index: number, items: ListItem[]) => props.itemTemplateSelector?.(item, index, items) ?? 'default';

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
            const item = defineComponent(event.bindingContext);

            const itemCtx = getItemCtx(item, index, props.alias, props.itemIdGenerator);
            // const itemCtx: ListItem = getItemCtx(props.items instanceof ObservableArray ? props.items.getItem(index) : props.items[index], index, props.alias, props.itemIdGenerator);

            // update the cell data with the current row
            const slotName = getSlotName(item, index, event.object.items);
            cells.value[id] = {
                itemCtx,
                slotName
            };

            // trigger an update!
            // vm?.update();

            // find the vnode rendering this cell
            const container = event.view?.[LIST_CELL_CONTAINER] ?? new NSVRoot();
            const vnode = ctx.slots[slotName]?.(itemCtx)[0] as VNode;
            propagateAppContext(vnode, vm?.appContext);

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

        return () =>
            h('NativeCollectionView', {
                ref: collectionView,
                items: props.items,
                itemTemplates,
                onItemLoading,
                itemTemplateSelector: (item: any, index: number, items: ListItem[]) => getSlotName(item, index, items)
            });
    }
});
