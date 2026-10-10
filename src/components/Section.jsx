export default function Section({ id, label, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-label`}>
      <h2 id={`${id}-label`} className="section-label mono">
        // {label}
      </h2>
      {children}
    </section>
  );
}
