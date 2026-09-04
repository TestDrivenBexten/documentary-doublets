import React, { useEffect, useState } from "react";
import { VerseTexts } from "../types/SefariaTypes";
import { fetchVerseTexts } from "../services/sefariaService";
import { PrintPreview } from "./PrintPreview";
import styles from "./TextLookup.module.css";

export const TextLookup: React.FC = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verseMap, setVerseMap] = useState<Map<number, VerseTexts> | null>(null);
    const [showHebrew, setShowHebrew] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "p") return;
            const target = event.target as HTMLElement | null;
            if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")) return;
            if (verseMap && Array.from(verseMap.values()).some((texts) => texts.heText)) {
                event.preventDefault();
                setShowPrintPreview(true);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [verseMap]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const ref = query.trim();
        if (!ref) return;
        setIsLoading(true);
        setError(null);
        setVerseMap(null);
        setShowPrintPreview(false);
        fetchVerseTexts(ref)
            .then(setVerseMap)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : "Lookup failed"))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <label htmlFor="text-lookup-input" className={styles.label}>
                Text Lookup
            </label>
            <form onSubmit={handleSearch} className={styles.form}>
                <input
                    id="text-lookup-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Genesis 16:1-14"
                    disabled={isLoading}
                    className={styles.input}
                />
                <button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? "…" : "Look up"}
                </button>
            </form>
            {error && (
                <div className={styles.error}>{error}</div>
            )}
            {verseMap && (
                <VerseResults
                    verseMap={verseMap}
                    showHebrew={showHebrew}
                    onShowHebrewChange={setShowHebrew}
                    onOpenPrintPreview={() => setShowPrintPreview(true)}
                />
            )}
            {showPrintPreview && verseMap && (
                <PrintPreview
                    verseMap={verseMap}
                    onClose={() => setShowPrintPreview(false)}
                />
            )}
        </div>
    );
};

interface VerseResultsProps {
    verseMap: Map<number, VerseTexts>;
    showHebrew: boolean;
    onShowHebrewChange: (value: boolean) => void;
    onOpenPrintPreview: () => void;
}

const VerseResults: React.FC<VerseResultsProps> = ({ verseMap, showHebrew, onShowHebrewChange, onOpenPrintPreview }) => {
    const hasHebrew = Array.from(verseMap.values()).some((v) => v.heText);
    const activeHebrew = showHebrew && hasHebrew;

    return (
        <>
            <div className={styles.langBar}>
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
                            className={[
                                styles.langButton,
                                isActive ? styles.langButtonActive : "",
                                isDisabled ? styles.langButtonDisabled : "",
                            ].join(" ").trim()}
                        >
                            {lang}
                        </button>
                    );
                })}
                {hasHebrew && (
                    <button type="button" onClick={onOpenPrintPreview} className={styles.previewButton}>
                        Print preview
                    </button>
                )}
            </div>
            <ol className={styles.verseList}>
                {Array.from(verseMap.entries()).map(([verseNum, texts]) => {
                    const display = activeHebrew ? (texts.heText || texts.text) : texts.text;
                    return (
                        <li
                            key={verseNum}
                            dir={activeHebrew ? "rtl" : "ltr"}
                            className={[styles.verseItem, activeHebrew ? styles.verseItemHebrew : ""].join(" ").trim()}
                        >
                            {display}
                        </li>
                    );
                })}
            </ol>
        </>
    );
};
