const fs = require('fs');
const path = require('path');

let channelsState = {};

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

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || DEFAULT_INITIAL_DATA;
  if (!local || typeof local !== 'object') return remote || DEFAULT_INITIAL_DATA;

  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  // 0. Merge Deleted Scripts (Tombstones with 15-day TTL)
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

  // Filter out corrupted test IDs (s1, s2, test_1)
  deletedIdsSet.add('s1');
  deletedIdsSet.add('s2');
  deletedIdsSet.add('test_1');

  // 1. Merge Active Scripts by ID (NEVER restore scripts present in deletedIdsSet)
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

  // 2. Merge Calendar Events
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
  const mergedCalendar = Array.from(calMap.values());

  // 3. Merge Clients
  const mergedClients = Array.from(new Set([
    ...(local.clients || []),
    ...(remote.clients || []),
    'Jennil', 'Natalia'
  ]));

  // 4. Merge Notes per Client
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

  // 5. Merge Emails
  const mergedEmails = {
    primary: (local.notificationEmails && local.notificationEmails.primary) || (remote.notificationEmails && remote.notificationEmails.primary) || 'jennilandresmartinezgomez777@gmail.com',
    secondary: (local.notificationEmails && local.notificationEmails.secondary) || (remote.notificationEmails && remote.notificationEmails.secondary) || 'ncolorado2511@outlook.com'
  };

  // 6. Merge Viral Evaluations
  const evalMap = new Map();
  (remote.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });
  (local.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });

  return {
    clients: mergedClients,
    scripts: mergedScripts.length > 0 ? mergedScripts : DEFAULT_INITIAL_DATA.scripts,
    deletedScripts: mergedDeletedScripts,
    notes: mergedNotes,
    calendarEvents: mergedCalendar,
    viralEvaluations: Array.from(evalMap.values()),
    notificationEmails: mergedEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let channel = 'default';
  if (req.query && req.query.channel) {
    channel = String(req.query.channel).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'default';
  }

  const tmpFileName = `sync_${channel}.json`;
  const tmpFilePath = path.join('/tmp', tmpFileName);

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (body && Array.isArray(body.scripts)) {
        let existing = channelsState[channel]?.data;
        if (!existing) {
          try {
            if (fs.existsSync(tmpFilePath)) {
              existing = JSON.parse(fs.readFileSync(tmpFilePath, 'utf8'))?.data;
            }
          } catch(e) {}
        }
        if (!existing) existing = DEFAULT_INITIAL_DATA;

        const mergedData = mergeAppData(body, existing);
        mergedData.updatedAt = body.updatedAt || new Date().toISOString();

        const syncObj = {
          data: mergedData,
          channel: channel,
          updatedAt: mergedData.updatedAt
        };
        channelsState[channel] = syncObj;

        try {
          fs.writeFileSync(tmpFilePath, JSON.stringify(syncObj));
        } catch (e) {}

        return res.status(200).json({ 
          success: true, 
          channel: channel,
          count: mergedData.scripts.length, 
          calendarCount: (mergedData.calendarEvents || []).length,
          data: mergedData,
          updatedAt: syncObj.updatedAt 
        });
      }
      return res.status(400).json({ error: 'Invalid payload structure' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    if (channelsState[channel] && channelsState[channel].data) {
      return res.status(200).json(channelsState[channel].data);
    }

    try {
      if (fs.existsSync(tmpFilePath)) {
        const tmpRaw = fs.readFileSync(tmpFilePath, 'utf8');
        const parsed = JSON.parse(tmpRaw);
        if (parsed && parsed.data) {
          channelsState[channel] = parsed;
          return res.status(200).json(parsed.data);
        }
      }
    } catch (e) {}

    try {
      const syncPathFile = path.join(process.cwd(), 'sync-data.json');
      if (fs.existsSync(syncPathFile)) {
        const fileContent = fs.readFileSync(syncPathFile, 'utf8');
        const staticData = JSON.parse(fileContent);
        channelsState[channel] = { data: staticData, updatedAt: staticData.updatedAt };
        return res.status(200).json(staticData);
      }
    } catch (e) {}

    return res.status(200).json(DEFAULT_INITIAL_DATA);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
