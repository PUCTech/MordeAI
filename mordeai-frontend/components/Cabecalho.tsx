import Image from "next/image";
import Link from "next/link";

type Props = {
  modo: "visitante" | "usuario";
  ativo?: "perfil" | "chat"; // qual página está aberta
};

export default function Cabecalho({ modo, ativo }: Props) {
  const logado = modo === "usuario";

  return (
    <header className={logado ? "border-b border-borda" : ""}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-6 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        {/* Esquerda: logo */}
        <Link
          href={logado ? "/restaurantes" : "/"}
          aria-label="MordeAI, página inicial"
          className="justify-self-start"
        >
          <Image
            src="/logo.png"
            alt="MordeAI"
            width={188}
            height={55}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {logado ? (
          <>
            {/* Centro: Meu perfil + Falar com a IA */}
            <nav className="flex items-center gap-3">
              <Link
                href="/restaurantes"
                aria-current={ativo === "perfil" ? "page" : undefined}
                className={`hidden rounded-full px-5 py-3 font-bold sm:block ${
                  ativo === "perfil" ? "bg-tinta text-white" : "hover:text-vermelho"
                }`}
              >
                Meu perfil
              </Link>
              <Link
                href="/chat"
                aria-current={ativo === "chat" ? "page" : undefined}
                className={`rounded-full px-5 py-3 font-bold text-white ${
                    ativo === "chat" ? "bg-tinta" : "bg-vermelho"
                }`}
            >
                ✦ Falar com a IA
            </Link>
            
            </nav>

            {/* Direita: Sair (por enquanto só volta para a landing; com login, encerra a sessão) */}
            <Link href="/" className="font-semibold hover:text-vermelho sm:justify-self-end">
              Sair
            </Link>
          </>
        ) : (
          <>
            <nav className="hidden sm:block">
              <a href="#como-funciona" className="font-semibold hover:text-vermelho">
                Como funciona
              </a>
            </nav>
            <Link
              href="/entrar"
              className="rounded-full bg-tinta px-6 py-3 font-bold text-white sm:justify-self-end"
            >
              Entrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}