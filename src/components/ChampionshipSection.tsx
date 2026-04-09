import { useScrollReveal } from "./useScrollReveal";

const formatSteps = [
  { number: "8", label: "Kvalheat" },
  { number: "1", label: "Semifinal" },
  { number: "18", label: "Finalister" },
];

const requirements = [
  "Stabil prestation över flera dagar",
  "Hantera olika startpositioner",
  "Beslutsfattande i trafik",
  "Anpassning till olika karts",
];

const traits = ["Racecraft", "Strategi", "Konsekvens"];

export default function ChampionshipSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="vm2026" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-12 h-px bg-primary mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Världsmästerskapet 2026
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Kart World Championship samlar förare från hela världen under en intensiv
            tävlingsvecka. Årets upplaga består av över 160 förare, vilket gör det till
            ett av de största internationella mästerskapen inom hyrkarting.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mt-4">
            Tävlingen avgörs under lika förutsättningar där alla kör med likvärdigt
            material och samma viktklass. Resultat avgörs i hög grad av förarens beslut,
            tempo och förmåga att prestera över tid.
          </p>
        </div>

        {/* Format */}
        <div
          className={`mb-16 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-8">
            Format
          </h3>
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6">
            {formatSteps.map((step, i) => (
              <div
                key={step.label}
                className="relative border border-border rounded-lg p-6 md:p-8 text-center bg-card"
              >
                <span className="block font-display text-4xl md:text-5xl text-primary mb-2">
                  {step.number}
                </span>
                <span className="text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
                  {step.label}
                </span>
                {i < formatSteps.length - 1 && (
                  <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Totalt kör varje förare upp till 10 race under veckan. Ett resultat räknas
            bort i kvalet, därefter summeras poängen. Ett upplägg som premierar jämnhet
            och förmåga att leverera i varje race.
          </p>
        </div>

        {/* Vad som avgör + Karaktär */}
        <div
          className={`mb-16 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-6">
            Vad som avgör
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            Mästerskapet vinns av den förare som samlar flest poäng över hela tävlingen.
            Enstaka toppresultat räcker inte — det handlar om helheten.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {requirements.map((req) => (
              <div
                key={req}
                className="border border-border rounded-lg p-4 bg-card text-sm text-muted-foreground"
              >
                {req}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Med samma utrustning för alla blir skillnaderna mellan förare tydliga. KWC
            är ett test av{" "}
            {traits.map((t, i) => (
              <span key={t}>
                <span className="text-foreground font-medium">{t.toLowerCase()}</span>
                {i < traits.length - 1 ? (i === traits.length - 2 ? " och " : ", ") : ""}
              </span>
            ))}
            . Den mest kompletta föraren över tid står som vinnare.
          </p>
        </div>

        {/* Nations Cup */}
        <div
          className={`transition-all duration-700 delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
            Nations Cup
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Parallellt med individuella mästerskapet körs Nations Cup — en separat
            tävling där förare representerar sitt land. Fokus ligger på lagprestation,
            där varje resultat bidrar till nationens totala placering. Det innebär
            ytterligare ett tävlingsmoment under veckan, med andra förutsättningar och
            ett tydligare lagperspektiv.
          </p>
        </div>
      </div>
    </section>
  );
}
