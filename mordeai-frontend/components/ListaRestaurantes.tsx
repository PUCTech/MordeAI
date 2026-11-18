"use client";

import { useEffect, useState } from "react";
import { Restaurante } from "@/types/restaurante";
import RestauranteCard from "@/components/RestauranteCard";
import RestauranteModal from "@/components/RestauranteModal";
import {formatarMoeda} from "@/utils/formatar"

// tira acentos e maiúsculas: "Pão" vira "pao"
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ListaRestaurantes({
  restaurantes,
}: {
  restaurantes: Restaurante[];
}) {
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState(""); // NOVO
  const [soFavoritos, setSoFavoritos] = useState(false); // NOVO
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [selecionado, setSelecionado] = useState<Restaurante | null>(null);

  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem("favoritos");
    if (salvo) {
      setFavoritos(JSON.parse(salvo));
    }
    setCarregou(true);
  }, []);

  useEffect(() => {
    if (carregou) {
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
  }, [favoritos, carregou]);

  function alternarFavorito(id: number) {
    setFavoritos((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  const tags = ["Todas", ...new Set(restaurantes.flatMap((r) => r.tags))];

  // os três filtros juntos
  const termo = normalizar(busca);

  const visiveis = restaurantes.filter((r) => {
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
  const comNota = restaurantes.filter((r) => r.nota !== undefined);
  const notaMedia =
    comNota.length > 0
      ? comNota.reduce((soma, r) => soma + (r.nota ?? 0), 0) / comNota.length
      : undefined;
  const investimento = restaurantes.reduce((soma, r) => soma + (r.preco ?? 0), 0);
  const qtdFavoritos = restaurantes.filter((r) => favoritos.includes(r.id)).length;

  return (
    <>
      {/* Cards de resumo */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Resumo
          titulo="Experiências"
          valor={String(restaurantes.length)}
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
        />
      </div>

      {/*barra de filtros */}
      <div className="mb-6 flex flex-col gap-3 border-b border-[#B5BC8A] pb-6 sm:flex-row">
        {/* Busca */}
        <div className="relative flex-1">
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
            className="w-full rounded-full border border-[#B5BC8A] bg-[#EEE2C8] py-3 pl-11 pr-4 text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-[#B80C09]"
          />
        </div>

        {/* Culinária */}
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="rounded-full border border-[#B5BC8A] bg-[#EEE2C8] px-4 py-3 font-semibold text-neutral-900 outline-none focus:border-[#B80C09]"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t === "Todas" ? "Todas as culinárias" : t}
            </option>
          ))}
        </select>

        {/* Só favoritos */}
        <button
          onClick={() => setSoFavoritos(!soFavoritos)}
          aria-pressed={soFavoritos}
          className={`rounded-full border px-5 py-3 font-semibold ${
            soFavoritos
              ? "border-[#B80C09] bg-[#B80C09] text-white"
              : "border-[#B5BC8A] bg-[#EEE2C8] text-neutral-900"
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
        <div className="grid gap-4 md:grid-cols-2">
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

      {selecionado && (
        <RestauranteModal
          restaurante={selecionado}
          favorito={favoritos.includes(selecionado.id)}
          onFechar={() => setSelecionado(null)}
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
}: {
  titulo: string;
  valor: string;
  legenda: string;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${
        destaque
          ? "border-marrom bg-marrom text-cartao"
          : "border-borda bg-cartao text-tinta"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{titulo}</p>
      <p className="mt-6 text-4xl font-extrabold">{valor}</p>
      <p className="mt-1 text-sm opacity-70">{legenda}</p>
    </div>
  );
}