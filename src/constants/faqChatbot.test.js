import { describe, expect, it } from "vitest";

import {
  CONTACT_TO_EMAIL,
  SITE_EDUCATION,
  SITE_FULL_NAME,
  SITE_TAGLINE,
} from "../config/site";
import {
  FAQ_CHATBOT_IDS,
  FAQ_CHATBOT_ITEMS,
  FAQ_CHATBOT_UI,
  findFaqChatbotItemById,
} from "./faqChatbot";

describe("faqChatbot constants", () => {
  it("defines a complete FAQ list with unique ids", () => {
    expect(FAQ_CHATBOT_ITEMS.length).toBeGreaterThanOrEqual(6);

    const faqIds = FAQ_CHATBOT_ITEMS.map((item) => item.id);
    expect(new Set(faqIds).size).toBe(faqIds.length);

    FAQ_CHATBOT_ITEMS.forEach((item) => {
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(20);
    });
  });

  it("answers who, role, location, experience, education, skills, and contact", () => {
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.WHO)?.answer).toContain(
      SITE_FULL_NAME
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.WHO)?.answer).toContain(
      SITE_TAGLINE
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.ROLE)?.answer).toMatch(
      /Happy Kids Dental Clinic/i
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.LOCATION)?.answer).toMatch(
      /Happy Kids Dental Clinic/i
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.EXPERIENCE)?.answer).toMatch(
      /HDFC/i
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.EDUCATION)?.answer).toBe(
      SITE_EDUCATION
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.SKILLS)?.answer).toMatch(
      /SQL|Power BI|Python/i
    );
    expect(findFaqChatbotItemById(FAQ_CHATBOT_IDS.CONTACT)?.answer).toContain(
      CONTACT_TO_EMAIL
    );
  });

  it("returns undefined for unknown faq ids", () => {
    expect(findFaqChatbotItemById("unknown-faq")).toBeUndefined();
  });

  it("exposes chatbot UI copy", () => {
    expect(FAQ_CHATBOT_UI.TITLE).toBe("Ask Gunjan");
    expect(FAQ_CHATBOT_UI.WELCOME_MESSAGE.length).toBeGreaterThan(10);
  });
});
