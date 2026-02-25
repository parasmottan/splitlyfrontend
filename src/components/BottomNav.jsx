import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi2';
import { IoTimeOutline, IoTime } from 'react-icons/io5';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IoBarChartOutline, IoBarChart } from 'react-icons/io5';
import { IoPersonOutline, IoPerson } from 'react-icons/io5';

const tabs = [
  { key: 'groups', label: 'Groups', path: '/groups', icon: HiOutlineUserGroup, activeIcon: HiUserGroup },
  { key: 'activity', label: 'Activity', path: '/activity', icon: IoTimeOutline, activeIcon: IoTime },
  { key: 'add', label: '', path: null, fab: true },
  { key: 'insights', label: 'Insights', path: '/insights', icon: IoBarChartOutline, activeIcon: IoBarChart },
  { key: 'account', label: 'Profile', path: '/account', icon: IoPersonOutline, activeIcon: IoPerson },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleAdd = () => {
    // Navigate to get-started page for creating/joining groups
    navigate('/get-started');
  };

  return (
    <nav className="bottom-nav glass-nav">
      {tabs.map(tab => {
        if (tab.fab) {
          return (
            <button
              key={tab.key}
              className="nav-item"
              onClick={handleAdd}
              style={{
                transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
              onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
            style={{
              transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
            onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Icon className="nav-item-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
