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
        console.log('height', myId, height)
    }

    async function resizeCell(event) {
        try {
            const newValue = item.showMenu === true ? false : true;
            console.log('resizeCell', myId, item.showMenu, newValue)
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

<gridlayout id="resizeHolder" rows="101,100" on:tap={resizeCell} {height} verticalAlignment="top">
    <stacklayout row="0" class="item" backgroundColor={item.color}>
        <label row="1" text={item.name} class="title" />
        <label row="1" text={item.color} class="subtitle" />
    </stacklayout>
    <stacklayout row="1" orientation="horizontal" height="100">
        <label text="a" width="100" height="100%" backgroundColor="red" textAlignment="center" />
        <label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
    </stacklayout>
</gridlayout>
