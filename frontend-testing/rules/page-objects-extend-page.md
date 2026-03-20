---
title: Extend BrowserPage with Object.assign
impact: HIGH
tags: page-objects, BrowserPage, typing, composition
---

## Extend BrowserPage with Object.assign

**Impact: HIGH**

**Why:** A page object should centralize domain interactions without hiding the underlying Playwright API. If the page object wraps the page, tests lose access to low-level methods for one-off queries that don't warrant a page object method. You want both: a typed domain API for common interactions, and escape-hatch access to raw Playwright when needed.

**How:** Use `Object.assign(page, self)` to extend the browser page with domain methods. The return type is inferred — no separate interface needed.

**Incorrect (wraps page, losing access to raw methods):**

```typescript
export function searchPageObject(page: BrowserPage) {
  return {
    search: async (query: string) => { /* ... */ },
    expectResults: async () => { /* ... */ },
    // Can't access page.getByRole() etc. from tests
  };
}
```

**Correct (extends page with domain methods):**

```typescript
export type SearchPageObject = ReturnType<typeof searchPageObject>;

export function searchPageObject(page: BrowserPage) {
  const self = {
    getSearchInput: () =>
      page.getByRole("searchbox", { name: "Search" }),
    search: async (query: string) => {
      await self.getSearchInput().fill(query);
      await self.getSearchInput().press("Enter");
    },
  };

  return Object.assign(page, self);
}
```

This means a test can do `searchPage.search("hello")` and also fall back to `searchPage.getByRole(...)` for one-off queries that don't warrant a page object method.
