import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";
import SourceDisplayFilter from "./SourceDisplayFilter";
import { SourceName } from "../types/SourceTypes";
import { sortSourceNames, sortSourcesByName } from "../sortUtils";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => {
    const [horizontal, setHorizontal] = useState(false);
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
                    <div
                        style={{
                            display: "flex",
                            gap: "1em"
                        }}
                    >
                        <SourceDisplayFilter
                            options={sortedSourceNames}
                            selected={filter}
                            onChange={setFilter}
                        />
                        <span
                            style={{
                                cursor: "pointer",
                                fontSize: "1.5em",
                                display: "inline-block"
                            }}
                            title={`Stack ${horizontal ? "Vertically" : "Horizontally"}`}
                            onClick={() => setHorizontal(h => !h)}
                        >
                            {horizontal ? "↔" : "↕"}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: horizontal ? "row" : "column",
                            gap: "1em"
                        }}
                    >
                        {sortSourcesByName(doublet.sources)
                            .filter(source => filter.includes(source.name))
                            .map((source, idx) => (
                                <SourceDisplay
                                    key={idx}
                                    source={source}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};
