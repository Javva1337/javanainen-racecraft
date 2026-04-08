import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PositioningSection from "@/components/PositioningSection";
import AboutSection from "@/components/AboutSection";
import CareerSection from "@/components/CareerSection";
import ResultsSection from "@/components/ResultsSection";
import GallerySection from "@/components/GallerySection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <PositioningSection />
      <AboutSection />
      <CareerSection />
      <ResultsSection />
      <GallerySection />
      <SponsorsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
