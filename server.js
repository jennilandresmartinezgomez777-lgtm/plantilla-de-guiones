
function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || {};
  if (!local || typeof local !== 'object') return remote || {};

  const scriptsMap = new Map();
  (remote.scripts || []).forEach(s => { if (s && s.id) scriptsMap.set(String(s.id), s); });
  (local.scripts || []).forEach(s => {
    if (s && s.id) {
      const existing = scriptsMap.get(String(s.id));
      if (!existing || (s.updatedAt && (!existing.updatedAt || s.updatedAt >= existing.updatedAt))) {
        scriptsMap.set(String(s.id), s);
      }
    }
  });

  const calMap = new Map();
  (remote.calendarEvents || []).forEach(c => {
    if (c) {
      const key = String(c.id || (c.date + '_' + c.title));
      calMap.set(key, c);
    }
  });
  (local.calendarEvents || []).forEach(c => {
    if (c) {
      const key = String(c.id || (c.date + '_' + c.title));
      calMap.set(key, c);
    }
  });

  const mergedClients = Array.from(new Set([
    ...(local.clients || []),
    ...(remote.clients || []),
    'Jennil', 'Natalia'
  ]));

  const mergedNotes = {};
  mergedClients.forEach(c => {
    const lNotes = (local.notes && Array.isArray(local.notes[c])) ? local.notes[c] : [];
    const rNotes = (remote.notes && Array.isArray(remote.notes[c])) ? remote.notes[c] : [];
    const notesMap = new Map();
    rNotes.forEach(n => {
      const k = typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n));
      notesMap.set(k, n);
    });
    lNotes.forEach(n => {
      const k = typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n));
      notesMap.set(k, n);
    });
    mergedNotes[c] = Array.from(notesMap.values());
  });

  const mergedEmails = {
    primary: (local.notificationEmails && local.notificationEmails.primary) || (remote.notificationEmails && remote.notificationEmails.primary) || '',
    secondary: (local.notificationEmails && local.notificationEmails.secondary) || (remote.notificationEmails && remote.notificationEmails.secondary) || ''
  };

  const evalMap = new Map();
  (remote.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });
  (local.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });

  return {
    clients: mergedClients,
    scripts: Array.from(scriptsMap.values()),
    notes: mergedNotes,
    calendarEvents: Array.from(calMap.values()),
    viralEvaluations: Array.from(evalMap.values()),
    notificationEmails: mergedEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const OLLAMA_HOST = 'http://127.0.0.1:11434';
const DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

async function extractLinkMetadata(targetUrl) {
  try {
    const urlObj = new URL(targetUrl);
    const host = urlObj.hostname.toLowerCase();

    // 1. YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          platform: 'YouTube',
          title: data.title || '',
          author: data.author_name || '',
          description: `Video de YouTube: "${data.title}" por ${data.author_name}`
        };
      }
    }

    // 2. TikTok
    if (host.includes('tiktok.com')) {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          platform: 'TikTok',
          title: data.title || '',
          author: data.author_name || '',
          description: `Video de TikTok: "${data.title}" por ${data.author_name}`
        };
      }
    }

    // 3. Instagram
    if (host.includes('instagram.com')) {
      try {
        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await res.text();
        const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
        
        if (ogDesc && ogDesc[1] && !ogDesc[1].toLowerCase().includes('create an account')) {
          return {
            success: true,
            platform: 'Instagram',
            title: ogTitle ? ogTitle[1] : 'Reel de Instagram',
            description: ogDesc[1]
          };
        }
      } catch (e) {}

      return {
        success: false,
        platform: 'Instagram',
        requiresManualText: true,
        message: 'Instagram protege los reels contra bots directos. Escribe abajo en una frase de qué trata el video para que la IA lo analice con 100% de precisión.'
      };
    }

    // 4. Generic Web Page
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                      html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    
    return {
      success: true,
      platform: 'Web',
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : (titleMatch ? titleMatch[1].trim() : '')
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

const server = http.createServer(async (req, res) => {
  // CORS Headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Sync Data endpoint (PC <-> iPad <-> iPhone)
  if (req.url.startsWith('/api/sync')) {
    const syncFilePath = path.join(__dirname, 'sync-data.json');

    if (req.method === 'POST' || req.method === 'PUT') {
      try {
        let body = '';
        body = await new Promise((resolve) => {
          let chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });

        const parsed = JSON.parse(body || '{}');
        if (parsed) {
          let existing = {};
          try {
            if (fs.existsSync(syncFilePath)) {
              existing = JSON.parse(fs.readFileSync(syncFilePath, 'utf8') || '{}');
            }
          } catch(e) {}
          const mergedData = mergeAppData(parsed, existing);
          mergedData.updatedAt = new Date().toISOString();
          fs.writeFileSync(syncFilePath, JSON.stringify(mergedData, null, 2), 'utf8');

          // Relay to Vercel cloud so mobile/iPad devices stay synchronized in real-time
          fetch('https://content-script-studio.vercel.app/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
          }).catch(e => console.warn('Vercel sync relay note:', e.message));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Datos sincronizados y guardados en el PC y la Nube', 
            count: Array.isArray(parsed.scripts) ? parsed.scripts.length : 0,
            updatedAt: parsed.updatedAt 
          }));
          return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload inválido' }));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    if (req.method === 'GET') {
      try {
        if (fs.existsSync(syncFilePath)) {
          const raw = fs.readFileSync(syncFilePath, 'utf8');
          res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end(raw);
          return;
        } else {
          const empty = { clients: ['Jennil'], scripts: [], notes: { Jennil: [] }, viralEvaluations: [], updatedAt: new Date().toISOString() };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(empty));
          return;
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }
  }

  // Link Metadata Extractor endpoint
  if (req.url.startsWith('/api/extract-link')) {
    let body = '';
    if (req.method === 'POST') {
      body = await new Promise((resolve) => {
        let chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString()));
      });
    }

    try {
      const parsed = JSON.parse(body || '{}');
      const url = parsed.url;
      if (!url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'URL is required' }));
        return;
      }

      const meta = await extractLinkMetadata(url);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(meta));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // Ollama Proxy route: handles /api/ollama/*, /api/ollama/api/*, /ollama/*
  if (req.url.startsWith('/api/ollama') || req.url.startsWith('/ollama')) {
    let cleanSub = req.url.replace(/^\/(api\/)?ollama\/?/, '');
    if (cleanSub.startsWith('api/')) cleanSub = cleanSub.substring(4);
    if (!cleanSub.startsWith('/')) cleanSub = '/' + cleanSub;

    const targetUrl = `${OLLAMA_HOST}/api${cleanSub}`;
    
    try {
      let body = null;
      if (req.method === 'POST') {
        body = await new Promise((resolve) => {
          let chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
        });
      }

      const forwardRes = await fetch(targetUrl, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      const data = await forwardRes.arrayBuffer();
      res.writeHead(forwardRes.status, {
        'Content-Type': forwardRes.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(Buffer.from(data));
      return;
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No se pudo conectar con Ollama', details: err.message }));
      return;
    }
  }

  // Static File Server
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(` BLEX STUDIO SERVIDOR ACTIVO`);
  console.log(` - Acceso Local (PC): http://localhost:${PORT}`);
  console.log(` - Acceso iPad / iPhone: http://0.0.0.0:${PORT}`);
  console.log(` - Ollama Host Proxy: ${OLLAMA_HOST}`);
  console.log(`===================================================`);
});
