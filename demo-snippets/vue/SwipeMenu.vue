<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <Label text="All Sides" />
        </ActionBar>

        <GridLayout rows="auto,*">
            <CollectionView :items="items" row="1" rowHeight="100" ref="collectionView" autoReloadItemOnLayout="true">
                <v-template>
                    <SwipeMenu rightSwipeDistance="300" :translationFunction="drawerTranslationFunction" :startingSide="item.startingSide">
                        <Gridlayout rows="*, auto" :backgroundColor="item.color" class="item" ~mainContent width="100%">
                            <Stacklayout row="1">
                                <Label row="1" :text="item.name" class="title" />
                                <Label row="1" :text="item.color" class="subtitle" />
                            </Stacklayout>
                        </Gridlayout>
                        <Stacklayout ~rightDrawer orientation="horizontal" width="200">
                            <Label :text="item.menuOpened ? 'opened' : 'a'" width="100" height="100%" backgroundColor="red" textAlignment="center" />
                            <Label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
                        </Stacklayout>
                    </SwipeMenu>
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { ObservableArray } from '@nativescript/core';
import Vue from 'vue';
export default Vue.extend({
    computed: {
        message() {
            return 'Blank {N}-Vue app';
        }
    },
    data() {
        return {
            item: undefined, // only for vetur errors
            items: new ObservableArray([
                { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
                { index: 1, name: 'EMERALD', color: '#2ecc71' },
                { index: 2, name: 'PETER RIVER', color: '#3498db' },
                { index: 3, name: 'AMETHYST', color: '#9b59b6' },
                { index: 4, name: 'WET ASPHALT', color: '#34495e' },
                { index: 5, name: 'GREEN SEA', color: '#16a085' },
                { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
                { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
                { index: 8, name: 'WISTERIA', color: '#8e44ad' },
                { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
                { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
                { index: 11, name: 'CARROT', color: '#e67e22' },
                { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
                { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
                { index: 14, name: 'CONCRETE', color: '#95a5a6' },
                { index: 15, name: 'ORANGE', color: '#f39c12' },
                { index: 16, name: 'PUMPKIN', color: '#d35400' },
                { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
                { index: 18, name: 'SILVER', color: '#bdc3c7' },
                { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
            ])
        };
    },
    methods: {
        drawerTranslationFunction(side, width, value, delta, progress) {
            const result = {
                mainContent: {
                    translateX: side === 'right' ? -delta : delta
                }
            } as any;

            return result;
        }
    }
});
</script>

<style lang="scss" scoped></style>
