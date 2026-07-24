import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HtmlLang } from "@/components/HtmlLang";
import { getSiteMode } from "@/lib/mode";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="en" />
      <Header lang="en" mode={getSiteMode()} />
      <main className="pt-16">{children}</main>
      <Footer lang="en" />
    </>
  );
}
