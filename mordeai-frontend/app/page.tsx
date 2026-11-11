import ListaRestaurantes from "@/components/ListaRestaurantes";
import { listarRestaurantes } from "@/services/restaurantes";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Meus restaurantes</h1>
      <ListaRestaurantes restaurantes={restaurantes} />
    </main>
  );
}