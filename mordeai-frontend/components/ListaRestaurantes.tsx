"use client";

import { useEffect, useState } from "react";
import { Restaurante } from "@/types/restaurante";
import RestauranteCard from "@/components/RestauranteCard";
import RestauranteModal from "@/components/RestauranteModal";
import RestauranteFormModal from "@/components/RestauranteFormModal";
import { formatarMoeda } from "@/utils/formatar";

// tira acentos e maiúsculas: "Pão" vira "pao"
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// lê uma lista salva no navegador (volta lista vazia se não houver ou se der erro)
function lerLista<T>(chave: string): T[] {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? (JSON.parse(salvo) as T[]) : [];
  } catch {
    return [];
  }
}

export default function ListaRestaurantes({
  restaurantes,
}: {
  restaurantes: Restaurante[];
}) {
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [meus, setMeus] = useState<Restaurante[]>([]); // cadastrados pela pessoa
  const [selecionado, setSelecionado] = useState<Restaurante | null>(null);
  const [cadastrando, setCadastrando] = useState(false);
  const [editando, setEditando] = useState<Restaurante | null>(null);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    setFavoritos(lerLista<number>("favoritos"));
    setMeus(lerLista<Restaurante>("meusRestaurantes"));
    setCarregou(true);
  }, []);

  useEffect(() => {
    if (carregou) {
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
  }, [favoritos, carregou]);

  useEffect(() => {
    if (carregou) {
      localStorage.setItem("meusRestaurantes", JSON.stringify(meus));
    }
  }, [meus, carregou]);

  function alternarFavorito(id: number) {
    setFavoritos((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  // TODO: quando o backend existir, trocar por um POST na API
  function adicionar(dados: Omit<Restaurante, "id">) {
    setMeus((atual) => [{ ...dados, id: Date.now() }, ...atual]);
    setCadastrando(false);
  }

  // TODO: quando o backend existir, trocar por um PUT na API
  function editar(dados: Omit<Restaurante, "id">) {
    if (!editando) return;
    const atualizado: Restaurante = { ...dados, id: editando.id };
    setMeus((atual) => atual.map((r) => (r.id === atualizado.id ? atualizado : r)));
    setEditando(null);
    setSelecionado(atualizado); // volta para os detalhes, já atualizados
  }

  // TODO: quando o backend existir, trocar por um DELETE na API
  function excluir(id: number) {
    setMeus((atual) => atual.filter((r) => r.id !== id));
    setFavoritos((atual) => atual.filter((x) => x !== id));
    setSelecionado(null);
  }

  // os cadastrados ficam primeiro, depois os que vieram da API/mock
  const todos = [...meus, ...restaurantes];

  const tags = ["Todas", ...new Set(todos.flatMap((r) => r.tags))];

  const termo = normalizar(busca);

  const visiveis = todos.filter((r) => {
    const passaCulinaria = filtro === "Todas" || r.tags.includes(filtro);
    const passaFavorito = !soFavoritos || favoritos.includes(r.id);
    const passaBusca =
      termo === "" ||
      normalizar(r.nome).includes(termo) ||
      normalizar(r.endereco).includes(termo) ||
      r.tags.some((t) => normalizar(t).includes(termo));

    return passaCulinaria && passaFavorito && passaBusca;
  });

  // Números dos cards de resumo
  const comNota = todos.filter((r) => r.nota !== undefined);
  const notaMedia =
    comNota.length > 0
      ? comNota.reduce((soma, r) => soma + (r.nota ?? 0), 0) / comNota.length
      : undefined;
  const investimento = todos.reduce((soma, r) => soma + (r.preco ?? 0), 0);
  const qtdFavoritos = todos.filter((r) => favoritos.includes(r.id)).length;

  return (
    <>
      {/* Título + botão de adicionar */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
            Seu mapa de sabores
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Meus restaurantes.
          </h1>
          <p className="mt-2 hidden text-lg text-neutral-700 sm:block">
            Cada mesa conta uma história. Guarde a próxima.
          </p>
        </div>

        {/* Celular: botão redondo flutuante com "+". Computador: botão com texto */}
        <button
          onClick={() => setCadastrando(true)}
          aria-label="Adicionar restaurante"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-vermelho text-3xl font-bold leading-none text-white shadow-lg sm:static sm:h-auto sm:w-auto sm:px-6 sm:py-4 sm:text-base sm:shadow-none"
        >
          <span aria-hidden="true">+</span>
          <span className="hidden sm:ml-2 sm:inline">Adicionar restaurante</span>
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
        <Resumo
          titulo="Experiências"
          valor={String(todos.length)}
          legenda="lugares registrados"
        />
        <Resumo
          titulo="Nota média"
          valor={notaMedia !== undefined ? notaMedia.toFixed(1) : "—"}
          legenda="de 5 estrelas"
          destaque
        />
        <Resumo
          titulo="Investimento feliz"
          valor={formatarMoeda(investimento)}
          legenda={`${qtdFavoritos} ${qtdFavoritos === 1 ? "favorito" : "favoritos"}`}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Barra de filtros */}
      <div className="mb-6 flex flex-wrap gap-3 border-b border-borda pb-6 sm:flex-nowrap">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar restaurante ou culinária..."
            className="w-full rounded-full border border-borda bg-cartao py-3 pl-11 pr-4 text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-vermelho"
          />
        </div>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-borda bg-cartao px-4 py-3 font-semibold text-neutral-900 outline-none focus:border-vermelho sm:flex-none"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t === "Todas" ? "Todas as culinárias" : t}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSoFavoritos(!soFavoritos)}
          aria-pressed={soFavoritos}
          className={`flex-1 rounded-full border px-5 py-3 font-semibold sm:flex-none ${
            soFavoritos
              ? "border-vermelho bg-vermelho text-white"
              : "border-borda bg-cartao text-neutral-900"
          }`}
        >
          {soFavoritos ? "♥" : "♡"} Favoritos
        </button>
      </div>

      {/* Lista (ou aviso se não achar nada) */}
      {visiveis.length === 0 ? (
        <p className="py-10 text-center text-neutral-600">
          Nenhum restaurante encontrado.
        </p>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {visiveis.map((r) => (
            <RestauranteCard
              key={r.id}
              restaurante={r}
              favorito={favoritos.includes(r.id)}
              onFavoritar={() => alternarFavorito(r.id)}
              onAbrir={() => setSelecionado(r)}
            />
          ))}
        </div>
      )}

      {/* Detalhes */}
      {selecionado && (
        <RestauranteModal
          restaurante={selecionado}
          favorito={favoritos.includes(selecionado.id)}
          podeEditar={meus.some((r) => r.id === selecionado.id)}
          onEditar={() => {
            setEditando(selecionado);
            setSelecionado(null);
          }}
          onExcluir={() => excluir(selecionado.id)}
          onFechar={() => setSelecionado(null)}
        />
      )}

      {/* Formulário (novo ou edição) */}
      {(cadastrando || editando) && (
        <RestauranteFormModal
          culinarias={tags.filter((t) => t !== "Todas")}
          inicial={editando ?? undefined}
          onSalvar={editando ? editar : adicionar}
          onFechar={() => {
            setCadastrando(false);
            setEditando(null);
          }}
        />
      )}
    </>
  );
}

function Resumo({
  titulo,
  valor,
  legenda,
  destaque = false,
  className = "",
}: {
  titulo: string;
  valor: string;
  legenda: string;
  destaque?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 sm:p-6 ${
        destaque
          ? "border-marrom bg-marrom text-cartao"
          : "border-borda bg-cartao text-tinta"
      } ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{titulo}</p>
      <p className="mt-3 text-3xl font-extrabold sm:mt-6 sm:text-4xl">{valor}</p>
      <p className="mt-1 text-xs opacity-70 sm:text-sm">{legenda}</p>
    </div>
  );
}