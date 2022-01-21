<script lang="ts">
	import ExpandableMenu from "./components/ExpandableMenu.svelte";
	import BaseNEncoder from "./components/tools/BaseNEncoder.svelte";

	type Tool =
		'conv/json-yaml' |
		'conv/number-base' |
		'enc/html' |
		'enc/url' |
		'enc/base-n' |
		'enc/jwt-decoder';

	interface ToolMenuSection {
		sectionHeader: string,
		tools: [Tool, string][],
	};

	let toolsList: ToolMenuSection[] = [
		{
			sectionHeader: 'Converters',
			tools: [
				['conv/json-yaml', 'Json <> Yaml'],
				['conv/number-base', 'Number Base'],
			],
		},
		{
			sectionHeader: 'Encoders / Decoders',
			tools: [
				['enc/html', 'HTML'],
				['enc/url', 'URL'],
				['enc/base-n', 'Base N'],
				['enc/jwt-decoder', 'JWT Decoder'],
			],
		}
	];

	let activeSection: Tool | null = toolsList[0].tools[0][0]
</script>

<main id="app-main">
	<div class="menu-col noselect">
		<aside class="menu">
			<p class="menu-label">All Tools</p>
			{#each toolsList as list}
				<ExpandableMenu
						sectionTitle={list.sectionHeader}
						sections={list.tools}
						on:sectionClicked={({detail: s}) => activeSection = s}
						activeSection={activeSection}
				/>
			{/each}
		</aside>
	</div>

	<div class="content-col">
		<div class="tool-wrapper" class:nodisplay={activeSection !== 'conv/json-yaml'}>
			<BaseNEncoder />
		</div>
		<div class="tool-wrapper" class:nodisplay={activeSection !== 'conv/number-base'}>
			<BaseNEncoder />
		</div>
	</div>
</main>

<style global lang="scss">
	@import 'style/style.scss';

	#app-main {
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
			display: flex;
			flex-direction: column;
		}
	}

	.tool-wrapper {
		flex: 1;
		max-height: 100%;
		display: flex;
		flex-direction: column;
	}

    .nodisplay {
        display: none;
    }
</style>
