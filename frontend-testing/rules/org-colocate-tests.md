---
title: Colocate Tests with Source
impact: MEDIUM
tags: organization, colocation, file-structure
---

## Colocate Tests with Source

**Impact: MEDIUM**

**Why:** When tests live in a separate directory tree, it's easy to lose track of which components have coverage and which don't. Colocation makes missing coverage immediately visible in the file tree and keeps related code close together for navigation.

**How:** Place test files next to the source files they test. A component at `src/components/user-card.tsx` gets its test at `src/components/user-card.test.tsx`. Test support infrastructure (fixtures, page objects, MSW setup) lives in a dedicated shared directory since it serves multiple test files.

**Incorrect (separate test directory mirrors source tree):**

```
src/components/user-card.tsx
src/components/search-bar.tsx
__tests__/components/user-card.test.tsx    # Far from the source
__tests__/components/search-bar.test.tsx
```

**Correct (tests next to source, support files in a shared directory):**

```
src/components/user-card.tsx
src/components/user-card.test.tsx          # Right next to it
src/components/search-bar.tsx
src/components/search-bar.test.tsx
```
