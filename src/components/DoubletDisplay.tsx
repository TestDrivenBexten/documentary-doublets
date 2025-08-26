import React from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => (
    <div>
        <h2>{doublet.title}</h2>
        {doublet.sources && (
            <div style={{ display: "flex", gap: "2rem" }}>
                {doublet.sources.map((source, idx) => (
                    <SourceDisplay key={idx} source={source} />
                ))}
            </div>
        )}
    </div>
);
