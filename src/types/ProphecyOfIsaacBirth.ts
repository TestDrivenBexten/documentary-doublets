export type Verse = {
    chapter: number;
    verse: number;
    text: string;
};

export type Source = {
    verses: Verse[];
};

export type Doublet = {
    title: string;
    priestly_source?: Source;
    yahwist_source?: Source;
};
