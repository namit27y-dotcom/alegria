import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import {
  BookOpen,
  Calendar,
  Download,
  Flame,
  Gamepad2,
  MapPin,
  Music,
  Palette,
  Printer,
  RotateCcw,
  Theater
} from 'lucide-react';
import {
  FESTIVAL_EVENTS,
  type EventCategory,
  type RegistrationRecord
} from '../data/festival';

interface OlympusPassCardProps {
  registration: RegistrationRecord;
  onReset: () => void;
  onToast: (message: string) => void;
}

const DISCIPLINES: Array<{ name: EventCategory; label: string }> = [
  { name: 'Music', label: 'Music' },
  { name: 'Dance', label: 'Dance' },
  { name: 'Drama', label: 'Drama' },
  { name: 'Art', label: 'Art' },
  { name: 'Literary', label: 'Literary' },
  { name: 'Gaming', label: 'Gaming' }
];

function DisciplineIcon({ name }: { name: EventCategory }) {
  switch (name) {
    case 'Music':
      return <Music size={17} strokeWidth={1.8} />;
    case 'Dance':
      return <Flame size={17} strokeWidth={1.8} />;
    case 'Drama':
      return <Theater size={17} strokeWidth={1.8} />;
    case 'Art':
      return <Palette size={17} strokeWidth={1.8} />;
    case 'Literary':
      return <BookOpen size={17} strokeWidth={1.8} />;
    case 'Gaming':
      return <Gamepad2 size={17} strokeWidth={1.8} />;
  }
}

function LaurelWreath({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M17 32C9 27 6 18 9 7"
        stroke="#f3cf72"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="7" cy="25" rx="3.2" ry="1.6" transform="rotate(-35 7 25)" fill="#f3cf72" />
      <ellipse cx="6" cy="19" rx="3.2" ry="1.6" transform="rotate(-22 6 19)" fill="#f3cf72" />
      <ellipse cx="7" cy="13" rx="3.2" ry="1.6" transform="rotate(-10 7 13)" fill="#f3cf72" />
      <ellipse cx="10" cy="8" rx="3" ry="1.5" transform="rotate(15 10 8)" fill="#f3cf72" />
      <ellipse cx="12" cy="28" rx="3" ry="1.5" transform="rotate(-55 12 28)" fill="#d69c32" />
    </svg>
  );
}

function CornerFlourish({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M4 34C4 16 16 4 34 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 28C11 18 18 11 28 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="12" cy="16" rx="4" ry="2" transform="rotate(-45 12 16)" fill="currentColor" />
      <ellipse cx="20" cy="10" rx="3.5" ry="1.8" transform="rotate(-20 20 10)" fill="currentColor" />
      <ellipse cx="9" cy="24" rx="3.5" ry="1.8" transform="rotate(-70 9 24)" fill="currentColor" />
    </svg>
  );
}

function ParthenonEmblem() {
  return (
    <svg width="46" height="36" viewBox="0 0 64 50" fill="none" aria-hidden="true">
      <path d="M8 17L32 5L56 17H8Z" stroke="#f5cf72" strokeWidth="2.2" fill="rgba(245,207,114,0.14)" />
      <rect x="10" y="19" width="44" height="3" fill="#f5cf72" />
      <path
        d="M15 24V40M23 24V40M32 24V40M41 24V40M49 24V40"
        stroke="#f5cf72"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <rect x="8" y="40" width="48" height="3" fill="#f5cf72" />
      <rect x="5" y="44" width="54" height="3" fill="#d3982e" />
    </svg>
  );
}

