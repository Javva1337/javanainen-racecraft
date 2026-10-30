import { Header } from "@/components/Header";
import { ChromeGate, MainGate } from "@/components/ChromeGate";
import { Footer } from "@/components/Footer";
import { HtmlLang } from "@/components/HtmlLang";
import { getSiteMode } from "@/lib/mode";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="en" />
      <ChromeGate>
        <Header lang="en" mode={getSiteMode()} />
      </ChromeGate>
      <MainGate>{children}</MainGate>
      <ChromeGate>
        <Footer lang="en" />
      </ChromeGate>
    </>
  );
}
