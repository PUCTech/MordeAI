import RestauranteCard from "@/components/RestauranteCard";
import { listarRestaurantes } from "@/services/restaurantes";

export default async function RestaurantesPage() {
  const restaurantes = await listarRestaurantes();

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Meus restaurantes</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurantes.map((r) => (
          <RestauranteCard key={r.id} restaurante={r} />
        ))}
      </div>
    </main>
  );
}

//A página pede a lista, e para cada restaurante desenha um card. O grid organiza os cards em colunas.