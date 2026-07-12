import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  SITE_CV_FILE_NAME,
  SITE_CV_LABEL,
  getSiteCvHref,
} from "../../config/site";
import DownloadCvButton from "./DownloadCvButton";

describe("DownloadCvButton", () => {
  it("links to the CV PDF for download", () => {
    render(<DownloadCvButton />);

    const downloadLink = screen.getByTestId("download-cv-button");

    expect(downloadLink).toHaveAttribute("href", getSiteCvHref());
    expect(downloadLink).toHaveAttribute("download", SITE_CV_FILE_NAME);
    expect(downloadLink).not.toHaveAttribute("target");
    expect(downloadLink).toHaveTextContent(SITE_CV_LABEL);
  });
});
