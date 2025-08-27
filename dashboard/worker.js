export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve the dashboard HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = await env.ASSETS.get('index.html');
      if (html) {
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
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