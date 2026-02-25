import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoChevronBack, IoNotificationsOutline } from 'react-icons/io5';
import inviteService from '../services/inviteService';
import useAuthStore from '../stores/authStore';

export default function JoinInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const data = await inviteService.verifyToken(token);
        setInviteData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired invite link');
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  const handleJoin = async () => {
    if (!user) {
      // Redirect to login/register with return path
      navigate('/login', { state: { from: `/join/${token}` } });
      return;
    }

    setVerifying(true);
    try {
      const response = await inviteService.acceptInvite(token);
      navigate(`/groups/${response.groupId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', minHeight: '100dvh' }}>
      <div className="header">
        <button className="header-back" onClick={() => navigate('/groups')}>
          <IoChevronBack /> Groups
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <IoNotificationsOutline style={{ fontSize: '32px', color: 'var(--blue)' }} />
        </div>

        {error ? (
          <>
            <h1 className="title-large" style={{ color: 'var(--red)', marginBottom: '12px' }}>Invite Error</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>{error}</p>
            <button className="btn-primary" onClick={() => navigate('/groups')}>Go to My Groups</button>
          </>
        ) : (
          <>
            <h1 className="title-large" style={{ marginBottom: '12px' }}>Group Invite</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '16px' }}>
              You've been invited to join
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--blue)', marginBottom: '48px' }}>{inviteData.groupName}</h2>

            <div style={{ width: '100%', maxWidth: '300px' }}>
              <button
                className="btn-primary"
                onClick={handleJoin}
                disabled={verifying}
                style={{ marginBottom: '16px' }}
              >
                {verifying ? 'Joining...' : 'Accept & Join Group'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/groups')}
              >
                Decline
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
