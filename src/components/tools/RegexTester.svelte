<script lang="ts">
  import type { ModeSpec, ModeSpecOptions } from "codemirror";
  import type { Match } from "../../util/regex-match-mode";

  import CodeMirror from "../CodeMirror.svelte";
  import Tool from "../Tool.svelte";
  import { rootState } from "../../state/store";
  import MultiSelectDropdown, {
    type Option,
  } from "../MultiSelectDropdown.svelte";
  import type { RegexFlag } from "../../state/types";

  let editor: CodeMirror.Editor;

  const state = $rootState.regexTester;

  let regexError: string = null;

  const flagOptions: Option<RegexFlag>[] = [
    { id: "g", title: "global" },
    { id: "m", title: "multi line" },
    { id: "i", title: "insensitive" },
    { id: "y", title: "sticky" },
    { id: "u", title: "unicode" },
    { id: "s", title: "single line" },
    { id: "d", title: "indices" },
  ];

  $: $state.regexText, $state.activeFlags, updateRex();
  function updateRex() {
    regexError = null;

    const matches: Match[] = [];
    if ($state.regexText == "") {
      editor.setOption("mode", {
        name: "regex-match",
        matches,
      } as ModeSpec<ModeSpecOptions>);
      return;
    }

    let re;
    try {
      re = new RegExp($state.regexText, $state.activeFlags.join(""));
    } catch (e) {
      regexError = e.toString();
      return;
    }

    if (!editor) return;

    if ($state.activeFlags.includes('g')) {
      for (let m of editor.getValue().matchAll(re)) {
        matches.push({idx: m.index, text: m[0]});
      }
    } else {
      let m = editor.getValue().match(re);
      if (m)
        matches.push({idx: m.index, text: m[0]});
    }

    editor.setOption("mode", {
      name: "regex-match",
      matches,
    } as ModeSpec<ModeSpecOptions>);
  }

  function editorLoaded(e: CodeMirror.Editor) {
    editor = e;
    e.setValue($state.editor.value);
    e.setCursor($state.editor.cursorPos);
    e.scrollTo($state.editor.scroll.x, $state.editor.scroll.y);
    updateRex();
  }

  function onEditorChanged() {
    // $state.editor.value = editor.getValue();
    updateRex();
  }
</script>

<Tool title="Regex Tester">
  <div class="block">
    <div class="field">
      <label class="label" for="re-input"
        >Regex <span class="is-size-7">(ECMAScript Flavor)</span></label
      >
      <div class="control">
        <div id="re-input" class="input" class:is-danger={regexError}>
          <input type="text" bind:value={$state.regexText} />
          <MultiSelectDropdown
            options={flagOptions}
            activeOptions={$state.activeFlags}
            on:optionsChanged={({ detail: opts }) =>
              ($state.activeFlags = opts)}
          >
            <div class="select-dropdown-btn">
              <span>/</span>
              <p>{$state.activeFlags.join("")}</p>
            </div>
          </MultiSelectDropdown>
        </div>
      </div>
    </div>
  </div>

  <div class="block editor-container">
    <div class="field editor-container">
      <label class="label">Text</label>
      <CodeMirror
        class="control"
        on:change={onEditorChanged}
        on:blur={() => {
          $state.editor.value = editor.getValue();
        }}
        on:editorCreated={({ detail: e }) => editorLoaded(e)}
        options={{
          mode: "text",
          lineNumbers: true,
        }}
      />
    </div>
  </div>
</Tool>

<style lang="scss">
  @import "src/style/style";

  #re-input {
    background-color: $grey-dark;

    input {
      border: none;
      background-color: transparent;
      color: $white-ter;
      font-size: $body-font-size;
      width: 100%;
    }

    .select-dropdown-btn {
      display: flex;
      gap: 5px;
      cursor: pointer;

      span {
        color: $grey;
      }

      p {
        font-size: 15px;
        background-color: transparent;
        color: $white-ter;
        border: none;
      }
    }
  }

  .editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
