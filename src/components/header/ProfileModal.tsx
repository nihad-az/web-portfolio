import { useState, useEffect } from "react";

export default function ProfileModal() {
  const [showModal, setShowModal] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setShowModal(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="profile-picture-container">
        <img
          src="/images/profile-picture.jpeg"
          alt="Portrait of Nihad Ibrahimli"
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            className="modal-image"
            src="/images/profile-picture.jpeg"
            alt="Portrait of Nihad Ibrahimli"
            style={{
              width: "90vw",
              height: "90vw",
              maxWidth: "500px",
              maxHeight: "500px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onClick={(e) => e.stopPropagation()} // 👈 prevents closing when clicking the image
          />
        </div>
      )}
    </>
  );
}
