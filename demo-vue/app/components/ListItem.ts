import { Component, Prop } from 'vue-property-decorator';
import Vue from 'nativescript-vue';

@Component({
    inheritAttrs: false
})
export default class ListItem extends Vue {
    @Prop({})
    title: string;
    @Prop({})
    subtitle: string;
    @Prop({})
    date: string;
    @Prop({})
    rightValue: string;

    @Prop({ default: false })
    selected: boolean;

    onLongPress(event) {
        // this.selected = !this.selected;
        this.$emit('longPress', event);
    }
}
