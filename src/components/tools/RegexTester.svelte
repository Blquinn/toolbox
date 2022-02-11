<script lang="ts">
  import type { ModeSpec, ModeSpecOptions } from "codemirror";

  import CodeMirror from "../CodeMirror.svelte";
  import Tool from "../Tool.svelte";
  import { rootState } from "../../state/store";
  import MultiSelectDropdown, {
    type Option,
  } from "../MultiSelectDropdown.svelte";
  import type { RegexFlag } from "../../state/types";
  import debounce from "../../lib/debounce";

  let editor: CodeMirror.Editor;

  const state = $rootState.regexTester;
  const reTextState = $state.regexText;

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

  function lineAndOffsetForIndex(str: string, index: number): [number, number] {
    if (index >= str.length) {
      throw 'index >= str.length';
    }

    let line = 0;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const c = str[i];
      if (c == '\n') {
        line++;
        offset = 0;
      } else {
        offset++;
      }
    }

    return [line, offset];
  }

  const updateRexDebounced = debounce(updateRex, 500);
  $: $reTextState, $state.activeFlags, updateRexDebounced();
  function updateRex() {
    regexError = null;

    if (!editor) return;

    editor.getAllMarks().forEach(m => m.clear());

    if ($reTextState == "") {
      return;
    }

    let re;
    try {
      re = new RegExp($reTextState, $state.activeFlags.join(""));
    } catch (e) {
      regexError = e.toString();
      return;
    }

    if ($state.activeFlags.includes('g')) {
      for (let m of editor.getValue().matchAll(re)) {
        if (m[0] == '')
          continue;

        // TODO: We can easily optimize this.
        const [line, offset] = lineAndOffsetForIndex(m.input, m.index);
        const [endLine, endOffset] = lineAndOffsetForIndex(m.input, m.index+m[0].length);
        editor.markText({line: line, ch: offset}, {line: endLine, ch: endOffset}, {className: 'cm-match'})
      }
    } else {
      let m = editor.getValue().match(re);
      if (m && m[0] != '') {
        editor.markText({line: 0, ch: m.index}, {line: 0, ch: m[0].length}, {className: 'cm-match'})
      }
    }
  }

  function onReTextKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.which === 90) { // Z
			e.preventDefault();
      e.shiftKey ? reTextState.redo() : reTextState.undo();
		}
  }

  function editorLoaded(e: CodeMirror.Editor) {
    editor = e;
    e.setValue($state.editor.value);
    e.setCursor($state.editor.cursorPos);
    e.scrollTo($state.editor.scroll.x, $state.editor.scroll.y);
    updateRex();
  }

  function onEditorChanged() {
    updateRexDebounced();
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
          <input type="text" bind:value={$reTextState} on:keydown={onReTextKeydown} />
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
      <label class="label" for="codemirror">Text</label>
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
          lineWrapping: true,
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
