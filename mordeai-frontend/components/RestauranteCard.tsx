import { Restaurante } from "@/types/restaurante";

type Props = {
  restaurante: Restaurante;
  favorito: boolean;
  onFavoritar: () => void;
};

export default function RestauranteCard({ restaurante, favorito, onFavoritar }: Props) {
  const { nota } = restaurante;
  const cheias = nota ? Math.round(nota) : 0;
  const estrelas = "★".repeat(cheias) + "☆".repeat(5 - cheias);

  return (
    <div className="rounded-xl border border-gray-300 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">{restaurante.nome}</h2>
        <button
          onClick={onFavoritar}
          aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className="text-xl"
        >
          {favorito ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="mt-1 flex flex-wrap gap-1">
        {restaurante.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {tag}
          </span>
        ))}
      </div>

      {nota !== undefined && (
        <p className="mt-2 text-yellow-500">
          {estrelas} <span className="text-gray-500">{nota.toFixed(1)}</span>
        </p>
      )}

      <p className="mt-1 text-sm text-gray-500">{restaurante.endereco}</p>
    </div>
  );
}

//Um componente é um pedaço de tela reutilizável. Esse recebe um restaurante e desenha o cartão dele. As classes como rounded-xl e p-4 são do Tailwind: borda arredondada e espaçamento interno.