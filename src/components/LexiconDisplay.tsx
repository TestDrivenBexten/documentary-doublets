import React, { useState } from "react";
import { LexiconEntry, LexiconSense, ParentLexicon } from "../types/SefariaTypes";
import { stripHtml } from "../utils/stripHtml";

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
  <div style={{ borderTop: "1px solid #ccc", paddingTop: "0.5rem" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "0.5rem",
      }}
    >
      <span dir="rtl" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {entry.headword}
      </span>
      <span style={{ fontSize: "0.75rem", color: "#666", flexShrink: 0 }}>
        {entry.parent_lexicon}
      </span>
    </div>
    {(entry.transliteration || entry.pronunciation) && (
      <div style={{ fontSize: "0.85rem", color: "#555" }}>
        {[entry.transliteration, entry.pronunciation]
          .filter(Boolean)
          .join(" · ")}
      </div>
    )}
    {entry.morphology && (
      <div style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#555" }}>
        {entry.morphology}
      </div>
    )}
    <ul
      style={{ margin: "0.25rem 0 0 1.2rem", padding: 0, fontSize: "0.9rem" }}
    >
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
      <div style={{ fontSize: "0.85rem", color: "#888", paddingTop: "0.5rem" }}>
        No definitions found.
      </div>
    );
  }
  const activeEntry =
    entries.find((e) => e.parent_lexicon === selected) ?? null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          flexWrap: "wrap",
          borderBottom: "1px solid #ddd",
          marginBottom: "0.25rem",
        }}
      >
        {LEXICON_TABS.map(({ lexicon, label }) => {
          const available = entries.some((e) => e.parent_lexicon === lexicon);
          const isActive = selected === lexicon;
          return (
            <button
              key={lexicon}
              onClick={() => setSelected(lexicon)}
              disabled={!available}
              style={{
                padding: "0.25rem 0.5rem",
                fontSize: "0.8rem",
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #333"
                  : "2px solid transparent",
                marginBottom: "-1px",
                fontWeight: isActive ? "bold" : "normal",
                color: available ? (isActive ? "#333" : "#555") : "#bbb",
                cursor: available ? "pointer" : "default",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {activeEntry ? (
        <LexiconEntryDisplay entry={activeEntry} />
      ) : (
        <div
          style={{ fontSize: "0.85rem", color: "#888", paddingTop: "0.5rem" }}
        >
          Not available in this lexicon.
        </div>
      )}
    </div>
  );
};
