import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

test("renders name, tagline, bio and links", async () => {
  render(<Hero profile={profile} hero={hero} />);
  await screen.findByRole("button", { name: "pause reconstruction" });
  expect(
    screen.getByRole("heading", { level: 1, name: profile.name }),
  ).toBeInTheDocument();
  expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "resume.pdf" })).toHaveAttribute(
    "href",
    "/resume.pdf",
  );
  expect(screen.queryByRole("link", { name: "email" })).toBeNull();
  expect(screen.getByRole("button", { name: "email" })).toHaveAttribute(
    "title",
    `copy ${profile.links.email}`,
  );
  const li = screen.getByRole("link", { name: "linkedin" });
  expect(li).toHaveAttribute("target", "_blank");
  expect(li).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByText(profile.highlight.text)).toBeInTheDocument();
  const cert = screen.getByRole("link", { name: "certificate" });
  expect(cert).toHaveAttribute("href", profile.highlight.href);
  expect(cert).not.toHaveAttribute("target");
});

test("renders two muted, looping videos with posters and both sources", async () => {
  const { container } = render(<Hero profile={profile} hero={hero} />);
  await screen.findByRole("button", { name: "pause reconstruction" });
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
  fireEvent.click(screen.getByRole("button", { name: "play reconstruction" }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  expect(
    await screen.findByRole("button", { name: "pause reconstruction" }),
  ).toBeInTheDocument();
});

test("shows play button when autoplay is blocked", async () => {
  play.mockImplementation(() =>
    Promise.reject(new DOMException("blocked", "NotAllowedError")),
  );
  render(<Hero profile={profile} hero={hero} />);
  expect(
    await screen.findByRole("button", { name: "play reconstruction" }),
  ).toBeInTheDocument();
});

test("autoplay success shows a pause button; clicking it pauses both videos", async () => {
  const pause = window.HTMLMediaElement.prototype.pause;
  pause.mockClear();
  render(<Hero profile={profile} hero={hero} />);
  fireEvent.click(
    await screen.findByRole("button", { name: "pause reconstruction" }),
  );
  expect(pause).toHaveBeenCalledTimes(2);
  expect(
    screen.getByRole("button", { name: "play reconstruction" }),
  ).toBeInTheDocument();
});

test("a user pause is not undone when the hero re-enters the viewport", async () => {
  let callback;
  window.IntersectionObserver = class {
    constructor(cb) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
  };
  render(<Hero profile={profile} hero={hero} />);
  await act(async () => {
    callback([{ isIntersecting: true }]);
  });
  fireEvent.click(
    await screen.findByRole("button", { name: "pause reconstruction" }),
  );
  play.mockClear();
  await act(async () => {
    callback([{ isIntersecting: true }]);
  });
  expect(play).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: "play reconstruction" }),
  ).toBeInTheDocument();
});

test("gates playback on viewport visibility via IntersectionObserver", async () => {
  const pause = window.HTMLMediaElement.prototype.pause;
  pause.mockClear();
  let callback;
  window.IntersectionObserver = class {
    constructor(cb) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
  };
  render(<Hero profile={profile} hero={hero} />);
  expect(play).not.toHaveBeenCalled();
  await act(async () => {
    callback([{ isIntersecting: true }]);
  });
  expect(play).toHaveBeenCalledTimes(2);
  await act(async () => {
    callback([{ isIntersecting: false }]);
  });
  expect(pause).toHaveBeenCalledTimes(2);
});

test("keeps the second video in sync with the first", async () => {
  const { container } = render(<Hero profile={profile} hero={hero} />);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  const [a, b] = container.querySelectorAll("video");
  a.currentTime = 5;
  b.currentTime = 0;
  fireEvent(a, new Event("timeupdate"));
  expect(b.currentTime).toBe(5);
  a.currentTime = 5.1;
  fireEvent(a, new Event("timeupdate"));
  expect(b.currentTime).toBe(5);
});
