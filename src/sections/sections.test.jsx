import { render, screen, within } from "@testing-library/react";
import Experience from "./Experience";
import Publications from "./Publications";
import Education from "./Education";
import Contact from "./Contact";
import { groupByYear } from "../lib/groupByYear";
import { experience, publications, education, contact } from "../content";

test("groupByYear sorts years descending regardless of input order", () => {
  const out = groupByYear([
    { year: 2020, title: "a" },
    { year: 2026, title: "b" },
    { year: 2020, title: "c" },
  ]);
  expect(out.map(([y]) => y)).toEqual([2026, 2020]);
  expect(out[1][1].map((p) => p.title)).toEqual(["a", "c"]);
});

test("experience lists every role with dates", () => {
  render(<Experience items={experience} />);
  const section = screen.getByRole("region", { name: "experience" });
  for (const e of experience) {
    expect(
      within(section).getByText(e.org, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(`${e.start} – ${e.end}`),
    ).toBeInTheDocument();
  }
});

test("publications bold the owner's name and tag patents", () => {
  const { container } = render(<Publications items={publications} />);
  expect(container.querySelector("strong")).toHaveTextContent("C. Gudavalli");
  expect(screen.getAllByText("patent")).toHaveLength(
    publications.filter((p) => p.type === "patent").length,
  );
  expect(screen.getByRole("heading", { name: "2026" })).toBeInTheDocument();
});

test("renders unlinked title when href missing", () => {
  render(
    <Publications
      items={[
        {
          year: 2024,
          type: "paper",
          title: "No Link Paper",
          authors: "C. Gudavalli",
          venue: "V",
        },
      ]}
    />,
  );
  expect(screen.getByText("No Link Paper").closest("a")).toBeNull();
});

test("education and contact render; contact has no phone", () => {
  render(<Education items={education} />);
  expect(
    screen.getByText(education[0].degree, { exact: false }),
  ).toBeInTheDocument();
  const { container } = render(<Contact contact={contact} />);
  expect(
    screen.getByRole("link", { name: /chandrakanthgudavalli@gmail\.com/ }),
  ).toHaveAttribute("href", contact.email);
  expect(container.textContent).not.toMatch(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/);
});
