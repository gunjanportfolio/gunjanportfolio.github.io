import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Alert from "./Alert";

describe("Alert", () => {
  it("renders a success alert", () => {
    render(<Alert type="success" text="Saved" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Success");
    expect(screen.getByRole("alert")).toHaveTextContent("Saved");
  });

  it("renders a danger alert", () => {
    render(<Alert type="danger" text="Failed to send" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to send");
  });
});
