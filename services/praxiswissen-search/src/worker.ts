import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

export interface Env {
  KNOWLEDGE_BASE: KVNamespace;
  USER_SESSIONS: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use(
  '/*',
  cors({
    origin: ['http://localhost:3000', 'https://praxiswissen.mica.franzai.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    maxAge: 86400,
  })
);

// Serve static files
app.use('/*', serveStatic({ root: './dist' }));

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'MICA Neural Knowledge Network',
    timestamp: new Date().toISOString(),
  });
});

// Main chat endpoint
app.post('/api/chat', async (c) => {
  const { message, language = 'de', apiKey } = await c.req.json();

  if (!apiKey) {
    return c.json({ error: 'API key required' }, 400);
  }

  if (!apiKey.startsWith('AIzaSy')) {
    return c.json({ error: 'Invalid API key format' }, 400);
  }

  try {
    // Initialize Gemini with user's API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-preview',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Retrieve context from KV store
    const context = await c.env.KNOWLEDGE_BASE.get('mica_knowledge', 'text');
    
    const systemPrompt = language === 'de' 
      ? `Du bist der MICA AI-Assistent, ein hilfreicher Experte für die österreichische Musikbranche. 
Du hilfst Musikschaffenden bei Fragen zu Förderungen, Recht, Export, Workshops und allem rund um die Musikbranche in Österreich.

Kontext:
${context || 'Allgemeines Wissen über die österreichische Musikbranche'}

Beantworte die folgende Frage präzise und hilfreich:`
      : `You are the MICA AI Assistant, a helpful expert for the Austrian music industry.
You help music professionals with questions about funding, law, export, workshops and everything related to the music industry in Austria.

Context:
${context || 'General knowledge about the Austrian music industry'}

Answer the following question precisely and helpfully:`;

    const fullPrompt = `${systemPrompt}

Frage/Question: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Store conversation in KV for learning
    const sessionId = crypto.randomUUID();
    await c.env.USER_SESSIONS.put(
      `session_${sessionId}`,
      JSON.stringify({
        message,
        response: text,
        language,
        timestamp: new Date().toISOString(),
      }),
      { expirationTtl: 86400 * 30 } // 30 days
    );

    return c.json({
      message: text,
      sessionId,
      sources: [
        {
          title: 'MICA - Music Information Center Austria',
          url: 'https://www.musicaustria.at',
          snippet: 'Offizielle Quelle für Informationen zur österreichischen Musikszene',
        },
      ],
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json(
      { 
        error: 'Failed to process request. Please check your API key and try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

// Validate API key endpoint
app.post('/api/validate-key', async (c) => {
  const { apiKey } = await c.req.json();

  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    return c.json({ valid: false, error: 'Invalid key format' }, 400);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Test the API key with a simple request
    await model.generateContent('Test');
    
    return c.json({ valid: true });
  } catch (error) {
    return c.json({ 
      valid: false, 
      error: 'Invalid API key or quota exceeded' 
    });
  }
});

// Knowledge base management (admin only)
app.post('/api/knowledge/update', async (c) => {
  const { content, adminKey } = await c.req.json();
  
  // Simple admin authentication
  if (adminKey !== 'mica-admin-2025') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await c.env.KNOWLEDGE_BASE.put('mica_knowledge', content);
  
  return c.json({ success: true, message: 'Knowledge base updated' });
});

export default {
  fetch: app.fetch,
};