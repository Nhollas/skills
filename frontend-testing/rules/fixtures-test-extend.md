---
title: Use the Builder Pattern for Typed Fixtures
impact: HIGH
tags: fixtures, vitest, test.extend, typing, builder
---

## Use the Builder Pattern for Typed Fixtures

**Impact: HIGH**

**Why:** `beforeEach`/`afterEach` chains create implicit ordering and shared mutable state — when something breaks, you have to trace through hook execution order to understand what happened. Declarative fixtures make dependencies explicit, only run when a test actually uses them, and clean up automatically.

**How:** Use Vitest's builder pattern (`.extend('name', ...)`) to create fixtures with automatic type inference. Each `.extend()` call adds one fixture, and the return type is inferred from the function — no manual interface needed.

**Incorrect (manual setup/teardown in hooks):**

```typescript
let myPage: MyPageObject;

beforeEach(async () => {
  await render(<MyComponent />);
  myPage = myPageObject(page);
});
```

**Correct (builder pattern with automatic type inference):**

```typescript
import { test as base } from "vitest";

export const test = base
  .extend("myPage", async () => {
    await render(<MyComponent />);
    return myPageObject(page);
  });
```

When a fixture needs cleanup, use the `onCleanup` callback:

```typescript
export const test = base
  .extend("myPage", async ({}, { onCleanup }) => {
    const result = render(<MyComponent />);
    onCleanup(() => result.unmount());
    return myPageObject(page);
  });
```

Export both `test` and `expect` from the fixture file so tests have a single import source.
