import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { Activities, CTA, BackToIsland } from "../components";
import { SITE_BIO, SITE_NAME } from "../config/site";
import { education, experiences, skillCategories } from "../constants";

import "react-vertical-timeline-component/style.min.css";

const About = () => {
  return (
    <section className="max-container">
      <div className="mb-6">
        <BackToIsland />
      </div>

      <h1 className="head-text" data-testid="about-heading">
        Hello, I'm{" "}
        <span className="blue-gradient_text font-semibold drop-shadow">
          {" "}
          {SITE_NAME}
        </span>{" "}
        👋
      </h1>

      <div className="mt-5 flex flex-col gap-3 text-slate-500">
        <p>{SITE_BIO}</p>
      </div>

      <div className="py-10 flex flex-col">
        <h3 className="subhead-text">My Skills</h3>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm"
              data-testid={`skill-category-${category.name}`}
            >
              <h4 className="font-poppins text-lg font-semibold text-black-500">
                {category.name}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {category.items.map((itemName) => (
                  <li key={itemName}>{itemName}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16">
        <h3 className="subhead-text">Work Experience.</h3>
        <div className="mt-5 flex flex-col gap-3 text-slate-500">
          <p>
            From healthcare analytics to enterprise BI and AI initiatives —
            here is the rundown:
          </p>
        </div>

        <div className="mt-12 flex">
          <VerticalTimeline>
            {experiences.map((experience) => (
              <VerticalTimelineElement
                key={`${experience.company_name}-${experience.date}`}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "none",
                }}
              >
                <div>
                  <h3 className="text-black text-xl font-poppins font-semibold">
                    {experience.title}
                  </h3>
                  <p
                    className="text-black-500 font-medium text-base"
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className="my-5 list-disc ml-5 space-y-2">
                  {experience.points.map((point) => (
                    <li
                      key={point}
                      className="text-black-500/50 font-normal pl-1 text-sm"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <div className="py-10">
        <h3 className="subhead-text">Education</h3>
        <div className="mt-8 space-y-4">
          {education.map((entry) => (
            <div
              key={`${entry.degree}-${entry.school}`}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm"
              data-testid="education-entry"
            >
              <h4 className="font-poppins text-lg font-semibold text-black-500">
                {entry.degree}
              </h4>
              <p className="mt-1 text-slate-600">{entry.school}</p>
              <p className="mt-1 text-sm text-slate-500">{entry.date}</p>
            </div>
          ))}
        </div>
      </div>

      <Activities />

      <hr className="border-slate-200" />

      <CTA />
    </section>
  );
};

export default About;
