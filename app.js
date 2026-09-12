// Content & Script Studio - Core Application Logic

// 10 Sample Videos Pre-loaded for preview
const INITIAL_CLIENTS = ["Jennil", "Natalia"];

const INITIAL_SCRIPTS = [
  {
    id: "script-1",
    client: "Jennil",
    number: 1,
    completed: false,
    ideaGanadora: "¿Cuánto gastas al mes en Miami?",
    formato: "Formato entrevista",
    objetivo: "VENTA",
    gancho: "¿Cuánto gastas al mes en Miami?",
    historia: "Gasta 5000 dólares al mes entre casa coche, comida, hijos, ropa....\n\n¿Y lo pagas con Tarjeta de crédito o de Débito?\n- con tarjeta de débito",
    moraleja: "SI tu pagas con tarjeta de crédito te dan puntos para poder gastar en viajes y demás y REPORTA EN TU PUNTAJE DE CRÉDITO.",
    cta: "Escribe en comentarios la palabra crédito para mejorar tu puntaje.",
    actor: "Jennil",
    contextoAdicional: "Se graba Brickell Center",
    status: "Por Grabar",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-2",
    client: "Jennil",
    number: 2,
    completed: false,
    ideaGanadora: "Deja de pagar por tu tarjeta hasta que no hagas esto",
    formato: "Hablando a cámara",
    objetivo: "VENTA",
    gancho: "Deja de pagar por tu tarjeta hasta que no hagas esto",
    historia: "Ten cuidado con estas 3 cosas porque estás perdiendo mucho dinero con tus tarjetas y puede hasta bajar tu puntaje de crédito.\n\n1. Fecha de corte en la app del banco.\n2. Evita tarjetas de tiendas comerciales.\n3. Cuidado con adelantos de efectivo.",
    moraleja: "Corregir estos 3 errores te ahorrará miles de dólares al año y subirá tu puntaje rápidamente.",
    cta: "Escribe CREDITO en comentarios para recibir nuestra guía de reparación.",
    actor: "Jennil",
    contextoAdicional: "En oficina con pantalla de datos",
    status: "Redactado",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-3",
    client: "Natalia",
    number: 3,
    completed: true,
    ideaGanadora: "Cómo no engordar en navidad comiendo lo que quieras",
    formato: "Formato Vlog",
    objetivo: "SEGUIDORES",
    gancho: "Cómo no engordar en navidad comiendo lo que quieras",
    historia: "El año pasado este era yo el día 24 de diciembre y este era yo el día 7 de Enero después de 7 cenas de navidad. Exactamente la misma composición corporal.",
    moraleja: "La clave no es pasar hambre, es controlar los macros principales durante los días entre celebraciones.",
    cta: "Comenta NAVIDAD y te envío mi guía gratis de nutrición flexible.",
    actor: "Natalia",
    contextoAdicional: "en la cocina con comida de navidad encima",
    status: "Publicado",
    views: 45200,
    comments: 890,
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: "script-4",
    client: "Jennil",
    number: 4,
    completed: false,
    ideaGanadora: "3 Secretos para subir tu puntaje de crédito a 750 en 60 días",
    formato: "Formato Dinámico",
    objetivo: "AUTORIDAD",
    gancho: "Si tu crédito está en menos de 650, guarda este video inmediatamente.",
    historia: "El 80% de los reportes crediticios tienen errores que los bancos no quieren que borres. Aprende a disputar indagaciones no autorizadas y bajar tu nivel de utilización por debajo del 10%.",
    moraleja: "Un crédito alto te abre puertas a mejores préstamos y tasas de interés casi en cero.",
    cta: "Escribe SCORE para revisar tu reporte gratis.",
    actor: "Jennil",
    contextoAdicional: "Estudio de grabación con micro",
    status: "Por Grabar",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-5",
    client: "Jennil",
    number: 5,
    completed: false,
    ideaGanadora: "Lo que los bancos NO quieren que sepas sobre los intereses",
    formato: "Formato entrevista",
    objetivo: "VIRAL",
    gancho: "¿Sabías que pagar el mínimo de tu tarjeta te puede costar $15,000 extra?",
    historia: "Mostramos con manzana y plastilina cómo se calcula la tasa APR diaria y por qué el interés compuesto te deja atrapado durante años si solo pagas el mínimo.",
    moraleja: "Paga siempre el saldo total de tu estado de cuenta (statement balance) para pagar cero intereses.",
    cta: "Comenta BANCO y te enseño cómo exonerar comisiones de tu tarjeta.",
    actor: "Jennil",
    contextoAdicional: "En exteriores frente a banco",
    status: "Idea",
    linkReferencia: "https://www.instagram.com/reel/C-example123",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-6",
    client: "Natalia",
    number: 6,
    completed: false,
    ideaGanadora: "Mi rutina de 15 minutos para quemar grasa sin ir al gimnasio",
    formato: "Hablando a cámara",
    objetivo: "SEGUIDORES",
    gancho: "Haz estos 4 ejercicios desde tu sala si no tienes tiempo de entrenar.",
    historia: "Demostración rápida de HIIT corporal: Sentadillas con salto, zancadas dinámicas, flexiones y mountain climbers sin ningún equipamiento.",
    moraleja: "La consistencia de 15 minutos al día vence a 2 horas de gimnasio una vez al mes.",
    cta: "Comenta RUTINA para enviarte el cronograma completo de la semana.",
    actor: "Natalia",
    contextoAdicional: "Sala de casa, ropa deportiva",
    status: "Redactado",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-7",
    client: "Jennil",
    number: 7,
    completed: false,
    ideaGanadora: "¿Comprar casa con Crédito o con Dinero en Efectivo?",
    formato: "Formato entrevista",
    objetivo: "VENTA",
    gancho: "Comprar una casa en efectivo es el PEOR error financiero que puedes cometer.",
    historia: "Si gastas $300,000 en efectivo descapitalizas tu negocio. Con un buen crédito das solo el 3.5% o 5% de pago inicial y el resto lo financias a tasa baja invirtiendo el remanente.",
    moraleja: "Usa el dinero del banco para apalancarte y conservar tu liquidez.",
    cta: "Escribe CASA y evaluamos tu capacidad de compra hoy.",
    actor: "Jennil",
    contextoAdicional: "Frente a propiedad inmobiliaria",
    status: "Por Grabar",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-8",
    client: "Jennil",
    number: 8,
    completed: true,
    ideaGanadora: "Cómo eliminar marcas negativas de tu reporte de crédito legalmente",
    formato: "Formato pantalla verde",
    objetivo: "AUTORIDAD",
    gancho: "Te enseño la carta exacta respaldada por la ley FCRA para borrar colecciones.",
    historia: "Explicación del artículo de la Ley de Reportes Justos de Crédito que exige a las agencias verificar la deuda original en 30 días o eliminarla por completo.",
    moraleja: "Tienes derechos legales para limpiar tu historial financiero sin pagar a cobradores abusivos.",
    cta: "Escribe CARTA en comentarios y te mando la plantilla de disputa.",
    actor: "Jennil",
    contextoAdicional: "En escritorio escribiendo documento",
    status: "Publicado",
    views: 31200,
    comments: 450,
    rating: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: "script-9",
    client: "Natalia",
    number: 9,
    completed: false,
    ideaGanadora: "El error #1 que arruina tu progreso físico el fin de semana",
    formato: "Formato Vlog",
    objetivo: "SEGUIDORES",
    gancho: "Haces todo bien de Lunes a Viernes pero en 48 horas arruinas toda la semana...",
    historia: "Analizamos cómo 3 cócteles y 2 comidas tramposas sin medir aportan 3,500 calorías extra, anulando el déficit calórico de toda la semana de esfuerzo.",
    moraleja: "Disfruta el fin de semana de forma consciente sin destruir tus objetivos a largo plazo.",
    cta: "Comenta PLAN para estructurar tus fines de semana con equilibrio.",
    actor: "Natalia",
    contextoAdicional: "En restaurante / terraza",
    status: "Por Grabar",
    createdAt: new Date().toISOString()
  },
  {
    id: "script-10",
    client: "Jennil",
    number: 10,
    completed: true,
    ideaGanadora: "Caso de Éxito: De $2,000 a $50,000 en línea de crédito de negocios",
    formato: "Formato POV",
    objetivo: "VENTA",
    gancho: "Así fue como Carlos consiguió $50,000 a tasa 0% para su nuevo restaurante.",
    historia: "Mostramos el proceso de creación de LLC, estructuración de perfil de crédito corporativo y aprobación bancaria en menos de 45 días sin tocar su crédito personal.",
    moraleja: "El crédito de negocios no afecta tu crédito personal y escala tu empresa al siguiente nivel.",
    cta: "Comenta NEGOCIO si quieres estructurar tu crédito corporativo.",
    actor: "Jennil",
    contextoAdicional: "Oficina con el cliente Carlos",
    status: "Publicado",
    views: 24800,
    comments: 310,
    rating: 5,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_NOTES = {
  "Natalia": [
    {
      id: "note-nat-1",
      title: "Directrices de Marca y Tono",
      content: "• Tono cercano, empático y enérgico.\n• Enfocarse en recetas fáciles, balance calórico y consejos sin restricciones extremas.\n• Colores clave para props: tonos cálidos, cocina limpia e iluminada.",
      updatedAt: new Date().toISOString()
    },
    {
      id: "note-nat-2",
      title: "Ideas pendientes de validar",
      content: "• Qué comer antes y después de entrenar para hipertrofia.\n• Mitos sobre los carbohidratos en la noche.\n• 3 snacks de menos de 150 kcal para llevar al trabajo.",
      updatedAt: new Date().toISOString()
    }
  ],
  "Jennil": [
    {
      id: "note-jen-1",
      title: "Estrategia de Contenido Financiero",
      content: "• Siempre incluir llamado a la acción claro al final (ej: comentar SCORE o GUIA).\n• Mostrar capturas reales de apps bancarias (ocultando datos personales).\n• Mantener explicaciones simples de términos financieros (APR, Score, Buró).",
      updatedAt: new Date().toISOString()
    }
  ]
};

const INITIAL_VIRAL_EVALUATIONS = [
  {
    id: "viral-1",
    title: "¿Cuánto gastas al mes en Miami?",
    client: "Jennil",
    link: "",
    criteria: {
      nino: true,
      cincuenta: true,
      refViral: true,
      mercadoViral: true,
      tendencia: false,
      controversia: true
    },
    format: "Formato entrevista",
    criteriaScore: 8.5,
    formatScore: 3.0,
    totalScore: 11.5,
    potential: "Muy Alto / Viral",
    createdAt: new Date().toISOString()
  },
  {
    id: "viral-2",
    title: "Deja de pagar por tu tarjeta hasta que no hagas esto",
    client: "Jennil",
    link: "",
    criteria: {
      nino: false,
      cincuenta: true,
      refViral: true,
      mercadoViral: true,
      tendencia: false,
      controversia: false
    },
    format: "Formato entrevista",
    criteriaScore: 5.0,
    formatScore: 3.0,
    totalScore: 8.0,
    potential: "Medio",
    createdAt: new Date().toISOString()
  },
  {
    id: "viral-3",
    title: "Cómo no engordar en navidad comiendo lo que quieras",
    client: "Natalia",
    link: "",
    criteria: {
      nino: true,
      cincuenta: true,
      refViral: false,
      mercadoViral: true,
      tendencia: true,
      controversia: true
    },
    format: "Formato Vlog",
    criteriaScore: 8.0,
    formatScore: 4.0,
    totalScore: 12.0,
    potential: "Muy Alto / Viral",
    createdAt: new Date().toISOString()
  },
  {
    id: "viral-4",
    title: "3 Secretos para conseguir $1,000 en 30 días",
    client: "Jennil",
    link: "",
    criteria: {
      nino: true,
      cincuenta: true,
      refViral: true,
      mercadoViral: true,
      tendencia: false,
      controversia: false
    },
    format: "Formato POV",
    criteriaScore: 7.5,
    formatScore: 4.5,
    totalScore: 12.0,
    potential: "Muy Alto / Viral",
    createdAt: new Date().toISOString()
  },
  {
    id: "viral-5",
    title: "Estrategia de contenido y crecimiento",
    client: "Natalia",
    link: "",
    criteria: {
      nino: false,
      cincuenta: true,
      refViral: true,
      mercadoViral: true,
      tendencia: false,
      controversia: false
    },
    format: "Hablando a cámara",
    criteriaScore: 5.0,
    formatScore: 1.0,
    totalScore: 6.0,
    potential: "Bajo",
    createdAt: new Date().toISOString()
  }
];

// STATE
const savedClients = JSON.parse(localStorage.getItem('css_clients'));
const savedScripts = JSON.parse(localStorage.getItem('css_scripts'));
const savedNotes = JSON.parse(localStorage.getItem('css_notes'));
const savedViralEvals = JSON.parse(localStorage.getItem('css_viral_evaluations'));

let state = {
  clients: (savedClients && savedClients.length > 0) ? savedClients : INITIAL_CLIENTS,
  scripts: (savedScripts && savedScripts.length > 0) ? savedScripts : INITIAL_SCRIPTS,
  notes: (savedNotes && typeof savedNotes === 'object') ? savedNotes : INITIAL_NOTES,
  viralEvaluations: (savedViralEvals && Array.isArray(savedViralEvals)) ? savedViralEvals : INITIAL_VIRAL_EVALUATIONS,
  activeClient: 'ALL',
  activeStatus: 'ALL',
  searchQuery: '',
  currentView: 'matrix', // Default is MATRIX
  editingScriptId: null,
  activeNotesClient: (savedClients && savedClients.length > 0) ? savedClients[0] : INITIAL_CLIENTS[0]
};

// Auto-sanitize legacy saved data to purge any traces of USACREDITO
if (state.clients.includes("USACREDITO")) {
  state.clients = state.clients.filter(c => c !== "USACREDITO");
  if (state.clients.length === 0) state.clients = ["Jennil", "Natalia"];
}
if (state.scripts && Array.isArray(state.scripts)) {
  state.scripts = state.scripts.map(s => {
    if (s.client === "USACREDITO") {
      return { ...s, client: "Jennil", actor: (s.actor === "Ramón" ? "Jennil" : s.actor) };
    }
    return s;
  });
}
if (state.notes && state.notes["USACREDITO"]) {
  delete state.notes["USACREDITO"];
}
if (state.viralEvaluations && Array.isArray(state.viralEvaluations)) {
  state.viralEvaluations = state.viralEvaluations.map(v => {
    if (v.client === "USACREDITO") {
      return { ...v, client: "Jennil" };
    }
    return v;
  });
}
if (state.activeNotesClient === "USACREDITO" || !state.activeNotesClient) {
  state.activeNotesClient = state.clients[0] || "Jennil";
}
try {
  localStorage.setItem('css_clients', JSON.stringify(state.clients));
  localStorage.setItem('css_scripts', JSON.stringify(state.scripts));
  localStorage.setItem('css_notes', JSON.stringify(state.notes));
  localStorage.setItem('css_viral_evaluations', JSON.stringify(state.viralEvaluations));
} catch (e) {
  console.warn("Storage sync failed:", e);
}

// PRINT SELECTION STATE
let printSelectedIds = new Set();

// DOM ELEMENTS
const clientFilterSelect = document.getElementById('clientFilter');
const statusFilterSelect = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');

const tabViralCalc = document.getElementById('tabViralCalc');
const tabCards = document.getElementById('tabCards');
const tabMatrix = document.getElementById('tabMatrix');
const tabTeleprompter = document.getElementById('tabTeleprompter');

const viewViralCalc = document.getElementById('viewViralCalc');
const viewCards = document.getElementById('viewCards');
const viewMatrix = document.getElementById('viewMatrix');
const viewTeleprompter = document.getElementById('viewTeleprompter');
const emptyState = document.getElementById('emptyState');

const cardsGrid = document.getElementById('cardsGrid');
const matrixTableBody = document.getElementById('matrixTableBody');
const matrixCounter = document.getElementById('matrixCounter');
const btnClearAllScripts = document.getElementById('btnClearAllScripts');

const teleprompterSelect = document.getElementById('teleprompterSelect');
const teleprompterDisplay = document.getElementById('teleprompterDisplay');

// Modals
const scriptModal = document.getElementById('scriptModal');
const modalTitle = document.getElementById('modalTitle');
const scriptForm = document.getElementById('scriptForm');
const btnNewScript = document.getElementById('btnNewScript');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');

// Quick Idea Modal elements
const quickIdeaModal = document.getElementById('quickIdeaModal');
const quickIdeaForm = document.getElementById('quickIdeaForm');
const btnQuickIdea = document.getElementById('btnQuickIdea');
const cardStatIdea = document.getElementById('cardStatIdea');
const btnCloseQuickIdeaModal = document.getElementById('btnCloseQuickIdeaModal');
const btnCancelQuickIdeaModal = document.getElementById('btnCancelQuickIdeaModal');
const quickIdeaClient = document.getElementById('quickIdeaClient');
const quickIdeaTitle = document.getElementById('quickIdeaTitle');
const quickIdeaLink = document.getElementById('quickIdeaLink');
const quickIdeaNotes = document.getElementById('quickIdeaNotes');

// Client Modal elements
const clientModal = document.getElementById('clientModal');
const btnNewClient = document.getElementById('btnNewClient');
const btnSaveClient = document.getElementById('btnSaveClient');
const btnCancelClientModal = document.getElementById('btnCancelClientModal');
const btnCloseClientModal = document.getElementById('btnCloseClientModal');
const newClientNameInput = document.getElementById('newClientNameInput');
const clientsManageList = document.getElementById('clientsManageList');

// Print Modal elements
const printModal = document.getElementById('printModal');
const btnClosePrintModal = document.getElementById('btnClosePrintModal');
const btnCancelPrintModal = document.getElementById('btnCancelPrintModal');
const btnExecutePrint = document.getElementById('btnExecutePrint');
const btnSelectAllPrint = document.getElementById('btnSelectAllPrint');
const btnDeselectAllPrint = document.getElementById('btnDeselectAllPrint');
const printScriptsList = document.getElementById('printScriptsList');
const printSelectionCounter = document.getElementById('printSelectionCounter');

const btnPrint = document.getElementById('btnPrint');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnImportJSON = document.getElementById('btnImportJSON');
const importFileInput = document.getElementById('importFileInput');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderClientSelect();
  renderAll();
  calculateViralScore();
  renderViralHistoryTable();
  setupEventListeners();
  refreshLucideIcons();
});

