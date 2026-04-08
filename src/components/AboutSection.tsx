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
            Uppvuxen i Dalarna började Rickard sin motorsportresa redan vid 10 års ålder bakom ratten på en gokart. 
            Intresset växte snabbt och ledde vidare till tävlingar i bland annat Renault Clio Cup och JTCC. 
            Under tiden på Racinggymnasiet i Mjölby flyttade han till Östergötland – och det var där hyrkarten 
            på allvar tog över.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            2015 vann Rickard den första upplagan av SRKC i Linköping, vilket öppnade dörren till Kart World 
            Championship i Italien. Att köra upp Sverige från sista till första plats i Nations Cup är fortfarande 
            ett av karriärens starkaste minnen. I den individuella tävlingen nådde han final efter en pallplats i semi.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Året därpå arrangerade han själv SRKC 2016 och tog sig åter till VM i Italien – där han vann 
            finalheatet och slutade totalt trea i världsmästerskapet. Ett resultat som betydde enormt, både 
            personligen och för svensk hyrkart. Finaler i VM 2017 (Spanien), VM i Polen (uppkörning från 16:e 
            till 9:e plats) och SRKC-vinsten i Göteborg 2018 följde.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Efter en period som "pensionerad" har drömmen aldrig riktigt släppt. Nu satsar Rickard åter mot 
            världstoppen – med VM i hyrkart i Billund, Danmark i juni 2026 som nästa mål. På många sätt sluts 
            cirkeln, men ett nytt kapitel har precis börjat.
          </p>
        </div>
      </div>
    </section>
  );
}
