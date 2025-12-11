from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

from ...services.embedding_service import embedding_service
from ...services.qdrant_service import qdrant_service
from ...services.gemini_service import gemini_service
from ...api.deps import get_api_key

router = APIRouter()


class ChatContext(BaseModel):
    use_highlighted_text: Optional[bool] = False


class AskAgentRequest(BaseModel):
    question: str
    chat_session_id: Optional[str] = None
    highlighted_text: Optional[str] = None
    context: Optional[ChatContext] = ChatContext()


class RetrievedChunk(BaseModel):
    id: str
    content: str
    similarity_score: float


class AskAgentResponse(BaseModel):
    answer: str
    chat_session_id: str
    retrieved_chunks: List[RetrievedChunk]
    sources: List[str]


@router.post("/ask-agent", response_model=AskAgentResponse, summary="Process user question and return answer based on book content")
async def ask_agent(
    request: AskAgentRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Process a user question and return an answer based on book content.
    """
    try:
        # Generate a session ID if not provided
        session_id = request.chat_session_id or str(uuid.uuid4())

        # Determine search context
        search_text = request.question
        if request.highlighted_text and request.context.use_highlighted_text:
            # If highlighted text is provided and should be used, search based on that
            search_text = request.highlighted_text

        # Generate embedding for the search text
        query_embedding = await embedding_service.generate_embedding(search_text)

        # Search for relevant chunks in the vector database
        search_results = await qdrant_service.search_similar(
            query_embedding=query_embedding,
            top_k=5,  # Get top 5 most similar chunks
            threshold=0.3  # Minimum similarity threshold
        )

        # If highlighted text is provided and should be prioritized,
        # we'll add it as high-priority context even if it's not in the search results
        context_chunks = search_results
        if request.highlighted_text and request.context.use_highlighted_text:
            # Create a special context entry for highlighted text with high relevance
            highlighted_context = {
                "id": "highlighted_text",
                "content": request.highlighted_text,
                "similarity_score": 1.0,  # Highest relevance for highlighted text
                "metadata": {"source": "highlighted_text"}
            }
            # Add highlighted text at the beginning of context to prioritize it
            context_chunks = [highlighted_context] + search_results

        # Generate response using Gemini with context
        answer = await gemini_service.generate_response(
            question=request.question,
            context_chunks=context_chunks,
            highlighted_text=request.highlighted_text if request.context.use_highlighted_text else None
        )

        # Format retrieved chunks for response
        # Include highlighted text if it was used as context
        retrieved_chunks = []
        sources = []

        for result in context_chunks:
            if result.get("id") != "highlighted_text":  # Don't duplicate the highlighted text in results
                retrieved_chunks.append(RetrievedChunk(
                    id=result["id"],
                    content=result["content"],
                    similarity_score=result["similarity_score"]
                ))
                if "source_file" in result.get("metadata", {}):
                    source_file = result["metadata"]["source_file"]
                    if source_file not in sources:
                        sources.append(source_file)

        # If highlighted text was used, add it to the sources
        if request.highlighted_text and request.context.use_highlighted_text:
            sources.insert(0, "Highlighted Text")

        return AskAgentResponse(
            answer=answer,
            chat_session_id=session_id,
            retrieved_chunks=retrieved_chunks,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing question: {str(e)}")