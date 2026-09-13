// BLEX STUDIO - Servidor Local y Proxy para iPad / iPhone / PC
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
  console.log(`🚀 BLEX STUDIO SERVIDOR ACTIVO`);
  console.log(`• En tu PC: http://localhost:${PORT}`);
  console.log(`• En tu iPad / iPhone: http://192.168.1.10:${PORT}`);
  console.log(`===================================================`);
});
