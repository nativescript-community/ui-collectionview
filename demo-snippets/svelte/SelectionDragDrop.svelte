<script lang="ts">
    import { ContentView, ObservableArray } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import { onMount } from 'svelte';

    let collectionView;
    const itemList = new ObservableArray([
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

    let selectedItems = [];
    let selectionMode = false;
    let longPressTimer = null;
    let dragStarted = false;
    let currentLongPressItem = null;

    function isSelected(item) {
        return selectedItems.some(selected => selected.color === item.color);
    }

    function toggleSelection(item) {
        const index = selectedItems.findIndex(selected => selected.color === item.color);
        if (index >= 0) {
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(item);
        }
        selectedItems = selectedItems; // Trigger reactivity
        
        // Exit selection mode if no items are selected
        if (selectedItems.length === 0) {
            exitSelectionMode();
        }
    }

    function exitSelectionMode() {
        selectionMode = false;
        selectedItems = [];
    }

    function onItemTap({ item }) {
        if (selectionMode) {
            // In selection mode, tapping toggles selection
            toggleSelection(item);
        }
    }

    function onLongPress(item, event) {
        console.log('onLongPress', item.name);
        
        // Clear any existing timer
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }
        
        currentLongPressItem = item;
        dragStarted = false;
        
        // Wait a bit to see if drag starts
        longPressTimer = setTimeout(() => {
            if (!dragStarted && currentLongPressItem) {
                // No drag detected, start selection mode
                console.log('Starting selection mode for', item.name);
                selectionMode = true;
                toggleSelection(item);
            }
            currentLongPressItem = null;
        }, 200);
    }

    function onTouch(item, event) {
        if (event.action === 'move') {
            // If we're in a long press state and movement is detected, start dragging
            if (currentLongPressItem && !dragStarted) {
                console.log('Drag detected, starting drag mode for', item.name);
                dragStarted = true;
                
                // Clear the timer to prevent selection mode
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                
                // Start drag mode
                const pointer = event.getActivePointers()[0];
                const index = itemList.indexOf(item);
                collectionView.startDragging(index, pointer);
                
                currentLongPressItem = null;
            }
        } else if (event.action === 'up' || event.action === 'cancel') {
            // Reset state on touch end
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            dragStarted = false;
            currentLongPressItem = null;
        }
    }

    function onItemReordered(e) {
        console.log('onItemReordered', e.index);
        (e.view as ContentView).content.opacity = 1;
    }

    function onItemReorderStarting(e) {
        console.log('onItemReorderStarting', e.index);
        (e.view as ContentView).content.opacity = 0.7;
    }
</script>

<page>
    <actionBar>
        <label text="Selection + Drag/Drop" />
        {#if selectionMode}
            <actionItem on:tap={exitSelectionMode} ios.systemIcon="3" ios.position="right" text="Clear" />
        {/if}
    </actionBar>

    <gridLayout>
        <collectionView
            bind:this={collectionView}
            items={itemList}
            itemIdGenerator="color"
            rowHeight="100"
            reorderEnabled={true}
            reorderLongPressEnabled={false}
            on:itemReorderStarting={onItemReorderStarting}
            on:itemReordered={onItemReordered}
            on:itemTap={onItemTap}
        >
            <Template let:item>
                <gridLayout
                    id="itemContainer"
                    rows="*, auto"
                    backgroundColor={item.color}
                    opacity={isSelected(item) ? 0.7 : 1}
                    on:touch={(event) => onTouch(item, event)}
                    on:longPress={(event) => onLongPress(item, event)}
                >
                    <stackLayout row="1" class="item">
                        <label row="1" text={item.name} class="title" />
                        <label row="1" text={item.color} class="subtitle" />
                        {#if isSelected(item)}
                            <label text="✓ SELECTED" class="selected-indicator" />
                        {/if}
                    </stackLayout>
                </gridLayout>
            </Template>
        </collectionView>
    </gridLayout>
</page>

<style>
    ActionBar {
        background-color: #ff3e00;
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
    .selected-indicator {
        font-size: 12;
        font-weight: bold;
        margin-top: 5;
    }
</style>
