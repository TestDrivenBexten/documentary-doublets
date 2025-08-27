import React from "react";
import { Source } from "../types/Doublet";
import colors from "../colors";

type SourceDisplayProps = {
    source: Source;
};

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => {
    let background;
    switch (source.name) {
        case "P":
            background = colors.sourceP;
            break;
        case "J":
            background = colors.sourceJ;
            break;
        case "E":
            background = colors.sourceE;
            break;
        default:
            background = undefined;
    }
    return (
        <div>
            <h3>{source.name} Source</h3>
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
