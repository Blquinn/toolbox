<script lang="ts">
  import utf8 from "utf8";
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";

  type Base = 16 | 64;
  let bases: [Base, string][] = [
    [64, "64"],
    [16, "16 (Hexidecimal)"],
  ];
  let activeBase = bases[0][0];

  type ModeType = "encode" | "decode";
  let mode: ModeType = "encode";

  let inputText = "";
  let outputText = "";

  $: {
    switch (activeBase) {
      case 16:
        try {
          if (mode == "encode") {
            outputText = hexEncode(utf8.encode(inputText));
          } else {
            outputText = hexDecode(inputText);
          }
        } catch (e) {
          outputText = `Error: ${e}`;
        }
        break;
      case 64:
        try {
          if (mode == "encode") {
            outputText = btoa(utf8.encode(inputText));
          } else {
            outputText = atob(inputText);
          }
        } catch (e) {
          outputText = `Error: ${e}`;
        }
        break;
    }
  }

  let inputTextSuffix = "";
  let outputTextSuffix = "";

  // Set labels
  $: {
    const utfAscii = "(UTF-8/Ascii Text)";
    const baseText = bases.find((b) => b[0] === activeBase)[1];
    const baseLabel = `Base ${baseText}`;
    if (mode === "encode") {
      inputTextSuffix = utfAscii;
      outputTextSuffix = baseLabel;
    } else {
      inputTextSuffix = baseLabel;
      outputTextSuffix = utfAscii;
    }
  }

  // TODO: Move encoding functions to separate .ts file.

  function hexEncode(text: string): string {
    return text
      .split("")
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }

  function hexDecode(hex: string): string {
    return hex
      .split(/(\w\w)/g)
      .filter((p) => !!p)
      .map((c) => String.fromCharCode(parseInt(c, 16)))
      .join("");
  }

  function setMode(newMode: ModeType) {
    const inp = inputText;
    const out = outputText;
    outputText = inp;
    inputText = out;
    mode = newMode;
  }
</script>

<Tool title="Base N Encoder / Decoder">
  <p class="subtitle">Configuration</p>

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

  <div class="box config-box">
    <p>Base</p>
    <SelectDropdown options={bases} bind:activeOption={activeBase} />
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
//   @import "src/style/style";

  .block {
    flex: 1;
    display: flex;
    flex-direction: column;

    textarea {
      flex: 1;
    }
  }

  #conversion-tabs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .config-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