function saveState() {
  localStorage.setItem('css_clients', JSON.stringify(state.clients));
  localStorage.setItem('css_scripts', JSON.stringify(state.scripts));
  localStorage.setItem('css_notes', JSON.stringify(state.notes));
  localStorage.setItem('css_viral_evaluations', JSON.stringify(state.viralEvaluations));
}

function refreshLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// RENDER HELPERS
function getFilteredScripts() {
  const filtered = state.scripts.filter(script => {
    if (state.activeClient !== 'ALL' && script.client !== state.activeClient) {
      return false;
    }
    if (state.activeStatus !== 'ALL' && script.status !== state.activeStatus) {
      return false;
    }
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      const matchIdea = script.ideaGanadora.toLowerCase().includes(q);
      const matchGancho = script.gancho.toLowerCase().includes(q);
      const matchHistoria = script.historia.toLowerCase().includes(q);
      const matchActor = (script.actor || '').toLowerCase().includes(q);
      const matchClient = (script.client || '').toLowerCase().includes(q);
      if (!matchIdea && !matchGancho && !matchHistoria && !matchActor && !matchClient) {
        return false;
      }
    }
    return true;
  });

  // Always sort numerically ascending: 1, 2, 3, 4, 5...
  return filtered.sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
}

function filterByStatusFromCard(status) {
  if (state.activeStatus === status && status !== 'ALL') {
    state.activeStatus = 'ALL';
  } else {
    state.activeStatus = status;
  }
  if (statusFilterSelect) {
    statusFilterSelect.value = state.activeStatus;
  }
  renderAll();
}

function populateActorOptions(selectedActor = '') {
  const formActor = document.getElementById('formActor');
  if (!formActor) return;

  const options = [];
  options.push('<option value="">Seleccionar Actor / Talento</option>');

  state.clients.forEach(c => {
    options.push(`<option value="${c}">👤 ${c}</option>`);
  });

  if (selectedActor && selectedActor !== 'Otros' && !state.clients.includes(selectedActor)) {
    options.push(`<option value="${selectedActor}">👤 ${selectedActor}</option>`);
  }

  options.push('<option value="Otros">👤 Otros</option>');

  formActor.innerHTML = options.join('');

  if (selectedActor) {
    formActor.value = selectedActor;
  }
}

function populateViralClientSelect() {
  const viralSelect = document.getElementById('viralIdeaClient');
  if (!viralSelect) return;
  const currentVal = viralSelect.value;
  viralSelect.innerHTML = state.clients.map(c => `<option value="${c}">👤 ${c}</option>`).join('');
  if (currentVal && state.clients.includes(currentVal)) {
    viralSelect.value = currentVal;
  }
}

function renderClientSelect() {
  clientFilterSelect.innerHTML = `<option value="ALL">🏢 Todos los Clientes</option>`;
  state.clients.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `🏢 ${c}`;
    clientFilterSelect.appendChild(opt);
  });
  clientFilterSelect.value = state.clients.includes(state.activeClient) ? state.activeClient : 'ALL';
  populateActorOptions();
  populateViralClientSelect();
}

function renderAll() {
  const filtered = getFilteredScripts();
  const baseScriptsForStats = state.activeClient === 'ALL' 
    ? state.scripts 
    : state.scripts.filter(s => s.client === state.activeClient);

  // Update 7 Status Counters
  if (document.getElementById('statTotal')) document.getElementById('statTotal').textContent = baseScriptsForStats.length;
  if (document.getElementById('statIdea')) document.getElementById('statIdea').textContent = baseScriptsForStats.filter(s => s.status === 'Idea').length;
  if (document.getElementById('statRedactados')) document.getElementById('statRedactados').textContent = baseScriptsForStats.filter(s => s.status === 'Redactado').length;
  if (document.getElementById('statPorGrabar')) document.getElementById('statPorGrabar').textContent = baseScriptsForStats.filter(s => s.status === 'Por Grabar').length;
  if (document.getElementById('statEnEdicion')) document.getElementById('statEnEdicion').textContent = baseScriptsForStats.filter(s => s.status === 'En Edición').length;
  if (document.getElementById('statEditado')) document.getElementById('statEditado').textContent = baseScriptsForStats.filter(s => s.status === 'Editado').length;
  if (document.getElementById('statPublicados')) document.getElementById('statPublicados').textContent = baseScriptsForStats.filter(s => s.completed || s.status === 'Publicado').length;

  highlightActiveStatCard();

  const completedCount = baseScriptsForStats.filter(s => s.completed || s.status === 'Publicado').length;
  if (matrixCounter) {
    matrixCounter.textContent = `${filtered.length} video${filtered.length === 1 ? '' : 's'} (${completedCount} listos)`;
  }

  if (filtered.length === 0) {
    cardsGrid.classList.add('hidden');
    viewMatrix.querySelector('table').classList.add('hidden');
    emptyState.classList.remove('hidden');

    const emptyTitle = document.getElementById('emptyStateTitle');
    const emptyText = document.getElementById('emptyStateText');

    if (state.activeStatus !== 'ALL') {
      if (emptyTitle) emptyTitle.textContent = `No hay videos en estado "${state.activeStatus}"`;
      if (emptyText) emptyText.textContent = `Actualmente no hay guiones en estado "${state.activeStatus}". Haz clic en 'Mostrar Todos los Guiones' o cambia el estado de un video en la matriz.`;
    } else {
      if (emptyTitle) emptyTitle.textContent = `No se encontraron guiones`;
      if (emptyText) emptyText.textContent = `No hay guiones registrados con los filtros seleccionados. Crea uno nuevo o limpia la búsqueda.`;
    }
  } else {
    cardsGrid.classList.remove('hidden');
    viewMatrix.querySelector('table').classList.remove('hidden');
    emptyState.classList.add('hidden');
  }

  renderPublishedAnalyticsPanel();
  renderMatrixView(filtered);
  renderCardsView(filtered);
  renderTeleprompterView(filtered);
  refreshLucideIcons();
}

// PUBLISHED METRICS & ANALYTICS HELPERS
function formatCompactNumber(num) {
  num = parseInt(num) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function renderInteractiveStars(scriptId, currentRating) {
  currentRating = parseInt(currentRating) || 0;
  let html = '<div class="flex items-center gap-0.5 inline-flex" title="Calificación (1-5 Estrellas)">';
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= currentRating;
    const clickHandler = scriptId ? `onclick="event.stopPropagation(); updateScriptMetrics('${scriptId}', 'rating', ${i})"` : '';
    html += `
      <button type="button" ${clickHandler} class="text-xs transition cursor-pointer ${isFilled ? 'text-amber-400 font-bold scale-110' : 'text-slate-600 hover:text-amber-300'}">
        ★
      </button>
    `;
  }
  html += '</div>';
  return html;
}

function updateScriptMetrics(scriptId, metricKey, value) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;

  script[metricKey] = parseInt(value) || 0;
  saveState();
  renderAll();
}

