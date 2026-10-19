import Section from "../components/Section";

export default function Experience({ items }) {
  return (
    <Section id="experience" label="experience">
      <ol className="exp-list">
        {items.map((e) => (
          <li key={e.org} className={e.compact ? "exp compact" : "exp"}>
            <div className="exp-head">
              <span>
                <span className="exp-org">{e.org}</span> — {e.role}
              </span>
              <span className="exp-dates mono">{`${e.start} – ${e.end}`}</span>
            </div>
            <div className="exp-loc">{e.location}</div>
            <ul className="exp-bullets">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
