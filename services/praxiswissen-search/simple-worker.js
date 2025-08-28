export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Knowledge Network - MICA Solutions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 { color: #333; margin-bottom: 1rem; font-size: 2rem; }
        p { color: #666; margin: 1rem 0; }
        .input-group { margin: 2rem 0; }
        input {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            margin-bottom: 1rem;
        }
        button {
            background: #3b82f6;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover { background: #2563eb; }
        .status { 
            background: #10b981; 
            color: white; 
            padding: 0.5rem 1rem; 
            border-radius: 20px;
            display: inline-block;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 Neural Knowledge Network</h1>
        <p>AI-powered Q&A assistant for Music Austria</p>
        
        <div class="input-group">
            <input type="text" placeholder="Enter your Gemini API key..." id="apiKey">
            <input type="text" placeholder="Ask a question about the music industry..." id="question">
            <button onclick="alert('Service is being configured. Please check back soon!')">Ask Question</button>
        </div>
        
        <div class="status">✅ Service Deployed</div>
        
        <p style="margin-top: 2rem; font-size: 0.875rem; color: #9ca3af;">
            This service uses Google Gemini AI to answer questions about the Austrian music industry.
            Get your free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>.
        </p>
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};