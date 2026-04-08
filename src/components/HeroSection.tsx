import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="gold-line mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }} />
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Rickard Javanainen
        </h1>
        <p
          className="text-sm md:text-base tracking-[0.25em] uppercase text-muted-foreground mb-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          Hyrkart&ensp;|&ensp;3:e plats VM 2016&ensp;|&ensp;VM Billund 2026
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1s" }}
        >
          <a
            href="#karriar"
            className="px-8 py-3 border border-primary text-primary text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Se karriär
          </a>
          <a
            href="#partners"
            className="px-8 py-3 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-300"
          >
            Bli partner
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up" style={{ animationDelay: "1.5s" }}>
        <ChevronDown className="text-muted-foreground animate-scroll-hint" size={24} />
      </div>
    </section>
  );
}
