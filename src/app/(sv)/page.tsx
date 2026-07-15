import { TAGLINE } from "@/lib/site";

// Tillfällig platshållare — ersätts av riktiga startsidan i steg 3.
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="heading-caps text-4xl font-bold text-snow">Rickard Javanainen</h1>
      <p className="mt-4 text-mist">{TAGLINE.sv}</p>
    </div>
  );
}
