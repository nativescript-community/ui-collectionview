# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.2.0](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.9...v5.2.0) (2023-09-12)

### Bug Fixes

* **Android:** animated scrollToIndex ([a1c8624](https://github.com/@nativescript-community/ui-collectionview/commit/a1c8624f0d93c784132450ed3ede383194c0c503))

### Features

* add ScrollToIndex demo in Vue3 ([28fcb5f](https://github.com/@nativescript-community/ui-collectionview/commit/28fcb5f73c7ce94ad7b48a78fd37309cd71abb62))
* **android:** smooth scrolling to position now allows to choose snap to top or bottom ([b742d08](https://github.com/@nativescript-community/ui-collectionview/commit/b742d08044a4bd92dce0f982f3f9971b1988a7c3))

## [5.1.9](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.8...v5.1.9) (2023-08-13)

### Bug Fixes

* **android:** dont use iosIgnoreSafeArea on Android ([4d234cd](https://github.com/@nativescript-community/ui-collectionview/commit/4d234cdd2922adb81f7edfcce72004bd00ffd174))
* **android:** updated native dep ([f2b6013](https://github.com/@nativescript-community/ui-collectionview/commit/f2b6013e36d990296cda2781530962b6f8fe3872))

## [5.1.8](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.7...v5.1.8) (2023-07-23)

### Bug Fixes

* **android:** prevent crash on `disposeViewHolderViews` ([cc45d61](https://github.com/@nativescript-community/ui-collectionview/commit/cc45d61b6a9dfaa6b3a7c60d0e6af82394cc4278))
* Infinite loop on scrollToIndex with vue3 component; ([09070ab](https://github.com/@nativescript-community/ui-collectionview/commit/09070ab0a25e9abc67dca6a6bd3db9f9d6706360))

## [5.1.7](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.6...v5.1.7) (2023-05-25)

### Bug Fixes

* **ios:** fix relayout issues with autoReloadItemOnLayout in some cases ([597a256](https://github.com/@nativescript-community/ui-collectionview/commit/597a25641ea9e58cc6ceb14937711fffc08673da))

## [5.1.6](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.5...v5.1.6) (2023-05-15)

### Bug Fixes

* **swipemenu:** error when using non left menu ([0b5fad2](https://github.com/@nativescript-community/ui-collectionview/commit/0b5fad2beeecd673610810f671159925391e9dd5))

## [5.1.5](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.4...v5.1.5) (2023-05-11)

### Bug Fixes

* **ios:** prevent possible wrong layout (because of safe area) on some cells ([f1b1f51](https://github.com/@nativescript-community/ui-collectionview/commit/f1b1f51218ca11a98af24484cc22bde2fc0a5e12))

## [5.1.4](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.3...v5.1.4) (2023-04-28)

### Bug Fixes

* crash if items were not objects ([44ac472](https://github.com/@nativescript-community/ui-collectionview/commit/44ac4728c07579495425fc6ce64f554952683280))

## [5.1.3](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.2...v5.1.3) (2023-04-26)

### Bug Fixes

* **ios:** ObservableArray splice fix ([97b6b72](https://github.com/@nativescript-community/ui-collectionview/commit/97b6b7240ac3175e7f12d3e2a482b4afc7e9297e))

## [5.1.2](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.1...v5.1.2) (2023-04-26)

### Bug Fixes

* **collectionview:** regresssion fix for waterfall ([b4c40ed](https://github.com/@nativescript-community/ui-collectionview/commit/b4c40eda038556870741df0672ba6f8257c1fd23))
* **waterfall:** fixed crash after latest changes to collectionview ([2e315cb](https://github.com/@nativescript-community/ui-collectionview/commit/2e315cb89b335a7a4b3ab83ae31974825f2bbefc))

## [5.1.1](https://github.com/@nativescript-community/ui-collectionview/compare/v5.1.0...v5.1.1) (2023-04-25)

### Bug Fixes

* **collectionview:** refactor to allow plugins to have more access ([ac695e5](https://github.com/@nativescript-community/ui-collectionview/commit/ac695e5ad943404c9ea79a95e88b5297296f2e51))
* **swipemenu:** multiple fixes ([6c131af](https://github.com/@nativescript-community/ui-collectionview/commit/6c131afd5806c839329d5a5c0b18812a75509b8d))
* **swipemenu:** re enable backdrop by default which prevent interaction and allows click to close ([30cd05a](https://github.com/@nativescript-community/ui-collectionview/commit/30cd05aea83e12e77429c32bb2261c3adf2b28a7))

# [5.1.0](https://github.com/@nativescript-community/ui-collectionview/compare/v5.0.4...v5.1.0) (2023-04-25)

### Bug Fixes

* **ios:** animate cell update like androi ([594ba19](https://github.com/@nativescript-community/ui-collectionview/commit/594ba19903ca15f977f8e497a81de0f5dca25f8b))
* **ios:** autoReloadItemOnLayout fix allowing cell animation triggering layout changes ([6040054](https://github.com/@nativescript-community/ui-collectionview/commit/6040054d8129cdaaa1979cbe7375e7870dd0f984))
* **swipemenu:** ensure we install gesturehandler ([5f12147](https://github.com/@nativescript-community/ui-collectionview/commit/5f121476c40ee725fbe89b2db9a8fb8d01df7b6b))
* **swipmenu:** multiple fixes ([4b048b9](https://github.com/@nativescript-community/ui-collectionview/commit/4b048b93e6cab93b3777d64f621044bf05f5e66f))

### Features

* new swipemenu plugin ([f7fb6c6](https://github.com/@nativescript-community/ui-collectionview/commit/f7fb6c6f754cb3d41a3eb659bb48c1b4086429f2))

## [5.0.4](https://github.com/@nativescript-community/ui-collectionview/compare/v5.0.3...v5.0.4) (2023-04-19)

### Bug Fixes

* **ios:** Fix refreshVisibleItems not recalculating heights ([4042b45](https://github.com/@nativescript-community/ui-collectionview/commit/4042b45b65d212a9d588b358735d645d769d2c35))
* support items on which we might have called delete on a property ([4b15df2](https://github.com/@nativescript-community/ui-collectionview/commit/4b15df21b38c0b23faaf45b358ac9b667ebc7549))

## [5.0.3](https://github.com/@nativescript-community/ui-collectionview/compare/v5.0.2...v5.0.3) (2023-04-14)

### Bug Fixes

* **ios:** revert change which broke some refresh ([b90793f](https://github.com/@nativescript-community/ui-collectionview/commit/b90793f497da686f976145cd3022f9f2c4afda15))

## [5.0.2](https://github.com/@nativescript-community/ui-collectionview/compare/v5.0.1...v5.0.2) (2023-04-06)

### Bug Fixes

* fix for angular 15.x ([c21085c](https://github.com/@nativescript-community/ui-collectionview/commit/c21085cbe145c0b8168655b252f3eb208c82b4e3))

## [5.0.1](https://github.com/@nativescript-community/ui-collectionview/compare/v5.0.0...v5.0.1) (2023-03-31)

### Bug Fixes

* **ios:** much faster cells layout + improved `autoReloadItemOnLayout` ([bd71225](https://github.com/@nativescript-community/ui-collectionview/commit/bd712259df448c87b7bc455179bba33be89cd0bd))

# [5.0.0](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.73...v5.0.0) (2023-03-30)

### Features

* **ios:** improved cell size computation ([00d2350](https://github.com/@nativescript-community/ui-collectionview/commit/00d23502fa9f9ecf0bd50395eae38a92531d2193))

### BREAKING CHANGES

* **ios:** this needs testing to ensure it does not break anything for fixed size and dynamic size templates

## [4.0.73](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.72...v4.0.73) (2023-03-28)

### Bug Fixes

* **ios:** regression fix for items size ([9df1290](https://github.com/@nativescript-community/ui-collectionview/commit/9df129032da958e7e23685d90944ca18bb8641fa))

## [4.0.72](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.71...v4.0.72) (2023-03-27)

### Bug Fixes

* **ios:** dont reset all cell sizes on ObservableArray updates. Only the ones needed ([b06ede3](https://github.com/@nativescript-community/ui-collectionview/commit/b06ede3880bf8d60fbd06564ab85faa27bc6f463))

## [4.0.71](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.70...v4.0.71) (2023-03-19)

### Bug Fixes

* **ios:** prevent crash if ObservableArray triggers a change before a first refresh has been triggered ([4a216ad](https://github.com/@nativescript-community/ui-collectionview/commit/4a216ad5b7e5e87ddd9d9a75424b02475f658148))

## [4.0.70](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.69...v4.0.70) (2023-02-05)

### Bug Fixes

* **collectionview:** native-api-usage fix ([8720ccc](https://github.com/@nativescript-community/ui-collectionview/commit/8720ccc13762bf98db12874d27e42a9371728d4f))

## [4.0.69](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.68...v4.0.69) (2023-01-26)

### Bug Fixes

* **vue:** destroy componentInstance and not the parent component ([e55f054](https://github.com/@nativescript-community/ui-collectionview/commit/e55f054c043a8d3ccc48da20b1dfbf2ae6039029))
* **vue:** properly dispose vnodes ([8ecfc4a](https://github.com/@nativescript-community/ui-collectionview/commit/8ecfc4a8ffa0d5f14122ebeff5a91502a3fc2121))

## [4.0.68](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.67...v4.0.68) (2023-01-24)

### Bug Fixes

* **android:** native-api-usage fix ([f4afcc3](https://github.com/@nativescript-community/ui-collectionview/commit/f4afcc39344e2040eb59da3f5d6f7528a6fafcfe))

## [4.0.67](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.66...v4.0.67) (2023-01-24)

### Bug Fixes

* **android:** native-api-usage fix ([1fe110a](https://github.com/@nativescript-community/ui-collectionview/commit/1fe110ad5af0c65c920a9339a21f41ed409cf094))
* **android:** native-api-usage fix ([809e063](https://github.com/@nativescript-community/ui-collectionview/commit/809e063a993f3151969db5b3754b1ab9f2f9f482))

## [4.0.66](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.65...v4.0.66) (2023-01-20)

### Bug Fixes

* ensure `itemTemplateSelector` is called with the right context ([3c45096](https://github.com/@nativescript-community/ui-collectionview/commit/3c450965a70c33d2c7f6edbfde6f4ad4058a15f6))

## [4.0.65](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.64...v4.0.65) (2022-12-18)

### Bug Fixes

* invalid imports ([e5202d4](https://github.com/@nativescript-community/ui-collectionview/commit/e5202d45f1f13d6c272501a52372d2dc0a3d51a7))

## [4.0.64](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.63...v4.0.64) (2022-12-01)

**Note:** Version bump only for package nativeScript-collectionview

## [4.0.63](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.62...v4.0.63) (2022-10-05)

### Bug Fixes

* core xml builder fix ([d6ca2b6](https://github.com/@nativescript-community/ui-collectionview/commit/d6ca2b6aead2f43f2ee456435cbf846ed225d1a5))

## [4.0.62](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.61...v4.0.62) (2022-09-07)

### Bug Fixes

* **collectionview:** ios removed logs ([556fbb2](https://github.com/@nativescript-community/ui-collectionview/commit/556fbb21056d076a92dadc7cab3e1b05800f792f))

## [4.0.61](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.60...v4.0.61) (2022-09-07)

### Bug Fixes

* **collectionview:** default `autoReloadItemOnLayout` to false ([f826394](https://github.com/@nativescript-community/ui-collectionview/commit/f826394765116415fd4ded81f8da7b63552d853b))

## [4.0.60](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.59...v4.0.60) (2022-09-02)

### Bug Fixes

* **collectionview:** ios fixes for `autoReloadItemOnLayout` ([d19393d](https://github.com/@nativescript-community/ui-collectionview/commit/d19393d77080f8cf8f778107a25f5c42849b8fad))
* **ios:** no need to display cells if collectionview not layed out ([ef61912](https://github.com/@nativescript-community/ui-collectionview/commit/ef6191252a3c5ddbb4a9eae0018769b16397cde7))

## [4.0.59](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.58...v4.0.59) (2022-09-02)

### Features

* **collectionview:** iOS added `autoReloadItemOnLayout` ([554b2d5](https://github.com/@nativescript-community/ui-collectionview/commit/554b2d50b74750555070dde8067105256b61fd81))

## [4.0.58](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.57...v4.0.58) (2022-07-28)

**Note:** Version bump only for package @nativescript-community/ui-collectionview

## [4.0.57](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.56...v4.0.57) (2022-07-19)

### Bug Fixes

* **collectionview:** angular view disposing fix ([1cee7b8](https://github.com/@nativescript-community/ui-collectionview/commit/1cee7b8fc2455bd2250f106e8bc396a6e24b4c6a))
* **collectionview:** view disposing fix ([36bf7bc](https://github.com/@nativescript-community/ui-collectionview/commit/36bf7bc9fcdb8b802a6fe61368a9a82e200a61f1))

## [4.0.56](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.55...v4.0.56) (2022-07-17)

### Bug Fixes

* **android:** fix for collectionview + gesturehandlers ([3f87c16](https://github.com/@nativescript-community/ui-collectionview/commit/3f87c167792e129fe96a4c4cf745fd827362aaf6))

## [4.0.55](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.54...v4.0.55) (2022-07-16)

### Bug Fixes

* **collectionview:** recycling/dispose support thanks to [@edusperoni](https://github.com/edusperoni) ([400ebaa](https://github.com/@nativescript-community/ui-collectionview/commit/400ebaa3d58bbd9ad5c13da53f28aec099458c1b))

## [4.0.54](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.53...v4.0.54) (2022-07-15)

### Bug Fixes

* **collectionview:** fix regression after last changes ([8c9944e](https://github.com/@nativescript-community/ui-collectionview/commit/8c9944edabde2689e0b69526606808b781bef61c))

## [4.0.53](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.52...v4.0.53) (2022-07-11)

### Bug Fixes

* **collection,android:** prevent memory leaks (keeping references to viewHolders) ([845ef09](https://github.com/@nativescript-community/ui-collectionview/commit/845ef09e37325d5013f4d755db2f4a458eb36357))

## [4.0.52](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.51...v4.0.52) (2022-05-17)

### Bug Fixes

* **collectionview:** android fix for spanSize ([d29b02b](https://github.com/@nativescript-community/ui-collectionview/commit/d29b02b11ac7b66368da555c07ab93e5bbe89915))

## [4.0.51](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.50...v4.0.51) (2022-05-14)

### Bug Fixes

* svelte batch update ([f9a708a](https://github.com/@nativescript-community/ui-collectionview/commit/f9a708ab71d9c278cefa4be8f12135ad480297af))

## [4.0.50](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.49...v4.0.50) (2022-05-12)

### Bug Fixes

* **collectionview:** vue fix for slider reusing ([43114dc](https://github.com/@nativescript-community/ui-collectionview/commit/43114dceb9a21fc772465ab15894efdab5cccde2))

## [4.0.49](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.48...v4.0.49) (2022-04-30)

### Bug Fixes

* **android:** prevent unecessary duplicate layouts ([332f8db](https://github.com/@nativescript-community/ui-collectionview/commit/332f8dbb10027fafaffbcbad52e89531a5998c06))
* clean script ([8c02617](https://github.com/@nativescript-community/ui-collectionview/commit/8c026179a08b0076b9a3d7820aea5f1d59e3e15c))

### Features

* new “binded” event for when a template is binded (reused) ([0813487](https://github.com/@nativescript-community/ui-collectionview/commit/0813487359aa1cf8138e0e19b5a4d3d3b6c178d5))

## [4.0.48](https://github.com/@nativescript-community/ui-collectionview/compare/v4.0.47...v4.0.48) (2021-11-25)

### Bug Fixes

* **ios:** measurement fix on orientation change ([62d7ba9](https://github.com/@nativescript-community/ui-collectionview/commit/62d7ba96c7140661c08e94675fdbb8dd864d1b74))
* vue templates demo span ([5498c02](https://github.com/@nativescript-community/ui-collectionview/commit/5498c02d3b5223b2c732dc66f19c2336d4eab95f))

### Reverts

* Revert "chore: cleanup" ([d42d50c](https://github.com/@nativescript-community/ui-collectionview/commit/d42d50cc90c4e8c94d668b7d0ae711f7c8e132c0))

## [4.0.47](https://github.com/Akylas/nativescript-collectionview/compare/v4.0.46...v4.0.47) (2021-11-10)

### Bug Fixes

* file permissions ([52babd6](https://github.com/Akylas/nativescript-collectionview/commit/52babd68e7c64a0fded8433deac53cb08d5b3885))
* **waterfall:** fix issue with item marging ([08543ef](https://github.com/Akylas/nativescript-collectionview/commit/08543ef93b4722612fbc763b43f5bd90a62d9771))

### Features

* add demo for templates ([c9a3eb5](https://github.com/Akylas/nativescript-collectionview/commit/c9a3eb504bfc79c655e2ecdc51ebd2b8b21598f9))
* add horizontal grid demo ([064873a](https://github.com/Akylas/nativescript-collectionview/commit/064873a25bc1b72ebc0f3da5b49a8c51bbc11693))
* add waterfall demo ([12c912d](https://github.com/Akylas/nativescript-collectionview/commit/12c912d73a2b34b0c4883a6ce120bafd74ecf45d))
