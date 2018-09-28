import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";

import { CollectionViewItemEventData, CollectionView } from "./nativescript-collectionview/collectionview";

let viewModel: Observable;
let gv: CollectionView;

export function pageLoaded(args: EventData) {
    const page = args.object as Page;
    const items = new ObservableArray();

    gv = page.getViewById<CollectionView>("gv");

    for (let loop = 0; loop < 1000; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new Observable();
    viewModel.set("items", items);
    viewModel.set("rowHeight", "60");
    viewModel.set("colWidth", "100%");
    viewModel.set("cssClass", "default");

    page.bindingContext = viewModel;
}

export function gridViewItemTap(args: CollectionViewItemEventData) {
    console.log("tap index " + args.index.toString());
}

export function gridViewItemLoading(args: CollectionViewItemEventData) {
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

export function templateSelector(item: any, index: number, items: any) {
    return index % 2 === 0 ? "even" : "odd";
}

export function moviesExample(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("movietest/page");
}