# NativeScript GridView widget

A GridView widget for displaying data in separate cells, each cell representing one data item. For iOS wraps up [UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/) and for Android wraps up [GridView](http://developer.android.com/guide/topics/ui/layout/gridview.html)

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
* **itemTap**
* **loadMoreItems**

### Static Properties
* **itemLoadingEvent** - *String*
* **itemTapEvent** - *String*
* **loadMoreItemsEvent** - *String*
* **itemsProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*
* **itemTemplateProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*
* **colWidthProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*
* **rowHeightProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*
* **verticalSpacingProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*
* **horizontalSpacingProperty** - *[Property](http://docs.nativescript.org/ApiReference/ui/core/dependency-observable/Property.html)*

### Instance Properties
* **ios** - *[UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/)*
* **android**
* **items** - *Object*
* **itemTemplate** - *String*
* **rowHeight** - *Number*
* **colWidth** - *Number*

### Instance Methods
* **refresh()**

# Example
```XML
<!-- test-page.xml -->
<Page xmlns="http://www.nativescript.org/tns.xsd" xmlns:gv="nativescript-grid-view" loaded="pageLoaded">
  <GridLayout>
    <gv:GridView items="{{ items }}"  verticalSpacing="5" horizontalSpacing="5" colWidth="100" rowHeight="75"
                 itemTap="gridViewItemTap" itemLoading="gridViewItemLoading" loadMoreItems="gridViewLoadMoreItems">
      <gv:GridView.itemTemplate>
        <GridLayout>
          <Label text="{{ value }}"/>
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
import pages = require("ui/page");
import gridView = require("nativescript-grid-view");

var viewModel: observable.Observable;

export function pageLoaded(args: observable.EventData) 
{
    var page = <pages.Page>args.object;
    
    viewModel = new observable.Observable();
    page.bindingContext = viewModel;
}

export function gridViewItemTap(args: gridView.GridItemEventData)
{
    console.log("tap index " + args.index.toString());
}
```
