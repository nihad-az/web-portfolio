import "./technology-card.css";
import htmlImage from "../../images/html-icon.svg";
import cssImage from "../../images/css-icon.svg";
import jsImage from "../../images/javascript-icon.svg";
import reactImage from "../../images/react-icon.svg";
import tsImage from "../../images/typescript-icon.svg";
import nextjsImage from "../../images/nextjs-icon.svg";

const techCards = {
  html: {
    cardId: "html-icon",
    cardTitle: "HTML",
    cardSource: htmlImage,
    cardAlt: "HTML",
  },
  css: {
    cardId: "css-icon",
    cardTitle: "CSS",
    cardSource: cssImage,
    cardAlt: "CSS",
  },
  javascript: {
    cardId: "javascript-icon",
    cardTitle: "JavaScript",
    cardSource: jsImage,
    cardAlt: "JavaScript",
  },
  react: {
    cardId: "react-icon",
    cardTitle: "React",
    cardSource: reactImage,
    cardAlt: "React",
  },
  typescript: {
    cardId: "typescript-icon",
    cardTitle: "TypeScript",
    cardSource: tsImage,
    cardAlt: "TypeScript",
  },
  nextjs: {
    cardId: "nextjs-icon",
    cardTitle: "Next.js",
    cardSource: nextjsImage,
    cardAlt: "Next.js",
  },
};

function TechnologyCard() {
  return (
    <div className="technology-card-container">
      {Object.values(techCards).map((card) => (
        <div className="technology-card" key={card.cardId}>
          <p>{card.cardTitle}</p>
          <img src={card.cardSource} alt={card.cardAlt} id={card.cardId} />
        </div>
      ))}
    </div>
  );
}

export default TechnologyCard;
