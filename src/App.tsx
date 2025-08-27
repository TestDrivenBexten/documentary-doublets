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
      <h1>Documentary Doublets</h1>
      {doublets.length > 0 ? (
        <DoubletList
          doublets={doublets}
          setSelectedDoublet={setSelectedDoublet}
        />
      ) : (
        <div>Loading...</div>
      )}
      {selectedDoublet && <DoubletDisplay doublet={selectedDoublet} />}
    </div>
  );
};

export default App;
