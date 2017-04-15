import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";

import { GridItemEventData } from "nativescript-grid-view";

let viewModel: Observable;

export function pageLoaded(args: EventData) {
    const page = args.object as Page;
    const items = new ObservableArray();

    for (let loop = 0; loop < 200; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new Observable();
    viewModel.set("items", items);
    viewModel.set("rowHeight", 75);
    viewModel.set("colWidth", 100);
    viewModel.set("verticalSpacing", 5);
    viewModel.set("horizontalSpacing", 5);
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
    viewModel.set("colWidth", 125);
    viewModel.set("verticalSpacing", 10);
    viewModel.set("horizontalSpacing", 10);
    viewModel.set("cssClass", "changed");
}