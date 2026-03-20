---
title: Build Scoped Locators in Page Objects
impact: HIGH
tags: page-objects, scoping, locators, self-reference
---

## Build Scoped Locators in Page Objects

**Impact: HIGH**

Page object locators should scope within parent elements using self-references. This prevents false matches when the same role appears in multiple regions, and it documents the expected DOM hierarchy in a readable way.

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

The self-referencing pattern (`self.getResultsPanel()`) means if the panel's locator changes, every dependent locator updates automatically.
