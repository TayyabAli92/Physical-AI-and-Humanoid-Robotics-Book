from typing import Dict, Any
from google.generativeai import GenerativeModel, configure
import google.generativeai as genai
from backend.utils.config import config
import asyncio
import warnings

class AnswerWithContextTool:
    """
    Tool for generating an answer based on provided context and question using Gemini.
    Supports both regular RAG context (from Qdrant) and selected text context.
    """
    def __init__(self):
        genai.configure(api_key=config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(config.GEMINI_MODEL)

    def __call__(self, question: str, context: str, mode: str = "rag") -> str:
        """
        Generate an answer based on the question and context.
        mode: "rag" for regular RAG context, "selected_text" for selected text context
        """
        # This would typically be called by the agent framework
        # For now, we'll create a synchronous version that can be integrated later
        warnings.filterwarnings("ignore", category=DeprecationWarning)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self.async_answer_with_context(question, context, mode))
        finally:
            loop.close()

    async def async_answer_with_context(self, question: str, context: str, mode: str = "rag") -> str:
        """
        Asynchronously generate an answer based on the question and context.
        mode: "rag" for regular RAG context, "selected_text" for selected text context
        """
        if mode == "selected_text":
            prompt = f"""
            Selected Text (Context): {context}

            Question: {question}

            Please provide a detailed answer to the question based solely on the provided selected text.
            Do not use any other knowledge sources.
            If the selected text does not contain information to answer the question, please state that the information is not available in the selected text.
            """
        else:  # regular RAG mode
            prompt = f"""
            Context: {context}

            Question: {question}

            Please provide a detailed answer to the question based solely on the provided context.
            If the context does not contain information to answer the question, please state that the information is not available in the provided context.
            """

        response = await self.model.generate_content_async(prompt)
        return response.text if response.text else "I couldn't generate a response based on the provided context."

# For OpenAI function calling compatibility
def answer_with_context_function(question: str, context: str, mode: str = "rag") -> str:
    """
    Function that can be registered with OpenAI agent tools.
    """
    tool = AnswerWithContextTool()
    return tool(question, context, mode)