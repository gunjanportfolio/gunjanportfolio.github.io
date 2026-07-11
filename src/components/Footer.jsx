import { Link } from "react-router-dom";

import { SITE_FULL_NAME } from "../config/site";
import { socialLinks } from "../constants";

function isExternalLink(link) {
  return link.startsWith("http://") || link.startsWith("https://");
}

const Footer = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <footer className="footer font-poppins" data-testid="site-footer">
      <hr className="border-slate-200" />

      <div className="footer-container">
        <p>
          © {copyrightYear} <strong>{SITE_FULL_NAME}</strong>. All rights
          reserved.
        </p>

        <div className="flex gap-3 justify-center items-center">
          {socialLinks.map((link) => {
            if (isExternalLink(link.link)) {
              return (
                <a
                  key={link.name}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <img
                    src={link.iconUrl}
                    alt={link.name}
                    className="w-6 h-6 object-contain"
                  />
                </a>
              );
            }

            return (
              <Link key={link.name} to={link.link} aria-label={link.name}>
                <img
                  src={link.iconUrl}
                  alt={link.name}
                  className="w-6 h-6 object-contain"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
