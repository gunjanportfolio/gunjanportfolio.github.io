import { github, instagram, linkedin, x } from "../assets/icons";
import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_LINKEDIN_URL,
  SITE_X_URL,
} from "../config/site";

export const HOME_SOCIAL_LINK_NAMES = {
  LINKEDIN: "LinkedIn",
  GITHUB: "GitHub",
  INSTAGRAM: "Instagram",
  X: "X",
};

export const HOME_SOCIAL_LINKS = [
  {
    name: HOME_SOCIAL_LINK_NAMES.LINKEDIN,
    href: SITE_LINKEDIN_URL,
    iconUrl: linkedin,
  },
  {
    name: HOME_SOCIAL_LINK_NAMES.GITHUB,
    href: SITE_GITHUB_URL,
    iconUrl: github,
  },
  {
    name: HOME_SOCIAL_LINK_NAMES.INSTAGRAM,
    href: SITE_INSTAGRAM_URL,
    iconUrl: instagram,
  },
  {
    name: HOME_SOCIAL_LINK_NAMES.X,
    href: SITE_X_URL,
    iconUrl: x,
  },
];
