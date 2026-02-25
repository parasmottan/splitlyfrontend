import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';

const CATEGORY_ICONS = {
  food: '🍽️',
  transport: '🚗',
  groceries: '🛒',
  entertainment: '🎬',
  utilities: '💡',
  rent: '🏠',
  travel: '✈️',
  shopping: '🛍️',
  settlement: '💸',
  other: '📋'
};

export default function Activity() {
  const { user } = useAuthStore();
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get('/activity');
        setActivityData(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchActivity();
  }, []);

  const dateKeys = Object.keys(activityData);

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div style={{ padding: '16px 0 8px' }}>
        <h1 className="title-large">Activity</h1>
      </div>

      {loading && (
        <div style={{ marginTop: '12px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <Skeleton width="80px" height="14px" style={{ marginBottom: '12px' }} />
              {[1, 2, 3].map(j => (
                <div key={j} className="card" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Skeleton width="40px" height="40px" borderRadius="10px" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Skeleton width="120px" height="16px" />
                        <Skeleton width="60px" height="16px" />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="80px" height="13px" />
                        <Skeleton width="40px" height="12px" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && dateKeys.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No activity yet</h3>
          <p className="empty-state-text">Your expense history will appear here.</p>
        </div>
      )}

      {dateKeys.map(dateKey => (
        <div key={dateKey} style={{ marginBottom: '24px' }}>
          <h3 className="caption" style={{ marginBottom: '10px' }}>{dateKey}</h3>
          {activityData[dateKey].map(item => {
            const isPositive = item.amount > 0;
            return (
              <div key={item._id} className="card animate-fade-in" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {CATEGORY_ICONS[item.category] || '📋'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </span>
                      <span style={{ fontWeight: '600', fontSize: '16px', color: isPositive ? 'var(--green)' : 'var(--red)', flexShrink: 0, marginLeft: '8px' }}>
                        {isPositive ? '+' : '-'}{item.currencySymbol}{Math.abs(item.amount).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.groupName}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                        {new Date(item.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <BottomNav />
    </div>
  );
}
