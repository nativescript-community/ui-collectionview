<template>
    <Page>
        <ActionBar>
            <Label text="Simple Grid" />
            <ActionItem @tap="refresh" ios.systemIcon="16" ios.position="right" text="refresh" />
            <ActionItem @tap="test" ios.systemIcon="12" ios.position="right" text="test" />
        </ActionBar>

        <GridLayout>
            <CollectionView
                    :width="collectionViewWidth"
                :items="itemList"
                @itemTap="onItemTap"
                @loadMoreItems="onLoadMoreItems"
                itemIdGenerator="index"
                colWidth="50%"
                rowHeight="200"
                @loaded="onCollectionViewLoaded"
            >
                <v-template>
                    <!-- <GridLayout rows="auto,*" @loaded="onTemplateLoaded" @unloaded="onTemplateUnloaded" @binded="onViewBinded" > -->
                        <!-- <Label text="X" backgroundColor="green" /> -->
                        <GridLayout id="scroller" rowSpan="2" rows="*, auto" :backgroundColor="item.color" class="item" >
                            <StackLayout row="1">
                                <Label row="1" :text="item.name" class="title" />
                                <Label row="1" :text="item.color" class="subtitle" />
                            </StackLayout>
                        </GridLayout>
                    <!-- </GridLayout> -->
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { Animation, CoreTypes, ObservableArray, Utils, View } from '@nativescript/core';

// import {
//     GestureHandlerStateEvent,
//     GestureHandlerTouchEvent,
//     GestureState,
//     GestureStateEventData,
//     GestureTouchEventData,
//     HandlerType,
//     Manager,
//     PanGestureHandler
// } from '@nativescript-community/gesturehandler';

