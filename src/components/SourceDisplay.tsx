import React from "react";
import { Source } from "../types/Doublet";

type SourceDisplayProps = {
    source: Source;
};

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => (
    <div>
        <h3>{source.name} Source</h3>
        <ul style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "1rem", margin: 0 }}>
            {source.verses.map((v, i) => (
                <li
                    key={i}
                    style={
                        source.name === "P"
                            ? { background: "#e6f2ff" }
                            : source.name === "J"
                            ? { background: "#e6ffe6" }
                            : undefined
                    }
                >
                    <strong>{v.chapter}:{v.verse}</strong> {v.text}
                </li>
            ))}
        </ul>
    </div>
);
