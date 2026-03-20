---
title: Locate Elements by Role Within UI Regions
impact: CRITICAL
tags: locators, getByRole, scoping, regions, markup, resilience
---

## Locate Elements by Role Within UI Regions

**Impact: CRITICAL**

**Why:** Tests should query elements the same way a user finds them — by what they are and where they are on the page. A user doesn't think "click the element with class `btn-primary`", they think "click the Submit button in the contact form." Locators that mirror this mental model survive refactors, because markup implementation can change while the role and region stay the same.

**How:** Combine `getByRole` with region scoping. First find the region, then find the element within it. This prevents false matches when the same role appears in multiple parts of the page (e.g., lists in both a sidebar and main content area).

**Incorrect (unscoped, coupled to implementation):**

```typescript
// CSS selector — breaks when class names change
page.locator(".sidebar .task-list li")

// Unscoped role — could match items in sidebar, footer, or main content
page.getByRole("listitem", { name: "Settings" })
```

**Correct (scoped by region, located by role):**

```typescript
// Find the region first, then the element within it
page.getByRole("navigation", { name: "Main menu" })
    .getByRole("listitem", { name: "Settings" })

// Deeper scoping for complex layouts
page.getByRole("region", { name: "Recent orders" })
    .getByRole("list")
    .getByRole("listitem")
    .filter({ hasText: "Order #1234" })
```

**When markup doesn't support this:** If a component uses plain `<div>`s without semantic roles or accessible names, suggest targeted improvements — use semantic elements (`section`, `nav`, `ul`, `article`), add `aria-label` for regions, and compute labels from data for dynamic content. Keep suggestions minimal: only what's needed to make the locator strategy work.
