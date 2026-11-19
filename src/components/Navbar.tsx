import { useState } from 'react';
import { LOGO_WORDMARK } from '../data/festival';

interface NavbarProps {
  onToggleTheme: () => void;
}

export function Navbar({ onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <a className="lg" href="#hero" aria-label="Alegria home">
        <img className="lw" src={LOGO_WORDMARK} alt="Alegria" />
      </a>
      <button
        type="button"
        className="ic bg"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>
      <ul className={menuOpen ? 'open' : ''}>
        <li><a href="#artists" onClick={closeMenu}>Artists</a></li>
        <li><a href="#events" onClick={closeMenu}>Events</a></li>
        <li><a href="#schedule" onClick={closeMenu}>Schedule</a></li>
        <li><a href="#oracle" onClick={closeMenu}>Oracle</a></li>
        <li><a href="#passes" onClick={closeMenu}>Passes</a></li>
        <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
      </ul>
      <div className="na">
        <button
          type="button"
          className="ic"
          aria-label="Switch light or dark theme"
          onClick={onToggleTheme}
        >
          ◐
        </button>
        <a className="btn sm" href="#register">Register</a>
      </div>
    </nav>
  );
}
