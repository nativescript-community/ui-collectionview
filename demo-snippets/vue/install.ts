import Vue from 'nativescript-vue';

import CollectionView from '@nativescript-community/ui-collectionview/vue';

import SimpleGrid from './SimpleGrid.vue';

export function installPlugin() {
    Vue.use(CollectionView);
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
];
