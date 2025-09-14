import React, { useState } from "react";

export const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "serif",
          fontSize: "2.8rem",
          letterSpacing: "0.08em",
          textShadow: "1px 2px 6px #bbb",
          marginBottom: "1.5rem",
        }}
      >
        Documentary Doublets
        <span
          style={{
            marginLeft: "0.5em",
            fontSize: "0.7em",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
          title="More information"
          onClick={() => setShowModal(true)}
        >
          ℹ️
        </span>
      </h1>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #444",
          margin: "0 auto 2rem auto",
          width: "80%",
        }}
      />
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2em",
              borderRadius: "8px",
              boxShadow: "0 2px 12px #aaa",
              minWidth: "300px",
              maxWidth: "90vw",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "0.5em",
                right: "0.5em",
                background: "none",
                border: "none",
                fontSize: "1.2em",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>About Documentary Doublets</h2>
            <p>
              The Documentary Hypothesis proposes that the Pentateuch was composed
              from multiple distinct sources, each with its own style and theological
              emphasis. This site highlights parallel passages from these sources according
              to Richard Elliott Friedman's The Bible Sources Revealed.

              Translation taken from the New Revised Standard Version Updated Edition (NRSVue).
            </p>
          </div>
        </div>
      )}
    </>
  );
};
