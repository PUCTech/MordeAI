import { Restaurante } from "@/types/restaurante";
import { formatarDataCurta, formatarMoeda } from "@/utils/formatar";

type Props = {
  restaurante: Restaurante;
  favorito: boolean;
  onFavoritar: () => void;
  onAbrir: () => void;
};

export default function RestauranteCard({ restaurante, favorito, onFavoritar, onAbrir }: Props) {
  return (
    <div
      onClick={onAbrir}
      className="cursor-pointer rounded-3xl border border-borda bg-cartao p-4 text-neutral-900 transition hover:shadow-md sm:p-6"
    >
      {/* PARTE DE CIMA */}
      <div className="flex items-start gap-4">
        {/* Quadradinho com a inicial */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vermelho text-xl font-bold text-white">
          {restaurante.nome[0]}
        </div>

        {/* Culinária, nome e endereço */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
            {restaurante.tags[0]}
          </p>
          <h2 className="truncate text-xl font-bold">{restaurante.nome}</h2>
          <p className="truncate text-sm text-neutral-700">{restaurante.endereco}</p>
        </div>

        {/* Coração */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoritar();
          }}
          aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg text-vermelho ${
            favorito ? "border-vermelho" : "border-borda"
          }`}
        >
          {favorito ? "♥" : "♡"}
        </button>
      </div>

      <hr className="my-4 border-borda" />

      {/* RODAPÉ */}
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-bold">
          <span className="text-vermelho">★</span> {restaurante.nota?.toFixed(1) ?? "—"}
        </span>
        <span>{formatarDataCurta(restaurante.data)}</span>
        <span className="font-bold">{formatarMoeda(restaurante.preco)}</span>
      </div>
    </div>
  );
}