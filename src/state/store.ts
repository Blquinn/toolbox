import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import type {
    RootState,
    JSONFormatterState,
    TextDiffState,
    JWTDecoderState,
    TextEncoderState,
    TimestampConverterState,
    JSONYamlConverterState,
    RegexTesterState, LoremGeneratorState, UUIDGeneratorState,
} from './types';
import undoable from '../lib/undoable';

const jsonFormatter: Writable<JSONFormatterState> = writable({
    activeIndent: '2-spaces',
    value: '',
    scroll: { x: 0, y: 0 },
    cursorPos: { line: 0, ch: 0 },
});

const textDiff: Writable<TextDiffState> = writable({
    left: {
        value: '',
        scroll: { x: 0, y: 0 },
        cursorPos: { line: 0, ch: 0 },
    },
    right: {
        value: '',
        scroll: { x: 0, y: 0 },
        cursorPos: { line: 0, ch: 0 },
    }
});

const jwtDecoder: Writable<JWTDecoderState> = writable({
    token: '',
    header: '',
    payload: '',
})

const textEncoder: Writable<TextEncoderState> = writable({
    encoding: 'base-64',
    mode: 'encode',
    input: '',
    output: '',
})

const timestampConverter: Writable<TimestampConverterState> = writable({
    inputFormat: 'unix-sec',
    inputText: '',
})

const jsonYamlConverter: Writable<JSONYamlConverterState> = writable({
    inputText: '',
    indent: '2-spaces',
    conversion: 'yaml-to-json',
})

export const regexTester: Writable<RegexTesterState> = writable({
    regexText: undoable(writable('')),
    editor: {
        value: '',
        scroll: { x: 0, y: 0 },
        cursorPos: { line: 0, ch: 0 },
    },
    activeFlags: ['g', 'm'],
})

const loremGenerator: Writable<LoremGeneratorState> = writable({
    amount: 5,
    activeMode: 'paragraphs',
    editor: {
        value: '',
        scroll: { x: 0, y: 0 },
        cursorPos: { line: 0, ch: 0 },
    },
    paragraphLowerBound: 5,
    paragraphUpperBound: 5,
    sentenceLowerBound: 20,
    sentenceUpperBound: 20,
    activeWords: 'latin',
    settingsModalActive: false,
})

const uuidGenerator: Writable<UUIDGeneratorState> = writable({
    version: 4,
    uppercase: false,
    count: 1,
    editor: {
        value: '',
        scroll: { x: 0, y: 0 },
        cursorPos: { line: 0, ch: 0 },
    }
})

export const rootState: Writable<RootState> = writable({
    activeTool: 'gen/uuid',
    jsonFormatter,
    jsonYamlConverter,
    textDiff,
    jwtDecoder,
    textEncoder,
    timestampConverter,
    regexTester,
    loremGenerator,
    uuidGenerator,
})
