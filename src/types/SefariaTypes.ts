/** Minimal typed response for GET /api/v3/texts/{tref} */
export type SefariaV3TextVersion = {
    /** Language code: "en" (LTR) or "he" (RTL) */
    language: string;
    versionTitle: string;
    /** Text segments for the requested section */
    text: string | string[];
};

export type SefariaV3TextResponse = {
    /** Human-readable title of the text */
    title: string;
    /** Short description / heDesc / enDesc of the text */
    description?: string;
    /** Requested version(s) with their text content */
    versions: SefariaV3TextVersion[];
};

/** Raw entry shape from GET /api/words/{word} */
export interface SefariaRawWordEntry {
    headword: string;
    parent_lexicon: string;
    transliteration?: string;
    pronunciation?: string;
    content?: { morphology?: string; senses?: LexiconSense[] };
}

/** Parsed verse texts returned by fetchVerseTexts */
export type VerseTexts = {
    text: string;
    heText: string;
};

/** Lexicons returned by GET /api/words/{word} */
export enum ParentLexicon {
    BdbAugmentedStrong = "BDB Augmented Strong",
    BdbDictionary = "BDB Dictionary",
    KleinDictionary = "Klein Dictionary",
    JastrowDictionary = "Jastrow Dictionary",
}

/** Recursive sense node from GET /api/words/{word} — may contain HTML in `definition` */
export type LexiconSense = {
    definition?: string;
    num?: string;
    senses?: LexiconSense[];
};

/** One dictionary's entry for a Hebrew word */
export type LexiconEntry = {
    headword: string;
    parent_lexicon: ParentLexicon | string;
    transliteration?: string;
    pronunciation?: string;
    morphology?: string;
    senses: LexiconSense[];
};
