---
title: Use Custom Higher-Order Resolvers for Request Matching
impact: CRITICAL
tags: msw, resolvers, matching, precision, moto
---

## Use Custom Higher-Order Resolvers for Request Matching

**Impact: CRITICAL**

**Why:** MOTO says to mock at the boundary — but a handler that only matches on URL is a loose boundary. It responds to _any_ request to that endpoint regardless of what the component actually sent. This gives false confidence: the test passes even if the component sends the wrong body or is missing an auth header. A precise boundary mock should verify what crosses the boundary, not just where it goes.

**How:** Higher-order resolvers add matching conditions (body content, headers, query params) so the handler only fires when the request is correct. If the component sends the wrong data, the request falls through and MSW's unhandled request error catches it. These are custom utility functions you write and keep in your shared MSW helpers — they wrap MSW's `HttpResponseResolver` type, returning `undefined` when the predicate doesn't match so MSW tries the next handler.

**Incorrect (matches any POST regardless of what was sent):**

```typescript
http.post("/api/users", () => {
  return HttpResponse.json({ id: "u-1" }, { status: 201 });
})
```

**Correct (handler only fires when the request body matches):**

```typescript
http.post(
  "/api/users",
  withJsonBody({ name: "Alice", role: "admin" }, () => {
    return HttpResponse.json({ id: "u-1" }, { status: 201 });
  }),
)
```

A `withJsonBody` resolver does partial (subset) matching — the request body must contain at least the specified fields, but can have additional ones. A minimal implementation:

```typescript
import type { HttpResponseResolver } from "msw";

export function withJsonBody(
  expected: Record<string, unknown>,
  resolver: HttpResponseResolver,
): HttpResponseResolver {
  return async (args) => {
    const actual = await args.request.clone().json();
    if (!isSubset(actual, expected)) return;
    return resolver(args);
  };
}
```

The same pattern works for headers, query params, or any other request property:

```typescript
export function withHeaders(
  predicate: (headers: Headers) => boolean,
  resolver: HttpResponseResolver,
): HttpResponseResolver {
  return (args) => {
    if (!predicate(args.request.headers)) return;
    return resolver(args);
  };
}
```

Resolvers compose together for multi-condition matching:

```typescript
http.post(
  "/api/users",
  withHeaders(
    (headers) => headers.get("Authorization") === "Bearer test-token",
    withJsonBody({ name: "Alice" }, () => {
      return HttpResponse.json({ id: "u-1" }, { status: 201 });
    }),
  ),
)
```
