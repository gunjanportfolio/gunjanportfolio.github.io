import { Link } from "react-router-dom";

import { arrow } from "../assets/icons";
import {
  SITE_BIO,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
} from "../config/site";
import { experiences, projects, skills } from "../constants";
import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";

const FEATURED_SKILL_COUNT = 6;
const FEATURED_PROJECT_COUNT = 3;

function getFeaturedSkillNames() {
  return skills.slice(0, FEATURED_SKILL_COUNT).map((skill) => skill.name);
}

function getLatestExperience() {
  return experiences[experiences.length - 1];
}

function getFeaturedProjectNames() {
  return projects.slice(0, FEATURED_PROJECT_COUNT).map((project) => project.name);
}

const HomeInfo = ({ currentStage }) => {
  if (currentStage === PORTFOLIO_AREA_IDS.HOME) {
    return (
      <div
        data-testid="home-stage-1"
        className="info-box max-w-xl"
      >
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · Home
        </p>
        <h1 className="sm:text-2xl text-xl font-semibold text-center text-white">
          Hi, I'm <span className="mx-1">{SITE_NAME}</span> 👋
        </h1>
        <p className="font-medium sm:text-lg text-center text-white/95">
          {SITE_TAGLINE} {SITE_LOCATION}
        </p>
        <p className="text-sm sm:text-base text-center text-white/85">{SITE_BIO}</p>
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.ABOUT) {
    const latestExperience = getLatestExperience();
    const featuredSkills = getFeaturedSkillNames();

    return (
      <div className="info-box max-w-xl" data-testid="home-stage-2">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · About
        </p>
        <p className="font-medium sm:text-xl text-center">
          Skills & experience from the journey so far
        </p>
        <p className="text-sm sm:text-base text-center text-white/90">
          Latest role: {latestExperience.title} at{" "}
          {latestExperience.company_name}
        </p>
        <p className="text-sm text-center text-white/85">
          {featuredSkills.join(" · ")}
        </p>
        <Link to="/about" className="neo-brutalism-white neo-btn">
          Explore full about
          <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
        </Link>
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.PROJECTS) {
    const featuredProjects = getFeaturedProjectNames();

    return (
      <div className="info-box max-w-xl" data-testid="home-stage-3">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · Projects
        </p>
        <p className="font-medium text-center sm:text-xl">
          Featured builds from the portfolio
        </p>
        <ul className="text-sm sm:text-base text-center text-white/90 space-y-1">
          {featuredProjects.map((projectName) => (
            <li key={projectName}>{projectName}</li>
          ))}
        </ul>
        <Link to="/projects" className="neo-brutalism-white neo-btn">
          Browse all projects
          <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
        </Link>
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.CONTACT) {
    return (
      <div className="info-box max-w-xl" data-testid="home-stage-4">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · Contact
        </p>
        <p className="font-medium sm:text-xl text-center">
          Ready to collaborate on your next idea?
        </p>
        <p className="text-sm sm:text-base text-center text-white/90">
          Fly into this area and send a message — the fox page is waiting.
        </p>
        <Link to="/contact" className="neo-brutalism-white neo-btn">
          Open contact
          <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
        </Link>
      </div>
    );
  }

  return null;
};

export default HomeInfo;
