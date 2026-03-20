---
title: Use getByRole with Accessible Names
impact: CRITICAL
tags: locators, getByRole, resilience, roles
---

## Use getByRole with Accessible Names

**Impact: CRITICAL**

Locators built on roles and accessible names are decoupled from markup implementation. CSS selectors break when class names change, tag selectors break when element types change, and `data-testid` creates a parallel naming system that has to be maintained alongside the real UI. Role-based locators survive all of these refactors because they describe what an element *is*, not how it's implemented. They force you to think about elements from a user's perspective — if a user would call it a button, the test finds it as a button. Better accessibility is a bonus, not the goal.

**Incorrect (coupled to markup implementation):**

```typescript
// CSS selector — breaks when class names change
page.locator(".search-bar input")

// data-testid — parallel naming system that drifts from the real UI
page.locator("[data-testid='search-input']")

// Tag selector — breaks when element type changes
page.locator("input")
```

**Correct (locators describe what the element is, not how it's built):**

```typescript
page.getByRole("searchbox", { name: "Search" })
page.getByRole("button", { name: "Submit" })
page.getByRole("navigation", { name: "Main menu" })
page.getByRole("list", { name: "Search results" })
page.getByRole("complementary", { name: "Sidebar" })
```
