import { GoogleGenerativeAI } from '@google/generative-ai';

const SOURCES_TO_MONITOR = [
  { type: 'website', url: 'https://www.musicaustria.at/musikdatenbank/personen', category: 'artists' },
  { type: 'website', url: 'https://www.mica.at/artists', category: 'artists' },
  { type: 'api', url: 'https://www.akm.at/api/members', category: 'rights' },
  // Add more sources as needed
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    switch (url.pathname) {
      case '/':
        return handleDashboard(env, corsHeaders);
      
      case '/api/sync/trigger':
        return handleManualSync(request, env, corsHeaders);
      
      case '/api/sync/status':
        return handleSyncStatus(env, corsHeaders);
      
      case '/api/changes/recent':
        return handleRecentChanges(env, corsHeaders);
      
      case '/api/conflicts':
        return handleConflicts(env, corsHeaders);
      
      case '/api/confidence/adjust':
        return handleConfidenceAdjust(request, env, corsHeaders);
      
      default:
        return new Response('Not found', { status: 404, headers: corsHeaders });
    }
  },

  async scheduled(event, env, ctx) {
    // Automated sync triggered by cron
    console.log('Starting scheduled sync at:', new Date().toISOString());
    ctx.waitUntil(performFullSync(env));
  },
};

async function handleDashboard(env, headers) {
  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MICA Reality Sync Engine</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
</head>
<body class="bg-gray-50" x-data="syncDashboard()">
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">🔄 Reality Sync Engine</h1>
      <p class="text-gray-600">Automated Truth Reconciliation for MICA Database</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Artists</div>
        <div class="text-2xl font-bold text-blue-600" x-text="stats.totalArtists">0</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Last Sync</div>
        <div class="text-lg font-semibold text-green-600" x-text="stats.lastSync">Never</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Changes Today</div>
        <div class="text-2xl font-bold text-orange-600" x-text="stats.changesToday">0</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Confidence Score</div>
        <div class="text-2xl font-bold text-purple-600" x-text="stats.avgConfidence + '%'">0%</div>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Control Panel</h2>
      <div class="flex gap-4">
        <button @click="triggerSync()" 
          :disabled="syncing"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          <span x-show="!syncing">🔄 Trigger Sync Now</span>
          <span x-show="syncing">⏳ Syncing...</span>
        </button>
        <button @click="viewConflicts()" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
          ⚠️ View Conflicts (<span x-text="stats.conflicts">0</span>)
        </button>
        <button @click="exportChanges()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          📥 Export Changes
        </button>
      </div>
    </div>

    <!-- Recent Changes -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4">Recent Changes</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Time</th>
              <th class="px-4 py-2 text-left">Entity</th>
              <th class="px-4 py-2 text-left">Field</th>
              <th class="px-4 py-2 text-left">Old Value</th>
              <th class="px-4 py-2 text-left">New Value</th>
              <th class="px-4 py-2 text-left">Confidence</th>
              <th class="px-4 py-2 text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            <template x-for="change in recentChanges" :key="change.id">
              <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2 text-sm" x-text="formatTime(change.timestamp)"></td>
                <td class="px-4 py-2 font-medium" x-text="change.entity"></td>
                <td class="px-4 py-2" x-text="change.field"></td>
                <td class="px-4 py-2 text-red-600" x-text="change.oldValue"></td>
                <td class="px-4 py-2 text-green-600" x-text="change.newValue"></td>
                <td class="px-4 py-2">
                  <span class="px-2 py-1 rounded text-xs" 
                    :class="getConfidenceClass(change.confidence)"
                    x-text="change.confidence + '%'">
                  </span>
                </td>
                <td class="px-4 py-2 text-sm" x-text="change.source"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    function syncDashboard() {
      return {
        syncing: false,
        stats: {
          totalArtists: 0,
          lastSync: 'Loading...',
          changesToday: 0,
          avgConfidence: 0,
          conflicts: 0
        },
        recentChanges: [],
        
        async init() {
          await this.loadStats();
          await this.loadRecentChanges();
          // Refresh every 30 seconds
          setInterval(() => {
            this.loadStats();
            this.loadRecentChanges();
          }, 30000);
        },
        
        async loadStats() {
          const response = await fetch('/api/sync/status');
          const data = await response.json();
          this.stats = data;
        },
        
        async loadRecentChanges() {
          const response = await fetch('/api/changes/recent');
          const data = await response.json();
          this.recentChanges = data.changes || [];
        },
        
        async triggerSync() {
          this.syncing = true;
          try {
            const response = await fetch('/api/sync/trigger', { method: 'POST' });
            const data = await response.json();
            alert(data.message || 'Sync started successfully');
            setTimeout(() => this.loadStats(), 2000);
          } catch (error) {
            alert('Failed to trigger sync: ' + error.message);
          } finally {
            this.syncing = false;
          }
        },
        
        formatTime(timestamp) {
          return new Date(timestamp).toLocaleString('de-AT');
        },
        
        getConfidenceClass(confidence) {
          if (confidence >= 90) return 'bg-green-100 text-green-800';
          if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
          return 'bg-red-100 text-red-800';
        },
        
        viewConflicts() {
          window.location.href = '/conflicts';
        },
        
        exportChanges() {
          window.location.href = '/api/changes/export';
        }
      }
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

async function handleManualSync(request, env, headers) {
  try {
    // Start sync in background
    const syncId = crypto.randomUUID();
    await env.SYNC_STATE.put(`sync_${syncId}`, JSON.stringify({
      status: 'running',
      startTime: new Date().toISOString(),
    }));
    
    // Don't await - let it run in background
    performFullSync(env, syncId);
    
    return new Response(
      JSON.stringify({
        message: 'Sync started',
        syncId,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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

async function handleSyncStatus(env, headers) {
  const lastSync = await env.SYNC_STATE.get('last_sync');
  const totalArtists = await env.ARTIST_DATA.list({ limit: 1 });
  
  // Get today's changes
  const today = new Date().toISOString().split('T')[0];
  const changesKey = `changes_${today}`;
  const todayChanges = await env.CHANGE_LOG.get(changesKey);
  const changesToday = todayChanges ? JSON.parse(todayChanges).length : 0;
  
  // Calculate average confidence
  const confidenceData = await env.SYNC_STATE.get('confidence_scores');
  const avgConfidence = confidenceData 
    ? Math.round(JSON.parse(confidenceData).average * 100)
    : 85;
  
  return new Response(
    JSON.stringify({
      totalArtists: totalArtists.keys.length,
      lastSync: lastSync || 'Never',
      changesToday,
      avgConfidence,
      conflicts: 0, // TODO: Implement conflict detection
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function handleRecentChanges(env, headers) {
  const changes = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Get recent changes from KV
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const dayChanges = await env.CHANGE_LOG.get(`changes_${dateKey}`);
    
    if (dayChanges) {
      const parsed = JSON.parse(dayChanges);
      changes.push(...parsed.slice(0, 10)); // Limit to 10 per day
    }
  }
  
  return new Response(
    JSON.stringify({
      changes: changes.slice(0, 50), // Return max 50 recent changes
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function handleConflicts(env, headers) {
  // TODO: Implement conflict resolution UI
  return new Response(
    JSON.stringify({ conflicts: [] }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function handleConfidenceAdjust(request, env, headers) {
  const { threshold } = await request.json();
  
  await env.SYNC_STATE.put('confidence_threshold', threshold.toString());
  
  return new Response(
    JSON.stringify({ message: 'Confidence threshold updated', threshold }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

async function performFullSync(env, syncId) {
  const startTime = Date.now();
  const changes = [];
  
  try {
    console.log('Starting full sync...');
    
    // For each source, fetch and compare data
    for (const source of SOURCES_TO_MONITOR) {
      try {
        const sourceChanges = await syncSource(source, env);
        changes.push(...sourceChanges);
      } catch (error) {
        console.error(`Failed to sync source ${source.url}:`, error);
      }
    }
    
    // Store changes
    const today = new Date().toISOString().split('T')[0];
    await env.CHANGE_LOG.put(
      `changes_${today}`,
      JSON.stringify(changes),
      { expirationTtl: 86400 * 30 } // Keep for 30 days
    );
    
    // Update sync state
    await env.SYNC_STATE.put('last_sync', new Date().toISOString());
    
    if (syncId) {
      await env.SYNC_STATE.put(`sync_${syncId}`, JSON.stringify({
        status: 'completed',
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        changesDetected: changes.length,
      }));
    }
    
    console.log(`Sync completed. ${changes.length} changes detected.`);
  } catch (error) {
    console.error('Sync failed:', error);
    
    if (syncId) {
      await env.SYNC_STATE.put(`sync_${syncId}`, JSON.stringify({
        status: 'failed',
        error: error.message,
      }));
    }
  }
}

async function syncSource(source, env) {
  // This would implement actual web scraping/API fetching
  // For now, return mock changes
  return [
    {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      entity: 'Artist Example',
      field: 'biography',
      oldValue: 'Old bio text...',
      newValue: 'Updated bio text...',
      confidence: 92,
      source: source.url,
    },
  ];
}