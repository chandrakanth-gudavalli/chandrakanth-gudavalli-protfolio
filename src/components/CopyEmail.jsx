import { useEffect, useState } from "react";

// Copies the address instead of opening a mail app. If the clipboard is
// unavailable, shows the address so it can be selected by hand.
export default function CopyEmail({ email, label }) {
  const [state, setState] = useState("idle"); // idle | copied | failed

  useEffect(() => {
    if (state !== "copied") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button
      type="button"
      className="copy-email"
      title={`copy ${email}`}
      onClick={copy}
    >
      <span aria-live="polite">
        {state === "copied" ? "copied ✓" : state === "failed" ? email : label}
      </span>
    </button>
  );
}
