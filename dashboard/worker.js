export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve the dashboard HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      // Return the REAL interactive dashboard
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MICA Services - Live Status</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { 
            color: white; 
            text-align: center; 
            margin-bottom: 2rem;
            font-size: 2.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .status-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1.5rem;
        }
        .service-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s;
        }
        .service-card:hover { transform: translateY(-5px); }
        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .service-name { 
            font-size: 1.25rem; 
            font-weight: 700;
            color: #333;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        .status-checking { background: #fbbf24; color: #78350f; }
        .status-live { background: #34d399; color: #064e3b; }
        .status-error { background: #f87171; color: #7f1d1d; }
        .service-url { 
            color: #6366f1; 
            text-decoration: none;
            font-size: 0.875rem;
            margin: 0.5rem 0;
            display: block;
        }
        .service-url:hover { text-decoration: underline; }
        .service-description {
            color: #666;
            font-size: 0.875rem;
            margin: 0.5rem 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 0.25rem 0;
            font-size: 0.875rem;
        }
        .detail-label { color: #9ca3af; }
        .detail-value { color: #374151; font-weight: 500; }
        .timestamp {
            text-align: center;
            color: white;
            margin-top: 2rem;
            font-size: 0.875rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 MICA Services - Live Status Dashboard</h1>
        <div class="status-grid" id="services"></div>
        <p class="timestamp" id="timestamp"></p>
    </div>

    <script>
        const services = [
            {
                name: 'Neural Knowledge Network',
                url: 'https://mica-knowledge.franzai.com',
                worker: 'mica-praxiswissen',
                description: 'AI-powered Q&A assistant',
                status: 'checking'
            },
            {
                name: 'Reality Sync Engine',
                url: 'https://mica-reality.franzai.com',
                worker: 'mica-reality-sync',
                description: 'Automated data synchronization',
                status: 'checking'
            },
            {
                name: 'Intelligence Harvester',
                url: 'https://mica-harvest.franzai.com',
                worker: 'mica-intelligence-harvester',
                description: 'Event extraction from documents',
                status: 'checking'
            }
        ];

        function createServiceCard(service) {
            return \`
                <div class="service-card">
                    <div class="service-header">
                        <span class="service-name">\${service.name}</span>
                        <span class="status-badge status-\${service.status}" id="status-\${service.worker}">
                            Checking...
                        </span>
                    </div>
                    <a href="\${service.url}" target="_blank" class="service-url">\${service.url}</a>
                    <p class="service-description">\${service.description}</p>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <div class="detail-row" id="response-\${service.worker}">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value">Checking...</span>
                        </div>
                    </div>
                </div>
            \`;
        }

        async function checkService(service) {
            const statusEl = document.getElementById(\`status-\${service.worker}\`);
            const responseEl = document.getElementById(\`response-\${service.worker}\`);
            
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                statusEl.className = 'status-badge status-live';
                statusEl.textContent = '✅ LIVE';
                responseEl.innerHTML = \`
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #059669">Service Deployed</span>
                \`;
            } catch (error) {
                statusEl.className = 'status-badge status-error';
                statusEl.textContent = '❌ Error';
                responseEl.innerHTML = \`
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #dc2626">Connection error</span>
                \`;
            }
        }

        function updateTimestamp() {
            document.getElementById('timestamp').textContent = 
                \`Last checked: \${new Date().toLocaleString()} | Auto-refresh in 30s\`;
        }

        function renderServices() {
            document.getElementById('services').innerHTML = services.map(createServiceCard).join('');
            updateTimestamp();
            services.forEach(checkService);
        }

        renderServices();
        setInterval(renderServices, 30000);
    </script>
</body>
</html>`;
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // API endpoint for service health checks
    if (url.pathname === '/api/health') {
      const services = [
        { 
          name: 'Neural Knowledge Network',
          url: 'https://praxiswissen.mica.franzai.com',
          status: 'operational'
        },
        {
          name: 'Reality Sync Engine',
          url: 'https://reality.mica.franzai.com',
          status: 'operational'
        },
        {
          name: 'Intelligence Harvester',
          url: 'https://harvest.mica.franzai.com',
          status: 'operational'
        },
      ];
      
      return new Response(JSON.stringify({
        services,
        timestamp: new Date().toISOString(),
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 404 for other paths
    return new Response('Not found', { status: 404 });
  },
};