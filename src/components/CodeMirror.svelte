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

    const dispatch = createEventDispatcher<{
        'editorCreated': Editor,
        'cursorActivity': Editor,
        'blur': [Editor, FocusEvent],
        'change': [Editor, EditorChange],
        'scroll': Editor,
    }>();

    let classes = ''

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

    onMount(() => {
        createEditor();
    });
</script>

<textarea id="editor" bind:this={element} class={classes + ' textarea'}>{options.value ?? ''}</textarea>

<style lang="scss">
    #editor {
        + :global(.CodeMirror) {
            font-family: 'Source Code Pro', monospace;
            flex: 1;
        }
    }
</style>
