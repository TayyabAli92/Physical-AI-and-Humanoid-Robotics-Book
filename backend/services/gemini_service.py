import google.generativeai as genai
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        genai.configure(api_key=api_key)
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-pro")
        self.model = genai.GenerativeModel(self.model_name)

    async def generate_response(self, question: str, context_chunks: List[Dict], highlighted_text: Optional[str] = None) -> str:
        """
        Generate a response using Gemini based on the question and provided context.
        Prioritizes highlighted text if provided.
        """
        try:
            # Build the prompt with context, prioritizing highlighted text
            context_str = ""

            if highlighted_text:
                context_str += f"IMPORTANT CONTEXT (USER HIGHLIGHTED TEXT - PRIORITY 1):\n{highlighted_text}\n\n"
                context_str += "Please prioritize answering based on this highlighted text.\n\n"

            context_str += "ADDITIONAL BOOK CONTENT CONTEXT:\n"
            for i, chunk in enumerate(context_chunks):
                # Skip the highlighted text chunk if it's in the context_chunks to avoid duplication
                if chunk.get('id') != "highlighted_text":
                    context_str += f"Context {i+1}: {chunk['content']}\n\n"

            prompt = f"""
            {context_str}

            USER QUESTION: {question}

            INSTRUCTIONS:
            1. If highlighted text is provided, prioritize answering based on that text
            2. Only use information from the provided context
            3. If the answer is not in the provided context, respond with: "This information is not in the book."
            4. Be concise and helpful

            ANSWER:
            """

            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating response with Gemini: {e}")
            return "This information is not in the book."

    async def validate_answer_relevance(self, question: str, answer: str, context: str) -> bool:
        """
        Validate if the answer is relevant to the question and context.
        """
        try:
            prompt = f"""
            Question: {question}
            Answer: {answer}
            Context: {context}

            Is this answer relevant to the question and based on the provided context?
            Answer with 'yes' if relevant, 'no' if not relevant or if it contains information not in the context.
            """

            response = self.model.generate_content(prompt)
            return "yes" in response.text.lower()
        except Exception:
            # If validation fails, assume the answer is relevant
            return True

# Singleton instance
gemini_service = GeminiService()