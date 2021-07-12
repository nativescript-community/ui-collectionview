# NativeScript CollectionView

[![npm downloads](https://img.shields.io/npm/dm/@nativescript-community/ui-collectionview.svg)](https://www.npmjs.com/package/@nativescript-community/ui-collectionview)
[![npm downloads](https://img.shields.io/npm/dt/@nativescript-community/ui-collectionview.svg)](https://www.npmjs.com/package/@nativescript-community/ui-collectionview)
[![npm](https://img.shields.io/npm/v/@nativescript-community/ui-collectionview.svg)](https://www.npmjs.com/package/@nativescript-community/ui-collectionview)

A NativeScript CollectionView widget. The CollectionView displays data in separate cells, each cell representing one data item. For iOS wraps up [UICollectionView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UICollectionView_class/) and for Android wraps up [RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html). This can be used as an Open Source alternative to [RadListView](https://docs.nativescript.org/ui/components/radlistview/overview).

| <img src="images/demo-ios.gif" height="500" /> | <img src="images/demo-android.gif" height="500" /> |
| --- | ----------- |
| iOS Demo | Android Demo |

---
## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [API](#api)
4. [Usage](#usage)
5. [Usage in Angular](#usage-in-angular)
6. [Usage in Vue](#usage-in-vue)
7. [Usage in Svelte](#usage-in-svelte)
8. [Usage in React](#usage-in-react)
9. [Demos](#demos)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-collectionview`

This command automatically installs the necessary files, as well as stores @nativescript-community/ui-collectionview as a dependency in your project's package.json file.

## Configuration
There is no additional configuration needed!

## API

### Events

| Property            | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| itemLoading         | Triggered when generating an item in the CollectionView.                     |
| itemTap             | Triggered when the user taps on an item in the CollectionView.               |
| loadMoreItems       | Triggered when the generated items reached the end of the items property.    |
| scroll              | Triggered on collectionview scroll.                                          |
| scrollEnd           | Triggered on collectionview scroll end.    |
| itemReorderStarting       | Triggered when a reorder is starting. Changing the `returnValue` of the event data allows you to cancel it    |
| itemReorderStarted       | Triggered when a reorder started.    |
| itemReordered       | Triggered when a reorder finished.    |
| dataPopulated       | Triggered when a refresh has been called.    |



### Properties

| Property      | Type                                             | Description                                             |
| ------------- | ------------------------------------------------ | ------------------------------------------------------- |
| ios           | [UICollectionView](https://tinyurl.com/y4ugbfgc) | Gets the native iOS view that represents the user interface for this component. Valid only when running on iOS.    |
| android       | [android.support.v7.widget.RecyclerView](https://tinyurl.com/lvqebpq) | Gets the native android widget that represents the user interface for this component. Valid only when running on Android OS.    |
| items         | `array` or `ItemsSource`  | Gets or sets the items collection of the CollectionView. The items property can be set to an array or an object defining length and getItem(index) method.    |
| itemTemplate  | `string`  | Gets or sets the item template of the CollectionView.    |
| rowHeight     | `PercentLength`  | Gets or sets the height for every row in the CollectionView.    |
| colWidth      | `PercentLength`  | Gets or sets the width for every column in the CollectionView.    |
| spanSize      | `function` | Triggered when an item is loaded. Returns the number of columns that the element should occupy taking into account `colWidth` when the device is vertical and `rowHeight` when horizontal. Parameters: (item, index: number).    |
| scrollOffset  | `number` | Gets the current scroll. |

### Methods

| Name                                                   | Return | Description                                                                                                            |
| ------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| refresh()                                              | `void` | Forces the CollectionView to reload all its items.                                                                     |
| refreshVisibleItem()                                   | `void` | Forces CollectionView to reload visible items. |
| scrollToIndex(index: number, animated: boolean = true) | `void` | Scrolls the CollectionView to the item with the given index. This can be either animated or not. Defaults to animated. |
| isItemAtIndexVisible(index: number)                    | `boolean` | Returns a boolean indicating whether the item is visible. |

## Usage
You need to add `xmlns:gv="@nativescript-community/ui-collectionview"` to your page tag, and then simply use `<gv:CollectionView/>` in order to add the widget to your page. Use `<gv:Gridview.itemTemplate/>` to specify the template for each cell:

### Simple Example:

Create a simple array of objects in your JS/TS file.

```typescript
const items = [
    { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
    { index: 1, name: 'EMERALD', color: '#2ecc71' },
    { index: 2, name: 'PETER RIVER', color: '#3498db' },
    { index: 3, name: 'AMETHYST', color: '#9b59b6' },
    { index: 4, name: 'WET ASPHALT', color: '#34495e' },
    { index: 5, name: 'GREEN SEA', color: '#16a085' },
    { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
    { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
    { index: 8, name: 'WISTERIA', color: '#8e44ad' },
    { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' }
];
```

```xml
<!-- test-page.xml -->
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:gv="@nativescript-community/ui-collectionview" loaded="pageLoaded">
    <GridLayout>
        <gv:CollectionView items="{{ items }}" colWidth="50%" rowHeight="100">
            <gv:CollectionView.itemTemplate>
                <Label text="{{ value }}" verticalAlignment="center"/>
            </gv:CollectionView.itemTemplate>
        </gv:CollectionView>
    </GridLayout>
</Page>
```

### Templates Example:
You can also have multiple templates the same way you add them in the builtin `ListView` control:
```xml
<gv:CollectionView id="gv" row="0" class="{{ cssClass }}" items="{{ items }}" 
                colWidth="{{ colWidth }}" rowHeight="{{ rowHeight }}" itemTemplateSelector="templateSelector"
                itemTap="gridViewItemTap" itemLoading="gridViewItemLoading" loadMoreItems="gridViewLoadMoreItems">
    <gv:CollectionView.itemTemplates>
        <template key="odd">
            <GridLayout backgroundColor="#33ffff" style="margin: 10 10 0 0">
                <Label text="{{ value }}" verticalAlignment="center"/>
            </GridLayout>
        </template>

        <template key="even">
            <GridLayout backgroundColor="#33ffff" rows="auto, auto" style="margin: 10 10 0 0">
                <Label row="0" text="{{ value }}" verticalAlignment="center"/>
                <Label row="1" text="{{ value }}" verticalAlignment="center"/>
            </GridLayout>
        </template>
    </gv:CollectionView.itemTemplates>
</gv:CollectionView>
```
```ts
export function templateSelector(item: any, index: number, items: any) {
    return index % 2 === 0 ? "even" : "odd";
}
```

## Usage in Angular

Import the module into your project.

```typescript
import { CollectionViewModule } from '@nativescript-community/ui-collectionview/angular';

@NgModule({
    imports: [
        CollectionViewModule,
    ],
})
```
### Simple Example:

Create a simple array of objects in your Typescript file.

```typescript
items = [
    { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
    { index: 1, name: 'EMERALD', color: '#2ecc71' },
    { index: 2, name: 'PETER RIVER', color: '#3498db' },
    { index: 3, name: 'AMETHYST', color: '#9b59b6' },
    { index: 4, name: 'WET ASPHALT', color: '#34495e' },
    { index: 5, name: 'GREEN SEA', color: '#16a085' },
    { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
    { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
    { index: 8, name: 'WISTERIA', color: '#8e44ad' },
    { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' }
];
```

Add the following to your component HTML.
```xml
<CollectionView [items]="items" colWidth="50%" rowHeight="100">
    <ng-template let-item="item">
        <Label [text]="item.name"></Label>
    </ng-template>
</CollectionView>
```

### Templates Example:
If you want to use multiple item templates, you can do that very similarly to how you do it for the builtin `ListView` control. The only difference is that due to current limitations instead of using the `nsTemplateKey` directive you need to use the `cvTemplateKey` directive that comes from the CollectionView. (In a future version, once the framework allows it this will be changed and you will be able to use the same directive for the `CollectionView` as well)
```html
<CollectionView row="1" [items]="items" colWidth="33%" rowHeight="100" [itemTemplateSelector]="templateSelector">
    <ng-template cvTemplateKey="Defender" let-item="item" let-odd="odd">
        <StackLayout [nsRouterLink]="['/item', item.id]" borderColor="blue" borderWidth="2" borderRadius="5" verticalAlignment="stretch" class="list-group-item" [class.odd]="odd">
        <Label verticalAlignment="center" [text]="item.name" class="list-group-item-text" textWrap="true"></Label>
        </StackLayout>
    </ng-template>

    <ng-template cvTemplateKey="Goalkeeper" let-item="item" let-odd="odd">
        <StackLayout [nsRouterLink]="['/item', item.id]" borderColor="black" borderWidth="2" borderRadius="5" verticalAlignment="stretch" class="list-group-item" [class.odd]="odd">
        <Label verticalAlignment="center" [text]="item.name" class="list-group-item-text" textWrap="true"></Label>
        </StackLayout>
    </ng-template>

    <ng-template cvTemplateKey="Midfielder" let-item="item" let-odd="odd">
        <StackLayout [nsRouterLink]="['/item', item.id]" borderColor="yellow" borderWidth="2" borderRadius="5" verticalAlignment="stretch" class="list-group-item" [class.odd]="odd">
        <Label verticalAlignment="center" [text]="item.name" class="list-group-item-text" textWrap="true"></Label>
        </StackLayout>
    </ng-template>

    <ng-template cvTemplateKey="Forward" let-item="item" let-odd="odd">
        <StackLayout [nsRouterLink]="['/item', item.id]" borderColor="red" borderWidth="2" borderRadius="5" verticalAlignment="stretch" class="list-group-item" [class.odd]="odd">
        <Label verticalAlignment="center" [text]="item.name" class="list-group-item-text" textWrap="true"></Label>
        </StackLayout>
    </ng-template>
</CollectionView>
```

For a more complete example, look in the `demo-ng` directory.

## Usage in Vue

Register the plugin in your `app.ts`.

```typescript
import CollectionView from '@nativescript-community/ui-collectionview/vue';
Vue.use(CollectionView);
```

### Simple Example:
In your component, add the following to make a simple array of objects.

```typescript
export default {
    // ...
    data() {
        const items = [
            { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
            { index: 1, name: 'EMERALD', color: '#2ecc71' },
            { index: 2, name: 'PETER RIVER', color: '#3498db' },
            { index: 3, name: 'AMETHYST', color: '#9b59b6' },
            { index: 4, name: 'WET ASPHALT', color: '#34495e' },
            { index: 5, name: 'GREEN SEA', color: '#16a085' },
            { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
            { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
            { index: 8, name: 'WISTERIA', color: '#8e44ad' },
            { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' }
        ];
        return {
            itemList: items
        };
    },
    // ...
};
```

Then add the following XML to your component.

```xml
<CollectionView
    :items="itemList"
    colWidth="50%"
    rowHeight="100"
>
    <v-template>
        <Label :text="item.name"></Label>
    </v-template>
</CollectionView>
```

For a more complete example, look in the `demo-vue` directory.

## Usage in Svelte

Register the plugin in your `app.ts`.

```typescript
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
CollectionViewElement.register();
```

### Simple Example:

In you component, add the following to import Svelte `Templates` and to create a simple array of objects.

```typescript
import { Template } from 'svelte-native/components';

const items = [
    { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
    { index: 1, name: 'EMERALD', color: '#2ecc71' },
    { index: 2, name: 'PETER RIVER', color: '#3498db' },
    { index: 3, name: 'AMETHYST', color: '#9b59b6' },
    { index: 4, name: 'WET ASPHALT', color: '#34495e' },
    { index: 5, name: 'GREEN SEA', color: '#16a085' },
    { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
    { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
    { index: 8, name: 'WISTERIA', color: '#8e44ad' },
    { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' }
];
```

Then add the following XML to your component:

```xml
<collectionView 
    {items} 
    colWidth="50%"
    rowHeight="100"
>
    <Template let:item>
        <label text="{item.name}" />
    </Template>
</collectionView>
```

For a more complete example, look in the `demo-svelte` directory.

## Usage in React

Register the plugin in your `app.ts`.

```typescript
import { registerCollectionView } from '@nativescript-community/ui-collectionview/react';
registerCollectionView();
```

### Simple Example:

In your component, add the following code to create a simple list.

```tsx
import { CollectionView } from '@nativescript-community/ui-collectionview/react';

const items = [
    { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
    { index: 1, name: 'EMERALD', color: '#2ecc71' },
    { index: 2, name: 'PETER RIVER', color: '#3498db' },
    { index: 3, name: 'AMETHYST', color: '#9b59b6' },
    { index: 4, name: 'WET ASPHALT', color: '#34495e' },
    { index: 5, name: 'GREEN SEA', color: '#16a085' },
    { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
    { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
    { index: 8, name: 'WISTERIA', color: '#8e44ad' },
    { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' }
];

interface Item {
    index: number;
    name: string;
    color: string;
}

const cellFactory = (item: Item) => (
    <label text={item.name} />
);

export function First() {
    return (
        <CollectionView items={items} colWidth="50%" rowHeight="100" cellFactory={cellFactory} width="100%" height="100%" />
    );
}
```

For a more complete example, look in the `demo-react` directory.

## Demos
This repository includes Angular, Vue.js, and Svelte demos. In order to run these execute the following in your shell:
```shell
$ git clone https://github.com/@nativescript-community/ui-collectionview
$ cd ui-collectionview
$ npm i
$ npm run setup
$ npm run build # && npm run build.angular
$ cd demo-ng # or demo-vue or demo-svelte
$ ns run ios|android
```