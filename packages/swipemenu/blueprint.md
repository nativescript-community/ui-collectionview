{{ load:../../tools/readme/edit-warning.md }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}

{{ template:toc }}

## Installation
Run the following command from the root of your project:

`ns plugin add {{ pkg.name }}`

## Configuration

To install the plugin run:
```typescript
import install from '{{ pkg.name }}';
install();
```
## API


## CollectionView extensions
### Events

| Property            | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| swipeMenuOpen         | Triggered when a menu is opened in the CollectionView.                     |
| swipeMenuClose             | Triggered when a menu is closed in the CollectionView.               |


### Propert
### Methods

| Name                                                   | Return | Description                                                                                                            |
| ------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| closeCurrentMenu()                                              | `void` | Close any opened menu in the CollectionView.                                                                     |

## Usage

First very important note. For this plugin to work correctly, collectionview items must be an object!
The plugin will add `startingSide` property to your items as needed to keep knowledge of which menu is opened and notify the template `SwipeMenu`. Might change in the future

You need to add `xmlns:gvs="@nativescript-community/ui-collectionview-swipemenu"` to your page tag, and then simply use `<gvs:SwipeMenu/>` in order to add the widget to your page. Use `<gv:Gridview.itemTemplate/>` to specify the template for each cell:

### Simple Example

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
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:gv="@nativescript-community/ui-collectionview" xmlns:gvs="@nativescript-community/ui-collectionview-swipemenu" >
    <GridLayout>
        <gv:CollectionView items="{{ items }}" rowHeight="100">
            <gv:CollectionView.itemTemplate>
                <gvs:SwipeMenu startingSide="{{ startingSide }}">
                    <Label text="{{ value }}" verticalAlignment="center"/>
                </gvs:SwipeMenu>
            </gv:CollectionView.itemTemplate>
        </gv:CollectionView>
    </GridLayout>
</Page>
```

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}