<script lang="ts">
    export let sectionTitle: string;
    export let sections: string[];
    export let activeSection: string | null = null;
    export let expanded = false;
</script>

<ul class="menu-list">
    <li>
        <a on:click={() => expanded = !expanded} id="section-title">
            <span>{sectionTitle}</span>
            {#if expanded}
                <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            {:else}
                <span class="icon is-small">
                    <i class="fas fa-angle-up" aria-hidden="true"></i>
                </span>
            {/if}
        </a>
        {#if expanded}
            <ul>
                {#each sections as section}
                    <li>
                        <a class:is-active={section === activeSection}
                           on:click={() => activeSection = section}
                           href="/#"
                        >{section}</a>
                    </li>
                {/each}
            </ul>
        {/if}
    </li>
</ul>

<style lang="scss">
  @import "src/style/style";

  #section-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
