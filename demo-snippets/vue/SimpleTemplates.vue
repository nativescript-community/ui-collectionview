<template>
    <Page>
        <ActionBar>
            <Label text="Simple Templates" />
        </ActionBar>

        <GridLayout>
            <CollectionView
                iosOverflowSafeArea="true"
                :items="itemList"
                :spanSize="spanSizeSelector"
                @itemTap="onItemTap"
                @loadMoreItems="onLoadMoreItems"
                @itemLoadingEvent="onItemLoadingEvent"
                itemIdGenerator="color"
                colWidth="50%"
            >
                <v-template name="item" if="item.type === 'item'">
                    <GridLayout id="test" rows="*, auto" :backgroundColor="item.color">
                        <StackLayout row="1" height="200" class="item">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </StackLayout>
                    </GridLayout>
                </v-template>
                <v-template name="heading" if="item.type === 'heading'">
                    <GridLayout id="test" rows="*, auto" :backgroundColor="item.color" verticalAlignment="middle" padding="25">
                        <Label :text="item.name" textTransform="uppercase" color="white" fontSize="20" fontWeight="bold"></Label>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script>
import { ObservableArray } from '@nativescript/core';
export default {
    data() {
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
        return {
            itemList: items
        };
    },
    methods: {
        onItemTap({ index, item }) {
            console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
        },
        onLoadMoreItems() {
            console.log('EVENT TRIGGERED: onLoadMoreItems()');
        },
        logEvent(e) {
            console.log('logEvent', e.eventName, e.extraData);
        },
        templateSelector(item, _index, _items) {
            return item.type;
        },
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