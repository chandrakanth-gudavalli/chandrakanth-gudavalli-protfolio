import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CopyEmail from "./CopyEmail";

const EMAIL = "someone@example.com";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function stubClipboard(writeText) {
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
}

test("is a button, not a mailto link", () => {
  render(<CopyEmail email={EMAIL} label="email" />);
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByRole("button", { name: /email/ })).toHaveAttribute(
    "title",
    `copy ${EMAIL}`,
  );
});

test("copies the address and confirms, then reverts", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn(() => Promise.resolve());
  stubClipboard(writeText);
  render(<CopyEmail email={EMAIL} label="email" />);
  await act(async () => fireEvent.click(screen.getByRole("button")));
  expect(writeText).toHaveBeenCalledWith(EMAIL);
  expect(screen.getByRole("button")).toHaveTextContent("copied ✓");
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByRole("button")).toHaveTextContent("email");
});

test("shows the address when the clipboard is unavailable", async () => {
  stubClipboard(() => Promise.reject(new Error("denied")));
  render(<CopyEmail email={EMAIL} label="email" />);
  await act(async () => fireEvent.click(screen.getByRole("button")));
  expect(screen.getByText(EMAIL)).toBeInTheDocument();
});
