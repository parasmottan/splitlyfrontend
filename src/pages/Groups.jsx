import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAdd, IoSearch, IoPeopleOutline, IoChevronForward } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';

export default function Groups() {
  const navigate = useNavigate();
  const { groups, loading, fetchGroups } = useGroupStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  const activeGroups = groups.filter(g => !g.archived);
  const archivedGroups = groups.filter(g => g.archived);

  const handleGroupClick = useCallback((id) => {
    navigate(`/groups/${id}`);
  }, [navigate]);

  return (
    <div className="page page-white" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Header title="Your Groups" />

      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        {/* Search & Add */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '8px 0 24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <IoSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '18px' }} />
            <input
              type="text"
              placeholder="Search groups..."
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', outline: 'none', fontSize: '17px', transition: 'border-color 200ms ease, box-shadow 200ms ease' }}
            />
          </div>
          <button
            onClick={() => navigate('/get-started')}
            style={{ width: '44px', height: '44px', background: 'var(--blue)', color: 'white', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', flexShrink: 0, transition: 'transform 120ms ease-out' }}
          >
            <IoAdd />
          </button>
        </div>

        {/* Overall Balance */}
        {activeGroups.length > 0 && (
          <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>You owe</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)' }}>
                  {'\u20B9'}{activeGroups.reduce((s, g) => s + (g.balance?.youOwe || 0), 0).toFixed(2)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>You're owed</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--green)' }}>
                  {'\u20B9'}{activeGroups.reduce((s, g) => s + (g.balance?.youAreOwed || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && activeGroups.length === 0 && (
          <div style={{ marginTop: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ marginBottom: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Skeleton width="44px" height="44px" borderRadius="50%" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="18px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="40%" height="13px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && activeGroups.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IoPeopleOutline style={{ fontSize: '32px' }} />
            </div>
            <h3 className="empty-state-title">No groups yet</h3>
            <p className="empty-state-text">Create a group to start splitting expenses.</p>
            <button className="btn-primary" style={{ maxWidth: '240px' }} onClick={() => navigate('/get-started')}>
              Create Group
            </button>
          </div>
        )}

        {/* Active Groups */}
        {activeGroups.length > 0 && (
          <div>
            <h3 className="caption" style={{ marginBottom: '12px' }}>ACTIVE</h3>
            {activeGroups.map(group => (
              <div
                key={group._id}
                className="card animate-fade-in"
                style={{ marginBottom: '12px', padding: '16px', cursor: 'pointer' }}
                onClick={() => handleGroupClick(group._id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={group.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '17px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</h4>
                      {group.balance?.isSettled && (
                        <span className="badge badge-green" style={{ fontSize: '11px', marginLeft: '8px', flexShrink: 0 }}>SETTLED</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {group.members?.length || 0} member{(group.members?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: group.balance?.youOwe > 0 ? 'var(--red)' : group.balance?.youAreOwed > 0 ? 'var(--green)' : 'var(--text-secondary)' }}>
                        {group.balance?.youOwe > 0 && `You owe \u20B9${group.balance.youOwe.toFixed(0)}`}
                        {group.balance?.youAreOwed > 0 && `You are owed \u20B9${group.balance.youAreOwed.toFixed(0)}`}
                        {!group.balance?.youOwe && !group.balance?.youAreOwed && !group.balance?.isSettled && 'No expenses'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Archived */}
        {archivedGroups.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 className="caption" style={{ marginBottom: '12px' }}>ARCHIVED</h3>
            {archivedGroups.map(group => (
              <div
                key={group._id}
                className="card"
                style={{ marginBottom: '12px', padding: '16px', opacity: 0.6, cursor: 'pointer' }}
                onClick={() => handleGroupClick(group._id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={group.name} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '17px', fontWeight: '600' }}>{group.name}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Archived</span>
                  </div>
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
