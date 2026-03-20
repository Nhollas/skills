# Sections

This file defines all sections, their ordering, and the principles they serve.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Locator Strategy (locators)

**Principle:** Find elements by role within UI regions.
**Why:** Tests should query elements the way a user finds them — by what they are and where they are on the page. This survives refactors because markup implementation can change while the role and region stay the same.
**How:** Combine `getByRole` with region scoping. When markup doesn't support this, suggest targeted semantic improvements.

## 2. Boundary Mocking (msw)

**Principle:** Mock outside, test outside (MOTO).
**Why:** External dependencies should be mocked as close to the system boundary as possible, and assertions should happen as close to the consumer as possible. This ensures tests verify real behavior — the full client-side stack from fetch to render — without coupling to internal implementation.
**How:** MSW intercepts at the network level (service worker), which is the outermost boundary in a browser app. Define happy-path handlers in a shared module, override per-test for specific scenarios.

## 3. Page Objects (page-objects)

**Principle:** Centralize element knowledge, expose behavior.
**Why:** When markup changes, updating one page object is cheaper than updating every test that touches that element. A well-structured page object makes tests read like behavior specifications.
**How:** Create page objects that extend `BrowserPage` via `Object.assign`, use consistent `get*/expect*/action` naming, and scope locators within parent elements.

## 4. Fixtures (fixtures)

**Principle:** Declarative setup via the builder pattern and extension chain.
**Why:** `beforeEach`/`afterEach` chains create implicit ordering and shared mutable state that makes tests fragile and hard to reason about. Declarative fixtures make dependencies explicit and only run when needed.
**How:** Use Vitest's builder pattern (`.extend('name', ...)`) for automatic type inference, compose through the extension chain, and extend from a shared base per feature.

## 5. Test Organization (org)

**Principle:** Tests as living documentation.
**Why:** Someone reading just the test names should understand what the feature does. The file structure should make it obvious where to find (or add) coverage.
**How:** Colocate tests with source, name tests by observable behavior, use factory functions for test data, and separate unit/browser vitest projects.
