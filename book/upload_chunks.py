import os
import asyncio
from typing import List, Dict
from pathlib import Path

# Add backend to path to import our modules
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.services.embedding_service import embedding_service
from backend.services.qdrant_service import qdrant_service
from backend.utils.chunker import chunker
from backend.models.chunk import ContentChunkCreate


class BookContentUploader:
    def __init__(self):
        pass

    def validate_content(self, content: str, file_path: str) -> bool:
        """
        Validate book content before processing.
        """
        if not content or len(content.strip()) == 0:
            print(f"Warning: File {file_path} is empty")
            return False

        if len(content) > 1000000:  # 1MB limit for a single file
            print(f"Warning: File {file_path} is very large and may cause issues")
            # We'll continue but warn the user

        return True

    async def read_markdown_file(self, file_path: str) -> str:
        """
        Read content from a markdown file.
        """
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content

    def parse_markdown_content(self, content: str) -> str:
        """
        Parse and clean markdown content, extracting only the text content.
        This is a basic implementation - in a full implementation you might want
        to use a markdown parsing library to properly extract text content.
        """
        # Remove markdown headers but preserve their text content
        import re

        # Remove image references
        content = re.sub(r'!\[.*?\]\(.*?\)', '', content)

        # Remove links but keep the link text
        content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', content)

        # Remove bold and italic markers
        content = re.sub(r'\*\*(.*?)\*\*', r'\1', content)
        content = re.sub(r'\*(.*?)\*', r'\1', content)
        content = re.sub(r'__(.*?)__', r'\1', content)
        content = re.sub(r'_(.*?)_', r'\1', content)

        # Remove code blocks
        content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)

        # Remove inline code
        content = re.sub(r'`(.*?)`', r'\1', content)

        # Remove markdown headers but keep the text
        content = re.sub(r'^#+\s*(.*)', r'\1', content, flags=re.MULTILINE)

        # Remove horizontal rules
        content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE)

        # Clean up extra whitespace
        content = re.sub(r'\n\s*\n', '\n\n', content)

        return content.strip()

    async def process_book_content(self, content: str, source_file: str = "") -> List[Dict]:
        """
        Process book content by chunking and generating embeddings.
        """
        print(f"Validating content from {source_file}...")
        if not self.validate_content(content, source_file):
            raise ValueError(f"Content validation failed for {source_file}")

        print(f"Chunking content from {source_file}...")
        chunks = chunker.chunk_text(content, method="tokens")
        print(f"Content split into {len(chunks)} chunks")

        processed_chunks = []
        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i+1}/{len(chunks)}...")

            # Generate embedding for the chunk
            embedding = await embedding_service.generate_embedding(chunk['content'])

            # Create a chunk object with all necessary data
            chunk_obj = {
                'id': f"{os.path.basename(source_file).replace('.', '_')}_{i:04d}",
                'content': chunk['content'],
                'embedding_vector': embedding,
                'book_content_id': os.path.basename(source_file),
                'token_count': chunk['token_count'],
                'position': i,
                'metadata': {
                    'source_file': source_file,
                    'chunk_index': i,
                    'original_length': len(chunk['content'])
                }
            }

            processed_chunks.append(chunk_obj)

        print(f"Successfully processed {len(processed_chunks)} chunks from {source_file}")
        return processed_chunks

    async def upload_book_from_file(self, file_path: str) -> bool:
        """
        Upload a single book file to the vector database.
        """
        if not os.path.exists(file_path):
            print(f"File does not exist: {file_path}")
            return False

        try:
            print(f"Reading content from {file_path}...")
            content = await self.read_markdown_file(file_path)

            # Parse markdown content to extract text
            print("Parsing markdown content...")
            parsed_content = self.parse_markdown_content(content)

            print("Processing book content...")
            chunks = await self.process_book_content(parsed_content, file_path)

            print(f"Uploading {len(chunks)} chunks to Qdrant...")
            success = await qdrant_service.store_chunks(chunks)

            if success:
                print(f"Successfully uploaded {len(chunks)} chunks from {file_path}")
                return True
            else:
                print(f"Failed to upload chunks from {file_path}")
                return False
        except Exception as e:
            print(f"Error uploading book from {file_path}: {e}")
            return False

    async def upload_book_from_directory(self, directory_path: str, file_pattern: str = "*.md") -> bool:
        """
        Upload all matching files from a directory to the vector database.
        """
        directory = Path(directory_path)
        files = list(directory.glob(file_pattern))

        if not files:
            print(f"No {file_pattern} files found in {directory_path}")
            return False

        print(f"Found {len(files)} files to process")
        success_count = 0

        for file_path in files:
            print(f"\nProcessing file: {file_path}")
            if await self.upload_book_from_file(str(file_path)):
                success_count += 1

        print(f"\nCompleted: {success_count}/{len(files)} files successfully processed")
        return success_count == len(files)


async def main():
    """
    Main function to run the upload script.
    """
    import argparse

    parser = argparse.ArgumentParser(description="Upload book content to Qdrant vector database")
    parser.add_argument("--file", type=str, help="Path to a single markdown file to upload")
    parser.add_argument("--directory", type=str, help="Path to directory containing markdown files to upload")
    parser.add_argument("--pattern", type=str, default="*.md", help="File pattern to match (default: *.md)")

    args = parser.parse_args()

    uploader = BookContentUploader()

    if args.file:
        success = await uploader.upload_book_from_file(args.file)
        print(f"Upload {'successful' if success else 'failed'} for file: {args.file}")
    elif args.directory:
        success = await uploader.upload_book_from_directory(args.directory, args.pattern)
        print(f"Directory upload {'successful' if success else 'failed'} for: {args.directory}")
    else:
        print("Please specify either --file or --directory")
        return 1

    return 0 if success else 1


if __name__ == "__main__":
    asyncio.run(main())