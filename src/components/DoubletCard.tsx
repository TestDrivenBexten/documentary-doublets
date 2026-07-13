import React from "react";
import { Doublet } from "../types/Doublet";
import SourceTag from "./SourceTag";
import { sortSourceNames } from "../sortUtils";
import styles from "./DoubletCard.module.css";

type DoubletCardProps = {
    doublet: Doublet;
    onClick: () => void;
};

export const DoubletCard: React.FC<DoubletCardProps> = ({ doublet, onClick }) => (
    <div
        className={styles.card}
        onClick={onClick}
    >
        <h2 className={styles.title}>{doublet.title}</h2>
        {/* Source tags at the bottom */}
        {doublet.sources && doublet.sources.length > 0 && (
            <div className={styles.tags}>
                {sortSourceNames(doublet.sources.map(src => src.name)).map((name, idx) => (
                    <SourceTag key={idx} name={name} />
                ))}
            </div>
        )}
    </div>
);
