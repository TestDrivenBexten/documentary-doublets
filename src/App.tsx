import React, { useEffect, useState } from "react";
import { Doublet } from "./types/Doublet";
import { DoubletList } from "./components/DoubletList";
import { DoubletDisplay } from "./components/DoubletDisplay";
import { Header } from "./components/Header";
import { HebrewLookup } from "./components/HebrewLookup";
import { TextLookup } from "./components/TextLookup";

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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ width: "20vw", minWidth: 220, maxWidth: 400, marginRight: "2rem" }}>
          {error && (
            <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
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
        <div
          style={{
            borderLeft: "2px dashed #888",
            marginRight: "2rem",
            alignSelf: "stretch"
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid #ddd", marginBottom: "0.75rem" }}>
            {(["doublets", "text"] as const).map((panel) => {
              const isActive = activeMiddle === panel;
              return (
                <button
                  key={panel}
                  onClick={() => setActiveMiddle(panel)}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.85rem",
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2px solid #333" : "2px solid transparent",
                    marginBottom: "-1px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#333" : "#555",
                    cursor: "pointer",
                  }}
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
        <div
          style={{
            borderLeft: "2px dashed #888",
            marginLeft: "2rem",
            alignSelf: "stretch"
          }}
        />
        <div style={{ width: "20vw", minWidth: 220, maxWidth: 400, marginLeft: "2rem" }}>
          <HebrewLookup />
        </div>
      </div>
    </div>
  );
};

export default App;
