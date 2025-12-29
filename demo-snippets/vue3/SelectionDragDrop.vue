<template>
    <Page>
        <ActionBar>
            <Label text="Selection + Drag/Drop" />
            <ActionItem v-if="selectionMode" @tap="exitSelectionMode" ios.systemIcon="3" ios.position="right" text="Clear" />
        </ActionBar>

        <GridLayout>
            <CollectionView
                ref="collectionView"
                :items="itemList"
                itemIdGenerator="color"
                rowHeight="100"
                reorderEnabled
                :reorderLongPressEnabled="false"
                @itemReorderStarting="onItemReorderStarting"
                @itemReordered="onItemReordered"
                @itemTap="onItemTap"
            >
                <template #default="{ item }">
                    <GridLayout
                        id="itemContainer"
                        rows="*, auto"
                        :backgroundColor="item.color"
                        :opacity="isSelected(item) ? 0.7 : 1"
                        @touch="onTouch(item, $event)"
                        @longPress="onLongPress(item, $event)"
                    >
                        <StackLayout row="1" class="item">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                            <Label v-if="isSelected(item)" text="✓ SELECTED" class="selected-indicator" />
                        </StackLayout>
                    </GridLayout>
                </template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script setup lang="ts">
import { ContentView, ObservableArray } from '@nativescript/core';
import { ref } from 'nativescript-vue';

const collectionView = ref();
const itemList = ref(
    new ObservableArray([
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
    ])
);

const selectedItems = ref([]);
const selectionMode = ref(false);
const longPressTimer = ref(null);
const dragStarted = ref(false);
const currentLongPressItem = ref(null);

function isSelected(item) {
    return selectedItems.value.some(selected => selected.color === item.color);
}

function toggleSelection(item) {
    const index = selectedItems.value.findIndex(selected => selected.color === item.color);
    if (index >= 0) {
        selectedItems.value.splice(index, 1);
    } else {
        selectedItems.value.push(item);
    }
    
    // Exit selection mode if no items are selected
    if (selectedItems.value.length === 0) {
        exitSelectionMode();
    }
}

function exitSelectionMode() {
    selectionMode.value = false;
    selectedItems.value = [];
}

function onItemTap({ item }) {
    if (selectionMode.value) {
        // In selection mode, tapping toggles selection
        toggleSelection(item);
    }
}

function onLongPress(item, event) {
    console.log('onLongPress', item.name);
    
    // Clear any existing timer
    if (longPressTimer.value) {
        clearTimeout(longPressTimer.value);
    }
    
    currentLongPressItem.value = item;
    dragStarted.value = false;
    
    // Wait a bit to see if drag starts
    longPressTimer.value = setTimeout(() => {
        if (!dragStarted.value && currentLongPressItem.value) {
            // No drag detected, start selection mode
            console.log('Starting selection mode for', item.name);
            selectionMode.value = true;
            toggleSelection(item);
        }
        currentLongPressItem.value = null;
    }, 200);
}

function onTouch(item, event) {
    if (event.action === 'move') {
        // If we're in a long press state and movement is detected, start dragging
        if (currentLongPressItem.value && !dragStarted.value) {
            console.log('Drag detected, starting drag mode for', item.name);
            dragStarted.value = true;
            
            // Clear the timer to prevent selection mode
            if (longPressTimer.value) {
                clearTimeout(longPressTimer.value);
                longPressTimer.value = null;
            }
            
            // Start drag mode
            const pointer = event.getActivePointers()[0];
            const index = itemList.value.indexOf(item);
            collectionView.value.$el.nativeView.startDragging(index, pointer);
            
            currentLongPressItem.value = null;
        }
    } else if (event.action === 'up' || event.action === 'cancel') {
        // Reset state on touch end
        if (longPressTimer.value) {
            clearTimeout(longPressTimer.value);
            longPressTimer.value = null;
        }
        dragStarted.value = false;
        currentLongPressItem.value = null;
    }
}

function onItemReordered(e) {
    console.log('onItemReordered', e.index);
    (e.view as ContentView).opacity = 1;
}

function onItemReorderStarting(e) {
    console.log('onItemReorderStarting', e.index);
    (e.view as ContentView).opacity = 0.7;
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
    .selected-indicator {
        font-size: 12;
        font-weight: bold;
        margin-top: 5;
    }
}
</style>
