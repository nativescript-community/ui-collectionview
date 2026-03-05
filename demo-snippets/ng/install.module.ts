import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { CollectionViewModule } from '@nativescript-community/ui-collectionview/angular';
import { SwipeMenuModule } from '@nativescript-community/ui-collectionview-swipemenu/angular';
import install from '@nativescript-community/ui-collectionview-waterfall';

import { SimpleGridComponent } from './simple-grid/simple-grid.component';
import { HorizontalGridComponent } from './horizontal-grid/horizontal-grid.component';
import { SimpleWaterfallComponent } from './simple-waterfall/simple-waterfall.component';
import { SimpleTemplatesComponent } from './simple-templates/simple-templates.component';
import { SwipeMenuComponent } from './swipe-menu/swipe-menu.component';

@NgModule({
    imports: [CollectionViewModule, SwipeMenuModule],
    exports: [CollectionViewModule, SwipeMenuModule],
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
    { name: 'Simple Template', path: 'simple-template', component: SimpleTemplatesComponent },
    { name: 'Swipe Menu', path: 'swipe-menu', component: SwipeMenuComponent }
];
