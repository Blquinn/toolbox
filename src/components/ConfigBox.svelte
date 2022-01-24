<script lang="ts">
    export let title: string;
</script>

<div class="box config-box">
    <p>{title}</p>
    <slot></slot>
</div>

<style>
  .config-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>