import Cabecalho from "@/components/Cabecalho";
import ListaRestaurantes from "@/components/ListaRestaurantes";
import { listarRestaurantes } from "@/services/restaurantes";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <>
      <Cabecalho modo="usuario" ativo="perfil" />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <ListaRestaurantes restaurantes={restaurantes} />
      </main>
    </>
  );
}