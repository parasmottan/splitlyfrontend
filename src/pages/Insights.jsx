import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

const CATEGORY_COLORS = [
  '#007AFF', '#FF9500', '#34C759', '#FF3B30', '#AF52DE',
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

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleGroupFilter = (groupId) => {
    setSelectedGroup(groupId);
    fetchInsights(groupId);
  };

  if (loading && !data) {
    return (
      <div className="page" style={{ background: 'var(--gray-50)' }}>
        <div style={{ padding: '16px 0 8px' }}>
          <Skeleton width="120px" height="34px" style={{ marginBottom: '8px' }} />
        </div>

        {/* Group Filter Skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width="60px" height="32px" borderRadius="var(--radius-full)" />
          ))}
        </div>

        {/* Fairness Score Skeleton */}
        <div className="card" style={{ padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
          <Skeleton width="80px" height="13px" style={{ margin: '0 auto 16px' }} />
          <Skeleton width="120px" height="120px" borderRadius="50%" style={{ margin: '0 auto 16px' }} />
          <Skeleton width="140px" height="14px" style={{ margin: '0 auto' }} />
        </div>

        {/* Spending Summary Skeleton */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div className="card" style={{ flex: 1, padding: '16px' }}>
            <Skeleton width="60px" height="12px" style={{ margin: '0 auto 8px' }} />
            <Skeleton width="80px" height="22px" style={{ margin: '0 auto 6px' }} />
            <Skeleton width="100px" height="12px" style={{ margin: '0 auto' }} />
          </div>
          <div className="card" style={{ flex: 1, padding: '16px' }}>
            <Skeleton width="60px" height="12px" style={{ margin: '0 auto 8px' }} />
            <Skeleton width="80px" height="22px" style={{ margin: '0 auto 6px' }} />
            <Skeleton width="100px" height="12px" style={{ margin: '0 auto' }} />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <Skeleton width="140px" height="16px" style={{ marginBottom: '20px' }} />
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Skeleton width="60px" height="14px" />
                <Skeleton width="50px" height="14px" />
              </div>
              <Skeleton width="100%" height="8px" borderRadius="4px" />
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    );
  }

  const maxCategoryAmount = data?.categories?.length > 0 ? Math.max(...data.categories.map(c => c.amount)) : 0;

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div style={{ padding: '16px 0 8px' }}>
        <h1 className="title-large">Insights</h1>
      </div>

      {/* Group Filter Tabs */}
      {data?.groupTabs?.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
          <button
            onClick={() => handleGroupFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: selectedGroup === 'all' ? 'var(--blue)' : 'var(--white)',
              color: selectedGroup === 'all' ? 'var(--white)' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            All
          </button>
          {data.groupTabs.map(g => (
            <button
              key={g._id}
              onClick={() => handleGroupFilter(g._id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: selectedGroup === g._id ? 'var(--blue)' : 'var(--white)',
                color: selectedGroup === g._id ? 'var(--white)' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Fairness Score */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '16px' }}>Fairness Score</p>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
          <svg viewBox="0 0 120 120" style={{ width: '120px', height: '120px', transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray-200)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={data?.fairnessScore >= 80 ? 'var(--green)' : data?.fairnessScore >= 50 ? 'var(--orange)' : 'var(--red)'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(data?.fairnessScore || 0) * 3.14} 314`}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <span style={{ fontSize: '32px', fontWeight: '800' }}>{data?.fairnessScore || 0}</span>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {data?.fairnessScore >= 80 ? 'Great balance!' : data?.fairnessScore >= 50 ? 'Could be fairer' : 'Unbalanced spending'}
        </p>
      </div>

      {/* Spending Summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div className="card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>Total Spent</p>
          <p style={{ fontSize: '22px', fontWeight: '700' }}>₹{(data?.totalSpent || 0).toFixed(0)}</p>
          {data?.monthChange !== 0 && (
            <span style={{ fontSize: '12px', color: data?.monthChange > 0 ? 'var(--red)' : 'var(--green)', fontWeight: '600' }}>
              {data?.monthChange > 0 ? '↑' : '↓'}{Math.abs(data?.monthChange)}% vs last month
            </span>
          )}
        </div>
        <div className="card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>Your Share</p>
          <p style={{ fontSize: '22px', fontWeight: '700' }}>₹{(data?.yourShare || 0).toFixed(0)}</p>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{data?.sharePercentage || 0}% of total</span>
        </div>
      </div>

      {/* Spending by Category */}
      {data?.categories?.length > 0 && (
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Spending by Category</h3>
          {data.categories.map((cat, i) => (
            <div key={cat.name} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat.name}</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>₹{cat.amount.toFixed(0)}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                  background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
