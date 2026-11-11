"use client";

import { useState } from "react";
import { Restaurante } from "@/types/restaurante";
import RestauranteCard from "@/components/RestauranteCard";

export default function ListaRestaurantes({
  restaurantes,
}: {
  restaurantes: Restaurante[];
}) {
  const [filtro, setFiltro] = useState("Todas");
  const [favoritos, setFavoritos] = useState<number[]>([]);

  function alternarFavorito(id: number) {
    setFavoritos((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
  );
}

  const tags = ["Todas", ...new Set(restaurantes.flatMap((r) => r.tags))];

  const visiveis =
    filtro === "Todas"
      ? restaurantes
      : restaurantes.filter((r) => r.tags.includes(filtro));

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`rounded-full border px-4 py-1 text-sm ${
              filtro === t
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((r) => (
          <RestauranteCard
            key={r.id}
            restaurante={r}
            favorito={favoritos.includes(r.id)}
            onFavoritar={() => alternarFavorito(r.id)}
          />
        ))}
      </div>
    </>
  );
}