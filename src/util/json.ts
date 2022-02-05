import type { IndentationsType } from "../state/types";

export const indentations: [IndentationsType, string][] = [
    ["2-spaces", "2 Spaces"],
    ["4-spaces", "4 Spaces"],
    ["tab", "1 Tab"],
    ["min", "Compact"],
];

export function formatJson(input: string | object, indent: IndentationsType): string {
    let obj;
    if (typeof input == 'string') {
        obj = JSON.parse(input);
    } else {
        obj = input;
    }

    switch (indent) {
    case "2-spaces":
        return JSON.stringify(obj, null, 2);
    case "4-spaces":
        return JSON.stringify(obj, null, 4);
    case "tab":
        return JSON.stringify(obj, null, "\t");
    case "min":
        return JSON.stringify(obj);
    }
}