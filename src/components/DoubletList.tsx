import React from "react";
import { Doublet } from "../types/Doublet";
import { DoubletCard } from "./DoubletCard";

type DoubletListProps = {
    doublets: Doublet[];
    setSelectedDoublet: (doublet: Doublet) => void;
};

export const DoubletList: React.FC<DoubletListProps> = ({ doublets, setSelectedDoublet }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {doublets.map((doublet, idx) => (
            <DoubletCard
                key={idx}
                doublet={doublet}
                onClick={() => setSelectedDoublet(doublet)}
            />
        ))}
    </div>
);
