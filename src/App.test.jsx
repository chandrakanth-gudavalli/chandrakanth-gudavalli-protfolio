import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the owner's name as the page heading", async () => {
  render(<App />);
  await screen.findByRole("button", { name: "pause video" });
  await screen.findByRole("button", { name: "pause reconstruction" });
  expect(
    screen.getByRole("heading", { level: 1, name: "Chandrakanth Gudavalli" }),
  ).toBeInTheDocument();
});
