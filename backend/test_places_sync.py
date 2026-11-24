import asyncio
import sys
from app.core.config import settings
from app.services.google_places import search_places, import_places_to_supabase
from app.services.supabase_client import get_supabase

async def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "restaurantes italianos em Pinheiros Sao Paulo"
    
    print("=" * 60)
    print("MordeAI - Teste de Sincronizacao Google Places -> Supabase")
    print("=" * 60)
    print(f"Termo de busca: '{query}'")
    
    # 1. Validacao de chaves
    if not settings.GOOGLE_MAPS_API_KEY:
        print("\n[ERRO] 'GOOGLE_MAPS_API_KEY' nao esta definida no arquivo .env!")
        return
        
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        print("\n[ERRO] 'SUPABASE_URL' ou 'SUPABASE_KEY' nao estao definidas no arquivo .env!")
        return

    # 2. Teste de conexao com o Supabase
    print("\n[1/3] Conectando ao Supabase...")
    try:
        supabase = get_supabase()
        supabase.table("Restaurante").select("RestauranteID").limit(1).execute()
        print("  [OK] Conexao com Supabase bem sucedida!")
    except Exception as e:
        print(f"  [ERRO] Falha na conexao com Supabase: {e}")
        return

    # 3. Busca no Google Places
    print("\n[2/3] Consultando a Google Places API...")
    try:
        places = await search_places(query=query, max_results=3)
        print(f"  [OK] {len(places)} restaurantes encontrados no Google Places.")
        for i, p in enumerate(places, 1):
            name = p.get("displayName", {}).get("text", "Sem nome")
            addr = p.get("formattedAddress", "Sem endereco")
            print(f"    {i}. {name} ({addr})")
    except Exception as e:
        print(f"  [ERRO] Falha ao buscar no Google Places: {e}")
        return

    # 4. Sincronizacao no Banco
    print("\n[3/3] Sincronizando com as tabelas (Restaurante, Tags, Horario De Funcionamento)...")
    try:
        saved = await import_places_to_supabase(places)
        print(f"  [OK] {len(saved)} restaurantes sincronizados/atualizados com sucesso no Supabase!")
    except Exception as e:
        print(f"  [ERRO] Falha ao salvar no Supabase: {e}")
        return

    print("\n[SUCESSO] Teste concluido com sucesso!")

if __name__ == "__main__":
    asyncio.run(main())
