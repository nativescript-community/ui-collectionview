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
import install from '@nativescript-community/ui-collectionview-alignedflowlayout';
install();
```

then simply use the `layoutStyle="align"` as a collectionview property
You can then use `layoutHorizontalAlignment`(left, right, justified) and `verticalHorizontalAlignment` (top, bottom, center)

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}