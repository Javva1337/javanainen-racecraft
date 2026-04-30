import { Eye, Heart, ArrowRight } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import labatusLogo from "@/assets/labatus-logo.svg";

const values = [
  {
    icon: Eye,
    title: "Exponering",
    desc: "Logotyp på racingoverall, digitala kanaler och takbox på bilen som tar oss till och från tävlingarna. Vill man slå på stort finns möjlighet att lacka om hjälmen.",
  },
  {
    icon: Heart,
    title: "Stötta satsningen",
    desc: "Var med på vägen mot VM-titeln. Associering med dokumenterade resultat på VM-nivå.",
  },
];

export default function SponsorsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="partners" className="section-padding">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">Partners</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Samarbeten byggs kring synlighet, trovärdighet och gemensamt värde.
          </p>
        </div>

        {/* Value props */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {values.map((v, i) => (
            <div
              key={v.title}
              className={`p-8 border border-border bg-card text-center transition-all duration-700 hover:border-primary/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <v.icon className="mx-auto mb-4 text-primary" size={28} strokeWidth={1.2} />
              <h3 className="font-display text-lg text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Official partner — Labatus */}
        <div
          className={`relative border border-primary/20 bg-card p-10 md:p-14 mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
          <div className="relative flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary mb-8">
              Officiell partner
            </span>
            <a
              href="https://labatus.se"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              aria-label="Labatus — officiell partner"
            >
              <img
                src={labatusLogo}
                alt="Labatus logotyp"
                className="w-full max-w-xs md:max-w-sm h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>

        {/* Partner CTA area */}
        <div
          className={`relative border border-primary/20 p-12 md:p-16 text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
          <p className="font-display text-xl md:text-2xl text-foreground mb-3 relative">
            Vill du synas här?
          </p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed mb-8 relative">
            Bli en del av resan tillsammans med Labatus. Din logotyp, ditt varumärke — synligt vid varje tävling och i alla kanaler.
          </p>
          <a
            href="#kontakt"
            className="relative inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-300 group"
          >
            Bli partner
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
