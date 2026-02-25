import React from 'react';

export default function Modal({ show, icon, title, message, children, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        {icon && <div className="modal-icon">{icon}</div>}
        {title && <h3 className="modal-title">{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        {children}
      </div>
    </div>
  );
}
