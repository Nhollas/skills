---
title: Consistent Method Naming Convention
impact: HIGH
tags: page-objects, naming, locators, expectations, actions
---

## Consistent Method Naming Convention

**Impact: HIGH**

Page objects should use a consistent prefix convention so anyone reading a test immediately knows what a method does without checking the page object source. Three prefixes cover every method type.

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
