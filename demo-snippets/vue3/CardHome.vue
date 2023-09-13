<script lang="ts" setup>
import { ref, $navigateTo, $showModal } from 'nativescript-vue';
import { HEIGH_CARD, dataCards } from './carddata';
import { isAndroid, ObservableArray, PageTransition, SharedTransition, View, ModalTransition, Screen } from '@nativescript/core';
import { animateView, configHomeSharedTransition } from './animation';
import Card from './Card.vue';
// import Details from "./Details.vue";

const isOpen = ref(false);
const refShowBtn = ref();
const refAddBtn = ref();
const refTextHeader = ref();

const items = new ObservableArray(dataCards);

const transaleY = 70;
const viewCards: View[] = [];

function loadedCard(args: any, index: number) {
    const card: View = args.object;
    if (!isOpen.value && viewCards.length < dataCards.length) {
        viewCards.push(card);
        card.translateY = -(HEIGH_CARD - transaleY) * index;
    }
}

function toggleStatus() {
    const showBtn: View = refShowBtn.value.nativeView;
    const addBtn: View = refAddBtn.value.nativeView;
    const addWalletBtn: View = addBtn.getViewById('icon-add');
    const textHeader: View = refTextHeader.value.nativeView;

    if (isOpen.value) {
        viewCards.forEach((cardView, index) => index == 0 || close(cardView, index));
        animateView(addBtn, { translate: { y: 0, x: 0 }, alpha: 1, rotation: 0 });
        animateView(addWalletBtn, { rotation: 0 });
        animateView(showBtn, { rotation: 90, alpha: 0 });
        animateView(textHeader, { translate: { x: 0, y: 0 } });
    } else {
        viewCards.forEach((cardView) => open(cardView));
        animateView(addBtn, { translate: { y: 50, x: 0 }, alpha: 0 });
        animateView(addWalletBtn, { rotation: 180 });
        animateView(showBtn, { rotation: 0, alpha: 1 });
        animateView(textHeader, { translate: { x: -(Screen.mainScreen.widthDIPs / 2) + textHeader.getActualSize().width / 2 + 10, y: 0 } });
    }
    isOpen.value = !isOpen.value;
}

function open(cardView: View) {
    animateView(cardView, { translate: { x: 0, y: 0 } });
}

function close(cardView: View, index: number) {
    animateView(cardView, { translate: { x: 0, y: -(HEIGH_CARD - transaleY) * index } });
}

function openOrGoToDetails(index: number) {
    // if (isOpen.value) {
    // if (isAndroid) {
    //   $navigateTo(Details, {
    //     transition: SharedTransition.custom(new PageTransition(), configHomeSharedTransition),
    //     props: { index, card: dataCards[index] }
    //   });
    // } else {
    //   $showModal(Details, {
    //     transition: SharedTransition.custom(new ModalTransition(), configHomeSharedTransition),
    //     props: { index, card: dataCards[index] }
    //   });
    // }
    // } else {
    toggleStatus();
    // }
}
let currentToggledIndex = -1;
function toggleItemHeight(item) {
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
        if (!item.expanded && currentToggledIndex !== -1) {
            const currentItem = items.getItem(currentToggledIndex);
            currentItem.expanded = false;
            items.setItem(currentToggledIndex, currentItem);
        }
        item.expanded = !!!item.expanded;
        currentToggledIndex = item.expanded ? index : -1;
        items.setItem(index, item);
    }
}
</script>

<template>
    <Page actionBarHidden="true" androidStatusBarBackground="transparent" class="bg-white">
        <GridLayout rows="auto,*,auto">
            <GridLayout height="50" android:marginop="3">
                <Label ref="refTextHeader" text="Wallet" class="text-3xl font-bold text-black" horizontalAlignment="center"></Label>
                <Label ref="refShowBtn" text="close" style="font-size: 24;" height="45" width="45" rotate="90" class="m-icon-round bg-[#0666eb] rounded-full text-white text-center opacity-0 mr-2" horizontalAlignment="right" @tap="toggleStatus"></Label>
            </GridLayout>
            <CollectionView row="1" height="100%" :items="items" itemIdGenerator="index" :itemOverlap="`-${HEIGH_CARD - 60} 0 0 0`">
                <template #default="{ item }">
                    <GridLayout :height="item.expanded ? 2*HEIGH_CARD - 60 : HEIGH_CARD">
                        <Card :height="HEIGH_CARD" :data="item" :sharedTransitionTag="`card_${item.id}`" @tap="toggleItemHeight(item)" verticalAlignment="top">
                        </Card>
                    </GridLayout>
                </template>
            </CollectionView>
            <!-- <FlexboxLayout height="100%" marginTop="2" flexDirection="column">
                    <Card v-for="(card, index) in dataCards" :key="index" :style="{ 'height': HEIGH_CARD }" :data="card" :sharedTransitionTag="`card_${index}`" @loaded="loadedCard($event, index)" @tap="openOrGoToDetails(index)">
                    </Card>
                </FlexboxLayout> -->
            <FlexboxLayout ref="refAddBtn" verticalAlignment="bottom" class="justify-center items-center" height="100">
                <Label id="icon-add" text="add" height="60" width="60" class="m-icon-round bg-[#0666eb] text-center text-white rounded-xl"></Label>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>