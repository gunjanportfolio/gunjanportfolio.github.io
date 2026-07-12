import {
  happyKidsLogo,
  hdfcLogo,
  mintDentalLogo,
} from "../assets/images";
import {
  car,
  contact,
  estate,
  github,
  linkedin,
  pricewise,
  snapgram,
  summiz,
  threads,
} from "../assets/icons";
import { SITE_GITHUB_URL, SITE_LINKEDIN_URL } from "../config/site";

export const skillCategories = [
  {
    name: "Core BA Skills",
    items: [
      "Requirements Gathering",
      "Stakeholder Management",
      "Business Process Analysis",
      "UAT & Test Data Creation",
    ],
  },
  {
    name: "Analytics & BI",
    items: [
      "SQL (Data Analysis)",
      "Python (Business Intelligence)",
      "Excel (Advanced)",
      "Power BI / Tableau",
    ],
  },
  {
    name: "Process & Documentation",
    items: [
      "Visio (Process Mapping)",
      "Business Case Development",
      "Gap Analysis",
      "Workflow Optimization",
    ],
  },
  {
    name: "Data Management",
    items: [
      "Database Analysis (NoSQL, GraphDB)",
      "Data Modeling",
      "Business Data Architecture",
    ],
  },
  {
    name: "Project Management",
    items: [
      "Agile / Scrum Methodologies",
      "Project Planning",
      "Cross-functional Team Collaboration",
      "Change Management",
    ],
  },
  {
    name: "Innovation & AI",
    items: [
      "Business Process Automation",
      "AI-Driven Analytics",
      "Intelligent Document Processing",
      "Predictive Modeling",
    ],
  },
];

/** Flat list used by island preview cards and compact skill chips. */
export const skills = skillCategories.flatMap((category) =>
  category.items.map((itemName) => ({
    name: itemName,
    type: category.name,
    imageUrl: null,
  }))
);

export const experiences = [
  {
    title: "Data Analyst & Treatment Coordinator",
    company_name: "Happy Kids Dental Clinic",
    icon: happyKidsLogo,
    iconBg: "#ffffff",
    date: "July 2026 - Present",
    points: [
      "Working as Data Analyst and Treatment Coordinator supporting clinic operations and patient care coordination.",
      "Analyzing clinic operational and patient data to support decision-making.",
      "Building reporting and dashboards for stakeholders across clinical and admin teams.",
      "Identifying process improvements through data-driven insights.",
    ],
  },
  {
    title: "Data Analyst",
    company_name: "Mint Dental Clinic",
    icon: mintDentalLogo,
    iconBg: "#ffffff",
    date: "April 2025 - May 2026",
    points: [
      "Delivered data analysis and reporting to improve clinic performance visibility.",
      "Supported stakeholders with actionable insights from operational datasets.",
      "Documented analytical workflows and improved reporting consistency.",
    ],
  },
  {
    title: "Business Analyst (Internship)",
    company_name: "HDFC · Pune, India",
    icon: hdfcLogo,
    iconBg: "#ffffff",
    date: "May 2020 - September 2024",
    points: [
      "Led requirements gathering with C-level stakeholders and designed an AI-powered BI platform with executive dashboards; reduced insight delivery time by 80% and improved accuracy for complex business queries by 35%.",
      "Designed predictive analytics models on Azure and automated reporting workflows with regional sales managers; increased sales prediction accuracy by 10–13% across regions.",
      "Developed a user-friendly anomaly detection system and trained business users to identify key performance drivers within seconds.",
      "Designed reusable AI integration architecture and deployment protocols enabling rapid AI solution rollout across 5+ enterprise clients.",
    ],
  },
];

export const education = [
  {
    degree: "MSc. Management of Business Information Technology",
    school: "University of Greenwich",
    date: "September 2025",
  },
];

export const activities = [
  {
    title: "Business Analyst Peer Mentoring",
    organization: "Professional BA Network",
    date: "2024 - Present",
    description:
      "Mentors early-career business analysts on requirements elicitation, stakeholder workshops, and turning ambiguous business problems into measurable analytics outcomes.",
  },
  {
    title: "Healthcare Analytics Community Sessions",
    organization: "Dental Clinic Operations Community",
    date: "2025 - Present",
    description:
      "Shares clinic reporting practices, UAT approaches, and data-driven treatment coordination insights with operations and admin teams across healthcare analytics peers.",
  },
  {
    title: "AI-Powered BI Practice Sharing",
    organization: "Enterprise Analytics Circles",
    date: "2021 - 2024",
    description:
      "Led informal knowledge-sharing sessions on executive dashboards, anomaly detection workflows, and reusable AI integration patterns from banking BA delivery.",
  },
  {
    title: "BIT Peer Learning & Case Clinics",
    organization: "University of Greenwich",
    date: "2024 - 2025",
    description:
      "Participated in Management of Business Information Technology peer learning groups—reviewing process maps, gap analyses, and BI solution designs with fellow analysts.",
  },
];

export const ACTIVITIES_SECTION_TITLE = "Activities";

export const ACTIVITIES_SECTION_INTRO =
  "Active in the business analysis community through mentoring, healthcare analytics knowledge exchange, and peer learning.";

export const socialLinks = [
  {
    name: "Contact",
    iconUrl: contact,
    link: "/contact",
  },
  {
    name: "GitHub",
    iconUrl: github,
    link: SITE_GITHUB_URL,
  },
  {
    name: "LinkedIn",
    iconUrl: linkedin,
    link: SITE_LINKEDIN_URL,
  },
];

export const projects = [
  {
    iconUrl: summiz,
    theme: "btn-back-blue",
    name: "Executive AI-Powered BI Platform",
    description:
      "Requirements-led BI platform with visual executive dashboards that cut insight delivery time by 80% and improved complex query accuracy by 35%.",
    link: "/about",
  },
  {
    iconUrl: pricewise,
    theme: "btn-back-green",
    name: "Regional Sales Forecasting Models",
    description:
      "Predictive analytics on Azure with automated reporting workflows that improved sales prediction accuracy by 10–13% across regions.",
    link: "/about",
  },
  {
    iconUrl: threads,
    theme: "btn-back-pink",
    name: "Business Anomaly Detection System",
    description:
      "User-friendly anomaly detection enabling operations teams to identify performance drivers within seconds and act faster.",
    link: "/about",
  },
  {
    iconUrl: car,
    theme: "btn-back-black",
    name: "Reusable Enterprise AI Integration",
    description:
      "Reusable integration architecture and deployment protocols that scaled AI solutions across 5+ enterprise clients.",
    link: "/about",
  },
  {
    iconUrl: estate,
    theme: "btn-back-yellow",
    name: "Healthcare Clinic Analytics",
    description:
      "Data analysis and stakeholder reporting for dental clinic operations at Happy Kids Dental Clinic and Mint Dental Clinic.",
    link: "/about",
  },
  {
    iconUrl: snapgram,
    theme: "btn-back-red",
    name: "Process Mapping & Workflow Optimization",
    description:
      "Business process analysis, gap analysis, and workflow optimization using Visio and structured BA documentation practices.",
    link: "/about",
  },
];
