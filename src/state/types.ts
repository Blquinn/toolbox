import type { Position } from 'codemirror';
import type { Writable } from 'svelte/store';
import type { Encodings, ModeType } from '../text-encodings';
import type { TimeFormat } from '../time-conversion';
import type { Match, RegexMatchState } from '../util/regex-match-mode';

/////////////////////////////////////
// JSONFormatter

export type IndentationsType = "2-spaces" | "4-spaces" | "tab" | "min";

export interface Coord {
    x: number,
    y: number,
}

export interface EditorState {
    value: string,
    scroll: Coord,
    cursorPos: Position,
}

export interface JSONFormatterState extends EditorState {
    activeIndent: IndentationsType,
}

/////////////////////////////////////
// TextDiff

export interface TextDiffState {
    left: EditorState,
    right: EditorState,
}

/////////////////////////////////////
// JWTDecoder

export interface JWTDecoderState {
    token: string,
    header: string,
    payload: string,
}

/////////////////////////////////////
// TextEncoder

export interface TextEncoderState {
    encoding: Encodings,
    mode: ModeType,
    input: string,
    output: string,
}

/////////////////////////////////////
// TimestampConverter

export interface TimestampConverterState {
    inputFormat: TimeFormat,
    inputText: string,
}

/////////////////////////////////////
// JSONYamlConverter

export type JSONYamlConversions = 'json-to-yaml' | 'yaml-to-json';

export interface JSONYamlConverterState {
    conversion: JSONYamlConversions,
    indent: IndentationsType,
    inputText: string,
}

/////////////////////////////////////
// RegexTester

export interface RegexTesterState {
  regexText: string,
  editor: EditorState,
  // text: string,
}

/////////////////////////////////////
// Root State

export type Tool =
    'conv/json-yaml' |
    // 'conv/number-base' |
    'conv/timestamp' |
    'enc/text' |
    'enc/jwt-decoder' |
    'fmt/json' |
    'text/diff' |
    'text/regex-tester'
;

export interface RootState {
    activeTool: Tool,
    jsonFormatter: Writable<JSONFormatterState>,
    jsonYamlConverter: Writable<JSONYamlConverterState>,
    textDiff: Writable<TextDiffState>,
    jwtDecoder: Writable<JWTDecoderState>,
    textEncoder: Writable<TextEncoderState>,
    timestampConverter: Writable<TimestampConverterState>,
    regexTester: Writable<RegexTesterState>,
}
