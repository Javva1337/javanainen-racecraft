import { Header } from "@/components/Header";
import { ChromeGate, MainGate } from "@/components/ChromeGate";
import { Footer } from "@/components/Footer";
import { getSiteMode } from "@/lib/mode";

export default function SwedishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChromeGate>
        <Header lang="sv" mode={getSiteMode()} />
      </ChromeGate>
      <MainGate>{children}</MainGate>
      <ChromeGate>
        <Footer lang="sv" />
      </ChromeGate>
    </>
  );
}
