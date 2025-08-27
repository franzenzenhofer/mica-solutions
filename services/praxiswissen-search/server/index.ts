import express from 'express';
import cors from 'cors';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadDocuments } from './loaders';
import { createPromptTemplate } from './prompts';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;

// Initialize LLM and embeddings
const llm = new ChatOpenAI({
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

let vectorStore: MemoryVectorStore;
let qaChain: RetrievalQAChain;

// Initialize vector store and QA chain
async function initializeRAG() {
  console.log('Loading documents...');
  const documents = await loadDocuments();
  
  console.log('Splitting documents...');
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const splitDocs = await textSplitter.splitDocuments(documents);
  
  console.log('Creating vector store...');
  vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  
  console.log('Creating QA chain...');
  qaChain = RetrievalQAChain.fromLLM(
    llm,
    vectorStore.asRetriever(5),
    {
      returnSourceDocuments: true,
      verbose: true,
    }
  );
  
  console.log('RAG system initialized!');
}

const ChatRequestSchema = z.object({
  message: z.string(),
  language: z.enum(['de', 'en']).default('de'),
  conversationId: z.string().optional(),
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = ChatRequestSchema.parse(req.body);
    
    // Create language-specific prompt
    const prompt = createPromptTemplate(language);
    
    // Query the RAG system
    const response = await qaChain.call({
      query: message,
      language,
    });
    
    // Extract sources
    const sources = response.sourceDocuments?.map((doc: Document) => ({
      title: doc.metadata.title || 'Unknown',
      url: doc.metadata.url || '',
      snippet: doc.pageContent.substring(0, 200) + '...',
    })) || [];
    
    res.json({
      message: response.text,
      sources,
      conversationId: req.body.conversationId || 'default',
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'An error occurred processing your request' 
    });
  }
});

app.get('/api/knowledge/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await vectorStore.similaritySearchWithScore(
      query,
      Number(limit)
    );
    
    const documents = results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      score,
    }));
    
    res.json({ documents });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { messageId, feedback, comment } = req.body;
    
    // Log feedback for analysis
    console.log('Feedback received:', {
      messageId,
      feedback,
      comment,
      timestamp: new Date().toISOString(),
    });
    
    // TODO: Store in database for analysis
    
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ragInitialized: !!vectorStore,
  });
});

// Start server
initializeRAG().then(() => {
  app.listen(PORT, () => {
    console.log(`Neural Knowledge Network API running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize RAG:', error);
  process.exit(1);
});