---
title: Use onUnhandledRequest "error"
impact: CRITICAL
tags: msw, unhandled, strict, network
---

## Use onUnhandledRequest "error"

**Impact: CRITICAL**

Every network request in tests must be explicitly accounted for. Setting `onUnhandledRequest: "error"` ensures that if a component makes an unexpected API call, the test fails immediately with a clear error rather than hanging, timing out, or producing confusing results. This catches missing handlers, typos in URLs, and unintended side effects.

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
