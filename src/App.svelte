<script lang="ts">
	import { onMount } from 'svelte';
	export let name: string;

	onMount(() => {
		console.log('mounted');
	});
</script>

<main>
	<div class="menu-col">
		<div class="actual-menu">
			<h2 class="title">I'm the menu!</h2>
		</div>
	</div>

	<div class="content-col">
	</div>
</main>

<style global lang="scss">
	@import 'style/style.scss';

	main {
		margin: 0 auto;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;

		.menu-col {
			background-color: $box-background-color;
			width: 15%;
		}

		.content-col {
			flex: 1;
		}
	}
</style>
