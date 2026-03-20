---
title: Use browserWorker.use() for Scenario-Specific Handlers
impact: CRITICAL
tags: msw, overrides, per-test, handlers
---

## Use browserWorker.use() for Scenario-Specific Handlers

**Impact: CRITICAL**

Each test sets up its own handlers via `browserWorker.use()` to define the exact API behavior for that scenario. These runtime handlers take precedence over any default handlers and are automatically cleaned up by `resetHandlers()` in afterEach. This keeps each test self-contained — you can read a test and understand exactly what API responses it expects.

**Incorrect (shared handlers with conditional logic):**

```typescript
// Default handler tries to serve all tests
http.get("/api/users", async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("error")) return HttpResponse.error();
  return HttpResponse.json([{ id: "u-1", name: "Alice" }]);
})
```

**Correct (each test declares its own handler):**

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
