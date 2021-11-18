import Vue from 'nativescript-vue';

import CollectionView from '@nativescript-community/ui-collectionview/vue';
import install from '@nativescript-community/ui-collectionview-waterfall';

import SimpleGrid from './SimpleGrid.vue';
import HorizontalGrid from './HorizontalGrid.vue';
import SimpleWaterfall from './SimpleWaterfall.vue';
import SimpleTemplates from './SimpleTemplates.vue';

export function installPlugin() {
    Vue.use(CollectionView);
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall },
    { name: 'Simple Templates', path: 'simple-templates', component: SimpleTemplates }
];
