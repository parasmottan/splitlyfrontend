import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initiateRegister: async (name, email, password) => {
    try {
      set({ loading: true, error: null });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const { data } = await api.post('/auth/register-initiate',
        { name, email, password },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      set({ loading: false });
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      let msg = 'Registration failed';
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        msg = 'Request timed out. Please check your internet or try again.';
      } else {
        msg = error.response?.data?.message || msg;
      }
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  verifyOtp: async (name, email, password, otp) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/auth/verify-otp', { name, email, password, otp });
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  resendOtp: async (email) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/otp/resend-otp', { email });
      set({ loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend code';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('accessToken');
    set({ user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ loading: false, user: null });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      localStorage.removeItem('accessToken');
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
