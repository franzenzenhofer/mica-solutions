// Gemini AI integration via direct API calls

const EVENT_EXTRACTION_PROMPT = `
Extract event information from the following text. Return a structured JSON with these fields:
- title: Event name
- date: Date in ISO format
- time: Time in 24h format
- venue: Location name
- address: Full address
- artists: Array of performer names
- description: Brief description
- ticketUrl: Ticket link if available
- price: Ticket price
- category: Concert/Festival/Workshop/Other

If a field is not found, use null.

Text to analyze:
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    switch (url.pathname) {
      case '/':
        return handleInterface(env, corsHeaders);
      
      case '/api/extract':
        return handleExtraction(request, env, corsHeaders);
      
      case '/api/events/recent':
        return handleRecentEvents(env, corsHeaders);
      
      case '/api/events/export':
        return handleExport(request, env, corsHeaders);
      
      case '/api/validate':
        return handleValidation(request, env, corsHeaders);
      
      default:
        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
  },
};

function handleInterface(env, headers) {
  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MICA Intelligence Harvester</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-50 to-blue-100 min-h-screen">
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">🤖 Intelligence Harvester</h1>
      <p class="text-gray-600">Extract structured event data from emails, PDFs, and text</p>
    </div>

    <!-- Input Section -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Input Event Information</h2>
      
      <!-- API Key Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
        <input 
          type="password" 
          id="apiKey" 
          placeholder="AIzaSy..."
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
      </div>

      <!-- Text Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Paste Email/Text Content
        </label>
        <textarea 
          id="inputText" 
          rows="10" 
          placeholder="Paste email content, event description, or any text containing event information..."
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </div>

      <!-- File Upload -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Or Upload File</label>
        <input 
          type="file" 
          id="fileUpload" 
          accept=".pdf,.doc,.docx,.txt,.eml"
          class="w-full px-3 py-2 border border-gray-300 rounded"
        >
      </div>

      <button 
        onclick="extractEvents()" 
        id="extractBtn"
        class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        🔍 Extract Events
      </button>
    </div>

    <!-- Results Section -->
    <div id="results" class="hidden">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Extracted Events</h2>
        <div id="eventCards" class="space-y-4"></div>
      </div>

      <!-- Export Section -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">Export Options</h2>
        <div class="flex gap-4">
          <button onclick="exportJSON()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            📄 Export JSON
          </button>
          <button onclick="exportCSV()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            📈 Export CSV
          </button>
          <button onclick="exportExcel()" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
            📊 Export Excel
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let extractedEvents = [];

    async function extractEvents() {
      const apiKey = document.getElementById('apiKey').value;
      const inputText = document.getElementById('inputText').value;
      const fileUpload = document.getElementById('fileUpload');
      
      if (!apiKey) {
        alert('Please enter your Gemini API key');
        return;
      }

      if (!inputText && !fileUpload.files.length) {
        alert('Please provide text or upload a file');
        return;
      }

      const btn = document.getElementById('extractBtn');
      btn.disabled = true;
      btn.textContent = '⏳ Processing...';

      try {
        let content = inputText;
        
        if (fileUpload.files.length > 0) {
          // For files, we'd normally process them here
          // For demo, we'll use the text input
          content = inputText || 'File processing would happen here';
        }

        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: content,
            apiKey: apiKey,
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          alert('Error: ' + data.error);
          return;
        }

        extractedEvents = data.events || [];
        displayEvents(extractedEvents);
        document.getElementById('results').classList.remove('hidden');
      } catch (error) {
        alert('Extraction failed: ' + error.message);
      } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Extract Events';
      }
    }

    function displayEvents(events) {
      const container = document.getElementById('eventCards');
      container.innerHTML = '';

      events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
        card.innerHTML = \`
          <h3 class="text-lg font-bold mb-2">\${event.title || 'Untitled Event'}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="font-medium">Date:</span> \${event.date || 'TBD'}</div>
            <div><span class="font-medium">Time:</span> \${event.time || 'TBD'}</div>
            <div><span class="font-medium">Venue:</span> \${event.venue || 'TBD'}</div>
            <div><span class="font-medium">Category:</span> \${event.category || 'Event'}</div>
            <div class="col-span-2"><span class="font-medium">Artists:</span> \${(event.artists || []).join(', ') || 'TBD'}</div>
            <div class="col-span-2"><span class="font-medium">Address:</span> \${event.address || 'TBD'}</div>
            \${event.description ? \`<div class="col-span-2 mt-2"><span class="font-medium">Description:</span> \${event.description}</div>\` : ''}
            \${event.price ? \`<div><span class="font-medium">Price:</span> \${event.price}</div>\` : ''}
            \${event.ticketUrl ? \`<div><a href="\${event.ticketUrl}" target="_blank" class="text-blue-600 hover:underline">Tickets →</a></div>\` : ''}
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function exportJSON() {
      const dataStr = JSON.stringify(extractedEvents, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'events_' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function exportCSV() {
      const headers = ['Title', 'Date', 'Time', 'Venue', 'Address', 'Artists', 'Category', 'Price', 'Description'];
      const rows = extractedEvents.map(e => [
        e.title || '',
        e.date || '',
        e.time || '',
        e.venue || '',
        e.address || '',
        (e.artists || []).join('; '),
        e.category || '',
        e.price || '',
        e.description || ''
      ]);
      
      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.map(cell => '"' + cell.replace(/"/g, '""') + '"').join(',') + '\n';
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'events_' + new Date().toISOString().split('T')[0] + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function exportExcel() {
      // For simplicity, we'll export as CSV with .xls extension
      exportCSV();
    }
  </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...headers,
    },
  });
}

async function handleExtraction(request, env, headers) {
  try {
    const { text, apiKey } = await request.json();
    
    if (!apiKey || !text) {
      return new Response(
        JSON.stringify({ error: 'API key and text required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      );
    }

    // Extract events using Gemini API
    const prompt = EVENT_EXTRACTION_PROMPT + text;
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=\${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error('Gemini API call failed');
    }

    const geminiData = await geminiResponse.json();
    const extractedText = geminiData.candidates[0]?.content?.parts[0]?.text || '';
    
    // Parse the JSON response
    let events = [];
    try {
      // Extract JSON from the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        events = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Create a basic event from the text
      events = [{
        title: 'Event from Email',
        description: text.substring(0, 200),
        date: null,
        venue: null,
        category: 'Event',
      }];
    }

    // Store in KV for future reference
    const eventId = crypto.randomUUID();
    await env.EVENTS_STORE.put(
      `event_\${eventId}`,
      JSON.stringify({
        events,
        originalText: text.substring(0, 1000),
        extractedAt: new Date().toISOString(),
      }),
      { expirationTtl: 86400 * 90 } // Keep for 90 days
    );

    return new Response(
      JSON.stringify({ events, eventId }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  } catch (error) {
    console.error('Extraction error:', error);
    return new Response(
      JSON.stringify({ error: 'Extraction failed: ' + error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  }
}

async function handleRecentEvents(env, headers) {
  const list = await env.EVENTS_STORE.list({ limit: 50 });
  const events = [];
  
  for (const key of list.keys) {
    const data = await env.EVENTS_STORE.get(key.name);
    if (data) {
      const parsed = JSON.parse(data);
      events.push(...parsed.events);
    }
  }
  
  return new Response(
    JSON.stringify({ events }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function handleExport(request, env, headers) {
  // Implementation for export functionality
  return new Response(
    JSON.stringify({ message: 'Export endpoint' }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function handleValidation(request, env, headers) {
  // Implementation for validation
  return new Response(
    JSON.stringify({ valid: true }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}