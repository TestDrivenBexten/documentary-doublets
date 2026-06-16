import React, { useState } from "react";
import { LexiconEntry } from "../types/SefariaTypes";
import { fetchHebrewWordDefinition } from "../services/sefariaService";
import { LexiconDisplay } from "./LexiconDisplay";

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
            {results && <LexiconDisplay entries={results} />}
        </div>
    );
};
