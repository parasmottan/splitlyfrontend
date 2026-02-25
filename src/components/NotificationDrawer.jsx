import React, { useEffect } from 'react';
import { IoCloseOutline, IoNotificationsOutline, IoTimeOutline, IoMailOutline, IoCashOutline } from 'react-icons/io5';
import useNotificationStore from '../stores/notificationStore';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, fetchNotifications, markAsRead, markAllRead, loading } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getIcon = (type) => {
    switch (type) {
      case 'reminder': return <IoCashOutline style={{ color: 'var(--blue)' }} />;
      case 'invite': return <IoMailOutline style={{ color: 'var(--green)' }} />;
      default: return <IoNotificationsOutline style={{ color: 'var(--gray-500)' }} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
      />

      {/* Drawer */}
      <div style={{
        position: 'relative',
        width: '85%',
        maxWidth: '360px',
        height: '100%',
        background: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Notifications</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={markAllRead} style={{ fontSize: '13px', color: 'var(--blue)', fontWeight: '600', background: 'none', border: 'none' }}>Mark all read</button>
            <IoCloseOutline onClick={onClose} style={{ fontSize: '28px', cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading && <div className="loading-center"><div className="spinner"></div></div>}

          {!loading && notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <IoNotificationsOutline style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p>No notifications yet</p>
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: n.isRead ? 'transparent' : 'var(--blue-light)',
                marginBottom: '8px',
                display: 'flex',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '4px' }}>{n.message}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <IoTimeOutline />
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {!n.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue)', marginTop: '6px' }} />}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
