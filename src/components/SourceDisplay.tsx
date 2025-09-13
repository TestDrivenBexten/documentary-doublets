import React from "react";
import { Source } from "../types/Doublet";
import { SourceName } from "../types/SourceTypes";
import colors from "../colors";

type SourceDisplayProps = {
    source: Source;
};

function getSourceBackground(sourceName: SourceName) {
    switch (sourceName) {
        case "P":
            return colors.sourceP;
        case "J":
            return colors.sourceJ;
        case "E":
            return colors.sourceE;
        case "D":
            return colors.sourceD;
        default:
            return undefined;
    }
}

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => {
    const background = getSourceBackground(source.name);
    return (
        <div>
            <h3>{source.name} Source: {source.verseNumbering}</h3>
            <ul style={{ background, border: "1px solid #ccc", borderRadius: "6px", padding: "1rem", margin: 0, listStyle: "none" }}>
                {source.verses.map((v, i) => (
                    <li
                        key={i}
                        style={{
                            marginBottom: "0.5em"
                        }}
                    >
                        <strong>{v.chapter}:{v.verse}</strong> {v.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};
