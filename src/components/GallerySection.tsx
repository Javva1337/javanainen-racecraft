import { useState } from "react";
import { X } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.png";

const images = [
  { id: 1, label: "Action på banan", span: "col-span-2 row-span-2", src: gallery1 },
  { id: 2, label: "Fokus före start", span: "", src: gallery2 },
  { id: 3, label: "Podium", span: "", src: gallery3 },
  { id: 4, label: "Strategi", span: "", src: "" },
  { id: 5, label: "Helmet close-up", span: "", src: gallery5 },
  { id: 6, label: "Racing i regn", span: "col-span-2", src: "" },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="galleri" className="section-padding bg-secondary/30">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Galleri</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img.id)}
              className={`${img.span} relative aspect-square bg-secondary border border-border overflow-hidden group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {img.src ? (
                <img src={img.src} alt={img.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs tracking-[0.15em] uppercase group-hover:text-primary transition-colors">
                    {img.label}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          {(() => {
            const img = images.find(i => i.id === lightbox);
            return img?.src ? (
              <img src={img.src} alt={img.label} className="max-w-4xl w-full max-h-[80vh] object-contain" />
            ) : (
              <div className="max-w-4xl w-full aspect-video bg-secondary border border-border flex items-center justify-center">
                <span className="text-muted-foreground text-sm tracking-[0.15em] uppercase">Bild {lightbox}</span>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
