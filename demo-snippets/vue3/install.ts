

import CollectionView from '@nativescript-community/ui-collectionview/vue3';
import install from '@nativescript-community/ui-collectionview-waterfall';

import SimpleGrid from './SimpleGrid.vue';
import HorizontalGrid from './HorizontalGrid.vue';

export function installPlugin(app: any) {
    app.use(CollectionView);
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
];
