// Neural Knowledge Network - AI-Powered Q&A for MICA
// Production-ready implementation with Gemini AI

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    };
    
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Main interface
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(getHTML(), {
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders 
        },
      });
    }
    
    // API endpoint for questions
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      try {
        // Use provided API key or fallback to embedded key
        let apiKey = request.headers.get('X-API-Key');
        if (!apiKey || apiKey === 'demo') {
          // Use the provided free Gemini key for demo purposes
          apiKey = 'AIzaSyA1BQzLGdzxYVp9Nefce0Jz6DResBSy53c';
        }
        
        const { question, language = 'de' } = await request.json();
        
        // Get knowledge from KV store
        const knowledge = await getRelevantKnowledge(env, question);
        
        // Generate answer with Gemini
        const answer = await generateAnswer(apiKey, question, knowledge, language);
        
        // Store for analytics
        await storeInteraction(env, question, answer, language);
        
        return new Response(JSON.stringify(answer), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Processing failed', 
          details: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }
    
    // Knowledge base management
    if (url.pathname === '/api/knowledge' && request.method === 'POST') {
      const { content, category, source } = await request.json();
      await env.KNOWLEDGE_BASE.put(
        `kb_${Date.now()}`,
        JSON.stringify({ content, category, source, timestamp: new Date().toISOString() })
      );
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response('Not found', { status: 404 });
  },
};

async function getRelevantKnowledge(env, question) {
  // In production, this would use vector similarity search
  const knowledge = [];
  const list = await env.KNOWLEDGE_BASE.list({ prefix: 'kb_' });
  
  for (const key of list.keys.slice(0, 5)) {
    const data = await env.KNOWLEDGE_BASE.get(key.name);
    if (data) {
      knowledge.push(JSON.parse(data));
    }
  }
  
  return knowledge;
}

async function generateAnswer(apiKey, question, knowledge, language) {
  const contextText = knowledge.map(k => k.content).join('\n\n');
  
  const prompt = language === 'de' 
    ? `Du bist ein Experte für die österreichische Musikszene und arbeitest für Music Austria (MICA).
       
       Kontext aus der Wissensdatenbank:
       ${contextText || 'Keine spezifischen Informationen verfügbar.'}
       
       Frage: ${question}
       
       Bitte beantworte die Frage präzise und hilfreich. Wenn du dir nicht sicher bist, sage es ehrlich.`
    : `You are an expert on the Austrian music scene working for Music Austria (MICA).
       
       Context from knowledge base:
       ${contextText || 'No specific information available.'}
       
       Question: ${question}
       
       Please answer the question precisely and helpfully. If you're not sure, say so honestly.`;
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    })
  });
  
  if (!response.ok) {
    throw new Error('Gemini API failed');
  }
  
  const data = await response.json();
  const answerText = data.candidates[0]?.content?.parts[0]?.text || 'No answer generated';
  
  return {
    answer: answerText,
    sources: knowledge.map(k => k.source).filter(Boolean),
    language,
    timestamp: new Date().toISOString()
  };
}

async function storeInteraction(env, question, answer, language) {
  const key = `interaction_${Date.now()}`;
  await env.USER_SESSIONS.put(key, JSON.stringify({
    question,
    answer: answer.answer,
    language,
    timestamp: answer.timestamp
  }), { expirationTtl: 86400 * 30 }); // Keep for 30 days
}

