from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.src.services.embedding_service import CohereEmbeddingService
from backend.src.services.qdrant_service import QdrantService
from backend.src.utils.embedding_validator import EmbeddingValidator
from backend.src.api.deps import get_embedding_service, get_qdrant_service, get_embedding_validator
from google.generativeai import GenerativeModel, configure
import google.generativeai as genai
from backend.utils.config import config
import uuid
from datetime import datetime

router = APIRouter()

class RAGRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class RetrievedChunk(BaseModel):
    text: str
    source_path: str
    score: float

class RAGResponse(BaseModel):
    query: str
    answer: str
    retrieved_chunks: List[RetrievedChunk]

@router.post("/rag", response_model=RAGResponse)
async def rag_query(
    request: RAGRequest,
    embedding_service: CohereEmbeddingService = Depends(get_embedding_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service),
    validator: EmbeddingValidator = Depends(get_embedding_validator)
):
    """
    Retrieve relevant chunks and generate response using agent.
    """
    # Verify embeddings exist
    embeddings_exist = await validator.verify_embeddings_exist()
    if not embeddings_exist:
        raise HTTPException(status_code=404, detail="Embedding not found: Re-run embed pipeline")

    try:
        # Generate embedding for the query
        query_embedding = await embedding_service.embed_text(request.query)

        # Search for similar chunks in Qdrant
        search_results = await qdrant_service.search_similar(
            query_embedding=query_embedding,
            top_k=request.top_k
        )

        # Extract context from search results
        context_parts = []
        retrieved_chunks = []

        for result in search_results:
            context_parts.append(result["text"])
            retrieved_chunks.append(
                RetrievedChunk(
                    text=result["text"],
                    source_path=result["source_path"],
                    score=result["score"]
                )
            )

        if not context_parts:
            answer = "I couldn't find relevant information in the book to answer your question."
        else:
            # Combine context
            context = "\n\n".join(context_parts)

            # Generate answer using Gemini
            genai.configure(api_key=config.GEMINI_API_KEY)
            model = genai.GenerativeModel(config.GEMINI_MODEL)

            prompt = f"""
            Context: {context}

            Question: {request.query}

            Please provide a detailed answer to the question based solely on the provided context.
            If the context does not contain information to answer the question, please state that the information is not available in the provided context.
            """

            response = await model.generate_content_async(prompt)
            answer = response.text if response.text else "I couldn't generate a response based on the provided context."

        return RAGResponse(
            query=request.query,
            answer=answer,
            retrieved_chunks=retrieved_chunks
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")