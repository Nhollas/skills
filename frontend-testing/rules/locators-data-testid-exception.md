---
title: Only Use data-testid for Non-Visible State
impact: CRITICAL
tags: locators, data-testid, exceptions
---

## Only Use data-testid for Non-Visible State

**Impact: CRITICAL**

`data-testid` is a last resort, not a default. It couples tests to an attribute that exists purely for testing — a parallel naming system that drifts from the real UI and breaks the principle of locating elements by what they are. The only valid use case is asserting on state that has no user-facing representation: scroll position, animation phase, internal layout state. If you reach for `data-testid`, first ask whether the element can be found by its role and name instead.

**Incorrect (data-testid for an element that has a role):**

```tsx
// Component
<button data-testid="send-btn">Send message</button>

// Test
page.locator("[data-testid='send-btn']")
```

**Correct (role-based locator, data-testid only for non-visible state):**

```tsx
// Component — button is findable via role + name
<button aria-label="Send message">
  <SendIcon aria-hidden="true" />
</button>

// Test
page.getByRole("button", { name: "Send message" })
```

```tsx
// Exception: scroll position has no user-facing representation
<div data-testid="scroll-container" data-at-bottom={isAtBottom}>

// Test for internal scroll state
await expect
  .element(page.getByTestId("scroll-container"))
  .toHaveAttribute("data-at-bottom", "true")
```
