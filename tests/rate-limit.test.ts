import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/infrastructure/rate-limit";
import { RATE_LIMIT } from "@/lib/domain/contact";

describe("checkRateLimit (in-memory store)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clean up any state left by other tests in this process.
    resetRateLimit("1.2.3.4");
    resetRateLimit("5.6.7.8");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to MAX_REQUESTS in a window", () => {
    expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
    expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
    expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
  });

  it("blocks the 4th request and reports retryAfter", () => {
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");

    const blocked = checkRateLimit("1.2.3.4");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(RATE_LIMIT.WINDOW_MS / 1000);
  });

  it("keeps separate buckets per IP", () => {
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4").allowed).toBe(false);

    expect(checkRateLimit("5.6.7.8").allowed).toBe(true);
  });

  it("resets the window after WINDOW_MS elapses", () => {
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4").allowed).toBe(false);

    vi.advanceTimersByTime(RATE_LIMIT.WINDOW_MS + 1);
    expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
  });

  it("resetRateLimit clears the bucket", () => {
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    checkRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4").allowed).toBe(false);

    resetRateLimit("1.2.3.4");
    expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
  });
});
