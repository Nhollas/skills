---
title: Compose Fixtures Through the Extension Chain
impact: HIGH
tags: fixtures, composition, dependencies, ordering, builder
---

## Compose Fixtures Through the Extension Chain

**Impact: HIGH**

**Why:** When setup has ordering requirements (e.g., the component must render before the page object can be created), implicit `beforeEach` ordering is fragile and hard to reason about. The builder pattern makes dependencies explicit — each `.extend()` call can access fixtures defined earlier in the chain, and Vitest resolves the order automatically.

**How:** Chain `.extend()` calls so that later fixtures can depend on earlier ones by including them in their parameter list.

**Incorrect (one fixture does everything, no composition):**

```typescript
export const test = base
  .extend("myPage", async () => {
    await render(<MyComponent />);
    return myPageObject(page);
  });
```

**Correct (fixtures compose through the chain):**

```typescript
export const test = base
  .extend("renderedApp", async ({}, { onCleanup }) => {
    const result = render(<MyComponent />);
    onCleanup(() => result.unmount());
    return page;
  })
  .extend("myPage", async ({ renderedApp }) => {
    return myPageObject(renderedApp);
  });
```

The dependency is explicit: `myPage` receives `renderedApp`, so Vitest guarantees the render happens first. Each fixture has a single responsibility, and you can read the chain to understand setup order.
