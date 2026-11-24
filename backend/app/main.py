from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import places

app = FastAPI(
    title="MordeAI API",
    description="Backend inteligente para diário gastronômico com Google Places e IA",
    version="1.0.0",
)

# Configuração de CORS para permitir requisições do front-end Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(places.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": "MordeAI Backend",
        "version": "1.0.0"
    }
