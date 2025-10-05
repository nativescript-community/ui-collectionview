import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { SwipeMenuModule } from '@nativescript-community/ui-collectionview-swipemenu/angular';
import { CollectionViewModule } from '@nativescript-community/ui-collectionview/angular';
import { RouterExtensions } from '@nativescript/angular';
import { ObservableArray, Screen } from '@nativescript/core';

@Component({
    selector: 'ns-collectionview-swipe-menu',
    imports: [CollectionViewModule, SwipeMenuModule],
    templateUrl: './swipe-menu.component.html',
    styleUrls: ['../styles.scss'],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SwipeMenuComponent {
    constructor(private router: RouterExtensions) {}

    items = new ObservableArray([
        { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
        { index: 1, name: 'EMERALD', color: '#2ecc71' },
        { index: 2, name: 'PETER RIVER', color: '#3498db' },
        { index: 3, name: 'AMETHYST', color: '#9b59b6' },
        { index: 4, name: 'WET ASPHALT', color: '#34495e' },
        { index: 5, name: 'GREEN SEA', color: '#16a085' },
        { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
        { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
        { index: 8, name: 'WISTERIA', color: '#8e44ad' },
        { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
        { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
        { index: 11, name: 'CARROT', color: '#e67e22' },
        { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
        { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
        { index: 14, name: 'CONCRETE', color: '#95a5a6' },
        { index: 15, name: 'ORANGE', color: '#f39c12' },
        { index: 16, name: 'PUMPKIN', color: '#d35400' },
        { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
        { index: 18, name: 'SILVER', color: '#bdc3c7' },
        { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
    ]);

    drawerTranslationFunction(side, width, value, delta, progress) {
        const result = {
            mainContent: {
                translateX: side === 'right' ? -delta : delta,
                opacity: progress < 1 ? 1 : 0.8
            },
            backDrop: {
                opacity: progress * 0.00001
            }
        } as any;
        console.log(`drawerTranslation invoked\n side: ${side}, width: ${width}, value: ${value}, delta: ${delta}, progress: ${progress}`);
        return result;
    }

    swipeMenuThreshold = Screen.mainScreen.widthPixels;
    menuItemTap(e) {
        console.log(`EVENT TRIGGERED: Tapped on ${e.object.text}`);
    }
    onItemTap({ index, item, view }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);

        // startingSide means that a swipemenu is open, so close it
        if (item.startingSide) {
            console.log('Menu open, closing ...');
            view.close();
        }
    }

    goBack(): void {
        this.router.back();
    }
}
