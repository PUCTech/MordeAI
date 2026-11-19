import Cabecalho from "@/components/Cabecalho";
import ListaRestaurantes from "@/components/ListaRestaurantes";
import { listarRestaurantes } from "@/services/restaurantes";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <>
      <Cabecalho modo="usuario" ativo="perfil" />

      <main className="mx-auto max-w-6xl px-6 py-10">
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