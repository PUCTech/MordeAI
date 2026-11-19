import Image from "next/image";
import Link from "next/link";
import FormularioAcesso from "@/components/FormularioAcesso";

export default function TelaAcesso({ abaInicial }: { abaInicial: "entrar" | "criar" }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* LADO ESCURO (só em telas grandes) */}
      <section className="relative hidden overflow-hidden bg-tinta p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full border-[5rem] border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[5rem] border-vermelho/30" />

        <Link
          href="/"
          aria-label="MordeAI, página inicial"
          className="relative w-fit rounded-2xl bg-fundo px-6 py-4"
        >
          <Image
            src="/logo.png"
            alt="MordeAI"
            width={188}
            height={55}
            className="h-12 w-auto"
          />
        </Link>

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            Seu diário gastronômico
          </p>
          <h2 className="mt-4 max-w-md text-6xl font-extrabold leading-[0.95] tracking-tight">
            Boas histórias começam à mesa.
          </h2>
          <p className="mt-6 max-w-sm text-lg opacity-80">
            Guarde cada descoberta, encontre seus favoritos e receba sugestões
            que combinam com você.
          </p>
        </div>

        <p className="relative text-sm opacity-70">
          Feito para quem sempre pergunta: “onde vamos comer?”
        </p>
      </section>

      {/* LADO DO FORMULÁRIO */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo só no celular (o lado escuro some) */}
          <Link
            href="/"
            aria-label="MordeAI, página inicial"
            className="mb-10 block w-fit lg:hidden"
          >
            <Image
              src="/logo.png"
              alt="MordeAI"
              width={188}
              height={55}
              className="h-12 w-auto"
            />
          </Link>

          <FormularioAcesso abaInicial={abaInicial} />
        </div>
      </section>
    </main>
  );
}