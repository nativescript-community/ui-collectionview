

import CollectionView from '@nativescript-community/ui-collectionview/vue3';
import install from '@nativescript-community/ui-collectionview-waterfall';

import SimpleGrid from './SimpleGrid.vue';
import HorizontalGrid from './HorizontalGrid.vue';
import SimpleWaterfall from './SimpleWaterfall.vue';
import SimpleTemplates from './SimpleTemplates.vue';
import Reorder from './Reorder.vue';
//import SwipeMenu from './SwipeMenu.vue';
import ResizeCell from './ResizeCell.vue';

export function installPlugin(app: any) {

    app.use(CollectionView);
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall },
    { name: 'Simple Templates', path: 'simple-templates', component: SimpleTemplates },
    { name: 'Reorder', path: 'reorder', component: Reorder },
    //{ name: 'SwipeMenu', path: 'swipe-menu', component: SwipeMenu },
    { name: 'ResizeCell', path: 'resize-cell', component: ResizeCell }
];
