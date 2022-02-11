<script lang="ts">
  import CodeMirror from "../CodeMirror.svelte";
  import ConfigBox from "../ConfigBox.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import Tool from "../Tool.svelte";
  import { v1, v4 } from "uuid";
  import { rootState } from "../../state/store";
  import type { UUIDVersion } from "../../state/types";
  import { onDestroy } from "svelte";
  import { getEditorState, setEditorState } from "../../state/codemirror";

  const state = $rootState.uuidGenerator;

  const versions: [UUIDVersion, string][] = [
    [1, "1 (date-time and MAC address)"],
    // [3, '3 (namespace name)'],
    [4, "4 (random)"],
    // [5, '5 (namespace w/ sha-1)'],
  ];

  let editor: CodeMirror.Editor;

  function generate() {
    if (!editor) return;

    let txt = "";

    for (let i = 0; i < $state.count; i++) {
      let id = $state.version == 1 ? v1() : v4();
      if ($state.uppercase) id = id.toUpperCase();
      txt += id + "\n";
    }

    editor.setValue(txt);
  }

  onDestroy(() => {
    if (!editor) return;
    $state.editor = getEditorState(editor);
  });
</script>

<Tool title="UUID Generator">
  <ConfigBox title="UUID Version">
    <SelectDropdown options={versions} bind:activeOption={$state.version} />
  </ConfigBox>
  <ConfigBox title="Uppercase">
    <label class="checkbox">
      <!-- <input id="switchRoundedDefault" type="checkbox" name="switchRoundedDefault" class="switch is-rounded" checked="checked"> -->
      <input
        type="checkbox"
        class="switch is-rounded"
        bind:checked={$state.uppercase}
      />
    </label>
  </ConfigBox>
  <ConfigBox title="Count">
    <input type="number" class="input" bind:value={$state.count} />
  </ConfigBox>
  <div class="block button-cont">
    <button class="button is-primary" on:click={generate}>Generate</button>
  </div>

  <div class="block editor-cont">
    <CodeMirror
      on:editorCreated={({ detail: e }) => {
        editor = e;
        setEditorState(e, $state.editor);
      }}
      options={{
        lineNumbers: true,
        mode: "text",
      }}
    />
  </div>
</Tool>

<style lang="scss">
  .editor-cont {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  input[type="number"] {
    width: 10em;
  }

  .button-cont {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
