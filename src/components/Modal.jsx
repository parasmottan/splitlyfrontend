import React from 'react';

export default function Modal({ show, icon, title, message, children, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div style={{
          width: '36px',
          height: '5px',
          background: 'var(--gray-300)',
          borderRadius: '10px',
          margin: '-12px auto 20px auto'
        }} />
        {icon && <div className="modal-icon">{icon}</div>}
        {title && <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        <div style={{ textAlign: 'left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
