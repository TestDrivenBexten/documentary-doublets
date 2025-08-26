import React from "react";
import { Source } from "../types/Doublet";

type SourceDisplayProps = {
    source: Source;
};

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => (
    <div>
        <h3>{source.name} Source</h3>
        <ul>
            {source.verses.map((v, i) => (
                <li key={i}>
                    <strong>{v.chapter}:{v.verse}</strong> {v.text}
                </li>
            ))}
        </ul>
    </div>
);
