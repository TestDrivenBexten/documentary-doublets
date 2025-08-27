import React from "react";

export const Header: React.FC = () => (
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
    </h1>
    <hr
      style={{
        border: "none",
        borderTop: "2px solid #444",
        margin: "0 auto 2rem auto",
        width: "80%",
      }}
    />
  </>
);
