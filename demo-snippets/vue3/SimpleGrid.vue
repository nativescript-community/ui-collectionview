<template>
    <Page>
        <ActionBar>
            <Label text="Simple Grid" />
            <ActionItem @tap="refresh" text="refresh" />
        </ActionBar>

        <GridLayout>
            <CollectionView :items="itemList" @loadMoreItems="onLoadMoreItems" colWidth="50%" rowHeight="200"
                @loaded="onCollectionViewLoaded">
                <template #default="{ item }">
                    <GridLayout id="scroller" rowSpan="2" rows="*, auto" :backgroundColor="item.color" class="item">
                        <StackLayout row="1">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </StackLayout>
                    </GridLayout>
                </template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts" setup>
import { Animation, CoreTypes, ObservableArray, Utils, View } from '@nativescript/core';
import { ref } from "nativescript-vue"

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
]))
function onViewBinded(e) {
    const view = e.object;
    const gestureData = view['gestureData'] || {};
    const trData = this.computeTranslationData(gestureData, 0);
    this.applyTrData(trData, { view: view.getViewById('scroller') });
}
function onCollectionViewLoaded(e) {
    // const view = e.object;
    // const manager = Manager.getInstance();
    // const gestureHandler = manager.createGestureHandler(HandlerType.NATIVE_VIEW, 12350, {
    // disallowInterruption:false
    // shouldStartGesture: this.shouldStartGesture.bind(this),
    // simultaneousHandlers: this.simultaneousHandlers,
    // waitFor: this.waitFor,
    // waitFor: [12351]
    // minDist: this.gestureMinDist
    // });
    // gestureHandler.attachToView(view);
    // view.nativeGestureHandler = gestureHandler as any;
}

function refresh() {
    itemList.value = new ObservableArray([
        { index: 0, name: 'EMERALD', color: '#2ecc71' },
        { index: 1, name: 'TURQUOISE', color: '#1abc9c' },
        { index: 2, name: 'PETER RIVER', color: '#3498db' },
        { index: 3, name: 'AMETHYST', color: '#9b59b6' },
        { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
        { index: 4, name: 'WET ASPHALT', color: '#34495e' },
        { index: 5, name: 'GREEN SEA', color: '#16a085' },
        { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
        { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
        { index: 8, name: 'WISTERIA', color: '#8e44ad' },
        { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
        { index: 11, name: 'CARROT', color: '#e67e22' },
        { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
        { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
        { index: 14, name: 'CONCRETE', color: '#95a5a6' },
        { index: 15, name: 'ORANGE', color: '#f39c12' },
        { index: 16, name: 'PUMPKIN', color: '#d35400' },
        { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
        { index: 18, name: 'SILVER', color: '#bdc3c7' },
        { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
    ]);
}
function onLoadMoreItems() {
    console.log('EVENT TRIGGERED: onLoadMoreItems()');
    itemList.value = itemList.value.concat([
        { index: 0, name: 'EMERALD', color: '#2ecc71' },
        { index: 1, name: 'TURQUOISE', color: '#1abc9c' },
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
}


</script>

<style>
ActionBar {
    background-color: #42b883;
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
