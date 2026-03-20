---
name: frontend-testing
description: Frontend testing conventions using Vitest browser mode, Playwright, MSW, and accessibility-first patterns. Use this skill whenever writing, reviewing, or setting up frontend tests, creating test infrastructure (fixtures, page objects, MSW handlers), adding testability to React components, or when the user asks about testing strategy. Also trigger when the user creates a new component and needs test coverage, asks how to mock APIs in tests, or mentions page objects, test fixtures, or locator strategies.
metadata:
  author: nhollas
  version: 1.0.0
  tags: [testing, vitest, playwright, msw, react, accessibility]
---

# Frontend Testing Best Practices

A systematic set of rules for writing frontend tests that are resilient to refactoring, readable as behavior specifications, and fast to maintain.

The stack is Vitest (browser mode with Playwright) + MSW + React. The underlying ideas — semantic locators, page objects, fixture composition — are transferable beyond this stack.

## Testing Philosophy

These principles underpin every rule in the skill. The specific tools and patterns below are _how_ we implement them — but the principles come first.

**Use synthetic data, not real data.** Tests must be repeatable, deterministic, and free from privacy concerns. Never seed tests with production data or PII — generate purpose-built data using factory functions.

**Mock outside, test outside (MOTO).** Mock external dependencies as close to the system boundary as possible, and assert on behavior as close to the consumer as possible. This means intercepting at the network level (not patching internal fetch wrappers) and asserting on what the user sees (not internal state). The result is tests that verify real behavior without coupling to implementation details.

**Don't test what the type system guarantees.** If TypeScript already enforces it — required fields, correct types, exhaustive switches — a test for it is redundant noise. Focus test effort on runtime behavior that types can't catch.

**Don't test runtime primitives.** Trust `Array.push`, `Map.set`, `JSON.parse`, and the rest of the language. Tests that verify built-in language behavior add maintenance cost with zero signal.

**Earn every test.** Before writing a test, ask: "What runtime behavior does this verify that isn't already guaranteed by types or the language?" If the answer is nothing, skip it.

## When to Apply

Reference these rules when:
- Writing new browser or unit tests for React components
- Setting up test infrastructure (fixtures, page objects, MSW handlers)
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

| Priority | Category | Principle | Prefix |
|----------|----------|-----------|--------|
| 1 | Locator Strategy | Find elements by role within UI regions | `locators-` |
| 2 | Boundary Mocking | Mock outside, test outside (MOTO) | `msw-` |
| 3 | Page Objects | Centralize element knowledge, expose behavior | `page-objects-` |
| 4 | Fixtures | Declarative setup via the builder pattern and extension chain | `fixtures-` |
| 5 | Test Organization | Tests as living documentation | `org-` |

## Quick Reference

### 1. Locator Strategy — find elements by role within UI regions

Tests should query elements the way a user finds them — by what they are and where they are on the page. Locators that mirror this mental model survive refactors, because markup implementation can change while the role and region stay the same.

- `locators-use-roles` - Locate elements by role within scoped UI regions, suggest markup improvements when needed
- `locators-data-testid-exception` - Only use data-testid for state with no accessibility representation

### 2. Boundary Mocking — mock outside, test outside (MOTO)

The MOTO principle says to mock external dependencies at the outermost boundary and assert on behavior from the consumer's perspective. For browser tests, the outermost boundary is the network — MSW intercepts HTTP requests at the service worker level, which is as close to the real network as you can get without hitting a server. This means tests exercise the full client-side stack (fetch calls, error handling, retries) rather than bypassing it with patched modules.

- `msw-strict-unhandled` - Use onUnhandledRequest: "error" to catch unexpected requests
- `msw-custom-resolvers` - Use composable higher-order resolvers for request matching
- `msw-per-test-overrides` - Use browserWorker.use() for scenario-specific handlers
- `msw-reset-between-tests` - Reset handlers and clear storage after each test

### 3. Page Objects — centralize element knowledge, expose behavior

When markup changes, you want to update one file instead of every test that touches that element. Page objects centralize "how to find and interact with things" so tests read like behavior specifications.

- `page-objects-method-naming` - Prefix locators with get*, assertions with expect*, and use imperative action names
- `page-objects-extend-page` - Extend BrowserPage with Object.assign for a typed domain API
- `page-objects-scoped-locators` - Build locators that scope within parent elements

### 4. Fixtures — declarative setup with explicit dependencies

Vitest fixtures replace fragile `beforeEach`/`afterEach` chains with typed, composable setup that makes dependencies explicit. Use the builder pattern (`.extend('name', ...)`) for automatic type inference, and compose through the extension chain.

- `fixtures-test-extend` - Use the builder pattern for typed fixtures with automatic type inference
- `fixtures-composition` - Compose fixtures through the extension chain with explicit dependencies
- `fixtures-per-feature` - Extend the fixture chain per feature from a shared base

### 5. Test Organization — tests as living documentation

Well-structured tests serve as behavior specifications. Someone reading just the test names should understand what the feature does, and the file structure should make it obvious where to find (or add) coverage.

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
- The principle it serves and why it matters
- Incorrect code example with explanation
- Correct code example with explanation
