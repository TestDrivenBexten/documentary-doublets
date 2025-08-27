import React from "react";
import { Doublet } from "../types/Doublet";

type DoubletCardProps = {
    doublet: Doublet;
    onClick: () => void;
};

export const DoubletCard: React.FC<DoubletCardProps> = ({ doublet, onClick }) => (
    <div
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
        onClick={onClick}
    >
        <h2 style={{ marginTop: 0 }}>{doublet.title}</h2>
    </div>
);
