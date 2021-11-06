<script lang="typescript">
    import { Template } from 'svelte-native/components';
    const items = [
            { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
            { index: 1, name: 'EMERALD', color: '#2ecc71' },
            { index: 2, name: 'PETER RIVER', color: '#3498db' },
            { index: 3, name: 'AMETHYST', color: '#9b59b6' },
            { index: 4, name: 'WET ASPHALT', color: '#34495e' },
            { index: 5, name: 'GREEN SEA', color: '#16a085' },
            { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
            { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
            { index: 8, name: 'WISTERIA', color: '#8e44ad' },
            { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
            { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
            { index: 11, name: 'CARROT', color: '#e67e22' },
            { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
            { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
            { index: 14, name: 'CONCRETE', color: '#95a5a6' },
            { index: 15, name: 'ORANGE', color: '#f39c12' },
            { index: 16, name: 'PUMPKIN', color: '#d35400' },
            { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
            { index: 18, name: 'SILVER', color: '#bdc3c7' },
            { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
        ];
    
    function onItemTap({ index, item }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
    }
    function onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
    }
    function randomHeight(color) {
        if (parseInt(color.substr(1), 16) % 2 === 0) {
            return 200;
        }
        return 150;
    }
</script>

<page>
    <actionBar title="Simple Grid" />
    <gridLayout>
        <collectionView 
            {items} 
            iosOverflowSafeArea="true"
            colWidth="50%"
            on:itemTap="{onItemTap}"
            on:loadMoreItems="{onLoadMoreItems}"
            layoutStyle="waterfall"
        >
            <Template let:item>
                <gridlayout height="{randomHeight(item.color)}" rows="*, auto" backgroundColor="{item.color}" class="item">
                    <stacklayout row="1">
                        <label row="1" text="{item.name}" class="title" />
                        <label row="1" text="{item.color}" class="subtitle" />
                    </stacklayout>
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