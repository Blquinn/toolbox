<script lang="ts">
  import ConfigBox from "../ConfigBox.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";

  import { readText, writeText } from "@tauri-apps/api/clipboard";

  import { AceEditor } from "svelte-ace";
  import "brace/mode/json";
  import "brace/theme/tomorrow_night";

  type IndentationsType = "2-spaces" | "4-spaces" | "tab" | "min";

  const indentations: [IndentationsType, string][] = [
    ["2-spaces", "2 Spaces"],
    ["4-spaces", "4 Spaces"],
    ["tab", "1 Tab"],
    ["min", "Compact"],
  ];

  let activeIndent: IndentationsType = "2-spaces";

  let code = "";

  let editorHeight: number;

  function indentCode() {
    let obj;
    try {
      obj = JSON.parse(code);
    } catch (e) {
      code = `Error: ${e}`;
    }

    switch (activeIndent) {
      case "2-spaces":
        code = JSON.stringify(obj, null, 2);
        break;
      case "4-spaces":
        code = JSON.stringify(obj, null, 4);
        break;
      case "tab":
        code = JSON.stringify(obj, null, "\t");
        break;
      case "min":
        code = JSON.stringify(obj);
        break;
    }
  }

  async function copy() {
    await writeText(code);
  }

  async function paste() {
    code = await readText();
  }

  const options = {
    mode: "javascript",
    lineNumbers: true,
    value: code,
  };
</script>

<Tool title="Json Formatter">
  <div class="block">
    <p class="subtitle">Configuration</p>

    <ConfigBox title="Indentation">
      <SelectDropdown options={indentations} bind:activeOption={activeIndent} />
    </ConfigBox>
  </div>

  <div class="block columns is-centered">
    <div class="column is-narrow">
      <button class="button" on:click={paste}>
        <span class="icon is-small">
          <i class="fas fa-paste" aria-hidden="true" />
        </span>
        <span>Paste</span>
      </button>

      <button class="button" on:click={indentCode}>
        <span class="icon is-small">
          <i class="fas fa-indent" aria-hidden="true" />
        </span>
        <span>Indent</span>
      </button>

      <button class="button" on:click={copy}>
        <span class="icon is-small">
          <i class="fas fa-copy" aria-hidden="true" />
        </span>
        <span>Copy</span>
      </button>
    </div>
  </div>

  <div id="editor-wrap" class="is-block" bind:clientHeight={editorHeight}>
    <div class="wrap-inner">
      <AceEditor
        width="100%"
        height={`${editorHeight}px`}
        lang="json"
        theme="tomorrow_night"
        options={{
          fontSize: '11pt',
        }}
        bind:value={code}
      />
    </div>
  </div>
</Tool>

<style lang="scss">
  textarea {
    flex: 1;
    font-family: "Source Code Pro", monospace;
  }

  #editor-wrap {
    flex: 1;

    .wrap-inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
