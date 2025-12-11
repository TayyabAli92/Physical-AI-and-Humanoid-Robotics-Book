from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints import embed, search, chat, health
from backend.src.api.endpoints import rag, rag_selected
from backend.utils.config import config


def create_app() -> FastAPI:
    app = FastAPI(
        title="RAG Chatbot API",
        description="API for RAG Chatbot that answers questions based on book content",
        version="1.0.0"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        # Additional configuration for security headers if needed
    )

    # Include API routes
    app.include_router(embed.router, prefix="/api/v1", tags=["embed"])
    app.include_router(search.router, prefix="/api/v1", tags=["search"])
    app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
    app.include_router(health.router, prefix="/api/v1", tags=["health"])
    app.include_router(rag.router, prefix="/api/v1", tags=["rag"])
    app.include_router(rag_selected.router, prefix="/api/v1", tags=["rag_selected"])

    @app.get("/")
    async def root():
        return {"message": "RAG Chatbot API is running!"}

    return app


# Create the main app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.DEBUG
    )