import { useEffect, useRef, useState } from 'react';

interface StatDef {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

const STATS: StatDef[] = [
  { label: 'Prize pool', target: 3, prefix: '₹', suffix: 'L+' },
  { label: 'Divine events', target: 12, suffix: '+' },
  { label: 'Days of glory', target: 3 },
  { label: 'Mortals expected', target: 10, suffix: 'K+' }
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<number[]>(STATS.map((s) => s.target));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    let animated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !animated) {
          animated = true;
          let start: number | null = null;
          const step = (ts: number) => {
            start = start ?? ts;
            const k = Math.min(1, (ts - start) / 1500);
            const eased = 1 - Math.pow(1 - k, 3);
            setValues(STATS.map((s) => Math.round(s.target * eased)));
            if (k < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="w ab">
        <div>
          <h2>Three days where the gods come to compete.</h2>
          <p className="lead">
            Every year, thousands gather to celebrate art, rhythm and rivalry. This year the
            festival opens the gates of Mount Olympus. Apollo’s music echoes, Athena’s wisdom
            guides, and every stage becomes a battlefield of legends.
          </p>
        </div>
        <dl className="fx">
          {STATS.map((stat, idx) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>
                {stat.prefix ?? ''}
                {values[idx]}
                {stat.suffix ?? ''}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
