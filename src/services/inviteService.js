import api from '../services/api';

const inviteService = {
  sendInvites: async (groupId, emails) => {
    const { data } = await api.post(`/invites/groups/${groupId}/invite`, { emails });
    return data;
  },
  getPendingInvites: async (groupId) => {
    const { data } = await api.get(`/invites/groups/${groupId}/invites`);
    return data;
  },
  cancelInvite: async (inviteId) => {
    const { data } = await api.delete(`/invites/invites/${inviteId}`);
    return data;
  },
  verifyToken: async (token) => {
    const { data } = await api.get(`/invites/token/${token}`);
    return data;
  },
  acceptInvite: async (token) => {
    const { data } = await api.post('/invites/accept', { token });
    return data;
  }
};

export default inviteService;
