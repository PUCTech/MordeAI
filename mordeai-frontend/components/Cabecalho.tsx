import Image from "next/image";
import Link from "next/link";

type Props = {
  modo: "visitante" | "usuario";
  ativo?: "perfil" | "chat"; // qual página está aberta
};

// No celular aparece só o ícone; de telas médias para cima, o logo completo
function Logo() {
  return (
    <>
      <Image
        src="/logo-icone.png"
        alt="MordeAI"
        width={48}
        height={48}
        className="h-11 w-auto sm:hidden"
      />
      <Image
        src="/logo.png"
        alt="MordeAI"
        width={188}
        height={55}
        className="hidden h-12 w-auto sm:block"
      />
    </>
  );
}

export default function Cabecalho({ modo, ativo }: Props) {
  const logado = modo === "usuario";

  return (
    <header className={logado ? "border-b border-borda" : ""}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-6 sm:py-6">
        {/* Esquerda: logo */}
        <Link
          href={logado ? "/restaurantes" : "/"}
          aria-label="MordeAI, página inicial"
          className="justify-self-start"
        >
          <Logo />
        </Link>

        {logado ? (
          <>
            {/* Centro: Perfil + IA */}
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/restaurantes"
                aria-current={ativo === "perfil" ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 text-sm font-bold sm:px-5 sm:py-3 sm:text-base ${
                  ativo === "perfil" ? "bg-tinta text-white" : "hover:text-vermelho"
                }`}
              >
                <span className="sm:hidden">Perfil</span>
                <span className="hidden sm:inline">Meu perfil</span>
              </Link>
              <Link
                href="/chat"
                aria-current={ativo === "chat" ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 text-sm font-bold text-white sm:px-5 sm:py-3 sm:text-base ${
                  ativo === "chat" ? "bg-tinta" : "bg-vermelho"
                }`}
              >
                <span className="sm:hidden">✦ IA</span>
                <span className="hidden sm:inline">✦ Falar com a IA</span>
              </Link>
            </nav>

            {/* Direita: Sair (por enquanto só volta para a landing; com login, encerra a sessão) */}
            <Link
              href="/"
              className="text-sm font-semibold hover:text-vermelho sm:justify-self-end sm:text-base"
            >
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
              className="rounded-full bg-tinta px-5 py-2.5 text-sm font-bold text-white sm:justify-self-end sm:px-6 sm:py-3 sm:text-base"
            >
              Entrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}