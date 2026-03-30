import { useState, useEffect } from 'react';

interface EntryExperienceProps {
  onComplete: () => void;
}

const EntryExperience = ({ onComplete }: EntryExperienceProps) => {
  const [phase, setPhase] = useState<
    'landing' | 'temple' | 'door-open' | 'zoom' | 'darkness' | 'done'
  >('landing');

  const handleEnter = () => {
    setPhase('temple');
    setTimeout(() => setPhase('door-open'), 2200);
    setTimeout(() => setPhase('zoom'),      3800);
    setTimeout(() => setPhase('darkness'),  5400);
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 6800);
  };

  return (
    <div
      className="entry-root"
      style={{ display: phase === 'done' ? 'none' : 'flex' }}
    >
      {/* ── LANDING SCREEN ── */}
      {phase === 'landing' && (
        <div className="landing">
          <div className="landing-bg" />
          <div className="hieroglyphs-top">
            {['𓂀','𓃀','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐','𓊪','𓋴','𓌀','𓍿'].map((g, i) => (
              <span key={i} className="glyph" style={{ animationDelay: `${i * 0.15}s` }}>{g}</span>
            ))}
          </div>
          <div className="landing-content">
            <div className="eye-of-ra">
              <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="30" rx="58" ry="28" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
                <circle cx="60" cy="30" r="12" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
                <circle cx="60" cy="30" r="5" fill="#D4AF37"/>
                <path d="M60 42 L55 55 L60 52 L65 55 Z" fill="#D4AF37"/>
                <line x1="2" y1="30" x2="20" y2="30" stroke="#D4AF37" strokeWidth="1"/>
                <line x1="100" y1="30" x2="118" y2="30" stroke="#D4AF37" strokeWidth="1"/>
              </svg>
            </div>
            <div className="brand-name">OSIRIDS</div>
            <div className="brand-sub">PHAROIC CLOTHING</div>
            <div className="divider-line" />
            <button className="enter-btn" onClick={handleEnter}>
              <span className="enter-text">ENTER</span>
              <span className="enter-glyph">𓂀</span>
            </button>
            <p className="enter-hint">The gates of legacy await</p>
          </div>
          <div className="hieroglyphs-bottom">
            {['𓏏','𓎡','𓐍','𓑁','𓒀','𓓇','𓔎','𓕍','𓖌','𓗋','𓘊','𓙉'].map((g, i) => (
              <span key={i} className="glyph" style={{ animationDelay: `${i * 0.15 + 0.5}s` }}>{g}</span>
            ))}
          </div>
          <div className="sand-overlay" />
        </div>
      )}

      {/* ── TEMPLE + DOOR ANIMATION ── */}
      {(phase === 'temple' || phase === 'door-open' || phase === 'zoom') && (
        <div className={`temple-scene phase-${phase}`}>
          {/* Sky / background */}
          <div className="temple-sky" />

          {/* Stars */}
          <div className="stars">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="star" style={{
                left:  `${Math.random() * 100}%`,
                top:   `${Math.random() * 60}%`,
                width: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }} />
            ))}
          </div>

          {/* Moon */}
          <div className="moon" />

          {/* Desert floor */}
          <div className="desert-floor" />

          {/* Temple structure */}
          <div className="temple">
            {/* Pillars left */}
            <div className="pillar pillar-far-left" />
            <div className="pillar pillar-left" />

            {/* Main temple body */}
            <div className="temple-body">
              {/* Top cornice */}
              <div className="cornice">
                <div className="cornice-pattern">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="cornice-block" />
                  ))}
                </div>
                <div className="cornice-frieze">
                  {['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯','𓈖'].map((g, i) => (
                    <span key={i} className="frieze-glyph">{g}</span>
                  ))}
                </div>
              </div>

              {/* Temple wall */}
              <div className="temple-wall">
                {/* Wall hieroglyphs */}
                <div className="wall-glyphs left-glyphs">
                  {['𓂀','𓃀','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐'].map((g, i) => (
                    <span key={i}>{g}</span>
                  ))}
                </div>
                <div className="wall-glyphs right-glyphs">
                  {['𓊪','𓋴','𓌀','𓍿','𓎡','𓏏','𓐍','𓑁'].map((g, i) => (
                    <span key={i}>{g}</span>
                  ))}
                </div>

                {/* THE DOOR */}
                <div className="door-frame">
                  <div className="door-top-glyph">𓂀</div>
                  <div className="door-container">
                    <div className="door-left" />
                    <div className="door-right" />
                    {/* Inner glow when opening */}
                    <div className="door-inner-light" />
                  </div>
                  <div className="door-step" />
                </div>
              </div>
            </div>

            {/* Pillars right */}
            <div className="pillar pillar-right" />
            <div className="pillar pillar-far-right" />
          </div>

          {/* Zoom darkness overlay */}
          <div className="zoom-darkness" />
        </div>
      )}

      {/* ── TOTAL DARKNESS ── */}
      {phase === 'darkness' && (
        <div className="total-darkness" />
      )}

      <style>{`
        /* ===== ROOT ===== */
        .entry-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #050505;
        }

        /* ===== LANDING ===== */
        .landing {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 40%, #0d0a00 0%, #050505 70%);
        }
        .landing-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% 60%, rgba(212,175,55,0.04) 0%, transparent 70%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 80px,
              rgba(212,175,55,0.015) 80px,
              rgba(212,175,55,0.015) 81px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(212,175,55,0.015) 80px,
              rgba(212,175,55,0.015) 81px
            );
        }
        .sand-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to top, rgba(212,175,55,0.06), transparent);
          pointer-events: none;
        }
        .hieroglyphs-top, .hieroglyphs-bottom {
          position: absolute;
          left: 0; right: 0;
          display: flex;
          justify-content: center;
          gap: 24px;
          padding: 0 20px;
        }
        .hieroglyphs-top  { top: 24px; }
        .hieroglyphs-bottom { bottom: 24px; }
        .glyph {
          color: rgba(212,175,55,0.25);
          font-size: 20px;
          animation: glyphPulse 3s ease-in-out infinite;
        }
        @keyframes glyphPulse {
          0%,100% { opacity: 0.2; }
          50%      { opacity: 0.6; }
        }
        .landing-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 2;
          animation: landingReveal 1.2s ease both;
        }
        @keyframes landingReveal {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .eye-of-ra {
          width: 140px;
          height: 70px;
          animation: eyeGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 16px rgba(212,175,55,0.6));
        }
        @keyframes eyeGlow {
          0%,100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.4)); }
          50%      { filter: drop-shadow(0 0 24px rgba(212,175,55,0.9)); }
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(64px, 14vw, 128px);
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 0.3em;
          line-height: 1;
          text-shadow: 0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15);
        }
        .brand-sub {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6em;
          color: rgba(212,175,55,0.5);
          text-transform: uppercase;
        }
        .divider-line {
          width: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, #D4AF37, transparent);
          margin: 8px 0;
        }
        .enter-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 48px;
          border: 1px solid rgba(212,175,55,0.5);
          background: transparent;
          color: #D4AF37;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          margin-top: 16px;
        }
        .enter-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(212,175,55,0.08);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .enter-btn:hover::before { transform: scaleX(1); }
        .enter-btn:hover {
          border-color: #D4AF37;
          box-shadow: 0 0 30px rgba(212,175,55,0.2), inset 0 0 30px rgba(212,175,55,0.05);
          transform: translateY(-2px);
        }
        .enter-btn:active { transform: scale(0.98); }
        .enter-text { position: relative; z-index: 1; }
        .enter-glyph { font-size: 20px; position: relative; z-index: 1; }
        .enter-hint {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: rgba(212,175,55,0.25);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ===== TEMPLE SCENE ===== */
        .temple-scene {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: #02010a;
          animation: templeReveal 0.8s ease both;
        }
        @keyframes templeReveal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .temple-sky {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 20%, #0a0520 0%, #02010a 60%);
        }
        .stars { position: absolute; inset: 0; pointer-events: none; }
        .star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: starTwinkle 2s ease-in-out infinite;
        }
        @keyframes starTwinkle {
          0%,100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        .moon {
          position: absolute;
          top: 8%;
          right: 15%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fffbe0, #D4AF37 60%, #a0842a);
          box-shadow: 0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15);
        }
        .desert-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 28%;
          background: linear-gradient(to top, #1a1206, #0d0b04, transparent);
        }

        /* Temple */
        .temple {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          gap: 0;
          animation: templeRise 1s ease both;
        }
        @keyframes templeRise {
          from { opacity: 0; transform: translateX(-50%) translateY(40px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .pillar {
          width: 28px;
          background: linear-gradient(to right, #1a1408, #2a2010, #1a1408);
          border-top: 4px solid #D4AF37;
          position: relative;
        }
        .pillar::after {
          content: '';
          position: absolute;
          top: -12px;
          left: -6px;
          right: -6px;
          height: 12px;
          background: #D4AF37;
          opacity: 0.7;
        }
        .pillar-far-left  { height: 200px; margin-right: 12px; }
        .pillar-left      { height: 240px; margin-right: 8px; }
        .pillar-right     { height: 240px; margin-left: 8px; }
        .pillar-far-right { height: 200px; margin-left: 12px; }

        .temple-body {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cornice {
          width: 420px;
          background: linear-gradient(to bottom, #2a2010, #1a1408);
          border-top: 3px solid #D4AF37;
          padding: 8px 0 4px;
        }
        .cornice-pattern {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin-bottom: 6px;
        }
        .cornice-block {
          width: 18px;
          height: 10px;
          background: rgba(212,175,55,0.3);
          border: 1px solid rgba(212,175,55,0.15);
        }
        .cornice-frieze {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 0 20px;
        }
        .frieze-glyph {
          color: rgba(212,175,55,0.6);
          font-size: 14px;
        }

        .temple-wall {
          width: 420px;
          height: 280px;
          background: linear-gradient(to bottom, #1a1408, #120e04);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 2px solid rgba(212,175,55,0.1);
          border-right: 2px solid rgba(212,175,55,0.1);
        }
        .wall-glyphs {
          position: absolute;
          top: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          color: rgba(212,175,55,0.2);
          font-size: 16px;
        }
        .left-glyphs  { left: 20px; }
        .right-glyphs { right: 20px; }

        /* DOOR */
        .door-frame {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .door-top-glyph {
          font-size: 22px;
          color: #D4AF37;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 8px rgba(212,175,55,0.8));
        }
        .door-container {
          width: 100px;
          height: 160px;
          position: relative;
          display: flex;
          overflow: hidden;
        }
        .door-left, .door-right {
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom, #0d0a04, #050402);
          border: 1px solid rgba(212,175,55,0.4);
          position: relative;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left center;
        }
        .door-right {
          transform-origin: right center;
        }
        .door-left::after {
          content: '';
          position: absolute;
          right: 6px;
          top: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D4AF37;
          transform: translateY(-50%);
          box-shadow: 0 0 6px rgba(212,175,55,0.8);
        }
        .door-right::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D4AF37;
          transform: translateY(-50%);
          box-shadow: 0 0 6px rgba(212,175,55,0.8);
        }
        .door-inner-light {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0) 0%, transparent 100%);
          transition: background 1.4s ease;
          pointer-events: none;
          z-index: 2;
        }
        .door-step {
          width: 120px;
          height: 10px;
          background: linear-gradient(to bottom, #2a2010, #1a1408);
          border-top: 2px solid rgba(212,175,55,0.4);
          margin-top: 2px;
        }

        /* ── DOOR OPEN PHASE ── */
        .phase-door-open .door-left,
        .phase-zoom .door-left {
          transform: perspective(400px) rotateY(-75deg);
        }
        .phase-door-open .door-right,
        .phase-zoom .door-right {
          transform: perspective(400px) rotateY(75deg);
        }
        .phase-door-open .door-inner-light,
        .phase-zoom .door-inner-light {
          background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.1) 50%, transparent 80%);
        }

        /* ── ZOOM PHASE ── */
        .phase-zoom .temple-scene,
        .phase-zoom {
          animation: zoomIn 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .phase-zoom .temple {
          animation: templeZoom 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes templeZoom {
          from { transform: translateX(-50%) scale(1); }
          to   { transform: translateX(-50%) scale(8); opacity: 0; }
        }
        .phase-zoom .temple-sky,
        .phase-zoom .stars,
        .phase-zoom .moon,
        .phase-zoom .desert-floor {
          animation: fadeOutBg 1.8s ease forwards;
        }
        @keyframes fadeOutBg {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* Zoom darkness overlay */
        .zoom-darkness {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0s;
        }
        .phase-zoom .zoom-darkness {
          opacity: 0;
          animation: darknessIn 1.8s ease 0.6s forwards;
        }
        @keyframes darknessIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ===== TOTAL DARKNESS ===== */
        .total-darkness {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 9999;
          animation: finalFadeOut 1.4s ease 0.5s forwards;
        }
        @keyframes finalFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EntryExperience;