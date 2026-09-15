const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const OLLAMA_HOST = 'http://127.0.0.1:11434';
const DIR = __dirname;

const DEFAULT_INITIAL_DATA = {
  "clients": [
    "Jennil",
    "Natalia"
  ],
  "scripts": [
    {
      "id": "script-1789443084089",
      "client": "Jennil",
      "number": 1,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Jennil",
      "ideaGanadora": "Venta - Metodología desde Cero",
      "linkReferencia": "",
      "gancho": "No importa cuál sea el nivel de conocimiento que tengas, con nosotros podrás aprender desde cero toda la metodología aplicada que utilizaron nuestros alumnos Mabel, Asceineth, Jeison y otros más.",
      "historia": "Obtendrás metodología y entorno propio de análisis para que aprendas a tomar tus propias decisiones sin depender de nadie.\n- Plataforma con herramientas exclusivas\n- Sala operativa en vivo 4 veces por semana\n- Acompañamiento personalizado y estrategias rentables\n- Algoritmos entrenados con IA y mucho más.",
      "moraleja": "Aprender un sistema probado es la diferencia entre improvisar y tener resultados consistentes.",
      "cta": "Si quieres tener resultados y mejorar tus ingresos mientras haces lo que amas, escribe la palabra CAMBIO, te ayudaré y te mostraré cómo lograrlo.",
      "contextoAdicional": "PRUEBAS VIDEOS CORTOS (VARIOS)",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "updatedAt": "2026-09-15T20:29:29.854Z",
      "createdAt": "2026-09-15T03:31:24.089Z"
    },
    {
      "id": "script-1",
      "client": "Jennil",
      "number": 2,
      "status": "Por Grabar",
      "formato": "Formato entrevista",
      "objetivo": "VENTA",
      "actor": "Jennil",
      "ideaGanadora": "¿Cuánto gastas al mes en Miami?",
      "linkReferencia": "",
      "gancho": "¿Cuánto gastas al mes viviendo en Miami?",
      "historia": "Gasta $5,000 dólares al mes entre casa, coche, comida, hijos y ropa...\n\n¿Y lo pagas con Tarjeta de Crédito o de Débito?\n— Con tarjeta de débito.",
      "moraleja": "Si pagas con tarjeta de crédito te dan puntos para viajar gratis y además REPORTA POSITIVAMENTE EN TU PUNTAJE DE CRÉDITO.",
      "cta": "Escribe en comentarios la palabra CRÉDITO para aprender a maximizar tu puntaje.",
      "contextoAdicional": "Se graba en Brickell Center",
      "attachments": [],
      "completed": false,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-13T01:44:41.229Z"
    },
    {
      "id": "script-2",
      "client": "Jennil",
      "number": 3,
      "status": "Redactado",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Jennil",
      "ideaGanadora": "Deja de pagar por tu tarjeta hasta que no hagas esto",
      "linkReferencia": "",
      "gancho": "Deja de pagar por tu tarjeta de crédito hasta que no hagas esto.",
      "historia": "Ten cuidado con estas 3 cosas porque estás perdiendo mucho dinero y puede hasta bajar tu puntaje:\n1. Fecha de corte en la app del banco.\n2. Evita tarjetas de tiendas comerciales.\n3. Cuidado con adelantos de efectivo.",
      "moraleja": "Corregir estos 3 errores te ahorrará miles de dólares al año y subirá tu puntaje rápidamente.",
      "cta": "Escribe CREDITO en comentarios para recibir nuestra guía de reparación gratuita.",
      "contextoAdicional": "En oficina con pantalla de datos",
      "attachments": [],
      "completed": false,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-13T01:44:41.230Z"
    },
    {
      "id": "script-29",
      "client": "Jennil",
      "number": 4,
      "status": "Editado",
      "formato": "Formato entrevista",
      "objetivo": "VIRAL",
      "actor": "Jennil",
      "ideaGanadora": "Cómo Negociar y Borrar Colecciones Médicas por Ley",
      "linkReferencia": "",
      "gancho": "Las facturas médicas menores a $500 NO pueden aparecer en tu reporte de crédito por ley.",
      "historia": "Explicación de las nuevas normativas federales de los burós de crédito (Equifax, Experian, TransUnion) para remover deudas médicas pagadas o menores de $500 de inmediato.",
      "moraleja": "Conocer tus derechos financieros te ahorra miles de dólares y protege tu crédito.",
      "cta": "Comenta MEDICO para enviarte el modelo de carta de disputa legal.",
      "contextoAdicional": "Oficina ejecutiva con micrófono de pie",
      "attachments": [],
      "completed": false,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-12T13:55:04.486Z"
    },
    {
      "id": "script-24",
      "client": "Jennil",
      "number": 5,
      "status": "Por Grabar",
      "formato": "Formato Dinámico",
      "objetivo": "VENTA",
      "actor": "Jennil",
      "ideaGanadora": "Las 3 Mejores Tarjetas de Crédito de Negocios para Viajar Gratis en Primera Clase",
      "linkReferencia": "",
      "gancho": "Este boleto a Europa en Business Class me costó solo $11 dólares en impuestos. Te muestro cómo.",
      "historia": "Estrategia de transferencia de puntos de Chase Ink y Amex Business Platinum hacia aerolíneas asociadas optimizando bonos de bienvenida.",
      "moraleja": "Convierte los gastos operativos habituales de tu empresa en viajes de lujo totalmente costeados con puntos.",
      "cta": "Escribe VIAJE en comentarios y te comparto la comparativa de tarjetas.",
      "contextoAdicional": "Lounge VIP de aeropuerto con pasaporte y laptop",
      "attachments": [],
      "completed": false,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-07T13:55:04.486Z"
    },
    {
      "id": "script-3",
      "client": "Natalia",
      "number": 6,
      "status": "Publicado",
      "formato": "Formato Vlog",
      "objetivo": "SEGUIDORES",
      "actor": "Natalia",
      "ideaGanadora": "Cómo no engordar en navidad comiendo lo que quieras",
      "linkReferencia": "",
      "gancho": "Cómo no engordar en navidad comiendo lo que quieras.",
      "historia": "El año pasado este era yo el día 24 de diciembre y este era yo el día 7 de Enero después de 7 cenas de navidad. Exactamente la misma composición corporal.",
      "moraleja": "La clave no es pasar hambre, es controlar los macros principales durante los días entre celebraciones.",
      "cta": "Comenta NAVIDAD y te envío mi guía gratis de nutrición flexible.",
      "contextoAdicional": "En la cocina con comida de navidad encima",
      "attachments": [],
      "completed": true,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-13T01:44:41.231Z"
    },
    {
      "id": "script-1789481120131",
      "client": "Jennil",
      "number": 7,
      "status": "Idea",
      "formato": "Hablando a cámara",
      "objetivo": "VIRAL",
      "actor": "Jennil",
      "ideaGanadora": "estar pendiente",
      "linkReferencia": "",
      "gancho": "estar pendiente",
      "historia": "Pendiente de redactar historia...",
      "moraleja": "Pendiente de redactar moraleja...",
      "cta": "Pendiente de redactar CTA...",
      "contextoAdicional": "",
      "attachments": [],
      "completed": false,
      "updatedAt": "2026-09-15T20:29:29.855Z",
      "createdAt": "2026-09-15T14:05:20.131Z"
    }
  ],
  "notes": {
    "Jennil": [],
    "Natalia": []
  },
  "viralEvaluations": [],
  "calendarEvents": [
    {
      "id": "c1",
      "title": "Grabación de Reels",
      "date": "2026-09-16"
    },
    {
      "id": "c2",
      "title": "Publicación de Contenido",
      "date": "2026-09-17"
    }
  ],
  "notificationEmails": {
    "primary": "jennilandresmartinezgomez777@gmail.com",
    "secondary": "ncolorado2511@outlook.com"
  },
  "deletedScripts": [],
  "challengeStartDate": "2026-09-13",
  "updatedAt": "2026-09-15T20:29:29.855Z"
};
let channelsState = {};

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || DEFAULT_INITIAL_DATA;
  if (!local || typeof local !== 'object') return remote || DEFAULT_INITIAL_DATA;

  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const deletedMap = new Map();
  (remote.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      if (age < FIFTEEN_DAYS_MS) deletedMap.set(String(s.id), s);
    }
  });
  (local.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      if (age < FIFTEEN_DAYS_MS) {
        const existing = deletedMap.get(String(s.id));
        if (!existing || new Date(s.deletedAt) >= new Date(existing.deletedAt)) {
          deletedMap.set(String(s.id), s);
        }
      }
    }
  });
  const mergedDeletedScripts = Array.from(deletedMap.values());
  const deletedIdsSet = new Set(mergedDeletedScripts.map(s => String(s.id)));
  deletedIdsSet.add('s1');
  deletedIdsSet.add('s2');
  deletedIdsSet.add('test_1');

  const scriptsMap = new Map();
  (remote.scripts || []).forEach(s => {
    if (s && s.id && !deletedIdsSet.has(String(s.id)) && (s.ideaGanadora || s.gancho || s.title)) {
      scriptsMap.set(String(s.id), s);
    }
  });
  (local.scripts || []).forEach(s => {
    if (s && s.id && !deletedIdsSet.has(String(s.id)) && (s.ideaGanadora || s.gancho || s.title)) {
      const existing = scriptsMap.get(String(s.id));
      if (!existing || (s.updatedAt && (!existing.updatedAt || s.updatedAt >= existing.updatedAt))) {
        scriptsMap.set(String(s.id), s);
      }
    }
  });
  const mergedScripts = Array.from(scriptsMap.values());

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

  return {
    clients: mergedClients,
    scripts: mergedScripts.length > 0 ? mergedScripts : DEFAULT_INITIAL_DATA.scripts,
    deletedScripts: mergedDeletedScripts,
    notes: mergedNotes,
    calendarEvents: Array.from(calMap.values()),
    viralEvaluations: (local.viralEvaluations || remote.viralEvaluations || []),
    notificationEmails: local.notificationEmails || remote.notificationEmails || DEFAULT_INITIAL_DATA.notificationEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Bypass-Tunnel-Reminder, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // API SYNC
  if (urlPath === '/api/sync') {
    if (req.method === 'POST' || req.method === 'PUT') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        try {
          const body = JSON.parse(bodyStr);
          let syncDataPathFile = path.join(DIR, 'sync-data.json');
          let diskData = DEFAULT_INITIAL_DATA;
          try {
            if (fs.existsSync(syncDataPathFile)) diskData = JSON.parse(fs.readFileSync(syncDataPathFile, 'utf8'));
          } catch(e) {}

          const merged = mergeAppData(body, diskData);
          try {
            fs.writeFileSync(syncDataPathFile, JSON.stringify(merged, null, 2));
          } catch(e) {}

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: merged }));
        } catch(e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      let syncDataPathFile = path.join(DIR, 'sync-data.json');
      let dataToSend = DEFAULT_INITIAL_DATA;
      try {
        if (fs.existsSync(syncDataPathFile)) dataToSend = JSON.parse(fs.readFileSync(syncDataPathFile, 'utf8'));
      } catch(e) {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataToSend));
      return;
    }
  }

  // OLLAMA PROXY
  if (urlPath.startsWith('/api/ollama')) {
    const subRoute = urlPath.replace('/api/ollama', '') || '/tags';
    const targetUrl = OLLAMA_HOST + '/api' + subRoute;

    let bodyData = [];
    req.on('data', chunk => bodyData.push(chunk));
    req.on('end', async () => {
      try {
        const bodyBuf = Buffer.concat(bodyData);
        const options = {
          method: req.method,
          headers: { 'Content-Type': 'application/json' }
        };
        if (bodyBuf.length > 0 && req.method !== 'GET') {
          options.body = bodyBuf;
        }

        const ollamaRes = await fetch(targetUrl, options);
        const data = await ollamaRes.text();
        res.writeHead(ollamaRes.status, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ollama proxy error', details: err.message }));
      }
    });
    return;
  }

  // STATIC FILES
  let filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(DIR, 'index.html'), (e, fallback) => {
          if (e) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallback);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 BLEX STUDIO Server running at http://localhost:' + PORT);
});
