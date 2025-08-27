import React from "react";
import { Source } from "../types/Doublet";
import colors from "../colors";

type SourceDisplayProps = {
    source: Source;
};

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => (
    <div>
        <h3>{source.name} Source</h3>
        <ul style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "1rem", margin: 0, listStyle: "none" }}>
            {source.verses.map((v, i) => {
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
                    <li
                        key={i}
                        style={{
                            ...(background ? { background } : {}),
                            marginBottom: "0.5em"
                        }}
                    >
                        <strong>{v.chapter}:{v.verse}</strong> {v.text}
                    </li>
                );
            })}
        </ul>
    </div>
);
