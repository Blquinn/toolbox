export const HIPSTER_PHRASES = [
    "baby intelligentsia", "hot chicken", "iphone", "letterpress", "food truck", "lomo", "roof party",
    "celiac", "+1", "photo booth", "yr", "thundercats", "affogato", "poke", "pork belly", "pbr&b",
    "vape", "fashion", "axe", "hashtag", "chillwave", "brooklyn", "bread", "marfa", "cold-pressed",
    "adaptogen", "ennui", "tilde", "fam", "chicharrones", "irony", "you probably haven't heard of them",
    "raclette", "poutine", "seitan", "enamel", "pin", "brunch", "vaporware", "art", "kitsch", "retro",
    "vegan", "sustainable", "tumeric", "cronut", "pug", "aesthetic", "glossier", "selvage", "salvia",
    "wayfarers", "etsy", "taiyaki", "typewriter", "taxidermy", "pabst", "vinyl", "pok", "8-bit",
    "activated charcoal", "direct trade", "palo santo", "everyday", "carry", "mustache", "gochujang",
    "vexillologist", "shoreditch", "deep v", "keytar", "ethical", "sartorial", "kale", "chips", "microdosing",
    "keffiyeh", "master cleanse", "next level", "lumbersexual", "shaman af", "edison bulb", "distillery",
    "knausgaard", "small batch", "portland", "cred", "truffaut", "gastropub", "raw", "denim",
    "helvetica", "umami", "offal", "dreamcatcher", "asymmetrical", "crucifix", "wolf", "godard",
    "coloring book", "squid", "drinking vinegar", "pinterest", "tofu", "hella", "neutra", "cray", "xoxo",
    "jean shorts", "craft beer", "pitchfork", "humblebrag", "listicle", "messenger bag", "subway", "tile",
    "hoodie", "pour-over", "pop-up", "tote", "twee", "lyft", "ugh", "try-hard", "bicycle rights",
    "single-origin coffee", "tumblr", "narwhal", "tattooed", "mumblecore", "authentic", "bespoke", "bitters",
    "austin", "mixtape", "man bun", "swag", "tacos", "selfies", "chartreuse", "chia", "cornhole", "vhs",
    "tousled", "hexagon", "diy", "polaroid", "church-key", "farm-to-table", "ramps", "pickled", "beard",
    "tbh", "street", "cliche", "before they sold out", "heirloom", "flannel", "schlitz", "organic",
    "forage", "cardigan", "whatever", "post-ironic", "literally", "synth", "health", "goth", "normcore",
    "flexitarian", "jianbing", "vice", "live-edge", "locavore", "banjo", "disrupt", "woke", "stumptown",
    "yolo", "yuccie", "copper mug", "slow-carb", "williamsburg", "trust fund", "venmo", "semiotics", "leggings",
    "prism", "biodiesel", "skateboard", "gluten-free", "quinoa", "braid", "scenester", "kickstarter",
    "street art", "green juice", "hell of", "kombucha", "chambray", "fingerstache", "kogi", "la croix",
    "on it", "lo-fi", "four loko", "hammock",
]

export const LATIN_PHRASES: string[] = [
    "ad", "adipisicing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo",
    "consectetur", "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore",
    "duis", "ea", "eiusmod", "elit", "enim", "esse", "est", "et", "eu", "ex", "excepteur",
    "exercitation", "fugiat", "id", "in", "incididunt", "ipsum", "irure", "labore", "laboris",
    "laborum", "lorem", "magna", "minim", "mollit", "nisi", "non", "nostrud", "nulla", "occaecat",
    "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sint", "sit", "sunt",
    "tempor", "ullamco", "ut", "velit", "veniam", "voluptate",
];


export type Mode =
    'words' |
    'sentences' |
    'paragraphs'
    ;

export interface GeneratorOptions {
    count: number;
    mode: Mode;
    paragraphLowerBound: number;
    paragraphUpperBound: number;
    sentenceLowerBound: number;
    sentenceUpperBound: number;
    words: string[];
}

function randIntRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randChoice<T>(choices: T[]): T {
    const idx = Math.floor(Math.random() * choices.length);
    return choices[idx];
}

function lowerToTitle(str: string): string {
    return str[0].toUpperCase() + str.substring(1);
}

function sentence(opts: GeneratorOptions): string {
    let phrases = [];

    const n = opts.mode == 'words' ? opts.count : randIntRange(opts.sentenceLowerBound, opts.sentenceUpperBound);
    for (let i = 0; i < n; i++) {
        const choice = randChoice(opts.words);

        if (i == 0)
            phrases.push(lowerToTitle(choice));
        else
            phrases.push(choice);
    }

    return phrases.join(' ') + '.';
}

function paragraph(opts: GeneratorOptions): string {
    let sentences = [];

    const n = opts.mode == 'sentences' ? opts.count : randIntRange(opts.paragraphLowerBound, opts.paragraphUpperBound);
    for (let i = 0; i < n; i++)
        sentences.push(sentence(opts));

    return sentences.join(' ');
}

function paragraphs(opts: GeneratorOptions): string {
    let ps = [];

    for (let i = 0; i < opts.count; i++)
        ps.push(paragraph(opts));

    return ps.join('\n\n');
}

export function lorem(opts: GeneratorOptions): string {
    switch (opts.mode) {
        case 'words':
            return sentence(opts);
        case 'sentences':
            return paragraph(opts);
        case 'paragraphs':
            return paragraphs(opts);
    }
}
