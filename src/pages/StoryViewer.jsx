import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStoryStore from '../stores/storyStore';
import Avatar from '../components/Avatar';

const FONT_FAMILIES = {
  sans: "'Inter', sans-serif",
  serif: "'Georgia', serif",
  script: "'Dancing Script', 'Brush Script MT', cursive",
};

export default function StoryViewer() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { storiesMap, markViewed, getStoriesForUser } = useStoryStore();

  const stories = getStoriesForUser(userId);
  const entry = storiesMap[userId];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stories[currentIdx]) markViewed(stories[currentIdx].id);
  }, [currentIdx]);

  const STORY_DURATION = 5000; // 5s per story slide

  useEffect(() => {
    if (!stories.length) return;
    setProgress(0);
    const start = Date.now();
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        if (currentIdx < stories.length - 1) {
          setCurrentIdx(i => i + 1);
        } else {
          navigate(-1);
        }
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [currentIdx, stories.length]);

  const handleTap = useCallback((e) => {
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
  }, [currentIdx, stories.length, navigate]);

  if (!stories.length || !entry) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#fff', fontSize: '18px' }}>No active stories</p>
        <button onClick={() => navigate(-1)} style={{ color: '#6347F5', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>Go back</button>
      </div>
    );
  }

  const story = stories[currentIdx];
  const elapsed = Date.now() - story.createdAt;
  const elapsedStr = elapsed < 3600000
    ? `${Math.floor(elapsed / 60000)}m ago`
    : `${Math.floor(elapsed / 3600000)}h ago`;

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
      <div style={{ display: 'flex', gap: '4px', padding: '14px 12px 0', paddingTop: 'calc(14px + env(safe-area-inset-top))' }}>
        {stories.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px', background: '#fff',
              width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%',
              transition: i === currentIdx ? 'none' : undefined,
            }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.9)', overflow: 'hidden' }}>
            <Avatar name={entry.userName} style={{ width: '38px', height: '38px', fontSize: '14px' }} />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{entry.userName}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>{elapsedStr}</p>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} style={{ background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
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

      {/* Swipe hint at bottom */}
      <div style={{ padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>Tap to navigate · Swipe down to close</p>
      </div>
    </div>
  );
}
