import React, { memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useGroupStore from '../stores/groupStore';

function BottomNav({ showFab = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { groups } = useGroupStore();

  const isActive = useCallback((path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  const handleAdd = useCallback(() => {
    const match = location.pathname.match(/^\/groups\/([^\/]+)/);
    if (match && match[1] && match[1] !== 'new') {
      navigate(`/groups/${match[1]}/add-expense`);
    } else {
      // Find latest active group
      const active = groups.filter(g => !g.archived);
      if (active.length > 0) {
        const latest = [...active].sort((a, b) => {
          const da = a.lastActivity?.date ? new Date(a.lastActivity.date) : new Date(a.createdAt);
          const db = b.lastActivity?.date ? new Date(b.lastActivity.date) : new Date(b.createdAt);
          return db - da;
        })[0];
        navigate(`/groups/${latest._id}/add-expense`);
      } else {
        navigate('/get-started');
      }
    }
  }, [location.pathname, navigate, groups]);

  const tabs = [
    {
      key: 'home',
      path: '/home',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
            fill={active ? '#6347F5' : 'none'} stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: 'groups',
      path: '/groups',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="8" r="3" fill={active ? '#6347F5' : 'none'} stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" />
          <circle cx="17" cy="9" r="2.5" fill={active ? '#6347F5' : 'none'} stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" />
          <path d="M3 19C3 16.2386 5.68629 14 9 14C12.3137 14 15 16.2386 15 19" stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M17 14C19.2091 14 21 15.7909 21 18" stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    { key: 'add', path: null, fab: true },
    {
      key: 'activity',
      path: '/activity',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <polyline points="2 20 8 12 13 17 18 9 22 14" stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: 'account',
      path: '/account',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={active ? '#6347F5' : 'none'} stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" />
          <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke={active ? '#6347F5' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      padding: '0 16px 16px',
      paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
      zIndex: 1000, pointerEvents: 'none',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '100px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '10px 8px',
        pointerEvents: 'all',
        height: '64px',
      }}>
        {tabs.map((tab) => {
          if (tab.fab) {
            if (!showFab) return <div key="fab-spacer" style={{ width: '56px' }} />;
            return (
              <button
                key="fab"
                onClick={handleAdd}
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(99,71,245,0.45)',
                  marginTop: '-24px',
                  transition: 'transform 120ms ease',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            );
          }

          const active = isActive(tab.path);
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1, height: '44px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
              }}
            >
              {tab.icon(active)}
              {active && (
                <div style={{ position: 'absolute', bottom: '2px', width: '4px', height: '4px', borderRadius: '50%', background: '#6347F5' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(BottomNav);
