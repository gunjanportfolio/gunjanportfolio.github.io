import { describe, expect, it, beforeEach } from "vitest";

import {
  FAQ_CHATBOT_IDS,
  FAQ_CHATBOT_MESSAGE_ROLES,
  FAQ_CHATBOT_UI,
} from "../../constants/faqChatbot";
import {
  appendFaqExchange,
  createFaqExchange,
  createWelcomeMessages,
  resetFaqMessageSequenceForTests,
} from "./faqChatbot.logic";

describe("faqChatbot.logic", () => {
  beforeEach(() => {
    resetFaqMessageSequenceForTests();
  });

  it("creates a welcome bot message", () => {
    const messages = createWelcomeMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe(FAQ_CHATBOT_MESSAGE_ROLES.BOT);
    expect(messages[0].text).toBe(FAQ_CHATBOT_UI.WELCOME_MESSAGE);
  });

  it("creates a user and bot exchange for a valid FAQ", () => {
    const exchange = createFaqExchange(FAQ_CHATBOT_IDS.WHO);

    expect(exchange).toHaveLength(2);
    expect(exchange[0].role).toBe(FAQ_CHATBOT_MESSAGE_ROLES.USER);
    expect(exchange[1].role).toBe(FAQ_CHATBOT_MESSAGE_ROLES.BOT);
    expect(exchange[0].text).toMatch(/Who is Gunjan/i);
    expect(exchange[1].text).toMatch(/Gunjan Bandekar/i);
  });

  it("returns null for an unknown FAQ id", () => {
    expect(createFaqExchange("missing")).toBeNull();
  });

  it("appends exchanges without mutating the original messages", () => {
    const welcomeMessages = createWelcomeMessages();
    const nextMessages = appendFaqExchange(
      welcomeMessages,
      FAQ_CHATBOT_IDS.CONTACT
    );

    expect(welcomeMessages).toHaveLength(1);
    expect(nextMessages).toHaveLength(3);
    expect(nextMessages[2].text).toMatch(/gunjanbandekar20@gmail.com/i);
  });

  it("keeps previous messages when FAQ id is invalid", () => {
    const welcomeMessages = createWelcomeMessages();
    const nextMessages = appendFaqExchange(welcomeMessages, "invalid");

    expect(nextMessages).toBe(welcomeMessages);
  });
});
