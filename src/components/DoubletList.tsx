import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { DoubletCard } from "./DoubletCard";

// Define a type for source names
export type SourceName = "J" | "E" | "P";
// Define a type for filter options (including "All")
export type SourceFilter = "All" | SourceName;

type DoubletListProps = {
    doublets: Doublet[];
    setSelectedDoublet: (doublet: Doublet) => void;
};

export const DoubletList: React.FC<DoubletListProps> = ({ doublets, setSelectedDoublet }) => {
    const [filter, setFilter] = useState<SourceFilter>("All");

    // Filter doublets by selected source
    const filteredDoublets = filter === "All"
        ? doublets
        : doublets.filter(d =>
            d.sources && d.sources.some((src: any) => src.name === filter)
        );

    // Array of source filters for dropdown
    const sourceFilters: SourceFilter[] = ["All", "J", "E", "P"];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Dropdown filter */}
            <select
                value={filter}
                onChange={e => setFilter(e.target.value as SourceFilter)}
                style={{ marginBottom: "1rem", padding: "0.3em 0.7em", fontSize: "1em" }}
            >
                {sourceFilters.map(name => (
                    <option key={name} value={name}>
                        {name === "All" ? "All Sources" : name}
                    </option>
                ))}
            </select>
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
