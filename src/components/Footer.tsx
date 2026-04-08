export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display text-sm tracking-widest text-primary uppercase">
          Rickard Javanainen
        </span>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rickard Javanainen. Alla rättigheter förbehållna.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors">
            Instagram
          </a>
          <a href="#" className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
