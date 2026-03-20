---
title: Use test.extend<T>() for Typed Composable Fixtures
impact: HIGH
tags: fixtures, vitest, test.extend, typing
---

## Use test.extend<T>() for Typed Composable Fixtures

**Impact: HIGH**

Vitest's `test.extend<T>()` creates typed fixtures that are available as destructured arguments in every test. This replaces fragile `beforeEach`/`afterEach` chains with declarative setup that's type-checked and automatically cleaned up. Fixtures only run when a test actually uses them.

**Incorrect (manual setup/teardown in hooks):**

```typescript
let myPage: MyPageObject;

beforeEach(async () => {
  await render(<MyComponent />);
  myPage = myPageObject(page);
});
```

**Correct (fixtures handle setup declaratively):**

```typescript
import { test as base } from "vitest";

export interface MyPageFixtures {
  myPage: MyPageObject;
}

export const test = base.extend<MyPageFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Vitest fixtures require destructuring
  myPage: async ({}, use) => {
    await render(<MyComponent />);
    await use(myPageObject(page));
  },
});
```

Export both `test` and `expect` from the fixture file so tests have a single import source.
