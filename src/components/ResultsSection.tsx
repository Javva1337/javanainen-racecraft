import { useScrollReveal } from "./useScrollReveal";

const results = [
  { event: "Världsmästerskapet", location: "Internationell", date: "2022", position: "3:e", podium: true },
  { event: "Nordiska Mästerskapet", location: "Stockholm", date: "2023", position: "1:a", podium: true },
  { event: "European Rental Kart Cup", location: "Berlin", date: "2023", position: "2:a", podium: true },
  { event: "Svenska Mästerskapet", location: "Göteborg", date: "2023", position: "1:a", podium: true },
  { event: "International Trophy", location: "Milano", date: "2024", position: "4:e", podium: false },
  { event: "Nordic Open", location: "Köpenhamn", date: "2024", position: "2:a", podium: true },
  { event: "Kvalificering VM", location: "Billund", date: "2024", position: "1:a", podium: true },
];

export default function ResultsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="resultat" className="section-padding">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Resultat</h2>
        </div>

        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Header */}
          <div className="hidden md:grid grid-cols-4 gap-4 text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border pb-3 mb-4">
            <span>Tävling</span>
            <span>Plats</span>
            <span>Datum</span>
            <span className="text-right">Position</span>
          </div>

          {/* Rows */}
          {results.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-4 py-4 border-b border-border/50 transition-all duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <span className="text-foreground font-medium text-sm">{r.event}</span>
              <span className="text-muted-foreground text-sm">{r.location}</span>
              <span className="text-muted-foreground text-sm">{r.date}</span>
              <span className={`text-sm md:text-right font-medium ${r.podium ? "text-primary" : "text-muted-foreground"}`}>
                {r.position}
                {r.podium && <span className="ml-2 text-xs">●</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
