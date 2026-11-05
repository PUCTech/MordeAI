//camada que entrega os dados 
import { Restaurante } from "@/types/restaurante";
import { restaurantesMock } from "@/mock/restaurantes";

export async function listarRestaurantes(): Promise<Restaurante[]> {
  return restaurantesMock;
}

//Mock é um dado de mentira que você cria só para testar. Ele tem o mesmo formato do dado real.