export type TimeFormat =
    'unix-milli' |
    'unix-sec' |
    'iso-8601'
    ;

export interface Ops {
    parse: (string) => Date;
    format: (Date) => string;
    name: string;
}

export type FormatDict = {
    [key in TimeFormat]: Ops;
}

export const formats: FormatDict = {
    'unix-milli': {
        name: 'Unix (Milliseconds)',
        parse: (s) => new Date(Number.parseInt(s)),
        format: (d) => d.getTime(),
    },
    'unix-sec': {
        name: 'Unix (Seconds)',
        parse: (s) => new Date(Number.parseInt(s) * 1000),
        format: (d) => Math.round(d.getTime() / 1000).toString(),
    },
    'iso-8601': {
        name: 'ISO 8601',
        parse: (s) => new Date(s),
        format: (d) => d.toISOString(),
    },
    // 'rfc-3339': {
    //     'name': 'RFC 2',
    //     'parse': (s) => new Date(Number.parseInt(s)),
    //     'format': (d) => d.getTime(),
    // },
}

// export const formats: FormatDict [
//     ['unix-milli', 'Unix (Millisecons)'],
//     ['unix-sec', 'Unix (Seconds)'],
//     ['iso-8601', 'ISO-8601'],
//     ['rfc-3339', 'RFC 3339'],
// ];
