import { describe, expect, it } from "vitest";

import {
  education,
  experiences,
  skillCategories,
  skills,
} from "./index";

describe("portfolio content", () => {
  it("lists current and previous data analyst roles first", () => {
    expect(experiences[0]).toMatchObject({
      title: "Data Analyst",
      company_name: "Happy Kids Dental Clinic",
      date: "July 2026 - Present",
    });
    expect(experiences[1]).toMatchObject({
      title: "Data Analyst",
      company_name: "Mint Dental Clinic",
      date: "April 2025 - May 2026",
    });
    expect(experiences[2].company_name).toContain("HDFC");
  });

  it("includes BA and analytics skill categories", () => {
    expect(skillCategories.length).toBeGreaterThanOrEqual(6);
    expect(skills.some((skill) => skill.name.includes("SQL"))).toBe(true);
    expect(skills.some((skill) => skill.name.includes("Power BI"))).toBe(true);
  });

  it("includes Greenwich education entry", () => {
    expect(education[0].school).toBe("University of Greenwich");
    expect(education[0].degree).toMatch(/Business Information Technology/i);
  });
});
