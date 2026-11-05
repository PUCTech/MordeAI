import { Restaurante } from "@/types/restaurante";

export default function RestauranteCard({ restaurante }: { restaurante: Restaurante }) {
  const cheias = Math.round(restaurante.nota);
  const estrelas = "★".repeat(cheias) + "☆".repeat(5 - cheias);

  return (
    <div className="rounded-xl border border-gray-300 p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{restaurante.nome}</h2>
      <p className="text-sm text-gray-500">{restaurante.culinaria}</p>
      <p className="mt-2 text-yellow-500">
        {estrelas} <span className="text-gray-500">{restaurante.nota.toFixed(1)}</span>
      </p>
      <p className="mt-1 text-sm text-gray-500">{restaurante.endereco}</p>
    </div>
  );
}

//Um componente é um pedaço de tela reutilizável. Esse recebe um restaurante e desenha o cartão dele. As classes como rounded-xl e p-4 são do Tailwind: borda arredondada e espaçamento interno.