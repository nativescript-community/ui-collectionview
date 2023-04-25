<template>
    <Page>
        <ActionBar>
            <Label text="Simple Templates" />
            <ActionItem @tap="switchLongPress"  :text="useLongPress ? 'Use Press' : 'Use Long Press'" />
        </ActionBar>

        <GridLayout>
            <CollectionView ref="collectionView" :items="itemList" itemIdGenerator="color" rowHeight="100" reorderEnabled
                @itemReorderStarting="onItemReorderStarting" @itemReordered="onItemReordered"
                :reorderLongPressEnabled="useLongPress">
                <template #default="{ item }">
                    <GridLayout id="test" rows="*, auto" :backgroundColor="item.color">
                        <StackLayout row="1" class="item" @touch="onTouch(item, $event)">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </StackLayout>
                    </GridLayout>
                </template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script setup lang="ts">
import { ObservableArray, ContentView } from '@nativescript/core';
import { ref } from "nativescript-vue"

const useLongPress = ref(false);
const collectionView = ref();
const itemList = ref(new ObservableArray([
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
]));

function onItemReordered(e) {   
    console.log('onItemReordered', e.index);
    (e.view as ContentView).content.opacity = 1;
}

function onItemReorderStarting(e) {
    console.log('onItemReorderStarting', e.index, e.view, (e.view as ContentView).content);
    (e.view as ContentView).content.opacity = 0.7;
}

function onTouch(item, event) {
    if (!this.useLongPress && event.action === 'down') {
        const pointer = event.getActivePointers()[0];
        collectionView.value.$el.nativeView.startDragging(itemList.value.indexOf(item), pointer);
    }
}

function switchLongPress() {
    useLongPress.value = !useLongPress.value;
}

</script>
