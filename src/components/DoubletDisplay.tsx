import React from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";
import { SourceFilter } from "./DoubletList";
import SourceDisplayFilter from "./SourceDisplayFilter";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => (
    <div>
        <h2>{doublet.title}</h2>
        {doublet.sources && (
            <>
                <SourceDisplayFilter
                    options={doublet.sources.map(s => s.name as SourceFilter || "All")}
                />
                <div style={{ display: "flex", gap: "2rem" }}>
                    {doublet.sources.map((source, idx) => (
                        <SourceDisplay key={idx} source={source} />
                    ))}
                </div>
            </>
        )}
    </div>
);
