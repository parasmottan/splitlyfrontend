import React, { useEffect, useCallback, useState, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useStoryStore from '../stores/storyStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import api from '../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  const days = Math.floor(diff / 86400000);
  return `${days}d ago`;
}

// ─── Story Ring Strip ─────────────────────────────────────────────────────────
const CATEGORY_DATA = {
  food: { emoji: '🍔', bg: '#FFF3E0', dot: '#FF9500' },
  drinks: { emoji: '🍺', bg: '#E1F5FE', dot: '#5AC8FA' },
  transport: { emoji: '🚕', bg: '#FFFDE7', dot: '#FFCC00' },
  rent: { emoji: '🏠', bg: '#FCE4EC', dot: '#FF3B30' },
  entertainment: { emoji: '🎬', bg: '#F3E5F5', dot: '#AF52DE' },
  groceries: { emoji: '🛒', bg: '#E8F5E9', dot: '#34C759' },
  travel: { emoji: '✈️', bg: '#E3F2FD', dot: '#007AFF' },
  other: { emoji: '💸', bg: '#F3F3F3', dot: '#8E8E93' },
};

const GROUP_ICON_COLORS = [
  { from: '#FF9500', to: '#FF6B00', bg: '#FFF3E0' },
  { from: '#5856D6', to: '#4B32CC', bg: '#EEF0FF' },
  { from: '#34C759', to: '#1B8B6F', bg: '#E8F5E9' },
  { from: '#FF2D55', to: '#FF6482', bg: '#FCE4EC' },
  { from: '#00C7BE', to: '#007AFF', bg: '#E1F5FE' },
];

