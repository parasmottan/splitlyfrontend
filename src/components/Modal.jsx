import React from 'react';

export default function Modal({ show, icon, title, message, children, onClose, variant = 'alert' }) {
  if (!show) return null;

  const isSheet = variant === 'sheet';

  return (
    <div
      className={`modal-overlay${isSheet ? ' modal-overlay--sheet' : ''}`}
      onClick={onClose}
    >
      <div
        className={`modal-content${isSheet ? ' modal-content--sheet' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {isSheet && (
          <div style={{
            width: '36px',
            height: '4px',
            background: 'var(--gray-300)',
            borderRadius: '2px',
            margin: '-8px auto 20px auto'
          }} />
        )}
        {icon && <div className="modal-icon">{icon}</div>}
        {title && <h3 className="modal-title">{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        <div style={{ textAlign: isSheet ? 'left' : 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
