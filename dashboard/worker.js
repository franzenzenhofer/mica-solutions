export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve the dashboard HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      // Return the HTML directly for now
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MICA Solutions Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
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
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 2.5rem;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 2rem;
        }
        .services {
            display: grid;
            gap: 1rem;
            margin-top: 2rem;
        }
        .service {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            transition: transform 0.2s;
        }
        .service:hover {
            transform: translateX(5px);
            background: #f1f3f5;
        }
        .service h3 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        .service p {
            color: #666;
            margin-bottom: 0.5rem;
        }
        .service a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .service a:hover {
            text-decoration: underline;
        }
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            background: #34d399;
            color: #064e3b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 MICA Solutions Platform</h1>
        <p class="subtitle">AI-powered automation tools for Music Austria</p>
        
        <div class="services">
            <div class="service">
                <h3>Neural Knowledge Network</h3>
                <p>AI-powered Q&A assistant for music industry professionals</p>
                <a href="https://praxiswissen.mica.franzai.com">praxiswissen.mica.franzai.com</a>
                <br><br>
                <span class="status">Deployed</span>
            </div>
            
            <div class="service">
                <h3>Reality Sync Engine</h3>
                <p>Automated database synchronization from external sources</p>
                <a href="https://reality.mica.franzai.com">reality.mica.franzai.com</a>
                <br><br>
                <span class="status">Deployed</span>
            </div>
            
            <div class="service">
                <h3>Intelligence Harvester</h3>
                <p>Event extraction from emails and documents</p>
                <a href="https://harvest.mica.franzai.com">harvest.mica.franzai.com</a>
                <br><br>
                <span class="status">Deployed</span>
            </div>
        </div>
    </div>
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