import React from "react";
import { SourceName } from "../types/SourceTypes";
import SourceTag from "./SourceTag";
import { sortSourceNames } from "../sortUtils";
import styles from "./SourceDisplayFilter.module.css";

type SourceFilterProps = {
    options?: SourceName[];
    selected: SourceName[];
    onChange: (selected: SourceName[]) => void;
};

const defaultOptions: SourceName[] = ["J", "E", "P"];

const SourceDisplayFilter: React.FC<SourceFilterProps> = ({ options = defaultOptions, selected, onChange }) => {
    const sortedOptions = sortSourceNames(options);
    const handleTagClick = (name: SourceName) => {
        const next = selected.includes(name)
            ? selected.filter(n => n !== name)
            : [...selected, name];
        onChange(next);
    };

    return (
        <div className={styles.filter}>
            {sortedOptions.map(opt => (
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
