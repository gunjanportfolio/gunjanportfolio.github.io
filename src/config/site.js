export const SITE_NAME = "Gunjan";
export const SITE_FULL_NAME = "Gunjan Bandekar";
export const SITE_TAGLINE = "Data Analyst & Treatment Coordinator";
export const SITE_LOCATION = "currently at Happy Kids Dental Clinic";
export const SITE_BIO =
  "Data Analyst and Treatment Coordinator currently working at Happy Kids Dental Clinic, with Business Analyst experience across healthcare and banking. Skilled in SQL, Python, Power BI/Tableau, requirements gathering, and AI-driven analytics.";
export const CONTACT_TO_NAME = "Gunjan Bandekar";
export const CONTACT_TO_EMAIL = "gunjanbandekar20@gmail.com";
export const SITE_LINKEDIN_URL = "https://www.linkedin.com/in/gunjanbandekar1320/";
export const SITE_GITHUB_URL = "https://github.com/gunjanportfolio";
export const SITE_INSTAGRAM_URL = "https://www.instagram.com/gunjaaan2/";
export const SITE_X_URL = "https://x.com";
export const FORMCARRY_ENDPOINT = "https://formcarry.com/s/BO_V3AU0Jro";
export const SITE_EDUCATION =
  "MSc. Management of Business Information Technology, University of Greenwich · Sep 2025";
export const SITE_CV_FILE_NAME = "Gunjan_Bandekar_CV.pdf";
export const SITE_CV_LABEL = "Download CV";
export const SITE_CV_PATH = `cv/${SITE_CV_FILE_NAME}`;

export function getSiteCvHref(baseUrl = import.meta.env.BASE_URL) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${SITE_CV_PATH}`;
}
