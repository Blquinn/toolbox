<script>
  // TODO: Make me pretty.

  import CodeMirror from "codemirror";
  import "codemirror/addon/merge/merge";
  import { onMount } from "svelte";
  import { rootState } from "../../state/store";
  import Tool from "../Tool.svelte";

  let mergeWrap;
  let mergeEl;
  let merge;
  let mergeHeight;
  let editorLeft;
  let editorRight;

  const state = $rootState.textDiff;

  // Set initial height.
  onMount(() => {
    mergeHeight = mergeWrap.clientHeight;
    merge = CodeMirror.MergeView(mergeEl, {
      value: $state.left.value,
      orig: $state.right.value,
      allowEditingOriginals: true,
      lineNumbers: true,
      mode: "text",
      highlightDifferences: true,
      collapseIdentical: false,
    });
    editorLeft = merge.editor();
    editorRight = merge.rightOriginal();

    editorLeft.on("blur", (editor, event) => {
      const s = editor.getScrollInfo();
      $state.left = {
        value: editor.getValue(),
        scroll: { x: s.left, y: s.top },
        cursorPos: editor.getCursor(),
      };
    });

    editorRight.on("blur", (editor, event) => {
      const s = editor.getScrollInfo();
      $state.right = {
        value: editor.getValue(),
        scroll: { x: s.left, y: s.top },
        cursorPos: editor.getCursor(),
      };
    });

    // TODO: Figure out scrolling for merge view.
    editorLeft.setValue($state.left.value);
    editorLeft.setCursor($state.left.cursorPos);
    // editorLeft.scrollTo($state.left.scroll.x, $state.left.scroll.y);

    editorRight.setValue($state.right.value);
    editorRight.setCursor($state.right.cursorPos);
    // editorRight.scrollTo($state.right.scroll.x, $state.right.scroll.y);
  });
</script>

<Tool title="Diff Viewer">
  <div class="block">
    <p class="subtitle">Configuration</p>
  </div>

  <div
    id="diff-wrap"
    class="is-block"
    bind:this={mergeWrap}
    bind:clientHeight={mergeHeight}
  >
    <div class="wrap-inner">
      <div
        id="diff-view"
        bind:this={mergeEl}
        style="--height: {mergeHeight}px;"
      />
    </div>
  </div>
</Tool>

<style lang="scss">
  @import "src/style/variables";

  #diff-wrap {
    flex: 1;

    :global(.CodeMirror-merge) {
      height: 100%;
    }

    :global(.CodeMirror) {
      height: var(--height);
      font-family: "Source Code Pro", monospace;
    }

    :global(.CodeMirror-merge-pane) {
      height: var(--height);
      font-family: "Source Code Pro", monospace;
    }

    :global(.CodeMirror-merge-gap) {
      height: var(--height);
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
