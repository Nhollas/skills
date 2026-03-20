---
title: Only Use data-testid for Non-Visible State
impact: CRITICAL
tags: locators, data-testid, exceptions
---

## Only Use data-testid for Non-Visible State

**Impact: CRITICAL**

**Why:** `data-testid` is a parallel naming system — it exists purely for testing and drifts from the real UI over time. Every `data-testid` you add is a maintenance liability that bypasses the principle of finding elements by what they are. The only valid use case is asserting on state that has no user-facing representation: scroll position, animation phase, internal layout state. If an element has a role and a name, there's no reason to reach for `data-testid`.

**How:** Before adding `data-testid`, ask: "Can this element be found by its role and accessible name?" If yes, use that. Reserve `data-testid` exclusively for non-visible state.

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
