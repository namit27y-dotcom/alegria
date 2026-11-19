import { useState } from 'react';
import { FESTIVAL_EVENTS, ORACLE_QUESTIONS, ORACLE_RESULTS } from '../data/festival';

interface OracleSectionProps {
  onSaveRecommendedEvents: (eventIds: number[]) => void;
}

export function OracleSection({ onSaveRecommendedEvents }: OracleSectionProps) {
  const [answers, setAnswers] = useState<number[]>([]);

  const step = answers.length;
  const completed = step >= ORACLE_QUESTIONS.length;

  const result = (() => {
    if (!completed) return null;
    const counts = [0, 0, 0, 0];
    for (const ans of answers) counts[ans] += 1;
    const winnerIndex = counts.indexOf(Math.max(...counts));
    return ORACLE_RESULTS[winnerIndex];
  })();

  return (
    <section id="oracle" className="sch">
      <div className="w">
        <div className="sh c">
          <h2>Which god are you?</h2>
          <p className="lead">Answer three questions and the Oracle will point you to your events.</p>
        </div>

        <div className="orc">
          {result ? (
            <>
              <div className="big">{result.icon}</div>
              <h3>You are {result.god}.</h3>
              <p>{result.tagline}</p>
              <p style={{ margin: '14px 0 24px', color: 'var(--tx)' }}>
                Your events:{' '}
                {result.eventIds
                  .map((id) => FESTIVAL_EVENTS.find((ev) => ev.id === id)?.name)
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => onSaveRecommendedEvents(result.eventIds)}
              >
                Save these events
              </button>{' '}
              <button type="button" className="btn o" onClick={() => setAnswers([])}>
                Retake the quiz
              </button>
            </>
          ) : (
            <>
              <p>Question {step + 1} of {ORACLE_QUESTIONS.length}</p>
              <h3>{ORACLE_QUESTIONS[step].prompt}</h3>
              {ORACLE_QUESTIONS[step].options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  className="pill"
                  onClick={() => setAnswers((prev) => [...prev, idx])}
                >
                  {opt}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
