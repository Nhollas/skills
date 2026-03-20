---
title: Name Tests by Observable Behavior
impact: MEDIUM
tags: organization, naming, behavior, readability
---

## Name Tests by Observable Behavior

**Impact: MEDIUM**

**Why:** Tests serve as living documentation. If someone can read just the test names and understand what the feature does, the tests are pulling double duty — verifying behavior _and_ documenting it. Implementation-focused names ("should call setIsExpanded") couple the documentation to internals and become misleading when the implementation changes.

**How:** Name tests by what a user would observe, not what the code does internally. Group with `describe` blocks by feature, ordered from basic scenarios to edge cases. When a test fails, its name should immediately tell you what broke from the user's perspective.

**Incorrect (implementation-focused names):**

```typescript
describe("SearchBar", () => {
  test("should call setIsExpanded", async () => { /* ... */ });
  test("updates the results state array", async () => { /* ... */ });
  test("triggers useEffect cleanup", async () => { /* ... */ });
});
```

**Correct (behavior-focused names):**

```typescript
describe("SearchBar - filtering results", () => {
  // Basic scenario first
  test("displays matching results as the user types", async () => { /* ... */ });

  // Interaction during async
  test("shows loading indicator while fetching results", async () => { /* ... */ });

  // Edge case last
  test("displays empty state when no results match", async () => { /* ... */ });
});
```

A reader should be able to understand what the feature does just by reading the test names, without looking at the test bodies.
