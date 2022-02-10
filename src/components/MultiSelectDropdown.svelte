<script context="module" lang="ts">
  export interface Option<T> {
    id: T;
    title: string;
    description?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import clickOutside from "../lib/click-outside";

  export let options: Option<any>[];
  export let activeOptions: any[] = [];
  let active = false;

  let dispatch = createEventDispatcher<{ optionsChanged: any[] }>();

  function onOptionSelected(option: any) {
    let newOpts;
    if (activeOptions.includes(option)) {
      newOpts = activeOptions.filter((o) => o !== option);
    } else {
      // Only unique ids.
      newOpts = [...activeOptions, option].filter((v, i, a) => a.indexOf(v) === i);
    }

    dispatch("optionsChanged", newOpts);
  }
</script>

<div use:clickOutside on:clickOutside={() => active = false}>
  <div
    class="dropdown is-right"
    class:is-active={active}
    on:blur={() => (active = false)}
  >
    <div
      class="dropdown-trigger"
      on:blur={() => (active = false)}
      on:click={() => (active = !active)}
    >
      <slot />
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        {#each options as option}
          <a
            href="/#"
            class="dropdown-item"
            class:is-active={activeOptions.includes(option.id)}
            on:mousedown={(_) => onOptionSelected(option.id)}
          >
            {option.title}
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
</style>
