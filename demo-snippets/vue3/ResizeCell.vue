<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" @tap="$navigateBack" />
            <Label text="All Sides" />
        </ActionBar>

        <GridLayout rows="auto,*">
            <CollectionView ref="collectionView" :items="itemList" row="1" :autoReloadItemOnLayout="true">
                <template #default="{ item }">
                    <GridLayout class="item" rows="101,100" @tap="resizeCell(item, $event)" :height="getItemHeight(item)"
                        :backgroundColor="item.color">
                        <Stacklayout row="0">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </Stacklayout>
                        <Stacklayout row="1" orientation="horizontal" height="100">
                            <Label :text="'a'" width="100" height="100%" backgroundColor="red" textAlignment="center" />
                            <Label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
                        </Stacklayout>
                    </GridLayout>
                </template>
            </CollectionView>

        </GridLayout>
    </Page>
</template>

//FIXME: Not work in ios
<script setup lang="ts">
import { ObservableArray, View } from '@nativescript/core';
import { ref } from "nativescript-vue"

const collectionView = ref();
const itemList = ref(new ObservableArray([
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
]));

function getItemHeight(item) {
    return item.showMenu === true ? 200 : 100
}

async function resizeCell(item, event) {
    try {
        const actualItem = item || this;
        actualItem.showMenu = !actualItem.showMenu;
        async function animate(options = {}) {
            const newHeight = actualItem.showMenu ? 200 : 100;
            return (event.object as View).animate({ height: newHeight, ...options, duration: 300 });
        }
        
        await animate();
    } catch (error) {
        console.error(error);
    }
}
</script>

