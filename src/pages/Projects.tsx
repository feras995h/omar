import { Header } from "@/components/ui/header";
import { ProjectsSection } from "@/components/ui/projects-section";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section id="projects">
          <ProjectsSection />
        </section>
      </main>
    </div>
  );
};

export default Projects;