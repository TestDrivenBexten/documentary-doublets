import React, { useState } from "react";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <h1 className={styles.title}>
        Documentary Doublets
        <span
          className={styles.infoIcon}
          title="More information"
          onClick={() => setShowModal(true)}
        >
          ℹ️
        </span>
      </h1>
      <hr className={styles.divider} />
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
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
