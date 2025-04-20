import profilePicture from "../../images/profile-picture.jpeg";
import mailIcon from "../../images/mail-icon.svg";
import "./header.css";

function Header() {
  return (
    <header>
      <div className="profile-picture-container">
        <img src={profilePicture} alt="Profile picture" id="profile-picture" />
      </div>
      <p>Nihad Ibrahimli</p>
      <div className="contact-icon-container">
        <a href="mailto:hello@nihad.az">
          <img src={mailIcon} alt="Mail icon" />
        </a>
      </div>
    </header>
  );
}

export default Header;
