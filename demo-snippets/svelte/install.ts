import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
CollectionViewElement.register();

import SimpleGrid from './SimpleGrid.svelte';

export function installPlugin() {
    CollectionViewElement.register();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
];
