import {
  CONTACT_TO_EMAIL,
  SITE_BIO,
  SITE_EDUCATION,
  SITE_FULL_NAME,
  SITE_LOCATION,
  SITE_TAGLINE,
} from "../config/site";
import { experiences, skillCategories } from "./index";

export const FAQ_CHATBOT_UI = {
  TITLE: "Ask Gunjan",
  SUBTITLE: "Tap a question below",
  WELCOME_MESSAGE:
    "Hi! I can answer a few common questions about Gunjan. Pick one below.",
  TOGGLE_OPEN_LABEL: "Open FAQ chatbot",
  TOGGLE_CLOSE_LABEL: "Close FAQ chatbot",
  CLOSE_PANEL_LABEL: "Minimize chatbot",
  ALL_ANSWERED: "You've explored every FAQ. Thanks for asking!",
};

export const FAQ_CHATBOT_MESSAGE_ROLES = {
  BOT: "bot",
  USER: "user",
};

export const FAQ_CHATBOT_IDS = {
  WHO: "who",
  ROLE: "role",
  LOCATION: "location",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  SKILLS: "skills",
  CONTACT: "contact",
};

function buildExperienceAnswer() {
  const roleSummaries = experiences
    .map(
      (experience) =>
        `${experience.title} at ${experience.company_name} (${experience.date})`
    )
    .join("; ");

  return `${SITE_FULL_NAME}'s recent roles: ${roleSummaries}.`;
}

function buildSkillsAnswer() {
  const highlightSkills = skillCategories
    .flatMap((category) => category.items)
    .slice(0, 8)
    .join(", ");

  return `Core strengths include ${highlightSkills}, and more across BA, BI, and AI-driven analytics.`;
}

export const FAQ_CHATBOT_ITEMS = [
  {
    id: FAQ_CHATBOT_IDS.WHO,
    question: "Who is Gunjan?",
    answer: `${SITE_FULL_NAME} is a ${SITE_TAGLINE}. ${SITE_BIO}`,
  },
  {
    id: FAQ_CHATBOT_IDS.ROLE,
    question: "What is the current role?",
    answer: `${experiences[0].title} at ${experiences[0].company_name} (${experiences[0].date}).`,
  },
  {
    id: FAQ_CHATBOT_IDS.LOCATION,
    question: "Where is Gunjan based?",
    answer: `${SITE_FULL_NAME} is ${SITE_LOCATION}.`,
  },
  {
    id: FAQ_CHATBOT_IDS.EXPERIENCE,
    question: "What is the work experience?",
    answer: buildExperienceAnswer(),
  },
  {
    id: FAQ_CHATBOT_IDS.EDUCATION,
    question: "What about education?",
    answer: SITE_EDUCATION,
  },
  {
    id: FAQ_CHATBOT_IDS.SKILLS,
    question: "What skills stand out?",
    answer: buildSkillsAnswer(),
  },
  {
    id: FAQ_CHATBOT_IDS.CONTACT,
    question: "How can I get in touch?",
    answer: `Email ${CONTACT_TO_EMAIL}, or use the Contact page and LinkedIn linked from this site.`,
  },
];

export function findFaqChatbotItemById(faqId) {
  return FAQ_CHATBOT_ITEMS.find((item) => item.id === faqId);
}
