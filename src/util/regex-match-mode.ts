import type {Mode, StringStream} from "codemirror";

export interface Match {
  idx: number;
  text: string;
}

export interface RegexMatchState {
  idx: number;
  matchIdx: number;
}

export interface RegexMatchModeOpts {
  matches: Match[];
}

export class RegexMatchMode implements Mode<RegexMatchState> {
  matches: Match[];

  constructor(matches: Match[]) {
    this.matches = matches;
  }

  name?: string = 'regex-match';

  token(stream: StringStream, state: RegexMatchState) {
    if (this.matches.length == 0) {
      stream.skipToEnd();
      return null;
    }

    const currentMatchIdx = this.matches.findIndex(m =>
      state.idx >= m.idx &&
      state.idx < m.idx + m.text.length);

    let currentMatch;
    if (currentMatchIdx > -1) {
      currentMatch = this.matches[currentMatchIdx];
    }

    // Avoid re-scanning past matches.
    if (currentMatchIdx > 0) {
      this.matches.splice(0, currentMatchIdx);
    }

    stream.next();
    state.idx++;

    // Count newline characters
    if (stream.eol())
      state.idx++;

    if (!currentMatch) {
      return null;
    }

    return 'match';
  }

  startState?(): RegexMatchState {
    return {idx: 0, matchIdx: 0};
  }

  blankLine?(state: RegexMatchState) {
    state.idx++;
  }

  copyState(state: RegexMatchState) {
    return {...state};
  };

  // indent?: (state: RegexMatchState, textAfter: string, line: string) => number = null;
  // lineComment?: string = null;
  // blockCommentStart?: string = null;
  // blockCommentEnd?: string = null;
  // blockCommentLead?: string = null;
  // electricChars?: string = null;
  // electricinput?: RegExp = null;
}
