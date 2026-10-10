import Section from "../components/Section";
import LinkChips from "../components/LinkChips";

export default function Contact({ contact }) {
  return (
    <Section id="contact" label="contact">
      <p className="contact-blurb">{contact.blurb}</p>
      <LinkChips
        className="hero-links"
        links={[
          { label: contact.email.replace("mailto:", ""), href: contact.email },
          { label: "linkedin", href: contact.linkedin },
        ]}
      />
    </Section>
  );
}
