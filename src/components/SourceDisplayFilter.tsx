import React, { useState } from "react";
import { SourceName } from "../types/SourceTypes";
import SourceTag from "./SourceTag";

type SourceFilterProps = {
    options?: SourceName[];
    onChange?: (selected: SourceName[]) => void;
};

const defaultOptions: SourceName[] = ["J", "E", "P"];

const SourceDisplayFilter: React.FC<SourceFilterProps> = ({ options = defaultOptions, onChange }) => {
    const [selected, setSelected] = useState<SourceName[]>(options);

    const handleTagClick = (name: SourceName) => {
        setSelected(prev => {
            const next = prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name];
            if (onChange) onChange(next);
            console.log("Selected sources:", next);
            return next;
        });
    };

    return (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {options.map(opt => (
                <SourceTag
                    key={opt}
                    name={opt}
                    onClick={() => handleTagClick(opt)}
                    selected={selected.includes(opt)}
                />
            ))}
        </div>
    );
};

export default SourceDisplayFilter;
