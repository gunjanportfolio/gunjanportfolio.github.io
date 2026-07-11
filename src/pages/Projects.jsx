import { Link } from "react-router-dom";

import { CTA, BackToIsland } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";

function isExternalLink(link) {
  return link.startsWith("http://") || link.startsWith("https://");
}

const Projects = () => {
  return (
    <section className="max-container">
      <div className="mb-6">
        <BackToIsland />
      </div>

      <h1 className="head-text">
        My{" "}
        <span className="blue-gradient_text drop-shadow font-semibold">
          Projects
        </span>
      </h1>

      <p className="text-slate-500 mt-2 leading-relaxed">
        Selected analytics, BI, and business analysis initiatives — from
        executive dashboards and forecasting models to healthcare clinic
        reporting.
      </p>

      <div className="flex flex-wrap my-20 gap-16">
        {projects.map((project) => {
          const externalLink = isExternalLink(project.link);

          return (
            <div className="lg:w-[400px] w-full" key={project.name}>
              <div className="block-container w-12 h-12">
                <div className={`btn-back rounded-xl ${project.theme}`} />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  <img
                    src={project.iconUrl}
                    alt={project.name}
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col">
                <h4 className="text-2xl font-poppins font-semibold">
                  {project.name}
                </h4>
                <p className="mt-2 text-slate-500">{project.description}</p>
                <div className="mt-5 flex items-center gap-2 font-poppins">
                  <Link
                    to={project.link}
                    target={externalLink ? "_blank" : undefined}
                    rel={externalLink ? "noopener noreferrer" : undefined}
                    className="font-semibold text-blue-600"
                  >
                    Learn more
                  </Link>
                  <img
                    src={arrow}
                    alt="arrow"
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="border-slate-200" />

      <CTA />
    </section>
  );
};

export default Projects;
