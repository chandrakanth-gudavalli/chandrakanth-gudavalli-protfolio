import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Publications from "./sections/Publications";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { useTheme } from "./hooks/useTheme";
import {
  sections,
  profile,
  hero,
  work,
  experience,
  publications,
  education,
  contact,
} from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <Hero profile={profile} hero={hero} />
        <Work items={work} />
        <Experience items={experience} />
        <Publications items={publications} />
        <Education items={education} />
        <Contact contact={contact} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
