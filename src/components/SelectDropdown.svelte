<script lang="ts">
    // options are an array of [id, text];
    export let options: [any, string][];
    export let activeOption: any | null = null;
    let active = false;

    function onOptionSelected(option: any) {
        activeOption = option;
        active = false;
    }
</script>

<div>
    <div class="dropdown is-right" class:is-active={active} on:blur={() => active = false}>
        <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"
                    on:blur={() => active = false}
                    on:click={() => active = !active}>
                <span>{options.find(o => o[0] === activeOption)[1]}</span>
                <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                {#each options as option}
                    <a href="/#" class="dropdown-item" class:is-active={option[0] === activeOption}
                       on:mousedown={(_) => onOptionSelected(option[0])}
                    >
                        {option[1]}
                    </a>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
</style>