function renderPublishedAnalyticsPanel() {
  const container = document.getElementById('publishedAnalyticsContainer');
  if (!container) return;

  const publishedScripts = state.scripts.filter(s => s.status === 'Publicado' || s.completed);

  if (publishedScripts.length === 0 || state.activeStatus !== 'Publicado') {
    container.innerHTML = '';
    return;
  }

  const totalViews = publishedScripts.reduce((sum, s) => sum + (parseInt(s.views) || 0), 0);
  const totalComments = publishedScripts.reduce((sum, s) => sum + (parseInt(s.comments) || 0), 0);
  const ratedScripts = publishedScripts.filter(s => (parseInt(s.rating) || 0) > 0);
  const avgRating = ratedScripts.length > 0 
    ? (ratedScripts.reduce((sum, s) => sum + parseInt(s.rating), 0) / ratedScripts.length)
    : 0;

  // Aggregate stats by format
  const formatStats = {};
  publishedScripts.forEach(s => {
    const fmt = (s.formato || 'REEL').toUpperCase();
    if (!formatStats[fmt]) {
      formatStats[fmt] = { name: fmt, count: 0, views: 0, ratingSum: 0, ratingCount: 0 };
    }
    formatStats[fmt].count += 1;
    formatStats[fmt].views += parseInt(s.views) || 0;
    if (parseInt(s.rating) > 0) {
      formatStats[fmt].ratingSum += parseInt(s.rating);
      formatStats[fmt].ratingCount += 1;
    }
  });

  const formatList = Object.values(formatStats).map(f => ({
    ...f,
    avgViews: f.count > 0 ? f.views / f.count : 0,
    avgRating: f.ratingCount > 0 ? f.ratingSum / f.ratingCount : 0
  })).sort((a, b) => b.avgViews - a.avgViews);

  const topFormat = formatList[0] || { name: 'N/A', avgViews: 0, avgRating: 0 };
  const topVideos = [...publishedScripts].sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0)).slice(0, 3);

  container.innerHTML = `
    <div class="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4 mb-4">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <i data-lucide="trending-up" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-white text-base">📊 Rendimiento & Análisis de Videos Publicados</h3>
            <p class="text-xs text-slate-400">Identifica los mejores formatos, interacciones y calificaciones de tus contenidos.</p>
          </div>
        </div>
        <span class="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          🚀 ${publishedScripts.length} Video${publishedScripts.length === 1 ? '' : 's'} Publicado${publishedScripts.length === 1 ? '' : 's'}
        </span>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <span class="text-[11px] font-semibold text-slate-400 block">👁️ Visualizaciones</span>
          <span class="text-xl font-extrabold text-emerald-300 block mt-0.5">${formatCompactNumber(totalViews)}</span>
          <span class="text-[10px] text-slate-500 block mt-0.5">Prom: ${formatCompactNumber(publishedScripts.length ? Math.round(totalViews / publishedScripts.length) : 0)} / video</span>
        </div>

        <div class="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <span class="text-[11px] font-semibold text-slate-400 block">💬 Comentarios</span>
          <span class="text-xl font-extrabold text-sky-300 block mt-0.5">${formatCompactNumber(totalComments)}</span>
          <span class="text-[10px] text-slate-500 block mt-0.5">Prom: ${formatCompactNumber(publishedScripts.length ? Math.round(totalComments / publishedScripts.length) : 0)} / video</span>
        </div>

        <div class="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <span class="text-[11px] font-semibold text-slate-400 block">⭐ Rating Promedio</span>
          <span class="text-xl font-extrabold text-amber-300 block mt-0.5">${avgRating > 0 ? avgRating.toFixed(1) + ' / 5.0' : 'Sin calificar'}</span>
          <span class="text-[10px] text-amber-400 block mt-0.5">${renderInteractiveStars('', Math.round(avgRating))}</span>
        </div>

        <div class="bg-slate-950/70 border border-amber-500/30 p-3 rounded-xl bg-amber-500/5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">🏆 Formato #1 Ganador</span>
          <span class="text-sm font-extrabold text-white block mt-1 truncate">${topFormat.name}</span>
          <span class="text-[10px] font-medium text-amber-300 block mt-0.5">${topFormat.avgViews ? formatCompactNumber(topFormat.avgViews) + ' vistas prom.' : 'Sin datos'}</span>
        </div>
      </div>

      <!-- Top Videos Summary -->
      ${topVideos.length > 0 ? `
      <div class="pt-2 border-t border-slate-800/60">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">🔥 Top Ideas Ganadoras por Vistas & Valoración</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${topVideos.map((v, i) => `
            <div class="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div class="min-w-0 flex-1">
                <span class="text-[10px] font-bold text-amber-400 block truncate">#${i+1} ${v.formato} • ${v.client}</span>
                <p class="text-xs font-bold text-white truncate">${v.ideaGanadora}</p>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs font-extrabold text-emerald-400 block">👁️ ${formatCompactNumber(v.views || 0)}</span>
                <span class="text-[10px] text-amber-300 block">${renderInteractiveStars(v.id, v.rating || 0)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

function highlightActiveStatCard() {
  const cardMap = {
    'ALL': 'cardStatTotal',
    'Idea': 'cardStatIdea',
    'Redactado': 'cardStatRedactados',
    'Por Grabar': 'cardStatPorGrabar',
    'En Edición': 'cardStatEnEdicion',
    'Editado': 'cardStatEditado',
    'Publicado': 'cardStatPublicados'
  };

  Object.values(cardMap).forEach(cardId => {
    const el = document.getElementById(cardId);
    if (el) {
      el.classList.remove('ring-2', 'ring-brand-500', 'bg-slate-800');
    }
  });

  const activeCardId = cardMap[state.activeStatus];
  if (activeCardId) {
    const el = document.getElementById(activeCardId);
    if (el) {
      el.classList.add('ring-2', 'ring-brand-500', 'bg-slate-800');
    }
  }
}

// 1. MATRIX VIEW RENDER (PRIMARY VIEW)
function renderMatrixView(scripts) {
  matrixTableBody.innerHTML = '';
  const isPublishedView = state.activeStatus === 'Publicado';
  const thRendimiento = document.getElementById('thRendimiento');
  if (thRendimiento) {
    thRendimiento.classList.toggle('hidden', !isPublishedView);
  }
  
  scripts.forEach((script, idx) => {
    const row = document.createElement('tr');
    const isCompleted = script.completed || script.status === 'Publicado';

    row.className = `transition border-b border-slate-800/60 ${isCompleted ? 'bg-emerald-950/20 text-slate-400' : 'hover:bg-slate-800/40 text-slate-200'}`;

    row.innerHTML = `
      <!-- Realizado Checkbox -->
      <td class="py-3.5 px-3 text-center">
        <button onclick="toggleScriptCompleted('${script.id}')" title="${isCompleted ? 'Marcar como pendiente' : 'Marcar como realizado'}" class="w-6 h-6 rounded-md border ${isCompleted ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm shadow-emerald-900/50' : 'border-slate-700 bg-slate-950 text-transparent hover:border-brand-500'} inline-flex items-center justify-center transition">
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
      </td>

      <!-- Number -->
      <td class="py-3.5 px-3 font-mono text-center font-bold ${isCompleted ? 'text-slate-500' : 'text-slate-400'}">
        #${script.number || (idx + 1)}
      </td>

      <!-- Client -->
      <td class="py-3.5 px-4 font-semibold text-brand-400">
        ${script.client}
      </td>

      <!-- Idea Ganadora / Title (Highlighted in Amber) -->
      <td class="py-3.5 px-4 max-w-md leading-snug">
        <div onclick="openEditScriptModal('${script.id}')" class="cursor-pointer transition group">
          <span class="${isCompleted ? 'line-through text-slate-500 font-medium' : 'text-amber-300 hover:text-amber-200 font-extrabold text-base tracking-tight'} group-hover:underline inline">
            💡 ${script.ideaGanadora}
          </span>
          ${script.linkReferencia ? `
            <a href="${script.linkReferencia}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" title="Abrir link de referencia" class="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium ml-2 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 transition">
              <i data-lucide="external-link" class="w-3 h-3"></i> Referencia
            </a>
          ` : ''}
        </div>
        <p class="text-xs font-normal text-slate-400 mt-1 line-clamp-1">🪝 ${script.gancho}</p>
      </td>

      <!-- Formato / Objetivo -->
      <td class="py-3.5 px-4 space-y-1">
        <span class="inline-block bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded text-xs font-bold border border-emerald-500/30">
          ${script.formato}
        </span>
        <br>
        <span class="inline-block bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-500/20">
          🎯 ${script.objetivo}
        </span>
      </td>

      <!-- Actor -->
      <td class="py-3.5 px-4 text-slate-300 font-medium">
        ${script.actor || 'N/A'}
      </td>

      ${isPublishedView ? `
      <!-- Rendimiento (Vistas, Comentarios, Rating) -->
      <td class="py-3.5 px-4 min-w-[170px]">
        <div class="space-y-1.5 text-xs">
          <div class="flex items-center gap-1.5" title="Visualizaciones (Vistas)">
            <span class="text-[11px] font-bold text-emerald-400 w-4 text-center">👁️</span>
            <input type="number" value="${script.views || ''}" placeholder="Vistas" min="0" onchange="updateScriptMetrics('${script.id}', 'views', this.value)" class="w-24 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded px-1.5 py-0.5 text-xs text-emerald-300 font-extrabold outline-none">
          </div>
          <div class="flex items-center gap-1.5" title="Comentarios">
            <span class="text-[11px] font-bold text-sky-400 w-4 text-center">💬</span>
            <input type="number" value="${script.comments || ''}" placeholder="Coment." min="0" onchange="updateScriptMetrics('${script.id}', 'comments', this.value)" class="w-24 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded px-1.5 py-0.5 text-xs text-sky-300 font-extrabold outline-none">
          </div>
          <div class="pt-0.5">
            ${renderInteractiveStars(script.id, script.rating)}
          </div>
        </div>
      </td>
      ` : ''}

      <!-- Status Dropdown -->
      <td class="py-3.5 px-4">
        <select onchange="updateScriptStatus('${script.id}', this.value)" class="bg-slate-950 border border-slate-700 text-xs font-medium rounded-lg px-2.5 py-1 text-slate-200 outline-none cursor-pointer">
          <option value="Idea" ${script.status === 'Idea' ? 'selected' : ''}>💡 Idea</option>
          <option value="Redactado" ${script.status === 'Redactado' ? 'selected' : ''}>📝 Redactado</option>
          <option value="Por Grabar" ${script.status === 'Por Grabar' ? 'selected' : ''}>🎬 Por Grabar</option>
          <option value="En Edición" ${script.status === 'En Edición' ? 'selected' : ''}>🖥️ En Edición</option>
          <option value="Editado" ${script.status === 'Editado' ? 'selected' : ''}>✂️ Editado</option>
          <option value="Publicado" ${script.status === 'Publicado' ? 'selected' : ''}>🚀 Publicado</option>
        </select>
      </td>

      <!-- Actions (Ampliar, Print single, Edit, Delete) -->
      <td class="py-3.5 px-4 text-right print:hidden">
        <div class="flex items-center justify-end gap-1">
          <button onclick="openFocusScriptModal('${script.id}')" title="Ampliar guión (Modo Enfoque)" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
          </button>
          <button onclick="printSingleScript('${script.id}')" title="Imprimir este guión" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition">
            <i data-lucide="printer" class="w-4 h-4"></i>
          </button>
          <button onclick="openEditScriptModal('${script.id}')" title="Editar guión" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteScript('${script.id}')" title="Eliminar guión" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    matrixTableBody.appendChild(row);
  });
}

// 2. CARDS VIEW RENDER
function renderCardsView(scripts) {
  cardsGrid.innerHTML = '';
  
  scripts.forEach(script => {
    const card = document.createElement('div');
    const isCompleted = script.completed || script.status === 'Publicado';
    card.className = `bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between script-card-print ${isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'}`;
    
    let statusClass = "bg-slate-800 text-slate-300 border-slate-700";
    if (script.status === 'Redactado') statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (script.status === 'Por Grabar') statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (script.status === 'En Edición') statusClass = "bg-purple-500/10 text-purple-300 border-purple-500/30";
    if (script.status === 'Publicado' || isCompleted) statusClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (script.status === 'Editado') statusClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";

    card.innerHTML = `
      <div class="space-y-4">
        <!-- Card Top Bar -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-2">
            <button onclick="toggleScriptCompleted('${script.id}')" title="Marcar realizado" class="w-5 h-5 rounded border ${isCompleted ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-950 text-transparent'} flex items-center justify-center">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </button>
            <span class="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-700">
              #${script.number || '?'}
            </span>
            <span class="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              ${script.client}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-medium px-2.5 py-1 rounded-full border ${statusClass} badge-print">
              ${isCompleted ? '✓ Realizado' : script.status}
            </span>
            <div class="flex items-center gap-1 print:hidden">
              <button onclick="openFocusScriptModal('${script.id}')" title="Ampliar guión (Modo Enfoque)" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>
              <button onclick="printSingleScript('${script.id}')" title="Imprimir este guión" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition">
                <i data-lucide="printer" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditScriptModal('${script.id}')" title="Editar" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="deleteScript('${script.id}')" title="Eliminar" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Idea Ganadora -->
        <div>
          <span class="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Idea Ganadora</span>
          <h3 class="text-lg font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'} mt-1.5 leading-snug">${script.ideaGanadora}</h3>
          ${script.linkReferencia ? `
            <div class="mt-2">
              <a href="${script.linkReferencia}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 transition">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Ver Link de Referencia
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Meta info pills -->
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium">
            🎯 Objetivo: <strong>${script.objetivo}</strong>
          </span>
          <span class="bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium">
            📹 Formato: <strong>${script.formato}</strong>
          </span>
          <span class="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-md border border-slate-800 font-medium">
            👤 Actor: <strong>${script.actor || 'N/A'}</strong>
          </span>
        </div>

        ${state.activeStatus === 'Publicado' ? `
        <!-- Published Metrics Box for Publicados view -->
        <div class="bg-slate-950/80 rounded-xl p-4 border border-emerald-500/30 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">📊 Rendimiento del Video Publicado</span>
            <span class="text-xs text-amber-300 font-bold">${script.rating ? script.rating + ' ★' : 'Sin calificar'}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="space-y-1" title="Visualizaciones">
              <label class="text-[11px] font-semibold text-slate-400 block">👁️ Visualizaciones</label>
              <input type="number" value="${script.views || ''}" placeholder="0 vistas" min="0" onchange="updateScriptMetrics('${script.id}', 'views', this.value)" class="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded px-2.5 py-1 text-xs text-emerald-300 font-extrabold outline-none">
            </div>
            <div class="space-y-1" title="Comentarios">
              <label class="text-[11px] font-semibold text-slate-400 block">💬 Comentarios</label>
              <input type="number" value="${script.comments || ''}" placeholder="0 coment." min="0" onchange="updateScriptMetrics('${script.id}', 'comments', this.value)" class="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded px-2.5 py-1 text-xs text-sky-300 font-extrabold outline-none">
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span class="text-[11px] text-slate-400 font-semibold">Calificación:</span>
            ${renderInteractiveStars(script.id, script.rating)}
          </div>
        </div>
        ` : `
        <!-- Script breakdown sections for non-published states -->
        <div class="space-y-3 pt-2 text-sm border-t border-slate-800/60">
          
          <!-- Gancho -->
          <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2 mb-1">
              <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">🪝 Gancho (Hook)</p>
              <button onclick="copyScriptSection('${script.id}', 'gancho', this)" title="Copiar Gancho" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3 h-3"></i> Copiar
              </button>
            </div>
            <p class="text-slate-200 font-medium leading-relaxed">${script.gancho}</p>
          </div>

          <!-- Historia - Contexto -->
          <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2 mb-1">
              <p class="text-xs font-bold text-emerald-400 uppercase tracking-wider">📖 Historia - Contexto</p>
              <button onclick="copyScriptSection('${script.id}', 'historia', this)" title="Copiar Historia" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3 h-3"></i> Copiar
              </button>
            </div>
            <p class="text-slate-300 whitespace-pre-line leading-relaxed">${script.historia}</p>
          </div>

          <!-- Moraleja -->
          <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2 mb-1">
              <p class="text-xs font-bold text-rose-400 uppercase tracking-wider">💡 Moraleja / Valor</p>
              <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" title="Copiar Moraleja" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3 h-3"></i> Copiar
              </button>
            </div>
            <p class="text-slate-300 whitespace-pre-line leading-relaxed">${script.moraleja}</p>
          </div>

          <!-- CTA -->
          <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2 mb-1">
              <p class="text-xs font-bold text-blue-400 uppercase tracking-wider">📣 Call to Action (CTA)</p>
              <button onclick="copyScriptSection('${script.id}', 'cta', this)" title="Copiar CTA" class="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3 h-3"></i> Copiar
              </button>
            </div>
            <p class="text-slate-200 font-medium leading-relaxed">${script.cta}</p>
          </div>

          ${script.contextoAdicional ? `
          <div class="text-xs text-slate-400 pt-1 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500"></i>
            <span>${script.contextoAdicional}</span>
          </div>` : ''}

        </div>
        `}
      </div>
      </div>

      <!-- Card Action Footer -->
      <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 print:hidden">
        <button onclick="copyFullScript('${script.id}', this)" title="Copiar el guión completo" class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5 border border-slate-700">
          <i data-lucide="copy" class="w-3.5 h-3.5 text-sky-400"></i>
          <span>Copiar Guión</span>
        </button>
        <button onclick="openTeleprompterForScript('${script.id}')" title="Abrir Teleprónter" class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5 border border-slate-700">
          <i data-lucide="clapperboard" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>Teleprónter</span>
        </button>
      </div>
    `;

    cardsGrid.appendChild(card);
  });
}

// 3. TELEPROMPTER VIEW RENDER
function renderTeleprompterView(scripts) {
  teleprompterSelect.innerHTML = '';
  
  if (scripts.length === 0) {
    teleprompterDisplay.innerHTML = `<p class="text-slate-500 text-center py-20">No hay guiones disponibles para grabar.</p>`;
    return;
  }

  scripts.forEach(script => {
    const opt = document.createElement('option');
    opt.value = script.id;
    opt.textContent = `#${script.number || ''} - ${script.ideaGanadora}`;
    teleprompterSelect.appendChild(opt);
  });

  const selectedId = teleprompterSelect.value || scripts[0].id;
  displayScriptInTeleprompter(selectedId);
}

function displayScriptInTeleprompter(scriptId) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;

  teleprompterDisplay.innerHTML = `
    <!-- Prompter Header Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-brand-500/10 text-brand-400 text-xs font-bold px-2.5 py-1 rounded border border-brand-500/20">
            ${script.client}
          </span>
          <span class="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded">
            Guión #${script.number || '-'}
          </span>
          <span class="bg-amber-500/10 text-amber-400 text-xs font-medium px-2 py-1 rounded border border-amber-500/20">
            Formato: ${script.formato}
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-3">${script.ideaGanadora}</h2>
      </div>

      <div class="flex items-center gap-3">
        <button onclick="copyFullScript('${script.id}', this)" class="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md">
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span>Copiar Guión Completo</span>
        </button>
        <div class="text-sm text-slate-400">
          <span>Actor: <strong class="text-white">${script.actor || 'N/A'}</strong></span>
          ${script.contextoAdicional ? `<span class="border-l border-slate-800 pl-2">📍 ${script.contextoAdicional}</span>` : ''}
        </div>
      </div>
    </div>

    <!-- Prompter Script Sections (Large Reading Font) -->
    <div class="space-y-8 py-4">
      
      <!-- GANCHO -->
      <div class="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-2xl space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400">🪝 GANCHO (Hook - Primeros 3 seg)</span>
          <button onclick="copyScriptSection('${script.id}', 'gancho', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-amber-100 leading-relaxed">${script.gancho}</p>
      </div>

      <!-- HISTORIA / CONTEXTO -->
      <div class="bg-emerald-500/5 border-l-4 border-emerald-500 p-6 rounded-r-2xl space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold uppercase tracking-widest text-emerald-400">📖 HISTORIA - CONTEXTO</span>
          <button onclick="copyScriptSection('${script.id}', 'historia', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-xl sm:text-2xl font-medium text-emerald-100 whitespace-pre-line leading-relaxed">${script.historia}</p>
      </div>

      <!-- MORALEJA / VALOR -->
      <div class="bg-rose-500/5 border-l-4 border-rose-500 p-6 rounded-r-2xl space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-400">💡 MORALEJA / SOLUCIÓN</span>
          <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-xl sm:text-2xl font-medium text-rose-100 whitespace-pre-line leading-relaxed">${script.moraleja}</p>
      </div>

      <!-- CTA -->
      <div class="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-2xl space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold uppercase tracking-widest text-blue-400">📣 LLAMADO A LA ACCIÓN (CTA)</span>
          <button onclick="copyScriptSection('${script.id}', 'cta', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-blue-100 leading-relaxed">${script.cta}</p>
      </div>

    </div>
  `;
}

// COPY & PASTE HELPERS
function copyTextToClipboard(text, btnElement) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showCopySuccess(btnElement)).catch(() => fallbackCopy(text, btnElement));
  } else {
    fallbackCopy(text, btnElement);
  }
}

