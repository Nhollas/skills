---
title: Build Scoped Locators in Page Objects
impact: HIGH
tags: page-objects, scoping, locators, self-reference
---

## Build Scoped Locators in Page Objects

**Impact: HIGH**

**Why:** Page objects that use flat, unscoped locators are vulnerable to the same false-match problem as unscoped locators in tests. When the same role appears in multiple regions, a flat locator can match the wrong element. Scoping within parent elements in the page object means the scoping logic lives in one place and every test that uses the page object gets it for free.

**How:** Build locators that chain through parent elements using self-references. The `self.getParent()` pattern means if the parent's locator changes, every dependent locator updates automatically.

**Incorrect (flat locators with no scoping):**

```typescript
const self = {
  getResultItem: (text: string) =>
    page.getByRole("listitem").filter({ hasText: text }),
  getResultCount: () =>
    page.getByText(/\d+ results/),
};
```

**Correct (locators scope through parent regions):**

```typescript
const self = {
  getResultsPanel: () =>
    page.getByRole("region", { name: "Search results" }),

  // Scoped within results panel
  getResultItem: (text: string) =>
    self.getResultsPanel()
        .getByRole("listitem")
        .filter({ hasText: text }),

  // Scoped within results panel
  getResultCount: () =>
    self.getResultsPanel()
        .getByText(/\d+ results/),
};
```
