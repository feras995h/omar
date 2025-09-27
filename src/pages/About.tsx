import { Header } from "@/components/ui/header";
import { AboutSection } from "@/components/ui/about-section";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section id="about">
          <AboutSection />
        </section>
      </main>
    </div>
  );
};

export default About;