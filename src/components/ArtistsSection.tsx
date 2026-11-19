import { Ticket } from 'lucide-react';
import { FESTIVAL_ARTISTS, type ArtistItem } from '../data/festival';

interface ArtistsSectionProps {
  onBookArtistPass: (artist: ArtistItem) => void;
  onToast: (message: string) => void;
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArtistsSection({ onBookArtistPass, onToast }: ArtistsSectionProps) {
  return (
    <section id="artists">
      <div className="w">
        <div className="sh c">
          <h2>Artists.</h2>
          <p className="lead">
            The Voices of Olympus — live comedy, DJ sets and concert nights across the festival.
          </p>
        </div>

        <div className="artists-grid">
          {FESTIVAL_ARTISTS.map((artist) => (
            <article key={artist.id} className="artist-card sp">
              <div className="artist-media">
                <img
                  src={artist.image}
                  alt={`${artist.name} — ${artist.night}`}
                  loading="lazy"
                />
              </div>

              <div className="artist-meta">
                <span>{artist.night}</span>
                <span aria-hidden="true">·</span>
                <span>{artist.date}</span>
              </div>

              <h3>{artist.name}</h3>

              <div className="artist-actions">
                <a
                  className="artist-ig"
                  href={artist.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${artist.name} on Instagram`}
                >
                  <InstagramIcon />
                </a>

                {artist.bookingOpen ? (
                  <button
                    type="button"
                    className="btn artist-btn"
                    onClick={() => onBookArtistPass(artist)}
                  >
                    <Ticket size={16} />
                    Book Pass
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn o artist-btn muted"
                    onClick={() => onToast(`Passes for ${artist.name} are coming soon!`)}
                  >
                    <Ticket size={16} />
                    Pass Coming Soon
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
