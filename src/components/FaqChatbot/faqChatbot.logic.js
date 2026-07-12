import {
  FAQ_CHATBOT_MESSAGE_ROLES,
  FAQ_CHATBOT_UI,
  findFaqChatbotItemById,
} from "../../constants/faqChatbot";

let messageSequence = 0;

function createMessageId(prefix) {
  messageSequence += 1;
  return `${prefix}-${messageSequence}`;
}

export function createWelcomeMessages() {
  return [
    {
      id: createMessageId("welcome"),
      role: FAQ_CHATBOT_MESSAGE_ROLES.BOT,
      text: FAQ_CHATBOT_UI.WELCOME_MESSAGE,
    },
  ];
}

export function createFaqExchange(faqId) {
  const faqItem = findFaqChatbotItemById(faqId);

  if (!faqItem) {
    return null;
  }

  return [
    {
      id: createMessageId(`user-${faqItem.id}`),
      role: FAQ_CHATBOT_MESSAGE_ROLES.USER,
      text: faqItem.question,
    },
    {
      id: createMessageId(`bot-${faqItem.id}`),
      role: FAQ_CHATBOT_MESSAGE_ROLES.BOT,
      text: faqItem.answer,
    },
  ];
}

export function appendFaqExchange(messages, faqId) {
  const exchange = createFaqExchange(faqId);

  if (!exchange) {
    return messages;
  }

  return [...messages, ...exchange];
}

export function resetFaqMessageSequenceForTests() {
  messageSequence = 0;
}
