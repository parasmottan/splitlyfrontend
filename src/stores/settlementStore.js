import { create } from 'zustand';
import api from '../services/api';

const useSettlementStore = create((set) => ({
  settlementData: null,
  loading: false,
  error: null,

  fetchSettlements: async (groupId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get(`/settlements/${groupId}`);
      set({ settlementData: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch settlements', loading: false });
    }
  },

  settleAll: async (groupId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post(`/settlements/${groupId}/settle-all`);
      set({ loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to settle';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  settleSingle: async (groupId, transfer) => {
    try {
      const { data } = await api.post(`/settlements/${groupId}/settle-single`, transfer);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to settle');
    }
  },

  clearSettlements: () => set({ settlementData: null, error: null })
}));

export default useSettlementStore;
