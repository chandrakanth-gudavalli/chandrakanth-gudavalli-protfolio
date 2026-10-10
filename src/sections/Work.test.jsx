import { render, screen, within } from "@testing-library/react";
import Work from "./Work";
import { work } from "../content";

test("renders a labelled section with one card per item", () => {
  render(<Work items={work} />);
  const section = screen.getByRole("region", {
    name: "// selected reconstructions",
  });
  expect(section).toHaveAttribute("id", "work");
  expect(within(section).getAllByRole("article")).toHaveLength(work.length);
});

test("image cards have alt text; video cards have a poster and no controls", () => {
  const { container } = render(<Work items={work} />);
  expect(screen.getByAltText(work[0].media.alt)).toHaveAttribute(
    "src",
    work[0].media.image,
  );
  const v = container.querySelector("video");
  expect(v).toHaveAttribute("poster", work[3].media.poster);
  expect(v.muted).toBe(true);
});

test("card without media renders text only", () => {
  const { container } = render(
    <Work
      items={[
        {
          title: "T",
          impact: "I",
          links: [{ label: "x", href: "https://x.org" }],
        },
      ]}
    />,
  );
  expect(container.querySelector(".card-media")).toBeNull();
  expect(screen.getByRole("link", { name: "x" })).toHaveAttribute(
    "target",
    "_blank",
  );
});
