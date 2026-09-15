import { CollectionView as NSCollectionView } from '..';
import { ItemEventData, Observable, ObservableArray } from '@nativescript/core';
import { ItemContext, PropType, createItemContext, defineComponent, h, ref, useItemTemplates, watch } from 'nativescript-vue';

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
        const getSlotName = (item: any, index: number, items: any) => props.itemTemplateSelector?.(item, index, items) ?? 'default';

        const { itemTemplates, renderCell, disposeCell, cellVNodes } = useItemTemplates<ItemContext>({
            slots: ctx.slots,
            selectTemplate: (itemCtx) => getSlotName(itemCtx[props.alias], itemCtx.index, props.items),
            componentName: 'CollectionView'
        });

        const collectionView = ref<any & { nativeView: NSCollectionView }>(null);

        watch(
            () => props.items,
            (oldVal, newVal) => {
                if (!(oldVal instanceof Observable)) {
                    collectionView.value.setAttribute('items', newVal);
                }
            }
        );

        function onItemLoading(event: ItemEventData & { bindingContext: any }) {
            const itemCtx = createItemContext(event.bindingContext, event.index, { alias: props.alias, indexAlias: props.itemIdGenerator });
            const render = () => renderCell(itemCtx, event.view);
            event.view = event.view ? event.view._batchUpdate(render) : render();
        }

        function onItemDisposing(event: ItemEventData) {
            disposeCell(event.view);
        }

        return () =>
            h(
                'NativeCollectionView',
                {
                    ref: collectionView,
                    items: props.items,
                    itemTemplates,
                    itemTemplateSelector: getSlotName,
                    onItemLoading,
                    onItemDisposing
                },
                cellVNodes()
            );
    }
});
