import { useEffect, useRef, useState } from "react";

import {
  FAQ_CHATBOT_ITEMS,
  FAQ_CHATBOT_MESSAGE_ROLES,
  FAQ_CHATBOT_UI,
} from "../../constants/faqChatbot";
import {
  appendFaqExchange,
  createWelcomeMessages,
} from "./faqChatbot.logic";

const FAQ_ID_DATASET_KEY = "faqId";

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      className="faq-chatbot-toggle-icon"
      fill="none"
      height="22"
      viewBox="0 0 24 24"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 18.5 4 21v-3.2A7.5 7.5 0 1 1 12 19.5c-1.55 0-3-.4-4.5-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M8.5 11h7M8.5 14h4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="faq-chatbot-close-icon"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(createWelcomeMessages);
  const [askedFaqIds, setAskedFaqIds] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !messagesEndRef.current) {
      return undefined;
    }

    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    return undefined;
  }, [isOpen, messages]);

  const handleOpenChatbot = () => {
    setIsOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsOpen(false);
  };

  const handleToggleChatbot = () => {
    if (isOpen) {
      handleCloseChatbot();
      return;
    }

    handleOpenChatbot();
  };

  const handleAskFaq = (faqId) => {
    if (!faqId || askedFaqIds.includes(faqId)) {
      return;
    }

    setMessages((previousMessages) =>
      appendFaqExchange(previousMessages, faqId)
    );
    setAskedFaqIds((previousIds) => [...previousIds, faqId]);
  };

  const handleQuestionClick = (event) => {
    const faqId = event.currentTarget.dataset[FAQ_ID_DATASET_KEY];
    handleAskFaq(faqId);
  };

  const remainingFaqs = FAQ_CHATBOT_ITEMS.filter(
    (faqItem) => !askedFaqIds.includes(faqItem.id)
  );

  return (
    <div className="faq-chatbot" data-testid="faq-chatbot">
      {isOpen ? (
        <section
          aria-label={FAQ_CHATBOT_UI.TITLE}
          className="faq-chatbot-panel"
          data-testid="faq-chatbot-panel"
        >
          <header className="faq-chatbot-header">
            <div className="faq-chatbot-header-copy">
              <p className="faq-chatbot-title">{FAQ_CHATBOT_UI.TITLE}</p>
              <p className="faq-chatbot-subtitle">{FAQ_CHATBOT_UI.SUBTITLE}</p>
            </div>
            <button
              aria-label={FAQ_CHATBOT_UI.CLOSE_PANEL_LABEL}
              className="faq-chatbot-close"
              data-testid="faq-chatbot-close"
              onClick={handleCloseChatbot}
              type="button"
            >
              <CloseIcon />
            </button>
          </header>

          <div
            aria-live="polite"
            className="faq-chatbot-messages"
            data-testid="faq-chatbot-messages"
          >
            {messages.map((message) => {
              const isBotMessage =
                message.role === FAQ_CHATBOT_MESSAGE_ROLES.BOT;
              const bubbleClassName = isBotMessage
                ? "faq-chatbot-bubble faq-chatbot-bubble-bot"
                : "faq-chatbot-bubble faq-chatbot-bubble-user";

              return (
                <p
                  className={bubbleClassName}
                  data-testid={`faq-chatbot-message-${message.role}`}
                  key={message.id}
                >
                  {message.text}
                </p>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="faq-chatbot-questions"
            data-testid="faq-chatbot-questions"
          >
            {remainingFaqs.length === 0 ? (
              <p
                className="faq-chatbot-empty-hint"
                data-testid="faq-chatbot-all-answered"
              >
                {FAQ_CHATBOT_UI.ALL_ANSWERED}
              </p>
            ) : (
              remainingFaqs.map((faqItem) => (
                <button
                  className="faq-chatbot-question"
                  data-faq-id={faqItem.id}
                  data-testid={`faq-chatbot-question-${faqItem.id}`}
                  key={faqItem.id}
                  onClick={handleQuestionClick}
                  type="button"
                >
                  {faqItem.question}
                </button>
              ))
            )}
          </div>
        </section>
      ) : null}

      <button
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? FAQ_CHATBOT_UI.TOGGLE_CLOSE_LABEL
            : FAQ_CHATBOT_UI.TOGGLE_OPEN_LABEL
        }
        className={
          isOpen
            ? "faq-chatbot-toggle faq-chatbot-toggle-active"
            : "faq-chatbot-toggle"
        }
        data-testid="faq-chatbot-toggle"
        onClick={handleToggleChatbot}
        type="button"
      >
        <span className="faq-chatbot-toggle-glow" aria-hidden="true" />
        <ChatIcon />
      </button>
    </div>
  );
}

export default FaqChatbot;
