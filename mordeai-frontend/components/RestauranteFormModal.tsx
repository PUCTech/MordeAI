"use client";

import { useEffect, useState } from "react";
import { Restaurante } from "@/types/restaurante";

type NovoRestaurante = Omit<Restaurante, "id">;

type Props = {
  culinarias: string[]; // sugestões para o campo de culinária
  inicial?: Restaurante; // se vier, o formulário está EDITANDO esse restaurante
  onSalvar: (dados: NovoRestaurante) => void;
  onFechar: () => void;
};

const campo =
  "w-full rounded-2xl border border-borda bg-cartao px-4 py-3 text-tinta outline-none placeholder:text-neutral-500 focus:border-vermelho";

// Data de hoje no formato "2026-11-19" (o que o campo de data entende)
function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export default function RestauranteFormModal({
  culinarias,
  inicial,
  onSalvar,
  onFechar,
}: Props) {
  const editando = inicial !== undefined;

  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [culinaria, setCulinaria] = useState(inicial?.tags[0] ?? "");
  const [endereco, setEndereco] = useState(inicial?.endereco ?? "");
  const [nota, setNota] = useState<number | undefined>(inicial?.nota);
  const [data, setData] = useState(editando ? (inicial.data ?? "") : hoje());
  const [preco, setPreco] = useState(
    inicial?.preco !== undefined ? String(inicial.preco) : ""
  );
  const [comentario, setComentario] = useState(inicial?.comentario ?? "");
  const [erro, setErro] = useState("");

  // fecha com Esc e trava o scroll do fundo
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

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (nome.trim() === "") {
      setErro("Informe o nome do restaurante.");
      return;
    }
    if (culinaria.trim() === "") {
      setErro("Informe a culinária.");
      return;
    }
    if (endereco.trim() === "") {
      setErro("Informe o endereço.");
      return;
    }

    const valor = preco === "" ? undefined : Number(preco);
    if (valor !== undefined && (Number.isNaN(valor) || valor < 0)) {
      setErro("O valor gasto precisa ser um número positivo.");
      return;
    }

    onSalvar({
      nome: nome.trim(),
      tags: [culinaria.trim()],
      endereco: endereco.trim(),
      nota,
      data: data || undefined,
      preco: valor,
      comentario: comentario.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editando ? "Editar restaurante" : "Adicionar restaurante"}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-fundo text-neutral-900"
      >
        {/* Cabeçalho */}
        <div className="relative bg-marrom p-5 pr-16 sm:p-8 sm:pr-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E6D5BE]">
            {editando ? "Editar experiência" : "Nova experiência"}
          </p>
          <h2 className="text-2xl font-bold text-cartao sm:text-3xl">
            {editando ? "Editar restaurante" : "Adicionar restaurante"}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white sm:right-6 sm:top-6"
          >
            ✕
          </button>
        </div>

        <form onSubmit={enviar} noValidate className="space-y-5 p-5 sm:p-8">
          <Bloco titulo="Nome do restaurante" htmlFor="nome">
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Nonna Rosa"
              className={campo}
              autoFocus
            />
          </Bloco>

          <div className="grid gap-5 sm:grid-cols-2">
            <Bloco titulo="Culinária" htmlFor="culinaria">
              <input
                id="culinaria"
                type="text"
                list="lista-culinarias"
                value={culinaria}
                onChange={(e) => setCulinaria(e.target.value)}
                placeholder="Ex.: Italiana"
                className={campo}
              />
              <datalist id="lista-culinarias">
                {culinarias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Bloco>

            <Bloco titulo="Data da visita" htmlFor="data">
              <input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={campo}
              />
            </Bloco>
          </div>

          <Bloco titulo="Endereço" htmlFor="endereco">
            <input
              id="endereco"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número e bairro"
              className={campo}
            />
          </Bloco>

          <div className="grid gap-5 sm:grid-cols-2">
            <Bloco titulo="Sua nota">
              <div role="group" aria-label="Nota de 1 a 5" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => {
                  const cheia = nota !== undefined && n <= nota;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNota(nota === n ? undefined : n)}
                      aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
                      aria-pressed={cheia}
                      className="text-4xl leading-none text-vermelho"
                    >
                      {cheia ? "★" : "☆"}
                    </button>
                  );
                })}
              </div>
            </Bloco>

            <Bloco titulo="Valor gasto (R$)" htmlFor="preco">
              <input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0,00"
                className={campo}
              />
            </Bloco>
          </div>

          <Bloco titulo="Comentário da experiência" htmlFor="comentario">
            <textarea
              id="comentario"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Como foi? O que você pediu?"
              className={campo}
            />
          </Bloco>

          {erro && (
            <p role="alert" className="text-sm font-semibold text-vermelho">
              {erro}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-vermelho px-6 py-3 font-bold text-white"
            >
              {editando ? "Salvar alterações" : "Salvar restaurante"}
            </button>
            <button
              type="button"
              onClick={onFechar}
              className="rounded-full border border-borda bg-cartao px-6 py-3 font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Bloco({
  titulo,
  htmlFor,
  children,
}: {
  titulo: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const classe = "mb-2 block text-sm font-bold";
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={classe}>
          {titulo}
        </label>
      ) : (
        <p className={classe}>{titulo}</p>
      )}
      {children}
    </div>
  );
}