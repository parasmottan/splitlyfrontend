import { create } from 'zustand';
import api from '../services/api';

const useStoryStore = create((set, get) => ({
  storiesMap: {}, // { [userId]: { userId, userName, stories: [] } }
  viewedIds: new Set(),
  loading: false,

  fetchStories: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/stories');
      // data = [{ userId, userName, stories: [{id, text, bg, fontStyle, createdAt, expiresAt}] }]
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
    // Merge into storiesMap
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
            }],
          },
        },
      };
    });
    return data;
  },

  deleteStory: async (storyId, userId) => {
    await api.delete(`/stories/${storyId}`);
    set(state => {
      const entry = state.storiesMap[userId];
      if (!entry) return state;
      const stories = entry.stories.filter(s => s.id !== storyId);
      const next = { ...state.storiesMap };
      if (stories.length === 0) {
        delete next[userId];
      } else {
        next[userId] = { ...entry, stories };
      }
      return { storiesMap: next };
    });
  },

  markViewed: (storyId) => {
    set(state => {
      const next = new Set(state.viewedIds);
      next.add(storyId);
      return { viewedIds: next };
    });
  },

  getActiveStories: () => {
    const now = Date.now();
    return Object.values(get().storiesMap).filter(
      entry => (entry.stories || []).some(s => new Date(s.expiresAt).getTime() > now)
    );
  },

  hasUnviewedStories: (userId) => {
    const { storiesMap, viewedIds } = get();
    const now = Date.now();
    const entry = storiesMap[userId];
    if (!entry) return false;
    return entry.stories.some(s => new Date(s.expiresAt).getTime() > now && !viewedIds.has(s.id));
  },

  getStoriesForUser: (userId) => {
    const now = Date.now();
    const entry = get().storiesMap[userId];
    if (!entry) return [];
    return entry.stories.filter(s => new Date(s.expiresAt).getTime() > now);
  },
}));

export default useStoryStore;
