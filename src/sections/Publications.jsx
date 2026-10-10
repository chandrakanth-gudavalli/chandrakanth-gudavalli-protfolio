import Section from "../components/Section";
import PubItem from "../components/PubItem";
import { groupByYear } from "../lib/groupByYear";

export default function Publications({ items }) {
  return (
    <Section id="publications" label="publications & patents">
      {groupByYear(items).map(([year, pubs]) => (
        <div key={year} className="pub-year">
          <h3 className="pub-year-label mono">{year}</h3>
          <ul className="pub-list">
            {pubs.map((p) => (
              <PubItem key={p.title} {...p} />
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
