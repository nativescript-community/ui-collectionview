<script context="module" lang="ts">
    import { View } from '@nativescript/core';
    let ID = 0;
</script>

<script lang="ts">
    export let item;
    export let height;
    const myId = ID++;

    function updateheight(item) {
        height = item.showMenu === true ? 200 : 100;
        console.log('height', myId, height);
    }

    async function resizeCell(event) {
        try {
            const newValue = item.showMenu === true ? false : true;
            console.log('resizeCell', myId, item.showMenu, newValue);
            async function animate(options = {}) {
                const newHeight = newValue ? 200 : 100;
                return (event.object as View).animate({ height: newHeight, ...options, duration: 300 });
            }
            if (__ANDROID__) {
                await animate();
                item.showMenu = newValue;
            } else {
                item.showMenu = newValue;
            }
            // we update it after so that the svelte component also updates its value
        } catch (error) {
            console.error(error);
        }
    }
</script>

<gridlayout id="resizeHolder" {height} rows="101,100" verticalAlignment="top" on:tap={resizeCell}>
    <stacklayout class="item" backgroundColor={item.color} row="0">
        <label class="title" row="1" text={item.name} />
        <label class="subtitle" row="1" text={item.color} />
    </stacklayout>
    <stacklayout height="100" orientation="horizontal" row="1">
        <label backgroundColor="red" height="100%" text="a" textAlignment="center" width="100" />
        <label backgroundColor="blue" height="100%" text="b" textAlignment="center" width="100" />
    </stacklayout>
</gridlayout>
