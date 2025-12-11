from openai import OpenAI
from typing import Dict, Any, List
from backend.utils.config import config
from backend.src.tools.retrieve_chunks import retrieve_chunks_function
from backend.src.tools.answer_with_context import answer_with_context_function

class OpenAIAgentService:
    def __init__(self):
        self.client = OpenAI(api_key=config.OPENAI_API_KEY)
        self.gemini_api_key = config.GEMINI_API_KEY
        self.gemini_model = config.GEMINI_MODEL

    async def create_rag_agent(self):
        """
        Create the main RAG agent with both required tools.
        """
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "retrieve_chunks",
                    "description": "Retrieve relevant text chunks from the knowledge base based on the query",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "The query to search for relevant chunks"
                            },
                            "top_k": {
                                "type": "integer",
                                "description": "Number of chunks to retrieve (default: 5)"
                            }
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "answer_with_context",
                    "description": "Generate an answer based on provided context and question",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "question": {
                                "type": "string",
                                "description": "The question to answer"
                            },
                            "context": {
                                "type": "string",
                                "description": "The context to use for answering the question"
                            },
                            "mode": {
                                "type": "string",
                                "description": "Mode for answering: 'rag' for regular RAG context, 'selected_text' for selected text context (default: 'rag')"
                            }
                        },
                        "required": ["question", "context"]
                    }
                }
            }
        ]

        instructions = (
            "You are a helpful RAG assistant that answers questions based on book content. "
            "First, use the retrieve_chunks function to get relevant information from the knowledge base. "
            "Then, use the answer_with_context function to generate a response based on the retrieved context. "
            "Always cite the source of information when possible. "
            "If you cannot find relevant information, inform the user that the information is not in the book."
        )

        agent = self.client.beta.agents.create(
            name="RAG Agent",
            instructions=instructions,
            model="gpt-4",  # Using gpt-4 as the underlying model for the agent
            tools=tools
        )
        return agent

    async def run_rag_query(self, query: str):
        """
        Run a RAG query from end to end.
        """
        # Create the RAG agent
        agent = await self.create_rag_agent()

        # Create a thread with the user's query
        thread = self.client.beta.threads.create(
            messages=[
                {
                    "role": "user",
                    "content": query
                }
            ]
        )

        # Run the agent
        run = self.client.beta.threads.runs.create(
            thread_id=thread.id,
            agent_id=agent.id
        )

        # Wait for the run to complete (in a real implementation, you'd poll or use streaming)
        import time
        while run.status in ["queued", "in_progress"]:
            time.sleep(1)  # Simple polling - in production, use proper async waiting
            run = self.client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )

        # Get the messages from the thread
        messages = self.client.beta.threads.messages.list(
            thread_id=thread.id
        )

        # Extract the assistant's response
        for message in messages.data:
            if message.role == "assistant":
                return {
                    "query": query,
                    "answer": message.content[0].text.value if message.content else "No answer generated",
                    "agent_id": agent.id,
                    "thread_id": thread.id
                }

        return {
            "query": query,
            "answer": "No response from agent",
            "agent_id": agent.id,
            "thread_id": thread.id
        }

    async def create_agent(self, name: str, instructions: str, tools: List[Dict[str, Any]] = None):
        """
        Create an OpenAI agent with the specified tools.
        """
        if tools is None:
            tools = []

        agent = self.client.beta.agents.create(
            name=name,
            instructions=instructions,
            model="gpt-4",  # Using gpt-4 as the underlying model for the agent
            tools=tools
        )
        return agent

    async def run_agent(self, agent_id: str, thread_id: str, instructions: str = None):
        """
        Run an agent on a thread with optional additional instructions.
        """
        run = self.client.beta.threads.runs.create(
            thread_id=thread_id,
            agent_id=agent_id,
            instructions=instructions
        )
        return run

    async def create_thread(self, messages: List[Dict[str, Any]] = None):
        """
        Create a new thread for conversation.
        """
        if messages is None:
            messages = []

        thread = self.client.beta.threads.create(
            messages=messages
        )
        return thread

    async def get_thread_messages(self, thread_id: str):
        """
        Get messages from a thread.
        """
        messages = self.client.beta.threads.messages.list(
            thread_id=thread_id
        )
        return messages