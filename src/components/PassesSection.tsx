import { PASS_TIERS, type PassTierName } from '../data/festival';

interface PassesSectionProps {
  onSelectPass: (pass: PassTierName) => void;
}

export function PassesSection({ onSelectPass }: PassesSectionProps) {
  return (
    <section id="passes">
      <div className="w">
        <div className="sh c">
          <h2>Choose your ascent.</h2>
          <p className="lead">
            One event or all twelve. Every pass includes access to all three days of the festival.
          </p>
        </div>

        <div className="pg">
          {PASS_TIERS.map((tier) => (
            <div key={tier.name} className={`ps sp${tier.featured ? ' ft' : ''}`}>
              {tier.featured && <span className="bd">Most popular</span>}
              <h3>{tier.name}</h3>
              <div className="pr2">
                {tier.price} <small>{tier.unit}</small>
              </div>
              <ul>
                {tier.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`btn${tier.featured ? '' : ' o'}`}
                onClick={() => onSelectPass(tier.name)}
              >
                Select {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
