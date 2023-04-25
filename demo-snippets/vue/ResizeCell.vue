<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <Label text="All Sides" />
        </ActionBar>

        <GridLayout rows="auto,*">
            <!-- <GridLayout class="item" rows="101,100" @tap="resizeCell(null, $event)" :height="showMenu === true ? 200 : 100" backgroundColor="green">
                <Stacklayout row="0">
                    <Label row="1" text="green" class="title" />
                    <Label row="1" text="green" class="subtitle" />
                </Stacklayout>
                <Stacklayout row="1" orientation="horizontal" height="100">
                    <Label :text="'a'" width="100" height="100%" backgroundColor="red" textAlignment="center" />
                    <Label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
                </Stacklayout>
            </GridLayout> -->
            <CollectionView :items="items" ref="collectionView" row="1" :autoReloadItemOnLayout="true">
                <v-template>
                    <GridLayout class="item" rows="101,100" @tap="resizeCell(item, $event)" :height="getItemHeight(item)" :backgroundColor="item.color">
                        <Stacklayout row="0">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </Stacklayout>
                        <Stacklayout row="1" orientation="horizontal" height="100">
                            <Label :text="'a'" width="100" height="100%" backgroundColor="red" textAlignment="center" />
                            <Label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
                        </Stacklayout>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { ObservableArray, View } from '@nativescript/core';
import Vue from 'vue';
export default Vue.extend({
    computed: {
        message() {
            return 'Blank {N}-Vue app';
        }
    },
    data() {
        return {
            showMenu: false,
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
        getItemHeight(item) {
            // console.log('getItemHeight', item)
            return item.showMenu === true ? 200 : 100
        },
        async resizeCell(item, event) {
            try {
                const actualItem = item || this;
                actualItem.showMenu = !actualItem.showMenu;
                async function animate(options = {}) {
                    const newHeight = actualItem.showMenu ? 200 : 100;
                    return (event.object as View).animate({ height: newHeight, ...options, duration: 300 });
                }

                const updateItem = () => {
                    if (item) {
                        const index = this.items.findIndex((i) => i === item);
                        // console.log('updateItem', index, item);
                        this.items.setItem(index, item);
                    }
                };
                // if (__ANDROID__) {
                // const start = Date.now();
                await animate();
                // setTimeout(updateItem, 100)
                // updateItem();
                // } else {
                //     const start = Date.now();
                //     console.log('animate start');
                //     await animate({
                //         animationBlock: () => {
                //             try {
                //                 console.log('animationBlock');
                //                 // updateItem();
                //                 console.log('animationBlock done');
                //             } catch (error) {
                //                 console.error(error);
                //             }
                //         }
                //     });
                //     console.log('animate done', Date.now() - start);
                // }
            } catch (error) {
                console.error(error);
            }
        }
    }
});
</script>

<style lang="scss" scoped></style>
