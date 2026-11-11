//camada que entrega os dados 
import { Restaurante } from "@/types/restaurante";
import { restaurantesMock } from "@/mock/restaurantes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USAR_MOCK = process.env.NEXT_PUBLIC_USAR_MOCK === "true";

export async function listarRestaurantes(): Promise<Restaurante[]> {
  if (USAR_MOCK) {
    return restaurantesMock;
  }

  const resposta = await fetch(`${API_URL}/restaurantes`, { cache: "no-store" });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os restaurantes");
  }

  return resposta.json();
}
