---
title: Compute aria-label from Data for Dynamic Content
impact: HIGH
tags: markup, dynamic, aria-label, state
---

## Compute aria-label from Data for Dynamic Content

**Impact: HIGH**

When content or state is dynamic, compute the `aria-label` from the data so tests can locate elements by their current meaning. This is especially useful for status indicators, progress items, and expandable sections where the label changes based on state.

**Incorrect (static label that doesn't reflect state):**

```tsx
<button aria-label="Toggle" onClick={toggle}>
  {isLoading ? "Loading..." : "Submit"}
</button>

<li className="task-item">
  <span className={`status-${task.status}`} />
  {task.label}
</li>
```

**Correct (label reflects current state or content):**

```tsx
<button aria-label={isLoading ? "Loading..." : "Submit"}>
  {isLoading ? "Loading..." : "Submit"}
</button>

<li aria-label={task.label}>
  <span role="img" aria-label={task.status} />
  {task.label}
</li>
```

Tests can then find the element by its current state:

```typescript
page.getByRole("button", { name: "Loading..." })
page.getByRole("listitem", { name: "Sync database" })
```
