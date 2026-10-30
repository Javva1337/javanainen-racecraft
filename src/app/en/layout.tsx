import { Header } from "@/components/Header";
import { ChromeGate } from "@/components/ChromeGate";
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
      <main className="pt-16">{children}</main>
      <ChromeGate>
        <Footer lang="en" />
      </ChromeGate>
    </>
  );
}
