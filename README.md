# NativeScript GridView widget

A NativeScript GridView widget. The GridView displays data in separate cells, each cell representing one data item. For iOS wraps up [UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/) and for Android wraps up [GridView](http://developer.android.com/guide/topics/ui/layout/gridview.html)

## Instalation
Run the following command from the root of your project:

`tns plugin add nativescript-grid-view`

This command automatically installs the necessary files, as well as stores nativescript-flashlight as a dependency in your project's package.json file.

## Usage
You need to add `xmlns:gv="nativescript-grid-view"` to your page tag, and then simply use `<gv:GridView/>` in order to add the widget to your page. Use `<gv:Gridview.itemTemplate/>` to specify the template for each cell:
```XML
<Page xmlns="http://www.nativescript.org/tns.xsd" 
      xmlns:gv="nativescript-grid-view">
  <GridLayout>
    <gv:GridView>
      <gv:GridView.itemTemplate>
        <GridLayout>
          <Label text="Text"/>
        </GridLayout>
      </gv:GridView.itemTemplate>
    </gv:GridView>
  </GridLayout>
</Page>
```

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

* **itemsProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the observable property backing the items property of each GridView instance.

* **itemTemplateProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the item template property of each GridView instance.

* **colWidthProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the column width property for each column in the GridView instance.

* **rowHeightProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the row height property for each row in the GridView instance.
 
* **verticalSpacingProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the vertical spacing property between each item in the GridView instance. 

* **horizontalSpacingProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*  
Represents the horizontal spacing property between each item in the GridView instance.   
Note that this is the minimum space to be left horizontally between items. It might grow depending on screen and item size. 


### Instance Properties
* **ios** - *[UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/)*  
Gets the native iOS view that represents the user interface for this component. Valid only when running on iOS.

* **android** - *[android.widget.GridView](http://developer.android.com/guide/topics/ui/layout/gridview.html)*  
Gets the native android widget that represents the user interface for this component. Valid only when running on Android OS.

* **items** - *Object*  
Gets or sets the items collection of the GridView. The items property can be set to an array or an object defining length and getItem(index) method.

* **itemTemplate** - *String*  
Gets or sets the item template of the GridView.

* **rowHeight** - *Number*  
Gets or sets the height for every row in the GridView.

* **colWidth** - *Number*  
Gets or sets the width for every column in the GridView.

### Instance Methods
* **refresh()**  
Forces the GridView to reload all its items.

## Example
```XML
<!-- test-page.xml -->
<Page xmlns="http://www.nativescript.org/tns.xsd" xmlns:gv="nativescript-grid-view" loaded="pageLoaded">
  <GridLayout>
    <gv:GridView items="{{ items }}"  verticalSpacing="5" horizontalSpacing="5" colWidth="100" rowHeight="75" padding="5"
                 itemTap="gridViewItemTap" itemLoading="gridViewItemLoading" loadMoreItems="gridViewLoadMoreItems">
      <gv:GridView.itemTemplate>
        <GridLayout backgroundColor="#33ffff">
          <Label text="{{ value }}" verticalAlignment="center"/>
        </GridLayout>
      </gv:GridView.itemTemplate>
    </gv:GridView>
  </GridLayout>
</Page>
```

```TypeScript
// test-page.ts
/// <reference path="../node_modules/nativescript-grid-view/grid-view.d.ts" />
import observable = require("data/observable");
import observableArray = require("data/observable-array");
import pages = require("ui/page");
import gridView = require("nativescript-grid-view");

var viewModel: observable.Observable;

export function pageLoaded(args: observable.EventData) 
{
    var page = <pages.Page>args.object;
    var items = new observableArray.ObservableArray();

    for (var loop = 0; loop < 200; loop++)
    {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new observable.Observable();
    viewModel.set("items", items);

    page.bindingContext = viewModel;
}

export function gridViewItemTap(args: gridView.GridItemEventData)
{
    console.log("tap index " + args.index.toString());
}

export function gridViewItemLoading(args: gridView.GridItemEventData)
{
    console.log("item loading " + args.index.toString())
}

export function gridViewLoadMoreItems(args: observable.EventData)
{
    console.log("load more items");
}
```
