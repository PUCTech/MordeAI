import ListaRestaurantes from "@/components/ListaRestaurantes";
import { listarRestaurantes } from "@/services/restaurantes";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <>
      {/* Barra de cima */}
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-serif text-3xl text-tinta">
            Morde<span className="italic text-vermelho">AI</span>
          </span>
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