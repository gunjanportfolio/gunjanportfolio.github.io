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

const STACKED_CTA_CLASS =
  "neo-brutalism-white flex w-[90%] sm:w-1/2 items-center justify-center gap-3 rounded-lg px-6 py-3 text-center font-semibold text-blue-500";

function getFeaturedSkillNames() {
  return skills.slice(0, FEATURED_SKILL_COUNT).map((skill) => skill.name);
}

function getLatestExperience() {
  return experiences[0];
}

function getFeaturedProjectNames() {
  return projects.slice(0, FEATURED_PROJECT_COUNT).map((project) => project.name);
}

function BackToIslandAction({ onBack }) {
  if (!onBack) {
    return null;
  }

  const handleBack = () => {
    onBack();
  };

  return (
    <button
      type="button"
      data-testid="interior-back-button"
      aria-label="Back to island"
      onClick={handleBack}
      className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-md transition hover:bg-white active:scale-95"
    >
      ← Back to island
    </button>
  );
}

function PrimaryCta({ to, label, onBack }) {
  const linkContent = (
    <>
      {label}
      <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
    </>
  );

  if (onBack) {
    return (
      <div
        className="mt-4 flex w-full flex-col items-center gap-3"
        data-testid="interior-cta-stack"
      >
        <Link to={to} className={STACKED_CTA_CLASS}>
          {linkContent}
        </Link>
        <BackToIslandAction onBack={onBack} />
      </div>
    );
  }

  return (
    <Link to={to} className="neo-brutalism-white neo-btn">
      {linkContent}
    </Link>
  );
}

const HomeInfo = ({ currentStage, onBack }) => {
  const boxClassName = onBack
    ? "info-box max-w-xl !pb-8"
    : "info-box max-w-xl";

  if (currentStage === PORTFOLIO_AREA_IDS.HOME) {
    return (
      <div data-testid="home-stage-1" className={boxClassName}>
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
        {onBack ? (
          <div className="mt-4 flex w-full justify-center">
            <BackToIslandAction onBack={onBack} />
          </div>
        ) : null}
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.ABOUT) {
    const latestExperience = getLatestExperience();
    const featuredSkills = getFeaturedSkillNames();

    return (
      <div className={boxClassName} data-testid="home-stage-2">
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
        <PrimaryCta
          to="/about"
          label="Explore full about"
          onBack={onBack}
        />
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.PROJECTS) {
    const featuredProjects = getFeaturedProjectNames();

    return (
      <div className={boxClassName} data-testid="home-stage-3">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · Projects
        </p>
        <p className="font-medium text-center sm:text-xl">
          Featured analytics & BA impact
        </p>
        <ul className="text-sm sm:text-base text-center text-white/90 space-y-1">
          {featuredProjects.map((projectName) => (
            <li key={projectName}>{projectName}</li>
          ))}
        </ul>
        <PrimaryCta
          to="/projects"
          label="Browse all projects"
          onBack={onBack}
        />
      </div>
    );
  }

  if (currentStage === PORTFOLIO_AREA_IDS.CONTACT) {
    return (
      <div className={boxClassName} data-testid="home-stage-4">
        <p className="font-poppins text-xs uppercase tracking-[0.2em] text-white/80">
          Island area · Contact
        </p>
        <p className="font-medium sm:text-xl text-center">
          Ready to collaborate on your next idea?
        </p>
        <p className="text-sm sm:text-base text-center text-white/90">
          Send a message to gunjanbandekar20@gmail.com from the contact page.
        </p>
        <PrimaryCta to="/contact" label="Open contact" onBack={onBack} />
      </div>
    );
  }

  return null;
};

export default HomeInfo;
