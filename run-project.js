require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting RAG Chatbot project...');

// Check if required environment variables are set
const requiredEnvVars = ['COHERE_API_KEY', 'QDRANT_URL', 'QDRANT_API_KEY', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Warning: The following environment variables are not set:', missingEnvVars);
  console.log('Please make sure your .env file contains all required API keys.');
}

// Check if book content exists
const bookPath = './book/content';
const sampleBookPath = './book/content/sample-book.md';

// Create sample book content if it doesn't exist
if (!fs.existsSync(bookPath)) {
  fs.mkdirSync(bookPath, { recursive: true });
  console.log(`Created directory: ${bookPath}`);
}

if (!fs.existsSync(sampleBookPath)) {
  const sampleContent = `# Introduction to AI and Machine Learning

## Chapter 1: What is Artificial Intelligence?

Artificial Intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as a study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals.

## Chapter 2: Machine Learning Basics

Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.

## Chapter 3: Deep Learning and Neural Networks

Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Learning can be supervised, semi-supervised or unsupervised.

## Chapter 4: Applications of AI

AI is used in a wide variety of applications including:
- Natural Language Processing
- Computer Vision
- Robotics
- Healthcare
- Finance
- Transportation

These applications are transforming industries and creating new possibilities for automation and insight generation.
`;
  fs.writeFileSync(sampleBookPath, sampleContent);
  console.log(`Created sample book content at: ${sampleBookPath}`);
}

// Function to run a command
function runCommand(command, args, name) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- Starting ${name} ---`);
    console.log(`Command: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      console.log(`--- ${name} exited with code ${code} ---`);
      if (code === 0 || name === 'process-book') { // Allow process-book to fail if Qdrant not available
        resolve(code);
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error(`Error running ${name}:`, err.message);
      reject(err);
    });
  });
}

// Main execution function
async function runProject() {
  try {
    console.log('Step 1: Processing book content (indexing to Qdrant)...');
    // Try to run process-book, but don't fail if Qdrant is not available
    try {
      await runCommand('node', ['process-book.js'], 'Book Processing');
      console.log('✓ Book content processed successfully');
    } catch (error) {
      console.log(`⚠ Book processing failed (likely Qdrant not available): ${error.message}`);
      console.log('Continuing with server startup...');
    }

    console.log('\nStep 2: Starting the server...');
    await runCommand('node', ['server.js'], 'Server');

  } catch (error) {
    console.error('Project execution failed:', error.message);
    process.exit(1);
  }
}

// Run the project
runProject();