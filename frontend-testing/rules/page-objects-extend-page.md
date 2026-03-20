---
title: Extend BrowserPage with Object.assign
impact: HIGH
tags: page-objects, BrowserPage, typing, composition
---

## Extend BrowserPage with Object.assign

**Impact: HIGH**

A page object should add domain methods without hiding the underlying Playwright API. Using `Object.assign(page, self)` gives tests both the typed domain API (via the page object) and escape-hatch access to low-level Playwright methods when needed. The return type is inferred — no separate interface needed.

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
