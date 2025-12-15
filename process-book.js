require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { chunkText } = require('./chunker');
const { embedTexts } = require('./embeddings');
const { createCollection, upsertVectors } = require('./qdrant');

const readBookContent = async (directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);
    const markdownFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');

    let allContent = '';

    for (const file of markdownFiles) {
      const filePath = path.join(directoryPath, file);
      const content = await fs.readFile(filePath, 'utf8');
      console.log(`Reading file: ${file}`);
      allContent += `\n\n${content}`; // Add newlines between files
    }

    if (markdownFiles.length === 0) {
      console.log('No markdown files found in the directory');
      // If no markdown files, try reading a single file if the path is a file
      try {
        const stats = await fs.stat(directoryPath);
        if (stats.isFile() && path.extname(directoryPath).toLowerCase() === '.md') {
          allContent = await fs.readFile(directoryPath, 'utf8');
          console.log(`Reading file: ${directoryPath}`);
        }
      } catch (err) {
        console.error('Error checking if path is a file:', err);
      }
    }

    return allContent;
  } catch (error) {
    console.error('Error reading book content:', error);
    throw error;
  }
};

// Main function to process the book: chunk → embed → store in Qdrant
const processBook = async (bookPath = './book/content') => {
  try {
    console.log('Starting book processing...');

    // Step 1: Create Qdrant collection
    console.log('Creating Qdrant collection...');
    await createCollection();

    // Step 2: Read book content
    console.log('Reading book content...');
    const content = await readBookContent(bookPath);

    if (!content || content.trim().length === 0) {
      console.error('No content found to process');
      return;
    }

    console.log(`Content length: ${content.length} characters`);

    // Step 3: Chunk the content
    console.log('Chunking content...');
    const chunks = chunkText(content);
    console.log(`Content chunked into ${chunks.length} pieces`);

    // Step 4: Generate embeddings for all chunks
    console.log('Generating embeddings...');
    const textsToEmbed = chunks.map(chunk => chunk.text);
    const embeddings = await embedTexts(textsToEmbed);
    console.log(`Generated ${embeddings.length} embeddings`);

    // Step 5: Prepare data for upsert
    const vectorsData = chunks.map((chunk, index) => ({
      id: `chunk_${Date.now()}_${index}`,
      vector: embeddings[index],
      payload: {
        text: chunk.text,
        tokenCount: chunk.tokenCount,
        source: bookPath,
        chunkIndex: index
      }
    }));

    // Step 6: Upsert vectors to Qdrant
    console.log('Upserting vectors to Qdrant...');
    await upsertVectors(vectorsData);

    console.log('Book processing completed successfully!');
  } catch (error) {
    console.error('Error processing book:', error);
    throw error;
  }
};

// Run the process if this file is executed directly
if (require.main === module) {
  const bookPath = process.argv[2] || './book/content'; // Use command line argument or default path
  processBook(bookPath).catch(console.error);
}

module.exports = { processBook };