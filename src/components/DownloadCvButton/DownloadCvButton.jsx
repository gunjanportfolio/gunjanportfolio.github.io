import {
  SITE_CV_FILE_NAME,
  SITE_CV_LABEL,
  getSiteCvHref,
} from "../../config/site";

function DownloadCvButton() {
  return (
    <a
      className="download-cv-button"
      data-testid="download-cv-button"
      download={SITE_CV_FILE_NAME}
      href={getSiteCvHref()}
    >
      <span className="download-cv-button-glow" aria-hidden="true" />
      <span className="download-cv-button-label">{SITE_CV_LABEL}</span>
    </a>
  );
}

export default DownloadCvButton;
