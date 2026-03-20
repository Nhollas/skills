---
title: Reset Handlers and Clear Storage Between Tests
impact: CRITICAL
tags: msw, reset, isolation, cleanup, moto
---

## Reset Handlers and Clear Storage Between Tests

**Impact: CRITICAL**

**Why:** Test isolation is non-negotiable. If one test's handlers leak into the next, you get order-dependent failures that are painful to debug — the test passes in isolation but fails in a suite, or vice versa. The MOTO principle only works when each test starts with a clean boundary: no leftover handlers, no stale storage.

**How:** Reset MSW handlers and clear browser storage after every test. This belongs in the global browser setup file alongside the worker start, so it's automatic — you never forget and every test gets clean state.

**Incorrect (no cleanup between tests):**

```typescript
beforeAll(async () => {
  await browserWorker.start({ onUnhandledRequest: "error", quiet: true });
});
// Missing afterEach — handlers accumulate across tests
```

**Correct (handlers reset and storage cleared after each test):**

```typescript
afterEach(() => {
  browserWorker.resetHandlers();
  window.sessionStorage.clear();
});

afterAll(() => {
  browserWorker.stop();
});
```
