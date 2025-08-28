import React from "react";
import colors from "../colors";
import { SourceName } from "../types/SourceTypes";

const SourceTag: React.FC<{ name: SourceName }> = ({ name }) => {
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
                border: "1px solid #bcd"
            }}
        >
            {name}
        </span>
    );
};

export default SourceTag;
