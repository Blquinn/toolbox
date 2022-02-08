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
  RegexTesterState, Coord,
} from './types';

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
  regexText: 'foo|bar|baz',
  editor: {
    value: 'foo\nbar \naslkdfjbaz',
    scroll: {x: 0, y: 0},
    cursorPos: {line: 0, ch: 0},
  }
})

export const rootState: Writable<RootState> = writable({
    activeTool: 'text/regex-tester',
    jsonFormatter,
    jsonYamlConverter,
    textDiff,
    jwtDecoder,
    textEncoder,
    timestampConverter,
    regexTester,
})
