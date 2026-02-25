import { create } from 'zustand';
import api from '../services/api';

const useExpenseStore = create((set) => ({
  expenses: [],
  loading: false,
  error: null,

  fetchExpenses: async (groupId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get(`/expenses/${groupId}`);
      set({ expenses: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch expenses', loading: false });
    }
  },

  addExpense: async (expenseData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/expenses', expenseData);
      set(state => ({ expenses: [data, ...state.expenses], loading: false }));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add expense';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  clearExpenses: () => set({ expenses: [], error: null })
}));

export default useExpenseStore;
