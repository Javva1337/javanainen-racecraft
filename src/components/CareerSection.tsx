import { useScrollReveal } from "./useScrollReveal";

const milestones = [
  { year: "2019", title: "Första tävlingssäsongen", desc: "Debut inom hyrkarting med omedelbar potential." },
  { year: "2020", title: "Nationell framgång", desc: "Etablerade sig i toppen av den svenska scenen." },
  { year: "2021", title: "Internationellt genombrott", desc: "Första internationella tävlingar med starka resultat." },
  { year: "2022", title: "VM – Bronsmedalj", desc: "Tredjeplats i världsmästerskapet. En plats bland de bästa." },
  { year: "2023", title: "Strategisk utveckling", desc: "Förfinade racecraft och taktisk körning." },
  { year: "2024", title: "Mästerskapsförberedelse", desc: "Intensiv träning och uppbyggnad inför VM-satsningen." },
  { year: "2025", title: "VM Billund – Satsningen", desc: "Allt leder hit. Världsmästerskapet i Danmark." },
];

export default function CareerSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="karriar" className="section-padding bg-secondary/30">
      <div ref={ref} className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Karriär</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`relative flex items-start mb-12 last:mb-0 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-primary mt-1.5 z-10" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 ${i % 2 === 0 ? "md:pr-16 md:text-right md:w-1/2" : "md:pl-16 md:ml-[50%] md:w-1/2"}`}>
                <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">{m.year}</span>
                <h3 className="font-display text-lg text-foreground mt-1 mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
