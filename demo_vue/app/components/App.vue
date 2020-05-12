<template>
    <Page>
        <StackLayout>
            <CollectionView width="100%" height="100%" rowHeight="80" ref="listView" :items="itemList" @itemTap="onItemTap" itemIdGenerator="index">
                <v-template>
                    <GridLayout columns="16,auto,*,auto,16" rows="12,auto,*,auto" rippleColor="red" backgroundColor="white">
                        <Label
                            v-show="!!item.leftIcon"
                            col="1"
                            row="0"
                            rowSpan="5"
                            fontSize="24"
                            marginRight="16"
                            textAlignment="left"
                            :text="item.leftIcon"
                            horizontalAlignment="left"
                            verticalAlignment="center"
                            color="gray"
                            class="mdi"
                        />
                        <Image
                            v-show="item.avatar"
                            backgroundColor="gray"
                            col="1"
                            row="1"
                            rowSpan="3"
                            width="40"
                            height="40"
                            stretch="aspectFill"
                            marginRight="16"
                            :src="item.avatar"
                            verticalAlignment="center"
                            borderRadius="20"
                            android:roundAsCircle="true"
                        />

                        <StackLayout col="2" row="1" rowSpan="2" verticalAlignment="center">
                            <Label col="2" row="1" :fontSize="10" v-show="!!item.overText" :text="item.overText | uppercase" verticalAlignment="center" color="gray" />
                            <Label :fontSize="17" :text="item.title" textWrap="true" verticalTextAlignment="top" maxLines="2" lineBreak="end" />
                            <Label v-show="!!item.subtitle" :fontSize="14" :text="item.subtitle" verticalTextAlignment="top" color="gray" maxLines="2" lineBreak="end" />
                        </StackLayout>

                        <Label col="3" row="1" fontSize="10" v-show="!!item.date" :text="item.date" verticalAlignment="top" />
                        <GridLayout col="3" row="1" rowSpan="2" verticalAlignment="center">
                            <Label v-show="!!item.rightIcon" class="mdi" :fontSize="24" textAlignment="right" color="gray" :text="item.rightIcon" verticalAlignment="center" />
                            <Button variant="flat" v-show="!!item.rightButton" class="icon-themed-btn" :text="item.rightButton" verticalAlignment="center" @tap="$emit('rightTap')" />
                        </GridLayout>

                        <AbsoluteLayout row="3" colSpan="5" marginTop="12" marginLeft="20" backgroundColor="gray" height="1" verticalAlignment="bottom" />
                    </GridLayout>
                </v-template>
            </CollectionView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
const DetailsPage = {
    template: `
  <Page>
    <ActionBar class="action-bar" title="Details Page">
      <ActionItem text="Action"></ActionItem>
    </ActionBar>
    <StackLayout>
      <Label :text="'Details ' + Math.random()" />
      <Button text="another" @tap="openDetails" />
      <Button text="back" @tap="goBack" />
    </StackLayout>
  </Page>
  `,

    methods: {
        openDetails() {
            this.$navigateTo(DetailsPage);
        },
        goBack() {
            this.$navigateBack();
        }
    }
};

export default {
    data() {
        const items = [];
        for (let loop = 0; loop < 1000; loop++) {
            items.push({ index:loop, leftIcon: 'mdi-magnify', title: 'title ' + loop.toString(), subtitle: 'subtitle ' + loop.toString() });
        }
        return {
            itemList: items
        };
    },
    methods: {
        onItemTap({ index, item }) {
            console.log(`Tapped on ${index} ${item.title}`);
            this.$navigateTo(DetailsPage);
        },
        logEvent(e) {
            console.log('logEvent', e.eventName, e.extraData);
        }
        // itemIdGenerator(item, i) {
        //   return item.index;
        // }
    }
};
</script>

<style scoped>
ActionBar {
    background-color: #53ba82;
    color: #ffffff;
}

.message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
}
</style>
