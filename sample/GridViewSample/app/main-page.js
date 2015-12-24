/// <reference path="../node_modules/nativescript-grid-view/grid-view.d.ts" />
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var viewModel;
function pageLoaded(args) {
    var page = args.object;
    var items = new observableArray.ObservableArray();
    for (var loop = 0; loop < 200; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new observable.Observable();
    viewModel.set("items", items);
    page.bindingContext = viewModel;
}
exports.pageLoaded = pageLoaded;
function gridViewItemTap(args) {
    console.log("tap index " + args.index.toString());
}
exports.gridViewItemTap = gridViewItemTap;
function gridViewItemLoading(args) {
    console.log("item loading " + args.index.toString());
}
exports.gridViewItemLoading = gridViewItemLoading;
function gridViewLoadMoreItems(args) {
    console.log("load more items");
}
exports.gridViewLoadMoreItems = gridViewLoadMoreItems;
