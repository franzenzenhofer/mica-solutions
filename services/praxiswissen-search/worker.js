export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve static HTML for root path
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = await env.ASSETS.get('index.html');
      if (html) {
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders,
          },
        });
      }
    }

    // API endpoints
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          service: 'MICA Neural Knowledge Network',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { message, language = 'de', apiKey } = body;

        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'API key required' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        if (!apiKey.startsWith('AIzaSy')) {
          return new Response(
            JSON.stringify({ error: 'Invalid API key format' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        // Get stored knowledge from KV
        const knowledge = await env.KNOWLEDGE_BASE?.get('mica_knowledge') || '';
        
        const systemPrompt = language === 'de' 
          ? `Du bist der MICA AI-Assistent, ein hilfreicher Experte für die österreichische Musikbranche. 
Du hilfst Musikschaffenden bei Fragen zu Förderungen, Recht, Export, Workshops und allem rund um die Musikbranche in Österreich.

Wichtiges Wissen:
- SKE Förderung: Unterstützt Auslandsauftritte mit bis zu 50% der Reisekosten
- FOCUS ACTS: Jährliche Exportförderung für ausgewählte Künstler
- Künstlersozialversicherung: Pflichtversicherung für selbstständige Künstler
- AKM/austro mechana: Verwertungsgesellschaften für Urheberrechte
- MICA Workshops: Regelmäßige Schulungen zu Musikbusiness, Förderungen, Digital

${knowledge}

Beantworte die folgende Frage präzise und hilfreich:`
          : `You are the MICA AI Assistant, a helpful expert for the Austrian music industry.
You help music professionals with questions about funding, law, export, workshops and everything related to the music industry in Austria.

Key Information:
- SKE Funding: Supports international performances with up to 50% of travel costs
- FOCUS ACTS: Annual export funding for selected artists
- Artist Social Insurance: Mandatory insurance for freelance artists
- AKM/austro mechana: Copyright collecting societies
- MICA Workshops: Regular training on music business, funding, digital

${knowledge}

Answer the following question precisely and helpfully:`;

        // Call Gemini API
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nFrage/Question: ${message}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              },
              safetySettings: [
                {
                  category: 'HARM_CATEGORY_HARASSMENT',
                  threshold: 'BLOCK_ONLY_HIGH',
                },
              ],
            }),
          }
        );

        if (!geminiResponse.ok) {
          const error = await geminiResponse.text();
          console.error('Gemini API error:', error);
          throw new Error('Failed to get response from Gemini');
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates[0]?.content?.parts[0]?.text || 'Keine Antwort erhalten';

        // Store conversation in KV
        const sessionId = crypto.randomUUID();
        await env.USER_SESSIONS?.put(
          `session_${sessionId}`,
          JSON.stringify({
            message,
            response: responseText,
            language,
            timestamp: new Date().toISOString(),
          }),
          { expirationTtl: 86400 * 30 }
        );

        return new Response(
          JSON.stringify({
            message: responseText,
            sessionId,
            sources: [
              {
                title: 'MICA - Music Information Center Austria',
                url: 'https://www.musicaustria.at',
                snippet: 'Offizielle Quelle für Informationen zur österreichischen Musikszene',
              },
            ],
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      } catch (error) {
        console.error('Chat error:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to process request. Please check your API key and try again.',
            details: error.message,
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // 404 for unknown paths
    return new Response('Not found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};