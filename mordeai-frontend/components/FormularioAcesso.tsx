"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Aba = "entrar" | "criar";

export default function FormularioAcesso({ abaInicial = "entrar" }: { abaInicial?: Aba }) {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>(abaInicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const criando = aba === "criar";

  function trocarAba(nova: Aba) {
    setAba(nova);
    setErro("");
  }

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // impede a página de recarregar

    if (criando && nome.trim() === "") {
      setErro("Diga como podemos te chamar.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }
    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setErro("");
    // TODO: quando o backend existir, chamar a API de login/cadastro aqui
    router.push("/restaurantes");
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-vermelho">
        {criando ? "Vamos começar" : "Bem-vindo de volta"}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
        {criando ? "Crie sua conta" : "Entre para continuar"}
      </h1>
      <p className="mt-2 text-neutral-700">
        {criando
          ? "É rápido, gratuito e sem complicação."
          : "Suas melhores mesas estão esperando."}
      </p>

      {/* Abas */}
      <div className="mt-8 grid grid-cols-2 rounded-full border border-borda bg-cartao p-1">
        <button
          type="button"
          onClick={() => trocarAba("entrar")}
          aria-pressed={!criando}
          className={`rounded-full py-3 font-bold ${!criando ? "bg-fundo shadow-sm" : ""}`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => trocarAba("criar")}
          aria-pressed={criando}
          className={`rounded-full py-3 font-bold ${criando ? "bg-fundo shadow-sm" : ""}`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={enviar} className="mt-6 space-y-5" noValidate>
        {criando && (
          <Campo
            id="nome"
            rotulo="Seu nome"
            placeholder="Como podemos te chamar?"
            valor={nome}
            aoMudar={setNome}
            autoComplete="name"
          />
        )}
        <Campo
          id="email"
          rotulo="E-mail"
          tipo="email"
          placeholder="voce@email.com"
          valor={email}
          aoMudar={setEmail}
          autoComplete="email"
        />
        <Campo
          id="senha"
          rotulo="Senha"
          tipo="password"
          placeholder="Mínimo de 8 caracteres"
          valor={senha}
          aoMudar={setSenha}
          autoComplete={criando ? "new-password" : "current-password"}
        />

        {erro && (
          <p role="alert" className="text-sm font-semibold text-vermelho">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-vermelho px-6 py-4 font-bold text-white"
        >
          {criando ? "Criar minha conta →" : "Entrar no MordeAI →"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-700">
        Ao continuar, você concorda em cuidar bem das suas memórias gastronômicas.
      </p>
    </div>
  );
}

function Campo({
  id,
  rotulo,
  tipo = "text",
  placeholder,
  valor,
  aoMudar,
  autoComplete,
}: {
  id: string;
  rotulo: string;
  tipo?: string;
  placeholder: string;
  valor: string;
  aoMudar: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-borda bg-cartao px-4 py-4 text-tinta outline-none placeholder:text-neutral-500 focus:border-vermelho"
      />
    </div>
  );
}