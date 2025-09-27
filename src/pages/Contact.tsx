import { Header } from "@/components/ui/header";
import { ContactSection } from "@/components/ui/contact-section";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </div>
  );
};

export default Contact;