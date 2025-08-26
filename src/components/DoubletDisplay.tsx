import React from "react";
import { Doublet } from "../types/Doublet";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => (
    <div>
        <h2>{doublet.title}</h2>
        {doublet.priestly_source && (
            <div>
                <h3>Priestly Source</h3>
                <ul>
                    {doublet.priestly_source.verses.map((v, i) => (
                        <li key={i}>
                            <strong>{v.chapter}:{v.verse}</strong> {v.text}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {doublet.yahwist_source && (
            <div>
                <h3>Yahwist Source</h3>
                <ul>
                    {doublet.yahwist_source.verses.map((v, i) => (
                        <li key={i}>
                            <strong>{v.chapter}:{v.verse}</strong> {v.text}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);
