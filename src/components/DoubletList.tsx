import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { DoubletCard } from "./DoubletCard";
import SourceDisplayFilter from "./SourceDisplayFilter";
import { SourceName } from "../types/SourceTypes";

type DoubletListProps = {
    doublets: Doublet[];
    setSelectedDoublet: (doublet: Doublet) => void;
};

export const DoubletList: React.FC<DoubletListProps> = ({ doublets, setSelectedDoublet }) => {
    const [filter, setFilter] = useState<SourceName[]>([]);

    // Filter doublets by selected sources
    const filteredDoublets = filter.length === 0
        ? doublets
        : doublets.filter(d =>
            d.sources && d.sources.some(src => filter.includes(src.name as SourceName))
        );

    const sourceOptions = doublets.flatMap(d => d.sources?.map(s => s.name as SourceName) || [])
        .filter((v, i, a) => a.indexOf(v) === i); // Unique source names

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>Source filter</div>
            <SourceDisplayFilter
                options={sourceOptions}
                selected={filter}
                onChange={setFilter}
                />
            {filteredDoublets.map((doublet, idx) => (
                <DoubletCard
                    key={idx}
                    doublet={doublet}
                    onClick={() => setSelectedDoublet(doublet)}
                />
            ))}
        </div>
    );
};
