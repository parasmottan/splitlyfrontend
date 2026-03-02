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

/**
 * Auth Pages Skeleton (Login/Register/GetStarted)
 */
export function AuthSkeleton() {
  return (
    <div className="page page-enter page-white" style={{ display: 'flex', flexDirection: 'column', padding: '60px 24px' }}>
      <div className="skeleton-pulse" style={{ width: 40, height: 40, borderRadius: 8, marginBottom: 32 }}></div>
      <div className="skeleton-pulse" style={{ width: 200, height: 32, borderRadius: 8, marginBottom: 12 }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: 16, borderRadius: 8, marginBottom: 48 }}></div>

      <div className="skeleton-pulse" style={{ width: '100%', height: 56, borderRadius: 16, marginBottom: 16 }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: 56, borderRadius: 16, marginBottom: 32 }}></div>

      <div className="skeleton-pulse" style={{ width: '100%', height: 56, borderRadius: 100, marginTop: 'auto' }}></div>
    </div>
  );
}

/**
 * Group List Skeleton (/groups)
 */
export function GroupListSkeleton() {
  return (
    <div className="page page-enter" style={{ padding: '0 20px' }}>
      <div style={{ padding: '60px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-pulse" style={{ width: 140, height: 28, borderRadius: 8 }}></div>
        <div className="skeleton-pulse" style={{ width: 36, height: 36, borderRadius: '50%' }}></div>
      </div>

      <div className="skeleton-pulse" style={{ width: '100%', height: 44, borderRadius: 12, marginBottom: 24 }}></div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skeleton-pulse" style={{ width: 'calc(50% - 6px)', height: 160, borderRadius: 20 }}></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Activity List Skeleton (/activity)
 */
export function ActivitySkeleton() {
  return (
    <div className="page page-enter page-white" style={{ padding: '0 20px' }}>
      <div style={{ padding: '60px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-pulse" style={{ width: 100, height: 28, borderRadius: 8 }}></div>
      </div>

      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '1px solid #F2F2F7' }}>
          <div className="skeleton-pulse" style={{ width: 46, height: 46, borderRadius: 14 }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton-pulse" style={{ width: 120, height: 16, borderRadius: 6, marginBottom: 8 }}></div>
            <div className="skeleton-pulse" style={{ width: 80, height: 12, borderRadius: 4 }}></div>
          </div>
          <div className="skeleton-pulse" style={{ width: 60, height: 16, borderRadius: 6 }}></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Action Screen Skeleton (Add Expense / Settle)
 */
export function ActionSkeleton() {
  return (
    <div className="page page-enter page-white" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-pulse" style={{ width: 36, height: 36, borderRadius: '50%' }}></div>
        <div className="skeleton-pulse" style={{ width: 100, height: 16, borderRadius: 8 }}></div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="skeleton-pulse" style={{ width: 80, height: 24, borderRadius: 8, marginBottom: 12 }}></div>
        <div className="skeleton-pulse" style={{ width: 200, height: 64, borderRadius: 16, marginBottom: 40 }}></div>

        {/* Number Pad skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 300, marginBottom: 40 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-pulse" style={{ width: '100%', height: 60, borderRadius: '50%' }}></div>
          ))}
        </div>

        <div className="skeleton-pulse" style={{ width: '100%', height: 56, borderRadius: 100 }}></div>
      </div>
    </div>
  );
}
