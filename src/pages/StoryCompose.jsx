import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useStoryStore from '../stores/storyStore';

const STORY_BGS = [
  { id: 'purple', label: 'Cosmic', value: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)' },
  { id: 'teal', label: 'Teal', value: 'linear-gradient(135deg, #00B8D9 0%, #0052CC 100%)' },
  { id: 'sunset', label: 'Sunset', value: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFCC02 100%)' },
  { id: 'midnight', label: 'Night', value: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)' },
  { id: 'forest', label: 'Forest', value: 'linear-gradient(135deg, #1B998B 0%, #2D3561 100%)' },
  { id: 'rose', label: 'Rose', value: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)' },
  { id: 'mint', label: 'Mint', value: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)' },
  { id: 'gold', label: 'Gold', value: 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)' },
];

const FONT_OPTIONS = [
  { id: 'sans', label: 'Modern', family: "'Inter', sans-serif", weight: '700' },
  { id: 'serif', label: 'Classic', family: "'Georgia', serif", weight: '700' },
  { id: 'script', label: 'Script', family: "'Dancing Script', 'Brush Script MT', cursive", weight: '700' },
];

const DURATION_OPTIONS = [
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 5 * 60_000 },
  { label: '15m', ms: 15 * 60_000 },
  { label: '30m', ms: 30 * 60_000 },
  { label: '1h', ms: 3_600_000 },
  { label: '3h', ms: 3 * 3_600_000 },
  { label: '6h', ms: 6 * 3_600_000 },
  { label: '12h', ms: 12 * 3_600_000 },
  { label: '24h', ms: 24 * 3_600_000 },
];

export default function StoryCompose() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addStory } = useStoryStore();

  const [text, setText] = useState('');
  const [selectedBg, setSelectedBg] = useState(STORY_BGS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[4]); // 1h default
  const [panel, setPanel] = useState('bg'); // 'bg' | 'font' | 'duration'
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    try {
      await addStory(text.trim(), selectedBg.value, selectedFont.id, selectedDuration.ms);
      navigate('/groups', { replace: true });
    } catch (e) {
      // ignore - still navigate back
      navigate('/groups', { replace: true });
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', flexDirection: 'column', background: selectedBg.value, maxWidth: '430px', margin: '0 auto' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '18px' }}>✕</button>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.5px', background: 'rgba(0,0,0,0.2)', padding: '6px 14px', borderRadius: '100px' }}>
          Your Story · {selectedDuration.label}
        </div>
        <button
          onClick={handlePost}
          disabled={!text.trim()}
          style={{ background: text.trim() ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', borderRadius: '100px', padding: '8px 20px', cursor: text.trim() ? 'pointer' : 'default', fontSize: '15px', fontWeight: '800', color: selectedBg.id === 'gold' || selectedBg.id === 'mint' ? '#1C1C1E' : '#6347F5', transition: 'all 200ms' }}>
          Post
        </button>
      </div>

      {/* Text area (the story canvas) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 32px' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={200}
          placeholder="What's on your mind?"
          style={{
            background: 'transparent', border: 'none', outline: 'none', resize: 'none',
            width: '100%', textAlign: 'center', color: '#fff',
            fontFamily: selectedFont.family, fontWeight: selectedFont.weight,
            fontSize: text.length > 80 ? '22px' : text.length > 40 ? '28px' : '36px',
            lineHeight: 1.35, caretColor: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            letterSpacing: '0.2px',
          }}
          rows={6}
        />
      </div>

      {/* Char count */}
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px' }}>
        {200 - text.length} left
      </div>

      {/* Control panel tabs */}
      <div style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(20px)', borderRadius: '24px 24px 0 0', padding: '16px 20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', padding: '4px' }}>
          {[{ id: 'bg', label: '🎨 Background' }, { id: 'font', label: 'Aa Font' }, { id: 'duration', label: '⏱ Duration' }].map(t => (
            <button key={t.id} onClick={() => setPanel(t.id)} style={{ flex: 1, padding: '8px 4px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: panel === t.id ? '#fff' : 'transparent', color: panel === t.id ? '#1C1C1E' : 'rgba(255,255,255,0.7)', transition: 'all 200ms' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* BG picker */}
        {panel === 'bg' && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {STORY_BGS.map(bg => (
              <button key={bg.id} onClick={() => setSelectedBg(bg)} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: bg.value, border: selectedBg.id === bg.id ? '3px solid #fff' : '3px solid transparent', boxShadow: selectedBg.id === bg.id ? '0 0 0 2px rgba(255,255,255,0.5)' : 'none', transition: 'all 200ms' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{bg.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Font picker */}
        {panel === 'font' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {FONT_OPTIONS.map(f => (
              <button key={f.id} onClick={() => setSelectedFont(f)} style={{ flex: 1, padding: '16px 12px', borderRadius: '16px', border: selectedFont.id === f.id ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)', background: selectedFont.id === f.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 200ms' }}>
                <span style={{ fontFamily: f.family, fontWeight: f.weight, fontSize: '22px', color: '#fff' }}>Aa</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Duration picker */}
        {panel === 'duration' && (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '10px', textAlign: 'center', fontWeight: '600' }}>Story visible for…</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {DURATION_OPTIONS.map(d => (
                <button key={d.label} onClick={() => setSelectedDuration(d)} style={{ padding: '10px 16px', borderRadius: '100px', border: selectedDuration.label === d.label ? '2px solid #fff' : '2px solid rgba(255,255,255,0.25)', background: selectedDuration.label === d.label ? '#fff' : 'rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: selectedDuration.label === d.label ? '#6347F5' : 'rgba(255,255,255,0.85)', transition: 'all 200ms' }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
