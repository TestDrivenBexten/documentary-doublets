export type ExampleProps = {
    title: string;
    description?: string;
};

export interface AppState {
    isLoading: boolean;
    data: any[];
}

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