import React, { useEffect, useCallback, useState, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

const MemberAvatarStack = memo(function MemberAvatarStack({ members, max = 3 }) {
  const shown = members?.slice(0, max) || [];
  const extra = (members?.length || 0) - max;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <div key={m.user?._id || i} style={{
          width: '24px', height: '24px', borderRadius: '50%',
          border: '2px solid white', marginLeft: i === 0 ? 0 : '-7px',
          zIndex: max - i, position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          <Avatar name={m.user?.name || '?'} style={{ width: '24px', height: '24px', fontSize: '10px', minWidth: '24px', minHeight: '24px' }} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%', border: '2px solid white',
          marginLeft: '-7px', background: '#E5E5EA', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#636366', zIndex: 0,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
});

const GroupCard = memo(function GroupCard({ group, onClick }) {
  const youOwe = group.balance?.youOwe || 0;
  const youAreOwed = group.balance?.youAreOwed || 0;
  const isSettled = group.balance?.isSettled;

  let badgeText = '', badgeColor = '#8E8E93';
  if (youOwe > 0) { badgeText = `-₹${youOwe.toLocaleString()}`; badgeColor = '#FF3B30'; }
  else if (youAreOwed > 0) { badgeText = `+₹${youAreOwed.toLocaleString()}`; badgeColor = '#34C759'; }
  else if (isSettled) { badgeText = 'Settled'; }

  const currSymbol = group.currencySymbol || '₹';
  if (youOwe > 0) badgeText = `-${currSymbol}${youOwe.toLocaleString()}`;
  else if (youAreOwed > 0) badgeText = `+${currSymbol}${youAreOwed.toLocaleString()}`;

  const subtext = group.lastActivity
    ? `Last: ${new Date(group.lastActivity.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
    : `Created ${new Date(group.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

  // Alternate dark card every other group
  const charCode = group._id?.charCodeAt(group._id.length - 1) || 0;
  const isDark = charCode % 3 === 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: isDark ? '#1C1C2E' : '#fff',
        borderRadius: '24px', padding: '16px', cursor: 'pointer',
        position: 'relative', overflow: 'hidden', minHeight: '160px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 120ms ease-out',
        WebkitTapHighlightColor: 'transparent',
      }}
      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {badgeText && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          padding: '5px 10px', borderRadius: '100px',
          background: badgeText === 'Settled' ? '#E5E5EA' : `${badgeColor}20`,
          border: `1px solid ${badgeColor}30`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: badgeColor }}>{badgeText}</span>
        </div>
      )}

      <div style={{ width: '52px', height: '52px', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' }}>
        <Avatar name={group.name} style={{ width: '52px', height: '52px', fontSize: '22px', borderRadius: '16px' }} />
      </div>

      <div>
        <h4 style={{
          fontSize: '17px', fontWeight: '700',
          color: isDark ? '#fff' : '#1C1C1E',
          marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {group.name}
        </h4>
        <MemberAvatarStack members={group.members} max={3} />
        <p style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : '#8E8E93', marginTop: '6px' }}>{subtext}</p>
      </div>
    </div>
  );
});

export default function Groups() {
  const navigate = useNavigate();
  const { groups, loading, fetchGroups } = useGroupStore();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchGroups(); }, []);

  const activeGroups = useMemo(() => groups.filter(g => !g.archived), [groups]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return activeGroups;
    const q = searchQuery.toLowerCase();
    return activeGroups.filter(g => g.name.toLowerCase().includes(q));
  }, [activeGroups, searchQuery]);

  // Build real unique members across all groups for the friend strip
  const friendStrip = useMemo(() => {
    const seen = new Set();
    const friends = [];
    for (const group of activeGroups) {
      for (const m of (group.members || [])) {
        const uid = m.user?._id;
        if (uid && uid !== user?._id && !seen.has(uid)) {
          seen.add(uid);
          friends.push(m.user);
          if (friends.length >= 8) return friends;
        }
      }
    }
    return friends;
  }, [activeGroups, user]);

  const handleGroupClick = useCallback((id) => navigate(`/groups/${id}`), [navigate]);

  return (
    <div style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{ padding: '16px 20px 0' }}>
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <IoSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E8E93', fontSize: '18px' }} />
              <input
                autoFocus type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: 'none', background: '#E5E5EA', outline: 'none', fontSize: '17px', color: '#1C1C1E' }}
              />
            </div>
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007AFF', fontSize: '17px', fontWeight: '400' }}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Avatar name={user?.name || 'U'} style={{ width: '40px', height: '40px', fontSize: '16px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#8E8E93', margin: '0 0 1px' }}>Welcome back 👋</p>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', margin: 0, letterSpacing: '-0.3px' }}>{user?.name?.split(' ')[0] || 'Groups'}</h1>
            </div>
            <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1E', fontSize: '22px' }}>
              <IoSearch />
            </button>
          </div>
        )}

        {/* Friend strip — real members from groups */}
        {friendStrip.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {/* New group button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/get-started')}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fff', border: '2px dashed #C7C7CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#8E8E93' }}>+</div>
              <span style={{ fontSize: '12px', color: '#8E8E93', fontWeight: '500' }}>New</span>
            </div>
            {friendStrip.map((friend, i) => (
              <div key={friend._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: i === 0 ? '2.5px solid #6347F5' : '2.5px solid transparent', overflow: 'hidden' }}>
                  <Avatar name={friend.name} style={{ width: '52px', height: '52px', fontSize: '18px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#1C1C1E', fontWeight: '500', maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {friend.name?.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px', paddingBottom: '100px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.8px' }}>YOUR GROUPS ({activeGroups.length})</p>
          <span onClick={() => navigate('/get-started')} style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue)', cursor: 'pointer' }}>+ New Group</span>
        </div>

        {/* Loading skeletons */}
        {loading && activeGroups.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: '24px', padding: '16px', minHeight: '160px' }}>
                <Skeleton width="52px" height="52px" borderRadius="16px" style={{ marginBottom: '12px' }} />
                <Skeleton width="80%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="60%" height="12px" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && activeGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1C1C1E', marginBottom: '8px' }}>No groups yet</h3>
            <p style={{ fontSize: '16px', color: '#8E8E93', marginBottom: '32px' }}>Create a group to start splitting with friends.</p>
            <button onClick={() => navigate('/get-started')} style={{ padding: '14px 32px', background: 'var(--blue)', color: '#fff', fontSize: '17px', fontWeight: '600', borderRadius: '100px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,71,245,0.3)' }}>
              Create Group
            </button>
          </div>
        )}

        {/* Grid of group cards */}
        {filteredGroups.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {filteredGroups.map(group => (
              <GroupCard key={group._id} group={group} onClick={() => handleGroupClick(group._id)} />
            ))}
            {/* Create new tile */}
            <div
              onClick={() => navigate('/get-started')}
              style={{
                background: 'rgba(255,255,255,0.5)', borderRadius: '24px', padding: '16px',
                cursor: 'pointer', minHeight: '160px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                border: '2px dashed #C7C7CC', gap: '8px',
              }}
            >
              <span style={{ fontSize: '32px', color: '#8E8E93' }}>+</span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#8E8E93', textAlign: 'center' }}>Create Group</span>
            </div>
          </div>
        )}

        {/* Search no results */}
        {searchQuery && filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '17px', color: '#8E8E93' }}>No groups matching "{searchQuery}"</p>
          </div>
        )}

        {/* Recent activity section */}
        {!searchQuery && activeGroups.some(g => g.lastActivity) && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>RECENT ACTIVITY</p>
            {activeGroups
              .filter(g => g.lastActivity)
              .slice(0, 3)
              .map((group) => (
                <div
                  key={group._id}
                  onClick={() => handleGroupClick(group._id)}
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '14px 16px',
                    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99,71,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>💸</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1C1C1E', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {group.lastActivity.description}
                    </p>
                    <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>
                      {new Date(group.lastActivity.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {group.name}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
