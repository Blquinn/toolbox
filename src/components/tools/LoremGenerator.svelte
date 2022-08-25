<script lang="ts">
  import Tool from "../Tool.svelte";
  import CodeMirror from "../CodeMirror.svelte";
  import {
    lorem,
    type Mode,
    HIPSTER_PHRASES,
    LATIN_PHRASES,
  } from "../../lib/lorem";
  import { writeText } from "@tauri-apps/api/clipboard";
  import ConfigBox from "../ConfigBox.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import type { Words } from "../../state/types";
  import { rootState } from "../../state/store";
  import { onDestroy } from "svelte";

  const state = $rootState.loremGenerator;

  let editor: CodeMirror.Editor;

  const wordBanks: [Words, string][] = [
    ["latin", "Latin"],
    ["hipster", "Hipster"],
  ];

  const modes: [Mode, string][] = [
    ["words", "Words"],
    ["sentences", "Sentences"],
    ["paragraphs", "Paragraphs"],
  ];

  function generate() {
    const text = lorem({
      count: $state.amount,
      mode: $state.activeMode,
      paragraphLowerBound: $state.paragraphLowerBound,
      paragraphUpperBound: $state.paragraphUpperBound,
      sentenceLowerBound: $state.sentenceLowerBound,
      sentenceUpperBound: $state.sentenceUpperBound,
      words: $state.activeWords == "latin" ? LATIN_PHRASES : HIPSTER_PHRASES,
    });

    editor.setValue(text);
  }

  function onEditorCreated(e: CodeMirror.Editor) {
    editor = e;
    editor.setValue($state.editor.value);
    editor.setCursor($state.editor.cursorPos);
    editor.scrollTo($state.editor.scroll.x, $state.editor.scroll.y);
  }

  function storeEditorState() {
    const s = editor.getScrollInfo();
    $state.editor = {
      value: editor.getValue(),
      scroll: { x: s.left, y: s.top },
      cursorPos: editor.getCursor(),
    };
  }

  async function copy() {
    await writeText(editor.getValue());
  }

  onDestroy(storeEditorState);
</script>

<Tool title="Lorem Ipsum Generator">
  <div class="modal" class:is-active={$state.settingsModalActive}>
    <div class="modal-background" />
    <div class="modal-content">
      <div class="box">
        <h1 class="title">Settings</h1>

        <ConfigBox title="Mode">
          <SelectDropdown
            options={modes}
            bind:activeOption={$state.activeMode}
          />
        </ConfigBox>

        <ConfigBox title="Paragraph Length">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="s-min-imp">Min</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="s-min-inp"
                    class="input num-imp"
                    type="number"
                    bind:value={$state.paragraphLowerBound}
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="s-max-imp">Max</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="s-max-inp"
                    class="input num-imp"
                    type="number"
                    bind:value={$state.paragraphUpperBound}
                  />
                </div>
              </div>
            </div>
          </div>
        </ConfigBox>

        <ConfigBox title="Sentence Length">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="s-min-imp">Min</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="s-min-inp"
                    class="input num-imp"
                    type="number"
                    bind:value={$state.sentenceLowerBound}
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="s-max-imp">Max</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="s-max-inp"
                    class="input num-imp"
                    type="number"
                    bind:value={$state.sentenceUpperBound}
                  />
                </div>
              </div>
            </div>
          </div>
        </ConfigBox>

        <ConfigBox title="Word Bank">
          <SelectDropdown
            options={wordBanks}
            bind:activeOption={$state.activeWords}
          />
        </ConfigBox>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      on:click={() => ($state.settingsModalActive = false)}
    />
  </div>

  <ConfigBox title="Count">
    <input type="number" class="input num-inp" bind:value={$state.amount} />
  </ConfigBox>

  <div class="block button-cont">
    <button class="button" on:click={() => ($state.settingsModalActive = true)}>
      <span class="icon is-small">
        <i class="fas fa-cog" aria-hidden="true" />
      </span>
      <span>Settings</span>
    </button>
    <button class="button is-primary" on:click={generate}>Generate</button>
    <button class="button" on:click={copy}>
      <span class="icon is-small">
        <i class="fas fa-copy" aria-hidden="true" />
      </span>
      <span>Copy</span>
    </button>
  </div>

  <div class="editor-cont">
    <CodeMirror
      on:editorCreated={({ detail: e }) => onEditorCreated(e)}
      options={{
        lineWrapping: true,
        mode: "text",
      }}
    />
  </div>
</Tool>

<style lang="scss">
  @import "src/style/style";

  .modal-content {
    height: 75%;
    width: 75%;

    .box {
      height: 100%;
      width: 100%;
      background-color: $grey-darker;
      overflow: auto;

      .field {
        margin: 0;
      }
    }
  }

  .num-inp {
    width: 10em;
  }

  .editor-cont {
    flex: 1;
  }

  .button-cont {
    display: flex;
    justify-content: center;
    gap: 5px;
  }
</style>
