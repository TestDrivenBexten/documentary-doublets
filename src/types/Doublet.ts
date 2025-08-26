export type Verse = {
    chapter: number;
    verse: number;
    text: string;
};

export type Source = {
    name: string;
    verses: Verse[];
};

export type Doublet = {
    title: string;
    sources: Source[];
};
