---
title: Colocate Tests with Source
impact: MEDIUM
tags: organization, colocation, file-structure
---

## Colocate Tests with Source

**Impact: MEDIUM**

Place test files next to the source files they test. A component at `src/components/user-card.tsx` gets its test at `src/components/user-card.test.tsx`. This makes it immediately obvious when a component lacks coverage and keeps related code close in the file tree.

Test support infrastructure (fixtures, page objects, MSW setup, contract helpers) lives in a dedicated shared directory since it serves multiple test files.

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

The shared support directory (wherever the project places it) contains infrastructure that crosses feature boundaries: the MSW worker, page objects, fixture files, and API contract helpers.
