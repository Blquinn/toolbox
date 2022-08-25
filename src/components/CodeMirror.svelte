<script context="module" lang="ts">
import CodeMirror, { type Editor, type EditorChange } from 'codemirror'
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte';
    import type { EditorState } from '../state/types';
    import { getEditorState, setEditorState } from '../state/codemirror';

    const dispatch = createEventDispatcher<{
        'editorCreated': Editor,
        'cursorActivity': Editor,
        'blur': [Editor, FocusEvent],
        'change': [Editor, EditorChange],
        'scroll': Editor,
    }>();

    export let classes = ''

    export let editor: CodeMirror.Editor = null;
    export let options: CodeMirror.EditorConfiguration = {};
    export { classes as class }

    let element;

    function createEditor() {
        editor = CodeMirror.fromTextArea(element, options);
        editor.on("blur", (editor, ev) => dispatch('blur', [editor, ev]));
        editor.on("change", (editor, change) => dispatch('change', [editor, change]));
        editor.on("cursorActivity", (editor) => dispatch('cursorActivity', editor));
        editor.on("scroll", (editor) => dispatch('scroll', editor));
        dispatch('editorCreated', editor);
    }

    export function getState(): EditorState {
        return getEditorState(editor);
    }

    export function setState(s: EditorState) {
        setEditorState(editor, s);
    }

    onMount(() => {
        createEditor();
    });
</script>

    <div class="rel">
      <div class="abs">
        <textarea id="editor" bind:this={element} class={classes + ' textarea'}>{options.value ?? ''}</textarea>
      </div>
    </div>

<style lang="scss">
    #editor {
        + :global(.CodeMirror) {
            font-family: 'Source Code Pro', monospace;
            height: 100%;
        }
    }

    .rel {
      display: block;
      position: relative;
      height: 100%;
      width: 100%;
      .abs {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
</style>
