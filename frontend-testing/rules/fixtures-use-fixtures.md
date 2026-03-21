---
title: Use Vitest Fixtures for Test Setup
impact: HIGH
tags: fixtures, vitest, test.extend, page-objects
---

## Use Vitest Fixtures for Test Setup

**Impact: HIGH**

**Why:** Fixtures keep all setup in one clean place, work naturally with page objects, and keep test files slim and focused on behavior. Instead of `beforeEach`/`afterEach` chains with shared mutable state, fixtures are declarative — each test destructures only what it needs, and Vitest handles ordering and cleanup.

**How:** Use Vitest's `.extend('name', ...)` builder pattern to define fixtures. Page fixtures should return an object with a `mount()` function so the test controls when rendering happens — this lets tests set up MSW handlers or other state before the component mounts.

**Incorrect (setup scattered across hooks):**

```typescript
let myPage: MyPageObject;

beforeEach(async () => {
  await render(<MyComponent />);
  myPage = myPageObject(page);
});
```

**Correct (fixture with deferred mounting):**

```typescript
import { test as base } from "vitest";

export const test = base
  .extend("myPage", async () => ({
    async mount() {
      await render(<MyComponent />);
      return myPageObject(page);
    },
  }));
```

```typescript
import { test, expect } from "./fixture";

test("displays items after loading", async ({ myPage }) => {
  browserWorker.use(http.get("/api/items", () => HttpResponse.json([...])));
  const page = await myPage.mount();
  await page.expectItemsVisible();
});
```

Export both `test` and `expect` from the fixture file so tests have a single import source.
