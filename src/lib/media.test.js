import { safePlay } from "./media";

const video = (play) => ({ play });

test("resolves true when play succeeds or returns nothing", async () => {
  await expect(safePlay(video(() => Promise.resolve()))).resolves.toBe(true);
  await expect(safePlay(video(() => undefined))).resolves.toBe(true);
});

test("an AbortError rejection (interrupted by pause) is not blocked", async () => {
  const err = new DOMException("interrupted", "AbortError");
  await expect(safePlay(video(() => Promise.reject(err)))).resolves.toBe(true);
});

test("NotAllowedError, other rejections and sync throws resolve false", async () => {
  const blocked = new DOMException("blocked", "NotAllowedError");
  await expect(safePlay(video(() => Promise.reject(blocked)))).resolves.toBe(
    false,
  );
  await expect(
    safePlay(video(() => Promise.reject(new Error("x")))),
  ).resolves.toBe(false);
  await expect(
    safePlay(
      video(() => {
        throw new Error("sync");
      }),
    ),
  ).resolves.toBe(false);
});
