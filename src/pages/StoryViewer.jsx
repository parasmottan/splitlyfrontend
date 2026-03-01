import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStoryStore from '../stores/storyStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';

const FONT_FAMILIES = {
  sans: "'Inter', sans-serif",
  serif: "'Georgia', serif",
  script: "'Dancing Script', 'Brush Script MT', cursive",
};

export default function StoryViewer() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { storiesMap, markStoryViewed, getStoriesForUser } = useStoryStore();
  const { user: currentUser } = useAuthStore();

  const stories = getStoriesForUser(userId);
  const entry = storiesMap[userId];
  const isMyStory = currentUser?._id === userId || currentUser?._id?.toString() === userId;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  const STORY_DURATION = 5000;

  // Mark story as viewed when it appears (only if not own story)
  useEffect(() => {
    if (stories[currentIdx] && !isMyStory) {
      markStoryViewed(stories[currentIdx].id || stories[currentIdx]._id);
    }
  }, [currentIdx]);

  // Progress bar auto-advance
  useEffect(() => {
    if (!stories.length) return;
    setProgress(0);
    const start = Date.now();
    let rafId;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (currentIdx < stories.length - 1) {
          setCurrentIdx(i => i + 1);
        } else {
          navigate(-1);
        }
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [currentIdx, stories.length]);

  const handleTap = useCallback((e) => {
    if (showViewers) { setShowViewers(false); return; }
    const { clientX, currentTarget } = e;
    const midX = currentTarget.getBoundingClientRect().width / 2;
    if (clientX < midX) {
      setCurrentIdx(i => Math.max(0, i - 1));
    } else {
      if (currentIdx < stories.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        navigate(-1);
      }
    }
  }, [currentIdx, stories.length, navigate, showViewers]);

  if (!stories.length || !entry) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, flexDirection: 'column', gap: '16px', maxWidth: '430px', margin: '0 auto' }}>
        <div style={{ fontSize: 48 }}>🤐</div>
        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>No active stories</p>
        <button onClick={() => navigate(-1)} style={{ color: '#6347F5', background: 'rgba(99,71,245,0.15)', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>Go back</button>
      </div>
    );
  }

  const story = stories[currentIdx];
  const elapsed = Date.now() - new Date(story.createdAt).getTime();
  const elapsedStr = elapsed < 3600000 ? `${Math.floor(elapsed / 60000)}m ago` : `${Math.floor(elapsed / 3600000)}h ago`;
  const viewerCount = story.viewerCount || 0;
  const viewers = story.viewers || [];

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed', inset: 0, background: story.bg, zIndex: 3000,
        display: 'flex', flexDirection: 'column', maxWidth: '430px', margin: '0 auto',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      {/* Progress bars */}
      <div style={{ display: 'flex', gap: 4, padding: '14px 12px 0', paddingTop: 'calc(14px + env(safe-area-inset-top))' }}>
        {stories.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2, background: '#fff',
              width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%',
            }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.9)', overflow: 'hidden' }}>
            <Avatar name={entry.userName} style={{ width: 38, height: 38, fontSize: 14 }} />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: '700', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {isMyStory ? 'My Story' : entry.userName}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{elapsedStr}</p>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); navigate(-1); }} style={{ background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {/* Story text */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 32px' }}>
        <p style={{
          fontFamily: FONT_FAMILIES[story.fontStyle] || FONT_FAMILIES.sans,
          fontWeight: '700', fontSize: story.text.length > 80 ? '24px' : story.text.length > 40 ? '30px' : '38px',
          color: '#fff', textAlign: 'center', lineHeight: 1.35, margin: 0,
          textShadow: '0 2px 16px rgba(0,0,0,0.3)',
        }}>
          {story.text}
        </p>
      </div>

      {/* Bottom — viewer count (only for story author) */}
      {isMyStory ? (
        <div style={{ padding: '0 20px 32px', paddingBottom: 'calc(32px + env(safe-area-inset-bottom))' }}>
          <button
            onClick={e => { e.stopPropagation(); setShowViewers(v => !v); }}
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#fff" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" /></svg>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
              {viewerCount === 0 ? 'No views yet' : `${viewerCount} view${viewerCount !== 1 ? 's' : ''}`}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: showViewers ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}><path d="M6 9L12 15L18 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>

          {/* Viewer list */}
          {showViewers && viewers.length > 0 && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ marginTop: 12, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', borderRadius: 20, overflow: 'hidden', maxHeight: 200, overflowY: 'auto' }}
            >
              {viewers.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < viewers.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <Avatar name={v.name} style={{ width: 32, height: 32, fontSize: 12 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 14, fontWeight: '700', margin: 0 }}>{v.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>
                      {v.viewedAt ? new Date(v.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="2" /></svg>
                </div>
              ))}
              {viewers.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px', margin: 0, fontSize: 14 }}>No one has viewed this yet</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>Tap to navigate</p>
        </div>
      )}
    </div>
  );
}
