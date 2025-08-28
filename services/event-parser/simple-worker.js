export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intelligence Harvester - MICA Solutions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif;
            background: linear-gradient(135deg, #10b981, #14b8a6);
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
        .features { 
            display: grid; 
            gap: 1rem; 
            margin: 2rem 0;
            text-align: left;
        }
        .feature {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 10px;
            border-left: 4px solid #10b981;
        }
        .feature-icon { font-size: 1.5rem; margin-right: 0.5rem; }
        .status { 
            background: #10b981; 
            color: white; 
            padding: 0.5rem 1rem; 
            border-radius: 20px;
            display: inline-block;
            margin-top: 1rem;
        }
        .upload-area {
            border: 2px dashed #e5e7eb;
            border-radius: 10px;
            padding: 2rem;
            margin: 2rem 0;
            cursor: pointer;
            transition: border-color 0.3s;
        }
        .upload-area:hover {
            border-color: #10b981;
            background: #f9fafb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Intelligence Harvester</h1>
        <p>Extract structured event data from emails, PDFs, and documents</p>
        
        <div class="upload-area" onclick="alert('Upload functionality coming soon!')">
            <p>📤 Drop files here or click to upload</p>
            <p style="font-size: 0.875rem; color: #9ca3af; margin-top: 0.5rem;">
                Supports: Email (.eml), PDF, Word, Excel
            </p>
        </div>
        
        <div class="features">
            <div class="feature">
                <span class="feature-icon">🤖</span>
                <strong>AI-Powered Extraction</strong>
                <p style="font-size: 0.875rem; color: #666; margin-top: 0.25rem;">
                    Uses Gemini AI to understand and extract event information
                </p>
            </div>
            <div class="feature">
                <span class="feature-icon">📊</span>
                <strong>Multiple Export Formats</strong>
                <p style="font-size: 0.875rem; color: #666; margin-top: 0.25rem;">
                    Export to JSON, CSV, or Excel for easy integration
                </p>
            </div>
            <div class="feature">
                <span class="feature-icon">✅</span>
                <strong>Validation Interface</strong>
                <p style="font-size: 0.875rem; color: #666; margin-top: 0.25rem;">
                    Review and validate extracted data before saving
                </p>
            </div>
        </div>
        
        <div class="status">✅ Service Deployed</div>
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