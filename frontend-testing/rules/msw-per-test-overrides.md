---
title: Define Happy-Path Handlers Centrally, Override Per-Test
impact: CRITICAL
tags: msw, overrides, per-test, handlers, moto
---

## Define Happy-Path Handlers Centrally, Override Per-Test

**Impact: CRITICAL**

**Why:** Most tests need the same baseline API behavior — successful responses with sensible default data. If every test sets up its own happy-path handlers, you get duplication and drift. But if shared handlers use conditional logic to serve both happy and error paths, it becomes unclear which responses belong to which scenario. The solution is a two-layer approach: a shared baseline for the common case, and per-test overrides for specific scenarios.

**How:** Define happy-path handlers in a shared module that acts as the default baseline for all tests. When a specific test needs different behavior (errors, edge cases, specific data), override with `browserWorker.use()` — these runtime handlers take precedence over the defaults and are automatically cleaned up by `resetHandlers()` in afterEach.

**Shared handlers module (happy-path baseline):**

```typescript
// src/test/msw/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "u-1", name: "Alice", role: "admin" },
      { id: "u-2", name: "Bob", role: "viewer" },
    ]);
  }),
  http.get("/api/projects", () => {
    return HttpResponse.json([
      { id: "p-1", name: "Website Redesign", status: "active" },
    ]);
  }),
];
```

These are registered in the browser setup file via `setupWorker(handlers)` so every test starts with working API responses.

**Incorrect (shared handlers with conditional logic):**

```typescript
http.get("/api/users", async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("error")) return HttpResponse.error();
  return HttpResponse.json([{ id: "u-1", name: "Alice" }]);
})
```

**Correct (per-test override for a specific scenario):**

```typescript
test("shows error when API fails", async ({ myPage }) => {
  browserWorker.use(
    http.get("/api/users", () => {
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }),
  );

  await myPage.expectErrorState();
});
```

For large projects, split the shared handlers by domain (`handlers/users.ts`, `handlers/projects.ts`) and combine them in an index file. This keeps each file focused while maintaining a single baseline for the test suite.