function fallbackCopy(text, btnElement) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopySuccess(btnElement);
  } catch (err) {}
  document.body.removeChild(textArea);
}

function showCopySuccess(btnElement) {
  if (!btnElement) return;
  const originalHTML = btnElement.innerHTML;
  btnElement.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> ¡Copiado!`;
  btnElement.classList.add('text-emerald-400', 'border-emerald-500/40');
  refreshLucideIcons();
  setTimeout(() => {
    btnElement.innerHTML = originalHTML;
    btnElement.classList.remove('text-emerald-400', 'border-emerald-500/40');
    refreshLucideIcons();
  }, 1800);
}

function copyScriptSection(scriptId, sectionKey, btnElement) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;
  const text = script[sectionKey] || '';
  copyTextToClipboard(text, btnElement);
}

function copyFullScript(scriptId, btnElement) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;

  const fullText = `💡 IDEA: ${script.ideaGanadora}
🎯 OBJETIVO: ${script.objetivo} | 📹 FORMATO: ${script.formato} | 👤 ACTOR: ${script.actor || 'N/A'}

🪝 GANCHO:
${script.gancho}

📖 HISTORIA - CONTEXTO:
${script.historia}

💡 MORALEJA / VALOR:
${script.moraleja}

📣 CTA:
${script.cta}`;

  copyTextToClipboard(fullText, btnElement);
}

function copyField(elementId, btnElement) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const val = el.value || '';
  if (val) {
    copyTextToClipboard(val, btnElement);
  }
}

async function pasteField(elementId, btnElement) {
  const el = document.getElementById(elementId);
  if (!el) return;

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      if (text) {
        el.value = text;
        showPasteSuccess(btnElement);
      }
    } else {
      el.focus();
    }
  } catch (err) {
    el.focus();
  }
}

function showPasteSuccess(btnElement) {
  if (!btnElement) return;
  const originalHTML = btnElement.innerHTML;
  btnElement.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> ¡Pegado!`;
  refreshLucideIcons();
  setTimeout(() => {
    btnElement.innerHTML = originalHTML;
    refreshLucideIcons();
  }, 1500);
}

// EVENT HANDLERS & MODALS
function setupEventListeners() {
  // Tab Switching
  if (tabViralCalc) tabViralCalc.addEventListener('click', () => switchView('viral_calc'));
  tabMatrix.addEventListener('click', () => switchView('matrix'));
  tabCards.addEventListener('click', () => switchView('cards'));
  tabTeleprompter.addEventListener('click', () => switchView('teleprompter'));

  // Filters
  clientFilterSelect.addEventListener('change', (e) => {
    state.activeClient = e.target.value;
    renderAll();
  });

  statusFilterSelect.addEventListener('change', (e) => {
    state.activeStatus = e.target.value;
    renderAll();
  });

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderAll();
  });

  teleprompterSelect.addEventListener('change', (e) => {
    displayScriptInTeleprompter(e.target.value);
  });

  // Clear all / Vaciar plantilla
  if (btnClearAllScripts) {
    btnClearAllScripts.addEventListener('click', clearAllScripts);
  }

  // Script Modal open/close
  btnNewScript.addEventListener('click', () => openNewScriptModal());
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  scriptForm.addEventListener('submit', handleScriptSubmit);

  // Client Modal
  btnNewClient.addEventListener('click', openClientManagerModal);
  btnCancelClientModal.addEventListener('click', closeClientManagerModal);
  if (btnCloseClientModal) btnCloseClientModal.addEventListener('click', closeClientManagerModal);
  btnSaveClient.addEventListener('click', handleSaveNewClient);

  // Print Modal & Actions
  btnPrint.addEventListener('click', openPrintModal);
  if (btnClosePrintModal) btnClosePrintModal.addEventListener('click', closePrintModal);
  if (btnCancelPrintModal) btnCancelPrintModal.addEventListener('click', closePrintModal);
  if (btnExecutePrint) btnExecutePrint.addEventListener('click', handleExecutePrint);
  if (btnSelectAllPrint) btnSelectAllPrint.addEventListener('click', selectAllPrintScripts);
  if (btnDeselectAllPrint) btnDeselectAllPrint.addEventListener('click', deselectAllPrintScripts);

  // Export & Import JSON
  btnExportJSON.addEventListener('click', handleExportJSON);
  btnImportJSON.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', handleImportJSON);

  // Quick Idea Modal
  if (btnQuickIdea) btnQuickIdea.addEventListener('click', () => openQuickIdeaModal());
  if (btnCloseQuickIdeaModal) btnCloseQuickIdeaModal.addEventListener('click', closeQuickIdeaModal);
  if (btnCancelQuickIdeaModal) btnCancelQuickIdeaModal.addEventListener('click', closeQuickIdeaModal);
  if (quickIdeaForm) quickIdeaForm.addEventListener('submit', handleQuickIdeaSubmit);

  // Notes Modal
  const btnNotes = document.getElementById('btnNotes');
  const btnCloseNotesModal = document.getElementById('btnCloseNotesModal');
  const notesModal = document.getElementById('notesModal');
  if (btnNotes) btnNotes.addEventListener('click', () => openNotesModal());
  if (btnCloseNotesModal) btnCloseNotesModal.addEventListener('click', closeNotesModal);
  if (notesModal) {
    notesModal.addEventListener('click', (e) => {
      if (e.target === notesModal) closeNotesModal();
    });
  }

  // Focus Modal Backdrop Click
  const focusModal = document.getElementById('focusScriptModal');
  if (focusModal) {
    focusModal.addEventListener('click', (e) => {
      if (e.target === focusModal) closeFocusModal();
    });
  }

  // Viral Calculator Listeners
  setupViralCalcEventListeners();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen:', err));
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function switchView(viewName) {
  state.currentView = viewName;

  const vViral = document.getElementById('viewViralCalc');
  const vMatrix = document.getElementById('viewMatrix');
  const vCards = document.getElementById('viewCards');
  const vTele = document.getElementById('viewTeleprompter');

  const tViral = document.getElementById('tabViralCalc');
  const tMatrix = document.getElementById('tabMatrix');
  const tCards = document.getElementById('tabCards');
  const tTele = document.getElementById('tabTeleprompter');

  const statsContainer = document.getElementById('statsBarContainer');

  if (vViral) vViral.classList.add('hidden');
  if (vMatrix) vMatrix.classList.add('hidden');
  if (vCards) vCards.classList.add('hidden');
  if (vTele) vTele.classList.add('hidden');

  const inactiveBtnClass = "flex-1 lg:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition text-slate-400 hover:text-white whitespace-nowrap cursor-pointer";
  const activeBtnClass = "flex-1 lg:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition bg-brand-600 text-white shadow-md whitespace-nowrap cursor-pointer";
  const activeViralBtnClass = "flex-1 lg:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40 whitespace-nowrap cursor-pointer";

  if (tViral) tViral.className = inactiveBtnClass;
  if (tMatrix) tMatrix.className = inactiveBtnClass;
  if (tCards) tCards.className = inactiveBtnClass;
  if (tTele) tTele.className = inactiveBtnClass;

  if (viewName === 'viral_calc') {
    if (vViral) vViral.classList.remove('hidden');
    if (tViral) tViral.className = activeViralBtnClass;
    if (statsContainer) statsContainer.classList.add('hidden');
    calculateViralScore();
    renderViralHistoryTable();
  } else if (viewName === 'matrix') {
    if (vMatrix) vMatrix.classList.remove('hidden');
    if (tMatrix) tMatrix.className = activeBtnClass;
    if (statsContainer) statsContainer.classList.remove('hidden');
  } else if (viewName === 'cards') {
    if (vCards) vCards.classList.remove('hidden');
    if (tCards) tCards.className = activeBtnClass;
    if (statsContainer) statsContainer.classList.remove('hidden');
  } else if (viewName === 'teleprompter') {
    if (vTele) vTele.classList.remove('hidden');
    if (tTele) tTele.className = activeBtnClass;
    if (statsContainer) statsContainer.classList.remove('hidden');
  }
  refreshLucideIcons();
}

// TOGGLE COMPLETED & BULK ACTIONS
function toggleScriptCompleted(scriptId) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (script) {
    script.completed = !script.completed;
    if (script.completed && script.status !== 'Publicado') {
      script.status = 'Publicado';
    } else if (!script.completed && script.status === 'Publicado') {
      script.status = 'Por Grabar';
    }
    saveState();
    renderAll();
  }
}

function clearAllScripts() {
  const currentClientText = state.activeClient === 'ALL' ? 'de todos los clientes' : `del cliente "${state.activeClient}"`;
  if (confirm(`⚠️ ALERTA: ¿Estás seguro de que deseas vaciar/eliminar los guiones ${currentClientText}? Esta acción eliminará los videos mostrados.`)) {
    if (state.activeClient === 'ALL') {
      state.scripts = [];
    } else {
      state.scripts = state.scripts.filter(s => s.client !== state.activeClient);
    }
    saveState();
    renderAll();
  }
}

