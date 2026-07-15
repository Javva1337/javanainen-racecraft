import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Kurbits } from "@/components/Kurbits";

export const metadata: Metadata = {
  title: "Bredsladd — sidan finns inte",
};

export default function NotFound() {
  return (
    <>
      <Header lang="sv" />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-16 text-center">
        <p className="heading-caps tabular mb-4 text-7xl font-bold text-flagblue sm:text-8xl">
          404
        </p>
        <h1 className="heading-caps mb-3 text-xl text-snow sm:text-2xl">Bredsladd</h1>
        <p className="mb-8 max-w-md text-mist">
          Den här sidan finns inte.
        </p>
        <Link href="/" className="btn btn-primary">
          Tillbaka till depån →
        </Link>
        <div className="mt-16 text-flagblue" aria-hidden="true">
          <Kurbits className="h-8 w-56 opacity-60" />
        </div>
      </main>
      <Footer lang="sv" />
    </>
  );
}
