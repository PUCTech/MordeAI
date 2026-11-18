import ListaRestaurantes from "@/components/ListaRestaurantes";
import { listarRestaurantes } from "@/services/restaurantes";
import Image from "next/image";
import Link from "next/link";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <>
      {/* Barra de cima */}
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="MordeAI, página inicial">
            <Image
              src="/logo.png"
              alt="MordeAI"
              width={188}
              height={55}
              priority
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
          Seu mapa de sabores
        </p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
          Meus restaurantes.
        </h1>
        <p className="mb-8 mt-2 text-lg text-neutral-700">
          Cada mesa conta uma história. Guarde a próxima.
        </p>

        <ListaRestaurantes restaurantes={restaurantes} />
      </main>
    </>
  );
}