function getNextScriptNumber() {
  if (!state.scripts || state.scripts.length === 0) return 1;
  const maxNum = Math.max(...state.scripts.map(s => parseInt(s.number) || 0));
  return maxNum + 1;
}

function normalizeScriptFormat(formato) {
  if (!formato) return "Hablando a cámara";
  const f = formato.trim();
  const lower = f.toLowerCase();
  if (lower.includes('vlog')) return "Formato Vlog";
  if (lower.includes('entrevista')) return "Formato entrevista";
  if (lower.includes('dinámico') || lower.includes('dinamico')) return "Formato Dinámico";
  if (lower.includes('pov')) return "Formato POV";
  if (lower.includes('pantalla dividida') || lower.includes('dividida')) return "Formato pantalla dividida";
  if (lower.includes('pantalla verde') || lower.includes('verde')) return "Formato pantalla verde";
  if (lower.includes('prima') || lower.includes('pregunta')) return "Formato prima pregunta";
  if (lower.includes('mirando') || lower.includes('nada')) return "Formato mirando a la nada";
  if (lower.includes('selfie')) return "Formato selfie";
  if (lower.includes('hablando') || lower.includes('cámara') || lower.includes('camara') || lower.includes('talking')) return "Hablando a cámara";
  if (lower.includes('tutorial') || lower.includes('reel') || lower.includes('paso a paso') || lower.includes('testimonio')) return "Hablando a cámara";
  return f;
}

function getPointsForFormat(format) {
  if (!format) return 0.0;
  const f = format.trim();
  const lower = f.toLowerCase();
  
  // Grupo 1: Alta Retención e Inmersión Total (3.5 – 4.5 pts)
  if (f === 'Formato POV' || lower === 'pov' || lower.includes('pov')) return 4.5;
  if (f === 'Formato Vlog' || lower === 'vlog' || lower.includes('vlog')) return 4.0;
  if (f === 'Formato Dinámico' || lower.includes('dinam')) return 3.5;
  
  // Grupo 2: Curiosidad Social y Efecto Testigo (2.5 – 3.5 pts)
  if (f === 'Formato prima pregunta' || lower.includes('prima') || lower.includes('pregunta')) return 3.5;
  if (f === 'Formato entrevista' || lower === 'entrevista' || lower.includes('entrevista')) return 3.0;
  if (f === 'Formato mirando a la nada' || lower.includes('mirando') || lower.includes('nada')) return 2.5;
  
  // Grupo 3: Demostración Visual y Comentario (2.0 – 2.5 pts)
  if (f === 'Formato pantalla dividida' || lower.includes('dividida') || lower.includes('split')) return 2.5;
  if (f === 'Formato pantalla verde' || lower.includes('verde') || lower.includes('green')) return 2.0;
  
  // Grupo 4: Exposición Frontal y Mayor Fricción (1.0 – 1.5 pts)
  if (f === 'Formato selfie' || lower.includes('selfie')) return 1.5;
  if (f === 'Hablando a cámara' || lower.includes('hablando') || lower.includes('camara') || lower.includes('cámara') || lower === 'talking_head' || lower.includes('tutorial') || lower.includes('reel') || lower.includes('paso a paso') || lower.includes('testimonio')) return 1.0;
  
  return 1.0;
}

// SCRIPT CRUD
function openNewScriptModal() {
  state.editingScriptId = null;
  modalTitle.innerHTML = `<i data-lucide="plus" class="w-5 h-5 text-brand-500"></i> Nuevo Guión`;
  scriptForm.reset();
  
  const initialClient = state.activeClient !== 'ALL' ? state.activeClient : (state.clients[0] || 'Jennil');
  document.getElementById('scriptId').value = '';
  document.getElementById('formClient').value = initialClient;
  document.getElementById('formNumber').value = getNextScriptNumber();
  document.getElementById('formStatus').value = 'Por Grabar';
  document.getElementById('formFormato').value = 'Hablando a cámara';
  document.getElementById('formObjetivo').value = 'VENTA';
  populateActorOptions(initialClient);

  scriptModal.classList.remove('hidden');
  refreshLucideIcons();
}

function openEditScriptModal(id) {
  const script = state.scripts.find(s => s.id === id);
  if (!script) return;

  state.editingScriptId = id;
  modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-brand-500"></i> Editar Guión #${script.number || ''}`;

  document.getElementById('scriptId').value = script.id;
  document.getElementById('formClient').value = script.client;
  document.getElementById('formNumber').value = script.number || '';
  document.getElementById('formStatus').value = script.status || 'Idea';
  document.getElementById('formFormato').value = normalizeScriptFormat(script.formato);
  document.getElementById('formObjetivo').value = script.objetivo || 'VENTA';
  populateActorOptions(script.actor || script.client || '');
  document.getElementById('formIdeaGanadora').value = script.ideaGanadora || '';
  document.getElementById('formLinkReferencia').value = script.linkReferencia || '';
  document.getElementById('formGancho').value = script.gancho || '';
  document.getElementById('formHistoria').value = script.historia || '';
  document.getElementById('formMoraleja').value = script.moraleja || '';
  document.getElementById('formCTA').value = script.cta || '';
  document.getElementById('formContextoAdicional').value = script.contextoAdicional || '';

  scriptModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeModal() {
  scriptModal.classList.add('hidden');
}

function openFocusScriptModal(id) {
  const script = state.scripts.find(s => s.id === id);
  if (!script) return;

  const focusModal = document.getElementById('focusScriptModal');
  const focusModalTitle = document.getElementById('focusModalTitle');
  const focusModalBody = document.getElementById('focusModalBody');
  const btnCopyFocusScript = document.getElementById('btnCopyFocusScript');
  const btnPrintFocusScript = document.getElementById('btnPrintFocusScript');
  const btnEditFocusScript = document.getElementById('btnEditFocusScript');

  if (!focusModal || !focusModalBody) return;

  focusModalTitle.textContent = `#${script.number || '?'} • ${script.client} — ${script.ideaGanadora}`;

  let statusClass = "bg-slate-800 text-slate-300 border-slate-700";
  if (script.status === 'Redactado') statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
  if (script.status === 'Por Grabar') statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  if (script.status === 'En Edición') statusClass = "bg-purple-500/10 text-purple-300 border-purple-500/30";
  if (script.status === 'Publicado' || script.completed) statusClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (script.status === 'Editado') statusClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";

  focusModalBody.innerHTML = `
    <!-- Top Metadata Header -->
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-md border border-slate-700">
          Guión #${script.number || '?'}
        </span>
        <span class="bg-brand-500/10 text-brand-300 font-bold px-3 py-1 rounded-md border border-brand-500/20">
          🏢 Cliente: ${script.client}
        </span>
        <span class="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-md border border-emerald-500/30">
          📹 Formato: ${script.formato}
        </span>
        <span class="bg-emerald-500/10 text-emerald-400 font-semibold px-3 py-1 rounded-md border border-emerald-500/20">
          🎯 Objetivo: ${script.objetivo}
        </span>
        <span class="bg-slate-800 text-slate-300 font-semibold px-3 py-1 rounded-md border border-slate-700">
          👤 Actor: ${script.actor || 'N/A'}
        </span>
      </div>
      <span class="text-xs font-semibold px-3 py-1 rounded-full border ${statusClass}">
        ${script.completed ? '✓ Realizado' : script.status}
      </span>
    </div>

    <!-- Idea Ganadora -->
    <div class="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 block">💡 Idea Ganadora</span>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">${script.ideaGanadora}</h2>
      ${script.linkReferencia ? `
        <div class="pt-1">
          <a href="${script.linkReferencia}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 font-semibold bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 transition">
            <i data-lucide="external-link" class="w-4 h-4"></i> Abrir Link de Referencia
          </a>
        </div>
      ` : ''}
    </div>

    <!-- Script Content Sections -->
    <div class="space-y-4 text-base">
      
      <!-- Gancho -->
      <div class="bg-slate-950 rounded-xl p-5 border border-slate-800/90 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>🪝</span> GANCHO (HOOK)
          </span>
          <button onclick="copyScriptSection('${script.id}', 'gancho', this)" class="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-white font-medium text-lg leading-relaxed whitespace-pre-line">${script.gancho || 'Sin gancho redactado'}</p>
      </div>

      <!-- Historia - Contexto -->
      <div class="bg-slate-950 rounded-xl p-5 border border-slate-800/90 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <span>📖</span> HISTORIA - CONTEXTO
          </span>
          <button onclick="copyScriptSection('${script.id}', 'historia', this)" class="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-slate-200 text-lg leading-relaxed whitespace-pre-line">${script.historia || 'Sin historia redactada'}</p>
      </div>

      <!-- Moraleja / Valor -->
      <div class="bg-slate-950 rounded-xl p-5 border border-slate-800/90 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <span>💡</span> MORALEJA / VALOR
          </span>
          <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" class="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-slate-200 text-lg leading-relaxed whitespace-pre-line">${script.moraleja || 'Sin moraleja redactada'}</p>
      </div>

      <!-- Call to Action -->
      <div class="bg-slate-950 rounded-xl p-5 border border-slate-800/90 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
            <span>📢</span> CALL TO ACTION (CTA)
          </span>
          <button onclick="copyScriptSection('${script.id}', 'cta', this)" class="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
          </button>
        </div>
        <p class="text-blue-300 font-medium text-lg leading-relaxed whitespace-pre-line">${script.cta || 'Sin CTA redactado'}</p>
      </div>

      ${script.contextoAdicional ? `
        <!-- Contexto Adicional -->
        <div class="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
          <span>📍</span>
          <span><strong>Notas / Ubicación:</strong> ${script.contextoAdicional}</span>
        </div>
      ` : ''}

    </div>
  `;

  if (btnCopyFocusScript) {
    btnCopyFocusScript.onclick = function(e) {
      copyFullScript(script.id, this);
    };
  }
  if (btnPrintFocusScript) {
    btnPrintFocusScript.onclick = function() {
      printSingleScript(script.id);
    };
  }
  if (btnEditFocusScript) {
    btnEditFocusScript.onclick = function() {
      closeFocusModal();
      openEditScriptModal(script.id);
    };
  }

  focusModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeFocusModal() {
  const focusModal = document.getElementById('focusScriptModal');
  if (focusModal) focusModal.classList.add('hidden');
}

function handleScriptSubmit(e) {
  e.preventDefault();

  const clientName = document.getElementById('formClient').value.trim();
  if (clientName && !state.clients.includes(clientName)) {
    state.clients.push(clientName);
    saveState();
    renderClientSelect();
  }

  const existingScript = state.editingScriptId ? state.scripts.find(s => s.id === state.editingScriptId) : null;

  const scriptData = {
    id: state.editingScriptId || 'script-' + Date.now(),
    client: clientName,
    number: parseInt(document.getElementById('formNumber').value) || getNextScriptNumber(),
    status: document.getElementById('formStatus').value,
    formato: normalizeScriptFormat(document.getElementById('formFormato').value),
    objetivo: document.getElementById('formObjetivo').value,
    actor: document.getElementById('formActor').value.trim(),
    ideaGanadora: document.getElementById('formIdeaGanadora').value.trim(),
    linkReferencia: document.getElementById('formLinkReferencia').value.trim(),
    gancho: document.getElementById('formGancho').value.trim(),
    historia: document.getElementById('formHistoria').value.trim(),
    moraleja: document.getElementById('formMoraleja').value.trim(),
    cta: document.getElementById('formCTA').value.trim(),
    contextoAdicional: document.getElementById('formContextoAdicional').value.trim(),
    views: existingScript ? (existingScript.views || 0) : 0,
    comments: existingScript ? (existingScript.comments || 0) : 0,
    rating: existingScript ? (existingScript.rating || 0) : 0,
    updatedAt: new Date().toISOString()
  };

  if (state.editingScriptId) {
    const idx = state.scripts.findIndex(s => s.id === state.editingScriptId);
    if (idx !== -1) {
      state.scripts[idx] = { ...state.scripts[idx], ...scriptData };
    }
  } else {
    scriptData.createdAt = new Date().toISOString();
    state.scripts.push(scriptData);
  }

  saveState();
  closeModal();
  renderAll();
}

// QUICK IDEA CAPTURE LOGIC
function openQuickIdeaModal() {
  if (!quickIdeaModal) return;
  quickIdeaForm.reset();

  if (quickIdeaClient) {
    quickIdeaClient.innerHTML = '';
    state.clients.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `🏢 ${c}`;
      quickIdeaClient.appendChild(opt);
    });
    quickIdeaClient.value = (state.activeClient !== 'ALL' && state.clients.includes(state.activeClient)) 
      ? state.activeClient 
      : (state.clients[0] || 'Jennil');
  }

  quickIdeaModal.classList.remove('hidden');
  if (quickIdeaTitle) quickIdeaTitle.focus();
  refreshLucideIcons();
}

function closeQuickIdeaModal() {
  if (quickIdeaModal) {
    quickIdeaModal.classList.add('hidden');
  }
}

