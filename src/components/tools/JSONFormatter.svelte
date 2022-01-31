<script context="module" lang="ts">
  import "codemirror/mode/javascript/javascript";
</script>

<script lang="ts">
  import ConfigBox from "../ConfigBox.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";
  import { readText, writeText } from "@tauri-apps/api/clipboard";
  import CodeMirror from "../CodeMirror.svelte";
  import type { IndentationsType } from "../../state/types";
  import { rootState } from "../../state/store";
  import debounce from "../../util/debounce";

  const indentations: [IndentationsType, string][] = [
    ["2-spaces", "2 Spaces"],
    ["4-spaces", "4 Spaces"],
    ["tab", "1 Tab"],
    ["min", "Compact"],
  ];

  const state = $rootState.jsonFormatter

  let editor: CodeMirror.Editor;

  function indentCode() {
    let obj;
    try {
      obj = JSON.parse(editor.getValue());
    } catch (e) {
      $state.value = `Error: ${e}`;
    }

    switch ($state.activeIndent) {
      case "2-spaces":
        $state.value = JSON.stringify(obj, null, 2);
        break;
      case "4-spaces":
        $state.value = JSON.stringify(obj, null, 4);
        break;
      case "tab":
        $state.value = JSON.stringify(obj, null, "\t");
        break;
      case "min":
        $state.value = JSON.stringify(obj);
        break;
    }

    editor.setValue($state.value);
  }

  async function copy() {
    await writeText(editor.getValue());
  }

  async function paste() {
    editor.setValue(await readText());
  }

  function storeEditorContents() {
    if (editor)
      $state.value = editor.getValue();
  }

  let storeDebounced = debounce(storeEditorContents, 50);
</script>

<Tool title="Json Formatter">
  <div class="block">
    <p class="subtitle">Configuration</p>

    <ConfigBox title="Indentation">
      <SelectDropdown options={indentations} bind:activeOption={$state.activeIndent} />
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

      <button class="button is-primary" on:click={indentCode}>
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

  <div id="editor-wrap">
    <CodeMirror
      bind:editor={editor}
      on:change={storeDebounced}
      on:blur={storeEditorContents}
      on:editorCreated={({detail: e}) => {
        e.setCursor($state.cursorPos);
        e.scrollTo($state.scroll.x, $state.scroll.y);
      }}
      on:cursorActivity={({detail: editor}) => {
        $state.cursorPos = editor.getCursor();
      }}
      on:scroll={({detail}) => {
        const s = detail.getScrollInfo();
        $state.scroll = {x: s.left, y: s.top};
      }}
      options={{
        value: $state.value,
        mode: {
          name: "javascript",
          json: true,
        },
        lineNumbers: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineWrapping: true,
      }}
    />
  </div>
</Tool>

<style lang="scss">
  #editor-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;

    .wrap-inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
