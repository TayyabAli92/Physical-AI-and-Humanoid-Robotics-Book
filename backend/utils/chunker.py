import tiktoken
from typing import List, Dict
import re


class TextChunker:
    def __init__(self, max_tokens: int = 512, overlap_tokens: int = 50):
        self.max_tokens = max_tokens
        self.overlap_tokens = overlap_tokens
        # Use the cl100k_base encoding which is suitable for most models
        self.encoding = tiktoken.get_encoding("cl100k_base")

    def count_tokens(self, text: str) -> int:
        """
        Count the number of tokens in a text string.
        """
        return len(self.encoding.encode(text))

    def split_by_tokens(self, text: str) -> List[Dict]:
        """
        Split text into chunks based on token count with overlap.
        """
        tokens = self.encoding.encode(text)
        chunks = []
        start_idx = 0

        while start_idx < len(tokens):
            # Calculate end index
            end_idx = start_idx + self.max_tokens

            # Adjust end index to not exceed text length
            if end_idx > len(tokens):
                end_idx = len(tokens)

            # Decode the chunk back to text
            chunk_tokens = tokens[start_idx:end_idx]
            chunk_text = self.encoding.decode(chunk_tokens)

            # Create chunk with metadata
            chunk = {
                "content": chunk_text,
                "token_count": len(chunk_tokens),
                "start_idx": start_idx,
                "end_idx": end_idx
            }

            chunks.append(chunk)

            # Move start index forward, accounting for overlap
            start_idx = end_idx - self.overlap_tokens

            # Ensure we don't get stuck in an infinite loop
            if start_idx <= start_idx:  # If overlap is too large
                start_idx += 1

        return chunks

    def split_by_sentences(self, text: str) -> List[Dict]:
        """
        Split text into sentence chunks, then further split by tokens if needed.
        """
        # Split text into sentences
        sentences = re.split(r'[.!?]+\s+', text)
        sentence_chunks = []

        for sentence in sentences:
            if len(sentence.strip()) > 0:
                token_count = self.count_tokens(sentence)

                if token_count <= self.max_tokens:
                    # Sentence fits in a single chunk
                    sentence_chunks.append({
                        "content": sentence,
                        "token_count": token_count
                    })
                else:
                    # Sentence is too long, split by tokens
                    token_chunks = self.split_by_tokens(sentence)
                    sentence_chunks.extend(token_chunks)

        return sentence_chunks

    def chunk_text(self, text: str, method: str = "tokens") -> List[Dict]:
        """
        Main method to chunk text using the specified method.
        """
        if method == "sentences":
            return self.split_by_sentences(text)
        else:  # default to tokens
            return self.split_by_tokens(text)


# Singleton instance
chunker = TextChunker(
    max_tokens=int(__import__('os').environ.get('MAX_TOKENS_PER_CHUNK', 512)),
    overlap_tokens=int(__import__('os').environ.get('OVERLAP_TOKENS', 50))
)