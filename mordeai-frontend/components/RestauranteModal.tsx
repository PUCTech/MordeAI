"use client";

import { useEffect } from "react";
import { Restaurante } from "@/types/restaurante";
import { formatarMoeda } from "@/utils/formatar";

type Props = {
  restaurante: Restaurante;
  favorito: boolean;
  onFechar: () => void;
};

export default function RestauranteModal({ restaurante, favorito, onFechar }: Props) {
  // fecha com a tecla Esc e trava o scroll do fundo
  useEffect(() => {
    const aoApertar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    document.addEventListener("keydown", aoApertar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoApertar);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  const dataFormatada = restaurante.data
    ? new Date(restaurante.data + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar} // clicar no fundo fecha
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={restaurante.nome}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#EEEDE5] text-neutral-900"
        onClick={(e) => e.stopPropagation()} // clicar dentro NÃO fecha
      >
        {/* Cabeçalho marrom */}
        <div className="relative flex items-center gap-4 bg-[#7A3F2E] p-8 pr-20">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#B80C09] text-2xl font-bold text-white">
            {restaurante.nome[0]}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E6D5BE]">
              {restaurante.tags[0]}
            </p>
            <h2 className="text-3xl font-bold text-[#EEE2C8]">{restaurante.nome}</h2>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-8">
          {/* Três caixinhas */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Caixa titulo="Nota">
              <span className="text-2xl font-bold">
                <span className="text-[#B80C09]">★</span> {restaurante.nota?.toFixed(1) ?? "—"}
              </span>
              <span className="text-sm text-neutral-500"> / 5</span>
            </Caixa>
            <Caixa titulo="Valor gasto">
              <span className="text-xl font-bold">{formatarMoeda(restaurante.preco)}</span>
            </Caixa>
            <Caixa titulo="Favorito">
              <span className="font-semibold">
                <span className="text-[#B80C09]">{favorito ? "♥" : "♡"}</span>{" "}
                {favorito ? "Sim, voltaria" : "Ainda não"}
              </span>
            </Caixa>
          </div>

          <hr className="border-[#B5BC8A]" />

          {/* Endereço e data */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo titulo="Endereço" valor={restaurante.endereco} />
            <Campo titulo="Data da visita" valor={dataFormatada} />
          </div>

          <hr className="border-[#B5BC8A]" />

          {/* Comentário */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B80C09]">
              Comentário da experiência
            </p>
            <div className="rounded-2xl border border-[#B5BC8A] bg-[#EEE2C8] p-4">
              {restaurante.comentario || "Sem comentário."}
            </div>
          </div>

          <button
            onClick={onFechar}
            className="rounded-full bg-[#B80C09] px-6 py-3 font-semibold text-white"
          >
            Voltar ao perfil
          </button>
        </div>
      </div>
    </div>
  );
}

function Caixa({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#B5BC8A] bg-[#EEE2C8] p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-600">{titulo}</p>
      {children}
    </div>
  );
}

function Campo({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#B80C09]">{titulo}</p>
      <p className="text-lg font-bold">{valor}</p>
    </div>
  );
}