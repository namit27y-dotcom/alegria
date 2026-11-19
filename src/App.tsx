import { useCallback, useEffect, useRef, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ArtistsSection } from './components/ArtistsSection';
import { EventsSection } from './components/EventsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { OracleSection } from './components/OracleSection';
import { PassesSection } from './components/PassesSection';
import { RegisterSection } from './components/RegisterSection';
import { ScheduleSection } from './components/ScheduleSection';
import { type ArtistItem, type FestivalEvent, type PassTierName } from './data/festival';

export function App() {
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set());
  const [selectedEvents, setSelectedEvents] = useState<Set<number>>(() => new Set());
  const [selectedPass, setSelectedPass] = useState<PassTierName>('Mortal');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    setToastVisible(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 2400);
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('alegria-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        document.documentElement.dataset.theme = savedTheme;
      }
    } catch {
      // Ignore storage failures in restricted contexts
    }

    const onScroll = () => {
      const doc = document.documentElement;
      document.body.classList.toggle('sc', window.scrollY > 24);
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      setScrollProgress((window.scrollY / maxScroll) * 100);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleTheme = () => {
    const docEl = document.documentElement;
    const current = docEl.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    docEl.dataset.theme = next;
    try {
      localStorage.setItem('alegria-theme', next);
    } catch {
      // Ignore storage failures
    }
  };

  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleFavorite = (ev: FestivalEvent) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(ev.id)) {
        next.delete(ev.id);
        showToast(`Removed ${ev.name}`);
      } else {
        next.add(ev.id);
        showToast(`Saved ${ev.name}`);
      }
      return next;
    });
  };

  const handleRegisterFavorites = () => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      favorites.forEach((id) => next.add(id));
      if (next.size > 5) setSelectedPass('Immortal');
      else if (next.size > 1 && selectedPass === 'Mortal') setSelectedPass('Hero');
      return next;
    });
    scrollToRegister();
  };

  const handleSelectEventForRegister = (eventId: number) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      next.add(eventId);
      if (next.size > 5) setSelectedPass('Immortal');
      else if (next.size > 1 && selectedPass === 'Mortal') setSelectedPass('Hero');
      return next;
    });
    scrollToRegister();
  };

  const handleToggleRegisterEvent = (eventId: number) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handleSelectPass = (pass: PassTierName) => {
    setSelectedPass(pass);
    showToast(`${pass} pass selected`);
    scrollToRegister();
  };

  const handleBookArtistPass = (artist: ArtistItem) => {
    setSelectedPass('Hero');
    showToast(`Booking pass for ${artist.name} (${artist.night})`);
    scrollToRegister();
  };

  const handleSaveOracleEvents = (eventIds: number[]) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      eventIds.forEach((id) => next.add(id));
      return next;
    });
    showToast('Events saved to your list');
  };

  return (
    <>
      <div className="pr" style={{ width: `${scrollProgress}%` }} />
      <Navbar onToggleTheme={handleToggleTheme} />
      <Hero />
      <AboutSection />
      <ArtistsSection
        onBookArtistPass={handleBookArtistPass}
        onToast={showToast}
      />
      <EventsSection
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onRegisterFavorites={handleRegisterFavorites}
        onSelectEventForRegister={handleSelectEventForRegister}
      />
      <ScheduleSection onToast={showToast} />
      <OracleSection onSaveRecommendedEvents={handleSaveOracleEvents} />
      <PassesSection onSelectPass={handleSelectPass} />
      <FaqSection />
      <RegisterSection
        selectedPass={selectedPass}
        onPassChange={setSelectedPass}
        selectedEvents={selectedEvents}
        onToggleEvent={handleToggleRegisterEvent}
        onClearEvents={() => setSelectedEvents(new Set())}
        onToast={showToast}
      />
      <Footer />
      <div className={`ts${toastVisible ? ' on' : ''}`} role="status">
        {toastMsg}
      </div>
    </>
  );
}
