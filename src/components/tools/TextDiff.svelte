<script>
    // TODO: Make me pretty.

    import Tool from "../Tool.svelte";
    import CodeMirror from "codemirror";
    import "codemirror/addon/merge/merge";
    import {onMount} from "svelte";

    let editorWrap;
    let editorEl;
    let editor;
    let editorHeight;

    // Set initial height.
    onMount(() =>{
        editorHeight = editorWrap.clientHeight
        editor = CodeMirror.MergeView(editorEl, {
            value: '',
            orig: '',
            allowEditingOriginals: true,
            lineNumbers: true,
            mode: "text",
            highlightDifferences: true,
            collapseIdentical: false,
        })
    });
</script>

<Tool title="Diff Viewer">
    <div class="block">
        <p class="subtitle">Configuration</p>

    </div>

    <div id="diff-wrap" class="is-block" bind:this={editorWrap} bind:clientHeight={editorHeight}>
        <div class="wrap-inner">
          <div id="diff-view" bind:this={editorEl} style="--height: {editorHeight}px;"></div>
        </div>
    </div>
</Tool>

<style lang="scss">
  @import 'src/style/style';

  #diff-wrap {
    flex: 1;
    // display: flex;
    // flex-direction: column;
    
    :global(.CodeMirror-merge) {
      // height: var(--height);
      // font-family: 'Source Code Pro', monospace;
      // flex: 1;
      height: 100%;
    }

    :global(.CodeMirror) {
      height: var(--height);
      font-family: 'Source Code Pro', monospace;
      // flex: 1;
      // height: auto;
    }

    // :global(.CodeMirror-gutters) {
    //   min-width: 1em;
    // }

    // :global(.CodeMirror-merge) {
    //   // height: var(--height);
    //   font-family: 'Source Code Pro', monospace;
    //   height: 100%;
    //   width: 100%;
    // }

    :global(.CodeMirror-merge-pane) {
      height: var(--height);
      font-family: 'Source Code Pro', monospace;
      // height: 100%;
    }

    :global(.CodeMirror-merge-gap) {
      height: var(--height);
      // height: 100%;
    }

    .wrap-inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      #diff-view {
        position: relative;
        height: 100%;

        :global(.CodeMirror-merge) {
          box-shadow: none;
          border-radius: 0;
        }

        :global(.CodeMirror) {
          box-shadow: none;
          border-radius: 0;
        }
      }
    }
  }
</style>
