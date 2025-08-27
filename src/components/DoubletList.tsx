import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { DoubletCard } from "./DoubletCard";

type DoubletListProps = {
    doublets: Doublet[];
    setSelectedDoublet: (doublet: Doublet) => void;
};

export const DoubletList: React.FC<DoubletListProps> = ({ doublets, setSelectedDoublet }) => {
    const [filter, setFilter] = useState<"All" | "J" | "E" | "P">("All");

    // Filter doublets by selected source
    const filteredDoublets = filter === "All"
        ? doublets
        : doublets.filter(d =>
            d.sources && d.sources.some((src: any) => src.name === filter)
        );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Dropdown filter */}
            <select
                value={filter}
                onChange={e => setFilter(e.target.value as "All" | "J" | "E" | "P")}
                style={{ marginBottom: "1rem", padding: "0.3em 0.7em", fontSize: "1em" }}
            >
                <option value="All">All Sources</option>
                <option value="J">J</option>
                <option value="E">E</option>
                <option value="P">P</option>
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
