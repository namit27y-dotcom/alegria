import { useEffect, useRef, useState } from 'react';
import { LOGO_MAIN } from '../data/festival';

const TARGET_TIME = new Date('2027-03-12T09:00:00+05:30').getTime();

function getCountdownParts() {
  let diff = Math.max(0, TARGET_TIME - Date.now());
  return [864e5, 36e5, 6e4, 1e3].map((unit) => {
    const val = Math.floor(diff / unit);
    diff -= val * unit;
    return String(val).padStart(2, '0');
  });
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countdown, setCountdown] = useState<string[]>(getCountdownParts);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdownParts()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let width = 0;
    let height = 0;
    let stars: Array<{ x: number; y: number; r: number; p: number; s: number }> = [];
    let streaks: Array<{ x: number; y: number; l: number }> = [];
    let rafId = 0;

    const fit = () => {
      width = cv.width = cv.offsetWidth;
      height = cv.height = cv.offsetHeight;
      stars = Array.from({ length: Math.floor((width * height) / 5500) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        p: Math.random() * 6,
        s: Math.random() * 0.03 + 0.01
      }));
    };

    fit();
    window.addEventListener('resize', fit);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.p += s.s;
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p));
        ctx.fillStyle = '#fff3d0';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reducedMotion && Math.random() < 0.007) {
        streaks.push({ x: Math.random() * width, y: Math.random() * height * 0.4, l: 0 });
      }
      streaks = streaks.filter((s) => {
        s.x += 9;
        s.y += 4;
        s.l += 1;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - 70, s.y - 31);
        grad.addColorStop(0, 'rgba(255,230,160,.9)');
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - 70, s.y - 31);
        ctx.stroke();
        return s.l < 45;
      });
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    loop();
    return () => {
      window.removeEventListener('resize', fit);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('a,button')) return;
    const bolt = document.createElement('div');
    const flash = document.createElement('div');
    bolt.className = 'bolt';
    flash.className = 'fl';
    bolt.style.left = `${e.clientX}px`;
    bolt.style.height = `${Math.max(60, e.clientY)}px`;
    document.body.append(flash, bolt);
    window.setTimeout(() => {
      bolt.remove();
      flash.remove();
    }, 600);
  };

  const labels = ['days', 'hours', 'minutes', 'seconds'];

  return (
    <>
      <header id="hero" onClick={handleHeroClick}>
        <div className="aur" />
        <canvas id="stars" ref={canvasRef} />
        <div className="sun" />
        <div className="cn" />
        <div className="flash" />
        <div className="cloud" />
        <div className="hi">
          <a className="tag" href="#passes">
            <i />
            Early-bird passes are open
          </a>
          <img
            className="hl"
            src={LOGO_MAIN}
            alt="Alegria, Rise of Olympus, the festival of joy"
          />
          <h1 className="sr">Alegria 2027: Rise of Olympus</h1>
          <p className="hs">
            12–14 March 2027. Three days of music, dance, drama, art, literature and gaming,
            with ₹3 lakh in prizes. Tap the sky to summon lightning.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#register">Claim your seat</a>
            <a className="btn o" href="#events">Browse events</a>
          </div>
          <div className="cdn">
            {countdown.map((value, idx) => (
              <div key={labels[idx]}>
                <b>{value}</b>
                {labels[idx]}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mq" aria-hidden="true">
        <div>
          {Array.from({ length: 8 }).map((_, idx) => (
            <span key={idx} style={{ margin: 0 }}>
              <span>Music</span><i>✦</i>
              <span>Dance</span><i>✦</i>
              <span>Drama</span><i>✦</i>
              <span>Art</span><i>✦</i>
              <span>Literature</span><i>✦</i>
              <span>Gaming</span><i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
