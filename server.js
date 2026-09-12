const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Parse URL safely to strip query parameters (e.g., ?v=4.5&t=123456)
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = reqUrl.pathname === '/' ? '/index.html' : reqUrl.pathname;
  
  // Prevent directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain; charset=UTF-8';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Aggressive anti-cache headers so iPad Safari always receives fresh code
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`\n==================================================`);
  console.log(`🚀 Content & Script Studio Server Activo!`);
  console.log(`==================================================`);
  console.log(`💻 Desde tu computador abre:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📱 Desde tu iPhone, iPad o Safari (misma red Wi-Fi):`);
  console.log(`   http://${localIP}:${PORT}`);
  console.log(`==================================================\n`);
});
