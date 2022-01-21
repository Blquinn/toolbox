<script lang="ts">
	import { onMount } from 'svelte';
	import ExpandableMenu from "./components/ExpandableMenu.svelte";
	import BaseNEncoder from "./components/BaseNEncoder.svelte";
	import FaFontWoff from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2';
	export let name: string;

	onMount(() => {
		console.log('mounted');
	});
</script>

<main>
	<div class="menu-col noselect">
		<aside class="menu">
			<p class="menu-label">All Tools</p>
			<ExpandableMenu
					sectionTitle="Converters"
					sections={[
							'HTML',
							'URL',
							'Base 64',
							'JWT Decoder',
					]}
					activeSection="Base 64"
			/>
			<ExpandableMenu
					sectionTitle="Encoders / Decoders"
					sections={[
							'HTML',
							'URL',
							'Base 64',
							'JWT Decoder',
					]}
					activeSection="Base 64"
			/>
		</aside>
	</div>

	<div class="content-col">
		<BaseNEncoder />
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
			padding: 1em;
			width: 400px;
			overflow-y: auto;
		}

		.content-col {
			flex: 1;
		}
	}
</style>