function handleQuickIdeaSubmit(e) {
  e.preventDefault();

  const clientName = quickIdeaClient ? quickIdeaClient.value.trim() : (state.clients[0] || 'Jennil');
  const title = quickIdeaTitle ? quickIdeaTitle.value.trim() : '';
  const link = quickIdeaLink ? quickIdeaLink.value.trim() : '';
  const notes = quickIdeaNotes ? quickIdeaNotes.value.trim() : '';

  if (!title) return;

  const newScript = {
    id: 'script-' + Date.now(),
    client: clientName,
    number: getNextScriptNumber(),
    status: 'Idea',
    ideaGanadora: title,
    linkReferencia: link,
    gancho: notes || title,
    historia: notes ? `Notas: ${notes}` : 'Pendiente de redactar historia...',
    moraleja: 'Pendiente de redactar moraleja...',
    cta: 'Pendiente de redactar CTA...',
    formato: 'Hablando a cámara',
    objetivo: 'VIRAL',
    actor: clientName,
    contextoAdicional: notes ? `Idea rápida: ${notes}` : '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.scripts.push(newScript);
  saveState();
  closeQuickIdeaModal();

  // Set filter to 'Idea' status to highlight the newly saved idea
  state.activeStatus = 'Idea';
  if (statusFilterSelect) statusFilterSelect.value = 'Idea';

  renderAll();
}

function updateScriptStatus(scriptId, newStatus) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (script) {
    script.status = newStatus;
    if (newStatus === 'Publicado') script.completed = true;
    saveState();
    renderAll();
  }
}

function deleteScript(scriptId) {
  if (confirm('¿Estás seguro de que deseas eliminar este guión?')) {
    state.scripts = state.scripts.filter(s => s.id !== scriptId);
    saveState();
    renderAll();
  }
}

function openTeleprompterForScript(scriptId) {
  switchView('teleprompter');
  teleprompterSelect.value = scriptId;
  displayScriptInTeleprompter(scriptId);
}

// CLIENT MANAGEMENT (ADD, RENAME, DELETE)
function openClientManagerModal() {
  renderClientsManageList();
  clientModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeClientManagerModal() {
  clientModal.classList.add('hidden');
}

function renderClientsManageList() {
  if (!clientsManageList) return;
  clientsManageList.innerHTML = '';

  state.clients.forEach((clientName, index) => {
    const row = document.createElement('div');
    row.className = "flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-sm";
    
    row.innerHTML = `
      <div class="flex items-center gap-2 flex-1 min-w-0" id="clientDisplay-${index}">
        <i data-lucide="building" class="w-4 h-4 text-slate-500 shrink-0"></i>
        <span class="font-semibold text-slate-200 truncate">${clientName}</span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button onclick="enableRenameClient(${index})" title="Renombrar cliente" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition">
          <i data-lucide="edit-2" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteClientByName('${clientName}')" title="Eliminar cliente" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    clientsManageList.appendChild(row);
  });
  refreshLucideIcons();
}

function handleSaveNewClient() {
  const name = newClientNameInput.value.trim();
  if (name) {
    if (!state.clients.includes(name)) {
      state.clients.push(name);
      saveState();
      renderClientSelect();
    }
    state.activeClient = name;
    clientFilterSelect.value = name;
    newClientNameInput.value = '';
    renderClientsManageList();
    renderAll();
  }
}

function enableRenameClient(index) {
  const displayDiv = document.getElementById(`clientDisplay-${index}`);
  if (!displayDiv) return;
  const currentName = state.clients[index];

  displayDiv.parentElement.innerHTML = `
    <input type="text" id="renameInput-${index}" value="${currentName}" class="flex-1 bg-slate-900 border border-brand-500 rounded px-2 py-1 text-sm text-white outline-none">
    <button onclick="saveRenameClient(${index}, '${currentName}')" class="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded transition">
      Guardar
    </button>
    <button onclick="renderClientsManageList()" class="text-slate-400 hover:text-white text-xs px-2 py-1 transition">
      Cancelar
    </button>
  `;
}

function saveRenameClient(index, oldName) {
  const input = document.getElementById(`renameInput-${index}`);
  if (!input) return;
  const newName = input.value.trim();

  if (newName && newName !== oldName) {
    state.clients[index] = newName;
    state.scripts.forEach(script => {
      if (script.client === oldName) {
        script.client = newName;
      }
    });

    if (state.activeClient === oldName) {
      state.activeClient = newName;
    }

    // Migrate notes
    if (state.notes && state.notes[oldName]) {
      state.notes[newName] = state.notes[oldName];
      delete state.notes[oldName];
    }
    if (state.activeNotesClient === oldName) {
      state.activeNotesClient = newName;
    }

    saveState();
    renderClientSelect();
    renderClientsManageList();
    renderAll();
  } else {
    renderClientsManageList();
  }
}

function deleteClientByName(clientName) {
  const scriptsCount = state.scripts.filter(s => s.client === clientName).length;
  let confirmMsg = `¿Deseas eliminar el cliente "${clientName}"?`;
  if (scriptsCount > 0) {
    confirmMsg += ` Atención: Tiene ${scriptsCount} guiones asociados.`;
  }

  if (confirm(confirmMsg)) {
    state.clients = state.clients.filter(c => c !== clientName);
    if (state.activeClient === clientName) {
      state.activeClient = 'ALL';
    }
    if (state.notes && state.notes[clientName]) {
      delete state.notes[clientName];
    }
    if (state.activeNotesClient === clientName) {
      state.activeNotesClient = state.clients[0] || 'Jennil';
    }
    saveState();
    renderClientSelect();
    renderClientsManageList();
    renderAll();
  }
}

// PRINT / PDF SELECTION LOGIC
function openPrintModal() {
  const filtered = getFilteredScripts();
  printSelectedIds = new Set(filtered.map(s => s.id));
  renderPrintScriptsList(filtered);
  printModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closePrintModal() {
  printModal.classList.add('hidden');
}

function renderPrintScriptsList(filteredScripts) {
  if (!printScriptsList) return;
  printScriptsList.innerHTML = '';

  if (filteredScripts.length === 0) {
    printScriptsList.innerHTML = `<p class="text-slate-500 text-xs py-4 text-center">No hay guiones disponibles.</p>`;
    return;
  }

  filteredScripts.forEach(script => {
    const isChecked = printSelectedIds.has(script.id);
    const item = document.createElement('div');
    item.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition";
    
    item.innerHTML = `
      <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePrintScriptId('${script.id}')" class="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500 cursor-pointer">
        <span class="font-bold text-slate-300 shrink-0">#${script.number || '?'}</span>
        <span class="font-medium text-white truncate">${script.ideaGanadora}</span>
      </label>
      <span class="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded shrink-0">${script.client}</span>
    `;
    printScriptsList.appendChild(item);
  });

  updatePrintSelectionCounter(filteredScripts.length);
}

function togglePrintScriptId(id) {
  if (printSelectedIds.has(id)) {
    printSelectedIds.delete(id);
  } else {
    printSelectedIds.add(id);
  }
  updatePrintSelectionCounter(getFilteredScripts().length);
}

function updatePrintSelectionCounter(total) {
  if (printSelectionCounter) {
    printSelectionCounter.textContent = `Se imprimirán ${printSelectedIds.size} de ${total} guión(es)`;
  }
}

function selectAllPrintScripts() {
  const filtered = getFilteredScripts();
  printSelectedIds = new Set(filtered.map(s => s.id));
  renderPrintScriptsList(filtered);
}

function deselectAllPrintScripts() {
  printSelectedIds.clear();
  renderPrintScriptsList(getFilteredScripts());
}

function handleExecutePrint() {
  const selectedFormatRadio = document.querySelector('input[name="printFormat"]:checked');
  const format = selectedFormatRadio ? selectedFormatRadio.value : 'cards';

  switchView(format);

  if (format === 'cards') {
    const cardElements = cardsGrid.children;
    const filtered = getFilteredScripts();
    Array.from(cardElements).forEach((card, idx) => {
      const script = filtered[idx];
      if (script && !printSelectedIds.has(script.id)) {
        card.classList.add('no-print');
      } else {
        card.classList.remove('no-print');
      }
    });
  } else if (format === 'matrix') {
    const rowElements = matrixTableBody.children;
    const filtered = getFilteredScripts();
    Array.from(rowElements).forEach((row, idx) => {
      const script = filtered[idx];
      if (script && !printSelectedIds.has(script.id)) {
        row.classList.add('no-print');
      } else {
        row.classList.remove('no-print');
      }
    });
  }

  closePrintModal();

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      renderAll();
    }, 500);
  }, 150);
}

function printSingleScript(scriptId) {
  printSelectedIds = new Set([scriptId]);
  switchView('cards');
  
  const filtered = getFilteredScripts();
  const cardElements = cardsGrid.children;
  Array.from(cardElements).forEach((card, idx) => {
    const script = filtered[idx];
    if (script && script.id !== scriptId) {
      card.classList.add('no-print');
    } else {
      card.classList.remove('no-print');
    }
  });

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      renderAll();
    }, 500);
  }, 150);
}

// EXPORT / IMPORT JSON
function handleExportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    clients: state.clients,
    scripts: state.scripts,
    notes: state.notes,
    viralEvaluations: state.viralEvaluations
  }, null, 2));
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `blex_studio_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function handleImportJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.scripts && Array.isArray(data.scripts)) {
        state.scripts = data.scripts;
        if (data.clients && Array.isArray(data.clients)) {
          state.clients = data.clients;
        }
        if (data.notes && typeof data.notes === 'object') {
          state.notes = data.notes;
        }
        if (data.viralEvaluations && Array.isArray(data.viralEvaluations)) {
          state.viralEvaluations = data.viralEvaluations;
        }
        saveState();
        renderClientSelect();
        renderAll();
        if (state.currentView === 'viral_calc') {
          renderViralHistoryTable();
        }
        alert('¡Datos importados con éxito!');
      } else {
        alert('El archivo JSON no tiene un formato válido.');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON.');
    }
  };
  reader.readAsText(file);
}

// CLIENT NOTES MODULE
function openNotesModal(clientName = null) {
  const notesModal = document.getElementById('notesModal');
  if (!notesModal) return;

  if (clientName && state.clients.includes(clientName)) {
    state.activeNotesClient = clientName;
  } else if (state.activeClient !== 'ALL' && state.clients.includes(state.activeClient)) {
    state.activeNotesClient = state.activeClient;
  } else if (!state.activeNotesClient || !state.clients.includes(state.activeNotesClient)) {
    state.activeNotesClient = state.clients[0] || 'Jennil';
  }

  renderNotesClientTabs();
  renderNotesForActiveClient();
  notesModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeNotesModal() {
  const notesModal = document.getElementById('notesModal');
  if (notesModal) {
    notesModal.classList.add('hidden');
  }
}

function renderNotesClientTabs() {
  const tabsContainer = document.getElementById('notesClientTabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';
  state.clients.forEach(client => {
    const isActive = client === state.activeNotesClient;
    const clientNotesCount = (state.notes[client] || []).length;
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
      isActive 
        ? 'bg-sky-600 text-white shadow-md' 
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
    }`;
    btn.innerHTML = `
      <span>👤 ${client}</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-sky-700 text-white' : 'bg-slate-900 text-slate-400'}">${clientNotesCount}</span>
    `;
    btn.onclick = () => {
      state.activeNotesClient = client;
      renderNotesClientTabs();
      renderNotesForActiveClient();
    };
    tabsContainer.appendChild(btn);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderNotesForActiveClient() {
  const body = document.getElementById('notesModalBody');
  if (!body) return;

  const client = state.activeNotesClient;
  if (!client) return;

  if (!state.notes[client]) {
    state.notes[client] = [];
  }

  const notesList = state.notes[client];

  if (notesList.length === 0) {
    body.innerHTML = `
      <div class="text-center py-12 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="file-plus" class="w-6 h-6"></i>
        </div>
        <h4 class="text-base font-bold text-white mb-1">No hay notas para ${client}</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto mb-4">Escribe ideas, directrices de grabación o recordatorios exclusivos para este cliente.</p>
        <button onclick="addNewNoteForActiveClient()" class="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-2 shadow-md cursor-pointer">
          <i data-lucide="plus" class="w-4 h-4"></i> Crear Primera Nota
        </button>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  body.innerHTML = notesList.map((note) => {
    const formattedDate = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    return `
      <div class="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 sm:p-5 transition shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div class="flex-1 min-w-[200px]">
            <input 
              type="text" 
              value="${escapeHtml(note.title || 'Nota sin título')}" 
              placeholder="Título de la nota..." 
              oninput="updateNoteTitle('${note.id}', this.value)"
              class="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-3 py-1.5 text-sm font-bold text-white placeholder-slate-500 outline-none transition"
            >
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            ${formattedDate ? `<span class="text-[11px] text-slate-500 hidden sm:inline mr-1">🕒 ${formattedDate}</span>` : ''}
            <button onclick="copyNoteContent('${note.id}', this)" title="Copiar texto de la nota" class="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition flex items-center gap-1 text-xs cursor-pointer">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span class="hidden md:inline">Copiar</span>
            </button>
            <button onclick="deleteNote('${note.id}')" title="Eliminar nota" class="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        <div>
          <textarea 
            rows="4" 
            placeholder="Escribe aquí las notas, ideas o apuntes para ${client}..." 
            oninput="updateNoteContent('${note.id}', this.value)"
            class="w-full bg-slate-950/70 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition font-sans leading-relaxed resize-y"
          >${escapeHtml(note.content || '')}</textarea>
        </div>
      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

function addNewNoteForActiveClient() {
  const client = state.activeNotesClient;
  if (!client) return;

  if (!state.notes[client]) {
    state.notes[client] = [];
  }

  const newNote = {
    id: 'note-' + Date.now(),
    title: 'Nueva Nota',
    content: '',
    updatedAt: new Date().toISOString()
  };

  state.notes[client].unshift(newNote);
  saveState();
  renderNotesClientTabs();
  renderNotesForActiveClient();
}

function updateNoteTitle(noteId, title) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (note) {
    note.title = title;
    note.updatedAt = new Date().toISOString();
    saveState();
  }
}

function updateNoteContent(noteId, content) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (note) {
    note.content = content;
    note.updatedAt = new Date().toISOString();
    saveState();
  }
}

function deleteNote(noteId) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  if (confirm('¿Deseas eliminar esta nota?')) {
    state.notes[client] = state.notes[client].filter(n => n.id !== noteId);
    saveState();
    renderNotesClientTabs();
    renderNotesForActiveClient();
  }
}

function copyNoteContent(noteId, btnElement) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (note) {
    const textToCopy = `${note.title ? note.title + '\n\n' : ''}${note.content || ''}`;
    copyTextToClipboard(textToCopy, btnElement);
  }
}

// ==========================================
// CALCULADORA DE VIRALIDAD DE CONTENIDO
// ==========================================

function setupViralCalcEventListeners() {
  const criteriaIds = [
    'viralCritNino',
    'viralCrit50de100',
    'viralCritRefViral',
    'viralCritMercadoViral',
    'viralCritTendencia',
    'viralCritControversia'
  ];

  criteriaIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calculateViralScore);
    }
  });

  const formatRadios = document.querySelectorAll('input[name="viralFormatoRadio"]');
  formatRadios.forEach(radio => {
    radio.addEventListener('change', calculateViralScore);
  });

  const presetSelect = document.getElementById('viralPresetSelect');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => handleViralPresetChange(e.target.value));
  }

  const btnReset = document.getElementById('btnResetViralCalc');
  if (btnReset) {
    btnReset.addEventListener('click', resetViralCalculator);
  }

  const btnSave = document.getElementById('btnSaveViralEvaluation');
  if (btnSave) {
    btnSave.addEventListener('click', saveCurrentViralEvaluation);
  }

  const btnConvert = document.getElementById('btnConvertViralToScript');
  if (btnConvert) {
    btnConvert.addEventListener('click', () => convertViralEvalToScript());
  }

  const btnCopy = document.getElementById('btnCopyViralCalcSummary');
  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      copyViralSummary(this);
    });
  }

  const btnExportCSV = document.getElementById('btnExportViralCSV');
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', exportViralEvaluationsCSV);
  }

  const btnClearHist = document.getElementById('btnClearViralHistory');
  if (btnClearHist) {
    btnClearHist.addEventListener('click', clearViralHistory);
  }

  const btnToggle = document.getElementById('btnToggleViralHistory');
  if (btnToggle) {
    btnToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleViralHistory();
    });
  }

  const headerBar = document.getElementById('viralHistoryHeaderBar');
  if (headerBar) {
    headerBar.addEventListener('click', (e) => {
      if (!e.target.closest('#btnExportViralCSV') && !e.target.closest('#btnClearViralHistory') && !e.target.closest('#btnToggleViralHistory')) {
        toggleViralHistory();
      }
    });
  }

  const btnOpenFromForm = document.getElementById('btnOpenViralHistoryFromForm');
  if (btnOpenFromForm) {
    btnOpenFromForm.addEventListener('click', (e) => {
      e.preventDefault();
      toggleViralHistory(true);
    });
  }

  // Live title typing doesn't require recalculating score, but ensures smooth experience
  const titleInput = document.getElementById('viralIdeaTitle');
  if (titleInput) {
    titleInput.addEventListener('input', () => {});
  }
}

function getCurrentViralFormData() {
  const titleInput = document.getElementById('viralIdeaTitle');
  const clientSelect = document.getElementById('viralIdeaClient');
  const linkInput = document.getElementById('viralIdeaLink');

  const title = titleInput ? titleInput.value.trim() : '';
  const client = clientSelect ? clientSelect.value : (state.clients[0] || 'Jennil');
  const link = linkInput ? linkInput.value.trim() : '';

  const nino = document.getElementById('viralCritNino')?.checked || false;
  const cincuenta = document.getElementById('viralCrit50de100')?.checked || false;
  const refViral = document.getElementById('viralCritRefViral')?.checked || false;
  const mercadoViral = document.getElementById('viralCritMercadoViral')?.checked || false;
  const tendencia = document.getElementById('viralCritTendencia')?.checked || false;
  const controversia = document.getElementById('viralCritControversia')?.checked || false;

  const selectedFormatRadio = document.querySelector('input[name="viralFormatoRadio"]:checked');
  const format = selectedFormatRadio ? selectedFormatRadio.value : 'Hablando a cámara';

  // Criteria score calculation (Max 10.0 pts)
  let criteriaScore = 0;
  if (nino) criteriaScore += 2.5;
  if (cincuenta) criteriaScore += 2.5;
  if (refViral) criteriaScore += 2.0;
  if (mercadoViral) criteriaScore += 0.5;
  if (tendencia) criteriaScore += 1.5;
  if (controversia) criteriaScore += 1.0;

  // Format bonus calculation (Max 4.0 pts)
  const formatScore = getPointsForFormat(format);

  const totalScore = parseFloat((criteriaScore + formatScore).toFixed(1));

  let potential = "Bajo";
  if (totalScore >= 10.0) {
    potential = "Muy Alto / Viral";
  } else if (totalScore >= 7.0) {
    potential = "Medio";
  }

  return {
    title,
    client,
    link,
    criteria: {
      nino,
      cincuenta,
      refViral,
      mercadoViral,
      tendencia,
      controversia
    },
    format,
    criteriaScore: parseFloat(criteriaScore.toFixed(1)),
    formatScore: parseFloat(formatScore.toFixed(1)),
    totalScore,
    potential
  };
}

function calculateViralScore() {
  const data = getCurrentViralFormData();

  const scoreDisplay = document.getElementById('viralScoreDisplay');
  const percentBadge = document.getElementById('viralScorePercentBadge');
  const progressBar = document.getElementById('viralScoreProgressBar');
  const verdictContainer = document.getElementById('viralVerdictContainer');
  const verdictIcon = document.getElementById('viralVerdictIcon');
  const verdictTitle = document.getElementById('viralVerdictTitle');
  const verdictDesc = document.getElementById('viralVerdictDesc');
  const breakdownCriterios = document.getElementById('viralBreakdownCriterios');
  const breakdownFormato = document.getElementById('viralBreakdownFormato');
  const tipsContainer = document.getElementById('viralTipsContainer');

  if (!scoreDisplay) return;

  const percent = Math.min(100, Math.round((data.totalScore / 14.5) * 100));

  scoreDisplay.textContent = data.totalScore.toFixed(1);
  if (percentBadge) percentBadge.textContent = `${percent}%`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  if (breakdownCriterios) {
    breakdownCriterios.textContent = `${data.criteriaScore.toFixed(1)} / 10.0 pts`;
  }
  if (breakdownFormato) {
    breakdownFormato.textContent = `${data.formatScore.toFixed(1)} / 4.5 pts`;
  }

  // Verdict box styling
  if (verdictContainer && verdictTitle && verdictDesc && verdictIcon) {
    if (data.totalScore >= 10.0) {
      verdictContainer.className = "p-4 rounded-xl border transition space-y-2 bg-emerald-950/30 border-emerald-500/40";
      verdictIcon.className = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-emerald-500/20 text-emerald-400";
      verdictIcon.innerHTML = "✓";
      verdictTitle.className = "text-sm sm:text-base font-bold text-emerald-300";
      verdictTitle.textContent = "🟢 Potencial Muy Alto / Viral (10.0 - 14.5 pts)";
      verdictDesc.textContent = "¡Candidato óptimo a escalar y volverse viral! Cumple con los pilares de atracción masiva, alta retención e inmersión psicológica. Muy recomendado para grabar de inmediato.";
    } else if (data.totalScore >= 7.0) {
      verdictContainer.className = "p-4 rounded-xl border transition space-y-2 bg-amber-950/30 border-amber-500/40";
      verdictIcon.className = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-amber-500/20 text-amber-400";
      verdictIcon.innerHTML = "★";
      verdictTitle.className = "text-sm sm:text-base font-bold text-amber-300";
      verdictTitle.textContent = "🟡 Potencial Medio (7.0 - 9.5 pts)";
      verdictDesc.textContent = "Buen contenido para audiencia cautiva o nicho específico. Aportará gran valor y retención, aunque su distribución orgánica masiva a audiencia fría es moderada.";
    } else {
      verdictContainer.className = "p-4 rounded-xl border transition space-y-2 bg-rose-950/30 border-rose-500/40";
      verdictIcon.className = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-rose-500/20 text-rose-400";
      verdictIcon.innerHTML = "!";
      verdictTitle.className = "text-sm sm:text-base font-bold text-rose-300";
      verdictTitle.textContent = "🔴 Potencial Bajo (0.0 - 6.5 pts)";
      verdictDesc.textContent = "Poco alcance orgánico predecible. Recomendamos simplificar la idea para que cualquiera la entienda, buscar un formato de mayor inmersión (POV, Vlog, Dinámico) o validar referencias virales previas.";
    }
  }

  // Generate dynamic optimization tips
  if (tipsContainer) {
    const tips = [];
    if (!data.criteria.nino) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold">💡 +2.5 pts:</span> <span>Simplifica la idea para que un <strong>niño de 5 años</strong> la comprenda sin tecnicismos.</span></div>`);
    }
    if (!data.criteria.cincuenta) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold">💡 +2.5 pts:</span> <span>Amplía el ángulo para que le interese a <strong>50 de 100 personas</strong> (apela al bolsillo, curiosidad o salud).</span></div>`);
    }
    if (!data.criteria.refViral) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold">💡 +2.0 pts:</span> <span>Busca una <strong>referencia viral previa</strong> en TikTok/Reels que valide el formato o gancho.</span></div>`);
    }
    if (data.formatScore < 3.5) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-emerald-400 font-bold">📹 +3.5 a +4.5 pts:</span> <span>Prueba formatos de <strong>Inmersión Total (Grupo 1)</strong> como <strong>Formato POV (+4.5)</strong>, <strong>Formato Vlog (+4.0)</strong> o <strong>Formato Dinámico (+3.5)</strong>.</span></div>`);
    }
    if (!data.criteria.tendencia) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold">💡 +1.5 pts:</span> <span>Conecta el tema con una <strong>tendencia actual</strong> o fecha coyuntural relevante.</span></div>`);
    }
    if (!data.criteria.controversia) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold">💡 +1.0 pts:</span> <span>Añade una pregunta polarizante al final para generar <strong>debate en comentarios</strong>.</span></div>`);
    }

    if (tips.length === 0) {
      tipsContainer.innerHTML = `<p class="text-emerald-400 font-semibold">🔥 ¡Puntuación perfecta de 14.5/14.5 pts! Esta idea tiene todos los componentes de un video viral masivo.</p>`;
    } else {
      tipsContainer.innerHTML = tips.slice(0, 3).join('');
    }
  }
}

