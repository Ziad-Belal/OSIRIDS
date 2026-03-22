import { useState } from 'react';

interface EntryExperienceProps {
  onComplete: () => void;
}

const EntryExperience = ({ onComplete }: EntryExperienceProps) => {
  const [phase, setPhase] = useState<'door' | 'open' | 'zoom' | 'darkness' | 'done'>('door');

  const handleEnter = () => {
    setPhase('open');
    setTimeout(() => setPhase('zoom'),     1800);
    setTimeout(() => setPhase('darkness'), 3200);
    setTimeout(() => { setPhase('done'); onComplete(); }, 4400);
  };

  if (phase === 'done') return null;

  return (
    <div className="entry-wrap">

      {/* ── DOOR SCENE ── */}
      {(phase === 'door' || phase === 'open' || phase === 'zoom') && (
        <div className={`door-scene ds-${phase}`}>

          {/* Dark atmospheric background */}
          <div className="ds-bg" />

          {/* Torches left & right */}
          <div className="torch torch-l"><div className="flame" /></div>
          <div className="torch torch-r"><div className="flame" /></div>

          {/* The Door */}
          <div className="the-door">

            {/* TOP PANEL — hieroglyphs bar */}
            <div className="door-top-bar">
              {['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐','𓊪','𓋴','𓌀','𓍿','𓎡','𓏏','𓐍','𓑁'].map((g,i) => (
                <span key={i}>{g}</span>
              ))}
            </div>

            {/* MAIN DOOR PANELS */}
            <div className="door-panels">

              {/* LEFT PANEL */}
              <div className="panel panel-l">
                {/* Hieroglyph border top */}
                <div className="panel-border-top">
                  {['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
                {/* Left column glyphs */}
                <div className="panel-col-left">
                  {['𓊪','𓋴','𓌀','𓍿','𓎡','𓏏','𓐍','𓑁','𓒀','𓓇'].map((g,i)=><span key={i}>{g}</span>)}
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
                    {['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯'].map((g,i)=><span key={i}>{g}</span>)}
                  </div>
                </div>
                {/* Right column glyphs */}
                <div className="panel-col-right">
                  {['𓒀','𓓇','𓔎','𓕍','𓖌','𓗋','𓘊','𓙉','𓚈','𓛇'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
                {/* Door knob */}
                <div className="knob knob-r" />
                {/* Hieroglyph border bottom */}
                <div className="panel-border-bottom">
                  {['𓈖','𓉐','𓊪','𓋴','𓌀','𓍿','𓎡','𓏏'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
              </div>

              {/* CENTER SEAM + glow */}
              <div className="door-seam">
                <div className="seam-glow" />
              </div>

              {/* RIGHT PANEL */}
              <div className="panel panel-r">
                <div className="panel-border-top">
                  {['𓑁','𓒀','𓓇','𓔎','𓕍','𓖌','𓗋','𓘊'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
                <div className="panel-col-left">
                  {['𓙉','𓚈','𓛇','𓜆','𓝅','𓞄','𓟃','𓠂','𓡁','𓢀'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
                <div className="panel-center">
                  <div className="ankh">☥</div>
                  <div className="door-text">IDS</div>
                  <div className="scarab">𓆣</div>
                  <div className="center-glyphs">
                    {['𓈖','𓉐','𓊪','𓋴','𓌀','𓍿'].map((g,i)=><span key={i}>{g}</span>)}
                  </div>
                </div>
                <div className="panel-col-right">
                  {['𓢀','𓣿','𓤾','𓥽','𓦼','𓧻','𓨺','𓩹','𓪸','𓫷'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
                <div className="knob knob-l" />
                <div className="panel-border-bottom">
                  {['𓊪','𓋴','𓌀','𓍿','𓎡','𓏏','𓐍','𓑁'].map((g,i)=><span key={i}>{g}</span>)}
                </div>
              </div>
            </div>

            {/* BOTTOM STEP */}
            <div className="door-step">
              <div className="step-glyphs">
                {['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐','𓊪','𓋴','𓌀','𓍿'].map((g,i)=><span key={i}>{g}</span>)}
              </div>
            </div>

            {/* ENTER button — only in door phase */}
            {phase === 'door' && (
              <button className="enter-button" onClick={handleEnter}>
                <span>ENTER</span>
                <span className="enter-glyph">𓂀</span>
              </button>
            )}
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
            radial-gradient(ellipse 60% 70% at 50% 60%, #1a1005 0%, #080500 50%, #020100 100%);
        }

        /* ── TORCHES ── */
        .torch {
          position: absolute;
          bottom: 30%;
          width: 12px;
          height: 60px;
          background: linear-gradient(to top, #3a2a10, #6b4c1e);
          border-radius: 2px;
          z-index: 2;
        }
        .torch-l { left: calc(50% - 260px); }
        .torch-r { right: calc(50% - 260px); }
        .flame {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
          background: radial-gradient(ellipse at 50% 100%, #ffaa00, #ff6600 40%, transparent 80%);
          border-radius: 50% 50% 30% 30%;
          animation: flicker 0.3s ease-in-out infinite alternate;
          filter: blur(1px);
        }
        @keyframes flicker {
          from { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
          to   { transform: translateX(-48%) scaleY(1.1) scaleX(0.9); opacity: 0.85; }
        }

        /* ── THE DOOR ── */
        .the-door {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: doorReveal 1.2s ease both;
          filter: drop-shadow(0 0 40px rgba(212,175,55,0.15));
        }
        @keyframes doorReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top hieroglyph bar */
        .door-top-bar {
          width: 100%;
          background: linear-gradient(to bottom, #2a1f08, #1a1308);
          border: 1px solid #D4AF37;
          border-bottom: none;
          padding: 6px 8px;
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .door-top-bar span {
          color: #D4AF37;
          font-size: 14px;
          opacity: 0.8;
        }

        /* Door panels container */
        .door-panels {
          display: flex;
          position: relative;
        }

        /* Individual panel */
        .panel {
          width: clamp(140px, 22vw, 220px);
          height: clamp(380px, 60vh, 560px);
          background: linear-gradient(135deg, #0d0a04 0%, #1a1408 30%, #0d0a04 60%, #120e05 100%);
          border: 1.5px solid #D4AF37;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Panel inner layout */
        .panel-border-top, .panel-border-bottom {
          position: absolute;
          left: 8px; right: 8px;
          display: flex;
          justify-content: space-around;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          padding: 3px;
        }
        .panel-border-top  { top: 8px; }
        .panel-border-bottom { bottom: 8px; }
        .panel-border-top span, .panel-border-bottom span {
          color: rgba(212,175,55,0.6);
          font-size: 10px;
        }

        .panel-col-left, .panel-col-right {
          position: absolute;
          top: 36px; bottom: 36px;
          width: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          background: rgba(212,175,55,0.05);
          border: 1px solid rgba(212,175,55,0.15);
        }
        .panel-col-left  { left: 8px; }
        .panel-col-right { right: 8px; }
        .panel-col-left span, .panel-col-right span {
          color: rgba(212,175,55,0.5);
          font-size: 10px;
        }

        /* Center content */
        .panel-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 40px 32px;
          z-index: 2;
        }

        .ankh {
          font-size: 32px;
          color: #D4AF37;
          filter: drop-shadow(0 0 8px rgba(212,175,55,0.6));
          animation: ankhPulse 3s ease-in-out infinite;
        }
        @keyframes ankhPulse {
          0%,100% { filter: drop-shadow(0 0 6px rgba(212,175,55,0.4)); }
          50%      { filter: drop-shadow(0 0 16px rgba(212,175,55,0.9)); }
        }

        /* OSIR / IDS text on door */
        .door-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 0.3em;
          text-shadow:
            0 0 20px rgba(212,175,55,0.8),
            0 0 40px rgba(212,175,55,0.4),
            0 2px 4px rgba(0,0,0,0.8);
        }

        .scarab {
          font-size: 24px;
          color: #D4AF37;
          opacity: 0.7;
        }

        .center-glyphs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }
        .center-glyphs span {
          color: rgba(212,175,55,0.35);
          font-size: 12px;
        }

        /* Knobs */
        .knob {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f0d060, #D4AF37 50%, #8a6e20);
          box-shadow: 0 0 8px rgba(212,175,55,0.6), inset 0 1px 2px rgba(255,255,255,0.3);
        }
        .knob-r { right: 10px; }
        .knob-l { left: 10px; }

        /* Center seam */
        .door-seam {
          width: 3px;
          height: clamp(380px, 60vh, 560px);
          background: linear-gradient(to bottom, #D4AF37, #8a6e20, #D4AF37);
          position: relative;
          z-index: 5;
          flex-shrink: 0;
        }
        .seam-glow {
          position: absolute;
          inset: 0;
          background: rgba(212,175,55,0.3);
          filter: blur(4px);
          animation: seamGlow 2s ease-in-out infinite;
        }
        @keyframes seamGlow {
          0%,100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }

        /* Bottom step */
        .door-step {
          width: 100%;
          background: linear-gradient(to bottom, #2a1f08, #1a1308);
          border: 1px solid #D4AF37;
          border-top: 2px solid #D4AF37;
          padding: 8px;
        }
        .step-glyphs {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .step-glyphs span {
          color: rgba(212,175,55,0.5);
          font-size: 12px;
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
          transform: perspective(600px) rotateY(-80deg);
        }
        .ds-open .panel-r,
        .ds-zoom .panel-r {
          transform-origin: right center;
          transform: perspective(600px) rotateY(80deg);
        }
        .ds-open .seam-glow,
        .ds-zoom .seam-glow {
          background: rgba(212,175,55,0.9);
          filter: blur(12px);
        }

        /* ── ZOOM ANIMATION ── */
        .ds-zoom .the-door {
          animation: zoomThrough 1.6s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes zoomThrough {
          from { transform: scale(1); opacity: 1; }
          to   { transform: scale(10); opacity: 0; }
        }
        .ds-zoom .ds-bg,
        .ds-zoom .torch {
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