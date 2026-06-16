import React, { useState } from "react";
import { VerseTexts } from "../types/SefariaTypes";
import { fetchVerseTexts } from "../services/sefariaService";

interface VerseResultsProps {
    verseMap: Map<number, VerseTexts>;
    showHebrew: boolean;
    onShowHebrewChange: (value: boolean) => void;
}

const VerseResults: React.FC<VerseResultsProps> = ({ verseMap, showHebrew, onShowHebrewChange }) => {
    const hasHebrew = Array.from(verseMap.values()).some((v) => v.heText);
    const activeHebrew = showHebrew && hasHebrew;

    return (
        <>
            <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid #ddd", paddingBottom: "0.25rem" }}>
                {(["EN", "HE"] as const).map((lang) => {
                    const isHe = lang === "HE";
                    const isActive = isHe === activeHebrew;
                    const isDisabled = isHe && !hasHebrew;
                    return (
                        <button
                            key={lang}
                            onClick={() => !isDisabled && onShowHebrewChange(isHe)}
                            disabled={isDisabled}
                            title={isDisabled ? "Hebrew text not available" : undefined}
                            style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                background: "none",
                                border: "none",
                                borderBottom: isActive ? "2px solid #333" : "2px solid transparent",
                                marginBottom: "-1px",
                                fontWeight: isActive ? "bold" : "normal",
                                color: isDisabled ? "#bbb" : isActive ? "#333" : "#555",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                            }}
                        >
                            {lang}
                        </button>
                    );
                })}
            </div>
            <ol style={{ margin: 0, padding: "0 0 0 1.5rem", fontSize: "0.95rem" }}>
                {Array.from(verseMap.entries()).map(([verseNum, texts]) => {
                    const display = activeHebrew ? (texts.heText || texts.text) : texts.text;
                    return (
                        <li
                            key={verseNum}
                            dir={activeHebrew ? "rtl" : "ltr"}
                            style={{ marginBottom: "0.4em", fontSize: activeHebrew ? "1.1rem" : undefined }}
                        >
                            <strong>{verseNum}</strong> {display}
                        </li>
                    );
                })}
            </ol>
        </>
    );
};

export const TextLookup: React.FC = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verseMap, setVerseMap] = useState<Map<number, VerseTexts> | null>(null);
    const [showHebrew, setShowHebrew] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const ref = query.trim();
        if (!ref) return;
        setIsLoading(true);
        setError(null);
        setVerseMap(null);
        fetchVerseTexts(ref)
            .then(setVerseMap)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : "Lookup failed"))
            .finally(() => setIsLoading(false));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="text-lookup-input" style={{ fontWeight: "bold" }}>
                Text Lookup
            </label>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                    id="text-lookup-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Genesis 16:1-14"
                    disabled={isLoading}
                    style={{ fontSize: "1rem", padding: "0.4rem 0.6rem", flex: 1, boxSizing: "border-box" }}
                />
                <button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? "…" : "Look up"}
                </button>
            </form>
            {error && (
                <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
            )}
            {verseMap && (
                <VerseResults
                    verseMap={verseMap}
                    showHebrew={showHebrew}
                    onShowHebrewChange={setShowHebrew}
                />
            )}
        </div>
    );
};
