<script lang="ts">
    import { ObservableArray, View } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import ResizeView from './ResizeView.svelte';

    let items = new ObservableArray([
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
    ]);

    async function resizeCell(item, event) {
        try {
            const actualItem = item;
                actualItem.showMenu = !actualItem.showMenu;
                console.log('resizeCell', actualItem.showMenu)
                async function animate(options = {}) {
                    const newHeight = actualItem.showMenu ? 200 : 100;
                    return (event.object as View).animate({ height: newHeight, ...options, duration: 300 });
                }

                const updateItem = () => {
                    if (item) {
                        const index = this.items.findIndex((i) => i === item);
                        // console.log('updateItem', index, item);
                        this.items.setItem(index, item);
                    }
                };
                await animate();
        } catch (error) {
            console.error(error);
        }
    }
</script>

<page>
    <actionBar title="Resize Cell" />
    <gridLayout rows="auto,*">
        <collectionView {items} row="1" autoReloadItemOnLayout={true}>
            <Template let:item>
                <!-- it is important to use a custom component
                the reason is that for this to work in collectionview
                upon resize animation the Svelte component needs to update its "height" property
                otherwise Collectionview bind will report wrong height on cell reuse -->
                <gridlayout id="resizeHolder" rows="101,100" on:tap={e=>resizeCell(item,e)} height={item.showMenu === true ? 200 : 100} verticalAlignment="top">
                    <stacklayout row="0" class="item" backgroundColor={item.color}>
                        <label row="1" text={item.name} class="title" />
                        <label row="1" text={item.color} class="subtitle" />
                    </stacklayout>
                    <stacklayout row="1" orientation="horizontal" height="100">
                        <label text="a" width="100" height="100%" backgroundColor="red" textAlignment="center" />
                        <label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
                    </stacklayout>
                </gridlayout>
            </Template>
        </collectionView>
    </gridLayout>
</page>

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
