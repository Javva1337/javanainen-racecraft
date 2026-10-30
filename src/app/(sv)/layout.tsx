import { Header } from "@/components/Header";
import { ChromeGate } from "@/components/ChromeGate";
import { Footer } from "@/components/Footer";
import { getSiteMode } from "@/lib/mode";

export default function SwedishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChromeGate>
        <Header lang="sv" mode={getSiteMode()} />
      </ChromeGate>
      <main className="pt-16">{children}</main>
      <ChromeGate>
        <Footer lang="sv" />
      </ChromeGate>
    </>
  );
}
