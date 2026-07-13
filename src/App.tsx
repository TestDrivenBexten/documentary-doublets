import React, { useEffect, useState } from "react";
import { Doublet } from "./types/Doublet";
import { DoubletList } from "./components/DoubletList";
import { DoubletDisplay } from "./components/DoubletDisplay";
import { Header } from "./components/Header";
import { HebrewLookup } from "./components/HebrewLookup";
import { TextLookup } from "./components/TextLookup";
import styles from "./App.module.css";

const SAFE_FILENAME_RE = /^[\w-]+\.json$/;

const App: React.FC = () => {
  // useState for a list of doublets
  const [doublets, setDoublets] = useState<Doublet[]>([]);
  // useState for the selected doublet
  const [selectedDoublet, setSelectedDoublet] = useState<Doublet | null>(null);
  const [activeMiddle, setActiveMiddle] = useState<"doublets" | "text">("doublets");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch a list of filenames from an index file, then fetch all doublets
    fetch(`${import.meta.env.BASE_URL}doublets/index.json`)
      .then((res) => res.json())
      .then((filenames: string[]) => {
        const safeFilenames = filenames.filter(
          (f) => typeof f === "string" && SAFE_FILENAME_RE.test(f)
        );
        Promise.all(
          safeFilenames.map(filename =>
            fetch(`${import.meta.env.BASE_URL}doublets/${filename}`).then(res => res.json())
          )
        )
          .then(setDoublets)
          .catch((err: unknown) =>
            setError(err instanceof Error ? err.message : "Failed to load doublets")
          );
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load doublet index")
      );
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <div className={`${styles.sidePanel} ${styles.leftPanel}`}>
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          {!error && (doublets.length > 0 ? (
            <DoubletList
              doublets={doublets}
              setSelectedDoublet={setSelectedDoublet}
            />
          ) : (
            <div>Loading...</div>
          ))}
        </div>
        {/* Fragmented vertical line */}
        <div className={`${styles.divider} ${styles.leftDivider}`} />
        <div className={styles.middlePanel}>
          <div className={styles.tabBar}>
            {(["doublets", "text"] as const).map((panel) => {
              const isActive = activeMiddle === panel;
              return (
                <button
                  key={panel}
                  onClick={() => setActiveMiddle(panel)}
                  className={`${styles.tabButton}${isActive ? ` ${styles.tabButtonActive}` : ""}`}
                >
                  {panel === "doublets" ? "Doublets" : "Text Lookup"}
                </button>
              );
            })}
          </div>
          {activeMiddle === "doublets"
            ? selectedDoublet && <DoubletDisplay doublet={selectedDoublet} />
            : <TextLookup />}
        </div>
        {/* Fragmented vertical line */}
        <div className={`${styles.divider} ${styles.rightDivider}`} />
        <div className={`${styles.sidePanel} ${styles.rightPanel}`}>
          <HebrewLookup />
        </div>
      </div>
    </div>
  );
};

export default App;
