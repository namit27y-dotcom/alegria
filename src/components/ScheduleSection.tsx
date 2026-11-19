import { useState } from 'react';
import { SCHEDULE_DAYS } from '../data/festival';

interface ScheduleSectionProps {
  onToast: (message: string) => void;
}

export function ScheduleSection({ onToast }: ScheduleSectionProps) {
  const [dayIndex, setDayIndex] = useState(0);
  const [plan, setPlan] = useState<Set<string>>(() => new Set());

  const togglePlanItem = (key: string) => {
    setPlan((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        onToast('Removed from your plan');
      } else {
        next.add(key);
        onToast('Added to your plan');
      }
      return next;
    });
  };

  const activeDay = SCHEDULE_DAYS[dayIndex];

  return (
    <section id="schedule">
      <div className="w">
        <div className="sh">
          <h2>The chronicle.</h2>
          <p className="lead">Pick a day, then add the moments you cannot miss to your plan.</p>
        </div>

        <div className="tb" style={{ marginBottom: 26 }}>
          {SCHEDULE_DAYS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`pill${idx === dayIndex ? ' on' : ''}`}
              onClick={() => setDayIndex(idx)}
            >
              Day {['I', 'II', 'III'][idx]}
            </button>
          ))}
        </div>

        <div>
          <h3 className="dl">{activeDay.title}</h3>
          {activeDay.items.map(([time, title, venue]) => {
            const key = `${dayIndex}-${time}`;
            const inPlan = plan.has(key);
            return (
              <div className="row" key={key}>
                <time>{time}</time>
                <div>
                  <h4>{title}</h4>
                  <span>{venue}</span>
                </div>
                <button
                  type="button"
                  className={`pl${inPlan ? ' on' : ''}`}
                  onClick={() => togglePlanItem(key)}
                >
                  {inPlan ? 'In your plan' : 'Add to plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
