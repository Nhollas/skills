---
title: Use Factory Functions with Overridable Defaults
impact: MEDIUM
tags: organization, factories, test-data, defaults, synthetic-data
---

## Use Factory Functions with Overridable Defaults

**Impact: MEDIUM**

**Why:** Tests should use synthetic data, not real data — this avoids privacy concerns and makes tests repeatable. But constructing full objects in every test buries the scenario under noise. Factory functions produce valid synthetic objects with sensible defaults, letting each test only specify the fields that matter for its scenario. This keeps tests focused and makes it obvious what's being tested.

**How:** Create factory functions that return valid objects with overridable defaults via spread. Keep factories local to the test file when only used there; extract to the shared support directory when used across files.

**Incorrect (full object construction in every test):**

```typescript
test("renders user name", async () => {
  render(
    <UserCard
      user={{
        id: "u-1",
        name: "Alice",
        email: "alice@example.com",
        role: "admin",
        createdAt: "2026-01-01T00:00:00.000Z",
      }}
    />,
  );
});
```

**Correct (factory with override for the relevant field):**

```typescript
function createUser(overrides?: Partial<User>): User {
  return {
    id: "u-1",
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("renders user name", async () => {
  render(<UserCard user={createUser()} />);
});

test("shows badge for viewer role", async () => {
  render(<UserCard user={createUser({ role: "viewer" })} />);
});
```
