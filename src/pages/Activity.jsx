import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

export default function Activity() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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

  const getCategoryEmoji = (category) => {
    const map = { food: '🍕', transport: '🚗', groceries: '🛒', entertainment: '🎬', utilities: '💡', rent: '🏠', travel: '✈️', shopping: '🛍️', drinks: '🍺', other: '💸' };
    return map[category] || '💸';
  };

  // Client-side filter per tab:
  // 'groups' = items that have a groupId/groupName
  // 'friends' = items that don't (direct friend splits)
  const filteredData = Object.fromEntries(
    Object.entries(activityData)
      .map(([date, items]) => {
        let filtered = items;
        if (activeTab === 'groups') filtered = items.filter(i => i.groupId || i.groupName);
        if (activeTab === 'friends') filtered = items.filter(i => !i.groupId && !i.groupName);
        return [date, filtered];
      })
      .filter(([, items]) => items.length > 0)
  );

  const dateKeys = Object.keys(filteredData);
  const allDateKeys = Object.keys(activityData);
  const totalActivityCount = allDateKeys.reduce((sum, k) => sum + activityData[k].length, 0);

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1C1C1E' }}>←</button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '15px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#6347F5' }}>ACTIVITY</h1>
        <div style={{ width: '28px' }} />
      </div>

      <div style={{ padding: '0 20px 100px' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', margin: '20px 0 24px', padding: '4px', background: 'rgba(255,255,255,0.8)', borderRadius: '100px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {['All', 'Friends', 'Groups'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                flex: 1, padding: '10px', borderRadius: '100px',
                background: activeTab === tab.toLowerCase() ? 'var(--blue)' : 'transparent',
                color: activeTab === tab.toLowerCase() ? '#fff' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                transition: 'all 200ms ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Skeleton width="44px" height="44px" borderRadius="50%" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="55%" height="16px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="70%" height="13px" />
                </div>
                <Skeleton width="60px" height="16px" />
              </div>
            ))}
          </div>
        )}

        {!loading && dateKeys.length === 0 && (
          /* Empty state matches design */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px', textAlign: 'center' }}>
            <div style={{
              width: '220px', height: '220px', borderRadius: '24px',
              background: 'linear-gradient(135deg, #00B8D9 0%, #007BFF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '28px', overflow: 'hidden', position: 'relative',
              boxShadow: '0 16px 48px rgba(0,120,200,0.3)',
            }}>
              <span style={{ fontSize: '100px', lineHeight: 1 }}>😄</span>
              {/* decorative dots */}
              {['#FFD700', '#FFD700', '#4FC3F7', '#4FC3F7', '#FFD700'].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: '10px', height: '10px', borderRadius: '50%', background: c, top: `${20 + i * 15}%`, left: `${5 + (i % 2) * 78}%`, opacity: 0.85 }} />
              ))}
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1C1C1E', marginBottom: '10px', letterSpacing: '-0.5px' }}>No expenses yet</h2>
            <p style={{ fontSize: '16px', color: '#8E8E93', marginBottom: '32px' }}>Add your first expense.</p>
            <button
              style={{
                padding: '16px 32px', background: '#1C1C1E', color: '#fff',
                border: 'none', borderRadius: '100px', fontSize: '17px', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
              onClick={() => navigate('/groups')}
            >
              + Add Expense
            </button>
          </div>
        )}

        {dateKeys.map(dateKey => (
          <div key={dateKey} style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
              {dateKey}
            </h3>

            {filteredData[dateKey].map(item => {
              const isPositive = item.amount > 0;
              return (
                <div key={item._id} style={{
                  background: '#fff', borderRadius: '16px', padding: '14px 16px', marginBottom: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {getCategoryEmoji(item.category)}
                    </div>
                    {/* activity indicator dot */}
                    <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '14px', height: '14px', borderRadius: '50%', background: isPositive ? '#34C759' : '#FF3B30', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '8px', color: '#fff', fontWeight: '700' }}>{isPositive ? '↑' : '↓'}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </p>
                    <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.groupName} • {new Date(item.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {item.amount !== 0 && (
                    <span style={{ fontSize: '17px', fontWeight: '700', color: isPositive ? '#34C759' : '#FF3B30', flexShrink: 0 }}>
                      {isPositive ? '+' : '-'}{item.currencySymbol || '₹'}{Math.abs(item.amount).toFixed(0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
