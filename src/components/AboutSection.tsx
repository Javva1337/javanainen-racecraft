import { useScrollReveal } from "./useScrollReveal";
import portrait from "@/assets/portrait.jpg";

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="om" className="section-padding">
      <div ref={ref} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Portrait */}
        <div
          className={`aspect-[3/4] bg-secondary border border-border overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <img src={portrait} alt="Rickard Javanainen" className="w-full h-full object-cover object-top" />
        </div>

        {/* Text */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="gold-line mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Om Rickard</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Uppvuxen i Dalarna. Började köra gokart vid 10 års ålder. Tävlade senare i Renault Clio Cup och JTCC innan hyrkarten tog över under tiden på Racinggymnasiet i Mjölby.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Vann första upplagan av SRKC i Linköping 2015. Samma år: VM i Italien, där jag körde Sveriges lag från sista till första plats i Nations Cup. Individuellt: semifinalplacering med pallplats, vidare till final.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            VM i Italien 2016: vinst i finalen, 3:e plats totalt. Finalist i VM 2017 (Spanien). SRKC-vinst i Göteborg 2018 efter jämn final mot Max Sjölander. VM-final i Polen samma år — uppkörning från 16:e till 9:e plats. SRKC-final 2021: 6:e plats, näst bästa svensk.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nu åter aktiv med fokus på VM i hyrkart, Billund, Danmark, juni 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
