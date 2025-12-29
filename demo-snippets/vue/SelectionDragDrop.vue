<!--
    Selection + Drag/Drop Demo
    
    This demo demonstrates how to mix selection mode (using long press) with drag-and-drop
    functionality without using reorderLongPressEnabled property.
    
    Features:
    - Long press on an item waits briefly to detect if a drag gesture starts
    - If no drag movement is detected within 200ms → starts selection mode
    - If drag movement is detected → starts CollectionView drag/reorder mode
    - In selection mode, tapping items toggles their selection
    - Exiting selection mode when no items are selected
    - Visual feedback with opacity changes for selected items
    
    Implementation approach:
    - Uses @longPress event to detect initial long press
    - Uses @pan event to detect drag movement (more efficient than @touch)
    - Pan events are only processed when a long press is active
    - Uses a timer to wait for drag movement after long press
    - Manually calls startDragging() to initiate CollectionView reorder
    - Maintains state for selectedItems, selectionMode, and drag tracking
-->
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
                        @longPress="onLongPress(item, $event)"
                        @pan="onPan(item, $event)"
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
            console.log('onLongPress detected for', item.name);
            
            // Clear any existing timer
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
            }
            
            this.currentLongPressItem = item;
            this.dragStarted = false;
            
            // Wait a bit (200ms) to see if drag movement starts
            // This implements the logic: "if longpress is detected wait a bit"
            this.longPressTimer = setTimeout(() => {
                if (!this.dragStarted && this.currentLongPressItem) {
                    // No drag detected, start selection mode
                    // This implements: "if no drag => start selection"
                    console.log('No drag detected - starting selection mode for', item.name);
                    this.selectionMode = true;
                    this.toggleSelection(item);
                }
                this.currentLongPressItem = null;
            }, 200);
        },
        onPan(item, event) {
            // Only process pan events if we're tracking a long press
            if (!this.currentLongPressItem) {
                return;
            }
            
            // If we detect panning movement during long press, start dragging
            // This implements: "if drag was started => start collection view drag mode"
            if (event.state === 1 && !this.dragStarted) { // State 1 is panning
                console.log('Pan movement detected - starting drag mode for', item.name);
                this.dragStarted = true;
                
                // Clear the timer to prevent selection mode from starting
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                
                // Start collection view drag/reorder mode
                // Get the touch point from the pan gesture
                const pointer = { 
                    getX: () => event.ios ? event.ios.locationInView(null).x : event.android.getX(),
                    getY: () => event.ios ? event.ios.locationInView(null).y : event.android.getY(),
                    id: 0
                };
                const index = this.itemList.indexOf(item);
                this.$refs.collectionView.nativeView.startDragging(index, pointer);
                
                this.currentLongPressItem = null;
            } else if (event.state === 2 || event.state === 3) { // State 2/3 is ended/cancelled
                // Reset state on pan end
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
