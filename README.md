# NativeScript GridView widget
[![Build Status](https://travis-ci.org/PeterStaev/NativeScript-Grid-View.svg?branch=master)](https://travis-ci.org/PeterStaev/NativeScript-Grid-View)
[![npm downloads](https://img.shields.io/npm/dm/nativescript-grid-view.svg)](https://www.npmjs.com/package/nativescript-grid-view)
[![npm downloads](https://img.shields.io/npm/dt/nativescript-grid-view.svg)](https://www.npmjs.com/package/nativescript-grid-view)
[![npm](https://img.shields.io/npm/v/nativescript-grid-view.svg)](https://www.npmjs.com/package/nativescript-grid-view)

A NativeScript GridView widget. The GridView displays data in separate cells, each cell representing one data item. For iOS wraps up [UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/) and for Android wraps up [RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html)

## Screenshot
![Screenshot of Android](https://raw.githubusercontent.com/PeterStaev/NativeScript-Grid-View/master/docs/screenshot.png)

## Instalation
Run the following command from the root of your project:

`tns plugin add nativescript-grid-view`

This command automatically installs the necessary files, as well as stores nativescript-grid-view as a dependency in your project's package.json file.

## Usage
You need to add `xmlns:gv="nativescript-grid-view"` to your page tag, and then simply use `<gv:GridView/>` in order to add the widget to your page. Use `<gv:Gridview.itemTemplate/>` to specify the template for each cell:

## API

### Events
* **itemLoading**  
Triggered when generating an item in the GridView. 

* **itemTap**  
Triggered when the user taps on an item in the GridView. 

* **loadMoreItems**  
Triggered when the generated items reached the end of the items property.

### Static Properties
* **itemLoadingEvent** - *String*  
String value used when hooking to itemLoadingEvent event.

* **itemTapEvent** - *String*  
String value used when hooking to itemTapEvent event.

* **loadMoreItemsEvent** - *String*  
String value used when hooking to itemTapEvent event.

### Instance Properties
* **ios** - *[UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/)*  
Gets the native iOS view that represents the user interface for this component. Valid only when running on iOS.

* **android** - *[android.support.v7.widget.RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html)*  
Gets the native android widget that represents the user interface for this component. Valid only when running on Android OS.

* **items** - *Array | ItemsSource*  
Gets or sets the items collection of the GridView. The items property can be set to an array or an object defining length and getItem(index) method.

* **itemTemplate** - *String*  
Gets or sets the item template of the GridView.

* **rowHeight** - *PercentLength*  
Gets or sets the height for every row in the GridView.

* **colWidth** - *PercentLength*  
Gets or sets the width for every column in the GridView.

### Instance Methods
* **refresh()**  
Forces the GridView to reload all its items.

## Example
```xml
<!-- test-page.xml -->
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:gv="nativescript-grid-view" loaded="pageLoaded">
  <GridLayout>
    <gv:GridView items="{{ items }}" colWidth="24%" rowHeight="15%" padding="5" itemTap="gridViewItemTap" itemLoading="gridViewItemLoading" loadMoreItems="gridViewLoadMoreItems">
      <gv:GridView.itemTemplate>
        <GridLayout backgroundColor="#33ffff" style="margin: 5">
          <Label text="{{ value }}" verticalAlignment="center"/>
        </GridLayout>
      </gv:GridView.itemTemplate>
    </gv:GridView>
  </GridLayout>
</Page>
```

```ts
// test-page.ts
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
```

## Angular:

Import `GridViewModule` in your `NgModule`:

```typescript
import { GridViewModule } from 'nativescript-grid-view/angular';

@NgModule({
    //......
    imports: [
        //......
        GridViewModule,
        //......
    ],
    //......
})
```

#### Example Usage
```ts
// app.module.ts
import { GridViewModule } from "nativescript-grid-view/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        GridViewModule,
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent
    ],
    providers: [
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
```

```html
<!-- my.component.html -->
<GridLayout class="page">
  <GridView [items]="items" colWidth="30%" rowHeight="100">
    <ng-template let-item="item" let-odd="odd">
      <StackLayout margin="10" [nsRouterLink]="['/item', item.id]" borderColor="blue" borderWidth="2" borderRadius="5" verticalAlignment="stretch" class="list-group-item" [class.odd]="odd">
        <Label verticalAlignment="center" [text]="item.name" class="list-group-item-text" textWrap="true"></Label>
      </StackLayout>
    </ng-template>
  </GridView>
</GridLayout>
```

## Working with Webpack+Uglify
In case you are uing webpack and also are minifying/uglifying your code, there are some specific names that should be excluded from the uglification for the widget to work properly. The GridView widget exports those and you need to add them to the mangle exclude option of the uglifyjs plugin in the `webpack.common.js` file:
```js
var gridViewMangleExcludes = require("nativescript-grid-view/uglify-mangle-excludes").default;
//......
module.exports = function (platform, destinationApp) {
    //......
    if (process.env.npm_config_uglify) {
        plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true
        }));

        //Work around an Android issue by setting compress = false
        var compress = platform !== "android";
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: nsWebpack.uglifyMangleExcludes.concat(gridViewMangleExcludes),
            },
            compress: compress,
        }));
    }
   //......
}
```

## Donate
`bitcoin:14fjysmpwLvSsAskvLASw6ek5XfhTzskHC`

![Donate](https://www.tangrainc.com/qr.png)