"use client";

import { useEffect, useState } from "react";
import { Restaurante } from "@/types/restaurante";
import { formatarMoeda } from "@/utils/formatar";

type Props = {
  restaurante: Restaurante;
  favorito: boolean;
  podeEditar?: boolean; // só os restaurantes cadastrados pela pessoa
  onEditar?: () => void;
  onExcluir?: () => void;
  onFechar: () => void;
};

export default function RestauranteModal({
  restaurante,
  favorito,
  podeEditar = false,
  onEditar,
  onExcluir,
  onFechar,
}: Props) {
  const [confirmando, setConfirmando] = useState(false);

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
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-fundo text-neutral-900"
        onClick={(e) => e.stopPropagation()} // clicar dentro NÃO fecha
      >
        {/* Cabeçalho marrom */}
        <div className="relative flex items-center gap-3 bg-marrom p-5 pr-16 sm:gap-4 sm:p-8 sm:pr-20">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-vermelho text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
            {restaurante.nome[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E6D5BE]">
              {restaurante.tags[0]}
            </p>
            <h2 className="text-2xl font-bold text-cartao sm:text-3xl">{restaurante.nome}</h2>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white sm:right-6 sm:top-6"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-5 sm:space-y-6 sm:p-8">
          {/* Três caixinhas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Caixa titulo="Nota">
              <span className="text-2xl font-bold">
                <span className="text-vermelho">★</span> {restaurante.nota?.toFixed(1) ?? "—"}
              </span>
              <span className="text-sm text-neutral-500"> / 5</span>
            </Caixa>
            <Caixa titulo="Valor gasto">
              <span className="text-xl font-bold">{formatarMoeda(restaurante.preco)}</span>
            </Caixa>
            <Caixa titulo="Favorito" className="col-span-2 sm:col-span-1">
              <span className="font-semibold">
                <span className="text-vermelho">{favorito ? "♥" : "♡"}</span>{" "}
                {favorito ? "Sim, voltaria" : "Ainda não"}
              </span>
            </Caixa>
          </div>

          <hr className="border-borda" />

          {/* Endereço e data */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo titulo="Endereço" valor={restaurante.endereco} />
            <Campo titulo="Data da visita" valor={dataFormatada} />
          </div>

          <hr className="border-borda" />

          {/* Comentário */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-vermelho">
              Comentário da experiência
            </p>
            <div className="rounded-2xl border border-borda bg-cartao p-4">
              {restaurante.comentario || "Sem comentário."}
            </div>
          </div>

          {/* Ações */}
          {confirmando ? (
            <div role="alert" className="rounded-2xl border border-vermelho bg-cartao p-4">
              <p className="font-bold">Excluir {restaurante.nome}?</p>
              <p className="mt-1 text-sm text-neutral-700">
                Essa ação não pode ser desfeita.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={onExcluir}
                  className="rounded-full bg-vermelho px-5 py-2 font-bold text-white"
                >
                  Sim, excluir
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="rounded-full border border-borda px-5 py-2 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onFechar}
                className="rounded-full bg-vermelho px-6 py-3 font-semibold text-white"
              >
                Voltar ao perfil
              </button>
              {podeEditar && (
                <>
                  <button
                    onClick={onEditar}
                    className="rounded-full border border-borda bg-cartao px-6 py-3 font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmando(true)}
                    className="px-3 py-3 font-semibold text-vermelho hover:underline"
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Caixa({
  titulo,
  children,
  className = "",
}: {
  titulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-borda bg-cartao p-3 sm:p-4 ${className}`}>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-600">{titulo}</p>
      {children}
    </div>
  );
}

function Campo({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-vermelho">{titulo}</p>
      <p className="text-lg font-bold">{valor}</p>
    </div>
  );
}