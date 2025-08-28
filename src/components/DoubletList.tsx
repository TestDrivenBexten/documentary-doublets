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
    const [filter, setFilter] = useState<SourceName | null>(null);

    // Filter doublets by selected source
    const filteredDoublets = filter === null
        ? doublets
        : doublets.filter(d =>
            d.sources && d.sources.some(src => src.name === filter)
        );
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>Source filter</div>
            <SourceDisplayFilter
                options={doublets.flatMap(d => d.sources?.map(s => s.name as SourceName) ?? []).filter((v, i, a) => a.indexOf(v) === i)}
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
