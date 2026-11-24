# MordeAI - Diario Gastronomico Inteligente

O **MordeAI** e uma plataforma web criada para amantes da gastronomia organizarem suas experiencias em restaurantes e descobrirem novos lugares atraves de recomendacoes personalizadas impulsionadas por Inteligencia Artificial.

---

## O Problema

Quando surge a vontade de comer algo diferente ou conhecer um lugar novo, enfrentamos dois dilemas frequentes:

* **Falta de sugestoes direcionadas:** Dificuldade em encontrar recomendacoes que realmente combinem com o paladar, momento ou contexto especifico.
* **Perda da memoria gastronomica:** Esquecimento frequente do nome do lugar, da localizacao exata ou dos pratos pedidos em experiencias anteriores.

---

## A Solucao

O **MordeAI** funciona como um diario gastronomico pessoal integrado a um assistente de Inteligencia Artificial. A plataforma permite registrar, avaliar e categorizar locais visitados, enquanto a IA utiliza esses dados de historico para sugerir novas opcoes adequadas para cada momento.

---

## Diferenciais

| Plataformas Tradicionais (ex: Google Maps) | MordeAI |
| :--- | :--- |
| Usadas predominantemente para reclamacoes ou avaliacoes pontuais | Foco total em construir historico pessoal e guardar experiencias positivas |
| Recomendacoes genericas baseadas na media de desconhecidos | Recomendacoes personalizadas via IA considerando o gosto individual |
| Interfaces genericas com multiplos tipos de estabelecimentos | Interface especializada e dedicada exclusivamente a restaurantes |

---

## Arquitetura e Tecnologias

O projeto adota uma arquitetura em camadas com separacao clara de responsabilidades:

* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend:** Python, FastAPI, Pydantic, HTTPX
* **Banco de Dados:** PostgreSQL hospedado no Supabase
* **Integracao de Mapas:** Google Places API (New)
* **Inteligencia Artificial:** Google Gemini API (recomendacoes contextuais)

---

## Estrutura do Repositorio

```text
MordeAI/
├── frontend/             # Aplicacao Next.js
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── core/         # Configuracoes e variaveis de ambiente
│   │   ├── routers/      # Endpoints da API (places, chat, etc.)
│   │   ├── schemas/      # Modelos Pydantic de entrada e saida
│   │   └── services/     # Regras de negocio (Google Places, IA, Supabase)
│   ├── requirements.txt  # Dependencias Python
│   └── test_places_sync.py
├── .gitignore            # Regras de exclusao do Git
└── README.md             # Documentacao principal do projeto
```

---

## Modelo de Dados (Supabase / PostgreSQL)

O banco de dados relacional e composto pelas seguintes entidades principais:

* **Usuario:** Cadastro, login e perfil do usuario.
* **Restaurante:** Dados do estabelecimento (nome, endereco, telefone, coordenadas, id do Google e nota).
* **Tags:** Categorias e tipos culinarios vinculados ao restaurante.
* **Horario De Funcionamento:** Dias da semana e horarios de abertura/fechamento.
* **Review:** Avaliacoes de notas e comentarios feitas pelos usuarios.
* **Visita:** Registro das datas em que o usuario frequentou o restaurante.
* **Favorito:** Marcacao rapida de restaurantes preferidos do usuario.

---

## Como Executar o Projeto Localmente

### Pre-requisitos
* Python 3.10 ou superior
* Node.js 18 ou superior
* Conta no Supabase com banco configurado
* Chave de API do Google Cloud (Places API New)

---

### 1. Backend (FastAPI)

1. Acesse o diretorio do backend:
   ```bash
   cd backend
   ```

2. Crie e ative o ambiente virtual:
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\activate

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Instale as dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure o arquivo `.env` com base no `.env.example`:
   ```env
   GOOGLE_MAPS_API_KEY=sua_chave_aqui
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua_chave_aqui
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   uvicorn app.main:app --reload
   ```
   A documentacao Swagger estara disponivel em: `http://localhost:8000/docs`

---

### 2. Frontend (Next.js)

1. Acesse o diretorio do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependencias:
   ```bash
   npm install
   ```

3. Inicie o servidor Next.js:
   ```bash
   npm run dev
   ```
   A interface estara disponivel em: `http://localhost:3000`

---

## Padrao de Branches e Contribuicao

Para manter o fluxo de trabalho organizado entre os membros da equipe:

* `main`: Codigo estavel pronto para demonstracao ou producao.
* `feat/<nome-da-funcionalidade>`: Novas funcionalidades (ex: `feat/backend-ai-places`, `feat/frontend-nextjs`).
* `fix/<descricao-do-bug>`: Correcoes de problemas.
* `chore/<ajuste>`: Configuracoes de build, gitignore, scaffolding e documentacao.
