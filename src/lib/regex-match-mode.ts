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
    let currentMatchIdx = -1;
    let inMatch = false;
    for (const [i, m] of this.matches.entries()) {
      const end = m.idx + m.text.length;

      if (state.idx >= end) {
        currentMatchIdx = i;
        continue;
      }

      if (state.idx >= m.idx && state.idx < end) {
        currentMatchIdx = i;
        inMatch = true;
        break;
      }
    }

    this.matches.splice(0, currentMatchIdx);

    if (this.matches.length == 0) {
      stream.skipToEnd();
      return null;
    }

    stream.next();
    state.idx++;

    // Count newline characters
    if (stream.eol())
      state.idx++;

    if (inMatch) {
      return 'match'
    }

    return null;
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
