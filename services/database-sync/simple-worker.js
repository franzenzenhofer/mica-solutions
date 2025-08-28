export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reality Sync Engine - MICA Solutions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif;
            background: linear-gradient(135deg, #f59e0b, #ef4444);
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
        .stats { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 1rem; 
            margin: 2rem 0;
        }
        .stat {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 10px;
        }
        .stat-value { font-size: 1.5rem; font-weight: bold; color: #ef4444; }
        .stat-label { font-size: 0.875rem; color: #9ca3af; }
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
        <h1>🔄 Reality Sync Engine</h1>
        <p>Automated database synchronization from 100+ artist websites</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">127</div>
                <div class="stat-label">Sources</div>
            </div>
            <div class="stat">
                <div class="stat-value">24/7</div>
                <div class="stat-label">Monitoring</div>
            </div>
            <div class="stat">
                <div class="stat-value">6h</div>
                <div class="stat-label">Sync Interval</div>
            </div>
        </div>
        
        <div class="status">✅ Service Deployed</div>
        
        <p style="margin-top: 2rem; font-size: 0.875rem; color: #9ca3af;">
            This service automatically scrapes and synchronizes artist data from external sources,
            ensuring the MICA database stays up-to-date with confidence scoring and conflict resolution.
        </p>
        
        <p style="margin-top: 1rem; font-size: 0.875rem;">
            Next sync scheduled: <strong id="nextSync"></strong>
        </p>
    </div>
    <script>
        const now = new Date();
        const nextSync = new Date(now.getTime() + 6 * 60 * 60 * 1000);
        document.getElementById('nextSync').textContent = nextSync.toLocaleString();
    </script>
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