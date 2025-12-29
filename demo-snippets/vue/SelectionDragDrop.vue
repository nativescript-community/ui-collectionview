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
                <v-template>
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
            selectedItems: [],
            selectionMode: false,
            longPressTimer: null,
            dragStarted: false,
            currentLongPressItem: null
        };
    },
    methods: {
        isSelected(item) {
            return this.selectedItems.some(selected => selected.color === item.color);
        },
        toggleSelection(item) {
            const index = this.selectedItems.findIndex(selected => selected.color === item.color);
            if (index >= 0) {
                this.selectedItems.splice(index, 1);
            } else {
                this.selectedItems.push(item);
            }
            
            // Exit selection mode if no items are selected
            if (this.selectedItems.length === 0) {
                this.exitSelectionMode();
            }
        },
        exitSelectionMode() {
            this.selectionMode = false;
            this.selectedItems = [];
        },
        onItemTap({ item }) {
            if (this.selectionMode) {
                // In selection mode, tapping toggles selection
                this.toggleSelection(item);
            }
        },
        onLongPress(item, event) {
            console.log('onLongPress', item.name);
            
            // Clear any existing timer
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
            }
            
            this.currentLongPressItem = item;
            this.dragStarted = false;
            
            // Wait a bit to see if drag starts
            this.longPressTimer = setTimeout(() => {
                if (!this.dragStarted && this.currentLongPressItem) {
                    // No drag detected, start selection mode
                    console.log('Starting selection mode for', item.name);
                    this.selectionMode = true;
                    this.toggleSelection(item);
                }
                this.currentLongPressItem = null;
            }, 200);
        },
        onTouch(item, event) {
            if (event.action === 'move') {
                // If we're in a long press state and movement is detected, start dragging
                if (this.currentLongPressItem && !this.dragStarted) {
                    console.log('Drag detected, starting drag mode for', item.name);
                    this.dragStarted = true;
                    
                    // Clear the timer to prevent selection mode
                    if (this.longPressTimer) {
                        clearTimeout(this.longPressTimer);
                        this.longPressTimer = null;
                    }
                    
                    // Start drag mode
                    const pointer = event.getActivePointers()[0];
                    const index = this.itemList.indexOf(item);
                    this.$refs.collectionView.nativeView.startDragging(index, pointer);
                    
                    this.currentLongPressItem = null;
                }
            } else if (event.action === 'up' || event.action === 'cancel') {
                // Reset state on touch end
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                this.dragStarted = false;
                this.currentLongPressItem = null;
            }
        },
        onItemReordered(e) {
            console.log('onItemReordered', e.index);
            (e.view as ContentView).content.opacity = 1;
        },
        onItemReorderStarting(e) {
            console.log('onItemReorderStarting', e.index);
            (e.view as ContentView).content.opacity = 0.7;
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
    .selected-indicator {
        font-size: 12;
        font-weight: bold;
        margin-top: 5;
    }
}
</style>
