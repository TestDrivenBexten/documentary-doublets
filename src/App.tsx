import React, { useEffect, useState } from "react";
import { Doublet } from "./types/Doublet";
import { DoubletList } from "./components/DoubletList";
import { DoubletDisplay } from "./components/DoubletDisplay";

const App: React.FC = () => {
  // useState for a list of doublets
  const [doublets, setDoublets] = useState<Doublet[]>([]);
  // useState for the selected doublet
  const [selectedDoublet, setSelectedDoublet] = useState<Doublet | null>(null);

  useEffect(() => {
    // Fetch a list of filenames from an index file, then fetch all doublets
    fetch("/doublets/index.json")
      .then((res) => res.json())
      .then((filenames: string[]) => {
        Promise.all(
          filenames.map(filename =>
            fetch(`/doublets/${filename}`).then(res => res.json())
          )
        ).then(setDoublets);
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Documentary Doublets</h1>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ minWidth: 320, maxWidth: 400, width: "100%", marginRight: "2rem" }}>
          {doublets.length > 0 ? (
            <DoubletList
              doublets={doublets}
              setSelectedDoublet={setSelectedDoublet}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {selectedDoublet && <DoubletDisplay doublet={selectedDoublet} />}
        </div>
      </div>
    </div>
  );
};

export default App;
