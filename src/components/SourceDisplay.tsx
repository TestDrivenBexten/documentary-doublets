import React from "react";
import { Source } from "../types/Doublet";
import { SourceName } from "../types/SourceTypes";
import styles from "./SourceDisplay.module.css";

type SourceDisplayProps = {
    source: Source;
};

const sourceClass: Record<string, string> = {
    P: styles.sourceP,
    J: styles.sourceJ,
    E: styles.sourceE,
    D: styles.sourceD,
};

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => {
    const bgClass = sourceClass[source.name as SourceName] ?? "";
    return (
        <div>
            <h3>{source.name} Source: {source.verseNumbering}</h3>
            <ul className={`${styles.verseList}${bgClass ? ` ${bgClass}` : ""}`}>
                {source.verses.map((v, i) => (
                    <li
                        key={i}
                        className={styles.verseItem}
                    >
                        <strong>{v.chapter}:{v.verse}</strong> {v.englishText}
                    </li>
                ))}
            </ul>
        </div>
    );
};
