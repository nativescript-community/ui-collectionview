{{ load:../../tools/readme/edit-warning.md }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}

| <img src="https://github.com/nativescript-community/ui-collectionview/raw/master/images/demo-ios.gif" height="500" /> | <img src="https://github.com/nativescript-community/ui-collectionview/raw/master/images/demo-android.gif" height="500" /> |
| --- | ----------- |
| iOS Demo | Android Demo |

{{ template:toc }}

## Installation
Run the following command from the root of your project:

`ns plugin add {{ pkg.name }}`

## Configuration

To install the plugin run:
```typescript
import install from '@nativescript-community/ui-collectionview-waterfall';
install();
```

then simply use the `layoutStyle="waterfall"` as a collectionview property

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}