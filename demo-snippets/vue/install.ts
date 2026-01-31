import Vue from 'nativescript-vue';
import { Trace } from '@nativescript/core';

import CollectionView from '@nativescript-community/ui-collectionview/vue';
import SwipeMenuPlugin from '@nativescript-community/ui-collectionview-swipemenu/vue';
import installWaterfall from '@nativescript-community/ui-collectionview-waterfall';
import installAlignedLayout from '@nativescript-community/ui-collectionview-alignedflowlayout';
import { CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';
import { install } from '@nativescript-community/gesturehandler';

import SimpleGrid from './SimpleGrid.vue';
import HorizontalGrid from './HorizontalGrid.vue';
import SimpleWaterfall from './SimpleWaterfall.vue';
import SimpleTemplates from './SimpleTemplates.vue';
import Reorder from './Reorder.vue';
import SwipeMenu from './SwipeMenu.vue';
import ResizeCell from './ResizeCell.vue';
import AlignedGrid from './AlignedGrid.vue';
import FontSizeChangeTest from './FontSizeChangeTest.vue';
import SelectionDragDrop from './SelectionDragDrop.vue';

export function installPlugin() {
    Vue.use(CollectionView);
    Vue.use(SwipeMenuPlugin);

    install(true);

    installWaterfall();
    installAlignedLayout();
}

// Trace.addCategories(CollectionViewTraceCategory)
// Trace.enable()

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall },
    { name: 'Simple Templates', path: 'simple-templates', component: SimpleTemplates },
    { name: 'Reorder', path: 'reorder', component: Reorder },
    { name: 'SwipeMenu', path: 'swipe-menu', component: SwipeMenu },
    { name: 'ResizeCell', path: 'resize-cell', component: ResizeCell },
    { name: 'AlignedGrid', path: 'AlignedGrid', component: AlignedGrid },
    { name: 'FontSizeChangeTest', path: 'FontSizeChangeTest', component: FontSizeChangeTest },
    { name: 'Selection + Drag/Drop', path: 'selection-dragdrop', component: SelectionDragDrop }
];
