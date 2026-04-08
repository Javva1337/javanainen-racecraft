import { Trophy, Brain, Target } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const stats = [
  {
    icon: Trophy,
    title: "Top 3 i VM",
    desc: "Tidigare bronsmedaljör i världsmästerskapet. Bevisad kapacitet på högsta nivå.",
  },
  {
    icon: Brain,
    title: "Strategisk racecraft",
    desc: "Vinner med precision och kalkyl. Varje lopp är en schackmatch på banan.",
  },
  {
    icon: Target,
    title: "VM Billund 2025",
    desc: "Siktar på det ultimata målet. Fokuserad satsning mot världsmästerskapet i Danmark.",
  },
];

export default function PositioningSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-secondary/30">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <div
              key={s.title}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <s.icon className="mx-auto mb-5 text-primary" size={32} strokeWidth={1.2} />
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
