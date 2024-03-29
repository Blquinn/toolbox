import type { Position } from 'codemirror';
import type { Writable } from 'svelte/store';
import type { Encodings, ModeType } from '../lib/text-encodings';
import type { TimeFormat } from '../lib/time-conversion';
import type { Mode } from '../lib/lorem';
import type { UndoableWritable } from '../lib/undoable';

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

export type RegexFlag =
    'g' |
    'm' |
    'i' |
    'y' |
    'u' |
    's' |
    'd'
    ;

export interface RegexTesterState {
    regexText: UndoableWritable<string>,
    editor: EditorState,
    activeFlags: RegexFlag[],
}

/////////////////////////////////////
// LoremGenerator

export type Words = "latin" | "hipster";

export interface LoremGeneratorState {
    amount: number;
    activeMode: Mode;
    editor: EditorState;
    paragraphLowerBound: number;
    paragraphUpperBound: number;
    sentenceLowerBound: number;
    sentenceUpperBound: number;
    activeWords: Words;
    settingsModalActive: boolean;
}

/////////////////////////////////////
// UUIDGenerator

export type UUIDVersion = 1 | 4;

export interface UUIDGeneratorState {
    version: UUIDVersion;
    count: number;
    uppercase: boolean;
    editor: EditorState,
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
    'text/regex-tester' |
    'text/analyzer' |
    'gen/lorem' |
    'gen/uuid'
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
    loremGenerator: Writable<LoremGeneratorState>,
    uuidGenerator: Writable<UUIDGeneratorState>,
}
