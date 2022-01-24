<script lang="ts">
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";
  import {
    type Encodings,
    EncoderMap,
    type ModeType,
  } from "../../text-encodings";
  import ConfigBox from "../ConfigBox.svelte";

  const encodings: [Encodings, string][] = [
    ["html", "HTML"],
    ["url", "URL"],
    ["base-64", "Base 64"],
    ["base-16", "Base 16 (Hexidecimal)"],
  ];

  let activeEncoding = encodings[0][0];

  let mode: ModeType = "encode";

  let inputText = "";
  let outputText = "";

  $: {
    try {
      outputText = EncoderMap[activeEncoding][mode](inputText);
    } catch (e) {
      outputText = `Error: ${e}`;
    }
  }

  let inputTextSuffix = "";
  let outputTextSuffix = "";

  // Set labels
  $: {
    const utfAscii = "(UTF-8/Ascii Text)";
    const baseText = encodings.find((b) => b[0] === activeEncoding)[1];
    const baseLabel = `(${baseText})`;
    if (mode === "encode") {
      inputTextSuffix = utfAscii;
      outputTextSuffix = baseLabel;
    } else {
      inputTextSuffix = baseLabel;
      outputTextSuffix = utfAscii;
    }
  }

  function setMode(newMode: ModeType) {
    const inp = inputText;
    const out = outputText;
    outputText = inp;
    inputText = out;
    mode = newMode;
  }
</script>

<Tool title="Text Encoder / Decoder">
  <p class="subtitle">Configuration</p>

  <ConfigBox title="Encoding">
    <SelectDropdown options={encodings} bind:activeOption={activeEncoding} />
  </ConfigBox>

  <div id="conversion-tabs" class="tabs is-toggle is-toggle-rounded">
    <ul>
      <li class:is-active={mode === "encode"}>
        <a href="/#" on:click={() => setMode("encode")}>
          <span>Encode</span>
        </a>
      </li>
      <li class:is-active={mode === "decode"}>
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
    <textarea id="input-area" class="textarea" bind:value={inputText} />
  </div>

  <div class="block">
    <div>
      <span class="subtitle">Output</span>
      <span class="subtitle is-6">{outputTextSuffix}</span>
    </div>
    <textarea id="output-area" class="textarea" bind:value={outputText} />
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
