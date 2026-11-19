import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Search, User } from 'lucide-react';
import {
  FESTIVAL_EVENTS,
  PASS_TIERS,
  type PassTierName,
  type RegistrationRecord
} from '../data/festival';
import { OlympusPassCard } from './OlympusPassCard';

interface RegisterSectionProps {
  selectedPass: PassTierName;
  onPassChange: (pass: PassTierName) => void;
  selectedEvents: Set<number>;
  onToggleEvent: (eventId: number) => void;
  onClearEvents: () => void;
  onToast: (message: string) => void;
}

function burstConfetti() {
  for (let i = 0; i < 46; i++) {
    const c = document.createElement('i');
    c.className = 'conf';
    const angle = Math.random() * 6.28;
    const dist = 120 + Math.random() * 260;
    c.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
    c.style.setProperty('--y', `${Math.sin(angle) * dist}px`);
    c.style.background = ['#e8c26a', '#fff2c4', '#a67c22'][i % 3];
    document.body.appendChild(c);
    window.setTimeout(() => c.remove(), 1500);
  }
}

function compressPortrait(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const targetW = 300;
        const targetH = 354;
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unsupported'));
          return;
        }
        const srcRatio = img.width / img.height;
        const dstRatio = targetW / targetH;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (srcRatio > dstRatio) {
          sw = img.height * dstRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / dstRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}

export function RegisterSection({
  selectedPass,
  onPassChange,
  selectedEvents,
  onToggleEvent,
  onClearEvents,
  onToast
}: RegisterSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<'register' | 'lookup'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('1st');
  const [photo, setPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [lookupCode, setLookupCode] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<RegistrationRecord | null>(null);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressPortrait(file);
      setPhoto(compressed);
      onToast('Portrait added to your pass');
    } catch {
      onToast('Please choose a valid image file (PNG/JPG/WebP)');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEvents.size) {
      onToast('Choose at least one event first');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          college,
          year,
          pass: selectedPass,
          events: [...selectedEvents],
          photo
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setGeneratedPass({
        ...data.registration,
        photo: data.registration.photo || photo
      });
      burstConfetti();
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Could not connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const cleaned = lookupCode.trim().toUpperCase();
    if (!cleaned) {
      onToast('Enter your pass code (e.g. OLY-A1B2C3)');
      return;
    }
    setLookingUp(true);
    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pass code not found.');
      setGeneratedPass(data.registration);
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Could not find that pass code.');
    } finally {
      setLookingUp(false);
    }
  };

  const handleReset = () => {
    setGeneratedPass(null);
    setName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setYear('1st');
    setPhoto('');
    setLookupCode('');
    onClearEvents();
  };

  const passRuleHint =
    selectedPass === 'Mortal'
      ? 'Mortal allows 1 event'
      : selectedPass === 'Hero'
      ? 'Hero allows up to 5 events'
      : 'Immortal allows all 12 events';

  return (
    <section id="register">
      <div className={`w rg${generatedPass ? ' pass-ready' : ''}`}>
        <div>
          <h2>
            {generatedPass
              ? 'Your Olympus pass is forged.'
              : 'Claim your seat at the summit.'}
          </h2>
          <p className="lead">
            {generatedPass
              ? `Keep ${generatedPass.code} ready for check-in on 12–14 March 2027. We have logged your registration for ${generatedPass.email}.`
              : 'Fill in one short form. You get a custom festival pass with your QR code straight away, ready to download or print.'}
          </p>
          <ul className="pk">
            <li>Pick your pass tier and events</li>
            <li>Upload a portrait for your personalised ID badge</li>
            <li>Get a scannable QR pass code instantly</li>
          </ul>
        </div>

        <div>
          {generatedPass ? (
            <OlympusPassCard
              registration={generatedPass}
              onReset={handleReset}
              onToast={onToast}
            />
          ) : (
            <>
              <div className="reg-tabs" role="tablist" aria-label="Registration options">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={`pill${mode === 'register' ? ' on' : ''}`}
                  onClick={() => setMode('register')}
                >
                  New registration
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'lookup'}
                  className={`pill${mode === 'lookup' ? ' on' : ''}`}
                  onClick={() => setMode('lookup')}
                >
                  Retrieve pass
                </button>
              </div>

              {mode === 'register' ? (
                <form onSubmit={handleSubmit}>
                  <label>
                    Full name
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>

                  <div className="two">
                    <label>
                      Email
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@college.edu"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        name="phone"
                        type="tel"
                        required
                        pattern="[0-9+ ()-]{10,18}"
                        placeholder="10-digit number"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    College
                    <input
                      name="college"
                      required
                      placeholder="Pillai College of Engineering"
                      autoComplete="organization"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </label>

                  <div className="two">
                    <label>
                      Year
                      <select
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option>1st</option>
                        <option>2nd</option>
                        <option>3rd</option>
                        <option>4th</option>
                        <option>PG</option>
                      </select>
                    </label>
                    <label>
                      Pass
                      <select
                        name="pass"
                        value={selectedPass}
                        onChange={(e) => onPassChange(e.target.value as PassTierName)}
                      >
                        {PASS_TIERS.map((tier) => (
                          <option key={tier.name} value={tier.name}>
                            {tier.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div>
                    <label style={{ marginBottom: 8 }}>
                      Attendee photo (optional, shown on your pass)
                    </label>
                    <div className="photo-upload-row">
                      <div className="photo-preview-thumb">
                        {photo ? <img src={photo} alt="Attendee preview" /> : <User size={24} />}
                      </div>
                      <div className="photo-upload-controls">
                        <input
                          ref={fileInputRef}
                          className="photo-file-input"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handlePhotoChange}
                        />
                        <button
                          type="button"
                          className="pill"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                          {photo ? 'Change photo' : 'Upload photo'}
                        </button>
                        {photo && (
                          <button
                            type="button"
                            className="pill"
                            onClick={() => {
                              setPhoto('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ marginBottom: 8 }}>
                      Events ({selectedEvents.size} chosen · {passRuleHint})
                    </label>
                    <div className="chips">
                      {FESTIVAL_EVENTS.map((ev) => {
                        const active = selectedEvents.has(ev.id);
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            className={`chip${active ? ' on' : ''}`}
                            onClick={() => onToggleEvent(ev.id)}
                          >
                            {ev.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button className="btn" type="submit" disabled={submitting}>
                    {submitting ? 'Forging your pass…' : 'Get my pass'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLookup}>
                  <label>
                    Pass code
                    <input
                      name="passCode"
                      required
                      placeholder="OLY-A1B2C3"
                      value={lookupCode}
                      onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                    />
                  </label>
                  <button className="btn" type="submit" disabled={lookingUp}>
                    <Search size={16} />
                    {lookingUp ? 'Searching Olympus…' : 'View my pass'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
