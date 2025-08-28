import type { SourceName } from './SourceTypes';

export type Verse = {
    chapter: number;
    verse: number;
    text: string;
};

export type Source = {
    name: SourceName;
    verses: Verse[];
};

export type Doublet = {
    title: string;
    sources: Source[];
};
