import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { CollectionViewModule } from "@nativescript-community/ui-collectionview/angular";
import install from '@nativescript-community/ui-collectionview-waterfall';

import { SimpleGridComponent } from './simple-grid/simple-grid.component';
import { HorizontalGridComponent } from './horizontal-grid/horizontal-grid.component';
import { SimpleWaterfallComponent } from './simple-waterfall/simple-waterfall.component';

export const COMPONENTS = [SimpleGridComponent, HorizontalGridComponent, SimpleWaterfallComponent];
@NgModule({
    imports: [CollectionViewModule],
    exports: [CollectionViewModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class InstallModule {}

export function installPlugin() {
    install();
}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGridComponent },
    { name: 'Horizontal Grid', path: 'horizontal-grid', component: HorizontalGridComponent },
    { name: 'Simple Waterfall', path: 'simple-waterfall', component: SimpleWaterfallComponent },
];
