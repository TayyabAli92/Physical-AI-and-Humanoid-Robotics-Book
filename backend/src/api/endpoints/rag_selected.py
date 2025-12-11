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

router = APIRouter()

class SelectedTextRAGRequest(BaseModel):
    selected_text: str
    query: str

class SelectedTextRAGResponse(BaseModel):
    query: str
    answer: str
    selected_text_used: str

@router.post("/rag/selected", response_model=SelectedTextRAGResponse)
async def rag_selected_text(
    request: SelectedTextRAGRequest,
    embedding_service: CohereEmbeddingService = Depends(get_embedding_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service),
    validator: EmbeddingValidator = Depends(get_embedding_validator)
):
    """
    Generate response from selected text only, bypassing Qdrant.
    """
    try:
        # Generate answer using only the selected text as context
        genai.configure(api_key=config.GEMINI_API_KEY)
        model = genai.GenerativeModel(config.GEMINI_MODEL)

        prompt = f"""
        Selected Text (Context): {request.selected_text}

        Question: {request.query}

        Please provide a detailed answer to the question based solely on the provided selected text.
        Do not use any other knowledge sources.
        If the selected text does not contain information to answer the question, please state that the information is not available in the selected text.
        """

        response = await model.generate_content_async(prompt)
        answer = response.text if response.text else "I couldn't generate a response based on the selected text."

        return SelectedTextRAGResponse(
            query=request.query,
            answer=answer,
            selected_text_used=request.selected_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Selected text RAG query failed: {str(e)}")