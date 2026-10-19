import Section from "../components/Section";
import WorkCard from "../components/WorkCard";

export default function Work({ items }) {
  return (
    <Section id="work" label="selected reconstructions">
      <div className="work-grid">
        {items.map((w) => (
          <WorkCard key={w.title} {...w} />
        ))}
      </div>
    </Section>
  );
}
