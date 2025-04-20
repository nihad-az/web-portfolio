import "./project.css";
import cardImage from "../../images/github-icon.svg";

const projectCard = {
  carstat: {
    title: "carstat.net",
    link: "#",
    description:
      "carstat.net is a web app I built for car enthusiasts who enjoy comparing vehicles. It features a clean, intuitive interface built with React and TypeScript, backed by a MongoDB database. Users can explore a wide range of car models and view their specs side by side—everything from performance stats to design features. The goal was to create a smooth, responsive experience that makes car comparison simple and enjoyable.",
    alt: "Github icon",
    image: cardImage,
  },
  comingSoon: {
    title: "Coming Soon",
    link: "#",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque perferendis dolorem illum laborum reprehenderit quod accusantium vel. Officia quae quam voluptatibus ea ipsa fuga sunt ipsum maiores accusamus! Animi officiis, optio impedit quam aspernatur quod odio magni labore molestiae laborum.",
    alt: "Github icon",
    image: cardImage,
  },
};

function Project() {
  return (
    <div className="project-card-container">
      {Object.values(projectCard).map((card) => (
        <div className="project-card" key={card.title}>
          <div className="project-card-header">
            <p>{card.title}</p>
            <a href={card.link}>
              <img src={card.image} alt={card.alt} />
            </a>
          </div>
          <p className="project-card-description">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Project;
