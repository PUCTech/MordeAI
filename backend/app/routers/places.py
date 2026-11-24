from fastapi import APIRouter, HTTPException, Query
from app.schemas.places import PlacesSearchRequest
from app.services.google_places import search_places, import_places_to_supabase
from app.services.supabase_client import get_supabase

router = APIRouter(prefix="/places", tags=["Google Places & Restaurantes"])

@router.post("/search-and-sync")
async def search_and_sync_places(request: PlacesSearchRequest):
    """
    Busca restaurantes no Google Places e salva/atualiza automaticamente
    nas tabelas 'Restaurante', 'Tags' e 'Horario De Funcionamento' no Supabase.
    """
    try:
        raw_places = await search_places(query=request.query, max_results=request.max_results)
        if not raw_places:
            return {"message": "Nenhum restaurante encontrado para a busca.", "imported_count": 0, "restaurants": []}

        saved_restaurants = await import_places_to_supabase(raw_places)
        return {
            "message": f"{len(saved_restaurants)} restaurante(s) sincronizado(s) com sucesso!",
            "imported_count": len(saved_restaurants),
            "restaurants": saved_restaurants,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/restaurants")
async def list_restaurants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    cuisine: str | None = None
):
    """Lista os restaurantes cadastrados no banco de dados do MordeAI."""
    try:
        supabase = get_supabase()
        query = supabase.table("Restaurante").select("*, Tags(NomeTag), Horario De Funcionamento(*)")
        
        query = query.range(offset, offset + limit - 1)
        res = query.execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
