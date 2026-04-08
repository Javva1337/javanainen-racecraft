import { useScrollReveal } from "./useScrollReveal";

const milestones = [
  { year: "2005", title: "Gokart", desc: "Första steget in i motorsport. 10 år gammal." },
  { year: "2015", title: "SRKC-vinst & VM Italien", desc: "Vinnare av SRKC Linköping. Nations Cup-seger och individuell final i VM." },
  { year: "2016", title: "VM Italien — 3:e plats", desc: "Vinst i finalheatet. Bronsmedalj totalt i världsmästerskapet." },
  { year: "2017", title: "VM-final, Spanien", desc: "Kvalificerade sig till final i världsmästerskapet." },
  { year: "2018", title: "SRKC-vinst & VM-final Polen", desc: "Vann SRKC Göteborg. VM-final: uppkörning från 16:e till 9:e plats." },
  { year: "2021", title: "SRKC-final", desc: "6:e plats totalt. Näst bästa svensk." },
  { year: "2026", title: "VM Billund, Danmark", desc: "Världsmästerskapet i hyrkart. Juni 2026." },
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
