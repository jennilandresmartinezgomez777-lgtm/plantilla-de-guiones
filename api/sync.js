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
      "id": "script-andres-presentacion",
      "client": "Jennil",
      "number": 1,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Andrés",
      "ideaGanadora": "Presentación y Autoridad - Quién soy y Cómo funciona el Método",
      "linkReferencia": "",
      "gancho": "Hola, soy Andrés. Si estás cansado de intentar métodos que no dan resultados y quieres aprender un sistema real para escalar tus ingresos y dominar el mercado, esto es para ti.",
      "historia": "Durante años he desarrollado y perfeccionado una metodología práctica para que cualquier persona, sin importar su punto de partida, pueda tener un sistema claro de toma de decisiones.\n\nNo se trata de suerte ni de fórmulas mágicas: es estructura, disciplina, herramientas profesionales y acompañamiento en vivo.",
      "moraleja": "El éxito no llega por casualidad, llega cuando sigues un vehículo probado con las personas correctas.",
      "cta": "Comenta la palabra BLEX o escríbeme por interno para acceder a la clase gratuita donde te muestro el paso a paso.",
      "contextoAdicional": "Grabación en setup profesional / oficina",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-16T02:57:11.733Z",
      "createdAt": "2026-09-15T00:00:00.000Z"
    },
    {
      "id": "script-trabajar-duro",
      "client": "Jennil",
      "number": 2,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VIRAL",
      "actor": "Andrés",
      "ideaGanadora": "Mentalidad & Apalancamiento - El Mito de Trabajar Duro",
      "linkReferencia": "",
      "gancho": "Si trabajar duro fuera el secreto para hacerte rico, los obreros de construcción que trabajan 14 horas al día bajo el sol serían los más millonarios del mundo.",
      "historia": "El trabajo duro sin dirección solo te deja exhausto. Los que realmente multiplican sus ingresos no trabajan más horas: se apalancan en sistemas, tecnología y decisiones inteligentes.\n\nMientras unos siguen intercambiando tiempo por dinero, otros construyen vehículos que trabajan para ellos las 24 horas.",
      "moraleja": "No trabajes más duro, trabaja con apalancamiento y con el sistema correcto.",
      "cta": "Comenta la palabra SISTEMA y te muestro el método exacto con el que puedes empezar a transformar tus resultados hoy.",
      "contextoAdicional": "Tomas dinámicas con transiciones y b-rolls de alto impacto",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-16T02:57:11.734Z",
      "createdAt": "2026-09-15T01:00:00.000Z"
    },
    {
      "id": "script-no-importa-nivel",
      "client": "Jennil",
      "number": 3,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Jennil / Andrés",
      "ideaGanadora": "Venta - Casos de Éxito y Metodología desde Cero",
      "linkReferencia": "",
      "gancho": "No importa cuál sea el nivel de conocimiento que tengas, con nosotros podrás aprender desde cero toda la metodología aplicada que utilizaron nuestros alumnos Mabel, Asceineth, Jeison, Tomás, Deysi y Andrés.",
      "historia": "Obtendrás metodología y entorno propio de análisis para que aprendas a tomar tus propias decisiones sin depender de nadie.\n- Plataforma con herramientas exclusivas\n- Sala operativa en vivo 4 veces por semana\n- Acompañamiento personalizado y estrategias rentables\n- Algoritmos entrenados con IA y mucho más.",
      "moraleja": "Aprender un sistema probado es la diferencia entre improvisar y tener resultados consistentes.",
      "cta": "Si quieres tener resultados y mejorar tus ingresos mientras haces lo que amas, escribe la palabra CAMBIO, te ayudaré y te mostraré cómo lograrlo.",
      "contextoAdicional": "PRUEBAS VIDEOS CORTOS (VARIOS)",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-16T02:57:11.734Z",
      "createdAt": "2026-09-15T03:31:24.089Z"
    }
  ],
  "deletedScripts": [],
  "notes": {
    "Jennil": [
      {
        "id": "note-1789526538592",
        "title": "Reel finalizado con estrategias, ga...",
        "content": "Reel finalizado con estrategias, ganchos y enseñanzas sobre inversión inmobiliaria. Preparado para publicación.",
        "client": "Jennil",
        "date": "2026-09-16T02:42:18.592Z"
      }
    ],
    "Natalia": []
  },
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
    },
    {
      "id": "cal-1789526538576",
      "client": "Jennil",
      "type": "RODAJE",
      "title": "Rodaje de Reels sobre Inversión Inmobiliaria",
      "date": "2026-09-15",
      "time": "15:00",
      "platform": "Instagram",
      "status": "PROGRAMADO",
      "reminder": "exact",
      "notes": "Agendado automáticamente por BLEX IA",
      "createdAt": "2026-09-16T02:42:18.576Z"
    }
  ],
  "viralEvaluations": [],
  "notificationEmails": {
    "primary": "",
    "secondary": ""
  },
  "aiBrain": {
    "Jennil": {
      "tone": "Seguridad absoluta, directo, enérgico, sin rodeos ni tecnicismos aburridos. Hablarle a un amigo que necesita despertar financieramente.",
      "audience": "Emprendedores, inversionistas y personas de 20 a 45 años que buscan libertad financiera, multiplicar ingresos y evitar las trampas del sistema tradicional.",
      "keywords": "activos, libertad financiera, apalancamiento, mentalidad, retención, sistema, velocidad del dinero",
      "forbidden": "dinero fácil, fórmula mágica, suerte, estafa, hacerse rico de la noche a la mañana",
      "notes": "Enfoque en crear sistemas de negocio, salir de deudas malas, invertir en activos y construir fuentes de ingresos sostenibles.",
      "examples": "[GANCHO] Si tienes menos de $1,000 en el banco, no hagas esto...\n[HISTORIA] El 90% de la gente piensa que ahorrar es suficiente...\n[MORALEJA] El dinero que no se mueve, pierde valor cada día...\n[CTA] Comenta 'SISTEMA' y te muestro el paso a paso.",
      "docs": []
    }
  },
  "challengeStartDate": "2026-09-13",
  "updatedAt": "2026-09-16T02:57:11.734Z",
  "snapshots": [
    {
      "id": "snap-1789527431748",
      "timestamp": "2026-09-16T02:57:11.734Z",
      "dateFormatted": "15/9/2026, 9:57:11 p. m.",
      "trigger": "Punto de Restauración Maestro (3 Guiones Activos)",
      "scriptsCount": 3,
      "notesCount": 1,
      "eventsCount": 3,
      "summary": "3 Guiones (#1 Presentación, #2 Mentalidad, #3 Venta), 3 Eventos, 1 Nota",
      "scriptsPreview": [
        {
          "number": 1,
          "title": "Presentación y Autoridad - Quién soy y Cómo funciona el Método",
          "client": "Jennil",
          "status": "Por Grabar"
        },
        {
          "number": 2,
          "title": "Mentalidad & Apalancamiento - El Mito de Trabajar Duro",
          "client": "Jennil",
          "status": "Por Grabar"
        },
        {
          "number": 3,
          "title": "Venta - Casos de Éxito y Metodología desde Cero",
          "client": "Jennil",
          "status": "Por Grabar"
        }
      ],
      "data": {
        "clients": [
          "Jennil",
          "Natalia"
        ],
        "scripts": [
          {
            "id": "script-andres-presentacion",
            "client": "Jennil",
            "number": 1,
            "status": "Por Grabar",
            "formato": "Hablando a cámara",
            "objetivo": "VENTA",
            "actor": "Andrés",
            "ideaGanadora": "Presentación y Autoridad - Quién soy y Cómo funciona el Método",
            "linkReferencia": "",
            "gancho": "Hola, soy Andrés. Si estás cansado de intentar métodos que no dan resultados y quieres aprender un sistema real para escalar tus ingresos y dominar el mercado, esto es para ti.",
            "historia": "Durante años he desarrollado y perfeccionado una metodología práctica para que cualquier persona, sin importar su punto de partida, pueda tener un sistema claro de toma de decisiones.\n\nNo se trata de suerte ni de fórmulas mágicas: es estructura, disciplina, herramientas profesionales y acompañamiento en vivo.",
            "moraleja": "El éxito no llega por casualidad, llega cuando sigues un vehículo probado con las personas correctas.",
            "cta": "Comenta la palabra BLEX o escríbeme por interno para acceder a la clase gratuita donde te muestro el paso a paso.",
            "contextoAdicional": "Grabación en setup profesional / oficina",
            "attachments": [],
            "views": 0,
            "comments": 0,
            "rating": 0,
            "completed": false,
            "espacio": "",
            "updatedAt": "2026-09-16T02:57:11.733Z",
            "createdAt": "2026-09-15T00:00:00.000Z"
          },
          {
            "id": "script-trabajar-duro",
            "client": "Jennil",
            "number": 2,
            "status": "Por Grabar",
            "formato": "Hablando a cámara",
            "objetivo": "VIRAL",
            "actor": "Andrés",
            "ideaGanadora": "Mentalidad & Apalancamiento - El Mito de Trabajar Duro",
            "linkReferencia": "",
            "gancho": "Si trabajar duro fuera el secreto para hacerte rico, los obreros de construcción que trabajan 14 horas al día bajo el sol serían los más millonarios del mundo.",
            "historia": "El trabajo duro sin dirección solo te deja exhausto. Los que realmente multiplican sus ingresos no trabajan más horas: se apalancan en sistemas, tecnología y decisiones inteligentes.\n\nMientras unos siguen intercambiando tiempo por dinero, otros construyen vehículos que trabajan para ellos las 24 horas.",
            "moraleja": "No trabajes más duro, trabaja con apalancamiento y con el sistema correcto.",
            "cta": "Comenta la palabra SISTEMA y te muestro el método exacto con el que puedes empezar a transformar tus resultados hoy.",
            "contextoAdicional": "Tomas dinámicas con transiciones y b-rolls de alto impacto",
            "attachments": [],
            "views": 0,
            "comments": 0,
            "rating": 0,
            "completed": false,
            "espacio": "",
            "updatedAt": "2026-09-16T02:57:11.734Z",
            "createdAt": "2026-09-15T01:00:00.000Z"
          },
          {
            "id": "script-no-importa-nivel",
            "client": "Jennil",
            "number": 3,
            "status": "Por Grabar",
            "formato": "Hablando a cámara",
            "objetivo": "VENTA",
            "actor": "Jennil / Andrés",
            "ideaGanadora": "Venta - Casos de Éxito y Metodología desde Cero",
            "linkReferencia": "",
            "gancho": "No importa cuál sea el nivel de conocimiento que tengas, con nosotros podrás aprender desde cero toda la metodología aplicada que utilizaron nuestros alumnos Mabel, Asceineth, Jeison, Tomás, Deysi y Andrés.",
            "historia": "Obtendrás metodología y entorno propio de análisis para que aprendas a tomar tus propias decisiones sin depender de nadie.\n- Plataforma con herramientas exclusivas\n- Sala operativa en vivo 4 veces por semana\n- Acompañamiento personalizado y estrategias rentables\n- Algoritmos entrenados con IA y mucho más.",
            "moraleja": "Aprender un sistema probado es la diferencia entre improvisar y tener resultados consistentes.",
            "cta": "Si quieres tener resultados y mejorar tus ingresos mientras haces lo que amas, escribe la palabra CAMBIO, te ayudaré y te mostraré cómo lograrlo.",
            "contextoAdicional": "PRUEBAS VIDEOS CORTOS (VARIOS)",
            "attachments": [],
            "views": 0,
            "comments": 0,
            "rating": 0,
            "completed": false,
            "espacio": "",
            "updatedAt": "2026-09-16T02:57:11.734Z",
            "createdAt": "2026-09-15T03:31:24.089Z"
          }
        ],
        "deletedScripts": [],
        "notes": {
          "Jennil": [
            {
              "id": "note-1789526538592",
              "title": "Reel finalizado con estrategias, ga...",
              "content": "Reel finalizado con estrategias, ganchos y enseñanzas sobre inversión inmobiliaria. Preparado para publicación.",
              "client": "Jennil",
              "date": "2026-09-16T02:42:18.592Z"
            }
          ],
          "Natalia": []
        },
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
          },
          {
            "id": "cal-1789526538576",
            "client": "Jennil",
            "type": "RODAJE",
            "title": "Rodaje de Reels sobre Inversión Inmobiliaria",
            "date": "2026-09-15",
            "time": "15:00",
            "platform": "Instagram",
            "status": "PROGRAMADO",
            "reminder": "exact",
            "notes": "Agendado automáticamente por BLEX IA",
            "createdAt": "2026-09-16T02:42:18.576Z"
          }
        ],
        "viralEvaluations": [],
        "notificationEmails": {
          "primary": "",
          "secondary": ""
        },
        "aiBrain": {
          "Jennil": {
            "tone": "Seguridad absoluta, directo, enérgico, sin rodeos ni tecnicismos aburridos. Hablarle a un amigo que necesita despertar financieramente.",
            "audience": "Emprendedores, inversionistas y personas de 20 a 45 años que buscan libertad financiera, multiplicar ingresos y evitar las trampas del sistema tradicional.",
            "keywords": "activos, libertad financiera, apalancamiento, mentalidad, retención, sistema, velocidad del dinero",
            "forbidden": "dinero fácil, fórmula mágica, suerte, estafa, hacerse rico de la noche a la mañana",
            "notes": "Enfoque en crear sistemas de negocio, salir de deudas malas, invertir en activos y construir fuentes de ingresos sostenibles.",
            "examples": "[GANCHO] Si tienes menos de $1,000 en el banco, no hagas esto...\n[HISTORIA] El 90% de la gente piensa que ahorrar es suficiente...\n[MORALEJA] El dinero que no se mueve, pierde valor cada día...\n[CTA] Comenta 'SISTEMA' y te muestro el paso a paso.",
            "docs": []
          }
        },
        "challengeStartDate": "2026-09-13",
        "updatedAt": "2026-09-16T02:57:11.734Z"
      }
    }
  ]
};

