import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import install from '@nativescript-community/ui-collectionview-waterfall';

import SimpleGrid from './SimpleGrid.svelte';
import SimpleWaterfall from './SimpleWaterfall.svelte';

export function installPlugin() {
    CollectionViewElement.register();
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall }
];
