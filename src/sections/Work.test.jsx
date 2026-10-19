import { render, screen, within, fireEvent } from "@testing-library/react";
import Work from "./Work";
import { work } from "../content";

test("renders a labelled section with one card per item", async () => {
  render(<Work items={work} />);
  await screen.findByRole("button", { name: "pause video" });
  const section = screen.getByRole("region", {
    name: "selected reconstructions",
  });
  expect(section).toHaveAttribute("id", "work");
  expect(within(section).getAllByRole("article")).toHaveLength(work.length);
});

test("image cards have alt text; video cards have a poster and no controls", async () => {
  const { container } = render(<Work items={work} />);
  await screen.findByRole("button", { name: "pause video" });
  expect(screen.getByAltText(work[0].media.alt)).toHaveAttribute(
    "src",
    work[0].media.image,
  );
  const v = container.querySelector("video");
  expect(v).toHaveAttribute("poster", work[3].media.poster);
  expect(v.muted).toBe(true);
  expect(v).not.toHaveAttribute("controls");
  expect(v).not.toHaveAttribute("autoplay");
});

test("video card button toggles pause/play and pauses the video", async () => {
  const pause = window.HTMLMediaElement.prototype.pause;
  pause.mockClear();
  render(<Work items={work} />);
  fireEvent.click(await screen.findByRole("button", { name: "pause video" }));
  expect(pause).toHaveBeenCalledTimes(1);
  expect(
    screen.getByRole("button", { name: "play video" }),
  ).toBeInTheDocument();
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
