import React from "react";
import { LexiconEntry, LexiconSense } from "../types";

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function collectDefinitions(senses: LexiconSense[], depth = 0, maxDepth = 1): string[] {
    const defs: string[] = [];
    for (const sense of senses) {
        if (sense.definition) {
            defs.push(stripHtml(sense.definition));
        }
        if (depth < maxDepth && sense.senses) {
            defs.push(...collectDefinitions(sense.senses, depth + 1, maxDepth));
        }
    }
    return defs;
}

type LexiconEntryDisplayProps = {
    entry: LexiconEntry;
};

const LexiconEntryDisplay: React.FC<LexiconEntryDisplayProps> = ({ entry }) => (
    <div style={{ borderTop: "1px solid #ccc", paddingTop: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
            <span dir="rtl" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{entry.headword}</span>
            <span style={{ fontSize: "0.75rem", color: "#666", flexShrink: 0 }}>{entry.parent_lexicon}</span>
        </div>
        {(entry.transliteration || entry.pronunciation) && (
            <div style={{ fontSize: "0.85rem", color: "#555" }}>
                {[entry.transliteration, entry.pronunciation].filter(Boolean).join(" · ")}
            </div>
        )}
        {entry.morphology && (
            <div style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#555" }}>{entry.morphology}</div>
        )}
        <ul style={{ margin: "0.25rem 0 0 1.2rem", padding: 0, fontSize: "0.9rem" }}>
            {collectDefinitions(entry.senses).map((def, j) => (
                <li key={j}>{def}</li>
            ))}
        </ul>
    </div>
);

type LexiconDisplayProps = {
    entries: LexiconEntry[];
};

export const LexiconDisplay: React.FC<LexiconDisplayProps> = ({ entries }) => {
    return (
        <>
            {entries.map((entry, i) => (
                <LexiconEntryDisplay key={i} entry={entry} />
            ))}
        </>
    );
};
