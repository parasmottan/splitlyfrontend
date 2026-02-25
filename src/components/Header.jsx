import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline, IoChevronBack } from 'react-icons/io5';
import useNotificationStore from '../stores/notificationStore';
import NotificationDrawer from './NotificationDrawer';

export default function Header({ title, onBack }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onBack && (
          <IoChevronBack onClick={onBack} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--text-primary)' }} />
        )}
        <h1 className="title-large" style={{ margin: 0 }}>{title}</h1>
      </div>

      <div
        onClick={() => setIsDrawerOpen(true)}
        style={{
          position: 'relative',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'var(--gray-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <IoNotificationsOutline style={{ fontSize: '24px', color: 'var(--text-primary)' }} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--red)',
            border: '2px solid white'
          }} />
        )}
      </div>

      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
