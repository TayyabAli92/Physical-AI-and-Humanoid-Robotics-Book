import google.generativeai as genai
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmbeddingService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        genai.configure(api_key=api_key)
        self.model_name = os.getenv("EMBEDDING_MODEL", "text-embedding-005")

    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for the given text using Google's embedding model.
        """
        try:
            # Use the embedding API to generate embeddings
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="RETRIEVAL_DOCUMENT"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            raise

    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a batch of texts.
        """
        embeddings = []
        for text in texts:
            embedding = await self.generate_embedding(text)
            embeddings.append(embedding)
        return embeddings

# Singleton instance
embedding_service = EmbeddingService()