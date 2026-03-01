import SEO from '../components/SEO';

export default function Landing() {
  // ... existing refs and useEffect
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100dvh', padding: '0',
      background: 'linear-gradient(155deg, #EBEDff 0%, #D9E0FF 30%, #C8D6FF 60%, #DDE6F8 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      <SEO
        title="Splitly – Split Expenses Easily with Friends & Groups"
        description="Splitly is a modern group expense tracking app that helps you split bills, share expenses with friends, and settle balances easily without the awkward money talks."
        canonical="/"
      />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', zIndex: 10 }}>
        <div style={{ width: '34px', height: '34px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', padding: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ background: 'rgba(99, 71, 245, 0.7)', borderRadius: '50%' }} />
          ))}
        </div>
        <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', borderRadius: '100px', fontSize: '13px', fontWeight: '600', color: '#3D3D5C', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          v1.0 Beta
        </div>
      </div>

      {/* Floating glass orbs - upper 55% */}
      <div style={{ position: 'relative', width: '100%', height: '55vh', overflow: 'hidden', flexShrink: 0 }}>
        {/* Large center orb */}
        <div ref={orbRef1} style={{
          position: 'absolute', top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.92) 0%, rgba(220,228,255,0.55) 55%, rgba(190,205,255,0.2) 100%)',
          boxShadow: '0 8px 40px rgba(130,140,255,0.18), inset 0 1px 1px rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
        }} />
        {/* Top-right small orb */}
        <div ref={orbRef2} style={{
          position: 'absolute', top: '4%', right: '8%',
          width: '110px', height: '110px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.88) 0%, rgba(210,220,255,0.45) 60%, rgba(180,200,255,0.15) 100%)',
          boxShadow: '0 6px 24px rgba(130,140,255,0.14), inset 0 1px 1px rgba(255,255,255,0.85)',
        }} />
        {/* Bottom-left small orb */}
        <div ref={orbRef3} style={{
          position: 'absolute', bottom: '4%', left: '6%',
          width: '85px', height: '85px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(205,215,255,0.4) 55%, rgba(175,195,255,0.1) 100%)',
          boxShadow: '0 4px 16px rgba(130,140,255,0.1), inset 0 1px 1px rgba(255,255,255,0.8)',
        }} />
      </div>

      {/* Bottom content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flex: 1, padding: '0 28px 24px' }}>
        <h1 style={{
          fontSize: '38px', fontWeight: '800', textAlign: 'center', lineHeight: '1.2',
          marginBottom: '14px', letterSpacing: '-1.5px', color: '#0F1130',
        }}>
          Split expenses.<br />
          Stay balanced.
        </h1>
        <p style={{ fontSize: '15px', color: '#555875', textAlign: 'center', lineHeight: '1.5', marginBottom: '32px', fontWeight: '500' }}>
          The smartest group expense tracker to <strong style={{ color: '#6347F5' }}>share expenses with friends</strong>, split bills, and settle balances easily without the awkward money talks.
        </p>

        <div style={{ width: '100%', maxWidth: '360px', marginBottom: '24px' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
            style={{ marginBottom: '14px', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.2px', borderRadius: '100px', padding: '18px 24px' }}
          >
            Start a Group &nbsp;→
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/login')}
            style={{ background: 'rgba(255,255,255,0.75)', color: '#0F1130', borderRadius: '100px', padding: '18px 24px', fontSize: '17px', fontWeight: '600', boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
          >
            I already vibe here
          </button>
        </div>

        {/* Footer Internal Links for SEO */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: 'auto', paddingTop: '16px' }}>
          <a href="/privacy" style={{ fontSize: '12px', color: '#8E8E93', textDecoration: 'none', fontWeight: '600' }}>Privacy Policy</a>
          <a href="/terms" style={{ fontSize: '12px', color: '#8E8E93', textDecoration: 'none', fontWeight: '600' }}>Terms & Conditions</a>
          <a href="/account/help" style={{ fontSize: '12px', color: '#8E8E93', textDecoration: 'none', fontWeight: '600' }}>Help Center</a>
          <a href="mailto:noreplysplitly@gmail.com" style={{ fontSize: '12px', color: '#8E8E93', textDecoration: 'none', fontWeight: '600' }}>Contact</a>
        </div>
      </div>
    </div>
  );
}
