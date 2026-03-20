# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Locator Strategy (locators)

**Impact:** CRITICAL
**Description:** How tests find elements determines how fragile they are. Accessibility-based locators create a virtuous cycle where test coverage and accessibility coverage grow together, while CSS selectors and data-testid create a parallel naming system that drifts from the real UI.

## 2. MSW Mocking (msw)

**Impact:** CRITICAL
**Description:** Every frontend test that touches a network boundary needs reliable, precise API mocking. MSW intercepts at the network level, giving tests realistic behavior without coupling to implementation details. Getting this wrong means flaky tests or false confidence.

## 3. Page Objects (page-objects)

**Impact:** HIGH
**Description:** Page objects centralize element knowledge so markup changes require updating one file instead of every test. A well-structured page object makes tests read like behavior specifications.

## 4. Component Markup (markup)

**Impact:** HIGH
**Description:** Testability starts in the component. Semantic HTML with accessibility attributes gives tests a stable, meaningful surface to query against — and makes the app more accessible as a side effect.

## 5. Fixtures (fixtures)

**Impact:** HIGH
**Description:** Vitest fixtures provide composable, typed test setup that eliminates boilerplate while ensuring clean state between tests. They replace fragile beforeEach/afterEach chains with declarative dependencies.

## 6. Test Organization (org)

**Impact:** MEDIUM
**Description:** Consistent file placement, naming, and structure make tests discoverable and maintainable as the codebase grows.