export function OlympusPassCard({ registration, onReset, onToast }: OlympusPassCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  const registeredEvents = useMemo(
    () =>
      registration.events
        .map((id) => FESTIVAL_EVENTS.find((ev) => ev.id === id))
        .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev)),
    [registration.events]
  );

  const activeCategories = useMemo(
    () => new Set<EventCategory>(registeredEvents.map((ev) => ev.category)),
    [registeredEvents]
  );

  const initials = useMemo(() => {
    const parts = registration.name.trim().split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('') || 'AL';
  }, [registration.name]);

  useEffect(() => {
    let cancelled = false;
    const payload = JSON.stringify({
      festival: 'Alegria 2027 - Rise of Olympus',
      code: registration.code,
      name: registration.name,
      college: registration.college,
      pass: registration.pass,
      events: registration.events,
      dates: '12-14 March 2027'
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0a1432',
        light: '#fff7e2'
      }
    })
      .then((url) => {
        if (!cancelled) setQrUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [registration]);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#050b1f'
      });
      const link = document.createElement('a');
      link.download = `Alegria-2027-Pass-${registration.code}.png`;
      link.href = dataUrl;
      link.click();
      onToast('Festival pass downloaded as PNG');
    } catch {
      onToast('Could not export image; use Print Pass to save as PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="op-wrapper">
      <div className="op-stage" ref={cardRef}>
        <div className="op-lanyard-band" aria-hidden="true">
          <span>✦ Alegria 2027 ✦</span>
        </div>
        <div className="op-clasp" aria-hidden="true" />

        <div className="op-card">
          <div className="op-inner">
            <div className="op-bg-art" />
            <div className="op-lightning" />

            <CornerFlourish className="op-corner tl" />
            <CornerFlourish className="op-corner tr" />
            <CornerFlourish className="op-corner bl" />
            <CornerFlourish className="op-corner br" />

            <div className="op-header">
              <div className="op-presents">Pillai College of Engineering</div>
              <div className="op-presents-sub">Presents</div>
              <div className="op-brand-lockup">
                <LaurelWreath />
                <div>
                  <div className="op-title">ALÉGRIA</div>
                  <div className="op-year">— 2027 —</div>
                </div>
                <LaurelWreath flip />
              </div>
              <div className="op-subtitle">— Rise of Olympus —</div>
              <div className="op-motto-top">Create · Compete · Celebrate</div>
            </div>

            <div className="op-divider" />

            <div className="op-profile">
              <div className="op-photo-frame">
                <div className="op-photo-inner">
                  {registration.photo ? (
                    <img src={registration.photo} alt={registration.name} />
                  ) : (
                    <>
                      <span className="op-initials">{initials}</span>
                      <span className="op-avatar-caption">Olympian</span>
                    </>
                  )}
                </div>
              </div>

              <div className="op-details">
                <div>
                  <div className="op-field-label">Name</div>
                  <div className="op-field-value">{registration.name}</div>
                </div>
                <div>
                  <div className="op-field-label">College</div>
                  <div className="op-field-value sm">{registration.college}</div>
                </div>
                <div className="op-inline-row">
                  <span className="op-field-label">Pass Type</span>
                  <span className="op-pass-pill">{registration.pass} Pass</span>
                </div>
                <div className="op-inline-row">
                  <span className="op-field-label">Valid For</span>
                  <span className="op-field-value sm">12 – 14 March 2027</span>
                </div>
              </div>
            </div>

            <div className="op-mid">
              <div className="op-tagline">
                A Festival
                <br />
                Beyond Time
                <div className="op-tagline-star">─ ✦ ─</div>
              </div>

              <div className="op-qr-col">
                <div className="op-qr-frame">
                  <div className="op-qr-inner">
                    {qrUrl ? (
                      <img src={qrUrl} alt={`QR pass for ${registration.code}`} />
                    ) : (
                      <span style={{ color: '#0a1432', fontSize: 11 }}>Generating…</span>
                    )}
                  </div>
                </div>
                <div className="op-code">{registration.code}</div>
              </div>

              <div className="op-emblem-col">
                <ParthenonEmblem />
                <div className="op-emblem-label">
                  Pillai College of
                  <br />
                  Engineering
                </div>
              </div>
            </div>

            <div className="op-disciplines">
              {DISCIPLINES.map((disc) => (
                <div
                  key={disc.name}
                  className={`op-disc-item${activeCategories.has(disc.name) ? ' active' : ''}`}
                >
                  <DisciplineIcon name={disc.name} />
                  <span>{disc.label}</span>
                </div>
              ))}
            </div>

            {registeredEvents.length > 0 && (
              <div className="op-events-summary">
                <strong>Events:</strong>{' '}
                {registeredEvents.map((ev) => ev.name).join(' · ')}
              </div>
            )}

            <div className="op-footer">
              <div className="op-footer-meta">
                <span>
                  <Calendar size={12} /> 12 – 14 March 2027
                </span>
                <span>
                  <MapPin size={12} /> PCE Campus
                </span>
              </div>
              <div className="op-signature">
                <span className="op-sig-script">Alegria</span>
                <span className="op-sig-sub">Festival Committee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="op-actions">
        <button type="button" className="btn" onClick={handleDownload} disabled={downloading}>
          <Download size={16} />
          {downloading ? 'Preparing PNG…' : 'Download Pass'}
        </button>
        <button type="button" className="btn o" onClick={() => window.print()}>
          <Printer size={16} />
          Print Pass
        </button>
        <button type="button" className="btn o" onClick={onReset}>
          <RotateCcw size={16} />
          Register another person
        </button>
      </div>
    </div>
  );
}
