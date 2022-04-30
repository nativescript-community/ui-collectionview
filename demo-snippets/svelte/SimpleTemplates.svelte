<script lang="typescript">
import { ObservableArray } from '@nativescript/core';

    import { Template } from 'svelte-native/components';

    const items = new ObservableArray([
        { type: 'heading', name: 'Heading #1', color: '#bdc3c7'},
        { type: 'item', name: 'TURQUOISE', color: '#1abc9c' },
        { type: 'item', name: 'EMERALD', color: '#2ecc71' },
        { type: 'item', name: 'PETER RIVER', color: '#3498db' },
        { type: 'item', name: 'AMETHYST', color: '#9b59b6' },
        { type: 'heading', name: 'Heading #2', color: '#34495e'},
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
        { type: 'item', name: 'PUMPKIN', color: '#d35400' },
    ]);
    
    function onItemTap({ index, item }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
    }
    function onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
    }

    function templateSelector(
        item: any,
        _index: number,
        _items: any[]
    ): string {
        return item.type;
    }

    function spanSizeSelector(item: any, _index: number): number {
        if (item.type === "heading") return 2;
        return 1;
    }
</script>

<page>
    <actionBar title="Simple Templates" />
    <gridLayout>
        <collectionView 
            {items} 
            itemTemplateSelector={templateSelector}
            spanSize={spanSizeSelector}
            
            colWidth="50%"
            on:itemTap="{onItemTap}"
            on:loadMoreItems="{onLoadMoreItems}"
        >
            <Template let:item key="item">
                <gridlayout rows="*, auto" backgroundColor="{item.color}">
                    <stacklayout row="1" class="item" height="200">
                        <label row="1" text="{item.name}" class="title" />
                        <label row="1" text="{item.color}" class="subtitle" />
                    </stacklayout>
                </gridlayout>
            </Template>
            <Template let:item key="heading">
                <gridlayout rows="*, auto" backgroundColor="{item.color}" verticalAlignment="middle" padding="25">
                    <label text="{item.name}" textTransform="uppercase" color="white" fontSize="20" fontWeight="bold" />
                </gridlayout>
            </Template>
        </collectionView>
    </gridLayout>
</page>

<style>
    ActionBar {
        background-color:#ed3e04;
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