<template>
    <Page>
        <ActionBar>
            <Label text="Simple Templates" />
            <ActionItem @tap="switchLongPress" ios.systemIcon="16" ios.position="right" text="refresh" />
        </ActionBar>

        <GridLayout>
            <CollectionView ref="collectionView" :items="itemList" itemIdGenerator="color" rowHeight="100" reorderEnabled @itemReorderStarting="onItemReorderStarting" @itemReordered="onItemReordered" :reorderLongPressEnabled="useLongPress">
                <v-template>
                    <GridLayout id="test" rows="*, auto" :backgroundColor="item.color">
                        <StackLayout row="1" class="item" @touch="onTouch(item, $event)">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </StackLayout>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { ContentView, ObservableArray } from '@nativescript/core';
export default {
    data() {
        const items = new ObservableArray([
            { type: 'item', name: 'TURQUOISE', color: '#1abc9c' },
            { type: 'item', name: 'EMERALD', color: '#2ecc71' },
            { type: 'item', name: 'PETER RIVER', color: '#3498db' },
            { type: 'item', name: 'AMETHYST', color: '#9b59b6' },
            { type: 'item', name: 'GREEN SEA', color: '#16a085' },
            { type: 'item', name: 'NEPHRITIS', color: '#27ae60' },
            { type: 'item', name: 'BELIZE HOLE', color: '#2980b9' },
            { type: 'item', name: 'ASBESTOS', color: '#7f8c8d' },
            { type: 'item', name: 'MIDNIGHT BLUE', color: '#2c3e50' },
            { type: 'item', name: 'SUN FLOWER', color: '#f1c40f' },
            { type: 'item', name: 'CARROT', color: '#e67e22' },
            { type: 'item', name: 'POMEGRANATE', color: '#c0392b' },
            { type: 'item', name: 'CLOUDS', color: '#ecf0f1' },
            { type: 'item', name: 'CONCRETE', color: '#95a5a6' },
            { type: 'item', name: 'ORANGE', color: '#f39c12' },
            { type: 'item', name: 'PUMPKIN', color: '#d35400' }
        ]);
        return {
            itemList: items,
            useLongPress:false
        };
    },
    methods: {
        logEvent(e) {
            console.log('logEvent', e.eventName, e.extraData);
        },
        onItemReordered(e) {
            console.log('onItemReordered', e.index);
            (e.view as ContentView).content.opacity=1;

        },
        onItemReorderStarting(e) {
            console.log('onItemReorderStarting', e.index, e.view, (e.view as ContentView).content);
            (e.view as ContentView).content.opacity=0.7;

        },
        onTouch(item, event) {
            if (!this.useLongPress && event.action === 'down') {
                const pointer = event.getActivePointers()[0];
                this.$refs.collectionView.nativeView.startDragging(this.itemList.indexOf(item), pointer);
            }
        },
        switchLongPress() {
            this.useLongPress = !this.useLongPress;
        }
    }
};
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
