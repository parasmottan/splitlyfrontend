import { create } from 'zustand';
import api from '../services/api';

const useStoryStore = create((set, get) => ({
  storiesMap: {}, // { [userId]: { userId, userName, stories: [] } }
  loading: false,

  fetchStories: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/stories');
      const map = {};
      for (const entry of data) {
        map[entry.userId] = entry;
      }
      set({ storiesMap: map, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addStory: async (text, bg, fontStyle, durationMs) => {
    const { data } = await api.post('/stories', { text, bg, fontStyle, durationMs });
    set(state => {
      const existing = state.storiesMap[data.userId] || { userId: data.userId, userName: data.userName, stories: [] };
      return {
        storiesMap: {
          ...state.storiesMap,
          [data.userId]: {
            ...existing,
            stories: [...existing.stories, {
              id: data.id,
              text: data.text,
              bg: data.bg,
              fontStyle: data.fontStyle,
              createdAt: data.createdAt,
              expiresAt: data.expiresAt,
              viewerCount: 0,
              viewers: [],
            }],
          },
        },
      };
    });
    return data;
  },

  // Called when a user views a story slide — records view on backend
  markStoryViewed: async (storyId) => {
    try {
      await api.patch(`/stories/${storyId}/view`);
      // Re-fetch to get updated viewer counts
      get().fetchStories();
    } catch { /* silent */ }
  },

  deleteStory: async (storyId, userId) => {
    await api.delete(`/stories/${storyId}`);
    set(state => {
      const entry = state.storiesMap[userId];
      if (!entry) return state;
      const stories = entry.stories.filter(s => s.id !== storyId && s.id?.toString() !== storyId?.toString());
      const next = { ...state.storiesMap };
      if (stories.length === 0) delete next[userId];
      else next[userId] = { ...entry, stories };
      return { storiesMap: next };
    });
  },

  getActiveStories: () => {
    const now = Date.now();
    return Object.values(get().storiesMap).filter(
      entry => (entry.stories || []).some(s => new Date(s.expiresAt).getTime() > now)
    );
  },

  hasUnviewedStories: (userId) => {
    // For own stories we always show them (no "unviewed" concept)
    const now = Date.now();
    const entry = get().storiesMap[userId];
    if (!entry) return false;
    return entry.stories.some(s => new Date(s.expiresAt).getTime() > now);
  },

  getStoriesForUser: (userId) => {
    const now = Date.now();
    const entry = get().storiesMap[userId];
    if (!entry) return [];
    return entry.stories.filter(s => new Date(s.expiresAt).getTime() > now);
  },
}));

export default useStoryStore;
