import React, { memo, useState, useEffect } from 'react';
import { IoNotificationsOutline, IoChevronBack } from 'react-icons/io5';
import useNotificationStore from '../stores/notificationStore';
import NotificationDrawer from './NotificationDrawer';

function Header({ title, onBack, rightAction }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="glass-header" style={{
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: '44px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '60px', zIndex: 1 }}>
        {onBack && (
          <button
            className="header-back"
            onClick={onBack}
            style={{ padding: 0 }}
          >
            <IoChevronBack style={{ fontSize: '20px' }} />
            <span>Back</span>
          </button>
        )}
      </div>

      {title && (
        <h1 className="title-large" style={{
          margin: 0,
          position: onBack ? 'absolute' : 'relative',
          left: onBack ? '50%' : 'auto',
          transform: onBack ? 'translateX(-50%)' : 'none',
          fontSize: onBack ? '17px' : '34px',
          fontWeight: onBack ? '600' : '700',
          letterSpacing: onBack ? '0' : '-0.4px',
          maxWidth: onBack ? '60%' : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{title}</h1>
      )}

      <div style={{ minWidth: '44px', display: 'flex', justifyContent: 'flex-end', zIndex: 1 }}>
        {rightAction || (
          <div
            onClick={() => setIsDrawerOpen(true)}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <IoNotificationsOutline style={{ fontSize: '20px', color: 'var(--text-primary)' }} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--red)',
                border: '2px solid white'
              }} />
            )}
          </div>
        )}
      </div>

      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

export default memo(Header);
