"use client";

import { useEffect, useRef, useState } from "react";
import { enviarMensagem } from "@/services/chat";

type Mensagem = { id: number; autor: "usuario" | "ia"; texto: string };

const sugestoes = [
  "Onde comer hoje?",
  "Me sugira um lugar parecido com meus favoritos",
  "Quero experimentar uma culinária nova",
];

const boasVindas: Mensagem = {
  id: 0,
  autor: "ia",
  texto:
    "Oi! Eu sou o MordeAI. Me conte o que você está com vontade de comer e eu sugiro a próxima mesa com base no seu histórico.",
};

export default function Chat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([boasVindas]);
  const [entrada, setEntrada] = useState("");
  const [pensando, setPensando] = useState(false);
  const proximoId = useRef(1);
  const fim = useRef<HTMLDivElement>(null);

  // rola até a última mensagem sempre que algo novo aparece
  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, pensando]);

  async function enviar(texto: string) {
    const limpo = texto.trim();
    if (limpo === "" || pensando) return;

    const minha: Mensagem = { id: proximoId.current++, autor: "usuario", texto: limpo };
    setMensagens((atual) => [...atual, minha]);
    setEntrada("");
    setPensando(true);

    let resposta: string;
    try {
      resposta = await enviarMensagem(limpo);
    } catch {
      resposta = "Não consegui responder agora. Tente de novo em instantes.";
    }

    const daIA: Mensagem = { id: proximoId.current++, autor: "ia", texto: resposta };
    setMensagens((atual) => [...atual, daIA]);
    setPensando(false);
  }

  const soBoasVindas = mensagens.length === 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Área das mensagens (rola) */}
      <div role="log" aria-live="polite" className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
              Seu concierge gastronômico
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Para onde vamos hoje?
            </h1>
            <p className="mt-2 text-lg text-neutral-700">
              Pergunte e receba ideias baseadas no seu histórico.
            </p>
          </div>

          {mensagens.map((m) => (
            <Balao key={m.id} mensagem={m} />
          ))}

          {soBoasVindas && (
            <div className="flex flex-wrap gap-2 pl-12">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => enviar(s)}
                  className="rounded-full border border-borda bg-cartao px-4 py-2 text-sm font-semibold hover:border-vermelho"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {pensando && (
            <div className="flex items-end gap-3">
              <Avatar />
              <p className="animate-pulse rounded-3xl rounded-bl-md border border-borda bg-cartao px-5 py-3 text-neutral-600">
                Pensando…
              </p>
            </div>
          )}

          <div ref={fim} />
        </div>
      </div>

      {/* Campo de mensagem (fixo embaixo) */}
      <div className="border-t border-borda bg-fundo">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(entrada);
          }}
          className="mx-auto flex max-w-3xl gap-3 px-6 pt-4"
        >
          <input
            type="text"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Escreva sua mensagem..."
            aria-label="Mensagem para o MordeAI"
            className="flex-1 rounded-full border border-borda bg-cartao px-5 py-3 text-tinta outline-none placeholder:text-neutral-500 focus:border-vermelho"
          />
          <button
            type="submit"
            disabled={pensando || entrada.trim() === ""}
            className="rounded-full bg-vermelho px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            Enviar →
          </button>
        </form>
        <p className="mx-auto max-w-3xl px-6 pb-4 pt-2 text-center text-xs text-neutral-600">
          O MordeAI pode errar. Confira as informações importantes.
        </p>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vermelho text-white"
    >
      ✦
    </div>
  );
}

function Balao({ mensagem }: { mensagem: Mensagem }) {
  const meu = mensagem.autor === "usuario";

  return (
    <div className={`flex items-end gap-3 ${meu ? "justify-end" : ""}`}>
      {!meu && <Avatar />}
      <p
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-3xl px-5 py-3 ${
          meu
            ? "rounded-br-md bg-vermelho text-white"
            : "rounded-bl-md border border-borda bg-cartao"
        }`}
      >
        {mensagem.texto}
      </p>
    </div>
  );
}