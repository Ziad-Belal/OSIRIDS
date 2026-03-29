import { useState, useEffect } from 'react';

interface EntryExperienceProps {
  onComplete: () => void;
}

const EntryExperience = ({ onComplete }: EntryExperienceProps) => {
  const [phase, setPhase] = useState<'door' | 'open' | 'zoom' | 'darkness' | 'done'>('door');

  // Auto-trigger door opening on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('open'), 1300);
    const timer2 = setTimeout(() => setPhase('zoom'), 3100);
    const timer3 = setTimeout(() => setPhase('darkness'), 4700);
    const timer4 = setTimeout(() => { setPhase('done'); onComplete(); }, 5900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="entry-wrap">

      {/* ── DOOR SCENE ── */}
      {(phase === 'door' || phase === 'open' || phase === 'zoom') && (
        <div className={`door-scene ds-${phase}`}>

          {/* Dark atmospheric background */}
          <div className="ds-bg" />

          {/* The Door */}
          <div className="the-door">

            {/* TOP PANEL — hieroglyphs bar */}
            <div className="door-top-bar">
              {['𓂀', '𓃭', '𓄿', '𓅱', '𓆣', '𓇯', '𓈖', '𓉐', '𓊪', '𓋴', '𓌀', '𓍿', '𓎡', '𓏏', '𓐍', '𓑁'].map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>

            {/* MAIN DOOR PANELS */}
            <div className="door-panels">

              {/* LEFT PANEL */}
              <div className="panel panel-l">
                {/* Hieroglyph border top */}
                <div className="panel-border-top">
                  {['𓂀', '𓃭', '𓄿', '𓅱', '𓆣', '𓇯', '𓈖', '𓉐'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                {/* Left column glyphs */}
                <div className="panel-col-left">
                  {['𓊪', '𓋴', '𓌀', '𓍿', '𓎡', '𓏏', '𓐍', '𓑁', '𓒀', '𓓇'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                {/* Center content */}
                <div className="panel-center">
                  {/* Ankh */}
                  <div className="ankh">☥</div>
                  {/* OSIR text */}
                  <div className="door-text">OSIR</div>
                  {/* Scarab */}
                  <div className="scarab">𓆣</div>
                  {/* More glyphs */}
                  <div className="center-glyphs">
                    {['𓂀', '𓃭', '𓄿', '𓅱', '𓆣', '𓇯'].map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                </div>
                {/* Right column glyphs */}
                <div className="panel-col-right">
                  {['𓒀', '𓓇', '𓔎', '𓕍', '𓖌', '𓗋', '𓘊', '𓙉', '𓚈', '𓛇'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                {/* Door knob */}
                <div className="knob knob-r" />
                {/* Hieroglyph border bottom */}
                <div className="panel-border-bottom">
                  {['𓈖', '𓉐', '𓊪', '𓋴', '𓌀', '𓍿', '𓎡', '𓏏'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
              </div>

              {/* CENTER SEAM + glow */}
              <div className="door-seam">
                <div className="seam-glow" />
              </div>

              {/* RIGHT PANEL */}
              <div className="panel panel-r">
                <div className="panel-border-top">
                  {['𓑁', '𓒀', '𓓇', '𓔎', '𓕍', '𓖌', '𓗋', '𓘊'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                <div className="panel-col-left">
                  {['𓙉', '𓚈', '𓛇', '𓜆', '𓝅', '𓞄', '𓟃', '𓠂', '𓡁', '𓢀'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                <div className="panel-center">
                  <div className="ankh">☥</div>
                  <div className="door-text">IDS</div>
                  <div className="scarab">𓆣</div>
                  <div className="center-glyphs">
                    {['𓈖', '𓉐', '𓊪', '𓋴', '𓌀', '𓍿'].map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                </div>
                <div className="panel-col-right">
                  {['𓢀', '𓣿', '𓤾', '𓥽', '𓦼', '𓧻', '𓨺', '𓩹', '𓪸', '𓫷'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
                <div className="knob knob-l" />
                <div className="panel-border-bottom">
                  {['𓊪', '𓋴', '𓌀', '𓍿', '𓎡', '𓏏', '𓐍', '𓑁'].map((g, i) => <span key={i}>{g}</span>)}
                </div>
              </div>
            </div>

            {/* BOTTOM STEP */}
            <div className="door-step">
              <div className="step-glyphs">
                {['𓂀', '𓃭', '𓄿', '𓅱', '𓆣', '𓇯', '𓈖', '𓉐', '𓊪', '𓋴', '𓌀', '𓍿'].map((g, i) => <span key={i}>{g}</span>)}
              </div>
            </div>
          </div>

          {/* Zoom darkness overlay */}
          <div className="zoom-overlay" />
        </div>
      )}

      {/* TOTAL DARKNESS */}
      {phase === 'darkness' && <div className="total-dark" />}

      <style>{`
        /* ── ROOT ── */
        .entry-wrap {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #020100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ── SCENE ── */
        .door-scene {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Background */
        .ds-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 70% at 50% 60%, #2a1a0a 0%, #1a0f05 30%, #080500 60%, #020100 100%);
          animation: bgBreathe 8s ease-in-out infinite;
        }
        @keyframes bgBreathe {
          0%, 100% { filter: brightness(1) contrast(1); }
          50% { filter: brightness(1.1) contrast(1.05); }
        }

        /* ── THE DOOR ── */
        .the-door {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: doorReveal 1.2s ease both;
          filter: drop-shadow(0 0 60px rgba(212,175,55,0.25));
          box-shadow: 0 0 100px rgba(212,175,55,0.2);
          will-change: transform, opacity;
        }
        @keyframes doorReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top hieroglyph bar */
        .door-top-bar {
          width: 100%;
          background: linear-gradient(to bottom, 
            rgba(212,175,55,0.2),
            rgba(42,31,8,0.9) 30%, 
            rgba(26,19,8,0.95));
          border: 2px solid #D4AF37;
          border-bottom: none;
          padding: 12px 8px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          box-shadow: 
            inset 0 2px 8px rgba(212,175,55,0.4),
            0 8px 24px rgba(212,175,55,0.2);
        }
        .door-top-bar span {
          color: #FFD700;
          font-size: 16px;
          opacity: 0.95;
          text-shadow: 0 0 8px rgba(212,175,55,0.8);
          animation: glyphFloat 3s ease-in-out infinite;
        }
        .door-top-bar span:nth-child(odd) { animation-delay: 0s; }
        .door-top-bar span:nth-child(even) { animation-delay: 0.15s; }
        @keyframes glyphFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.1); }
        }

        /* Door panels container */
        .door-panels {
          display: flex;
          position: relative;
        }

        /* Individual panel */
        .panel {
          width: clamp(140px, 22vw, 220px);
          height: 100vh;
          background: 
            linear-gradient(135deg, 
              rgba(30,20,8,0.9) 0%, 
              rgba(15,12,6,0.95) 50%,
              rgba(15,12,6,0.95) 100%);
          border: 2.5px solid #D4AF37;
          box-shadow: 
            inset -6px 0 12px rgba(0,0,0,0.6),
            0 0 30px rgba(212,175,55,0.15);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        .panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(212,175,55,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Panel inner layout */
        .panel-border-top, .panel-border-bottom {
          position: absolute;
          left: 8px; right: 8px;
          display: flex;
          justify-content: space-around;
          background: linear-gradient(to right, 
            rgba(212,175,55,0.15),
            rgba(212,175,55,0.25) 50%,
            rgba(212,175,55,0.15));
          border: 2px solid rgba(212,175,55,0.5);
          padding: 6px;
          box-shadow: 
            inset 0 1px 4px rgba(212,175,55,0.3),
            0 0 12px rgba(212,175,55,0.2);
        }
        .panel-border-top  { top: 8px; }
        .panel-border-bottom { bottom: 8px; }
        .panel-border-top span, .panel-border-bottom span {
          color: #FFD700;
          font-size: 12px;
          text-shadow: 0 0 4px rgba(212,175,55,0.6);
          opacity: 1;
        }

        .panel-col-left, .panel-col-right {
          position: absolute;
          top: 36px; bottom: 36px;
          width: 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          background: linear-gradient(to right,
            rgba(212,175,55,0.08),
            rgba(212,175,55,0.15),
            rgba(212,175,55,0.08));
          border: 2px solid rgba(212,175,55,0.3);
          box-shadow: inset 0 0 8px rgba(212,175,55,0.1);
        }
        .panel-col-left  { left: 8px; }
        .panel-col-right { right: 8px; }
        .panel-col-left span, .panel-col-right span {
          color: #D4AF37;
          font-size: 11px;
          text-shadow: 0 0 3px rgba(212,175,55,0.5);
          opacity: 0.85;
          transition: all 0.3s ease;
        }
        .panel-col-left span:hover, .panel-col-right span:hover {
          opacity: 1;
          text-shadow: 0 0 8px rgba(212,175,55,0.9);
          transform: scale(1.2);
        }

        /* Center content */
        .panel-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 50px 32px;
          z-index: 2;
          background: radial-gradient(circle at center, rgba(212,175,55,0.05) 0%, transparent 70%);
          border-radius: 8px;
        }

        .ankh {
          font-size: 48px;
          color: #FFD700;
          filter: drop-shadow(0 0 10px rgba(212,175,55,0.6));
          animation: ankhPulse 3s ease-in-out infinite;
          text-shadow: 0 0 15px rgba(212,175,55,0.5);
        }
        @keyframes ankhPulse {
          0%,100% { 
            filter: drop-shadow(0 0 6px rgba(212,175,55,0.3));
            transform: scale(1);
          }
          50%      { 
            filter: drop-shadow(0 0 14px rgba(212,175,55,0.7));
            transform: scale(1.1);
          }
        }

        /* OSIR / IDS text on door */
        .door-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 900;
          color: #FFD700;
          letter-spacing: 0.4em;
          text-shadow:
            0 0 20px rgba(212,175,55,0.8),
            0 0 40px rgba(212,175,55,0.4),
            0 4px 8px rgba(0,0,0,0.9);
          animation: textGlow 2s ease-in-out infinite;
        }
        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 
              0 0 15px rgba(212,175,55,0.6),
              0 0 30px rgba(212,175,55,0.3),
              0 4px 8px rgba(0,0,0,0.9);
            opacity: 1;
          }
          50% {
            text-shadow: 
              0 0 30px rgba(212,175,55,0.8),
              0 0 60px rgba(212,175,55,0.5),
              0 4px 8px rgba(0,0,0,0.9);
            opacity: 1;
          }
        }

        .scarab {
          font-size: 32px;
          color: #FFD700;
          opacity: 0.95;
          filter: drop-shadow(0 0 8px rgba(212,175,55,0.6));
          animation: scarabSpin 8s linear infinite;
        }
        @keyframes scarabSpin {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }

        .center-glyphs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        .center-glyphs span {
          color: #D4AF37;
          font-size: 14px;
          text-shadow: 0 0 4px rgba(212,175,55,0.5);
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        .center-glyphs span:hover {
          opacity: 1;
          text-shadow: 0 0 12px rgba(212,175,55,0.9);
          transform: scale(1.3) rotateZ(10deg);
        }

        /* Knobs */
        .knob {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f0d060 15%, #D4AF37 40%, #b8940a 70%, #6b5a0f 100%);
          box-shadow: 
            0 0 16px rgba(212,175,55,0.9),
            0 0 24px rgba(212,175,55,0.5),
            inset -2px -2px 4px rgba(0,0,0,0.5),
            inset 2px 2px 4px rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .knob:hover {
          box-shadow: 
            0 0 24px rgba(212,175,55,1),
            0 0 40px rgba(212,175,55,0.7),
            inset -2px -2px 4px rgba(0,0,0,0.5),
            inset 2px 2px 4px rgba(255,255,255,0.6);
          transform: translateY(-50%) scale(1.3);
        }
        .knob-r { right: 10px; }
        .knob-l { left: 10px; }

        /* Center seam */
        .door-seam {
          width: 6px;
          height: 100vh;
          background: 
            linear-gradient(to bottom, 
              #FFD700 0%, 
              #D4AF37 50%,
              #FFD700 100%);
          position: relative;
          z-index: 5;
          flex-shrink: 0;
          box-shadow: 
            0 0 15px rgba(212,175,55,0.6),
            inset -1px 0 4px rgba(0,0,0,0.2),
            inset 1px 0 4px rgba(255,255,255,0.1);
          will-change: opacity;
        }
        .seam-glow {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(to right,
              transparent,
              rgba(212,175,55,0.4),
              transparent);
          filter: blur(6px);
          animation: seamGlow 2s ease-in-out infinite;
          will-change: opacity;
        }
        @keyframes seamGlow {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 0.8; }
        }

        /* Bottom step */
        .door-step {
          width: 100%;
          background: linear-gradient(to bottom, 
            rgba(212,175,55,0.2),
            rgba(42,31,8,0.9) 30%, 
            rgba(26,19,8,0.95));
          border: 2px solid #D4AF37;
          border-top: 3px solid #D4AF37;
          padding: 12px 8px;
          box-shadow: 
            inset 0 2px 8px rgba(212,175,55,0.4),
            0 8px 24px rgba(0,0,0,0.5);
        }
        .step-glyphs {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .step-glyphs span {
          color: #D4AF37;
          font-size: 14px;
          text-shadow: 0 0 4px rgba(212,175,55,0.5);
          opacity: 0.85;
          transition: all 0.3s ease;
        }
        .step-glyphs span:hover {
          opacity: 1;
          text-shadow: 0 0 8px rgba(212,175,55,0.9);
          transform: translateY(-2px);
        }

        /* ENTER button */
        .enter-button {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 48px;
          border: 1px solid rgba(212,175,55,0.6);
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
          transition: all 0.3s ease;
        }
        .enter-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(212,175,55,0.08);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .enter-button:hover::before { transform: scaleX(1); }
        .enter-button:hover {
          border-color: #D4AF37;
          box-shadow: 0 0 24px rgba(212,175,55,0.2);
        }
        .enter-glyph { font-size: 20px; }

        /* ── DOOR OPEN ANIMATION ── */
        .ds-open .panel-l,
        .ds-zoom .panel-l {
          transform-origin: left center;
          transform: perspective(800px) rotateY(-85deg);
        }
        .ds-open .panel-r,
        .ds-zoom .panel-r {
          transform-origin: right center;
          transform: perspective(800px) rotateY(85deg);
        }
        .ds-open .seam-glow,
        .ds-zoom .seam-glow {
          background: 
            linear-gradient(to right,
              transparent,
              rgba(212,175,55,1),
              transparent);
          filter: blur(16px);
          opacity: 1;
        }

        /* ── ZOOM ANIMATION ── */
        .ds-zoom .the-door {
          animation: zoomThrough 1.6s cubic-bezier(0.4,0,0.2,1) forwards;
          will-change: transform, opacity;
        }
        @keyframes zoomThrough {
          from { transform: scale(1); opacity: 1; }
          to   { transform: scale(10); opacity: 0; }
        }
        .ds-zoom .ds-bg {
          animation: bgFade 1.6s ease forwards;
        }
        @keyframes bgFade {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* Darkness overlay during zoom */
        .zoom-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 0;
          pointer-events: none;
        }
        .ds-zoom .zoom-overlay {
          animation: darkIn 1.6s ease 0.4s forwards;
        }
        @keyframes darkIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── TOTAL DARKNESS ── */
        .total-dark {
          position: fixed;
          inset: 0;
          background: #000;
          animation: finalOut 1.2s ease 0.3s forwards;
        }
        @keyframes finalOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EntryExperience;
