from pydantic import BaseModel, Field

class PlacesSearchRequest(BaseModel):
    query: str = Field(..., description="Termo de busca, ex: 'restaurante italiano em Pinheiros'")
    max_results: int = Field(default=10, ge=1, le=20, description="Quantidade máxima de restaurantes")

class RestaurantResponse(BaseModel):
    RestauranteID: int | None = None
    Nome: str
    Endereço: str | None = None
    Telefone: str | None = None
    GooglePlaceID: str | None = None
    Latitude: float | None = None
    Longitude: float | None = None
    NotaGoogle: float | None = None

    class Config:
        extra = "allow"
