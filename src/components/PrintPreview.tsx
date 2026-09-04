import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { VerseTexts } from "../types/SefariaTypes";
import styles from "./PrintPreview.module.css";

interface PrintPreviewProps {
    verseMap: Map<number, VerseTexts>;
    onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ verseMap, onClose }) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        document.body.classList.add("printPreviewOpen");
        closeButtonRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.classList.remove("printPreviewOpen");
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        (
        <div
            className={styles.overlay}
            onClick={onClose}
            role="presentation"
        >
            <section
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="print-preview-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.toolbar}>
                    <h2 id="print-preview-title">Hebrew Print Preview</h2>
                    <div className={styles.actions}>
                        <button type="button" onClick={() => window.print()}>
                            Print
                        </button>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close print preview"
                        >
                            Close
                        </button>
                    </div>
                </div>
                <ol className={styles.verseList} dir="rtl">
                    {Array.from(verseMap.entries()).map(([verseNumber, texts]) => (
                        <li key={verseNumber} className={styles.verseItem}>
                            <span className={styles.verseNumber}>{verseNumber}</span>
                            <span>{texts.heText || texts.text}</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
        ),
        document.body,
    );
};