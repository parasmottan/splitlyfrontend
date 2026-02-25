import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import inviteService from '../services/inviteService';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';

export default function GroupSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeGroup, fetchGroup, archiveGroup, deleteGroup, leaveGroup } = useGroupStore();
  const { user } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    if (!activeGroup || activeGroup._id !== id) {
      fetchGroup(id);
    }
    const fetchPending = async () => {
      try {
        const invites = await inviteService.getPendingInvites(id);
        setPendingInvites(invites);
      } catch (err) { }
    };
    fetchPending();
  }, [id]);

  if (!activeGroup) {
    return <div className="page"><div className="loading-center"><div className="spinner"></div></div></div>;
  }

  const g = activeGroup;
  const isOwner = g.owner?._id === user?._id;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(g.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleArchive = async () => {
    try {
      await archiveGroup(id);
      navigate('/groups', { replace: true });
    } catch (err) { }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup(id);
      navigate('/groups', { replace: true });
    } catch (err) { }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(id);
      navigate('/groups', { replace: true });
    } catch (err) { }
  };

  return (
    <div className="page page-white" style={{ padding: '0 20px' }}>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack /> Back
        </button>
        <span className="header-title">Group Settings</span>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* Group Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 32px' }}>
        <Avatar name={g.name} size="xl" />
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '12px' }}>{g.name}</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {g.type?.charAt(0).toUpperCase() + g.type?.slice(1)} · {g.members?.length} member{g.members?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Invite Code */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>INVITE CODE</p>
            <p style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '4px' }}>{g.inviteCode}</p>
          </div>
          <button onClick={copyInviteCode} style={{ padding: '10px 16px', background: 'var(--blue-light)', borderRadius: 'var(--radius-md)', color: 'var(--blue)', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlineClipboardDocument />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="card" style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div className="form-row">
          <span className="form-row-label">Currency</span>
          <span className="form-row-value">{g.currency} ({g.currencySymbol})</span>
        </div>
        <div className="form-row">
          <span className="form-row-label">Created</span>
          <span className="form-row-value">{new Date(g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Members */}
      <h3 className="caption" style={{ marginBottom: '12px' }}>MEMBERS</h3>
      <div className="card" style={{ padding: '0 16px', marginBottom: '24px' }}>
        {g.members?.map((member, i) => {
          const m = member.user;
          return (
            <div key={m._id} className="form-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar name={m.name} size="sm" />
                <div>
                  <p style={{ fontWeight: '500', fontSize: '16px' }}>
                    {m._id === user?._id ? 'You' : m.name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{m.email}</p>
                </div>
              </div>
              {member.role === 'owner' && (
                <span className="badge badge-blue" style={{ fontSize: '11px' }}>Owner</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite by Email */}
      <h3 className="caption" style={{ marginBottom: '12px' }}>INVITE BY EMAIL</h3>
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Add members by entering their email addresses. If they don't have an account, they'll receive an invite link.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            placeholder="friend@example.com"
            id="invite-email-input"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', outline: 'none' }}
          />
          <button
            onClick={async () => {
              const input = document.getElementById('invite-email-input');
              const email = input.value.trim();
              if (email && /^\S+@\S+\.\S+$/.test(email)) {
                try {
                  await inviteService.sendInvites(id, [email]);
                  input.value = '';
                  fetchGroup(id); // Reload to show added/pending
                  setPendingInvites(await inviteService.getPendingInvites(id));
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to send invite');
                }
              }
            }}
            className="btn-primary"
            style={{ width: 'auto', padding: '0 20px', marginBottom: 0 }}
          >
            Invite
          </button>
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <>
          <h3 className="caption" style={{ marginBottom: '12px' }}>PENDING INVITES</h3>
          <div className="card" style={{ padding: '0 16px', marginBottom: '32px' }}>
            {pendingInvites.map((invite) => (
              <div key={invite._id} className="form-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                    ✉️
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '15px' }}>{invite.invitedEmail}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Cancel this invite?')) {
                      await inviteService.cancelInvite(invite._id);
                      setPendingInvites(pendingInvites.filter(i => i._id !== invite._id));
                    }
                  }}
                  style={{ color: 'var(--red)', fontSize: '13px', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Danger Zone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
        {isOwner && !g.archived && (
          <button className="btn-secondary" onClick={handleArchive} style={{ color: 'var(--orange)' }}>
            Archive Group
          </button>
        )}
        {isOwner && (
          <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
            Delete Group
          </button>
        )}
        {!isOwner && (
          <button className="btn-danger" onClick={() => setShowLeaveModal(true)}>
            Leave Group
          </button>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        icon="🗑️"
        title="Delete Group?"
        message="This will permanently delete the group and all expenses. This action cannot be undone."
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="modal-actions">
          <div className="modal-actions-row">
            <button onClick={() => setShowDeleteModal(false)} style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }}>Cancel</button>
            <button onClick={handleDelete} style={{ background: 'var(--red)', color: 'white' }}>Delete</button>
          </div>
        </div>
      </Modal>

      {/* Leave Modal */}
      <Modal
        show={showLeaveModal}
        icon="👋"
        title="Leave Group?"
        message="You'll lose access to this group and its expenses. You can join again with the invite code."
        onClose={() => setShowLeaveModal(false)}
      >
        <div className="modal-actions">
          <div className="modal-actions-row">
            <button onClick={() => setShowLeaveModal(false)} style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }}>Cancel</button>
            <button onClick={handleLeave} style={{ background: 'var(--red)', color: 'white' }}>Leave</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
