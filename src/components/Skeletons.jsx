import React from 'react';
import { IoChevronBack } from 'react-icons/io5';

/**
 * Universal minimal fade-in skeleton for root routes
 */
export function AppSkeleton() {
  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="skeleton-pulse" style={{ width: 64, height: 64, borderRadius: '22px', marginBottom: 24 }}></div>
      <div className="skeleton-pulse" style={{ width: 120, height: 16, borderRadius: 8 }}></div>
    </div>
  );
}

/**
 * Dashboard (Home) Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="page page-enter">
      {/* Header Skeleton */}
      <div style={{ padding: '60px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="skeleton-pulse" style={{ width: 140, height: 24, borderRadius: 8, marginBottom: 8 }}></div>
          <div className="skeleton-pulse" style={{ width: 200, height: 14, borderRadius: 6 }}></div>
        </div>
        <div className="skeleton-pulse" style={{ width: 44, height: 44, borderRadius: '50%' }}></div>
      </div>

      {/* Balance Card Skeleton */}
      <div className="skeleton-pulse" style={{ width: '100%', height: 160, borderRadius: 24, marginBottom: 24 }}></div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div className="skeleton-pulse" style={{ flex: 1, height: 80, borderRadius: 20 }}></div>
        <div className="skeleton-pulse" style={{ flex: 1, height: 80, borderRadius: 20 }}></div>
      </div>

      {/* Groups Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton-pulse" style={{ width: 100, height: 20, borderRadius: 8 }}></div>
        <div className="skeleton-pulse" style={{ width: 60, height: 16, borderRadius: 8 }}></div>
      </div>

      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton-pulse" style={{ width: '100%', height: 88, borderRadius: 20, marginBottom: 12 }}></div>
      ))}
    </div>
  );
}

/**
 * Group Dashboard Detail Skeleton
 */
export function GroupDetailSkeleton() {
  return (
    <div className="page page-enter" style={{ background: '#F2F2F7', minHeight: '100dvh', padding: 0 }}>
      {/* Header */}
      <div className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '52px 20px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="skeleton-pulse" style={{ width: 36, height: 36, borderRadius: '50%' }}></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton-pulse" style={{ width: 120, height: 20, borderRadius: 8, marginBottom: 6 }}></div>
          <div className="skeleton-pulse" style={{ width: 80, height: 14, borderRadius: 6 }}></div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div style={{ padding: '20px' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: 180, borderRadius: 24, marginBottom: 24 }}></div>

        {/* Balances list */}
        <div className="skeleton-pulse" style={{ width: 150, height: 20, borderRadius: 8, marginBottom: 16 }}></div>
        {[1, 2].map(i => (
          <div key={i} className="skeleton-pulse" style={{ width: '100%', height: 72, borderRadius: 16, marginBottom: 10 }}></div>
        ))}

        {/* Expenses map */}
        <div className="skeleton-pulse" style={{ width: 100, height: 20, borderRadius: 8, marginTop: 24, marginBottom: 16 }}></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-pulse" style={{ width: '100%', height: 72, borderRadius: 16, marginBottom: 10 }}></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Settings List Skeleton
 */
export function SettingsSkeleton() {
  return (
    <div className="page page-enter" style={{ padding: '0 20px 80px' }}>
      <div style={{ paddingTop: '52px', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="skeleton-pulse" style={{ width: 36, height: 36, borderRadius: '50%' }}></div>
        <div className="skeleton-pulse" style={{ width: 140, height: 24, borderRadius: 8 }}></div>
      </div>

      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton-pulse" style={{ width: '100%', height: 72, borderRadius: 20, marginBottom: 12 }}></div>
      ))}
    </div>
  );
}

/**
 * Text Page Skeleton (Privacy/Terms)
 */
export function TextSkeleton() {
  return (
    <div className="page page-white page-enter" style={{ padding: '0 24px 60px' }}>
      <div style={{ paddingTop: '52px', paddingBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="skeleton-pulse" style={{ width: 36, height: 36, borderRadius: '50%' }}></div>
      </div>
      <div className="skeleton-pulse" style={{ width: 200, height: 32, borderRadius: 8, marginBottom: 24 }}></div>

      {[1, 2, 3].map(section => (
        <div key={section} style={{ marginBottom: 32 }}>
          <div className="skeleton-pulse" style={{ width: 140, height: 20, borderRadius: 6, marginBottom: 16 }}></div>
          {[1, 2, 3, 4].map(line => (
            <div key={line} className="skeleton-pulse" style={{ width: line === 4 ? '60%' : '100%', height: 14, borderRadius: 4, marginBottom: 10 }}></div>
          ))}
        </div>
      ))}
    </div>
  );
}
