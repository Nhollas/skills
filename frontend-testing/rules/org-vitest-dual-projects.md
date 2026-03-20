---
title: Separate Unit and Browser Projects in Vitest Config
impact: MEDIUM
tags: organization, vitest, config, projects, browser
---

## Separate Unit and Browser Projects in Vitest Config

**Impact: MEDIUM**

**Why:** Pure logic tests don't need a browser — running them in Node is faster and has less overhead. Component tests need a real DOM and browser APIs. Forcing everything through the browser slows down the feedback loop; running everything in Node means component tests miss real browser behavior. The right split gives each test type the environment it needs.

**How:** Configure two vitest projects: `unit` (Node, `*.test.ts`) and `browser` (Playwright, `*.test.tsx`). The file extension routes tests to the correct project automatically.

**Incorrect (single project forces all tests through the browser):**

```typescript
export default defineConfig({
  test: {
    browser: { enabled: true, provider: playwright() },
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

**Correct (dual projects with extension-based routing):**

```typescript
export default defineConfig({
  test: {
    silent: "passed-only",
    clearMocks: true,
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [react()],
        test: {
          name: "browser",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["<path-to-browser-setup>"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [
              { browser: "chromium", viewport: { width: 1280, height: 720 } },
            ],
          },
        },
      },
    ],
  },
});
```

`clearMocks` and `restoreMocks` at the top level apply to both projects, preventing mock pollution without per-file cleanup.
