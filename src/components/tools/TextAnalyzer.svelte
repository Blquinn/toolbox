<script lang="ts">
  import { onDestroy } from "svelte";
  import debounce from "../../lib/debounce";

  import CodeMirror from "../CodeMirror.svelte";
  import Tool from "../Tool.svelte";

  let editor: CodeMirror.Editor;

  let cursorPos: CodeMirror.Position | null;
  let chars = 0;
  let lines = 0;
  let sentences = 0;
  let totalWords = 0;
  let paragraphs = 0;

  let wordDist: [string, number][] = [];
  let charDist: [string, number][] = [];

  onDestroy(() => {
    if (!editor) return;
    // TODO: Save state.
  });

  const whitespaceChars = ['\r', '\n', '\t', ' '];

  function toPrintableChar(c: string): string {
    switch (c) {
      case " ":
        return "\\s";
      case "\n":
        return "\\n";
      case "\t":
        return "\\t";
      case "\r":
        return "\\r";
      default:
        return c;
    }
  }

  function analyzeText() {
    if (!editor) return;

    let txt = editor.getValue();

    chars = txt.length;

    let ls = txt.length > 0 ? 1 : 0;
    let ss = 0;

    let cc: Map<string, number> = new Map();

    let pc: string | null = null;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];

      switch (c) {
        case "\n":
          ls++;
          break;
        case ".":
        case "?":
        case "!":
          if (!whitespaceChars.includes(pc))
            ss++;
          break;
        default:
          break;
      }

      if (cc.has(c)) {
        cc.set(c, cc.get(c) + 1);
      } else {
        cc.set(c, 1);
      }

      pc = c;
    }

    lines = ls;
    sentences = ss;

    // Character distribution

    const cd: [string, number][] = [];
    for (const [k, v] of cc.entries()) 
      cd.push([toPrintableChar(k), v]);

    charDist = cd.sort((a, b) => b[1] - a[1]);

    // Word distribution

    const words = txt.match(/\w+/g);
    totalWords = words.length;

    let wc: Map<string, number> = new Map();

    for (let w of words) {
      w = w.toLowerCase();
      if (wc.has(w)) {
        wc.set(w, wc.get(w) + 1);
      } else {
        wc.set(w, 1);
      }
    }

    const wd: [string, number][] = [];
    for (const [k, v] of wc.entries()) 
      wd.push([k, v]);

    wordDist = wd.sort((a, b) => b[1] - a[1]);

    paragraphs = txt.match(/\S(\v|$)/gm).length;
  }
  const analyzeTextDebounced = debounce(analyzeText, 500);

  const updateCursorDebounced = debounce(() => {
    cursorPos = editor.getCursor();
  }, 200);

  function onCursorActivity() {
    updateCursorDebounced();
  }
</script>

<Tool title="Text Analyzer">
  <div class="columns">
    <div class="cm-col column is-three-fifths">
      <CodeMirror
        on:editorCreated={({ detail: e }) => {
          editor = e;
        }}
        on:cursorActivity={onCursorActivity}
        on:change={analyzeTextDebounced}
        options={{
          mode: "text",
          lineNumbers: true,
          lineWrapping: true,
        }}
      />
    </div>

    <div class="column is-two-fifths analyzers">
      <div class="analyzers-inner">
        <div class="analyzers-inner-inner">
          <label for="selection-lbl">Selection</label>
          <table class="table" id="selection-tbl">
            <tr>
              <td>Line</td>
              <td>{cursorPos ? cursorPos.line + 1 : "-"}</td>
            </tr>
            <tr>
              <td>Column</td>
              <td>{cursorPos ? cursorPos.ch + 1 : "-"}</td>
            </tr>
            <!-- <tr>
              <td>Position</td>
              <td>-</td>
            </tr> -->
          </table>

          <label for="stats-tbl">Statistics</label>
          <table class="table" id="stats-tbl">
            <tr>
              <td>Characters</td>
              <td>{chars ? chars : "-"}</td>
            </tr>
            <tr>
              <td>Words</td>
              <td>{totalWords ? totalWords : "-"}</td>
            </tr>
            <tr>
              <td>Lines</td>
              <td>{lines ? lines : "-"}</td>
            </tr>
            <tr>
              <td>Sentences</td>
              <td>{sentences ? sentences : "-"}</td>
            </tr>
            <tr>
              <td>Paragraphs</td>
              <td>{paragraphs ? paragraphs : "-"}</td>
            </tr>
            <!-- TODO: Bytes? Consider different encodings. -->
          </table>

          <div class="block">
              <label for="char-dist">Character Distribution</label>
            <div class="char-dist-cont">
              <table class="table" id="char-dist">
                <tr>
                  <th>Character</th>
                  <th>Count</th>
                </tr>
                {#each charDist as row}
                  <tr>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                {/each}
              </table>
            </div>
          </div>

          <div class="block">
              <label for="word-dist">Word Distribution</label>
            <div class="char-dist-cont">
              <table class="table" id="word-dist">
                <tr>
                  <th>Word</th>
                  <th>Count</th>
                </tr>
                {#each wordDist as row}
                  <tr>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                {/each}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Tool>

<style lang="scss">
  .columns {
    flex: 1;

    .column {
      display: flex;
      flex-direction: column;
    }

    .analyzers {
      display: block;
      position: relative;

      .analyzers-inner {
        position: relative;
        height: 100%;
        width: 100%;
        overflow-y: auto;

        .analyzers-inner-inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          display: flex;
          flex-direction: column;

          .char-dist-cont {
            max-height: 15em;
            width: 50%;
            min-width: 15em;
            overflow-y: auto;

            table {
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
