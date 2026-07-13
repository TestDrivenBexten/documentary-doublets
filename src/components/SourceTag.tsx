import React from "react";
import { SourceName } from "../types/SourceTypes";
import styles from "./SourceTag.module.css";

const sourceClass: Record<string, string> = {
    P: styles.sourceP,
    J: styles.sourceJ,
    E: styles.sourceE,
    D: styles.sourceD,
};

const SourceTag: React.FC<{ name: SourceName; onClick?: (name: SourceName) => void; selected?: boolean }> = ({ name, onClick, selected }) => {
    const bgClass = sourceClass[name] ?? styles.sourceDefault;
    const classNames = [
        styles.tag,
        bgClass,
        onClick ? styles.clickable : "",
        selected === true ? styles.selected : "",
        selected === false ? styles.unselected : "",
    ].filter(Boolean).join(" ");

    return (
        <span
            className={classNames}
            onClick={onClick ? () => onClick(name) : undefined}
        >
            {name}
        </span>
    );
};

export default SourceTag;
