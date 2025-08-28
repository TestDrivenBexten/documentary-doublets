import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";
import SourceDisplayFilter from "./SourceDisplayFilter";
import { SourceName } from "../types/SourceTypes";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => {
    const [filter, setFilter] = useState<SourceName[]>([]);

    return (
        <div>
            <h2>{doublet.title}</h2>
            {doublet.sources && (
                <>
                    <SourceDisplayFilter
                        options={doublet.sources.map(s => s.name)}
                        onChange={setFilter}
                    />
                    <div style={{ display: "flex", gap: "2rem" }}>
                        {doublet.sources
                            .filter(source => filter.includes(source.name))
                            .map((source, idx) => (
                                <SourceDisplay key={idx} source={source} />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};
