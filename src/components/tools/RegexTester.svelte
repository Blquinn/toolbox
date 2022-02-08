<script lang="ts">
  import type {ModeSpec, ModeSpecOptions} from "codemirror";
  import type {Match} from "../../util/regex-match-mode";

  import CodeMirror from "../CodeMirror.svelte";
  import Tool from "../Tool.svelte";
  import {rootState} from "../../state/store";

  let editor: CodeMirror.Editor;

  const state = $rootState.regexTester;

  let regexError: string = null;

  let global = true;

//   let text = `alsdkfkl aslkjalkjsdfljkaslkjsdljk dkl jfdl kjfd foo
// jlasdlsdk sdflkjlkdfkljfdlkj flklkjasdl kf
// alkalkjsdfklj aklj as djf kljbar lkasdflkjslkdf
// lkasdlkaflk salkdflkajsdlkaj sdfjlkas kjdlfj klbz
// alksdfjlkakj lbaz
//
//
// alkdfljalkdfs sdklk fd kjla
//
// `;

  function flags(): string {
    let f = 'm';
    if (global) f += 'g';
    return f;
  }

  $: $state.regexText, updateRex();
  function updateRex() {
    regexError = null;
    let re;
    try {
      re = new RegExp($state.regexText, flags());
    } catch (e) {
      regexError = e.toString()
      return;
    }

    if (!editor) return;

    let matches: Match[] = [];
    for (let m of editor.getValue().matchAll(re)) {
      matches.push({idx: m.index, text: m[0]});
    }

    editor.setOption('mode', {
      name: "regex-match",
      matches,
    } as ModeSpec<ModeSpecOptions>)
  }

  function editorLoaded(e: CodeMirror.Editor) {
    editor = e;
    e.setValue($state.editor.value);
    e.setCursor($state.editor.cursorPos)
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
      <label class="label" for="re-input">Regex</label>
      <div class="control">
        <input class="input" class:is-danger={regexError} type="text" id="re-input" bind:value={$state.regexText}/>
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
  .editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
