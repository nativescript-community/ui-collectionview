<template>
    <Page>
        <ActionBar>
            <Label text="Simple Grid" />
        </ActionBar>

        <GridLayout>
            <CollectionView
                    :width="collectionViewWidth"
                :items="itemList"
                itemIdGenerator="index"
                estimatedItemSize="false"
                colWidth="50%"
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

export default {
    data() {
        const items = ([
            { index: 0, name: 'TURQUOISE', color: '#1abc9c' }
        ]);
        return {
            itemList: items,
            collectionViewWidth:"100%"
        };
    },
    methods: {
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
