<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{sectionClicked: any}>();

    export let sectionTitle: string;
    // array of [id, text]
    export let sections: [any, string][];
    // active section id
    export let activeSection: any | null = null;
    export let expanded = true;

    function onActiveSectionClicked(section) {
        dispatch('sectionClicked', section);
    }
</script>

<ul class="menu-list">
    <li>
        <a on:click={() => expanded = !expanded} id="section-title">
            <span>{sectionTitle}</span>
            {#if expanded}
                <span class="icon is-small">
                    <i class="fas fa-angle-up" aria-hidden="true"></i>
                </span>
            {:else}
                <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            {/if}
        </a>
        {#if expanded}
            <ul>
                {#each sections as section}
                    <li>
                        <a class:is-active={section[0] === activeSection}
                           on:click={() => onActiveSectionClicked(section[0])}
                           href="#0"
                        >{section[1]}</a>
                    </li>
                {/each}
            </ul>
        {/if}
    </li>
</ul>

<style lang="scss">
  #section-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
