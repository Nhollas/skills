---
title: Compose Fixtures Through Dependencies
impact: HIGH
tags: fixtures, composition, dependencies, ordering, auto
---

## Compose Fixtures Through Dependencies

**Impact: HIGH**

Fixtures declare dependencies on other fixtures by including them in their parameter list. Vitest resolves the dependency graph automatically — if `myPage` depends on `apiMock`, the mock fixture runs first. This makes setup order explicit and prevents the "which beforeEach runs first?" confusion.

When a fixture needs to run for its side effects but its value isn't consumed by the dependent fixture, use `auto: true` instead of destructuring an unused parameter.

**Incorrect (implicit ordering via hook execution order):**

```typescript
let apiMock: ApiMock;

// Does this run before or after the render hook in another file?
beforeEach(() => {
  apiMock = createApiMock();
  browserWorker.use(http.get("/api/data", () => apiMock.response));
});
```

**Correct (auto fixture for side-effect setup, explicit dependency when value is consumed):**

```typescript
import { test as base } from "vitest";

export const test = base.extend<MyPageFixtures>({
  // auto: true ensures this runs before every test without needing to be destructured
  apiMock: [async ({}, use) => {
    const mock = createApiMock();
    browserWorker.use(http.get("/api/data", () => mock.response));
    await use(mock);
  }, { auto: true }],

  // myPage doesn't need to declare apiMock — auto handles it
  myPage: async ({}, use) => {
    await render(<MyComponent />);
    await use(myPageObject(page));
  },
});
```

Use `auto: true` when a fixture provides infrastructure (API mocks, auth state, browser storage) that must be in place but isn't directly referenced. Reserve explicit parameter dependencies for when the dependent fixture actually uses the value.
