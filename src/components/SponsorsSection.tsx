import { Eye, Award, Handshake } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import sponsorPrimab from "@/assets/sponsor-primab.png";

const values = [
  {
    icon: Eye,
    title: "Exponering",
    desc: "Synlighet på internationella arenor, sociala medier och i medierapportering kring VM-satsningen.",
  },
  {
    icon: Award,
    title: "Varumärkesbyggande",
    desc: "Associera ditt varumärke med elit, ambition och strategisk precision på världsnivå.",
  },
  {
    icon: Handshake,
    title: "Professionell representation",
    desc: "En förare som representerar partners med trovärdighet, professionalitet och resultat.",
  },
];

export default function SponsorsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="partners" className="section-padding">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">Partners & Sponsorer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            En investering i Rickard är en investering i synlighet, prestige och resultat. 
            Bli en del av satsningen mot världstoppen.
          </p>
        </div>

        {/* Value props */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
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
          <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8">
            Nuvarande & framtida partners
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 1, logo: sponsorPrimab, alt: "PrimAB" },
              { key: 2 },
              { key: 3 },
              { key: 4 },
            ].map((item) => (
              <div
                key={item.key}
                className="aspect-[3/1] bg-transparent border border-primary/30 flex items-center justify-center hover:border-primary/50 transition-colors p-4"
              >
                {item.logo ? (
                  <img src={item.logo} alt={item.alt} className="max-h-full max-w-full object-contain brightness-0 invert" />
                ) : (
                  <span className="text-muted-foreground text-xs tracking-widest uppercase">Logotyp {item.key}</span>
                )}
              </div>
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
