import React from "react";
import { Doublet } from "../types/Doublet";

type DoubletListProps = {
    doublets: Doublet[];
    setSelectedDoublet: (doublet: Doublet) => void;
};

export const DoubletList: React.FC<DoubletListProps> = ({ doublets, setSelectedDoublet }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {doublets.map((doublet, idx) => (
            <div
                key={idx}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    width: "100%",
                    background: "#fafbfc",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    boxSizing: "border-box",
                    cursor: "pointer"
                }}
                onClick={() => setSelectedDoublet(doublet)}
            >
                <h2 style={{ marginTop: 0 }}>{doublet.title}</h2>
            </div>
        ))}
    </div>
);
