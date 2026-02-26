import React, { memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUserGroup, HiUserGroup, HiOutlinePlus } from 'react-icons/hi2';
import { IoHomeOutline, IoHome, IoReceiptOutline, IoReceipt, IoPersonOutline, IoPerson } from 'react-icons/io5';

const tabs = [
  { key: 'home', label: 'Home', path: '/', icon: IoHomeOutline, activeIcon: IoHome },
  { key: 'groups', label: 'Groups', path: '/groups', icon: HiOutlineUserGroup, activeIcon: HiUserGroup },
  { key: 'add', label: '', path: null, fab: true },
  { key: 'activity', label: 'Activity', path: '/activity', icon: IoReceiptOutline, activeIcon: IoReceipt },
  { key: 'account', label: 'Account', path: '/account', icon: IoPersonOutline, activeIcon: IoPerson },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = useCallback((path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  const handleAdd = useCallback(() => {
    // If we're inside a group view with an ID (e.g. /groups/123), go to add expense
    const match = location.pathname.match(/^\/groups\/([^\/]+)/);
    if (match && match[1] && match[1] !== 'new') {
      navigate(`/groups/${match[1]}/add-expense`);
    } else {
      // Default fallback
      navigate('/groups');
    }
  }, [location.pathname, navigate]);

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        if (tab.fab) {
          return (
            <button
              key={tab.key}
              className="nav-item-fab-wrapper"
              onClick={handleAdd}
            >
              <div className="nav-item-fab">
                <HiOutlinePlus />
              </div>
            </button>
          );
        }

        const active = isActive(tab.path);
        const Icon = active ? tab.activeIcon : tab.icon;

        return (
          <button
            key={tab.key}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon className="nav-item-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default memo(BottomNav);
