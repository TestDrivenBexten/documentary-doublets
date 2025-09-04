import type { SourceName } from './SourceTypes';

export type Verse = {
    chapter: number;
    verse: number;
    text: string;
};

export type Source = {
    name: SourceName;
    verseNumbering: string; // e.g., "Genesis 16:1-14"
    verses: Verse[];
};

export type Doublet = {
    title: string;
    sources: Source[];
};
