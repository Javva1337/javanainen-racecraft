import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteMode } from "@/lib/mode";

export default function SwedishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header lang="sv" mode={getSiteMode()} />
      <main className="pt-16">{children}</main>
      <Footer lang="sv" />
    </>
  );
}
