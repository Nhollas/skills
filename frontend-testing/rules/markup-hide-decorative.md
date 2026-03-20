---
title: Hide Decorative Elements with aria-hidden
impact: HIGH
tags: markup, decorative, aria-hidden, icons, svg
---

## Hide Decorative Elements with aria-hidden

**Impact: HIGH**

Icons, decorative SVGs, and visual separators that don't convey meaning should be hidden from the accessibility tree with `aria-hidden="true"`. This prevents them from cluttering locator queries and creating confusing accessible names. If an icon carries meaning (e.g., a status indicator), give it `role="img"` and an `aria-label` instead.

**Incorrect (decorative icon pollutes the accessibility tree):**

```tsx
<button>
  <ArrowUpIcon />
  Send message
</button>
```

**Correct (decorative icon hidden from the accessibility tree):**

```tsx
<button>
  <ArrowUpIcon aria-hidden="true" />
  Send message
</button>
```

For meaningful icons where the icon IS the information, give it an accessible name instead:

```tsx
<span role="img" aria-label={status}>
  <StatusDot color={statusColor} />
</span>
```
