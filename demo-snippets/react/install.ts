import { registerCollectionView } from '@nativescript-community/ui-collectionview/react';
import install from '@nativescript-community/ui-collectionview-waterfall';

import { SimpleGrid } from './SimpleGrid';
import { HorizontalGrid } from './HorizontalGrid';
import { SimpleWaterfall } from './SimpleWaterfall';
import { SimpleTemplates } from './SimpleTemplates';

export function installPlugin() {
    registerCollectionView();
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGrid },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGrid },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfall },
    { name: 'Simple Templates', path: 'simple-templates', component: SimpleTemplates }
];
