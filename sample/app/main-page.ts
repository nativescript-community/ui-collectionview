/// <reference path="../node_modules/nativescript-grid-view/grid-view.d.ts" />
import observable = require("data/observable");
import observableArray = require("data/observable-array");
import pages = require("ui/page");
import gridView = require("nativescript-grid-view");

let viewModel: observable.Observable;

export function pageLoaded(args: observable.EventData) {
    let page = <pages.Page>args.object;
    let items = new observableArray.ObservableArray();

    for (let loop = 0; loop < 200; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new observable.Observable();
    viewModel.set("items", items);

    page.bindingContext = viewModel;
}

export function gridViewItemTap(args: gridView.GridItemEventData) {
    console.log("tap index " + args.index.toString());
}

export function gridViewItemLoading(args: gridView.GridItemEventData) {
    console.log("item loading " + args.index.toString())
}

export function gridViewLoadMoreItems(args: observable.EventData) {
    console.log("load more items");
}