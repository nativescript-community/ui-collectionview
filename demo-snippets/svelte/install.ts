import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import {CollectionViewTraceCategory} from '@nativescript-community/ui-collectionview';
import install from '@nativescript-community/ui-collectionview-waterfall';
import SwipeMenuElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
import {Trace} from '@nativescript/core';

import SimpleGrid from './SimpleGrid.svelte';
import HorizontalGrid from './HorizontalGrid.svelte';
import SimpleWaterfall from './SimpleWaterfall.svelte';
import SimpleTemplates from './SimpleTemplates.svelte';
import SwipeMenu from './SwipeMenu.svelte';
import ResizeCell from './ResizeCell.svelte';

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
    { name: 'ResizeCell', path: 'resize-cell', component: ResizeCell }
];

// Trace.addCategories(CollectionViewTraceCategory)
// Trace.enable()