import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ACTIVITIES_SECTION_INTRO,
  ACTIVITIES_SECTION_TITLE,
  activities,
} from "../../constants";
import Activities from "./Activities";

describe("Activities", () => {
  it("renders the activities section heading and intro", () => {
    render(<Activities />);

    expect(screen.getByTestId("activities-section")).toBeInTheDocument();
    expect(screen.getByTestId("activities-heading")).toHaveTextContent(
      ACTIVITIES_SECTION_TITLE
    );
    expect(screen.getByText(ACTIVITIES_SECTION_INTRO)).toBeInTheDocument();
  });

  it("renders every activity entry from content", () => {
    render(<Activities />);

    const entries = screen.getAllByTestId("activity-entry");
    expect(entries).toHaveLength(activities.length);

    for (const activity of activities) {
      expect(screen.getByText(activity.title)).toBeInTheDocument();
      expect(screen.getByText(activity.organization)).toBeInTheDocument();
      expect(screen.getByText(activity.date)).toBeInTheDocument();
      expect(screen.getByText(activity.description)).toBeInTheDocument();
    }
  });

  it("renders custom items when provided", () => {
    const customItems = [
      {
        title: "Custom BA Meetup",
        organization: "Local Analyst Group",
        date: "2026",
        description:
          "Hosted a requirements workshop covering stakeholder mapping and acceptance criteria.",
      },
    ];

    render(<Activities items={customItems} />);

    expect(screen.getByText("Custom BA Meetup")).toBeInTheDocument();
    expect(screen.getByText("Local Analyst Group")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getAllByTestId("activity-entry")).toHaveLength(1);
  });

  it("renders an empty list when items is empty", () => {
    render(<Activities items={[]} />);

    expect(screen.queryAllByTestId("activity-entry")).toHaveLength(0);
    expect(screen.getByTestId("activities-heading")).toBeInTheDocument();
  });
});
