<script lang="ts">
  import ConfigBox from "../ConfigBox.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";
  import { readText, writeText } from "@tauri-apps/api/clipboard";
  import CodeMirror from "../CodeMirror.svelte";
  import { rootState } from "../../state/store";
  import { formatJson, indentations } from "../../util/json";

  const state = $rootState.jsonFormatter

  let editor: CodeMirror.Editor;

  function indentCode() {
    try {
      $state.value = formatJson(editor.getValue(), $state.activeIndent);
    } catch (e) {
      $state.value = `Error: ${e}`;
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
    $state.value = editor.getValue();

    const s = editor.getScrollInfo();
    $state.scroll = {x: s.left, y: s.top};

    $state.cursorPos = editor.getCursor();
  }
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
      on:blur={storeEditorContents}
      on:editorCreated={({detail: e}) => {
        e.setCursor($state.cursorPos);
        e.scrollTo($state.scroll.x, $state.scroll.y);
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
