<script lang="ts">
    export let title: string;
</script>

<main class="noselect">
    <h1 class="title">{title}</h1>

    <div class="block">
        <slot></slot>
    </div>
</main>

<style lang="scss">
    main {
        flex: 1;
        padding: 1em;
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow-y: auto;

        .block {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    }
</style>
