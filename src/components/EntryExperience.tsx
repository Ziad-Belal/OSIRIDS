import { useState, useEffect } from 'react';

interface EntryExperienceProps {
  onComplete: () => void;
}

const GLYPHS_A = ['𓂀','𓃭','𓄿','𓅱','𓆣','𓇯','𓈖','𓉐','𓊪','𓋴','𓌀','𓍿','𓎡','𓏏','𓐍','𓑁','𓒀','𓓇','𓔎','𓕍'];
const GLYPHS_B = ['𓖌','𓗋','𓘊','𓙉','𓚈','𓛇','𓜆','𓝅','𓞄','𓟃','𓠂','𓡁','𓢀','𓣿','𓤾','𓥽','𓦼','𓧻','𓨺','𓩹'];
const GLYPHS_C = ['𓀀','𓀁','𓀂','𓀃','𓀄','𓀅','𓀆','𓀇','𓀈','𓀉','𓀊','𓀋','𓁀','𓁁','𓁂','𓁃','𓁄','𓁅','𓁆','𓁇'];
const GLYPHS_D = ['𓂋','𓂌','𓂍','𓂎','𓂏','𓂐','𓂑','𓂒','𓂓','𓂔','𓃀','𓃁','𓃂','𓃃','𓃄','𓃅','𓃆','𓃇','𓃈','𓃉'];

const rep = (arr: string[], n: number) =>
  Array.from({ length: n }, (_, i) => arr[i % arr.length]);

