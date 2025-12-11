require('dotenv').config();

// Function to count tokens in text (simple approximation)
const countTokens = (text) => {
  // Simple token estimation: split by spaces and punctuation
  // This is a rough approximation - for more accuracy, use a proper tokenizer
  return text.split(/[\s\.,;:!?(){}\[\]"'`\-_+=<>~@#$%^&*|\\]+/).filter(Boolean).length;
};

// Function to chunk text based on token count
const chunkText = (text, maxTokens = parseInt(process.env.MAX_TOKENS_PER_CHUNK) || 512, overlapTokens = parseInt(process.env.OVERLAP_TOKENS) || 50) => {
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';
  let currentTokenCount = 0;

  for (const sentence of sentences) {
    const sentenceTokenCount = countTokens(sentence);

    // If adding this sentence would exceed the max token count
    if (currentTokenCount + sentenceTokenCount > maxTokens && currentChunk) {
      // Save the current chunk
      chunks.push({
        text: currentChunk.trim(),
        tokenCount: currentTokenCount
      });

      // Start a new chunk with overlap if possible
      if (overlapTokens > 0) {
        // Find overlapping text from the end of the current chunk
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-overlapTokens);
        currentChunk = overlapWords.join(' ') + ' ' + sentence;
        currentTokenCount = countTokens(currentChunk);
      } else {
        currentChunk = sentence;
        currentTokenCount = sentenceTokenCount;
      }
    } else {
      // Add sentence to current chunk
      currentChunk += ' ' + sentence;
      currentTokenCount += sentenceTokenCount;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      tokenCount: currentTokenCount
    });
  }

  return chunks;
};

module.exports = {
  chunkText,
  countTokens
};