<script lang="ts">
import ConfigBox from "../ConfigBox.svelte";
import SelectDropdown from "../SelectDropdown.svelte";
import Tool from "../Tool.svelte";
import {formatJson, indentations} from '../../util/json';
import { rootState } from "../../state/store";
import type { JSONYamlConversions } from "../../state/types";
import HSplitPane from "../HSplitPane.svelte";
import CodeMirror from "../CodeMirror.svelte";
import yaml from 'js-yaml';
import debounce from "../../util/debounce";
import { onDestroy } from "svelte";

const state = $rootState.jsonYamlConverter;

let leftEditor: CodeMirror.Editor;
let rightEditor: CodeMirror.Editor;

const conversions: [JSONYamlConversions, string][] = [
    ['yaml-to-json', 'Yaml to JSON'],
    ['json-to-yaml', 'JSON to Yaml'],
]

let indents = indentations;

const yamlIndents = ['2-spaces', '4-spaces'];

$: $state.conversion, updateIndents();
function updateIndents() {
    // Yaml doesn't support tabs or minified representation.
    if ($state.conversion == 'json-to-yaml') {
        indents = indentations.filter(([i, _]) => yamlIndents.includes(i));
        if (!yamlIndents.includes($state.indent)) {
            $state.indent = '2-spaces';
        }
    } else {
        indents = indentations;
    }
}


$: $state.conversion, setMode();
function setMode() {
    if (!leftEditor || !rightEditor) return;

    if ($state.conversion == 'json-to-yaml') {
        leftEditor.setOption('mode', {name: 'javascript', json: true});
        rightEditor.setOption('mode', 'yaml');
    } else {
        leftEditor.setOption('mode', 'yaml');
        rightEditor.setOption('mode', {name: 'javascript', json: true});
    }
}

function getYamlIndent() {
    switch ($state.indent) {
    case '2-spaces':       
        return 2;
    case '4-spaces':       
        return 4;
    case 'tab':       
        return 4;
    case 'min':       
        return 2;
    }
}

function convert() {
    if (!leftEditor) return;

    const input = $state.inputText;
    if (!input) {
        rightEditor.setValue('');
        return;
    }

    try {
        if ($state.conversion == 'json-to-yaml') {
            const obj = JSON.parse(input)
            const y = yaml.dump(obj, {indent: getYamlIndent()})
            rightEditor.setValue(y);
        } else {
            const obj = yaml.load(input);
            const json = formatJson(obj, $state.indent);
            rightEditor.setValue(json);
        }
    } catch (e) {
        rightEditor.setValue(`Error: ${e}`);
    }
}

const convertDebounced = debounce(convert, 250);
$: $state.conversion, $state.indent, convertDebounced();
onDestroy(convertDebounced.flush);
</script>

<Tool title="Yaml <> JSON Converter">
    <ConfigBox title="Conversion">
        <SelectDropdown options={conversions} bind:activeOption={$state.conversion} />
    </ConfigBox>
    <ConfigBox title="Indentation">
        <SelectDropdown options={indents} bind:activeOption={$state.indent} />
    </ConfigBox>

    <div class="block converters">
        <HSplitPane>
            <div slot="left" class="in-out-section">
                <p class="subtitle">Input</p>
                <CodeMirror 
                    on:editorCreated={({detail: e}) => {
                        e.setValue($state.inputText);
                        leftEditor = e;
                    }}
                    on:blur={() => convertDebounced.flush()}
                    on:change={({detail}) => {
                        console.log('on change');
                        $state.inputText = detail[0].getValue();
                        convertDebounced($state.indent, $state.conversion);
                    }}
                />
            </div>
            <div slot="right" class="in-out-section">
                <p class="subtitle">Output</p>
                <CodeMirror 
                    on:editorCreated={(e) => rightEditor = e.detail}
                    options={{
                        readOnly: true,
                    }} 
                />
            </div>
        </HSplitPane>
    </div>
</Tool>

<style lang="scss">
    .converters {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: 10px;

        textarea {
            height: 100%;
            min-width: 0;
        }
    }

    .in-out-section {
        height: 100%;
        display: flex;
        flex-direction: column;

        CodeMirror {
            flex: 1;
        }
    }
</style>
