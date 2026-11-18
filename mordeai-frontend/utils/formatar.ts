export function formatarDataCurta(data?: string): string {
  if (!data) return "—";
  return new Date(data + "T00:00:00"). toLocaleDateString("pt-BR",
    {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatarMoeda(valor?: number): string {
    if (valor === undefined) return "—";
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL"});  
}