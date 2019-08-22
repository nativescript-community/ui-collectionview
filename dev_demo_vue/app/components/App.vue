<template>
  <Page>
    <StackLayout>
      <CollectionView width="100%" height="100%" rowHeight="60" ref="listView" :items="itemList" @itemTap="onItemTap" backgroundColor="blue">
        <v-template>
          <StackLayout orientation="vertical" borderRadius="4" backgroundColor="yellow">
            <Label :text="item.value" backgroundColor="white"></Label>
          </StackLayout>
        </v-template>
      </CollectionView>
    </StackLayout>
  </Page>
</template>

<script>

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
      this.$navigateTo(DetailsPage)
    },
    goBack() {
      this.$navigateBack()
    }
  }
}

export default {
  data() {
    const items=  [];
    for (let loop = 0; loop < 1000; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    return {
      itemList: items
    }
  },
  methods: {
    onItemTap({ item }) {
      console.log(`Tapped on ${item.name}`);
      this.$navigateTo(DetailsPage)
    },
  }
}
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