function GroupIconAvatar({ group, size = 56 }) {
  const charCode = group._id?.charCodeAt(0) || 0;
  const col = GROUP_ICON_COLORS[charCode % GROUP_ICON_COLORS.length];
  const emoji = CATEGORY_DATA[group.category]?.emoji || '💰';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.35,
      background: `linear-gradient(135deg, ${col.from}, ${col.to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.45, flexShrink: 0,
    }}>
      {emoji}
    </div>
  );
}

function MemberStack({ members, max = 3, size = 24 }) {
  const shown = (members || []).slice(0, max);
  const extra = (members?.length || 0) - max;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <div key={m.user?._id || i} style={{
          width: size, height: size, borderRadius: '50%',
          border: '2px solid white', marginLeft: i === 0 ? 0 : -size * 0.3,
          zIndex: max - i, position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          <Avatar name={m.user?.name || '?'} style={{ width: size, height: size, fontSize: size * 0.4, minWidth: size, minHeight: size }} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{ width: size, height: size, borderRadius: '50%', border: '2px solid white', marginLeft: -size * 0.3, background: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: '700', color: '#636366', zIndex: 0 }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────
const GroupCard = memo(function GroupCard({ group, onClick }) {
  const youOwe = group.balance?.youOwe || 0;
  const youAreOwed = group.balance?.youAreOwed || 0;
  const isSettled = group.balance?.isSettled;
  const isNew = !group.lastActivity;

  let badge = null;
  if (youAreOwed > 0) badge = { text: `+₹${youAreOwed.toLocaleString('en-IN')}`, color: '#34C759', bg: '#E8F5E9', border: '#34C759' };
  else if (youOwe > 0) badge = { text: `-₹${youOwe.toLocaleString('en-IN')}`, color: '#FF3B30', bg: '#FCE4EC', border: '#FF3B30' };
  else if (isNew) badge = { text: 'New', color: '#6347F5', bg: '#EEF0FF', border: '#6347F5' };
  else if (isSettled) badge = { text: 'Settled', color: '#8E8E93', bg: 'transparent', border: '#C7C7CC' };

  const charCode = group._id?.charCodeAt(group._id.length - 1) || 0;
  const isDark = charCode % 4 === 0;

  const subtext = group.lastActivity
    ? `Last activity: ${timeAgo(group.lastActivity.date)}`
    : 'Created today';

  return (
    <div
      onClick={onClick}
      style={{
        background: isDark ? '#1C1C2E' : '#fff',
        borderRadius: 24, padding: '16px 14px',
        cursor: 'pointer', position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'transform 120ms ease',
        WebkitTapHighlightColor: 'transparent',
        minHeight: 160,
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '4px 10px', borderRadius: 100,
          background: badge.bg, border: `1.5px solid ${badge.border}20`,
        }}>
          <span style={{ fontSize: 12, fontWeight: '800', color: badge.color }}>{badge.text}</span>
        </div>
      )}
      <GroupIconAvatar group={group} size={52} />
      <div>
        <h4 style={{ fontSize: 17, fontWeight: '800', color: isDark ? '#fff' : '#1C1C1E', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {group.name}
        </h4>
        <MemberStack members={group.members} max={3} />
        <p style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : '#8E8E93', marginTop: 6 }}>{subtext}</p>
      </div>
    </div>
  );
});

// ─── Story Strip ──────────────────────────────────────────────────────────────
function StoryStrip({ currentUser, friendsFromGroups, navigate }) {
  const { getActiveStories, hasUnviewedStories } = useStoryStore();
  const activeStories = getActiveStories();

  // Build set: me first, then friends who have stories
  const myHasStory = activeStories.some(s => s.userId === currentUser?._id);
  const friendStories = activeStories.filter(s => s.userId !== currentUser?._id);

  // All friends from groups (with or without story) — show first 6 with stories at top
  const friendsWithStory = friendStories.map(s => ({
    userId: s.userId,
    userName: s.userName,
    hasStory: true,
    hasUnviewed: hasUnviewedStories(s.userId),
  }));

  const seen = new Set(friendsWithStory.map(f => f.userId));
  const friendsWithoutStory = friendsFromGroups
    .filter(f => !seen.has(f._id))
    .slice(0, 4)
    .map(f => ({ userId: f._id, userName: f.name, hasStory: false, hasUnviewed: false }));

  const allItems = [...friendsWithStory, ...friendsWithoutStory];

  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '16px 20px 4px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      {/* My story / New button */}
      <div
        onClick={() => navigate('/story/compose')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, cursor: 'pointer' }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 62, height: 62, borderRadius: '50%',
            border: myHasStory ? '2.5px solid #6347F5' : '2px dashed #C7C7CC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: myHasStory ? 'transparent' : '#F2F2F7', overflow: 'hidden',
          }}>
            {myHasStory
              ? <Avatar name={currentUser?.name || 'Me'} style={{ width: 62, height: 62, fontSize: 22 }} />
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" /></svg>
            }
          </div>
          {myHasStory && (
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 18, height: 18, borderRadius: '50%', background: '#6347F5', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
            </div>
          )}
        </div>
        <span style={{ fontSize: 12, color: '#8E8E93', fontWeight: '600' }}>New</span>
      </div>

      {/* Friend stories / avatars */}
      {allItems.map(item => (
        <div
          key={item.userId}
          onClick={() => item.hasStory ? navigate(`/story/${item.userId}`) : null}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, cursor: item.hasStory ? 'pointer' : 'default' }}
        >
          <div style={{
            width: 62, height: 62, borderRadius: '50%', overflow: 'hidden',
            border: item.hasStory
              ? item.hasUnviewed ? '2.5px solid #6347F5' : '2.5px solid #C7C7CC'
              : '2.5px solid transparent',
            padding: item.hasStory ? 2 : 0,
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              <Avatar name={item.userName} style={{ width: '100%', height: '100%', fontSize: 20 }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#1C1C1E', fontWeight: '600', maxWidth: 62, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.userName?.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Groups Page ─────────────────────────────────────────────────────────
export default function Groups() {
  const navigate = useNavigate();
  const { groups, loading, fetchGroups } = useGroupStore();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('activity'); // 'activity' | 'name'
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const { fetchStories } = useStoryStore();

  useEffect(() => { fetchGroups(); fetchStories(); }, []);

  // Fetch recent activity for bottom section
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/activity');
        const all = [];
        if (data && typeof data === 'object') {
          Object.values(data).forEach(arr => { if (Array.isArray(arr)) all.push(...arr); });
        }
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentActivity(all.slice(0, 4));
      } catch { }
      setActivityLoading(false);
    })();
  }, []);

  const activeGroups = useMemo(() => groups.filter(g => !g.archived), [groups]);

  const sortedGroups = useMemo(() => {
    return [...activeGroups].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const da = a.lastActivity?.date ? new Date(a.lastActivity.date) : new Date(a.createdAt);
      const db = b.lastActivity?.date ? new Date(b.lastActivity.date) : new Date(b.createdAt);
      return db - da;
    });
  }, [activeGroups, sortBy]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return sortedGroups;
    const q = searchQuery.toLowerCase();
    return sortedGroups.filter(g => g.name.toLowerCase().includes(q));
  }, [sortedGroups, searchQuery]);

  // All unique friends across all groups (for story strip)
  const friendsFromGroups = useMemo(() => {
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
    <div style={{ background: '#F5F5F7', display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{ background: '#F5F5F7', padding: '16px 20px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8E8E93' }}>
                <circle cx="11" cy="11" r="8" stroke="#8E8E93" strokeWidth="2" /><path d="M21 21L16.65 16.65" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search groups..." style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: 12, border: 'none', background: '#E5E5EA', outline: 'none', fontSize: 17, color: '#1C1C1E' }} />
            </div>
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6347F5', fontSize: 17, fontWeight: '600' }}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 4 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                <Avatar name={user?.name || 'U'} style={{ width: 40, height: 40, fontSize: 15 }} />
              </div>
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#34C759', border: '2px solid #F5F5F7' }} />
            </div>
            <h1 style={{ flex: 1, fontSize: 28, fontWeight: '800', color: '#1C1C1E', margin: 0, letterSpacing: '-0.5px' }}>Groups</h1>
            <button onClick={() => setSearchOpen(true)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#1C1C1E" strokeWidth="2" /><path d="M21 21L16.65 16.65" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Story Strip ── */}
      <StoryStrip currentUser={user} friendsFromGroups={friendsFromGroups} navigate={navigate} />

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px', paddingBottom: 96 }}>

        {/* Section header */}
        {!searchOpen && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              YOUR GROUPS
            </p>
            <button onClick={() => setSortBy(s => s === 'activity' ? 'name' : 'activity')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <span style={{ fontSize: 13, fontWeight: '700', color: '#6347F5' }}>Sort by: {sortBy === 'activity' ? 'Activity' : 'Name'}</span>
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && activeGroups.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: 24, padding: 16, minHeight: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 18, background: '#F2F2F7' }} />
                <div style={{ width: '80%', height: 16, borderRadius: 8, background: '#F2F2F7' }} />
                <div style={{ width: '60%', height: 12, borderRadius: 6, background: '#F2F2F7' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && activeGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
            <h3 style={{ fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 }}>No groups yet</h3>
            <p style={{ fontSize: 16, color: '#8E8E93', marginBottom: 32 }}>Create a group to start splitting with friends.</p>
            <button onClick={() => navigate('/get-started')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #6347F5, #4B32CC)', color: '#fff', fontSize: 17, fontWeight: '600', borderRadius: 100, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,71,245,0.3)' }}>
              Create Group
            </button>
          </div>
        )}

        {/* 2-column group grid */}
        {filteredGroups.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {filteredGroups.map(group => (
              <GroupCard key={group._id} group={group} onClick={() => handleGroupClick(group._id)} />
            ))}

            {/* Create Group tile */}
            {!searchQuery && (
              <div
                onClick={() => navigate('/get-started')}
                style={{
                  background: 'rgba(255,255,255,0.5)', borderRadius: 24, padding: 16,
                  cursor: 'pointer', minHeight: 160, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                  border: '2px dashed #C7C7CC',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: '700', color: '#8E8E93', textAlign: 'center' }}>Create Group</span>
              </div>
            )}
          </div>
        )}

        {/* Search no results */}
        {searchQuery && filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 17, color: '#8E8E93' }}>No groups matching "{searchQuery}"</p>
          </div>
        )}

        {/* ── Recent Activity ── */}
        {!searchQuery && (
          <div>
            <p style={{ fontSize: 12, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>RECENT ACTIVITY</p>

            {activityLoading && [1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F2F2F7', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: 14, borderRadius: 7, background: '#F2F2F7', marginBottom: 8 }} />
                  <div style={{ width: '80%', height: 12, borderRadius: 6, background: '#F2F2F7' }} />
                </div>
              </div>
            ))}

            {!activityLoading && recentActivity.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#8E8E93', fontSize: 14 }}>No recent activity</div>
            )}

            {recentActivity.map((item, idx) => {
              const isPositive = item.amount > 0;
              const cat = CATEGORY_DATA[item.category] || CATEGORY_DATA.other;
              const ago = timeAgo(item.date);
              return (
                <div key={item._id || idx} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {cat.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#6347F5' }}>{item.paidByName || 'You'}</span>
                      {' paid '}
                      <span style={{ color: '#007AFF', fontStyle: 'italic' }}>"{item.description}"</span>
                    </p>
                    <p style={{ fontSize: 12, color: '#8E8E93', margin: 0 }}>
                      {ago} · {item.groupName || 'Group'}
                      {item.settledAmount && <span style={{ color: '#34C759', fontWeight: '700' }}> · +₹{Math.abs(item.settledAmount).toFixed(0)}</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
