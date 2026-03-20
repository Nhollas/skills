---
title: Create Fixture Files Per Feature Area
impact: HIGH
tags: fixtures, organization, features, separation
---

## Create Fixture Files Per Feature Area

**Impact: HIGH**

Each major feature area gets its own fixture file. This prevents a single monolithic fixture that grows to include every possible setup. Feature fixtures can share common infrastructure (MSW worker, browser setup) through the global setup while keeping feature-specific concerns isolated.

**Incorrect (one fixture file for everything):**

```typescript
import { test as base } from "vitest";

// fixtures.tsx — grows unbounded
export const test = base.extend<{
  dashboardPage: DashboardPageObject;
  settingsPage: SettingsPageObject;
  adminPage: AdminPageObject;
  apiMock: ApiMock;
  authToken: string;
  // ...50 more fixtures
}>({ /* ... */ });
```

**Correct (separate fixture files per feature):**

```
dashboard-page-fixture.tsx     # Dashboard feature fixtures
dashboard-page-object.ts       # Dashboard page object
settings-page-fixture.tsx      # Settings feature fixtures
settings-page-object.ts        # Settings page object
msw.ts                         # Shared MSW worker + resolvers
```

Each test file imports from its feature's fixture:

```typescript
// In a dashboard test file:
import { test } from "<path-to>/dashboard-page-fixture";

// In a settings test file:
import { test } from "<path-to>/settings-page-fixture";
```
