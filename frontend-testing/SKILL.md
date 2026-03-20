---
name: frontend-testing
description: Frontend testing conventions using Vitest browser mode, Playwright, MSW, and accessibility-first patterns. Use this skill whenever writing, reviewing, or setting up frontend tests, creating test infrastructure (fixtures, page objects, MSW handlers), adding testability to React components, or when the user asks about testing strategy. Also trigger when the user creates a new component and needs test coverage, asks how to mock APIs in tests, or mentions page objects, test fixtures, or locator strategies.
---

# Frontend Testing Best Practices

A systematic set of rules for writing frontend tests that are resilient to refactoring, readable as behavior specifications, and fast to maintain.

The stack is Vitest (browser mode with Playwright) + MSW + React. The underlying ideas — semantic locators, page objects, fixture composition — are transferable beyond this stack.

## When to Apply

Reference these rules when:
- Writing new browser or unit tests for React components
- Setting up test infrastructure (fixtures, page objects, MSW handlers)
- Adding testability to component markup (aria attributes, semantic HTML)
- Reviewing tests for fragility, readability, or maintainability
- Mocking APIs or async data sources in tests

## Prerequisites

These rules assume the following stack is in place. If any piece is missing, set it up before applying the rules.

**Packages:**
- `vitest` with `@vitest/browser-playwright` and `playwright` for browser tests
- `vitest-browser-react` for React component rendering in browser tests
- `@vitejs/plugin-react` for JSX support in the browser project
- `msw` (Mock Service Worker) for network-level API mocking

**Project structure:**
- Dual vitest projects: `unit` (Node, `*.test.ts`) and `browser` (Playwright, `*.test.tsx`)
- A global browser setup file (referenced by vitest's `setupFiles`) handling MSW lifecycle
- A shared directory for test support files (page objects, fixtures, MSW helpers)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Locator Strategy | CRITICAL | `locators-` |
| 2 | MSW Mocking | CRITICAL | `msw-` |
| 3 | Page Objects | HIGH | `page-objects-` |
| 4 | Component Markup | HIGH | `markup-` |
| 5 | Fixtures | HIGH | `fixtures-` |
| 6 | Test Organization | MEDIUM | `org-` |

## Quick Reference

### 1. Locator Strategy (CRITICAL)

- `locators-use-roles` - Use getByRole with accessible names, not CSS selectors or data-testid
- `locators-scope-within-regions` - Chain locators to scope queries within parent regions
- `locators-data-testid-exception` - Only use data-testid for state with no accessibility representation

### 2. MSW Mocking (CRITICAL)

- `msw-strict-unhandled` - Use onUnhandledRequest: "error" to catch unexpected requests
- `msw-custom-resolvers` - Use composable higher-order resolvers for request matching
- `msw-per-test-overrides` - Use browserWorker.use() for scenario-specific handlers
- `msw-reset-between-tests` - Reset handlers and clear storage after each test

### 3. Page Objects (HIGH)

- `page-objects-method-naming` - Prefix locators with get*, assertions with expect*, and use imperative action names
- `page-objects-extend-page` - Extend BrowserPage with Object.assign for a typed domain API
- `page-objects-scoped-locators` - Build locators that scope within parent elements

### 4. Component Markup (HIGH)

- `markup-semantic-elements` - Use semantic HTML elements with aria-label for testable surfaces
- `markup-dynamic-labels` - Compute aria-label from data for dynamic content
- `markup-hide-decorative` - Hide decorative elements with aria-hidden="true"

### 5. Fixtures (HIGH)

- `fixtures-test-extend` - Use test.extend<T>() for typed, composable fixtures
- `fixtures-composition` - Compose fixtures through dependency declarations
- `fixtures-per-feature` - Create fixture files per feature area

### 6. Test Organization (MEDIUM)

- `org-colocate-tests` - Colocate test files with source, shared support files in a dedicated directory
- `org-behavior-names` - Name tests by observable behavior, not implementation details
- `org-factory-functions` - Use factory functions with overridable defaults for test data
- `org-vitest-dual-projects` - Separate unit and browser projects in vitest config

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/locators-use-roles.md
rules/msw-strict-unhandled.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
