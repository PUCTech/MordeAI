// Camada que conversa com a IA (mesmo esquema do services/restaurantes.ts)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USAR_MOCK = process.env.NEXT_PUBLIC_USAR_MOCK === "true";

export async function enviarMensagem(mensagem: string): Promise<string> {
  if (USAR_MOCK) {
    // resposta de mentira, só para testar o visual
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "Ainda estou em construção, mas em breve vou sugerir restaurantes com base no seu histórico.";
  }

  const resposta = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensagem }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível falar com a IA");
  }

  const dados = await resposta.json();
  return dados.resposta;
}