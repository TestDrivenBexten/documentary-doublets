import React, { useState } from "react";
import { LexiconEntry, LexiconSense, ParentLexicon } from "../types/SefariaTypes";
import { stripHtml } from "../utils/stripHtml";
import styles from "./LexiconDisplay.module.css";

function collectDefinitions(
  senses: LexiconSense[],
  depth = 0,
  maxDepth = 1,
): string[] {
  const defs: string[] = [];
  for (const sense of senses) {
    if (sense.definition) {
      defs.push(stripHtml(sense.definition));
    }
    if (depth < maxDepth && sense.senses) {
      defs.push(...collectDefinitions(sense.senses, depth + 1, maxDepth));
    }
  }
  return defs;
}

const LEXICON_TABS: { lexicon: ParentLexicon; label: string }[] = [
  { lexicon: ParentLexicon.BdbDictionary, label: "BDB" },
  { lexicon: ParentLexicon.BdbAugmentedStrong, label: "BDB+" },
  { lexicon: ParentLexicon.KleinDictionary, label: "Klein" },
  { lexicon: ParentLexicon.JastrowDictionary, label: "Jastrow" },
];

type LexiconEntryDisplayProps = {
  entry: LexiconEntry;
};

const LexiconEntryDisplay: React.FC<LexiconEntryDisplayProps> = ({ entry }) => (
  <div className={styles.entry}>
    <div className={styles.entryHeader}>
      <span dir="rtl" className={styles.headword}>
        {entry.headword}
      </span>
      <span className={styles.lexiconName}>
        {entry.parent_lexicon}
      </span>
    </div>
    {(entry.transliteration || entry.pronunciation) && (
      <div className={styles.pronunciation}>
        {[entry.transliteration, entry.pronunciation]
          .filter(Boolean)
          .join(" · ")}
      </div>
    )}
    {entry.morphology && (
      <div className={styles.morphology}>
        {entry.morphology}
      </div>
    )}
    <ul className={styles.definitionList}>
      {collectDefinitions(entry.senses).map((def, j) => (
        <li key={j}>{def}</li>
      ))}
    </ul>
  </div>
);

type LexiconDisplayProps = {
  entries: LexiconEntry[];
};

export const LexiconDisplay: React.FC<LexiconDisplayProps> = ({ entries }) => {
  const [selected, setSelected] = useState<ParentLexicon>(
    ParentLexicon.BdbDictionary,
  );
  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        No definitions found.
      </div>
    );
  }
  const activeEntry =
    entries.find((e) => e.parent_lexicon === selected) ?? null;

  return (
    <div>
      <div className={styles.tabBar}>
        {LEXICON_TABS.map(({ lexicon, label }) => {
          const available = entries.some((e) => e.parent_lexicon === lexicon);
          const isActive = selected === lexicon;
          return (
            <button
              key={lexicon}
              onClick={() => setSelected(lexicon)}
              disabled={!available}
              className={[
                styles.tab,
                isActive ? styles.tabActive : "",
                !available ? styles.tabDisabled : "",
              ].filter(Boolean).join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
      {activeEntry ? (
        <LexiconEntryDisplay entry={activeEntry} />
      ) : (
        <div className={styles.empty}>
          Not available in this lexicon.
        </div>
      )}
    </div>
  );
};
