import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  FAQ_CHATBOT_IDS,
  FAQ_CHATBOT_ITEMS,
  FAQ_CHATBOT_UI,
} from "../../constants/faqChatbot";
import { resetFaqMessageSequenceForTests } from "./faqChatbot.logic";
import FaqChatbot from "./FaqChatbot";

describe("FaqChatbot", () => {
  beforeEach(() => {
    resetFaqMessageSequenceForTests();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders minimized by default", () => {
    render(<FaqChatbot />);

    expect(screen.getByTestId("faq-chatbot")).toBeInTheDocument();
    expect(screen.getByTestId("faq-chatbot-toggle")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByTestId("faq-chatbot-panel")).not.toBeInTheDocument();
  });

  it("opens the panel and shows listed FAQ questions only", () => {
    render(<FaqChatbot />);

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));

    expect(screen.getByTestId("faq-chatbot-panel")).toBeInTheDocument();
    expect(screen.getByText(FAQ_CHATBOT_UI.WELCOME_MESSAGE)).toBeInTheDocument();
    expect(screen.getByTestId("faq-chatbot-toggle")).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    FAQ_CHATBOT_ITEMS.forEach((faqItem) => {
      expect(
        screen.getByTestId(`faq-chatbot-question-${faqItem.id}`)
      ).toHaveTextContent(faqItem.question);
    });

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("answers a selected FAQ and removes that question from the list", () => {
    render(<FaqChatbot />);

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));
    fireEvent.click(
      screen.getByTestId(`faq-chatbot-question-${FAQ_CHATBOT_IDS.WHO}`)
    );

    const messages = screen.getByTestId("faq-chatbot-messages");
    expect(
      within(messages).getByText(FAQ_CHATBOT_ITEMS[0].question)
    ).toBeInTheDocument();
    expect(
      within(messages).getByText(FAQ_CHATBOT_ITEMS[0].answer)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`faq-chatbot-question-${FAQ_CHATBOT_IDS.WHO}`)
    ).not.toBeInTheDocument();
  });

  it("closes from the panel close button and from the toggle", () => {
    render(<FaqChatbot />);

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));
    expect(screen.getByTestId("faq-chatbot-panel")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("faq-chatbot-close"));
    expect(screen.queryByTestId("faq-chatbot-panel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));
    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));
    expect(screen.queryByTestId("faq-chatbot-panel")).not.toBeInTheDocument();
  });

  it("ignores question clicks without a FAQ id", () => {
    render(<FaqChatbot />);

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));

    const questions = screen.getByTestId("faq-chatbot-questions");
    const firstQuestion = within(questions).getAllByRole("button")[0];
    firstQuestion.removeAttribute("data-faq-id");

    fireEvent.click(firstQuestion);

    expect(screen.getAllByTestId("faq-chatbot-message-bot")).toHaveLength(1);
    expect(
      screen.queryByTestId("faq-chatbot-message-user")
    ).not.toBeInTheDocument();
  });

  it("shows the all-answered state after every FAQ is asked", () => {
    render(<FaqChatbot />);

    fireEvent.click(screen.getByTestId("faq-chatbot-toggle"));

    FAQ_CHATBOT_ITEMS.forEach((faqItem) => {
      fireEvent.click(
        screen.getByTestId(`faq-chatbot-question-${faqItem.id}`)
      );
    });

    expect(screen.getByTestId("faq-chatbot-all-answered")).toHaveTextContent(
      FAQ_CHATBOT_UI.ALL_ANSWERED
    );
  });
});
