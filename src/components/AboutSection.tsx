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
            Rickard Javanainen är en av Sveriges mest lovande racingförare inom hyrkarting. Med en kombination av 
            analytiskt tänkande och rå racinginstinkt har han etablerat sig som en förare som tävlar med huvudet 
            lika mycket som med fötterna.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Med en tidigare tredjeplats i världsmästerskapet har Rickard bevisat att han tillhör världseliten. 
            Nu siktar han högre – med en dedikerad satsning mot VM i Billund, Danmark.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bakom varje prestation ligger disciplin, strategisk planering och en kompromisslös vilja att vinna. 
            Rickard representerar en ny generation av racingförare – professionell, strategisk och resultatdriven.
          </p>
        </div>
      </div>
    </section>
  );
}
