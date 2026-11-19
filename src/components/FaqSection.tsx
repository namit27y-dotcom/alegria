export function FaqSection() {
  return (
    <section id="faq" className="sch">
      <div className="w" style={{ maxWidth: 820 }}>
        <div className="sh">
          <h2>Questions, answered.</h2>
        </div>

        <details>
          <summary>Who can take part?</summary>
          <p>
            Any college student, undergraduate or postgraduate. Register with your college name and
            year, and pick the events you want to enter.
          </p>
        </details>
        <details>
          <summary>How much does it cost?</summary>
          <p>
            Each event entry is ₹300. If you plan to compete in several events, a Hero or Immortal
            pass costs less than entering one by one.
          </p>
        </details>
        <details>
          <summary>Can I enter more than one event?</summary>
          <p>
            Yes. Choose as many as you like on the registration form. Check the schedule first so
            the timings do not clash.
          </p>
        </details>
        <details>
          <summary>When and where is it?</summary>
          <p>
            The festival runs from 12 to 14 March 2027. Each event page lists its venue, and the
            full schedule is above.
          </p>
        </details>
      </div>
    </section>
  );
}
