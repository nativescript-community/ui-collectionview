import {
    defineComponent,
    h,
    ref,
} from "nativescript-vue";

export const SwipeMenuComp = defineComponent({
    setup() {
        const swipeMenu = ref();
        const open = (side) => swipeMenu.value.nativeView.open(side);
        const close = (side) => swipeMenu.value.nativeView.close(side);
        const isOpened = (side) => swipeMenu.value.nativeView.isOpened(side);
        const toggle = (side) => swipeMenu.value.nativeView.toggle(side);


        return () => {
            return h(
                "NativeSwipeMenu",
                {
                    ref: swipeMenu,
                    open,
                    close,
                    isOpened,
                    toggle,
                }
            );
        };
    }
})
