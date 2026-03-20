---
title: Extend the Fixture Chain Per Feature
impact: HIGH
tags: fixtures, organization, features, extension-chain
---

## Extend the Fixture Chain Per Feature

**Impact: HIGH**

**Why:** A single monolithic fixture chain that defines every page object and setup in one place creates coupling between unrelated features. But creating completely independent fixture files duplicates shared setup (rendering, MSW, etc.). The extension chain solves this naturally — define shared infrastructure once, then extend it per feature.

**How:** Create a base fixture chain with shared infrastructure, then import and extend it in feature-specific fixture files. Each feature adds only its own page object to the chain. Tests import from their feature's fixture file.

**Incorrect (one file defines everything):**

```typescript
// test-fixtures.tsx — grows unbounded
export const test = base
  .extend("dashboardPage", async () => { /* ... */ })
  .extend("settingsPage", async () => { /* ... */ })
  .extend("adminPage", async () => { /* ... */ });
```

**Correct (shared base, extended per feature):**

```typescript
// base-fixture.tsx — shared rendering infrastructure
import { test as base } from "vitest";

export const test = base
  .extend("app", async ({}, { onCleanup }) => {
    const result = render(<App />);
    onCleanup(() => result.unmount());
    return page;
  });
```

```typescript
// dashboard-fixture.tsx — extends the chain with feature-specific fixtures
import { test as base } from "./base-fixture";

export const test = base
  .extend("dashboardPage", async ({ app }) => {
    return dashboardPageObject(app);
  });
```

```typescript
// settings-fixture.tsx — same base, different feature
import { test as base } from "./base-fixture";

export const test = base
  .extend("settingsPage", async ({ app }) => {
    return settingsPageObject(app);
  });
```

Each test file imports from its feature's fixture:

```typescript
import { test, expect } from "./dashboard-fixture";

test("displays project list", async ({ dashboardPage }) => {
  await dashboardPage.expectProjectsVisible();
});
```

The shared base handles rendering and cleanup once. Features only add what's unique to them.
