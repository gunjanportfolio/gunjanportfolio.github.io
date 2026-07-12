import { profilePicture } from "../../assets/images";
import { SITE_FULL_NAME, SITE_PROFILE_ALT, SITE_TAGLINE } from "../../config/site";

function AboutProfilePhoto() {
  return (
    <figure
      className="about-profile-photo"
      data-testid="about-profile-photo"
    >
      <div className="about-profile-photo-ring">
        <img
          alt={SITE_PROFILE_ALT}
          className="about-profile-photo-image"
          src={profilePicture}
        />
      </div>
      <figcaption className="about-profile-photo-caption">
        <span className="about-profile-photo-name">{SITE_FULL_NAME}</span>
        <span className="about-profile-photo-tagline">{SITE_TAGLINE}</span>
      </figcaption>
    </figure>
  );
}

export default AboutProfilePhoto;
