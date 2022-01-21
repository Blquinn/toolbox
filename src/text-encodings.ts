import utf8 from "utf8";

export type Encodings =
    'base-16' |
    'base-64' |
    'html' |
    'url';

export function encodeHex(text: string): string {
    return text
        .split("")
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
}

export function decodeHex(hex: string): string {
    return hex
        .split(/(\w\w)/g)
        .filter((p) => !!p)
        .map((c) => String.fromCharCode(parseInt(c, 16)))
        .join("");
}

export function encodeBase64(byteString: string): string {
    return btoa(utf8.encode(byteString));
}

export function decodeBase64(text: string): string {
    return atob(text)
}

function escapeHtml(html: string): string {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function unescapeHtml(html: string): string {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
}

function escapeUrl(url: string): string {
    return encodeURIComponent(url);
}

function unescapeUrl(url: string): string {
    return decodeURIComponent(url);
}

export type ModeType = "encode" | "decode";

type IEncoderMap = {
    [key in Encodings]: {
        [key in ModeType]: (string) => string
    }
};

export const EncoderMap: IEncoderMap = {
    'base-16': {
        'encode': encodeHex,
        'decode': decodeHex,
    },
    'base-64': {
        'encode': encodeBase64,
        'decode': decodeBase64,
    },
    'html': {
        'encode': escapeHtml,
        'decode': unescapeHtml,
    },
    'url': {
        'encode': escapeUrl,
        'decode': unescapeUrl,
    },
}
