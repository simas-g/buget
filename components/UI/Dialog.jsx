import React from "react";
import { createPortal } from "react-dom";

const DialogWrapper = ({ open, onClose, children, ...props }) => {
  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose} 
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: "1.5rem",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()} 
      {...props}

      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default DialogWrapper;
