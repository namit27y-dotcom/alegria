import { LOGO_MAIN } from '../data/festival';

export function Footer() {
  return (
    <footer>
      <div className="w">
        <div className="fg">
          <div>
            <img className="fl2" src={LOGO_MAIN} alt="Alegria, Rise of Olympus" />
            <p>The festival of joy. 12–14 March 2027. Forged by mortals, blessed by the gods.</p>
          </div>
          <div>
            <h4>Festival</h4>
            <ul>
              <li><a href="#artists">Artists</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#schedule">Schedule</a></li>
              <li><a href="#passes">Passes</a></li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#oracle">The Oracle</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#register">Register</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li className="m">fest@example.edu</li>
              <li className="m">+91 00000 00000</li>
              <li className="m">Instagram, YouTube, X, LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="wm" aria-hidden="true">Alegria</div>
        <div className="fb">
          <span>© 2027 Alegria. All rights reserved.</span>
          <span>
            Rise of Olympus · <a href="/admin.html">Admin</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
