import { HOME_SOCIAL_LINKS } from "../../constants/homeSocialLinks";

function HomeSocialLinks() {
  return (
    <nav
      aria-label="Social links"
      className="home-social-links"
      data-testid="home-social-links"
    >
      {HOME_SOCIAL_LINKS.map((socialLink) => (
        <a
          key={socialLink.name}
          aria-label={socialLink.name}
          className="home-social-link"
          data-testid={`home-social-link-${socialLink.name.toLowerCase()}`}
          href={socialLink.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt=""
            className="home-social-link-icon"
            src={socialLink.iconUrl}
          />
        </a>
      ))}
    </nav>
  );
}

export default HomeSocialLinks;
