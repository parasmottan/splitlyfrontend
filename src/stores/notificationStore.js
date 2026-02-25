import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      set({
        notifications: data,
        unreadCount: data.filter(n => !n.isRead).length,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      const updated = get().notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      );
      set({
        notifications: updated,
        unreadCount: updated.filter(n => !n.isRead).length
      });
    } catch (error) { }
  },

  markAllRead: async () => {
    try {
      await api.post('/notifications/read-all');
      const updated = get().notifications.map(n => ({ ...n, isRead: true }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) { }
  },

  sendReminder: async (debtorId, groupId, amount, message) => {
    try {
      await api.post('/notifications/remind', { debtorId, groupId, amount, message });
      return true;
    } catch (error) {
      throw error;
    }
  }
}));

export default useNotificationStore;
