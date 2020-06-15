<template functional>
    <GridLayout rows="60, auto, 40">
        <Label row="0"
               textAlignment="center"
               :text="props.item.type + ' ' + props.index"/>

        <!-- Content -->
        <ContentView row="1">
            <slot>
                <Label textWrap :text="props.item.body" row="1" class="content"/>
            </slot>
        </ContentView>

        <GridLayout columns="*, *" row="2">
            <Button @tap="() => listeners.toggleLike()"
                    :text="props.item.liked ? ' Unlike' : ' Like'"
                    :color="props.item.liked ? 'blue' : 'black'"
                    col="0" row="1"/>
            <Button text="Blah"
                    col="1" row="1"/>
        </GridLayout>
    </GridLayout>
</template>

<script>
  export default {
    functional: true,
    props: {
      item: {
        type: Object,
        required: true
      },
      index: Number
    }
  }
</script>
