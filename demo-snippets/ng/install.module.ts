import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { CollectionViewModule } from "@nativescript-community/ui-collectionview/angular";

import { SimpleGridComponent } from './simple-grid/simple-grid.component';

export const COMPONENTS = [SimpleGridComponent];
@NgModule({
    imports: [CollectionViewModule],
    exports: [CollectionViewModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class InstallModule {}

export function installPlugin() {}

export const demos = [
    { name: 'Simple Grid', path: 'simple-grid', component: SimpleGridComponent },
];
