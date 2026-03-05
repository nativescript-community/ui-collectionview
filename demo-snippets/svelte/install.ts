import SwipeMenuElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
import install from '@nativescript-community/ui-collectionview-waterfall';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';

import HorizontalGrid from './HorizontalGrid.svelte';
import ResizeCell from './ResizeCell.svelte';
import SimpleGrid from './SimpleGrid.svelte';
import SimpleTemplates from './SimpleTemplates.svelte';
import SimpleWaterfall from './SimpleWaterfall.svelte';
import SwipeMenu from './SwipeMenu.svelte';
import SelectionDragDrop from './SelectionDragDrop.svelte';

export function installPlugin() {
    CollectionViewElement.register();
    SwipeMenuElement.register();
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall },
    { name: 'Simple Templates', path: 'simple-templates', component: SimpleTemplates },
    { name: 'SwipeMenu', path: 'swipe-menu', component: SwipeMenu },
    { name: 'ResizeCell', path: 'resize-cell', component: ResizeCell },
    { name: 'Selection + Drag/Drop', path: 'selection-dragdrop', component: SelectionDragDrop }
];

// Trace.addCategories(CollectionViewTraceCategory)
// Trace.enable()
