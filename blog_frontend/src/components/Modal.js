import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export function Modal({ title, children, footer, onClose }) {
  /** Accessible modal with backdrop click + Escape close. */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      onMouseDown={(e) => {
        // close on backdrop click only
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
