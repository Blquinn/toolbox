import type { Position } from 'codemirror';
import type { Writable } from 'svelte/store';

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
// Root State

export type Tool =
    'conv/json-yaml' |
    'conv/number-base' |
    'conv/timestamp' |
    'enc/text' |
    'enc/jwt-decoder' |
    'fmt/json' |
    'text/diff'
;

export interface RootState {
    activeTool: Tool,
    jsonFormatter: Writable<JSONFormatterState>,
    textDiff: Writable<TextDiffState>,
    jwtDecoder: Writable<JWTDecoderState>,
}
