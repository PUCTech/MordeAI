//nao vai mais ter depois da API 
import { Restaurante } from "@/types/restaurante";

export const restaurantesMock: Restaurante[] = [
  { id: 1, nome: "Cantina da Nonna", tags: ["Italiana", "Massas"], nota: 4.5, endereco: "Rua Augusta, 100" },
  { id: 2, nome: "Sushi Haru", tags: ["Japonesa", "Sushi"], nota: 4.8, endereco: "Rua da Liberdade, 250" },
  { id: 3, nome: "Boteco do Zé", tags: ["Brasileira", "Bar"], nota: 4.0, endereco: "Rua Aspicuelta, 45" },
  { id: 4, nome: "Taco Loco", tags: ["Mexicana"], nota: 3.8, endereco: "Av. Paulista, 900" },
  { id: 5, nome: "Burger Lab", tags: ["Hambúrguer", "Bar"], nota: 4.2, endereco: "Rua Oscar Freire, 320" },
  { id: 6, nome: "Verde Vivo", tags: ["Vegetariana", "Saudável"], nota: 4.6, endereco: "Rua Harmonia, 77" },
];
