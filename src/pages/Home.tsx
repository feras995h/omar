import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section id="home">
          <HeroSection />
        </section>
      </main>
    </div>
  );
};

export default Home;