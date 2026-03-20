---
title: Use Semantic HTML with aria-label
impact: HIGH
tags: markup, accessibility, semantic, aria-label
---

## Use Semantic HTML with aria-label

**Impact: HIGH**

Every interactive or identifiable region in a component should be locatable through the accessibility tree. Use semantic HTML elements (`article`, `button`, `aside`, `section`, `ul`, `li`) and give them findable names via `aria-label`. This makes components testable without `data-testid` while simultaneously improving accessibility.

**Incorrect (divs with no semantic meaning):**

```tsx
<div className="message user-message">
  <div className="message-content">{content}</div>
</div>

<div className="sidebar">
  <div className="task-list">
    <div className="task-item">{task.label}</div>
  </div>
</div>
```

**Correct (semantic elements with accessible names):**

```tsx
<article aria-label="User message">
  <p>{content}</p>
</article>

<aside aria-label="Background tasks">
  <ul>
    <li aria-label={task.label}>{task.label}</li>
  </ul>
</aside>
```

For regions that need to announce updates (e.g., a live conversation), add live region attributes:

```tsx
<div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
  {messages.map(msg => /* ... */)}
</div>
```
