import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import type { RootState, JSONFormatterState, TextDiffState, JWTDecoderState } from './types';

const jsonFormatterState: Writable<JSONFormatterState> = writable({
    activeIndent: '2-spaces',
    value: '',
    scroll: { x: 0, y: 0 },
    cursorPos: { line: 0, ch: 0 },
});

const textDiffState: Writable<TextDiffState> = writable({
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

const jwtDecoderState: Writable<JWTDecoderState> = writable({
    token: '',
    header: '',
    payload: '',
})

export const rootState: Writable<RootState> = writable({
    activeTool: 'text/diff',
    jsonFormatter: jsonFormatterState,
    textDiff: textDiffState,
    jwtDecoder: jwtDecoderState,
})
