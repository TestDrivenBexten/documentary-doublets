import React, { useState } from "react";
import { Doublet } from "../types/Doublet";
import { SourceDisplay } from "./SourceDisplay";
import SourceDisplayFilter from "./SourceDisplayFilter";
import { SourceName } from "../types/SourceTypes";
import { sortSourceNames, sortSourcesByName } from "../sortUtils";
import styles from "./DoubletDisplay.module.css";

type DoubletDisplayProps = {
    doublet: Doublet;
};

export const DoubletDisplay: React.FC<DoubletDisplayProps> = ({ doublet }) => {
    const [horizontal, setHorizontal] = useState(false);
    const sourceNames = doublet.sources?.map(s => s.name) || [];
    const sortedSourceNames = sortSourceNames(sourceNames);
    const [filter, setFilter] = useState<SourceName[]>(sortedSourceNames);

    React.useEffect(() => {
        setFilter(sortedSourceNames);
    }, [doublet]);

    return (
        <div>
            <h2>{doublet.title}</h2>
            {doublet.sources && (
                <>
                    <DoubletControls
                        sortedSourceNames={sortedSourceNames}
                        filter={filter}
                        horizontal={horizontal}
                        onFilterChange={setFilter}
                        onToggleLayout={() => setHorizontal(h => !h)}
                    />
                    <SourceList
                        sources={sortSourcesByName(doublet.sources).filter(source => filter.includes(source.name))}
                        horizontal={horizontal}
                    />
                </>
            )}
        </div>
    );
};

type DoubletControlsProps = {
    sortedSourceNames: SourceName[];
    filter: SourceName[];
    horizontal: boolean;
    onFilterChange: (value: SourceName[]) => void;
    onToggleLayout: () => void;
};

const DoubletControls: React.FC<DoubletControlsProps> = ({ sortedSourceNames, filter, horizontal, onFilterChange, onToggleLayout }) => (
    <div className={styles.controls}>
        <SourceDisplayFilter
            options={sortedSourceNames}
            selected={filter}
            onChange={onFilterChange}
        />
        <button
            className={styles.layoutToggle}
            aria-label={`Stack ${horizontal ? "Vertically" : "Horizontally"}`}
            title={`Stack ${horizontal ? "Vertically" : "Horizontally"}`}
            onClick={onToggleLayout}
        >
            {horizontal ? "↔" : "↕"}
        </button>
    </div>
);

type SourceListProps = {
    sources: Doublet["sources"] & {};
    horizontal: boolean;
};

const SourceList: React.FC<SourceListProps> = ({ sources, horizontal }) => (
    <div className={`${styles.sourceList} ${horizontal ? styles.sourceListHorizontal : styles.sourceListVertical}`}>
        {sources.map((source, idx) => (
            <SourceDisplay key={idx} source={source} />
        ))}
    </div>
);