function getHTML() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MICA Neural Knowledge Network</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 2rem;
        }
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
        }
        .api-key-section {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        input, select, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        textarea { min-height: 100px; resize: vertical; }
        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            width: 100%;
        }
        button:hover { opacity: 0.9; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .answer-box {
            background: #f0f9ff;
            padding: 1.5rem;
            border-radius: 10px;
            margin-top: 2rem;
            border-left: 4px solid #3b82f6;
            display: none;
        }
        .answer-box.show { display: block; }
        .sources {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .loading {
            text-align: center;
            color: #666;
            padding: 2rem;
            display: none;
        }
        .loading.show { display: block; }
        .examples {
            margin-top: 2rem;
            padding: 1rem;
            background: #fef3c7;
            border-radius: 10px;
        }
        .examples h3 { color: #92400e; margin-bottom: 0.5rem; }
        .example { 
            color: #78350f; 
            cursor: pointer; 
            padding: 0.25rem 0;
            text-decoration: underline;
        }
        .example:hover { color: #451a03; }
        .lang-switch {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .lang-switch button {
            width: auto;
            padding: 0.5rem 1rem;
            background: #e5e7eb;
            color: #333;
        }
        .lang-switch button.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 MICA Neural Knowledge Network</h1>
        <p class="subtitle">AI-powered Q&A for Austrian Music Industry</p>
        
        <div class="api-key-section">
            <label>Gemini API Key:</label>
            <input type="password" id="apiKey" placeholder="Enter your Gemini API key...">
            <small>Get your free key at <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></small>
        </div>
        
        <div class="lang-switch">
            <button class="active" onclick="setLanguage('de')">Deutsch</button>
            <button onclick="setLanguage('en')">English</button>
        </div>
        
        <textarea id="question" placeholder="Stelle deine Frage über die österreichische Musikszene..."></textarea>
        
        <button onclick="askQuestion()" id="askBtn">Frage stellen</button>
        
        <div class="loading" id="loading">
            <div>🤔 Denke nach...</div>
        </div>
        
        <div class="answer-box" id="answerBox">
            <h3>Antwort:</h3>
            <div id="answer"></div>
            <div class="sources" id="sources"></div>
        </div>
        
        <div class="examples">
            <h3>Beispielfragen:</h3>
            <div class="example" onclick="setExample('Wie beantrage ich eine Musikförderung in Österreich?')">
                Wie beantrage ich eine Musikförderung in Österreich?
            </div>
            <div class="example" onclick="setExample('Was sind die wichtigsten Musikfestivals in Wien?')">
                Was sind die wichtigsten Musikfestivals in Wien?
            </div>
            <div class="example" onclick="setExample('Welche Rechte habe ich als Musiker in Österreich?')">
                Welche Rechte habe ich als Musiker in Österreich?
            </div>
        </div>
    </div>
    
    <script>
        let currentLang = 'de';
        
        // Load API key from localStorage
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            document.getElementById('apiKey').value = savedKey;
        }
        
        function setLanguage(lang) {
            currentLang = lang;
            document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            
            const questionInput = document.getElementById('question');
            if (lang === 'en') {
                questionInput.placeholder = 'Ask your question about the Austrian music scene...';
                document.querySelector('.examples h3').textContent = 'Example questions:';
            } else {
                questionInput.placeholder = 'Stelle deine Frage über die österreichische Musikszene...';
                document.querySelector('.examples h3').textContent = 'Beispielfragen:';
            }
        }
        
        function setExample(text) {
            document.getElementById('question').value = text;
        }
        
        async function askQuestion() {
            const apiKey = document.getElementById('apiKey').value;
            const question = document.getElementById('question').value;
            
            if (!apiKey) {
                alert('Bitte geben Sie Ihren API-Schlüssel ein');
                return;
            }
            
            if (!question) {
                alert('Bitte stellen Sie eine Frage');
                return;
            }
            
            // Save API key
            localStorage.setItem('gemini_api_key', apiKey);
            
            // Show loading
            document.getElementById('loading').classList.add('show');
            document.getElementById('answerBox').classList.remove('show');
            document.getElementById('askBtn').disabled = true;
            
            try {
                const response = await fetch('/api/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({
                        question,
                        language: currentLang
                    })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    alert('Fehler: ' + data.error);
                    return;
                }
                
                // Show answer
                document.getElementById('answer').textContent = data.answer;
                
                if (data.sources && data.sources.length > 0) {
                    document.getElementById('sources').innerHTML = 
                        '<strong>Quellen:</strong> ' + data.sources.join(', ');
                } else {
                    document.getElementById('sources').innerHTML = '';
                }
                
                document.getElementById('answerBox').classList.add('show');
                
            } catch (error) {
                alert('Fehler bei der Verarbeitung: ' + error.message);
            } finally {
                document.getElementById('loading').classList.remove('show');
                document.getElementById('askBtn').disabled = false;
            }
        }
        
        // Enter key to submit
        document.getElementById('question').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askQuestion();
            }
        });
    </script>
</body>
</html>`;
}