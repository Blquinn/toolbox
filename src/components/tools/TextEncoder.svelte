<script lang="ts">
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";
  import {
    type Encodings,
    EncoderMap,
    type ModeType,
  } from "../../lib/text-encodings";
  import ConfigBox from "../ConfigBox.svelte";
  import { rootState } from "../../state/store";

  const encodings: [Encodings, string][] = [
    ["base-64", "Base 64"],
    ["base-64-url", "Base 64 (URL-safe)"],
    ["base-16", "Base 16 (Hexidecimal)"],
    ["url", "URL"],
    ["html", "HTML"],
  ];

  const state = $rootState.textEncoder;

  $: {
    try {
      $state.output = EncoderMap[$state.encoding][$state.mode]($state.input);
    } catch (e) {
      $state.output = `Error: ${e}`;
    }
  }

  let inputTextSuffix = "";
  let outputTextSuffix = "";

  // Set labels
  $: {
    const utfAscii = "(UTF-8/Ascii Text)";
    const baseText = encodings.find((b) => b[0] === $state.encoding)[1];
    const baseLabel = `(${baseText})`;
    if ($state.mode === "encode") {
      inputTextSuffix = utfAscii;
      outputTextSuffix = baseLabel;
    } else {
      inputTextSuffix = baseLabel;
      outputTextSuffix = utfAscii;
    }
  }

  function setMode(newMode: ModeType) {
    const inp = $state.input;
    const out = $state.output;
    $state.output = inp;
    $state.input = out;
    $state.mode = newMode;
  }
</script>

<Tool title="Text Encoder / Decoder">
  <p class="subtitle">Configuration</p>

  <ConfigBox title="Encoding">
    <SelectDropdown options={encodings} bind:activeOption={$state.encoding} />
  </ConfigBox>

  <div id="conversion-tabs" class="tabs is-toggle is-toggle-rounded">
    <ul>
      <li class:is-active={$state.mode === "encode"}>
        <a href="/#" on:click={() => setMode("encode")}>
          <span>Encode</span>
        </a>
      </li>
      <li class:is-active={$state.mode === "decode"}>
        <a href="/#" on:click={() => setMode("decode")}>
          <span>Decode</span>
        </a>
      </li>
    </ul>
  </div>

  <div class="block">
    <div>
      <span class="subtitle">Input</span>
      <span class="subtitle is-6">{inputTextSuffix}</span>
    </div>
    <textarea id="input-area" class="textarea" bind:value={$state.input} />
  </div>

  <div class="block">
    <div>
      <span class="subtitle">Output</span>
      <span class="subtitle is-6">{outputTextSuffix}</span>
    </div>
    <textarea id="output-area" class="textarea" bind:value={$state.output} />
  </div>
</Tool>

<style lang="scss">
  .block {
    flex: 1;
    display: flex;
    flex-direction: column;

    textarea {
      flex: 1;
      font-family: monospace;
    }
  }

  #conversion-tabs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