function handleViralPresetChange(presetKey) {
  if (!presetKey) return;

  const presets = {
    'example-miami': {
      title: '¿Cuánto gastas al mes en Miami?',
      client: 'Jennil',
      criteria: { nino: true, cincuenta: true, refViral: true, mercadoViral: true, tendencia: false, controversia: true },
      format: 'Formato entrevista'
    },
    'example-tarjeta': {
      title: 'Deja de pagar por tu tarjeta hasta que no hagas esto',
      client: 'Jennil',
      criteria: { nino: false, cincuenta: true, refViral: true, mercadoViral: true, tendencia: false, controversia: false },
      format: 'Formato entrevista'
    },
    'example-navidad': {
      title: 'Cómo no engordar en navidad comiendo lo que quieras',
      client: 'Natalia',
      criteria: { nino: true, cincuenta: true, refViral: false, mercadoViral: true, tendencia: true, controversia: true },
      format: 'Formato Vlog'
    },
    'example-1000': {
      title: '3 Secretos para conseguir $1,000 en 30 días',
      client: 'Jennil',
      criteria: { nino: true, cincuenta: true, refViral: true, mercadoViral: true, tendencia: false, controversia: false },
      format: 'Formato POV'
    },
    'example-credito': {
      title: 'Estrategia de contenido y crecimiento',
      client: 'Natalia',
      criteria: { nino: false, cincuenta: true, refViral: true, mercadoViral: true, tendencia: false, controversia: false },
      format: 'Hablando a cámara'
    }
  };

  const preset = presets[presetKey];
  if (!preset) return;

  if (document.getElementById('viralIdeaTitle')) {
    document.getElementById('viralIdeaTitle').value = preset.title;
  }
  if (document.getElementById('viralIdeaClient') && state.clients.includes(preset.client)) {
    document.getElementById('viralIdeaClient').value = preset.client;
  }

  document.getElementById('viralCritNino').checked = preset.criteria.nino;
  document.getElementById('viralCrit50de100').checked = preset.criteria.cincuenta;
  document.getElementById('viralCritRefViral').checked = preset.criteria.refViral;
  document.getElementById('viralCritMercadoViral').checked = preset.criteria.mercadoViral;
  document.getElementById('viralCritTendencia').checked = preset.criteria.tendencia;
  document.getElementById('viralCritControversia').checked = preset.criteria.controversia;

  const targetRadio = document.querySelector(`input[name="viralFormatoRadio"][value="${preset.format}"]`) || document.querySelector(`input[name="viralFormatoRadio"]`);
  if (targetRadio) {
    targetRadio.checked = true;
  }

  calculateViralScore();
}

function resetViralCalculator() {
  if (document.getElementById('viralIdeaTitle')) document.getElementById('viralIdeaTitle').value = '';
  if (document.getElementById('viralIdeaLink')) document.getElementById('viralIdeaLink').value = '';
  if (document.getElementById('viralPresetSelect')) document.getElementById('viralPresetSelect').value = '';

  document.getElementById('viralCritNino').checked = false;
  document.getElementById('viralCrit50de100').checked = false;
  document.getElementById('viralCritRefViral').checked = false;
  document.getElementById('viralCritMercadoViral').checked = false;
  document.getElementById('viralCritTendencia').checked = false;
  document.getElementById('viralCritControversia').checked = false;

  const defaultRadio = document.querySelector('input[name="viralFormatoRadio"][value="Formato entrevista"]') || document.querySelector('input[name="viralFormatoRadio"]');
  if (defaultRadio) defaultRadio.checked = true;

  calculateViralScore();
}

