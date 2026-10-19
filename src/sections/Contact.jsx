import Section from "../components/Section";
import CopyEmail from "../components/CopyEmail";

export default function Contact({ contact }) {
  return (
    <Section id="contact" label="contact">
      <p className="contact-blurb">{contact.blurb}</p>
      <div className="hero-links mono">
        <CopyEmail email={contact.email} label={contact.email} />
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
      </div>
    </Section>
  );
}
