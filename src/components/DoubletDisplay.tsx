import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";
import SourceDisplayFilter from "./SourceDisplayFilter";
import { SourceName } from "../types/SourceTypes";
import { sortSourceNames } from "../sortUtils";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => {
    const sourceNames = doublet.sources?.map(s => s.name) || [];
    const sortedSourceNames = sortSourceNames(sourceNames);
    const [filter, setFilter] = useState<SourceName[]>(sortedSourceNames);

    React.useEffect(() => {
        setFilter(sortedSourceNames);
    }, [doublet]);

    return (
        <div>
            <h2>{doublet.title}</h2>
            {doublet.sources && (
                <>
                    <SourceDisplayFilter
                        options={sortedSourceNames}
                        selected={filter}
                        onChange={setFilter}
                    />
                    <div style={{ display: "flex", gap: "2rem" }}>
                        {doublet.sources
                            .filter(source => filter.includes(source.name))
                            .sort((a, b) => sortSourceNames([a.name, b.name]).indexOf(a.name) - sortSourceNames([a.name, b.name]).indexOf(b.name))
                            .map((source, idx) => (
                                <SourceDisplay key={idx} source={source} />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};
