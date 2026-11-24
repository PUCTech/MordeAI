import logging
from typing import Any
import httpx
from app.core.config import settings
from app.services.supabase_client import get_supabase

logger = logging.getLogger(__name__)

GOOGLE_PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

FIELD_MASK = (
    "places.id,"
    "places.displayName,"
    "places.formattedAddress,"
    "places.nationalPhoneNumber,"
    "places.location,"
    "places.rating,"
    "places.primaryTypeDisplayName,"
    "places.types,"
    "places.regularOpeningHours"
)

# Tipos genéricos do Google que não agregam valor como tags culinárias
IGNORED_TYPES = {
    "point_of_interest",
    "establishment",
    "food",
    "restaurant",
    "store",
}


async def search_places(query: str, max_results: int = 10) -> list[dict[str, Any]]:
    """Busca restaurantes na Google Places API (New) via Text Search."""
    if not settings.GOOGLE_MAPS_API_KEY:
        raise ValueError("GOOGLE_MAPS_API_KEY não está configurada no .env")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    payload = {
        "textQuery": query,
        "languageCode": "pt-BR",
        "maxResultCount": max_results,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            GOOGLE_PLACES_TEXT_SEARCH_URL,
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("places", [])


def _format_time(hour: int | None, minute: int | None) -> str | None:
    if hour is None:
        return None
    minute_val = minute or 0
    return f"{hour:02d}:{minute_val:02d}:00"


async def import_places_to_supabase(places: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Formata e insere/atualiza os restaurantes no Supabase:
    1. Tabela 'Restaurante'
    2. Tabela 'Tags'
    3. Tabela 'Horario De Funcionamento'
    """
    supabase = get_supabase()
    imported_restaurants = []

    for place in places:
        google_id = place.get("id")
        if not google_id:
            continue

        display_name = place.get("displayName", {}).get("text", "")
        address = place.get("formattedAddress", "")
        phone = place.get("nationalPhoneNumber", "")
        location = place.get("location", {})
        latitude = location.get("latitude")
        longitude = location.get("longitude")
        rating = place.get("rating")

        # 1. Upsert na tabela 'Restaurante' baseado no GooglePlaceID
        restaurante_payload = {
            "GooglePlaceID": google_id,
            "Nome": display_name,
            "Endereço": address,
            "Telefone": phone,
            "Latitude": latitude,
            "Longitude": longitude,
            "NotaGoogle": rating,
        }

        # Realiza upsert
        res = (
            supabase.table("Restaurante")
            .upsert(restaurante_payload, on_conflict="GooglePlaceID")
            .execute()
        )

        if not res.data:
            logger.warning(f"Não foi possível salvar o restaurante: {display_name}")
            continue

        restaurante_salvo = res.data[0]
        # Recupera o identificador gerado no banco (RestauranteID)
        restaurante_id = (
            restaurante_salvo.get("RestauranteID")
            or restaurante_salvo.get("restauranteid")
            or restaurante_salvo.get("id")
        )

        if not restaurante_id:
            continue

        imported_restaurants.append(restaurante_salvo)

        # 2. Inserir Tags
        tags_set = set()
        primary_type_obj = place.get("primaryTypeDisplayName")
        if primary_type_obj and primary_type_obj.get("text"):
            tags_set.add(primary_type_obj["text"].title())

        # Adiciona tipos relevantes
        for t in place.get("types", []):
            if t not in IGNORED_TYPES:
                readable_tag = t.replace("_", " ").title()
                tags_set.add(readable_tag)

        # Busca tags já existentes para este restaurante para não duplicar
        existing_tags_res = (
            supabase.table("Tags")
            .select("NomeTag")
            .eq("RestauranteID", restaurante_id)
            .execute()
        )
        existing_tags = {
            row["NomeTag"].lower() for row in existing_tags_res.data if row.get("NomeTag")
        }

        new_tags_payload = [
            {"RestauranteID": restaurante_id, "NomeTag": tag}
            for tag in tags_set
            if tag.lower() not in existing_tags
        ]

        if new_tags_payload:
            supabase.table("Tags").insert(new_tags_payload).execute()

        # 3. Inserir Horários de Funcionamento
        opening_hours = place.get("regularOpeningHours", {})
        periods = opening_hours.get("periods", [])

        if periods:
            # Remove horários antigos para atualizar com os novos
            supabase.table("Horario De Funcionamento").delete().eq(
                "RestauranteID", restaurante_id
            ).execute()

            horarios_payload = []
            for period in periods:
                open_info = period.get("open", {})
                close_info = period.get("close", {})

                dia_semana = open_info.get("day")  # 0 a 6
                hora_abertura = _format_time(open_info.get("hour"), open_info.get("minute"))
                hora_fechamento = _format_time(close_info.get("hour"), close_info.get("minute"))

                if dia_semana is not None:
                    horarios_payload.append({
                        "RestauranteID": restaurante_id,
                        "DiaDaSemana": dia_semana,
                        "HorarioDeAbertura": hora_abertura,
                        "HorarioDeFechamento": hora_fechamento,
                    })

            if horarios_payload:
                supabase.table("Horario De Funcionamento").insert(horarios_payload).execute()

    return imported_restaurants
