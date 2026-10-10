import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Hero from "./Hero";
import { profile, hero } from "../content";

const play = window.HTMLMediaElement.prototype.play;

afterEach(() => {
  play.mockReset();
  play.mockImplementation(() => Promise.resolve());
  delete window.matchMedia;
  delete window.IntersectionObserver;
});

test("renders name, tagline, bio and links", () => {
  render(<Hero profile={profile} hero={hero} />);
  expect(
    screen.getByRole("heading", { level: 1, name: profile.name }),
  ).toBeInTheDocument();
  expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "resume.pdf" })).toHaveAttribute(
    "href",
    "/resume.pdf",
  );
  expect(screen.getByRole("link", { name: "email" })).toHaveAttribute(
    "href",
    profile.links.email,
  );
  const li = screen.getByRole("link", { name: "linkedin" });
  expect(li).toHaveAttribute("target", "_blank");
  expect(li).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByRole("link", { name: "email" })).not.toHaveAttribute(
    "target",
  );
  expect(screen.getByText(profile.highlight.text)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "certificate" })).toHaveAttribute(
    "href",
    profile.highlight.href,
  );
});

test("renders two muted, looping videos with posters and both sources", () => {
  const { container } = render(<Hero profile={profile} hero={hero} />);
  const videos = container.querySelectorAll("video");
  expect(videos).toHaveLength(2);
  videos.forEach((v, i) => {
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v).toHaveAttribute("poster", hero.panes[i].poster);
    expect(v.querySelector('source[type="video/webm"]')).toHaveAttribute(
      "src",
      hero.panes[i].video.webm,
    );
    expect(v.querySelector('source[type="video/mp4"]')).toHaveAttribute(
      "src",
      hero.panes[i].video.mp4,
    );
  });
  expect(screen.getByText(hero.panes[0].label)).toBeInTheDocument();
});

test("plays immediately without IntersectionObserver", async () => {
  render(<Hero profile={profile} hero={hero} />);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
});

test("does not autoplay under reduced motion, plays on button click", async () => {
  window.matchMedia = vi.fn((q) => ({
    matches: q.includes("reduce"),
    addEventListener() {},
    removeEventListener() {},
  }));
  render(<Hero profile={profile} hero={hero} />);
  expect(play).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: /play reconstruction/i }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
});

test("shows play button when autoplay is blocked", async () => {
  play.mockImplementation(() =>
    Promise.reject(new DOMException("blocked", "NotAllowedError")),
  );
  render(<Hero profile={profile} hero={hero} />);
  expect(
    await screen.findByRole("button", { name: /play reconstruction/i }),
  ).toBeInTheDocument();
});
