import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  CATEGORIES,
  CATEGORY_ACCENTS,
  FESTIVAL_EVENTS,
  type EventCategory,
  type FestivalEvent
} from '../data/festival';

interface EventsSectionProps {
  favorites: Set<number>;
  onToggleFavorite: (event: FestivalEvent) => void;
  onRegisterFavorites: () => void;
  onSelectEventForRegister: (eventId: number) => void;
}

export function EventsSection({
  favorites,
  onToggleFavorite,
  onRegisterFavorites,
  onSelectEventForRegister
}: EventsSectionProps) {
  const [category, setCategory] = useState<'All' | EventCategory>('All');
  const [query, setQuery] = useState('');
  const [activeEvent, setActiveEvent] = useState<FestivalEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FESTIVAL_EVENTS.filter(
      (ev) =>
        (category === 'All' || ev.category === category) &&
        `${ev.name} ${ev.description} ${ev.category}`.toLowerCase().includes(q)
    );
  }, [category, query]);

  useEffect(() => {
    if (!activeEvent) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEvent(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeEvent]);

  return (
    <section id="events">
      <div className="w">
        <div className="sh">
          <h2>Choose your arena.</h2>
          <p className="lead">
            Twelve trials across six disciplines. Select any event for its venue, format and prize.
          </p>
        </div>

        <div className="tools">
          <div className="tb">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill${cat === category ? ' on' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            className="srch"
            type="search"
            placeholder="Search events"
            aria-label="Search events"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {favorites.size > 0 && (
          <div style={{ marginBottom: 20 }}>
            <button type="button" className="btn sm" onClick={onRegisterFavorites}>
              {favorites.size} saved: register for all
            </button>
          </div>
        )}

        <div className="eg">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((ev) => {
              const saved = favorites.has(ev.id);
              return (
                <article
                  key={ev.id}
                  className="ev sp"
                  style={{ '--a': CATEGORY_ACCENTS[ev.category] } as CSSProperties}
                  tabIndex={0}
                  onClick={() => setActiveEvent(ev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveEvent(ev);
                    }
                  }}
                >
                  <div className="evt">
                    <img
                      className="event-art"
                      src={ev.art}
                      alt={`${ev.name} event artwork`}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className={`hrt${saved ? ' on' : ''}`}
                      aria-label={`Save ${ev.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(ev);
                      }}
                    >
                      {saved ? '♥' : '♡'}
                    </button>
                  </div>
                  <span className="ec">{ev.category}</span>
                  <h3>{ev.name}</h3>
                  <p>{ev.description}</p>
                  <div className="evf">
                    <span>{ev.team}</span>
                    <b>{ev.prize}</b>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="none">No events match your search. Try another word or discipline.</p>
          )}
        </div>
      </div>

      {activeEvent && (
        <div
          className="mo"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveEvent(null);
          }}
        >
          <div className="mb" role="dialog" aria-modal="true" aria-label={activeEvent.name}>
            <button
              type="button"
              className="x"
              aria-label="Close"
              onClick={() => setActiveEvent(null)}
            >
              ×
            </button>
            <img
              src={activeEvent.art}
              alt={`${activeEvent.name} artwork`}
              style={{ width: '100%', height: 190, objectFit: 'contain' }}
            />
            <span className="ec">{activeEvent.category}</span>
            <h3>{activeEvent.name}</h3>
            <p className="lead" style={{ margin: 0 }}>{activeEvent.description}</p>
            <div className="mt">
              <div><b>Prize pool</b>{activeEvent.prize}</div>
              <div><b>Venue</b>{activeEvent.venue}</div>
              <div><b>Format</b>{activeEvent.team}</div>
              <div><b>Entry fee</b>₹300 per event</div>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => {
                onSelectEventForRegister(activeEvent.id);
                setActiveEvent(null);
              }}
            >
              Register for this event
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
