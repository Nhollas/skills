---
title: Use onUnhandledRequest "error"
impact: CRITICAL
tags: msw, unhandled, strict, network, moto
---

## Use onUnhandledRequest "error"

**Impact: CRITICAL**

**Why:** The MOTO principle says mock at the boundary — but that only works if every boundary interaction is accounted for. If an unhandled request silently falls through, the test can hang, timeout, or produce confusing results without ever telling you a handler is missing. Strict mode turns that silent failure into an immediate, clear error.

**How:** Setting `onUnhandledRequest: "error"` on the MSW worker means any HTTP request without a matching handler fails the test instantly. This catches missing handlers, URL typos, and unintended side effects.

**Incorrect (silent fallthrough hides missing handlers):**

```typescript
beforeAll(async () => {
  await browserWorker.start({ quiet: true });
});
```

**Correct (unhandled requests fail the test immediately):**

```typescript
beforeAll(async () => {
  await browserWorker.start({
    onUnhandledRequest: "error",
    quiet: true,
  });
});
```

This belongs in the global browser setup file (the one referenced by vitest's `setupFiles`) so it applies to every test without needing per-file configuration.
