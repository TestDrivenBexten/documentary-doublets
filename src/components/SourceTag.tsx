import React from "react";
import colors from "../colors";
import { SourceName } from "../types/SourceTypes";

const SourceTag: React.FC<{ name: SourceName; onClick?: (name: SourceName) => void; selected?: boolean }> = ({ name, onClick, selected }) => {
    const bg = colors[`source${name}` as keyof typeof colors] || "#e0e7ef";
    return (
        <span
            style={{
                display: "inline-block",
                background: bg,
                color: "#345",
                borderRadius: "12px",
                padding: "0.2em 0.8em",
                fontSize: "0.85em",
                fontWeight: 500,
                border: selected ? "2px solid #345" : "1px solid #bcd",
                cursor: onClick ? "pointer" : undefined,
                opacity: selected === false ? 0.5 : 1
            }}
            onClick={onClick ? () => onClick(name) : undefined}
        >
            {name}
        </span>
    );
};

export default SourceTag;
