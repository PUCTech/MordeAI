"use client";

export default function Erro({ reset }: { reset: () => void }) {
  return (
    <main className="p-8 text-center">
      <h1 className="mb-2 text-2xl font-bold">Ops, algo deu errado</h1>
      <p className="mb-6 text-gray-500">
        Não conseguimos carregar os restaurantes agora. Tente de novo em instantes.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-orange-500 px-6 py-2 text-white"
      >
        Tentar de novo
      </button>
    </main>
  );
}