import Section from "../components/Section";

export default function Fun({ items }) {
  return (
    <Section id="fun" label="fun">
      <ul className="fun-list">
        {items.map((f) => (
          <li key={f.href}>
            <div>
              <h3 className="fun-title">{f.title}</h3>
              <p className="fun-blurb">{f.blurb}</p>
            </div>
            <a
              className="fun-open mono"
              href={f.href}
              aria-label={`open ${f.title}`}
            >
              open <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
