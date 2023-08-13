<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/ui-collectionview-swipemenu</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-collectionview-swipemenu?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-collectionview-swipemenu.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-collectionview-swipemenu"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-collectionview-swipemenu.svg" height="20"/></a>
	</p>

<p align="center">
  <b>A NativeScript CollectionView SwipeMenu Plugin.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [Configuration](#configuration)
* [API](#api)
* [CollectionView extensions](#collectionview-extensions)
	* [Events](#events)
	* [Propert](#propert)
	* [Methods](#methods)
* [Usage](#usage)
	* [Simple Example](#simple-example)
* [Demos and Development](#demos-and-development)
	* [Repo Setup](#repo-setup)
	* [Build](#build)
	* [Demos](#demos)
* [Contributing](#contributing)
	* [Update repo ](#update-repo-)
	* [Update readme ](#update-readme-)
	* [Update doc ](#update-doc-)
	* [Publish](#publish)
	* [modifying submodules](#modifying-submodules)
* [Questions](#questions)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-collectionview-swipemenu`


[](#configuration)

## Configuration

To install the plugin run:
```typescript
import install from '@nativescript-community/ui-collectionview-swipemenu';
install();
```

[](#api)

## API



[](#collectionview-extensions)

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


[](#usage)

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
        <gv:CollectionView items="items" rowHeight="100">
            <gv:CollectionView.itemTemplate>
                <gvs:SwipeMenu startingSide="startingSide">
                    <Label text="value" verticalAlignment="center"/>
                </gvs:SwipeMenu>
            </gv:CollectionView.itemTemplate>
        </gv:CollectionView>
    </GridLayout>
</Page>
```


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).