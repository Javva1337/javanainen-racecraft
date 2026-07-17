import type { Metadata } from "next";
import { AdminForm } from "./AdminForm";

export const metadata: Metadata = {
  title: "Publicera rapport",
  robots: { index: false, follow: false },
};

/**
 * Dold publiceringssida för dagliga VM-rapporter. Nås bara via direktlänk,
 * indexeras inte och skyddas av lösenord i API-routen (/api/admin/publicera).
 */
export default function AdminPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-5 py-10 sm:py-14">
      <header className="mb-8">
        <p className="heading-caps mb-2 text-xs tracking-[0.14em] text-flagyellow">
          VM 2026 · Dagsrapport
        </p>
        <h1 className="heading-caps text-3xl font-bold text-snow">Publicera rapport</h1>
        <p className="mt-2 text-sm text-mist">
          Fyll i dagens siffror och berättelse — faktarutan, delningsbilden och
          VM-statusen på startsidan uppdateras automatiskt.
        </p>
      </header>
      <AdminForm />
    </main>
  );
}
