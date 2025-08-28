import React from "react";
import { SourceName } from "../types/SourceTypes";
import SourceTag from "./SourceTag";

type SourceFilterProps = {
    options?: SourceName[];
};

const defaultOptions: SourceName[] = ["J", "E", "P"];

const SourceDisplayFilter: React.FC<SourceFilterProps> = ({ options = defaultOptions }) => (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {options.map(opt => (
            <SourceTag key={opt} name={opt} />
        ))}
    </div>
);

export default SourceDisplayFilter;
