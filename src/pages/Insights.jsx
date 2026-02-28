import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

const CATEGORY_COLORS = [
  '#6347F5', '#FF9500', '#34C759', '#FF3B30', '#AF52DE',
  '#FF2D55', '#5856D6', '#00C7BE', '#FFCC00'
];

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');

  const fetchInsights = async (groupId) => {
    setLoading(true);
    try {
      const url = groupId && groupId !== 'all' ? `/insights?groupId=${groupId}` : '/insights';
      const { data: d } = await api.get(url);
      setData(d);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchInsights(); }, []);

  const handleGroupFilter = (groupId) => {
    setSelectedGroup(groupId);
    fetchInsights(groupId);
  };

  if (loading && !data) {
    return (
      <div style={{ background: '#F2F2F7', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ padding: '16px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton width="120px" height="24px" />
          <Skeleton width="28px" height="28px" borderRadius="50%" />
        </div>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '28px 24px', textAlign: 'center', marginBottom: '16px' }}>
          <Skeleton width="140px" height="140px" borderRadius="50%" style={{ margin: '0 auto 20px' }} />
          <Skeleton width="120px" height="22px" style={{ margin: '0 auto 12px' }} />
          <Skeleton width="180px" height="36px" borderRadius="100px" style={{ margin: '0 auto' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '20px' }}>
            <Skeleton width="80%" height="14px" style={{ marginBottom: '8px' }} />
            <Skeleton width="60%" height="28px" />
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '20px' }}>
            <Skeleton width="80%" height="14px" style={{ marginBottom: '8px' }} />
            <Skeleton width="60%" height="28px" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const maxCategoryAmount = data?.categories?.length > 0 ? Math.max(...data.categories.map(c => c.amount)) : 0;
  const currSymbol = '₹';
  const score = data?.fairnessScore || 88;
  const circumference = 2 * Math.PI * 50;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ background: '#F2F2F7', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1C1C1E' }}>←</button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '15px', fontWeight: '700', letterSpacing: '1px', color: '#6347F5', textTransform: 'uppercase' }}>INSIGHTS</h1>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1C1C1E' }}>•••</button>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Group Filter Tabs */}
        {data?.groupTabs?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
            {['All', ...data.groupTabs.map(g => g.name)].map((tab, i) => {
              const tabId = i === 0 ? 'all' : data.groupTabs[i - 1]._id;
              const isActive = selectedGroup === tabId;
              return (
                <button
                  key={tabId}
                  onClick={() => handleGroupFilter(tabId)}
                  style={{
                    padding: '8px 18px', borderRadius: '100px', whiteSpace: 'nowrap',
                    background: isActive ? 'var(--blue)' : '#fff',
                    color: isActive ? '#fff' : '#8E8E93',
                    fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0,
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {/* Fairness Score Card */}
        <div style={{ background: '#fff', borderRadius: '28px', padding: '32px 24px 24px', marginBottom: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {/* Circular score */}
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 20px' }}>
            <svg width="180" height="180" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F0EEFF" strokeWidth="12" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6347F5" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '44px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-2px' }}>{score}</span>
              <br />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#8E8E93', letterSpacing: '0.5px', textTransform: 'uppercase' }}>SCORE</span>
            </div>
            {/* Emoji badge on ring */}
            <div style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              😊
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', marginBottom: '12px' }}>Fairness Score</h3>

          {/* Streak pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'rgba(255,149,0,0.12)', borderRadius: '100px', border: '1px solid rgba(255,149,0,0.2)' }}>
            <span>🔥</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#FF9500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>3 DAYS BALANCED STREAK</span>
          </div>
        </div>

        {/* Spending Categories label */}
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E93', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '12px' }}>SPENDING CATEGORIES</p>

        {/* Category Items */}
        {data?.categories?.length > 0 ? (
          data.categories.map((cat, i) => {
            const pct = Math.round((cat.amount / maxCategoryAmount) * 100);
            const emoji = ['🏠', '🍕', '🚗', '🛒', '🎬', '💡'][i % 6];
            const colors = ['#6347F5', '#34C759', '#FF9500'];
            const barColor = colors[i % colors.length];
            return (
              <div key={cat.name} style={{ background: '#fff', borderRadius: '20px', padding: '16px 20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(99,71,245,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <p style={{ fontSize: '17px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px' }}>{cat.name}</p>
                        <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>Your share: {Math.round(cat.yourShare || pct)}%</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '17px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px' }}>{currSymbol}{cat.amount.toFixed(0)}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: '#F2F2F7', borderRadius: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: '#8E8E93' }}>Total</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#F2F2F7', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}CC)`, borderRadius: '3px', transition: 'width 600ms ease-out' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8E8E93' }}>No category data yet</div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
