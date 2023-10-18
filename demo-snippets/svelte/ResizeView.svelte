<script lang="ts">
    import { View } from '@nativescript/core';
    export let item;

    $: height = item.showMenu === true ? 200 : 100;

    async function resizeCell(event) {
        try {
            async function animate(options = {}) {
                const newHeight = !item.showMenu ? 200 : 100;
                return (event.object as View).animate({ height: newHeight, ...options, duration: 300 });
            }
            await animate();
            // we update it after so that the svelte component also updates its value
            item.showMenu = !item.showMenu;
        } catch (error) {
            console.error(error);
        }
    }
</script>

<gridlayout rows="101,100" on:tap={resizeCell} height={height}>
    <stacklayout row="0" class="item" backgroundColor={item.color}>
        <label row="1" text={item.name} class="title" />
        <label row="1" text={item.color} class="subtitle" />
    </stacklayout>
    <stacklayout row="1" orientation="horizontal" height="100">
        <label text="a" width="100" height="100%" backgroundColor="red" textAlignment="center" />
        <label text="b" width="100" height="100%" backgroundColor="blue" textAlignment="center" />
    </stacklayout>
</gridlayout>
