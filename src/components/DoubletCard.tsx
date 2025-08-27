import React from "react";
import { Doublet } from "../types/Doublet";
import colors from "../colors";

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
        {/* Source tags at the bottom */}
        {doublet.sources && doublet.sources.length > 0 && (
            <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {doublet.sources.map((src, idx) => {
                    const bg =
                        colors[`source${src.name}` as keyof typeof colors] || "#e0e7ef";
                    return (
                        <span
                            key={idx}
                            style={{
                                display: "inline-block",
                                background: bg,
                                color: "#345",
                                borderRadius: "12px",
                                padding: "0.2em 0.8em",
                                fontSize: "0.85em",
                                fontWeight: 500,
                                border: "1px solid #bcd"
                            }}
                        >
                            {src.name}
                        </span>
                    );
                })}
            </div>
        )}
    </div>
);
