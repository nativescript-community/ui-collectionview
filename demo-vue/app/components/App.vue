<template>
    <Page>
        <ActionBar>
            <Label text="Vue.js Demo" />
        </ActionBar>

        <GridLayout>
            <CollectionView
                automationText="collectionView"
                iosOverflowSafeArea="true"
                :items="items"
                @loaded="onLoaded"
                rowHeight="50"
            >
                <v-template>
                    <ListItem :rightValue="itemConnected(item)" :title="itemTitle(item)" :subtitle="itemSubtitle(item)" />
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { ObservableArray } from '@nativescript/core';
import { Component, Prop } from 'vue-property-decorator';

import Vue from 'nativescript-vue';
import ListItem from './ListItem.vue';

@Component({
    components: { ListItem }
})
export default class App extends Vue {
    items = new ObservableArray([
        { index: 0, name: 'TURQUOISE', color: '#1abc9c', subTitle: '', connected: true },
        { index: 1, name: 'EMERALD', color: '#2ecc71', subTitle: '', connected: false },
        { index: 2, name: 'PETER RIVER', color: '#3498db', subTitle: '', connected: true },
        { index: 3, name: 'AMETHYST', color: '#9b59b6', subTitle: '' , connected: false},
        { index: 4, name: 'WET ASPHALT', color: '#34495e', subTitle: '', connected: false }
        // { index: 5, name: 'GREEN SEA', color: '#16a085' },
        // { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
        // { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
        // { index: 8, name: 'WISTERIA', color: '#8e44ad' },
        // { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
        // { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
        // { index: 11, name: 'CARROT', color: '#e67e22' },
        // { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
        // { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
        // { index: 14, name: 'CONCRETE', color: '#95a5a6' },
        // { index: 15, name: 'ORANGE', color: '#f39c12' },
        // { index: 16, name: 'PUMPKIN', color: '#d35400' },
        // { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
        // { index: 18, name: 'SILVER', color: '#bdc3c7' },
        // { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
    ]);
    get itemTitle() {
        return item => item.name;
    }
    get itemSubtitle() {
        return item => item.subTitle || item.UUID;
    }
    get itemConnected() {
        return item => {
            console.log('itemConnected', item.index, item.connected);
            return (item.connected ? 'connected' : 'disconnected')
        };
    }
    onLoaded() {
        // start to stress timer
        setInterval(() => {
            const index = Math.round(Math.random() * 4);

            this.items.some((d, i) => {
                if (i === index) {
                    d.subTitle = Math.random().toFixed(2) + 'asdasdagƒ';
                    this.items.setItem(index, d);
                    return true;
                }
                return false;
            });
            // const item = this.items.getItem(index);
            // item.name = Math.random() + '';
            // this.items.setItem(index, item);
        }, 100);
    }
    onItemTap({ index, item }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
    }
    onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
    }
    logEvent(e) {
        console.log('logEvent', e.eventName, e.extraData);
    }
}
</script>

<style scoped lang="scss">
ActionBar {
    background-color: #42b883;
}

.item {
    padding: 10;
    color: white;

    .title {
        font-size: 17;
        font-weight: bold;
    }

    .subtitle {
        font-size: 14;
    }
}
</style>
