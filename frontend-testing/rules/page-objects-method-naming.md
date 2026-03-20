---
title: Consistent Method Naming Convention
impact: HIGH
tags: page-objects, naming, locators, expectations, actions
---

## Consistent Method Naming Convention

**Impact: HIGH**

**Why:** When tests read like behavior specifications, anyone can understand what they do at a glance. Inconsistent page object method names force readers to check the source to figure out whether a method returns a locator, performs an assertion, or triggers an action. A consistent prefix convention removes that friction.

**How:** Three prefixes cover every method type: `get*` returns a locator (no awaiting, no assertions), `expect*` asserts a condition (always awaited), and imperative verbs (`sendMessage`, `selectFilter`) perform user interactions.

**Incorrect (inconsistent naming blurs intent):**

```typescript
const myPage = {
  messageInput: () => page.getByRole("textbox", { name: "Message" }),
  checkMessageVisible: async (text: string) => { /* ... */ },
  clickSend: async () => { /* ... */ },
  findConversation: () => page.getByRole("log", { name: "Conversation" }),
  assertReady: async () => { /* ... */ },
}
```

**Correct (prefixes signal intent):**

```typescript
const self = {
  // get* — Return a locator. No awaiting, no assertions.
  getMessageInput: () =>
    page.getByRole("textbox", { name: "Message" }),
  getSendButton: () =>
    page.getByRole("button", { name: "Send" }),

  // expect* — Assert a condition. Always awaited.
  expectReady: async () => {
    await expect.element(self.getMessageInput()).toBeEnabled();
    await expect.element(self.getSendButton()).toBeVisible();
  },

  // Actions — Imperative verb names. Perform user interactions.
  sendMessage: async (message: string) => {
    await self.getMessageInput().fill(message);
    await self.getSendButton().click();
  },
};
```
