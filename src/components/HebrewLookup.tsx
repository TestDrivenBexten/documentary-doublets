import React, { useState } from "react";
import { LexiconEntry } from "../types/SefariaTypes";
import { fetchHebrewWordDefinition } from "../services/sefariaService";
import { LexiconDisplay } from "./LexiconDisplay";
import styles from "./HebrewLookup.module.css";

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
        <div className={styles.container}>
            <label htmlFor="hebrew-lookup-input" className={styles.label}>
                Hebrew Lookup
            </label>
            <form onSubmit={handleSearch} className={styles.form}>
                <input
                    id="hebrew-lookup-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Hebrew word…"
                    dir="rtl"
                    className={styles.input}
                />
                <button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? "…" : "Look up"}
                </button>
            </form>
            {error && (
                <div className={styles.error}>{error}</div>
            )}
            {results && <LexiconDisplay entries={results} />}
        </div>
    );
};
