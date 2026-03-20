---
title: Reset Handlers and Clear Storage Between Tests
impact: CRITICAL
tags: msw, reset, isolation, cleanup
---

## Reset Handlers and Clear Storage Between Tests

**Impact: CRITICAL**

Handlers added via `browserWorker.use()` persist until explicitly reset. Without cleanup, one test's handlers leak into the next, causing order-dependent failures that are painful to debug. Reset handlers and clear any browser storage after every test.

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

This belongs in the global browser setup file alongside the worker start. Having it global means you never forget — every test gets clean state automatically.