function saveCurrentViralEvaluation() {
  const data = getCurrentViralFormData();

  if (!data.title) {
    alert('Por favor, escribe un título o idea para guardar la evaluación.');
    const titleInput = document.getElementById('viralIdeaTitle');
    if (titleInput) titleInput.focus();
    return;
  }

  const newEval = {
    id: 'viral-' + Date.now(),
    title: data.title,
    client: data.client,
    link: data.link,
    criteria: data.criteria,
    format: data.format,
    criteriaScore: data.criteriaScore,
    formatScore: data.formatScore,
    totalScore: data.totalScore,
    potential: data.potential,
    createdAt: new Date().toISOString()
  };

  if (!state.viralEvaluations) {
    state.viralEvaluations = [];
  }

  // Prepend to list
  state.viralEvaluations.unshift(newEval);
  saveState();
  renderViralHistoryTable();
  
  // Auto-switch to history tab so user sees newly added entry
  switchViralTab('hist');

  // Button feedback
  const btnSave = document.getElementById('btnSaveViralEvaluation');
  if (btnSave) {
    const originalHTML = btnSave.innerHTML;
    btnSave.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> ¡Guardado en Historial!`;
    btnSave.classList.add('bg-emerald-500', 'text-slate-950');
    refreshLucideIcons();
    setTimeout(() => {
      btnSave.innerHTML = originalHTML;
      btnSave.classList.remove('bg-emerald-500', 'text-slate-950');
      refreshLucideIcons();
    }, 2000);
  }
}

function switchViralTab(tabName) {
  const vEval = document.getElementById('subViewViralEval');
  const vHist = document.getElementById('subViewViralHist');
  const tEval = document.getElementById('tabViralEval');
  const tHist = document.getElementById('tabViralHist');

  const activeEvalClass = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition bg-amber-500 text-slate-950 shadow-md cursor-pointer";
  const activeHistClass = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition bg-sky-500 text-white shadow-md cursor-pointer";
  const inactiveClass = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition text-slate-400 hover:text-white cursor-pointer";

  if (tabName === 'hist') {
    if (vEval) vEval.classList.add('hidden');
    if (vHist) vHist.classList.remove('hidden');
    if (tEval) tEval.className = inactiveClass;
    if (tHist) tHist.className = activeHistClass;
    renderViralHistoryTable();
  } else {
    // default: 'eval'
    if (vHist) vHist.classList.add('hidden');
    if (vEval) vEval.classList.remove('hidden');
    if (tEval) tEval.className = activeEvalClass;
    if (tHist) tHist.className = inactiveClass;
  }
  refreshLucideIcons();
}

function toggleViralHistory(forceState = null) {
  switchViralTab('hist');
}

function toggleViralHistoryCollapse(forceOpen = null) {
  switchViralTab('hist');
}

window.switchViralTab = switchViralTab;
window.toggleViralHistory = toggleViralHistory;
window.toggleViralHistoryCollapse = toggleViralHistoryCollapse;

function renderViralHistoryTable() {
  const tableBody = document.getElementById('viralHistoryTableBody');
  const counter = document.getElementById('viralHistoryCounter');
  const badge = document.getElementById('viralHistoryCountBadge');
  const tabBadge = document.getElementById('viralHistTabBadge');
  if (!tableBody) return;

  const evals = state.viralEvaluations || [];

  if (tabBadge) {
    tabBadge.textContent = evals.length;
  }

  if (badge) {
    badge.textContent = `${evals.length} idea${evals.length === 1 ? '' : 's'}`;
  }

  if (counter) {
    counter.textContent = `${evals.length} idea${evals.length === 1 ? '' : 's'} evaluada(s) (ordenadas por mayor puntuación)`;
  }

  if (evals.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-slate-500 text-xs">
          No hay evaluaciones guardadas en el historial. Evalúa una idea arriba y haz clic en "Guardar Evaluación".
        </td>
      </tr>
    `;
    return;
  }

  // Sort descending by score
  const sorted = [...evals].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  tableBody.innerHTML = sorted.map((item, index) => {
    let potentialBadgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (item.totalScore >= 10.0) {
      potentialBadgeClass = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold";
    } else if (item.totalScore >= 7.0) {
      potentialBadgeClass = "bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold";
    }

    const formatLabels = {
      'Formato POV': '👀 POV (+4.5)',
      'Formato Vlog': '📹 Vlog (+4.0)',
      'Formato Dinámico': '⚡ Dinámico (+3.5)',
      'Formato prima pregunta': '❓ Prima Pregunta (+3.5)',
      'Formato entrevista': '🎙️ Entrevista (+3.0)',
      'Formato mirando a la nada': '👁️ Mirando a la nada (+2.5)',
      'Formato pantalla dividida': '📱 Pantalla dividida (+2.5)',
      'Formato pantalla verde': '🟩 Pantalla verde (+2.0)',
      'Formato selfie': '🤳 Selfie (+1.5)',
      'Hablando a cámara': '🗣️ Hablando a cámara (+1.0)',
      // legacy / alias keys
      'pov': '👀 POV (+4.5)',
      'vlog': '📹 Vlog (+4.0)',
      'dinamico': '⚡ Dinámico (+3.5)',
      'entrevista': '🎙️ Entrevista (+3.0)',
      'talking_head': '🗣️ Hablando a cámara (+1.0)'
    };

    const criteriaTags = [];
    if (item.criteria?.nino) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Niño de 5 años">👶 Niño</span>');
    if (item.criteria?.cincuenta) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="50 de 100">👥 50/100</span>');
    if (item.criteria?.refViral) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Referencia viral">🚀 Ref</span>');
    if (item.criteria?.mercadoViral) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Mercado viral">🌐 Mercado</span>');
    if (item.criteria?.tendencia) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Tendencia">📈 Trend</span>');
    if (item.criteria?.controversia) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Controversia">🔥 Debate</span>');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-3 text-center font-bold text-slate-400">#${index + 1}</td>
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="text-sm font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            ${(item.totalScore || 0).toFixed(1)} <span class="text-[10px] text-slate-400 font-normal">/14.5</span>
          </span>
        </td>
        <td class="py-3 px-4 font-semibold text-white max-w-xs">
          <div class="truncate" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mt-0.5"><i data-lucide="external-link" class="w-3 h-3"></i> Referencia</a>` : ''}
        </td>
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">${item.client || 'General'}</span>
        </td>
        <td class="py-3 px-3 whitespace-nowrap text-xs text-slate-300 font-medium">
          ${formatLabels[item.format] || item.format}
        </td>
        <td class="py-3 px-3">
          <div class="flex flex-wrap gap-1 max-w-xs">
            ${criteriaTags.length > 0 ? criteriaTags.join('') : '<span class="text-slate-600 text-[10px]">Ninguno</span>'}
          </div>
        </td>
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="text-xs px-2 py-0.5 rounded-full border ${potentialBadgeClass}">
            ${item.potential}
          </span>
        </td>
        <td class="py-3 px-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1">
            <button onclick="convertViralEvalToScriptById('${item.id}')" title="Convertir a Guión" class="p-1.5 text-brand-400 hover:text-white hover:bg-brand-600/30 rounded-lg transition">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
            </button>
            <button onclick="loadViralEvaluationIntoCalc('${item.id}')" title="Cargar en Calculadora" class="p-1.5 text-amber-400 hover:text-white hover:bg-amber-600/30 rounded-lg transition">
              <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
            <button onclick="copyViralEvaluationRow('${item.id}', this)" title="Copiar resumen" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
              <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteViralEvaluation('${item.id}')" title="Eliminar evaluación" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  refreshLucideIcons();
}

function loadViralEvaluationIntoCalc(evalId) {
  const evals = state.viralEvaluations || [];
  const item = evals.find(e => e.id === evalId);
  if (!item) return;

  if (document.getElementById('viralIdeaTitle')) {
    document.getElementById('viralIdeaTitle').value = item.title || '';
  }
  if (document.getElementById('viralIdeaLink')) {
    document.getElementById('viralIdeaLink').value = item.link || '';
  }
  if (document.getElementById('viralIdeaClient') && state.clients.includes(item.client)) {
    document.getElementById('viralIdeaClient').value = item.client;
  }

  document.getElementById('viralCritNino').checked = !!item.criteria?.nino;
  document.getElementById('viralCrit50de100').checked = !!item.criteria?.cincuenta;
  document.getElementById('viralCritRefViral').checked = !!item.criteria?.refViral;
  document.getElementById('viralCritMercadoViral').checked = !!item.criteria?.mercadoViral;
  document.getElementById('viralCritTendencia').checked = !!item.criteria?.tendencia;
  document.getElementById('viralCritControversia').checked = !!item.criteria?.controversia;

  const normalizedFmt = normalizeScriptFormat(item.format);
  const targetRadio = document.querySelector(`input[name="viralFormatoRadio"][value="${item.format}"]`) || document.querySelector(`input[name="viralFormatoRadio"][value="${normalizedFmt}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
  }

  calculateViralScore();
  switchViralTab('eval');

  // Smooth scroll to top of calculator
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteViralEvaluation(evalId) {
  if (confirm('¿Deseas eliminar esta evaluación del historial?')) {
    state.viralEvaluations = (state.viralEvaluations || []).filter(e => e.id !== evalId);
    saveState();
    renderViralHistoryTable();
  }
}

function clearViralHistory() {
  if (confirm('⚠️ ¿Estás seguro de que deseas vaciar todo el historial de ideas evaluadas?')) {
    state.viralEvaluations = [];
    saveState();
    renderViralHistoryTable();
  }
}

function convertViralEvalToScript(evalData = null) {
  const data = evalData || getCurrentViralFormData();
  const ideaTitle = data.title || 'Nueva Idea Viral';
  const clientName = data.client || (state.clients[0] || 'Jennil');
  
  const mappedFormat = normalizeScriptFormat(data.format);

  openNewScriptModal();
  if (document.getElementById('formIdeaGanadora')) {
    document.getElementById('formIdeaGanadora').value = ideaTitle;
  }
  if (document.getElementById('formClient')) {
    document.getElementById('formClient').value = clientName;
    populateActorOptions(clientName);
  }
  if (document.getElementById('formFormato')) {
    document.getElementById('formFormato').value = mappedFormat;
  }
  if (document.getElementById('formLinkReferencia') && data.link) {
    document.getElementById('formLinkReferencia').value = data.link;
  }
  if (document.getElementById('formGancho')) {
    document.getElementById('formGancho').value = ideaTitle;
  }
  if (document.getElementById('formContextoAdicional')) {
    document.getElementById('formContextoAdicional').value = `Score de Viralidad: ${data.totalScore}/14.5 pts (${data.potential})`;
  }
}

function convertViralEvalToScriptById(evalId) {
  const item = (state.viralEvaluations || []).find(e => e.id === evalId);
  if (item) {
    convertViralEvalToScript(item);
  }
}

function copyViralSummary(btnElement) {
  const data = getCurrentViralFormData();
  const summary = `🔥 EVALUACIÓN DE VIRALIDAD - BLEX STUDIO
💡 Idea: "${data.title || 'Idea sin título'}"
👤 Cliente: ${data.client}
📊 Puntuación Total: ${data.totalScore} / 14.5 pts (${Math.round((data.totalScore/14.5)*100)}%)
🎯 Clasificación: Potencial ${data.potential}
📹 Formato: ${data.format} (+${data.formatScore} pts)
Desglose Criterios:
• Niño de 5 años: ${data.criteria.nino ? 'SÍ (+2.5)' : 'NO (0)'}
• 50 de cada 100: ${data.criteria.cincuenta ? 'SÍ (+2.5)' : 'NO (0)'}
• Referencia Viral Previa: ${data.criteria.refViral ? 'SÍ (+2.0)' : 'NO (0)'}
• Mercado Viral: ${data.criteria.mercadoViral ? 'SÍ (+0.5)' : 'NO (0)'}
• Tendencia Actual: ${data.criteria.tendencia ? 'SÍ (+1.5)' : 'NO (0)'}
• Controversia / Debate: ${data.criteria.controversia ? 'SÍ (+1.0)' : 'NO (0)'}`;

  copyTextToClipboard(summary, btnElement);
}

function copyViralEvaluationRow(evalId, btnElement) {
  const item = (state.viralEvaluations || []).find(e => e.id === evalId);
  if (!item) return;

  const summary = `🔥 EVALUACIÓN DE VIRALIDAD: "${item.title}" | Score: ${item.totalScore}/14.5 pts (${item.potential}) | Cliente: ${item.client} | Formato: ${item.format}`;
  copyTextToClipboard(summary, btnElement);
}

function exportViralEvaluationsCSV() {
  const evals = state.viralEvaluations || [];
  if (evals.length === 0) {
    alert('No hay evaluaciones guardadas para exportar.');
    return;
  }

  const headers = ["Ranking", "Titulo", "Cliente", "Puntaje_Total", "Potencial", "Formato", "Puntos_Formato", "Nino_5_Anos", "50_de_100", "Ref_Viral", "Mercado_Viral", "Tendencia", "Controversia", "Fecha"];
  
  const sorted = [...evals].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  const rows = sorted.map((item, idx) => [
    idx + 1,
    `"${(item.title || '').replace(/"/g, '""')}"`,
    `"${item.client || ''}"`,
    item.totalScore,
    `"${item.potential}"`,
    `"${item.format}"`,
    item.formatScore,
    item.criteria?.nino ? 'SI (+2.5)' : 'NO (0)',
    item.criteria?.cincuenta ? 'SI (+2.5)' : 'NO (0)',
    item.criteria?.refViral ? 'SI (+2.0)' : 'NO (0)',
    item.criteria?.mercadoViral ? 'SI (+0.5)' : 'NO (0)',
    item.criteria?.tendencia ? 'SI (+1.5)' : 'NO (0)',
    item.criteria?.controversia ? 'SI (+1.0)' : 'NO (0)',
    `"${item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : ''}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `calculadora_viralidad_blex_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