function deduplicateScripts(scripts) {
  if (!Array.isArray(scripts)) return [];
  const seenIds = new Set();
  const seenFingerprints = new Set();
  const result = [];
  for (const s of scripts) {
    if (!s || typeof s !== 'object') continue;
    const id = String(s.id || '').trim();
    if (!id || seenIds.has(id)) continue;
    const fp = `${(s.client || 'Jennil').toLowerCase().trim()}|${(s.ideaGanadora || s.title || '').toLowerCase().trim()}|${(s.gancho || '').toLowerCase().trim().slice(0, 50)}`;
    if (fp.length > 5 && seenFingerprints.has(fp)) continue;
    seenIds.add(id);
    if (fp.length > 5) seenFingerprints.add(fp);
    result.push(s);
  }
  return result;
}

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || DEFAULT_INITIAL_DATA;
  if (!local || typeof local !== 'object') return remote || DEFAULT_INITIAL_DATA;

  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const localActiveMap = new Map();
  (local.scripts || []).forEach(s => {
    if (s && s.id) localActiveMap.set(String(s.id), s);
  });

  const deletedMap = new Map();
  (remote.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      const localActive = localActiveMap.get(String(s.id));
      const wasRestoredLocally = localActive && (!s.deletedAt || (localActive.updatedAt && localActive.updatedAt >= s.deletedAt));
      if (age < FIFTEEN_DAYS_MS && !wasRestoredLocally) {
        deletedMap.set(String(s.id), s);
      }
    }
  });

  (local.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      if (age < FIFTEEN_DAYS_MS && !localActiveMap.has(String(s.id))) {
        deletedMap.set(String(s.id), s);
      }
    }
  });

  const mergedDeletedScripts = Array.from(deletedMap.values());
  const deletedIdsSet = new Set(mergedDeletedScripts.map(s => String(s.id)));

  let mergedScripts = [];
  if (Array.isArray(local.scripts)) {
    mergedScripts = local.scripts.filter(s => s && s.id && !deletedIdsSet.has(String(s.id)));
  } else {
    const scriptsMap = new Map();
    (remote.scripts || []).forEach(s => {
      if (s && s.id && !deletedIdsSet.has(String(s.id))) scriptsMap.set(String(s.id), s);
    });
    mergedScripts = Array.from(scriptsMap.values());
  }

  const calMap = new Map();
  (remote.calendarEvents || []).forEach(c => { if (c) calMap.set(String(c.id || (c.date + '_' + c.title)), c); });
  (local.calendarEvents || []).forEach(c => { if (c) calMap.set(String(c.id || (c.date + '_' + c.title)), c); });

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
    rNotes.forEach(n => { notesMap.set(typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n)), n); });
    lNotes.forEach(n => { notesMap.set(typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n)), n); });
    mergedNotes[c] = Array.from(notesMap.values());
  });

  // Merge snapshots (keep latest 20)
  const allSnapshots = [
    ...(local.snapshots || []),
    ...(remote.snapshots || [])
  ];
  const snapMap = new Map();
  allSnapshots.forEach(snap => {
    if (snap && snap.id) snapMap.set(String(snap.id), snap);
  });
  const mergedSnapshots = Array.from(snapMap.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  return {
    clients: mergedClients,
    scripts: deduplicateScripts(mergedScripts),
    deletedScripts: mergedDeletedScripts,
    notes: mergedNotes,
    calendarEvents: Array.from(calMap.values()),
    viralEvaluations: local.viralEvaluations || remote.viralEvaluations || [],
    notificationEmails: local.notificationEmails || remote.notificationEmails || { primary: 'jennilandresmartinezgomez777@gmail.com', secondary: 'ncolorado2511@outlook.com' },
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    snapshots: mergedSnapshots,
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

  // Load existing state
  let existing = channelsState[channel]?.data;
  if (!existing) {
    try {
      if (fs.existsSync(tmpFilePath)) {
        existing = JSON.parse(fs.readFileSync(tmpFilePath, 'utf8'))?.data;
      }
    } catch(e) {}
  }
  if (!existing) {
    try {
      const syncPathFile = path.join(process.cwd(), 'sync-data.json');
      if (fs.existsSync(syncPathFile)) {
        existing = JSON.parse(fs.readFileSync(syncPathFile, 'utf8'));
      }
    } catch (e) {}
  }
  if (!existing) existing = DEFAULT_INITIAL_DATA;

  // ACTION 1: GET SNAPSHOTS
  if (req.query && req.query.action === 'get_snapshots') {
    const snaps = existing.snapshots || [];
    return res.status(200).json({ success: true, snapshots: snaps });
  }

  // ACTION 2: RESTORE SNAPSHOT
  if (req.method === 'POST' && req.body && req.body.action === 'restore_snapshot') {
    const snapId = req.body.snapshotId;
    const snap = (existing.snapshots || []).find(s => s.id === snapId);
    if (!snap || !snap.data) {
      return res.status(404).json({ error: 'Snapshot not found' });
    }

    const restoredData = snap.data;
    restoredData.updatedAt = new Date().toISOString();
    
    // Create new snapshot indicating restore
    const restoreSnap = {
      id: "snap-" + Date.now(),
      timestamp: restoredData.updatedAt,
      dateFormatted: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: true }),
      trigger: "Restauración de versión (" + (snap.dateFormatted || snapId) + ")",
      scriptsCount: (restoredData.scripts || []).length,
      notesCount: Object.values(restoredData.notes || {}).flat().length,
      eventsCount: (restoredData.calendarEvents || []).length,
      summary: `${(restoredData.scripts || []).length} Guiones restaurados de ${snap.dateFormatted || snapId}`,
      scriptsPreview: (restoredData.scripts || []).map(s => ({
        number: s.number,
        title: s.ideaGanadora || s.title || 'Guión',
        client: s.client || 'Jennil',
        status: s.status || 'Por Grabar'
      })),
      data: JSON.parse(JSON.stringify(restoredData))
    };

    restoredData.snapshots = [restoreSnap, ...(existing.snapshots || [])].slice(0, 20);

    const syncObj = { data: restoredData, channel, updatedAt: restoredData.updatedAt };
    channelsState[channel] = syncObj;
    try { fs.writeFileSync(tmpFilePath, JSON.stringify(syncObj)); } catch (e) {}

    return res.status(200).json({ success: true, restored: true, data: restoredData, count: restoredData.scripts.length });
  }

  // NORMAL POST / PUT: SAVE STATE WITH SNAPSHOT
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);

      if (body && Array.isArray(body.scripts)) {
        let mergedData;
        if (body.forceOverwriteFile) {
          mergedData = body;
        } else {
          mergedData = mergeAppData(body, existing);
        }
        mergedData.updatedAt = body.updatedAt || new Date().toISOString();

        // Create snapshot record
        const dateFormatted = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: true });
        const triggerDesc = body.snapshotTrigger || (body.forceOverwriteFile ? "Subida Forzada y Respaldo" : "Sincronización en la Nube");
        
        const newSnapshot = {
          id: "snap-" + Date.now(),
          timestamp: mergedData.updatedAt,
          dateFormatted: dateFormatted,
          trigger: triggerDesc,
          scriptsCount: mergedData.scripts.length,
          notesCount: Object.values(mergedData.notes || {}).flat().length,
          eventsCount: (mergedData.calendarEvents || []).length,
          summary: `${mergedData.scripts.length} Guiones, ${(mergedData.calendarEvents || []).length} Eventos, ${Object.values(mergedData.notes || {}).flat().length} Notas`,
          scriptsPreview: mergedData.scripts.map(s => ({
            number: s.number,
            title: s.ideaGanadora || s.title || 'Guión',
            client: s.client || 'Jennil',
            status: s.status || 'Por Grabar'
          })),
          data: JSON.parse(JSON.stringify(mergedData))
        };

        const currentSnapshots = existing.snapshots || [];
        mergedData.snapshots = [newSnapshot, ...currentSnapshots.filter(s => s.id !== newSnapshot.id)].slice(0, 20);

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
          snapshots: mergedData.snapshots,
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
    return res.status(200).json(existing);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
