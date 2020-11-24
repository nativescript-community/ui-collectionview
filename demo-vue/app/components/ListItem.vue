<template>
    <GridLayout
        columns="20%,*,auto,20%"
        rows="*,auto,auto,*,1"
        :rippleColor="accentColor"
        :backgroundColor="selected ? accentColor : undefined"
        @tap="$emit('tap', $event)"
        @longPress="onLongPress($event)"
    >
        <Label col="1" row="1" fontSize="16" :text="title" verticalAlignment="center" textWrap maxLines="2" />
        <Label v-show="!!subtitle" col="1" row="2" fontSize="14" class="roboto" :text="subtitle" verticalAlignment="top" />
        <Label col="2" row="1" fontSize="12" class="roboto" :text="date" verticalAlignment="top" />
        <Label backgroundColor="red" col="2" rowSpan="4" v-show="!!rightValue" class="listRightValue" :text="rightValue" />
        
    </GridLayout>
</template>

<script lang="ts" src="./ListItem.ts"></script>
