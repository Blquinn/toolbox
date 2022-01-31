<script lang="ts">
	import ExpandableMenu from "./components/ExpandableMenu.svelte";
	import TextEncoder from "./components/tools/TextEncoder.svelte";
	import JwtDecoder from "./components/tools/JWTDecoder.svelte";
	import JsonFormatter from "./components/tools/JSONFormatter.svelte";
	import TimestampConverter from "./components/tools/TimestampConverter.svelte";
	import TextDiff from "./components/tools/TextDiff.svelte";
	import { rootState } from "./state/store";
import type { Tool } from "./state/types";
	// import MarkdownEditor from "./components/tools/MarkdownEditor.svelte";

	// type Tool =
	// 	'conv/json-yaml' |
	// 	'conv/number-base' |
	// 	'conv/timestamp' |
	// 	'enc/text' |
	// 	'enc/jwt-decoder' |
	// 	'fmt/json' |
	// 	'text/diff'
	// ;

	interface ToolMenuSection {
		sectionHeader: string,
		tools: [Tool, string][],
	}

	let toolsList: ToolMenuSection[] = [
		{
			sectionHeader: 'Converters',
			tools: [
				['conv/timestamp', 'Timestamp'],
			],
		},
		{
			sectionHeader: 'Encoders / Decoders',
			tools: [
				['enc/text', 'Text Encoder'],
				['enc/jwt-decoder', 'JWT Decoder'],
			],
		},
		{
			sectionHeader: 'Formatters',
			tools: [
				['fmt/json', 'Json'],
			],
		},
		{
			sectionHeader: 'Text',
			tools: [
				['text/diff', 'Diff Viewer'],
			],
		}
	];

	// let activeSection: Tool | null = 'fmt/json';
</script>

<main id="app-main">
	<div class="menu-col noselect">
		<aside class="menu">
			<p class="menu-label">All Tools</p>
			{#each toolsList as list}
				<ExpandableMenu
						sectionTitle={list.sectionHeader}
						sections={list.tools}
						on:sectionClicked={({detail: s}) => $rootState.activeTool = s}
						activeSection={$rootState.activeTool}
				/>
			{/each}
		</aside>
	</div>

	<div class="content-col">
		<div class="tool-wrapper">
			{#if $rootState.activeTool == "conv/timestamp"}
				<TimestampConverter />
			{:else if $rootState.activeTool == 'enc/text'}
				<TextEncoder />
			{:else if $rootState.activeTool == 'enc/jwt-decoder'}
				<JwtDecoder />
			{:else if $rootState.activeTool == 'fmt/json'}
				<JsonFormatter />
			{:else if $rootState.activeTool == 'text/diff'}
				<TextDiff />
			{/if}
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
			background-color: $grey-dark;
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
