import type { Editor } from 'codemirror';
import type { EditorState } from "./types";

export function getEditorState(e: Editor): EditorState {
    const s = e.getScrollInfo();
    return {
        value: e.getValue(),
        cursorPos: e.getCursor(),
        scroll: { x: s.left, y: s.top },
    }
}

export function setEditorState(e: Editor, s: EditorState) {
    e.setValue(s.value);
    e.setCursor(s.cursorPos);
    e.scrollTo(s.scroll.x, s.scroll.y);
}
