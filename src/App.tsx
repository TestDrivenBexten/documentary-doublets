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
    // Example: fetch a single doublet for now
    fetch("/doublets/water_from_rock_at_meribah.json")
      .then((res) => res.json())
      .then((doublet) => setDoublets([doublet]));
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
