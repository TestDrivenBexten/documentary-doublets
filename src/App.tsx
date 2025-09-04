import React, { useEffect, useState } from "react";
import { Doublet } from "./types/Doublet";
import { DoubletList } from "./components/DoubletList";
import { DoubletDisplay } from "./components/DoubletDisplay";
import { Header } from "./components/Header";

const App: React.FC = () => {
  // useState for a list of doublets
  const [doublets, setDoublets] = useState<Doublet[]>([]);
  // useState for the selected doublet
  const [selectedDoublet, setSelectedDoublet] = useState<Doublet | null>(null);

  useEffect(() => {
    // Fetch a list of filenames from an index file, then fetch all doublets
    fetch(`${import.meta.env.BASE_URL}doublets/index.json`)
      .then((res) => res.json())
      .then((filenames: string[]) => {
        Promise.all(
          filenames.map(filename =>
            fetch(`${import.meta.env.BASE_URL}doublets/${filename}`).then(res => res.json())
          )
        ).then(setDoublets);
      });
  }, []);

  return (
    <div>
      {/* Google Fonts link for UnifrakturCook */}
      <link
        href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap"
        rel="stylesheet"
      />
      <Header />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ width: "20vw", minWidth: 220, maxWidth: 400, marginRight: "2rem" }}>
          {doublets.length > 0 ? (
            <DoubletList
              doublets={doublets}
              setSelectedDoublet={setSelectedDoublet}
            />
          ) : (
            <div>Loading...</div>
          )}
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
          {selectedDoublet && <DoubletDisplay doublet={selectedDoublet} />}
        </div>
      </div>
    </div>
  );
};

export default App;
