---
title: Chain Locators to Scope Within Regions
impact: CRITICAL
tags: locators, scoping, chaining, regions
---

## Chain Locators to Scope Within Regions

**Impact: CRITICAL**

When the same role or text appears in multiple parts of the page, scoping prevents false matches and test brittleness. Chain locators from a parent region down to the specific element. This mirrors how a user navigates — they look within a section, not across the whole page.

**Incorrect (unscoped query could match wrong element):**

```typescript
// "listitem" could match items in the sidebar, footer, or main content
page.getByRole("listitem", { name: "Settings" })
```

**Correct (scoped within a specific region):**

```typescript
// Only matches within the navigation
page.getByRole("navigation", { name: "Main menu" })
    .getByRole("listitem", { name: "Settings" })
```

This pattern works at any depth:

```typescript
// Scope within a section, then within a list inside it
page.getByRole("region", { name: "Recent orders" })
    .getByRole("list")
    .getByRole("listitem")
    .filter({ hasText: "Order #1234" })
```
