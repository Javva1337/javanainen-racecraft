import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SwedishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header lang="sv" />
      <main className="pt-16">{children}</main>
      <Footer lang="sv" />
    </>
  );
}
