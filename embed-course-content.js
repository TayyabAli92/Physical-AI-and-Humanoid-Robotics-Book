require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { chunkText } = require('./chunker');
const { embedTexts } = require('./embeddings');
const { createCollection, upsertVectors } = require('./qdrant');

// Function to recursively find all markdown files in a directory
const findAllMarkdownFiles = async (directoryPath) => {
  const files = await fs.readdir(directoryPath);
  let markdownFiles = [];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Recursively search in subdirectories
      const subDirFiles = await findAllMarkdownFiles(filePath);
      markdownFiles = markdownFiles.concat(subDirFiles);
    } else if (path.extname(file).toLowerCase() === '.md') {
      // Only add files that are not in build directory (which contains generated HTML)
      if (!filePath.includes('build/')) {
        markdownFiles.push(filePath);
      }
    }
  }

  return markdownFiles;
};

// Function to read content from all markdown files
const readAllBookContent = async (directoryPath) => {
  try {
    const markdownFiles = await findAllMarkdownFiles(directoryPath);
    console.log(`Found ${markdownFiles.length} markdown files to process`);

    let allContent = '';
    const fileMetadata = [];

    for (const filePath of markdownFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`Reading file: ${filePath}`);

        // Add content with source metadata
        const fileContent = `\n\n--- FILE: ${filePath} ---\n\n${content}`;
        allContent += fileContent;

        // Store metadata for tracking
        fileMetadata.push({
          filePath: filePath,
          contentLength: content.length,
          relativePath: path.relative(directoryPath, filePath)
        });
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
      }
    }

    return { allContent, fileMetadata };
  } catch (error) {
    console.error('Error reading book content:', error);
    throw error;
  }
};

// Main function to process all course content: chunk → embed → store in Qdrant
const processAllCourseContent = async (bookPath = './docs') => {
  try {
    console.log('Starting comprehensive course content processing...');
    console.log(`Processing content from: ${bookPath}`);

    // Step 1: Create Qdrant collection
    console.log('Creating Qdrant collection...');
    await createCollection();

    // Step 2: Read all book content
    console.log('Reading all course content...');
    const { allContent, fileMetadata } = await readAllBookContent(bookPath);

    if (!allContent || allContent.trim().length === 0) {
      console.error('No content found to process');
      return;
    }

    console.log(`Total content length: ${allContent.length} characters across ${fileMetadata.length} files`);
    console.log('Files processed:', fileMetadata.map(f => f.relativePath));

    // Step 3: Chunk the content
    console.log('Chunking content...');
    const chunks = chunkText(allContent);
    console.log(`Content chunked into ${chunks.length} pieces`);

    // Step 4: Generate embeddings for all chunks
    console.log('Generating embeddings...');
    const textsToEmbed = chunks.map(chunk => chunk.text);

    // Process embeddings in batches to avoid API limits
    const batchSize = 96; // Cohere has limits, so we'll use a safe batch size
    const embeddings = [];

    for (let i = 0; i < textsToEmbed.length; i += batchSize) {
      const batch = textsToEmbed.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(textsToEmbed.length/batchSize)}`);

      const batchEmbeddings = await embedTexts(batch);
      embeddings.push(...batchEmbeddings);
    }

    console.log(`Generated ${embeddings.length} embeddings`);

    // Step 5: Prepare data for upsert with proper source tracking
    const vectorsData = chunks.map((chunk, index) => {
      // Extract source file from the chunk content
      const sourceMatch = chunk.text.match(/--- FILE: (.*?) ---/);
      const sourceFile = sourceMatch ? sourceMatch[1] : 'unknown';

      return {
        id: `chunk_${Date.now()}_${index}`,
        vector: embeddings[index],
        payload: {
          text: chunk.text.replace(/--- FILE: .*? ---\s*\n?\s*/g, ''), // Remove file markers from text
          tokenCount: chunk.tokenCount,
          source: sourceFile,
          chunkIndex: index,
          relativePath: path.relative(bookPath, sourceFile)
        }
      };
    });

    // Step 6: Upsert vectors to Qdrant in batches to avoid memory issues
    console.log('Upserting vectors to Qdrant...');
    const upsertBatchSize = 100;

    for (let i = 0; i < vectorsData.length; i += upsertBatchSize) {
      const batch = vectorsData.slice(i, i + upsertBatchSize);
      console.log(`Upserting batch ${Math.floor(i/upsertBatchSize) + 1}/${Math.ceil(vectorsData.length/upsertBatchSize)}`);

      await upsertVectors(batch);
    }

    console.log('Course content processing completed successfully!');
    console.log(`Processed ${fileMetadata.length} files and created ${vectorsData.length} vector embeddings in Qdrant`);

  } catch (error) {
    console.error('Error processing course content:', error);
    throw error;
  }
};

// Run the process if this file is executed directly
if (require.main === module) {
  const bookPath = process.argv[2] || './docs'; // Use command line argument or default path
  processAllCourseContent(bookPath).catch(console.error);
}

module.exports = { processAllCourseContent };