import Header from "./components/header/header.jsx";
import Introduction from "./components/introduction/introduction.jsx";
import TechnologyCard from "./components/technology/technology-card.jsx";
import Project from "./components/project/project.jsx";
import Grid from "./components/bgGrid/grid.jsx";

function App() {
  return (
    <>
      <Grid />
      <Header />
      <main>
        <Introduction />
        <TechnologyCard />
        <Project />
      </main>
    </>
  );
}

export default App;
