import { render, screen } from "@testing-library/react";
import App from "./App";
import { sections } from "./content";

test("renders the owner's name as the page heading", async () => {
  render(<App />);
  await screen.findByRole("button", { name: "pause video" });
  await screen.findByRole("button", { name: "pause reconstruction" });
  expect(
    screen.getByRole("heading", { level: 1, name: "Chandrakanth Gudavalli" }),
  ).toBeInTheDocument();
});

test("every section id from content has a matching element", async () => {
  render(<App />);
  await screen.findByRole("button", { name: "pause reconstruction" });
  for (const s of sections) {
    expect(document.getElementById(s.id), s.id).not.toBeNull();
  }
});
