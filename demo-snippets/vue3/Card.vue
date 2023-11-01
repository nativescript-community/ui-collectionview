<script lang="ts" setup>
import { PropType } from "nativescript-vue";
import { Card } from "./types";

const props = defineProps({
    data: {
        type: Object as PropType<Card>,
        required: true
    }
})
</script>

<template>
    <GridLayout padding="4">
        <FlexboxLayout borderRadius="16" boxShadow="0 0 3 3 rgba(0,0,0,.12)" :backgroundColor="data.backgroundColor" class="flex-col p-3 justify-between rounded-lg h-full">
            <FlexboxLayout class="justify-between">
                <Label text="Credit" class="text-xl font-bold text-white"></Label>
                <!-- <Image :src="props.data.imgType" height="45"></Image> -->
            </FlexboxLayout>
            <FlexboxLayout class="flex-col">
                <Label :text="data.name" class="text-xl text-white"></Label>
                <Label :text="data.number" class="text-lg text-white"></Label>
            </FlexboxLayout>
        </FlexboxLayout>
    </GridLayout>
</template>