const DEFAULT_TRIGGER_WIDTH = 20;
const OPEN_DURATION = 200;
function transformAnimationValues(values) {
    values.translate = { x: values.translateX || 0, y: values.translateY || 0 };
    values.scale = { x: values.scaleX || 1, y: values.scaleY || 1 };
    delete values.translateX;
    delete values.translateY;
    delete values.scaleX;
    delete values.scaleY;
    return values;
}
export default {
    data() {
        const items = ([
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
        ]);
        return {
            itemList: items,
            collectionViewWidth:"100%"
        };
    },
    methods: {
        onViewBinded(e) {
            const view = e.object;
            const gestureData = view['gestureData'] || {};
            const trData = this.computeTranslationData(gestureData, 0);
            this.applyTrData(trData, { view: view.getViewById('scroller') });
        },
        onCollectionViewLoaded(e) {
            // const view = e.object;
            // const manager = Manager.getInstance();
            // const gestureHandler = manager.createGestureHandler(HandlerType.NATIVE_VIEW, 12350, {
            // disallowInterruption:false
            // shouldStartGesture: this.shouldStartGesture.bind(this),
            // simultaneousHandlers: this.simultaneousHandlers,
            // waitFor: this.waitFor,
            // waitFor: [12351]
            // minDist: this.gestureMinDist
            // });
            // gestureHandler.attachToView(view);
            // view.nativeGestureHandler = gestureHandler as any;
        },
        onTemplateLoaded(e) {
            const view = e.object;
            // const manager = Manager.getInstance();
            // const gestureHandler = manager.createGestureHandler(HandlerType.PAN, 12351, {
                // shouldStartGesture: this.shouldStartGesture.bind(this),
                // simultaneousHandlers: this.simultaneousHandlers,
                // simultaneousHandlers: [12350],
                // activeOffsetXStart: -10,
                // activeOffsetXEnd: 10
                // minDist: 15
            // });
            // gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouch, this);
            // gestureHandler.on(GestureHandlerStateEvent, this.onGestureState, this);
            // gestureHandler.attachToView(view);
            // view.panGestureHandler = gestureHandler as any;
        },
        onTemplateUnloaded(e) {
            const view = e.object;
            // const panGestureHandler = view.panGestureHandler;
            // if (panGestureHandler) {
            //     panGestureHandler.off(GestureHandlerTouchEvent, this.onGestureTouch, this);
            //     panGestureHandler.off(GestureHandlerStateEvent, this.onGestureState, this);
            //     panGestureHandler.detachFromView();
            //     view.panGestureHandler = null;
            // }
        },
        // onGestureState(args: GestureStateEventData) {
        //     const { state, prevState, extraData, view } = args.data;
        //     if (state === GestureState.ACTIVE) {
        //         let gestureData = view['gestureData'];
        //         if (!gestureData) {
        //             gestureData = view['gestureData'] = { translationX: 0, prevDeltaX: 0 };
        //             gestureData.viewWidth = Math.ceil(Utils.layout.toDeviceIndependentPixels(view.getMeasuredWidth()));
        //         }
        //     }
        //     // this.updateIsPanning(state);

        //     if (prevState === GestureState.ACTIVE) {
        //         // this.needToSetSide = null;
        //         // const side = this.showingSide;
        //         // if (!side || (this.shouldPan && !this.shouldPan(side))) {
        //         //     return;
        //         // }
        //         const { velocityX, velocityY, translationX, translationY } = extraData;

        //         const dragToss = 0.05;

        //         const gestureData = view['gestureData'];

        //         let destSnapPoint = 0;
        //         const viewWidth = gestureData.viewWidth;
        //         const viewX = gestureData.translationX;
        //         const x = translationX - gestureData.prevDeltaX;
        //         gestureData.prevDeltaX = 0;
        //         const totalDelta = x + dragToss * velocityX;
        //         console.log('totalDelta', viewX, x, totalDelta)

        //         // if (side === 'left') {
        //         if (totalDelta < -DEFAULT_TRIGGER_WIDTH) {
        //             destSnapPoint = 0;
        //         } else if (totalDelta > DEFAULT_TRIGGER_WIDTH) {
        //             destSnapPoint = viewWidth;
        //         } else {
        //             const endOffsetX = viewX + totalDelta;
        //             const progress = Math.abs(endOffsetX / viewWidth);
        //             destSnapPoint = progress > 0.8 ? viewWidth : 0;
        //         }
        //         // } else if (side === 'right') {
        //         //     if (-totalDelta < -DEFAULT_TRIGGER_WIDTH) {
        //         //         destSnapPoint = 0;
        //         //     } else if (-totalDelta > DEFAULT_TRIGGER_WIDTH) {
        //         //         destSnapPoint = viewWidth;
        //         //     } else {
        //         //         const endOffsetX = viewX + totalDelta;
        //         //         const progress = Math.abs(endOffsetX / viewWidth);
        //         //         destSnapPoint = progress > 0.5 ? viewWidth : 0;
        //         //     }
        //         // }
        //         this.animateToPosition(destSnapPoint, view, { view: view.getViewById('scroller') });
        //     }
        // },
        async animateToPosition(position, view, views, duration = OPEN_DURATION) {
            // if (this.showingSide && side !== this.showingSide) {
            //     this.animateToPosition(this.showingSide, 0, duration);
            // }
            const gestureData = view['gestureData'];
            const width = gestureData.viewWidth;
            const trData = this.computeTranslationData(gestureData, width - position);
            gestureData.translationX = width - position;

            // if (position !== 0) {
            //     this.showingSide = side;
            //     const drawer = this[side + 'Drawer'] as View;
            //     if (drawer) {
            //         drawer.visibility = 'visible';
            //     }
            //     if (trData.backDrop && trData.backDrop.opacity > 0 && this.backDrop.visibility !== 'visible') {
            //         this.backDrop.opacity = 0;
            //         this.backDrop.visibility = 'visible';
            //     }
            //     this.notify({ eventName: 'open', side, duration } as DrawerEventData);
            // } else {
            //     this.showingSide = null;
            //     this.notify({ eventName: 'close', side, duration } as DrawerEventData);
            // }
            const params = Object.keys(trData)
                .map(
                    (k) =>
                        this[k] &&
                        Object.assign(
                            {
                                target: this[k],
                                curve: CoreTypes.AnimationCurve.easeInOut,
                                duration
                            },
                            transformAnimationValues(trData[k])
                        )
                )
                .filter((a) => !!a);
            try {
                await new Animation(params).play();
            } catch (err) {
                console.error('animateToPosition', err);
            } finally {
                // apply tr data to prevent hickups on iOS
                // and handle animation cancelled errors
                // if ((position !== 0 && this.showingSide === side) || (position === 0 && !this.showingSide)) {
                this.applyTrData(trData, views);
                if (position !== 0) {
                } else {
                    // const drawer = this[side + 'Drawer'] as View;
                    // if (drawer) {
                    //     drawer.visibility = 'hidden';
                    // }
                    // if (trData.backDrop) {
                    //     this.backDrop.visibility = 'hidden';
                    // }
                }
                // }
            }
        },
        // onGestureTouch(args: GestureTouchEventData) {
        //     const { state, extraData, view } = args.data;
        //     if (state !== GestureState.ACTIVE) {
        //         return;
        //     }
        //     const deltaX = extraData.translationX;
        //     // if (this.isAnimating || !this.isPanning || deltaX === 0 || (this.shouldPan && !this.shouldPan(side))) {
        //     //     this.prevDeltaX = deltaX;
        //     //     return;
        //     // }

        //     const gestureData = view['gestureData'];
        //     const width = gestureData.viewWidth;

        //     const viewX = gestureData.translationX - width;

        //     const x = deltaX - gestureData.prevDeltaX;
        //     // if (this.showingSide === 'left') {
        //     // x = -x;
        //     // }
        //     // const trX = this.constrainX(this.showingSide, viewX + x);
        //     const trX = viewX + x;

        //     gestureData.translationX = width + trX;
        //     const trData = this.computeTranslationData(gestureData, Math.max(0, width + trX));
        //     this.applyTrData(trData, { view: view.getViewById('scroller') });
        //     gestureData.prevDeltaX = deltaX;
        // },
        applyTrData(trData: { [k: string]: any }, views: { [k: string]: View }) {
            Object.keys(trData).forEach((k) => {
                if (views[k]) {
                    Object.assign(views[k], trData[k]);
                }
            });
        },
        computeTranslationData(gestureData, value) {
            const width = gestureData.viewWidth;
            const delta = Math.max(width - value, 0);
            const progress = delta / width;
            // if (this.translationFunction) {
            //     return this.translationFunction(side, width, value, delta, progress);
            // }
            return {
                // mainContent: {
                //     translateX: 0
                // },
                view: {
                    translateX: value
                }
                // backDrop: {
                //     translateX: 0,
                //     opacity: progress
                // }
            };
        },
        onItemTap({ index, item }) {
            console.log(`EVENT TRIGGERED: Tapped on ${index} ${item.name}`);
        },
        test(){
            this.collectionViewWidth = this.collectionViewWidth == "100%" ? "50%" : "100%"
        },
        refresh() {
            this.itemList = ([
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
    ]);
        },
         onLoadMoreItems() {
        console.log('EVENT TRIGGERED: onLoadMoreItems()');
        this.itemList = this.itemList.concat([
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
    ]);
        },
        logEvent(e) {
            console.log('logEvent', e.eventName, e.extraData);
        }
    }
};
</script>

<style scoped lang="scss">
ActionBar {
    background-color: #42b883;
}
.item {
    padding: 10;
    color: white;
    .title {
        font-size: 17;
        font-weight: bold;
    }
    .subtitle {
        font-size: 14;
    }
}
</style>
