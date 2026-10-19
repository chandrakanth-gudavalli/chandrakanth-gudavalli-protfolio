import Section from "../components/Section";

export default function Education({ items }) {
  return (
    <Section id="education" label="education">
      <ul className="edu-list">
        {items.map((e) => (
          <li key={e.degree}>
            <span>
              {e.degree}, <span className="muted">{e.school}</span>
            </span>
            <span className="mono muted">{e.year}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