const EntryExperience = ({ onComplete }: EntryExperienceProps) => {
  const [phase, setPhase] = useState<'door' | 'open' | 'zoom' | 'darkness' | 'done'>('door');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('open'),     1200);
    const t2 = setTimeout(() => setPhase('zoom'),     3000);
    const t3 = setTimeout(() => setPhase('darkness'), 4600);
    const t4 = setTimeout(() => { setPhase('done'); onComplete(); }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  if (phase === 'done') return null;

  const BorderRow = ({ glyphs, n }: { glyphs: string[]; n: number }) => (
    <>{rep(glyphs, n).map((g, i) => <span key={i}>{g}</span>)}</>
  );

  return (
    <div className="oe-root">
      {(phase === 'door' || phase === 'open' || phase === 'zoom') && (
        <div className={`oe-scene oe-${phase}`}>
          <div className="oe-bg" />

          <div className="oe-door">

            {/* ══ LEFT PANEL ══ */}
            <div className="oe-panel oe-panel-l">
              <div className="oe-border-top">
                <BorderRow glyphs={GLYPHS_A} n={24} />
              </div>
              <div className="oe-middle">
                <div className="oe-col-left">
                  <BorderRow glyphs={GLYPHS_B} n={28} />
                </div>
                <div className="oe-center-area">
                  <div className="oe-inner-frame">
                    <div className="oe-inner-top-row">
                      <BorderRow glyphs={GLYPHS_C} n={8} />
                    </div>
                    <div className="oe-content">
                      <div className="oe-ankh">☥</div>
                      <div className="oe-word">OSIR</div>
                      <div className="oe-mini-glyphs">
                        <BorderRow glyphs={GLYPHS_D} n={10} />
                      </div>
                      <div className="oe-scarab">𓆣</div>
                      <div className="oe-mini-glyphs">
                        <BorderRow glyphs={GLYPHS_A} n={8} />
                      </div>
                    </div>
                    <div className="oe-inner-bottom-row">
                      <BorderRow glyphs={GLYPHS_C} n={8} />
                    </div>
                  </div>
                </div>
                <div className="oe-col-right">
                  <BorderRow glyphs={GLYPHS_C} n={28} />
                </div>
              </div>
              <div className="oe-border-bottom">
                <BorderRow glyphs={GLYPHS_B} n={24} />
              </div>
              <div className="oe-knob oe-knob-r"><span>𓆣</span></div>
            </div>

            {/* ══ SEAM ══ */}
            <div className="oe-seam"><div className="oe-seam-glow" /></div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="oe-panel oe-panel-r">
              <div className="oe-border-top">
                <BorderRow glyphs={GLYPHS_B} n={24} />
              </div>
              <div className="oe-middle">
                <div className="oe-col-left">
                  <BorderRow glyphs={GLYPHS_D} n={28} />
                </div>
                <div className="oe-center-area">
                  <div className="oe-inner-frame">
                    <div className="oe-inner-top-row">
                      <BorderRow glyphs={GLYPHS_D} n={8} />
                    </div>
                    <div className="oe-content">
                      <div className="oe-ankh">☥</div>
                      <div className="oe-word">IDS</div>
                      <div className="oe-mini-glyphs">
                        <BorderRow glyphs={GLYPHS_C} n={10} />
                      </div>
                      <div className="oe-scarab">𓆣</div>
                      <div className="oe-mini-glyphs">
                        <BorderRow glyphs={GLYPHS_B} n={8} />
                      </div>
                    </div>
                    <div className="oe-inner-bottom-row">
                      <BorderRow glyphs={GLYPHS_D} n={8} />
                    </div>
                  </div>
                </div>
                <div className="oe-col-right">
                  <BorderRow glyphs={GLYPHS_A} n={28} />
                </div>
              </div>
              <div className="oe-border-bottom">
                <BorderRow glyphs={GLYPHS_A} n={24} />
              </div>
              <div className="oe-knob oe-knob-l"><span>𓆣</span></div>
            </div>
          </div>

          <div className="oe-overlay" />
        </div>
      )}

      {phase === 'darkness' && <div className="oe-total-dark" />}

      <style>{`
        .oe-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #000; overflow: hidden;
        }

        .oe-scene {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          animation: oeFadeIn 0.6s ease both;
        }
        @keyframes oeFadeIn { from{opacity:0} to{opacity:1} }

        .oe-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 120% 120% at 50% 50%, #0c0800 0%, #000 65%);
        }

        /* ── DOOR ── */
        .oe-door {
          position: relative; z-index: 2;
          display: flex;
          width: 100vw; height: 100vh;
        }

        /* ── PANELS ── */
        .oe-panel {
          flex: 1;
          display: flex; flex-direction: column;
          background: #080600;
          position: relative;
          transition: transform 1.6s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        .oe-panel-l { transform-origin: left center; }
        .oe-panel-r { transform-origin: right center; }

        .oe-open .oe-panel-l,
        .oe-zoom  .oe-panel-l { transform: perspective(1600px) rotateY(-88deg); }
        .oe-open .oe-panel-r,
        .oe-zoom  .oe-panel-r { transform: perspective(1600px) rotateY(88deg); }

        /* ── TOP / BOTTOM BORDERS ── */
        .oe-border-top, .oe-border-bottom {
          width: 100%;
          display: flex; flex-wrap: wrap;
          justify-content: center; align-items: center;
          gap: 1px; padding: 5px 3px;
          background: #110e00;
          flex-shrink: 0;
        }
        .oe-border-top  { border-top: 2.5px solid #D4AF37; border-bottom: 1px solid rgba(212,175,55,0.35); }
        .oe-border-bottom { border-bottom: 2.5px solid #D4AF37; border-top: 1px solid rgba(212,175,55,0.35); }
        .oe-border-top span, .oe-border-bottom span {
          color: #D4AF37;
          font-size: clamp(9px, 1.5vw, 17px);
          line-height: 1; opacity: 0.85;
          text-shadow: 0 0 4px rgba(212,175,55,0.4);
        }

        /* ── MIDDLE ── */
        .oe-middle { flex: 1; display: flex; min-height: 0; }

        /* ── SIDE COLUMNS ── */
        .oe-col-left, .oe-col-right {
          width: clamp(20px, 3vw, 46px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: space-around;
          padding: 6px 1px;
          flex-shrink: 0; overflow: hidden;
          gap: 1px;
          background: #0e0b00;
        }
        .oe-col-left  { border-right: 1.5px solid rgba(212,175,55,0.5); }
        .oe-col-right { border-left:  1.5px solid rgba(212,175,55,0.5); }
        .oe-col-left span, .oe-col-right span {
          color: #D4AF37;
          font-size: clamp(8px, 1.3vw, 15px);
          line-height: 1; opacity: 0.75;
          text-align: center;
        }

        /* ── CENTER AREA ── */
        .oe-center-area {
          flex: 1; display: flex;
          align-items: stretch; justify-content: stretch;
          padding: clamp(8px, 1.5vw, 20px);
          min-width: 0;
        }

        /* ── INNER FRAME ── */
        .oe-inner-frame {
          flex: 1;
          border: 1.5px solid rgba(212,175,55,0.3);
          display: flex; flex-direction: column;
          background: rgba(212,175,55,0.02);
        }

        .oe-inner-top-row, .oe-inner-bottom-row {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 2px;
          padding: 4px 3px;
          background: rgba(212,175,55,0.05);
          flex-shrink: 0;
        }
        .oe-inner-top-row  { border-bottom: 1px solid rgba(212,175,55,0.2); }
        .oe-inner-bottom-row { border-top: 1px solid rgba(212,175,55,0.2); }
        .oe-inner-top-row span, .oe-inner-bottom-row span {
          color: rgba(212,175,55,0.55);
          font-size: clamp(7px, 1.1vw, 13px);
        }

        /* ── CONTENT ── */
        .oe-content {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: clamp(6px, 1.8vh, 22px);
          padding: clamp(10px, 2vh, 28px) 8px;
        }

        .oe-ankh {
          font-size: clamp(24px, 4.5vw, 60px);
          color: #D4AF37; line-height: 1;
          text-shadow: 0 0 14px rgba(212,175,55,0.7);
          animation: ankhPulse 3s ease-in-out infinite;
        }
        @keyframes ankhPulse {
          0%,100% { text-shadow: 0 0 8px rgba(212,175,55,0.5); }
          50%      { text-shadow: 0 0 22px rgba(212,175,55,1), 0 0 44px rgba(212,175,55,0.4); }
        }

        .oe-word {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 5.5vw, 76px);
          font-weight: 700; color: #D4AF37;
          letter-spacing: 0.18em; line-height: 1;
          text-shadow: 0 0 18px rgba(212,175,55,0.9), 0 0 36px rgba(212,175,55,0.4), 0 2px 6px rgba(0,0,0,0.9);
        }

        .oe-mini-glyphs {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 3px;
        }
        .oe-mini-glyphs span {
          color: rgba(212,175,55,0.45);
          font-size: clamp(9px, 1.4vw, 16px);
        }

        .oe-scarab {
          font-size: clamp(18px, 2.8vw, 36px);
          color: #D4AF37; opacity: 0.75; line-height: 1;
        }

        /* ── KNOBS ── */
        .oe-knob {
          position: absolute; top: 50%;
          transform: translateY(-50%); z-index: 10;
        }
        .oe-knob-r { right: clamp(5px, 1.2vw, 18px); }
        .oe-knob-l { left:  clamp(5px, 1.2vw, 18px); }
        .oe-knob span {
          display: flex; align-items: center; justify-content: center;
          width: clamp(18px, 2.8vw, 36px);
          height: clamp(18px, 2.8vw, 36px);
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ffe070, #D4AF37 55%, #8a6e20);
          box-shadow: 0 0 10px rgba(212,175,55,0.8), 0 3px 10px rgba(0,0,0,0.8);
          font-size: clamp(7px, 1.1vw, 13px);
          color: #3a2a00;
          animation: knobGlow 2s ease-in-out infinite;
        }
        @keyframes knobGlow {
          0%,100% { box-shadow: 0 0 8px rgba(212,175,55,0.6), 0 3px 10px rgba(0,0,0,0.8); }
          50%      { box-shadow: 0 0 18px rgba(212,175,55,1),   0 3px 10px rgba(0,0,0,0.8); }
        }

        /* ── SEAM ── */
        .oe-seam {
          width: clamp(2px, 0.35vw, 5px);
          background: linear-gradient(to bottom, #D4AF37, #8a6e20 50%, #D4AF37);
          position: relative; z-index: 5; flex-shrink: 0;
        }
        .oe-seam-glow {
          position: absolute; inset: 0;
          background: rgba(212,175,55,0.35);
          filter: blur(3px);
          animation: seamPulse 2s ease-in-out infinite;
          transition: all 1.6s ease;
        }
        @keyframes seamPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .oe-open .oe-seam-glow,
        .oe-zoom  .oe-seam-glow {
          background: rgba(212,175,55,0.9); filter: blur(14px);
        }

        /* ── ZOOM ── */
        .oe-zoom .oe-door { animation: oeZoom 1.6s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }
        @keyframes oeZoom { from{transform:scale(1);opacity:1} to{transform:scale(7);opacity:0} }
        .oe-zoom .oe-bg { animation: oeBgFade 1.6s ease forwards; }
        @keyframes oeBgFade { from{opacity:1} to{opacity:0} }

        /* ── DARK OVERLAY ── */
        .oe-overlay {
          position: absolute; inset: 0; background: #000;
          opacity: 0; pointer-events: none; z-index: 10;
        }
        .oe-zoom .oe-overlay { animation: oeDarkIn 1.6s ease 0.3s forwards; }
        @keyframes oeDarkIn { from{opacity:0} to{opacity:1} }

        /* ── TOTAL DARK ── */
        .oe-total-dark {
          position: fixed; inset: 0; background: #000;
          animation: oeTotalOut 1.2s ease 0.2s forwards;
        }
        @keyframes oeTotalOut { from{opacity:1} to{opacity:0} }
      `}</style>
    </div>
  );
};

export default EntryExperience;