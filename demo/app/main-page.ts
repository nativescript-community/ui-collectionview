import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";

import { GridItemEventData, GridView } from "nativescript-grid-view";

let viewModel: Observable;
let gv: GridView;

export function pageLoaded(args: EventData) {
    const page = args.object as Page;
    const items = new ObservableArray();

    gv = page.getViewById<GridView>("gv");

    for (let loop = 0; loop < 200; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new Observable();
    viewModel.set("items", items);
    viewModel.set("rowHeight", "15%");
    viewModel.set("colWidth", "24%");
    viewModel.set("cssClass", "default");

    page.bindingContext = viewModel;
}

export function gridViewItemTap(args: GridItemEventData) {
    console.log("tap index " + args.index.toString());
}

export function gridViewItemLoading(args: GridItemEventData) {
    console.log("item loading " + args.index.toString());
}

export function gridViewLoadMoreItems(args: EventData) {
    console.log("load more items");
}

export function changeStyles() {
    viewModel.set("rowHeight", 100);
    viewModel.set("colWidth", 100);
    viewModel.set("cssClass", "changed");
}

export function scrollToIndex() {
    gv.scrollToIndex(25);
}