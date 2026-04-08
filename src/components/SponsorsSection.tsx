import { Eye, Heart } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import sponsorPrimab from "@/assets/sponsor-primab.png";

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

        {/* Logo grid */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-[3/1] bg-transparent border border-primary/30 flex items-center justify-center hover:border-primary/50 transition-colors p-4">
              <img src={sponsorPrimab} alt="PrimAB" className="max-h-full max-w-full object-contain" />
            </div>
            {[2, 3, 4].map((key) => (
              <a
                key={key}
                href="#kontakt"
                className="aspect-[3/1] bg-transparent border border-dashed border-primary/20 flex items-center justify-center hover:border-primary/40 transition-colors p-4 group"
              >
                <span className="text-muted-foreground text-xs tracking-widest uppercase group-hover:text-primary transition-colors">
                  Din logotyp här?
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#kontakt"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-300"
          >
            Bli partner
          </a>
        </div>
      </div>
    </section>
  );
}