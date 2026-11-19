import Link from "next/link";
import Cabecalho from "@/components/Cabecalho";

// Exemplos fixos só para ilustrar o celular do topo (não vêm da API)
const exemplos = [
  { inicial: "T", nome: "Tuju", prato: "Cordeiro", nota: "4.9" },
  { inicial: "M", nome: "Marius Degustare", prato: "Salmão Defumado", nota: "4.7" },
  { inicial: "M", nome: "Mocotó", prato: "Baião-de-dois", nota: "4.8" },
];

const passos = [
  {
    numero: "01",
    titulo: "Registre",
    texto: "Anote o restaurante, o prato, o valor e sua nota em poucos segundos.",
  },
  {
    numero: "02",
    titulo: "Organize",
    texto: "Filtre por culinária, encontre favoritos e acompanhe seus hábitos.",
  },
  {
    numero: "03",
    titulo: "Descubra",
    texto: "Converse com a IA e receba ideias baseadas no seu próprio histórico.",
  },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-clip">
      {/* BARRA DE CIMA */}
      <Cabecalho modo="visitante" />

      {/* TOPO (HERO) */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
            Sua vida gastronômica, organizada
          </p>
          <h1 className="mt-4 text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Mordeu.
            <br />
            <span className="text-vermelho">Amou.</span>
            <br />
            Guardou.
          </h1>
          <p className="mt-6 max-w-md text-lg text-neutral-700">
            Seu diário para lembrar onde comeu, quanto gastou e descobrir qual
            será a próxima mesa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cadastro"
              className="rounded-full bg-vermelho px-7 py-4 font-bold text-white"
            >
              Começar meu mapa →
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border border-vermelho bg-cartao px-7 py-4 font-bold text-vermelho"
            >
              Ver como funciona
            </a>
          </div>
        </div>

        {/* "Celular" de exemplo */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full bg-marrom" />
          <div className="relative rotate-3 rounded-[2.5rem] border border-borda bg-cartao p-5 shadow-2xl">
            <div className="rounded-3xl bg-tinta p-6 text-white">
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                  Sua semana
                </p>
                <div className="h-8 w-8 rounded-full bg-vermelho" />
              </div>
              <p className="mt-8 text-5xl font-extrabold">3</p>
              <p className="opacity-80">novos sabores descobertos</p>
            </div>

            <ul className="mt-4 space-y-3">
              {exemplos.map((e) => (
                <li
                  key={e.nome}
                  className="flex items-center gap-3 rounded-2xl border border-borda p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vermelho font-bold text-white">
                    {e.inicial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{e.nome}</p>
                    <p className="truncate text-sm text-neutral-700">{e.prato}</p>
                  </div>
                  <p className="font-bold">
                    <span className="text-vermelho">★</span> {e.nota}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-areia">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-end gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
                Simples como pedir a sobremesa
              </p>
              <h2 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight">
                Seu paladar vira uma bússola.
              </h2>
            </div>
            <p className="max-w-sm text-neutral-700 md:justify-self-end">
              Quanto mais você registra, melhores ficam as sugestões do MordeAI.
            </p>
          </div>

          <div className="mt-12 grid divide-y divide-tinta/15 border-y border-tinta/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {passos.map((p) => (
              <div key={p.numero} className="p-8">
                <p className="text-5xl font-extrabold text-vermelho">{p.numero}</p>
                <h3 className="mt-8 text-2xl font-bold">{p.titulo}</h3>
                <p className="mt-2 text-neutral-700">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2.5rem] bg-vermelho px-6 py-16 text-center text-white">
          <p className="text-3xl">✦</p>
          <h2 className="mx-auto mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Sua próxima descoberta está a uma mordida.
          </h2>
          <p className="mx-auto mt-4 max-w-md opacity-90">
            Crie seu perfil e transforme cada refeição em uma memória que ajuda a
            escolher a próxima.
          </p>
          <Link
            href="/cadastro"
            className="mt-8 inline-block rounded-full bg-cartao px-7 py-4 font-bold text-tinta"
          >
            Criar meu perfil →
          </Link>
        </div>
      </section>
    </main>
  );
}