import { create } from 'zustand';
import api from '../services/api';

const useGroupStore = create((set, get) => ({
  groups: [],
  activeGroup: null,
  loading: false,
  error: null,

  fetchGroups: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get('/groups');
      set({ groups: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch groups', loading: false });
    }
  },

  fetchGroup: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get(`/groups/${id}`);
      set({ activeGroup: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch group', loading: false });
      throw error;
    }
  },

  createGroup: async (groupData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/groups', groupData);
      set(state => ({ groups: [data, ...state.groups], loading: false }));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create group';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  joinGroup: async (inviteCode) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/groups/join', { inviteCode });
      set(state => ({ groups: [data, ...state.groups], loading: false }));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to join group';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  updateGroup: async (id, updates) => {
    try {
      const { data } = await api.put(`/groups/${id}`, updates);
      set(state => ({
        groups: state.groups.map(g => g._id === id ? { ...g, ...data } : g),
        activeGroup: state.activeGroup?._id === id ? { ...state.activeGroup, ...data } : state.activeGroup
      }));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update group');
    }
  },

  archiveGroup: async (id) => {
    try {
      await api.put(`/groups/${id}/archive`);
      set(state => ({
        groups: state.groups.map(g => g._id === id ? { ...g, archived: true } : g),
        activeGroup: state.activeGroup?._id === id ? { ...state.activeGroup, archived: true } : state.activeGroup
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to archive group');
    }
  },

  deleteGroup: async (id) => {
    try {
      await api.delete(`/groups/${id}`);
      set(state => ({
        groups: state.groups.filter(g => g._id !== id),
        activeGroup: state.activeGroup?._id === id ? null : state.activeGroup
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  },

  leaveGroup: async (id) => {
    try {
      await api.put(`/groups/${id}/leave`);
      set(state => ({
        groups: state.groups.filter(g => g._id !== id),
        activeGroup: state.activeGroup?._id === id ? null : state.activeGroup
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to leave group');
    }
  },

  clearActiveGroup: () => set({ activeGroup: null }),
  clearError: () => set({ error: null })
}));

export default useGroupStore;
