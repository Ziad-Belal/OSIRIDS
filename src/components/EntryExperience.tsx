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
    const t1 = setTimeout(() => setPhase('open'),     1800);
    const t2 = setTimeout(() => setPhase('zoom'),     3800);
    const t3 = setTimeout(() => setPhase('darkness'), 5200);
    const t4 = setTimeout(() => { setPhase('done'); onComplete(); }, 6400);
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
          
          <div className="oe-god-rays" />
          <div className="oe-volumetric-glow" />

          {/* Floating dust motes illuminated by the door flare */}
          <div className="oe-dust-container">
            <div className="oe-mote oe-mote-1" />
            <div className="oe-mote oe-mote-2" />
            <div className="oe-mote oe-mote-3" />
            <div className="oe-mote oe-mote-4" />
          </div>

          <div className="oe-viewport">
            <div className="oe-door-container">

              {/* ══ LEFT HINGE UNIT (rotates as one 3D piece) ══ */}
              <div className="oe-hinge oe-hinge-l">
                {/* Front face */}
                <div className="oe-panel oe-panel-l">
                  <div className="oe-stone-texture" />
                  <div className="oe-stone-erosion" />
                  <div className="oe-bg-carvings">
                    <BorderRow glyphs={GLYPHS_A.concat(GLYPHS_B)} n={150} />
                  </div>
                  <div className="oe-border-top">
                    <BorderRow glyphs={GLYPHS_A} n={40} />
                  </div>
                  <div className="oe-middle">
                    <div className="oe-col-left"><BorderRow glyphs={GLYPHS_B} n={40} /></div>
                    <div className="oe-col-left oe-col-extra"><BorderRow glyphs={GLYPHS_D} n={40} /></div>
                    <div className="oe-center-area">
                      <div className="oe-inner-frame">
                        <div className="oe-inner-top-row"><BorderRow glyphs={GLYPHS_C} n={16} /></div>
                        <div className="oe-content">
                          <div className="oe-ankh">☥</div>
                          <div className="oe-word">OSIR</div>
                          <div className="oe-heavy-glyphs"><BorderRow glyphs={GLYPHS_D} n={24} /></div>
                          <div className="oe-scarab">𓆣</div>
                          <div className="oe-heavy-glyphs"><BorderRow glyphs={GLYPHS_A} n={24} /></div>
                        </div>
                        <div className="oe-inner-bottom-row"><BorderRow glyphs={GLYPHS_C} n={16} /></div>
                      </div>
                    </div>
                    <div className="oe-col-right oe-col-extra"><BorderRow glyphs={GLYPHS_A} n={40} /></div>
                    <div className="oe-col-right"><BorderRow glyphs={GLYPHS_C} n={40} /></div>
                  </div>
                  <div className="oe-border-bottom"><BorderRow glyphs={GLYPHS_B} n={40} /></div>
                  <div className="oe-knob oe-knob-r"><span>𓆣</span></div>
                  <div className="oe-light-bloom-l" />
                </div>
                {/* Real 3D stone-slab side-face — inner edge visible when door swings open */}
                <div className="oe-edge oe-edge-l" />
              </div>

              {/* ══ DYNAMIC SEAM ══ */}
              <div className="oe-seam"><div className="oe-seam-glow" /></div>

              {/* ══ RIGHT HINGE UNIT ══ */}
              <div className="oe-hinge oe-hinge-r">
                {/* Front face */}
                <div className="oe-panel oe-panel-r">
                  <div className="oe-stone-texture" />
                  <div className="oe-stone-erosion" />
                  <div className="oe-bg-carvings">
                    <BorderRow glyphs={GLYPHS_C.concat(GLYPHS_D)} n={150} />
                  </div>
                  <div className="oe-border-top"><BorderRow glyphs={GLYPHS_B} n={40} /></div>
                  <div className="oe-middle">
                    <div className="oe-col-left"><BorderRow glyphs={GLYPHS_D} n={40} /></div>
                    <div className="oe-col-left oe-col-extra"><BorderRow glyphs={GLYPHS_B} n={40} /></div>
                    <div className="oe-center-area">
                      <div className="oe-inner-frame">
                        <div className="oe-inner-top-row"><BorderRow glyphs={GLYPHS_D} n={16} /></div>
                        <div className="oe-content">
                          <div className="oe-ankh">☥</div>
                          <div className="oe-word">IDS</div>
                          <div className="oe-heavy-glyphs"><BorderRow glyphs={GLYPHS_C} n={24} /></div>
                          <div className="oe-scarab">𓆣</div>
                          <div className="oe-heavy-glyphs"><BorderRow glyphs={GLYPHS_B} n={24} /></div>
                        </div>
                        <div className="oe-inner-bottom-row"><BorderRow glyphs={GLYPHS_D} n={16} /></div>
                      </div>
                    </div>
                    <div className="oe-col-right oe-col-extra"><BorderRow glyphs={GLYPHS_C} n={40} /></div>
                    <div className="oe-col-right"><BorderRow glyphs={GLYPHS_A} n={40} /></div>
                  </div>
                  <div className="oe-border-bottom"><BorderRow glyphs={GLYPHS_A} n={40} /></div>
                  <div className="oe-knob oe-knob-l"><span>𓆣</span></div>
                  <div className="oe-light-bloom-r" />
                </div>
                {/* Real 3D stone-slab side-face */}
                <div className="oe-edge oe-edge-r" />
              </div>

            </div>
          </div>

          <div className="oe-lens-shadow" />
          <div className="oe-overlay" />
        </div>
      )}

      {phase === 'darkness' && <div className="oe-total-dark" />}

      <style>{`
        .oe-root {
          position: fixed; inset: 0; z-index: 99999;
          background: #020100; overflow: hidden;
          font-family: 'Playfair Display', Georgia, serif;
        }

        .oe-scene {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          animation: oeFadeIn 2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes oeFadeIn { from{opacity:0} to{opacity:1} }

        .oe-bg {
          position: absolute; inset: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, #000 65%),
            linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
            repeating-linear-gradient(45deg, #050505 0px, #050505 2px, #000 2px, #000 4px);
          background-blend-mode: multiply, normal, normal;
          opacity: 0.98;
        }

        /* Cinematic God Rays flaring */
        .oe-god-rays {
          position: absolute; width: 300vw; height: 300vh;
          background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,200,90,0.05) 15deg, transparent 30deg, rgba(255,200,90,0.05) 45deg, transparent 60deg);
          animation: spinRays 45s linear infinite;
          mix-blend-mode: screen; pointer-events: none;
          opacity: 0.3; transition: opacity 1.5s ease;
        }
        @keyframes spinRays { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .oe-open .oe-god-rays, .oe-zoom .oe-god-rays { opacity: 1; }

        /* Powerful glow bursting when the doors open */
        .oe-volumetric-glow {
          position: absolute; width: 100vw; height: 100vh;
          background: radial-gradient(circle at 50% 50%, rgba(255,210,110,0.7) 0%, rgba(212,175,55,0.1) 40%, transparent 70%);
          mix-blend-mode: screen; pointer-events: none;
          opacity: 0; transform: scale(0.1);
          transition: transform 1.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s ease;
          z-index: 1;
        }
        .oe-open .oe-volumetric-glow, .oe-zoom .oe-volumetric-glow { opacity: 1; transform: scale(1.6); }

        /* Floating dust particles reacting to the scene lighting */
        .oe-dust-container {
          position: absolute; inset: 0; z-index: 3;
          pointer-events: none; opacity: 0;
          transition: opacity 2s ease 0.5s;
        }
        .oe-open .oe-dust-container, .oe-zoom .oe-dust-container { opacity: 0.7; }
        
        .oe-mote {
          position: absolute; border-radius: 50%;
          background: #fff; filter: blur(1px);
          animation: floatMote 8s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .oe-mote-1 { width: 4px; height: 4px; top: 30%; left: 40%; animation-delay: 0s; }
        .oe-mote-2 { width: 2px; height: 2px; top: 60%; left: 45%; animation-delay: 1s; opacity: 0.5; }
        .oe-mote-3 { width: 5px; height: 5px; top: 40%; left: 55%; animation-delay: 2s; }
        .oe-mote-4 { width: 3px; height: 3px; top: 70%; left: 52%; animation-delay: 0.5s; }

        @keyframes floatMote {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }

        .oe-viewport {
          position: relative; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          perspective: 900px;
          perspective-origin: 50% 50%;
        }

        .oe-door-container {
          position: relative; display: flex;
          width: 100vw; height: 100vh;
          transform-style: preserve-3d;
          animation: cameraCreep 3.5s cubic-bezier(0.1, 0.1, 0.2, 1) forwards;
        }
        @keyframes cameraCreep {
          0% { transform: scale(0.95) translateZ(-60px); }
          100% { transform: scale(1) translateZ(0px); }
        }

        /* ══ HINGE UNIT — the 3D rotating shell for each door half ══ */
        .oe-hinge {
          flex: 1; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 2.5s cubic-bezier(0.65, 0, 0.15, 1);
        }
        .oe-hinge-l { transform-origin: left center; }
        .oe-hinge-r { transform-origin: right center; }

        /* Rotate the whole hinge unit — front face + edge face swing together */
        .oe-open .oe-hinge-l,
        .oe-zoom .oe-hinge-l { transform: rotateY(-88deg); }
        .oe-open .oe-hinge-r,
        .oe-zoom .oe-hinge-r { transform: rotateY(88deg); }

        /* ── FRONT FACE (fills the hinge) ── */
        .oe-panel {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          background: #0d0a06;
          overflow: hidden;
          box-shadow: 
            inset 0 0 100px rgba(0,0,0,1),
            inset 0 0 40px rgba(0,0,0,0.8),
            inset -5px 0 15px rgba(0,0,0,0.7),
            inset 5px 0 15px rgba(255,255,255,0.03);
        }

        /* ══ REAL 3D STONE SLAB SIDE FACES ══
           The edge div lives in the same transform-style:preserve-3d container as the front face.
           It is translated to the hinge edge then rotated 90° to stand perpendicular. */
        .oe-edge {
          position: absolute;
          top: 0; height: 100%;
          width: 70px;                 /* stone thickness */
          background:
            linear-gradient(to bottom,
              rgba(255,215,90,0.07) 0%,
              transparent 8%,
              transparent 92%,
              rgba(0,0,0,0.5) 100%
            ),
            linear-gradient(to right, #2e2010 0%, #1a1008 30%, #0c0906 70%, #070504 100%);
          /* Horizontal strata cracks */
          background-image:
            repeating-linear-gradient(
              to bottom,
              transparent 0px, transparent 34px,
              rgba(0,0,0,0.25) 34px, rgba(0,0,0,0.25) 35px,
              transparent 35px, transparent 68px,
              rgba(255,255,255,0.02) 68px, rgba(255,255,255,0.02) 69px
            );
          box-shadow:
            inset -8px 0 20px rgba(0,0,0,0.9),
            inset 3px 0 10px rgba(255,200,80,0.04),
            inset 0 0 40px rgba(0,0,0,0.7);
        }

        /* LEFT door: edge is at the RIGHT side of the panel (inner face, hinge side toward center) */
        .oe-edge-l {
          /* Position at the right edge of the hinge, pivot around that edge */
          right: 0;
          transform-origin: right center;
          transform: rotateY(-90deg);
        }

        /* RIGHT door: edge is at the LEFT side of the panel */
        .oe-edge-r {
          left: 0;
          transform-origin: left center;
          transform: rotateY(90deg);
        }

        /* Deep, chaotic chiseled rock texturing */
        .oe-stone-texture {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3Font filter='url(%23n)'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.99' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E");
          pointer-events: none; mix-blend-mode: overlay;
        }

        /* Fake randomized rock fissures and deep weather cracks */
        .oe-stone-erosion {
          position: absolute; inset: 0; opacity: 0.15;
          background-image: 
            linear-gradient(45deg, transparent 40%, #fff 41%, #000 42%, transparent 44%),
            linear-gradient(-35deg, transparent 60%, #fff 61%, #000 62%, transparent 64%);
          mix-blend-mode: overlay; pointer-events: none;
        }

        .oe-panel-l { border-right: 2px solid rgba(0,0,0,1); }
        .oe-panel-r { border-left: 1px solid rgba(255,255,255,0.01); }

        .oe-light-bloom-l, .oe-light-bloom-r {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0; transition: opacity 1.5s ease 0.3s;
          mix-blend-mode: screen;
        }
        .oe-light-bloom-l { background: linear-gradient(to left, rgba(255,190,80,0.25), transparent 20%); }
        .oe-light-bloom-r { background: linear-gradient(to right, rgba(255,190,80,0.25), transparent 20%); }
        .oe-open .oe-light-bloom-l, .oe-open .oe-light-bloom-r,
        .oe-zoom .oe-light-bloom-l, .oe-zoom .oe-light-bloom-r { opacity: 1; }

        /* 3D CARVED BACKGROUNDS (Illuminated Edge Technique) */
        .oe-bg-carvings {
          position: absolute; inset: 0;
          display: flex; flex-wrap: wrap;
          align-content: flex-start; justify-content: center;
          gap: 15px; padding: 40px;
          opacity: 0.3; mix-blend-mode: overlay;
          pointer-events: none; filter: blur(0.5px);
        }
        .oe-bg-carvings span { 
          font-size: clamp(20px, 4vw, 50px); 
          color: #110d06; /* Cut center */
          /* Cast hard shadow top-left and white light strike bottom-right to simulate depth */
          text-shadow: 
            1px 1px 1px rgba(255, 235, 170, 0.4), 
            -1px -1px 1px rgba(0, 0, 0, 0.9);
        }

        /* ── COMPLEX AGED GOLD SLAB BORDERS ── */
        .oe-border-top, .oe-border-bottom {
          width: 100%; display: flex; flex-wrap: wrap;
          justify-content: center; align-items: center;
          gap: 2px; padding: clamp(10px, 1.5vh, 20px) 5px;
          background: linear-gradient(180deg, #0a0805 0%, #010100 100%);
          flex-shrink: 0; 
          box-shadow: 
            0 10px 25px rgba(0,0,0,0.85),
            inset 0 1px 0 rgba(255,255,255,0.03);
          z-index: 2;
        }
        .oe-border-top { 
          border-top: 3px solid #D4AF37; 
          border-bottom: 1px solid #110d06;
          border-image: linear-gradient(to right, #382905, #D4AF37, #fffbf0, #D4AF37, #382905) 1;
        }
        .oe-border-bottom { 
          border-bottom: 3px solid #D4AF37; 
          border-top: 1px solid #110d06;
          border-image: linear-gradient(to right, #382905, #D4AF37, #fffbf0, #D4AF37, #382905) 1;
        }
        
        .oe-border-top span, .oe-border-bottom span {
          color: #fff;
          font-size: clamp(10px, 1.4vw, 17px);
          line-height: 1;
          background: linear-gradient(to bottom, #ffffff 0%, #ffd452 40%, #876508 80%, #171101 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.95));
        }

        /* ── MIDDLE GRID ── */
        .oe-middle { flex: 1; display: flex; min-height: 0; z-index: 2; }

        /* ── SIDE GLYPH COLUMNS (Tactile carved cuts) ── */
        .oe-col-left, .oe-col-right {
          width: clamp(15px, 2vw, 35px); display: flex; flex-direction: column;
          align-items: center; justify-content: space-around;
          padding: 10px 1px; flex-shrink: 0; overflow: hidden;
          gap: 2px; background: #050402;
          box-shadow: 
            inset 2px 0 5px rgba(0,0,0,0.95),
            inset -2px 0 5px rgba(0,0,0,0.95);
        }
        .oe-col-left  { border-right: 1px solid rgba(255,255,255,0.01); }
        .oe-col-right { border-left:  1px solid rgba(0,0,0,1); }
        
        .oe-col-extra { background: #030201; }
        
        .oe-col-left span, .oe-col-right span {
          color: #1a150c; font-size: clamp(8px, 1.1vw, 13px);
          line-height: 1; opacity: 0.85;
          /* Making the narrow column glyphs highly visible and 3D */
          text-shadow: 
            1px 1px 0px rgba(255, 230, 160, 0.3),
            -1px -1px 0px rgba(0, 0, 0, 0.95);
        }

        /* ── CENTER AREA ── */
        .oe-center-area {
          flex: 1; display: flex; align-items: stretch; justify-content: stretch;
          padding: clamp(10px, 2vw, 30px); min-width: 0;
          background: rgba(0, 0, 0, 0.45);
        }

        /* ── INSET INNER FRAME (Recessed Dimension) ── */
        .oe-inner-frame {
          flex: 1; border: 1px solid #0a0805;
          display: flex; flex-direction: column;
          background: linear-gradient(145deg, #050403 0%, #000000 100%);
          /* Strong inner shadows simulate a heavy 3D recess in the rock */
          box-shadow: 
            inset 0 15px 40px rgba(0,0,0,1),
            inset 0 -15px 40px rgba(0,0,0,1),
            0 5px 25px rgba(0,0,0,0.9),
            inset 0 0 2px rgba(255,255,255,0.03);
        }

        .oe-inner-top-row, .oe-inner-bottom-row {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: clamp(2px, 0.5vw, 6px); padding: clamp(6px, 1vh, 12px) 5px;
          background: rgba(0,0,0,0.6); flex-shrink: 0;
        }
        .oe-inner-top-row  { border-bottom: 1px solid rgba(255,255,255,0.01); }
        .oe-inner-bottom-row { border-top: 1px solid rgba(0,0,0,0.9); }
        
        .oe-inner-top-row span, .oe-inner-bottom-row span {
          color: #1a140b; font-size: clamp(8px, 1.1vw, 12px);
          text-shadow: 
            1px 1px 0px rgba(255, 235, 170, 0.25), 
            -1px -1px 0px rgba(0, 0, 0, 0.9);
        }

        /* ── MAIN CONTENT ── */
        .oe-content {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: clamp(10px, 2vh, 25px);
          padding: clamp(10px, 2.5vh, 25px) 10px;
        }

        .oe-ankh {
          font-size: clamp(30px, 5vw, 65px); line-height: 1;
          background: linear-gradient(to bottom, #ffffff 0%, #ffd452 30%, #7a5d05 70%, #171101 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 10px rgba(0,0,0,1));
          animation: ankhPulse 2s ease-in-out infinite;
        }
        @keyframes ankhPulse {
          0%,100% { filter: drop-shadow(0 2px 10px rgba(0,0,0,1)); }
          50%      { filter: drop-shadow(0 2px 10px rgba(0,0,0,1)) drop-shadow(0 0 20px rgba(212,175,55,0.3)); }
        }

        .oe-word {
          font-size: clamp(30px, 6vw, 75px); font-weight: 800;
          letter-spacing: 0.2em; line-height: 1;
          background: linear-gradient(to bottom, #ffffff 0%, #ffdf73 30%, #705202 75%, #171101 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 5px 8px rgba(0,0,0,1));
        }

        /* HIGH-VISIBILITY HEAVY GLYPHS */
        .oe-heavy-glyphs {
          display: flex; flex-wrap: wrap; justify-content: center; 
          gap: 2px; max-width: 80%;
        }
        .oe-heavy-glyphs span { 
          color: #241d10; /* Cut fill */
          font-size: clamp(10px, 1.4vw, 14px); 
          font-weight: bold;
          /* Strongest chiseled strike on active grid elements */
          text-shadow: 
            1px 1.5px 0.5px rgba(255, 230, 160, 0.45), 
            -1px -1px 0.5px rgba(0, 0, 0, 0.95);
        }

        .oe-scarab {
          font-size: clamp(20px, 3.5vw, 30px); line-height: 1;
          background: linear-gradient(to bottom, #ffd452, #402f02);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          opacity: 0.5;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,1));
        }

        /* ── FORGED DOOR KNOBS ── */
        .oe-knob {
          position: absolute; top: 50%;
          transform: translateY(-50%); z-index: 10;
        }
        .oe-knob-r { right: clamp(10px, 1.5vw, 25px); }
        .oe-knob-l { left:  clamp(10px, 1.5vw, 25px); }
        
        .oe-knob span {
          display: flex; align-items: center; justify-content: center;
          width: clamp(25px, 3.5vw, 45px); height: clamp(25px, 3.5vw, 45px);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #ffd452 20%, #705202 60%, #0d0a03 100%);
          box-shadow: 
            0 15px 35px rgba(0,0,0,1),
            inset 0 2px 3px rgba(255,255,255,0.7),
            inset 0 -5px 10px rgba(0,0,0,1);
          font-size: clamp(10px, 1.3vw, 15px); color: #0a0701;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4);
          animation: knobGlow 2s ease-in-out infinite;
        }
        @keyframes knobGlow {
          0%,100% { filter: drop-shadow(0 0 5px rgba(212,175,55,0.1)); }
          50%      { filter: drop-shadow(0 0 15px rgba(212,175,55,0.4)); }
        }

        /* ── SEAM ── */
        .oe-seam {
          width: 2px; position: relative; z-index: 5; flex-shrink: 0;
          background: linear-gradient(to bottom, #110d04, #ffdf73 50%, #110d04);
        }
        .oe-seam-glow {
          position: absolute; inset: -5px -15px;
          background: radial-gradient(ellipse at center, rgba(255,200,90,0.6) 0%, rgba(212,175,55,0) 75%);
          mix-blend-mode: screen; animation: seamPulse 1.5s ease-in-out infinite;
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes seamPulse { 0%,100%{opacity:0.3; transform: scaleX(0.8);} 50%{opacity:0.8; transform: scaleX(1.3);} }
        
        .oe-open .oe-seam-glow, .oe-zoom .oe-seam-glow {
          background: radial-gradient(ellipse at center, rgba(255,225,150,1) 0%, rgba(255,190,80,0) 70%);
          transform: scaleX(12);
        }

        /* Dark focal vignette framing the center */
        .oe-lens-shadow {
          position: absolute; inset: 0; pointer-events: none; z-index: 15;
          background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.92) 95%);
          mix-blend-mode: multiply;
        }

        /* CINEMATIC CAMERA ZOOM THROUGH */
        .oe-zoom .oe-door-container { 
          animation: oeZoom 1.4s cubic-bezier(0.7, 0, 0.15, 1) forwards; 
        }
        @keyframes oeZoom { 
          0% { transform: scale(1) translateZ(0); filter: blur(0px); opacity: 1; } 
          40% { filter: blur(5px); }
          100% { transform: scale(6) translateZ(900px); filter: blur(30px); opacity: 0; } 
        }
        
        .oe-zoom .oe-bg { animation: oeBgFade 1.4s ease forwards; }
        @keyframes oeBgFade { from{opacity:0.98} to{opacity:0} }

        .oe-overlay {
          position: absolute; inset: 0; background: #000;
          opacity: 0; pointer-events: none; z-index: 20;
        }
        .oe-zoom .oe-overlay { animation: oeDarkIn 1.2s ease 0.2s forwards; }
        @keyframes oeDarkIn { from{opacity:0} to{opacity:1} }

        .oe-total-dark {
          position: fixed; inset: 0; background: #000;
          animation: oeTotalOut 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          z-index: 100000;
        }
        @keyframes oeTotalOut { from{opacity:1} to{opacity:0} }

        @media (max-width: 768px) {
          .oe-viewport { perspective: 800px; }
          .oe-content { gap: clamp(10px, 3vh, 20px); }
          .oe-ankh { font-size: 40px; }
          .oe-word { font-size: 34px; letter-spacing: 0.15em; }
          .oe-border-top, .oe-border-bottom { padding: 8px 3px; }
          .oe-col-left, .oe-col-right { width: 10px; }
          .oe-col-extra { display: none; }
          .oe-bg-carvings { padding: 10px; gap: 8px; }
        }
      `}</style>
    </div>
  );
};

export default EntryExperience;