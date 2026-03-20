---
title: Name Tests by Observable Behavior
impact: MEDIUM
tags: organization, naming, behavior, readability
---

## Name Tests by Observable Behavior

**Impact: MEDIUM**

Test names should describe what a user would observe, not what the code does internally. When a test fails, its name should immediately tell you what broke from the user's perspective. Group with `describe` blocks by feature, ordered from basic scenarios to edge cases.

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
