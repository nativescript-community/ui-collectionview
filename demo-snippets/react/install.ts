import { SimpleGrid } from './SimpleGrid';
import { registerCollectionView } from '@nativescript-community/ui-collectionview/react';

export function installPlugin() {
    registerCollectionView();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
];
