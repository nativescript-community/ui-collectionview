import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from '@nativescript/angular';

@Component({
    selector: 'ns-collectionview-simple-templates',
    templateUrl: './simple-templates.component.html'
})
export class SimpleTemplatesComponent implements OnInit {
    constructor(private router: RouterExtensions) {}

    items = [
        { type: 'heading', name: 'Heading #1', color: '#bdc3c7'},
        { type: 'item', name: 'TURQUOISE', color: '#1abc9c' },
        { type: 'item', name: 'EMERALD', color: '#2ecc71' },
        { type: 'item', name: 'PETER RIVER', color: '#3498db' },
        { type: 'item', name: 'AMETHYST', color: '#9b59b6' },
        { type: 'heading', name: 'Heading #2', color: '#34495e'},
        { type: 'item', name: 'GREEN SEA', color: '#16a085' },
        { type: 'item', name: 'NEPHRITIS', color: '#27ae60' },
        { type: 'item', name: 'BELIZE HOLE', color: '#2980b9' },
        { type: 'item', name: 'ASBESTOS', color: '#7f8c8d' },
        { type: 'heading', name: 'Heading #3', color: '#8e44ad' },
        { type: 'item', name: 'MIDNIGHT BLUE', color: '#2c3e50' },
        { type: 'item', name: 'SUN FLOWER', color: '#f1c40f' },
        { type: 'item', name: 'CARROT', color: '#e67e22' },
        { type: 'item', name: 'POMEGRANATE', color: '#c0392b' },
        { type: 'heading', name: 'Heading #4', color: '#e74c3c' },
        { type: 'item', name: 'CLOUDS', color: '#ecf0f1' },
        { type: 'item', name: 'CONCRETE', color: '#95a5a6' },
        { type: 'item', name: 'ORANGE', color: '#f39c12' },
        { type: 'item', name: 'PUMPKIN', color: '#d35400' },
    ];

    ngOnInit(): void {

    }

    goBack(): void {
        this.router.back();
    }

    onItemTap({ index, item }) {
        console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
    }

    onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
    }

    templateSelector(
        item: any,
        _index: number,
        _items: any[]
    ): string {
        return item.type;
    }

    spanSizeSelector(item: any, _index: number): number {
        if (item.type === "heading") return 2;
        return 1;
    }
}
