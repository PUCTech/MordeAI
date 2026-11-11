//define formato do restaurante - "ficha" das informacoes do resturante
export type Restaurante = {
    id: number;
    nome: string;
    endereco: string;
    tags: string[]; //culinaria
    nota?: number; //pergunta pq na api nao tem isso ainda, deixei como apcional para a tela nao quebrar.
};
