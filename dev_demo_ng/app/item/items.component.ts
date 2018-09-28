import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    public items: ObservableArray<Item>;

    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class. 
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private itemService: ItemService) { }

    public ngOnInit(): void {
        this.items = new ObservableArray(this.itemService.getItems());
    }
    
    public templateSelector(item: Item) {
        return item.role;
    }

    public onItemTap(event) {
        console.log('onItemTap', event.index);
        this.items.splice(event.index, 0, this.itemService.createRandomItem());
    }
    public onItemLongPress(event, item) {
        console.log('onItemLongPress', event.type, event.object);
        if (!event.ios || event.ios.state === 1) {
            this.items.splice(this.items.indexOf(item), 1);
        }
    } 
}