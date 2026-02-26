import React, { useEffect, useCallback, useState, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose, IoPeopleOutline } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

/* ────────────────────────────────────────────
   Small stacked avatar row (overlapping circles)
   ──────────────────────────────────────────── */
const MemberAvatarStack = memo(function MemberAvatarStack({ members, max = 3 }) {
  const shown = members?.slice(0, max) || [];
  const extra = (members?.length || 0) - max;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <div
          key={m.user?._id || i}
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            border: '2px solid white',
            marginLeft: i === 0 ? 0 : '-8px',
            zIndex: max - i,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Avatar name={m.user?.name || '?'} style={{
            width: '28px', height: '28px', fontSize: '11px',
            minWidth: '28px', minHeight: '28px',
          }} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          border: '2px solid white', marginLeft: '-8px',
          background: '#E5E5EA', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: '600',
          color: '#636366', position: 'relative', zIndex: 0,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
});

/* ────────────────────────────────────────────
   Single group card – matches PNG exactly
   ──────────────────────────────────────────── */
const GroupCard = memo(function GroupCard({ group, onClick, currSymbol }) {
  const youOwe = group.balance?.youOwe || 0;
  const youAreOwed = group.balance?.youAreOwed || 0;
  const isSettled = group.balance?.isSettled;
  const isClean = !youOwe && !youAreOwed && !isSettled;
  const lastExpense = group.lastExpense;

  /* Subtext: "Last added by Name • time" */
  let subtext = '';
  if (lastExpense) {
    const who = lastExpense.paidBy?.name?.split(' ')[0] || 'someone';
    const when = lastExpense.timeAgo || '';
    subtext = `Last added by ${who}${when ? ` • ${when}` : ''}`;
  } else if (group.createdAt) {
    subtext = `Created ${new Date(group.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
  }

  /* Balance display */
  let balanceLabel = '', balanceAmount = '', balanceColor = '#8E8E93';
  if (youOwe > 0) {
    balanceLabel = 'You owe';
    balanceAmount = `${currSymbol}${youOwe.toLocaleString('en-IN')}`;
    balanceColor = '#FF3B30';
  } else if (youAreOwed > 0) {
    balanceLabel = 'You are owed';
    balanceAmount = `${currSymbol}${youAreOwed.toLocaleString('en-IN')}`;
    balanceColor = '#34C759';
  } else {
    balanceLabel = 'No expenses';
    balanceAmount = `${currSymbol}0`;
    balanceColor = '#8E8E93';
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        boxShadow: '0 0.5px 1px rgba(0,0,0,0.03), 0 1px 4px rgba(0,0,0,0.04)',
        transition: 'transform 120ms ease-out',
      }}
    >
      {/* ── Top row: Avatar + Name + Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Group avatar */}
        <Avatar name={group.name} style={{ width: '48px', height: '48px', fontSize: '18px', flexShrink: 0 }} />

        {/* Name + Subtext */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{
              fontSize: '17px', fontWeight: '600', color: '#1C1C1E',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', flex: 1,
            }}>
              {group.name}
            </h4>

            {/* Status badge */}
            {isSettled && (
              <span style={{
                fontSize: '11px', fontWeight: '700', color: '#34C759',
                background: '#E5F9EC', padding: '3px 8px', borderRadius: '4px',
                letterSpacing: '0.5px', flexShrink: 0, lineHeight: '16px',
              }}>
                SETTLED
              </span>
            )}
            {isClean && !isSettled && (
              <span style={{
                fontSize: '11px', fontWeight: '600', color: '#8E8E93',
                background: '#F2F2F7', padding: '3px 8px', borderRadius: '4px',
                letterSpacing: '0.5px', flexShrink: 0, lineHeight: '16px',
              }}>
                CLEAN
              </span>
            )}
          </div>

          {/* Subtext */}
          <p style={{
            fontSize: '13px', color: '#8E8E93', margin: '2px 0 0',
            lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {subtext || `${group.members?.length || 0} members`}
          </p>
        </div>
      </div>

      {/* ── Bottom row: Member avatars + Balance ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', marginTop: '14px',
      }}>
        {/* Member avatar stack */}
        <MemberAvatarStack members={group.members} max={3} />

        {/* Balance */}
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '13px', color: '#8E8E93', margin: '0 0 2px',
            lineHeight: '16px', fontWeight: '400',
          }}>
            {balanceLabel}
          </p>
          <p style={{
            fontSize: '17px', fontWeight: '700', color: balanceColor,
            margin: 0, lineHeight: '22px', letterSpacing: '-0.2px',
          }}>
            {balanceAmount}
          </p>
        </div>
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────
   Main Groups page
   ──────────────────────────────────────────── */
export default function Groups() {
  const navigate = useNavigate();
  const { groups, loading, fetchGroups } = useGroupStore();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchGroups(); }, []);

  const currSymbol = '\u20B9';

  const activeGroups = useMemo(() =>
    groups.filter(g => !g.archived), [groups]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return activeGroups;
    const q = searchQuery.toLowerCase();
    return activeGroups.filter(g => g.name.toLowerCase().includes(q));
  }, [activeGroups, searchQuery]);

  const handleGroupClick = useCallback((id) => {
    navigate(`/groups/${id}`);
  }, [navigate]);

  return (
    <div style={{
      background: '#F2F2F7',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      maxWidth: '430px',
      margin: '0 auto',
      position: 'relative',
    }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <div style={{ padding: '12px 20px 0' }}>

        {/* Search bar – expanded */}
        {searchOpen ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '8px',
          }}>
            <div style={{
              flex: 1, position: 'relative',
              display: 'flex', alignItems: 'center',
            }}>
              <IoSearch style={{
                position: 'absolute', left: '12px',
                color: '#8E8E93', fontSize: '18px', pointerEvents: 'none',
              }} />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                style={{
                  width: '100%', padding: '12px 12px 12px 40px',
                  borderRadius: '12px', border: 'none',
                  background: '#E5E5EA', outline: 'none',
                  fontSize: '17px', color: '#1C1C1E',
                }}
              />
            </div>
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#007AFF', fontSize: '17px', fontWeight: '400',
                padding: '4px 0', flexShrink: 0,
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          /* Title row – "Your Groups" + search icon */
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
              marginBottom: '20px',
              paddingTop: '15px', 
              paddingRight: '3px',
              paddingLeft: '3px',
              // padding: '3px'
          }}>
            <h1 style={{
              fontSize: '34px', fontWeight: '700', color: '#1C1C1E',
              margin: 0, letterSpacing: '-0.5px', lineHeight: '1.15',
            }}>
              Your Groups
            </h1>

            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px', color: '#007AFF', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IoSearch style={{ fontSize: '24px' }} />
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════ SCROLLABLE CONTENT ═══════════════ */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 20px',
        paddingBottom: '100px',
      }}>

        {/* ── Loading skeletons ── */}
        {loading && activeGroups.length === 0 && (
          <div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: '#FFF', borderRadius: '16px',
                padding: '16px', marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Skeleton width="48px" height="48px" borderRadius="50%" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="55%" height="18px" style={{ marginBottom: '6px' }} />
                    <Skeleton width="70%" height="13px" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                  <Skeleton width="80px" height="28px" borderRadius="14px" />
                  <div>
                    <Skeleton width="70px" height="13px" style={{ marginBottom: '4px', marginLeft: 'auto' }} />
                    <Skeleton width="50px" height="18px" style={{ marginLeft: 'auto' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && activeGroups.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#E5E5EA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <IoPeopleOutline style={{ fontSize: '36px', color: '#8E8E93' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', marginBottom: '8px' }}>
              No groups yet
            </h3>
            <p style={{ fontSize: '15px', color: '#8E8E93', marginBottom: '32px', lineHeight: '1.5' }}>
              Create a group to start splitting expenses with your friends.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              style={{
                background: '#007AFF', color: 'white',
                fontSize: '17px', fontWeight: '600',
                padding: '14px 40px', borderRadius: '14px',
                border: 'none', cursor: 'pointer',
                transition: 'transform 120ms ease-out',
              }}
            >
              Create Group
            </button>
          </div>
        )}

        {/* ── Group cards ── */}
        {filteredGroups.length > 0 && (
          <div>
            {filteredGroups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                currSymbol={currSymbol}
                onClick={() => handleGroupClick(group._id)}
              />
            ))}
          </div>
        )}

        {/* ── Search no results ── */}
        {searchQuery && filteredGroups.length === 0 && activeGroups.length > 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '17px', color: '#8E8E93', fontWeight: '500' }}>
              No groups matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════ FAB (bottom-right) ═══════════════ */}
      <button
        onClick={() => navigate('/get-started')}
        style={{
          position: 'fixed',
          bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
          right: 'max(20px, calc((100vw - 430px) / 2 + 20px))',
          width: '56px', height: '56px',
          borderRadius: '50%', background: '#007AFF',
          color: 'white', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: '300',
          boxShadow: '0 4px 14px rgba(0,122,255,0.35)',
          transition: 'transform 120ms ease-out',
          zIndex: 99,
        }}
      >
        <span style={{ lineHeight: 1 }}>+</span>
      </button>

      {/* ═══════════════ BOTTOM NAV ═══════════════ */}
      <BottomNav showFab={false} />
    </div>
  );
}
