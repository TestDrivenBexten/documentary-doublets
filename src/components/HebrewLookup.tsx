import React, { useState } from "react";
import { LexiconEntry, LexiconSense } from "../types";
import { fetchHebrewWordDefinition } from "../services/sefariaService";

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

export const HebrewLookup: React.FC = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<LexiconEntry[] | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const word = query.trim();
        if (!word) return;
        setIsLoading(true);
        setError(null);
        setResults(null);
        fetchHebrewWordDefinition(word)
            .then(setResults)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : "Lookup failed"))
            .finally(() => setIsLoading(false));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="hebrew-lookup-input" style={{ fontWeight: "bold" }}>
                Hebrew Lookup
            </label>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                    id="hebrew-lookup-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Hebrew word…"
                    dir="rtl"
                    style={{ fontSize: "1.1rem", padding: "0.4rem 0.6rem", flex: 1, boxSizing: "border-box" }}
                />
                <button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? "…" : "Look up"}
                </button>
            </form>
            {error && (
                <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
            )}
            {results && results.map((entry, i) => (
                <div key={i} style={{ borderTop: "1px solid #ccc", paddingTop: "0.5rem" }}>
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
            ))}
        </div>
    );
};
