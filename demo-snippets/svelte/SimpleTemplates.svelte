<style>
    ActionBar {
        background-color: #ed3e04;
        color: white;
    }
    .item {
        padding: 10;
        color: white;
    }
    .title {
        font-size: 17;
        font-weight: bold;
    }
    .subtitle {
        font-size: 14;
    }
</style>

<script lang="ts">
    import { ObservableArray } from '@nativescript/core';

    import { Template } from '@nativescript-community/svelte-native/components';

    const items = new ObservableArray([
        { type: 'heading', name: 'Heading #1', color: '#bdc3c7' },
        { type: 'item', name: 'TURQUOISE', color: '#1abc9c' },
        { type: 'item', name: 'EMERALD', color: '#2ecc71' },
        { type: 'item', name: 'PETER RIVER', color: '#3498db' },
        { type: 'item', name: 'AMETHYST', color: '#9b59b6' },
        { type: 'heading', name: 'Heading #2', color: '#34495e' },
        { type: 'item', name: 'GREEN SEA', color: '#16a085' },
        { type: 'item', name: 'NEPHRITIS', color: '#27ae60' },
        { type: 'item', name: 'BELIZE HOLE', color: '#2980b9' },
        { type: 'item', name: 'ASBESTOS', color: '#7f8c8d' },
        { type: 'heading', name: 'Heading #3', color: '#8e44ad' },
        { type: 'item', name: 'MIDNIGHT BLUE', color: '#2c3e50' },
        { type: 'item', name: 'SUN FLOWER', color: '#f1c40f' },
        { type: 'item', name: 'CARROT', color: '#e67e22' },
        { type: 'item', name: 'POMEGRANATE', color: '#c0392b' },
        { type: 'heading', name: 'Heading #4', color: '#e74c3c' },
        { type: 'item', name: 'CLOUDS', color: '#ecf0f1' },
        { type: 'item', name: 'CONCRETE', color: '#95a5a6' },
        { type: 'item', name: 'ORANGE', color: '#f39c12' },
        { type: 'item', name: 'PUMPKIN', color: '#d35400' }
    ]);

    function onItemTap({ index, item }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
    }
    function onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
    }

    function templateSelector(item: any, _index: number, _items: any[]): string {
        return item.type;
    }

    function spanSizeSelector(item: any, _index: number): number {
        if (item.type === 'heading') return 2;
        return 1;
    }
</script>

<page>
    <actionBar title="Simple Templates" />
    <gridLayout>
        <collectionView colWidth="50%" itemTemplateSelector={templateSelector} {items} spanSize={spanSizeSelector} on:itemTap={onItemTap} on:loadMoreItems={onLoadMoreItems}>
            <Template key="item" let:item>
                <gridlayout backgroundColor={item.color} rows="*, auto">
                    <stacklayout class="item" height="200" row="1">
                        <label class="title" row="1" text={item.name} />
                        <label class="subtitle" row="1" text={item.color} />
                    </stacklayout>
                </gridlayout>
            </Template>
            <Template key="heading" let:item>
                <gridlayout backgroundColor={item.color} padding="25" rows="*, auto" verticalAlignment="middle">
                    <label color="white" fontSize="20" fontWeight="bold" text={item.name} textTransform="uppercase" />
                </gridlayout>
            </Template>
        </collectionView>
    </gridLayout>
</page>
