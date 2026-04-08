import { useState } from "react";
import { Mail } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder
  };

  return (
    <section id="kontakt" className="section-padding bg-secondary/30">
      <div ref={ref} className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">Kontakt</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Mail size={16} className="text-primary" />
            <a href="mailto:rickard@rickardjavanainen.se" className="hover:text-primary transition-colors">rickard@rickardjavanainen.se</a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">Namn</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Ditt namn"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">E-post</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="din@epost.se"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">Meddelande</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Ditt meddelande..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-300"
          >
            Skicka
          </button>
        </form>
      </div>
    </section>
  );
}
