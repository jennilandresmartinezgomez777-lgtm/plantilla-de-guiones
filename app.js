
function get64HooksKnowledgeContext() {
  const hooks = getHooksData();
  if (!hooks || hooks.length === 0) return '';

  const hooksSummary = hooks.map(h => 
    `#${h.id} [${h.name}] (Cat: ${h.category}) -> Fórmula: "${h.formula}" | Ejemplo: "${h.example}" | Psicología: ${h.summary}`
  ).join('\n');

  return [
    '=== BASE DE DATOS DE CONOCIMIENTO: 64 GANCHOS VIRALES DE BLEX STUDIO ===',
    'Tienes en tu memoria las 64 fórmulas psicológicas oficiales de BLEX STUDIO. Para cualquier idea o video, selecciona las fórmulas que maximicen la retención en los primeros 3 segundos:',
    hooksSummary,
    '=== FIN BASE DE DATOS 64 GANCHOS ==='
  ].join('\n');
}


// =========================================================================
// CEREBRO & BASE DE CONOCIMIENTO DE LA MARCA (AI TRAINING & BRAND DNA)
// =========================================================================

const DEFAULT_BRAIN_KNOWLEDGE = {
  tone: 'Seguridad absoluta, directo, enérgico, sin rodeos ni tecnicismos aburridos. Hablarle a un amigo que necesita despertar financieramente.',
  audience: 'Emprendedores, inversionistas y personas de 20 a 45 años que buscan libertad financiera, multiplicar ingresos y evitar las trampas del sistema tradicional.',
  keywords: 'activos, libertad financiera, apalancamiento, mentalidad, retención, sistema, velocidad del dinero',
  forbidden: 'dinero fácil, fórmula mágica, suerte, estafa, hacerse rico de la noche a la mañana',
  notes: 'Enfoque en crear sistemas de negocio, salir de deudas malas, invertir en activos y construir fuentes de ingresos sostenibles.',
  examples: '[GANCHO] Si tienes menos de $1,000 en el banco, no hagas esto...\n[HISTORIA] El 90% de la gente piensa que ahorrar es suficiente...\n[MORALEJA] El dinero que no se mueve, pierde valor cada día...\n[CTA] Comenta \'SISTEMA\' y te muestro el paso a paso.',
  docs: []
};

function getActiveClientBrainData(clientName = null) {
  const client = clientName || (document.getElementById('aiBrainClientSelect') ? document.getElementById('aiBrainClientSelect').value : (state.clients[0] || 'Jennil'));
  if (!state.aiBrain) state.aiBrain = {};
  if (!state.aiBrain[client]) {
    state.aiBrain[client] = { ...DEFAULT_BRAIN_KNOWLEDGE, docs: [] };
  }
  return state.aiBrain[client];
}

function renderBrainStudio() {
  populateBrainClientSelect();
  const select = document.getElementById('aiBrainClientSelect');
  const client = select ? select.value : (state.clients[0] || 'Jennil');
  loadBrainForClient(client);
}

function populateBrainClientSelect() {
  const select = document.getElementById('aiBrainClientSelect');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '';
  (state.clients || ['Jennil']).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `👤 ${c}`;
    select.appendChild(opt);
  });
  if (currentVal && state.clients.includes(currentVal)) {
    select.value = currentVal;
  }
}

function loadBrainForClient(clientName) {
  const data = getActiveClientBrainData(clientName);
  
  const toneInput = document.getElementById('aiBrainToneText');
  const audienceInput = document.getElementById('aiBrainAudienceText');
  const keywordsInput = document.getElementById('aiBrainKeywordsInput');
  const forbiddenInput = document.getElementById('aiBrainForbiddenInput');
  const notesInput = document.getElementById('aiBrainKnowledgeNotes');
  const examplesInput = document.getElementById('aiBrainExamplesText');

  if (toneInput) toneInput.value = data.tone || '';
  if (audienceInput) audienceInput.value = data.audience || '';
  if (keywordsInput) keywordsInput.value = data.keywords || '';
  if (forbiddenInput) forbiddenInput.value = data.forbidden || '';
  if (notesInput) notesInput.value = data.notes || '';
  if (examplesInput) examplesInput.value = data.examples || '';

  renderBrainDocsList(data.docs || []);
  refreshLucideIcons();
}

function applyBrainTonePreset(preset) {
  const toneInput = document.getElementById('aiBrainToneText');
  if (!toneInput) return;

  if (preset === 'DIRECT') {
    toneInput.value = '🥊 Directo, contundente y sin rodeos. Cero introducciones largas, afirmaciones de alto impacto y ritmo rápido.';
  } else if (preset === 'STORYTELLING') {
    toneInput.value = '📖 Storytelling cinematográfico, vulnerabilidad estratégica y anécdotas personales de superación que enganchan desde el segundo 0.';
  } else if (preset === 'EDUCATIVO') {
    toneInput.value = '🧠 Educativo, simple y visual. Explicar conceptos financieros complejos como si fuera para un niño de 5 años.';
  } else if (preset === 'DISRUPTIVO') {
    toneInput.value = '🔥 Disruptivo, polémico y anti-sistema. Desafiar lo que enseña la escuela y la televisión sobre el dinero y el trabajo tradicional.';
  }
}

async function handleBrainFileSelect(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const select = document.getElementById('aiBrainClientSelect');
  const client = select ? select.value : (state.clients[0] || 'Jennil');
  const brainData = getActiveClientBrainData(client);
  if (!brainData.docs) brainData.docs = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const att = await readFileAsAttachment(file);
      brainData.docs.push(att);
    } catch (err) {
      console.error('Error attaching doc to brain:', err);
    }
  }

  event.target.value = '';
  saveState();
  renderBrainDocsList(brainData.docs);
  showToast('Documento añadido a la base de conocimiento de la IA.', 'success');
}

function removeBrainDoc(idx) {
  const select = document.getElementById('aiBrainClientSelect');
  const client = select ? select.value : (state.clients[0] || 'Jennil');
  const brainData = getActiveClientBrainData(client);
  if (brainData.docs && idx >= 0 && idx < brainData.docs.length) {
    brainData.docs.splice(idx, 1);
    saveState();
    renderBrainDocsList(brainData.docs);
  }
}

function renderBrainDocsList(docs) {
  const container = document.getElementById('aiBrainDocsList');
  if (!container) return;

  if (!docs || docs.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = docs.map((d, idx) => {
    return `
      <div class="bg-slate-900 border border-slate-800 rounded-lg pl-2.5 pr-1.5 py-1 flex items-center gap-2 text-xs">
        <i data-lucide="file-text" class="w-3.5 h-3.5 text-emerald-400"></i>
        <span class="text-slate-200 truncate max-w-[140px] font-semibold">${d.name}</span>
        <button type="button" onclick="removeBrainDoc(${idx})" class="text-slate-500 hover:text-rose-400 p-0.5 rounded transition">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

function saveActiveClientBrain() {
  const select = document.getElementById('aiBrainClientSelect');
  const client = select ? select.value : (state.clients[0] || 'Jennil');
  
  const brainData = getActiveClientBrainData(client);
  brainData.tone = document.getElementById('aiBrainToneText')?.value || '';
  brainData.audience = document.getElementById('aiBrainAudienceText')?.value || '';
  brainData.keywords = document.getElementById('aiBrainKeywordsInput')?.value || '';
  brainData.forbidden = document.getElementById('aiBrainForbiddenInput')?.value || '';
  brainData.notes = document.getElementById('aiBrainKnowledgeNotes')?.value || '';
  brainData.examples = document.getElementById('aiBrainExamplesText')?.value || '';
  brainData.updatedAt = new Date().toISOString();

  saveState();

  const statusText = document.getElementById('aiBrainStatusText');
  if (statusText) {
    statusText.innerHTML = `<span class="text-emerald-400 font-bold">✓ ¡Cerebro de ${client} guardado y activo para todas las generaciones de IA!</span>`;
    setTimeout(() => {
      statusText.textContent = 'Toda la información se inyecta automáticamente en el Creador de Reels y Auditor de Viralidad.';
    }, 3000);
  }

  showToast(`Cerebro de ${client} actualizado con éxito.`, 'success');
}

async function testBrainIntelligence() {
  const select = document.getElementById('aiBrainClientSelect');
  const client = select ? select.value : (state.clients[0] || 'Jennil');
  const brain = getActiveClientBrainData(client);

  const prompt = `Actúa como el creador de contenido "${client}".
Información de tu personalidad aprendida:
- Tono: ${brain.tone}
- Audiencia: ${brain.audience}
- Palabras clave: ${brain.keywords}
- Conceptos y educación: ${brain.notes}

Escribe un mensaje de saludo ultra profesional y 1 gancho viral de 1 frase demostrando que has aprendido este tono.`;

  try {
    showToast('Consultando a Qwen 2.5 en tu PC...', 'info');
    const response = await callOllama(prompt, 0.7);
    alert(`🧠 RESPUESTA DE QWEN 2.5 (Personalidad de ${client}):\n\n${response}`);
  } catch (err) {
    alert('No se pudo conectar con Qwen 2.5. Asegúrate de tener el servidor activo en el PC.');
  }
}

function getBrandDnaPromptSnippet(clientName) {
  const client = clientName || 'Jennil';
  const brain = (state.aiBrain && state.aiBrain[client]) ? state.aiBrain[client] : DEFAULT_BRAIN_KNOWLEDGE;
  return [
    '=== ADN Y EDUCACIÓN APRENDIDA DE LA MARCA PARA "' + client + '" ===',
    '- Tono de voz obligatorio: ' + (brain.tone || 'Directo y contundente'),
    '- Audiencia objetivo: ' + (brain.audience || 'Emprendedores e interesados en finanzas'),
    '- Palabras clave recomendadas: ' + (brain.keywords || 'activos, mentalidad, libertad financiera'),
    (brain.forbidden ? '- Palabras prohibidas a evitar: ' + brain.forbidden : ''),
    (brain.notes ? '- Conocimiento y directrices clave: ' + brain.notes : ''),
    (brain.examples ? '- Estilo de referencia:\n' + brain.examples : '')
  ].filter(Boolean).join('\n');
}


// =========================================================================
// CATÁLOGO COMPLETO DE 64 GANCHOS VIRALES BLEX STUDIO
// =========================================================================

function getHooksData() {
  if (typeof BLEX_VIRAL_HOOKS_64 !== 'undefined' && Array.isArray(BLEX_VIRAL_HOOKS_64)) {
    return BLEX_VIRAL_HOOKS_64;
  }
  return [];
}

function filterAiCatalog() {
  const searchInput = document.getElementById('aiCatalogSearchInput');
  const catFilter = document.getElementById('aiCatalogCategoryFilter');
  
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = catFilter ? catFilter.value : 'ALL';

  const allHooks = getHooksData();
  
  const filtered = allHooks.filter(hook => {
    // Category match
    let matchesCategory = true;
    if (category !== 'ALL') {
      const hookCat = (hook.category || '').toLowerCase();
      const targetCat = category.toLowerCase();
      matchesCategory = hookCat.includes(targetCat);
    }

    if (!matchesCategory) return false;

    // Search query match
    if (!query) return true;
    const nameMatch = (hook.name || '').toLowerCase().includes(query);
    const summaryMatch = (hook.summary || '').toLowerCase().includes(query);
    const formulaMatch = (hook.formula || '').toLowerCase().includes(query);
    const exampleMatch = (hook.example || '').toLowerCase().includes(query);
    const catMatch = (hook.category || '').toLowerCase().includes(query);

    return nameMatch || summaryMatch || formulaMatch || exampleMatch || catMatch;
  });

  renderAiCatalogGrid(filtered);
}

function renderAiCatalog() {
  filterAiCatalog();
}

function renderAiCatalogGrid(hooks) {
  const grid = document.getElementById('aiCatalogGrid');
  if (!grid) return;

  if (!hooks || hooks.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 p-6 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
          <i data-lucide="search-x" class="w-6 h-6"></i>
        </div>
        <h4 class="text-base font-bold text-white">No se encontraron ganchos</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Intenta con otra palabra clave o selecciona 'Todas las Categorías'.</p>
        <button onclick="resetAiCatalogFilters()" class="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer">
          Restablecer Filtros
        </button>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  grid.innerHTML = hooks.map(hook => {
    return `
      <div class="bg-slate-950 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group shadow-lg hover:shadow-cyan-950/20 space-y-4">
        
        <!-- Top Meta: ID + Category + Copy -->
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600/30 to-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-mono font-extrabold text-xs flex items-center justify-center shadow-sm">
                #${hook.id}
              </span>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800/90 text-purple-300 border border-purple-500/30">
                ${hook.category}
              </span>
            </div>
            <button onclick="copyHookComplete('${hook.id}', this)" title="Copiar gancho y fórmula" class="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-1.5 rounded-lg border border-slate-800 transition cursor-pointer">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Name & Purpose -->
          <div>
            <h4 class="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition leading-snug">
              ${hook.name}
            </h4>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">
              ${hook.summary}
            </p>
          </div>
        </div>

        <!-- Formula & Example Boxes -->
        <div class="space-y-2.5">
          <!-- Formula -->
          <div class="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">
              <i data-lucide="code" class="w-3 h-3 text-purple-400"></i>
              <span>Fórmula Psicológica:</span>
            </div>
            <p class="text-xs font-mono font-medium text-slate-200 leading-relaxed break-words select-all">
              ${hook.formula}
            </p>
          </div>

          <!-- Real Example -->
          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              <i data-lucide="sparkles" class="w-3 h-3 text-cyan-400"></i>
              <span>Ejemplo Práctico:</span>
            </div>
            <p class="text-xs font-semibold text-cyan-200 italic leading-relaxed select-all">
              "${hook.example}"
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button onclick="createQuickIdeaFromHook('${hook.id}')" title="Crear nueva idea en tu tablero con este gancho" class="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-bold py-2 px-2.5 rounded-xl border border-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>Nueva Idea</span>
          </button>

          <button onclick="useCatalogHookInWizard('${hook.id}')" title="Cargar esta fórmula en el Creador de Reels IA" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-950/50">
            <i data-lucide="wand-2" class="w-3.5 h-3.5 text-cyan-200"></i>
            <span>Usar con IA</span>
          </button>
        </div>

      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

function resetAiCatalogFilters() {
  const searchInput = document.getElementById('aiCatalogSearchInput');
  const catFilter = document.getElementById('aiCatalogCategoryFilter');
  if (searchInput) searchInput.value = '';
  if (catFilter) catFilter.value = 'ALL';
  filterAiCatalog();
}

function copyHookComplete(hookId, btnElement) {
  const allHooks = getHooksData();
  const hook = allHooks.find(h => String(h.id) === String(hookId));
  if (!hook) return;

  const textToCopy = `Gancho #${hook.id}: ${hook.name}\nCategoría: ${hook.category}\n\nFórmula:\n${hook.formula}\n\nEjemplo Real:\n"${hook.example}"\n\nExplicación:\n${hook.summary}`;
  copyTextToClipboard(textToCopy, btnElement);
}

function createQuickIdeaFromHook(hookId) {
  const allHooks = getHooksData();
  const hook = allHooks.find(h => String(h.id) === String(hookId));
  if (!hook) return;

  openQuickIdeaModal();

  const titleInput = document.getElementById('quickIdeaTitle');
  const notesInput = document.getElementById('quickIdeaNotes');

  if (titleInput) {
    titleInput.value = `[${hook.name}] ${hook.example}`;
  }
  if (notesInput) {
    notesInput.value = `Fórmula: ${hook.formula}\nCategoría: ${hook.category}\nObjetivo: ${hook.summary}`;
  }

  if (titleInput) titleInput.focus();
}

function useCatalogHookInWizard(hookId) {
  const allHooks = getHooksData();
  const hook = allHooks.find(h => String(h.id) === String(hookId));
  if (!hook) return;

  // 1. Save selected hook to wizardState
  wizardState.selectedCatalogHook = hook;
  wizardState.topic = `Fórmula de Gancho #${hook.id}: "${hook.name}" - ${hook.formula} (Ejemplo: "${hook.example}")`;

  // 2. Switch to wizard tab and go to Step 0 (Estrategia)
  switchAiTab('wizard');
  goToWizardStep(0);

  // 3. Pre-fill input topic
  const topicInput = document.getElementById('aiWizardInputTopic');
  if (topicInput) {
    topicInput.value = wizardState.topic;
  }

  // 4. Render dedicated Step 0 Hook Strategy & 1-Click Generation UI
  const container = document.getElementById('wizStrategyCardContainer');
  if (container) {
    const client = document.getElementById('wizClientSelect') ? document.getElementById('wizClientSelect').value : (state.clients[0] || 'Jennil');
    const niche = wizardState.niche || (typeof getEffectiveNiche === 'function' ? getEffectiveNiche() : 'DINERO Y FINANZAS');

    container.innerHTML = `
      <div class="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-2xl p-5 shadow-xl space-y-4">
        
        <!-- Header Banner for Selected Hook -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
              #${hook.id}
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-extrabold text-white">${hook.name}</h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">${hook.category}</span>
              </div>
              <p class="text-xs text-slate-300 mt-0.5">${hook.summary}</p>
            </div>
          </div>
          <button type="button" onclick="switchAiTab('catalog')" class="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1 shrink-0 cursor-pointer">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Cambiar gancho
          </button>
        </div>

        <!-- Formula & Example Reference -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-slate-950/80 border border-purple-500/20 rounded-xl p-3 space-y-1">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <i data-lucide="code" class="w-3 h-3"></i> Fórmula Psicológica Activa:
            </span>
            <p class="text-xs font-mono font-semibold text-slate-200">${hook.formula}</p>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3 h-3"></i> Ejemplo de Referencia:
            </span>
            <p class="text-xs font-semibold text-cyan-200 italic">"${hook.example}"</p>
          </div>
        </div>

        <!-- Interactive Question & Subject Input -->
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <label class="block text-xs font-bold text-amber-300 flex items-center justify-between">
            <span>¿Sobre qué tema específico o producto quieres aplicar este gancho?</span>
            <span class="text-[10px] text-slate-500 font-normal">Para ${client} en ${niche}</span>
          </label>
          <input 
            type="text" 
            id="wizCatalogHookTopicCustom" 
            placeholder="Ej: tarjetas de crédito vs débito, cómo invertir los primeros $100, hábitos para multiplicar ahorros..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-amber-400 outline-none"
          >
          <p class="text-[11px] text-slate-400 leading-snug">
            💡 <em>Puedes escribir el tema exacto que deseas o dejarlo en blanco para que la IA proponga los mejores temas de ${niche}.</em>
          </p>
        </div>

        <!-- Direct Action Buttons -->
        <div class="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button type="button" onclick="generateStrategicAnglesForCatalogHook(${hook.id})" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-purple-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-purple-500/30 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <i data-lucide="compass" class="w-4 h-4 text-purple-400"></i>
            <span>Analizar Estrategia Completa</span>
          </button>
          <button type="button" onclick="generateHooksDirectlyFromCatalogHook(${hook.id})" class="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>Generar 5 Ganchos con esta Fórmula 🚀</span>
          </button>
        </div>

      </div>
    `;

    refreshLucideIcons();
  }

  const step0View = document.getElementById('wizStepView0');
  if (step0View) step0View.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function generateHooksDirectlyFromCatalogHook(hookId) {
  const allHooks = getHooksData();
  const hook = allHooks.find(h => String(h.id) === String(hookId)) || wizardState.selectedCatalogHook;
  if (!hook) return;

  const customTopicInput = document.getElementById('wizCatalogHookTopicCustom');
  const customTopic = customTopicInput ? customTopicInput.value.trim() : '';

  wizardState.selectedCatalogHook = hook;
  wizardState.selectedAngle = `Fórmula #${hook.id}: ${hook.name}`;
  wizardState.topic = customTopic ? `Tema: ${customTopic} (Gancho: ${hook.name} - ${hook.formula})` : `Gancho #${hook.id} (${hook.name}) aplicado a ${wizardState.niche || 'Finanzas y Dinero'}`;

  const badge = document.getElementById('wizBadgeChosenAngle');
  if (badge) {
    badge.innerText = `Gancho #${hook.id}: ${hook.name} · ${customTopic || 'Fórmula Activa'}`;
  }

  goToWizardStep(1);
  await generateWizardStep1Hooks();
}

async function generateStrategicAnglesForCatalogHook(hookId) {
  const allHooks = getHooksData();
  const hook = allHooks.find(h => String(h.id) === String(hookId)) || wizardState.selectedCatalogHook;
  if (!hook) return;

  const customTopicInput = document.getElementById('wizCatalogHookTopicCustom');
  const customTopic = customTopicInput ? customTopicInput.value.trim() : '';

  wizardState.selectedCatalogHook = hook;
  wizardState.topic = customTopic ? `${customTopic} (usando la fórmula de gancho: ${hook.name} - ${hook.formula})` : `Fórmula de gancho: ${hook.name} (${hook.formula})`;

  const topicInput = document.getElementById('aiWizardInputTopic');
  if (topicInput) topicInput.value = wizardState.topic;

  await generateWizardStep0Strategy();
}


// =========================================================================
// UNIVERSAL ATTACHMENTS SUBSYSTEM (PDF, PHOTOS, DOCUMENTS)
// =========================================================================

let scriptPendingAttachments = [];
let quickIdeaPendingAttachments = [];

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getAttachmentIcon(type, name) {
  const isImage = (type && type.startsWith('image/')) || /.(jpg|jpeg|png|webp|gif|svg)$/i.test(name || '');
  const isPdf = (type === 'application/pdf') || /.pdf$/i.test(name || '');
  if (isImage) return 'image';
  if (isPdf) return 'file-text';
  return 'paperclip';
}

async function readFileAsAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      const isImage = file.type.startsWith('image/') || /.(jpg|jpeg|png|webp)$/i.test(file.name);
      
      // Optimize large photos/camera captures to keep storage and sync blazing fast
      if (isImage && file.size > 400 * 1024) {
        const img = new Image();
        img.onload = function() {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve({
            id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: file.name,
            type: 'image/jpeg',
            size: Math.round((compressedDataUrl.length * 3) / 4),
            dataUrl: compressedDataUrl,
            createdAt: new Date().toISOString()
          });
        };
        img.onerror = () => {
          resolve({
            id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            dataUrl: dataUrl,
            createdAt: new Date().toISOString()
          });
        };
        img.src = dataUrl;
      } else {
        resolve({
          id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl: dataUrl,
          createdAt: new Date().toISOString()
        });
      }
    };
    reader.readAsDataURL(file);
  });
}

function openAttachmentPreviewModal(att) {
  if (!att) return;
  const modal = document.getElementById('attachmentPreviewModal');
  const title = document.getElementById('attPreviewTitle');
  const meta = document.getElementById('attPreviewMeta');
  const icon = document.getElementById('attPreviewIcon');
  const content = document.getElementById('attPreviewContent');
  const downloadBtn = document.getElementById('attPreviewDownloadBtn');
  const openNewTabBtn = document.getElementById('attPreviewOpenNewTabBtn');

  if (!modal || !content) return;

  const isImage = (att.type && att.type.startsWith('image/')) || (att.dataUrl && att.dataUrl.startsWith('data:image/'));
  const isPdf = (att.type === 'application/pdf') || (att.dataUrl && att.dataUrl.startsWith('data:application/pdf')) || /.pdf$/i.test(att.name || '');

  if (title) title.textContent = att.name || 'Archivo Adjunto';
  if (meta) meta.textContent = `${isImage ? 'Fotografía / Imagen' : isPdf ? 'Documento PDF' : 'Archivo'} • ${formatFileSize(att.size)}`;

  if (downloadBtn) {
    downloadBtn.href = att.dataUrl || '#';
    downloadBtn.download = att.name || 'archivo';
  }
  if (openNewTabBtn) {
    openNewTabBtn.href = att.dataUrl || '#';
  }

  if (isImage) {
    content.innerHTML = `
      <div class="max-w-full max-h-[75vh] flex items-center justify-center">
        <img src="${att.dataUrl}" alt="${att.name}" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800">
      </div>
    `;
  } else if (isPdf) {
    content.innerHTML = `
      <div class="w-full h-[70vh] flex flex-col items-center justify-center">
        <iframe src="${att.dataUrl}" class="w-full h-full rounded-xl border border-slate-800 bg-white"></iframe>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="text-center p-8 space-y-4">
        <div class="w-16 h-16 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center mx-auto">
          <i data-lucide="file" class="w-8 h-8"></i>
        </div>
        <div>
          <h4 class="text-lg font-bold text-white">${att.name}</h4>
          <p class="text-xs text-slate-400 mt-1">${formatFileSize(att.size)}</p>
        </div>
        <a href="${att.dataUrl}" download="${att.name}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-md">
          <i data-lucide="download" class="w-4 h-4"></i> Descargar Archivo
        </a>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeAttachmentPreviewModal(e) {
  const modal = document.getElementById('attachmentPreviewModal');
  if (modal) modal.classList.add('hidden');
}

// -------------------------------------------------------------------------
// SCRIPT MODAL ATTACHMENTS
// -------------------------------------------------------------------------

async function handleScriptFileSelect(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    try {
      const att = await readFileAsAttachment(files[i]);
      scriptPendingAttachments.push(att);
    } catch (err) {
      console.error('Error reading script file:', err);
    }
  }

  event.target.value = '';
  renderScriptAttachmentsList();
}

function removeScriptAttachment(index) {
  if (index >= 0 && index < scriptPendingAttachments.length) {
    scriptPendingAttachments.splice(index, 1);
    renderScriptAttachmentsList();
  }
}

function renderScriptAttachmentsList() {
  const container = document.getElementById('scriptAttachmentsList');
  if (!container) return;

  if (scriptPendingAttachments.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = scriptPendingAttachments.map((att, idx) => {
    const isImage = (att.type && att.type.startsWith('image/')) || (att.dataUrl && att.dataUrl.startsWith('data:image/'));
    const isPdf = (att.type === 'application/pdf') || /.pdf$/i.test(att.name || '');

    return `
      <div class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 flex items-center justify-between gap-2 transition group">
        <div class="flex items-center gap-2.5 min-w-0 cursor-pointer" onclick="openAttachmentPreviewModal(scriptPendingAttachments[${idx}])">
          ${isImage ? `
            <img src="${att.dataUrl}" alt="${att.name}" class="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0">
          ` : `
            <div class="w-9 h-9 rounded-lg ${isPdf ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'} flex items-center justify-center shrink-0">
              <i data-lucide="${isPdf ? 'file-text' : 'paperclip'}" class="w-4 h-4"></i>
            </div>
          `}
          <div class="min-w-0">
            <p class="text-xs font-semibold text-white truncate group-hover:text-brand-300 transition">${att.name}</p>
            <p class="text-[10px] text-slate-400">${formatFileSize(att.size)} • ${isImage ? 'Foto' : isPdf ? 'PDF' : 'Archivo'}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" onclick="openAttachmentPreviewModal(scriptPendingAttachments[${idx}])" title="Ver" class="p-1 text-slate-400 hover:text-white rounded transition">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
          </button>
          <button type="button" onclick="removeScriptAttachment(${idx})" title="Eliminar" class="p-1 text-slate-400 hover:text-rose-400 rounded transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

// -------------------------------------------------------------------------
// QUICK IDEA ATTACHMENTS
// -------------------------------------------------------------------------

async function handleQuickIdeaFileSelect(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    try {
      const att = await readFileAsAttachment(files[i]);
      quickIdeaPendingAttachments.push(att);
    } catch (err) {
      console.error('Error reading quick idea file:', err);
    }
  }

  event.target.value = '';
  renderQuickIdeaAttachmentsList();
}

function removeQuickIdeaAttachment(index) {
  if (index >= 0 && index < quickIdeaPendingAttachments.length) {
    quickIdeaPendingAttachments.splice(index, 1);
    renderQuickIdeaAttachmentsList();
  }
}

function renderQuickIdeaAttachmentsList() {
  const container = document.getElementById('quickIdeaAttachmentsList');
  if (!container) return;

  if (quickIdeaPendingAttachments.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = quickIdeaPendingAttachments.map((att, idx) => {
    const isImage = (att.type && att.type.startsWith('image/')) || (att.dataUrl && att.dataUrl.startsWith('data:image/'));
    const isPdf = (att.type === 'application/pdf') || /.pdf$/i.test(att.name || '');

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-lg pl-2 pr-1.5 py-1 flex items-center gap-2 text-xs">
        ${isImage ? `
          <img src="${att.dataUrl}" alt="${att.name}" class="w-5 h-5 rounded object-cover border border-slate-700">
        ` : `
          <i data-lucide="${isPdf ? 'file-text' : 'paperclip'}" class="w-3.5 h-3.5 ${isPdf ? 'text-rose-400' : 'text-amber-400'}"></i>
        `}
        <span class="text-slate-200 truncate max-w-[120px] font-medium">${att.name}</span>
        <button type="button" onclick="removeQuickIdeaAttachment(${idx})" class="text-slate-400 hover:text-rose-400 p-0.5 rounded transition">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

// -------------------------------------------------------------------------
// NOTES ATTACHMENTS
// -------------------------------------------------------------------------

async function handleNoteFileSelect(event, noteId) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (!note) return;

  if (!note.attachments) note.attachments = [];

  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    try {
      const att = await readFileAsAttachment(files[i]);
      note.attachments.push(att);
    } catch (err) {
      console.error('Error attaching note file:', err);
    }
  }

  note.updatedAt = new Date().toISOString();
  saveState();
  event.target.value = '';
  renderNotesForActiveClient();
}

function deleteNoteAttachment(noteId, attId) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (!note || !note.attachments) return;

  note.attachments = note.attachments.filter(a => a.id !== attId);
  note.updatedAt = new Date().toISOString();
  saveState();
  renderNotesForActiveClient();
}

function previewNoteAttachment(noteId, attId) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;
  const note = state.notes[client].find(n => n.id === noteId);
  if (!note || !note.attachments) return;
  const att = note.attachments.find(a => a.id === attId);
  if (att) openAttachmentPreviewModal(att);
}

function previewScriptAttachment(scriptId, attId) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script || !script.attachments) return;
  const att = script.attachments.find(a => a.id === attId);
  if (att) openAttachmentPreviewModal(att);
}

// Content & Script Studio - Core Application Logic

const INITIAL_CLIENTS = ["Jennil", "Natalia"];

const INITIAL_SCRIPTS = [];

const INITIAL_NOTES = { "Jennil": [], "Natalia": [] };

const INITIAL_VIRAL_EVALUATIONS = [];

// Helper to get current date formatted as YYYY-MM-DD in Colombia Timezone (America/Bogota, UTC-5)
function getColombiaTodayDateString() {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date()); // Formats as YYYY-MM-DD
  } catch (e) {
    const now = new Date();
    const utc5 = new Date(now.getTime() - (5 * 60 * 60 * 1000));
    return utc5.toISOString().split('T')[0];
  }
}

// Clean reset migration flag to wipe legacy fictitious/example scripts
const RESET_KEY = 'css_reset_v20260913_zero';
if (localStorage.getItem(RESET_KEY) !== 'done') {
  localStorage.removeItem('css_clients');
  localStorage.removeItem('css_scripts');
  localStorage.removeItem('css_notes');
  localStorage.removeItem('css_viral_evaluations');
  localStorage.removeItem('css_challenge_start_date');
  localStorage.setItem(RESET_KEY, 'done');
}

// STATE
const rawSavedClients = localStorage.getItem('css_clients');
const savedClients = rawSavedClients !== null ? JSON.parse(rawSavedClients) : null;

const rawSavedScripts = localStorage.getItem('css_scripts');
const savedScripts = rawSavedScripts !== null ? JSON.parse(rawSavedScripts) : null;

const rawSavedNotes = localStorage.getItem('css_notes');
const savedNotes = rawSavedNotes !== null ? JSON.parse(rawSavedNotes) : null;

const rawSavedViralEvals = localStorage.getItem('css_viral_evaluations');
const savedViralEvals = rawSavedViralEvals !== null ? JSON.parse(rawSavedViralEvals) : null;

const savedChallengeStartDate = localStorage.getItem('css_challenge_start_date');

const rawSavedCalendarEvents = localStorage.getItem('css_calendar_events');
const savedCalendarEvents = rawSavedCalendarEvents !== null ? JSON.parse(rawSavedCalendarEvents) : null;


let state = {
  clients: Array.isArray(savedClients) ? savedClients : INITIAL_CLIENTS,
  scripts: Array.isArray(savedScripts) ? savedScripts : INITIAL_SCRIPTS,
  notes: (savedNotes && typeof savedNotes === 'object') ? savedNotes : INITIAL_NOTES,
  viralEvaluations: Array.isArray(savedViralEvals) ? savedViralEvals : INITIAL_VIRAL_EVALUATIONS,
  challengeStartDate: savedChallengeStartDate || '2026-09-13',
  calendarEvents: Array.isArray(savedCalendarEvents) ? savedCalendarEvents : [],
  activeClient: 'ALL',
  activeStatus: 'ALL',
  searchQuery: '',
  currentView: 'matrix', // Default is MATRIX
  editingScriptId: null,
  activeNotesClient: (Array.isArray(savedClients) && savedClients.length > 0) ? savedClients[0] : INITIAL_CLIENTS[0]
};

// Ensure Jennil and Natalia are ALWAYS default clients
if (!state.clients.includes("Jennil")) state.clients.unshift("Jennil");
if (!state.clients.includes("Natalia")) state.clients.push("Natalia");
if (!state.notes) state.notes = {};
if (!state.notes["Jennil"]) state.notes["Jennil"] = [];
if (!state.notes["Natalia"]) state.notes["Natalia"] = [];

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

// PRINT SELECTION & STUDIO STATE
let currentPrintModule = 'matrix'; // 'matrix' | 'cards' | 'viral' | 'ideas'
let printViralMode = 'current'; // 'current' | 'history'
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

let autoSyncTimer = null;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  checkUrlForSyncData();
  renderClientSelect();
  renderAll();
  calculateViralScore();
  renderViralHistoryTable();
  setupEventListeners();
  renderChallengeCountdown();
  updateIdeasHeaderBadge();
  setInterval(renderChallengeCountdown, 60000);
  initTeleprompterProEngine();
  
  // Matrix is the 1st foreground view
  switchView('matrix');
  refreshLucideIcons();

  // Real-time server sync on startup
  setTimeout(() => {
    if (typeof loadStateFromCloud === 'function') {
      loadStateFromCloud(true);
    }
    startAutoSyncEngine();
  }, 300);

  // Auto-sync whenever the app/tab becomes active or visible (e.g. unlocking iPhone, switching back to Safari/Chrome)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (typeof loadStateFromCloud === 'function') {
        loadStateFromCloud(true);
      }
    }
  });

  window.addEventListener('focus', () => {
    if (typeof loadStateFromCloud === 'function') {
      loadStateFromCloud(true);
    }
  });

  // Initialize 1-hour Auto-Save Timer
  if (typeof initAutoSaveTimer === 'function') {
    initAutoSaveTimer();
  }
});

function saveState() {
  const nowISO = new Date().toISOString();
  state.updatedAt = nowISO;

  try {
    localStorage.setItem('css_clients', JSON.stringify(state.clients));
    localStorage.setItem('css_scripts', JSON.stringify(state.scripts));
    localStorage.setItem('css_notes', JSON.stringify(state.notes));
    localStorage.setItem('css_viral_evaluations', JSON.stringify(state.viralEvaluations));
    localStorage.setItem('css_updated_at', nowISO);
    if (state.challengeStartDate) {
      localStorage.setItem('css_challenge_start_date', state.challengeStartDate);
    localStorage.setItem('css_calendar_events', JSON.stringify(state.calendarEvents || []));
    }
  } catch (err) {
    console.warn("Local storage quota exceeded, optimizing storage:", err);
    try {
      // Prune heavy attachments for localStorage while keeping in memory & cloud
      const cleanScripts = state.scripts.map(s => {
        if (s.attachments && s.attachments.length > 0) {
          return {
            ...s,
            attachments: s.attachments.map(a => ({ id: a.id, name: a.name, size: a.size, type: a.type }))
          };
        }
        return s;
      });
      localStorage.setItem('css_scripts', JSON.stringify(cleanScripts));
      localStorage.setItem('css_updated_at', nowISO);
    } catch (e2) {
      console.warn("Storage fallback exception:", e2);
    }
  }

  // Automatic background push to Cloud / Server immediately
  clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    if (typeof saveStateToCloud === 'function') {
      saveStateToCloud(true);
    }
  }, 600);
}

function renderChallengeCountdown() {
  const badgeText = document.getElementById('challengeDaysText');
  if (!badgeText) return;

  const todayColStr = getColombiaTodayDateString();

  if (!state.challengeStartDate) {
    state.challengeStartDate = '2026-09-13';
    localStorage.setItem('css_challenge_start_date', '2026-09-13');
  }

  const [sy, sm, sd] = state.challengeStartDate.split('-').map(Number);
  const [ty, tm, td] = todayColStr.split('-').map(Number);

  const startDateUtc = Date.UTC(sy, sm - 1, sd);
  const todayUtc = Date.UTC(ty, tm - 1, td);

  const diffDays = Math.max(0, Math.floor((todayUtc - startDateUtc) / (1000 * 60 * 60 * 24)));
  const remainingDays = Math.max(0, 365 - diffDays);

  badgeText.textContent = `${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`;
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
  const optionsHtml = `<option value="ALL">🏢 Todos los Clientes</option>` + 
    state.clients.map(c => `<option value="${c}">🏢 ${c}</option>`).join('');
  
  if (clientFilterSelect) {
    clientFilterSelect.innerHTML = optionsHtml;
    clientFilterSelect.value = state.clients.includes(state.activeClient) ? state.activeClient : 'ALL';
  }
  const clientFilterMobile = document.getElementById('clientFilterMobile');
  if (clientFilterMobile) {
    clientFilterMobile.innerHTML = optionsHtml;
    clientFilterMobile.value = state.clients.includes(state.activeClient) ? state.activeClient : 'ALL';
  }
  populateActorOptions();
  populateViralClientSelect();
}

function renderAll() {
  renderChallengeCountdown();
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
    if (cardsGrid) cardsGrid.classList.add('hidden');
    if (viewMatrix && viewMatrix.querySelector('table')) viewMatrix.querySelector('table').classList.add('hidden');
    
    if (state.currentView === 'matrix' || state.currentView === 'cards') {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
    }

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
    if (cardsGrid) cardsGrid.classList.remove('hidden');
    if (viewMatrix && viewMatrix.querySelector('table')) viewMatrix.querySelector('table').classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
  }

  renderPublishedAnalyticsPanel();
  renderMatrixView(filtered);
  renderCardsView(filtered);
  renderTeleprompterView(filtered);
  updateNotesHeaderBadge();
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

// 3. TELEPROMPTER / SET VIEW RENDER & FULLSCREEN EXPANSION
let isSetCardFullscreen = false;

function toggleSetCardFullscreen() {
  const display = document.getElementById('teleprompterDisplay');
  if (!display) return;
  
  isSetCardFullscreen = !isSetCardFullscreen;
  
  if (isSetCardFullscreen) {
    display.classList.add('set-card-fullscreen');
    document.body.classList.add('set-fullscreen-active');
    
    // Request browser fullscreen if available
    try {
      if (!document.fullscreenElement && display.requestFullscreen) {
        display.requestFullscreen().catch(() => {});
      } else if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch(e) {}
  } else {
    display.classList.remove('set-card-fullscreen');
    document.body.classList.remove('set-fullscreen-active');
    
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch(e) {}
  }
  
  const selectedId = teleprompterSelect?.value || (state.scripts.length > 0 ? state.scripts[0].id : null);
  if (selectedId) {
    displayScriptInTeleprompter(selectedId);
  }
  refreshLucideIcons();
}

// Listen to fullscreen exit via Esc or browser UI
document.addEventListener('fullscreenchange', () => {
  const display = document.getElementById('teleprompterDisplay');
  if (!document.fullscreenElement && isSetCardFullscreen) {
    isSetCardFullscreen = false;
    if (display) display.classList.remove('set-card-fullscreen');
    document.body.classList.remove('set-fullscreen-active');
    const selectedId = teleprompterSelect?.value;
    if (selectedId) displayScriptInTeleprompter(selectedId);
    refreshLucideIcons();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isSetCardFullscreen) {
    toggleSetCardFullscreen();
  }
});

function selectTeleprompterScript(scriptId) {
  if (!scriptId) return;
  if (teleprompterSelect) {
    teleprompterSelect.value = scriptId;
  }
  displayScriptInTeleprompter(scriptId);
}

function navigateTeleprompterScript(direction) {
  const scripts = state.scripts || [];
  if (scripts.length === 0) return;
  const currentId = teleprompterSelect?.value || scripts[0].id;
  const currentIndex = scripts.findIndex(s => s.id === currentId);
  if (currentIndex === -1) return;
  
  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < scripts.length) {
    selectTeleprompterScript(scripts[newIndex].id);
  }
}

function renderTeleprompterView(scripts) {
  if (!teleprompterSelect || !teleprompterDisplay) return;
  teleprompterSelect.innerHTML = '';
  
  if (scripts.length === 0) {
    teleprompterDisplay.innerHTML = `<p class="text-slate-500 text-center py-20 font-medium">No hay guiones disponibles para grabar.</p>`;
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
  if (!teleprompterDisplay) return;
  const script = state.scripts.find(s => s.id === scriptId);

  if (!script) {
    teleprompterDisplay.innerHTML = `
      <div class="text-center py-16 text-slate-500">
        <p class="text-base">Selecciona un guión para visualizarlo en modo Set de Grabación.</p>
      </div>
    `;
    return;
  }

  const isLibre = script.scriptType === 'libre' || (!script.historia && !script.moraleja && script.guionLibre);

  if (isSetCardFullscreen) {
    teleprompterDisplay.innerHTML = `
      <div class="set-fullscreen-wrapper">
        <div class="set-fullscreen-header flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <span class="bg-brand-500/20 text-brand-400 text-sm font-extrabold px-3 py-1 rounded-xl border border-brand-500/30">
              #${script.number || '-'}
            </span>
            <span class="text-lg sm:text-xl font-bold text-white">${escapeHtml(script.ideaGanadora)}</span>
            <span class="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">${escapeHtml(script.client)}</span>
            ${isLibre ? '<span class="text-xs text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">📝 Guión Libre</span>' : ''}
          </div>
          <div class="flex items-center gap-2">
            <button onclick="toggleSetCardFullscreen()" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="minimize-2" class="w-4 h-4"></i> <span>Salir Pantalla Completa</span>
            </button>
          </div>
        </div>

        ${isLibre ? `
          <div class="bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-900 border-l-4 border-purple-500 p-8 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-4 h-4"></i> 📝 GUIÓN COMPLETO (TEXTO LIBRE)
              </span>
              <button onclick="copyScriptSection('${script.id}', 'guionLibre', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-100 whitespace-pre-line leading-relaxed">
              ${escapeHtml(script.guionLibre || script.gancho || '')}
            </p>
          </div>
        ` : `
        <div class="space-y-8">
          <div class="bg-amber-500/10 border-l-4 border-amber-500 p-8 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400">🪝 GANCHO (Primeros 3 seg)</span>
              <button onclick="copyScriptSection('${script.id}', 'gancho', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-100 leading-tight">
              ${escapeHtml(script.gancho)}
            </p>
          </div>

          <div class="bg-emerald-500/10 border-l-4 border-emerald-500 p-8 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-emerald-400">📖 HISTORIA - CONTEXTO</span>
              <button onclick="copyScriptSection('${script.id}', 'historia', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl lg:text-4xl font-semibold text-emerald-100 whitespace-pre-line leading-relaxed">
              ${escapeHtml(script.historia)}
            </p>
          </div>

          <div class="bg-rose-500/10 border-l-4 border-rose-500 p-8 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-rose-400">💡 MORALEJA / SOLUCIÓN</span>
              <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl lg:text-4xl font-semibold text-rose-100 whitespace-pre-line leading-relaxed">
              ${escapeHtml(script.moraleja)}
            </p>
          </div>

          <div class="bg-blue-500/10 border-l-4 border-blue-500 p-8 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-blue-400">📣 LLAMADO A LA ACCIÓN (CTA)</span>
              <button onclick="copyScriptSection('${script.id}', 'cta', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-100 leading-relaxed">
              ${escapeHtml(script.cta)}
            </p>
          </div>
        </div>
        `}
      </div>
    `;
  } else {
    teleprompterDisplay.innerHTML = `
      <!-- Prompter Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="bg-brand-500/10 text-brand-400 text-xs font-bold px-2.5 py-1 rounded border border-brand-500/20">
              ${escapeHtml(script.client)}
            </span>
            <span class="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded">
              Guión #${script.number || '-'}
            </span>
            <span class="bg-amber-500/10 text-amber-400 text-xs font-medium px-2 py-1 rounded border border-amber-500/20">
              Formato: ${escapeHtml(script.formato)}
            </span>
            ${isLibre ? '<span class="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded border border-purple-500/30">📝 Guión Libre</span>' : ''}
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-3">${escapeHtml(script.ideaGanadora)}</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button onclick="toggleSetCardFullscreen()" id="btnCardSetFullscreen" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer" title="Maximizar tarjeta a pantalla completa">
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
            <span>Ampliar Pantalla</span>
          </button>
          
          <button onclick="openScriptInTeleprompterPro('${script.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md cursor-pointer">
            <i data-lucide="tv" class="w-4 h-4"></i>
            <span>Cargar en Teleprónter Pro</span>
          </button>
          
          <button onclick="copyFullScript('${script.id}', this)" class="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md cursor-pointer">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>Copiar Guión Completo</span>
          </button>
          
          <div class="text-sm text-slate-400 pl-1">
            <span>Actor: <strong class="text-white">${escapeHtml(script.actor || 'N/A')}</strong></span>
            ${script.contextoAdicional ? `<span class="border-l border-slate-800 pl-2">📍 ${escapeHtml(script.contextoAdicional)}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Prompter Script Sections -->
      <div class="space-y-8 py-4">
        ${isLibre ? `
          <div class="bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-900 border-l-4 border-purple-500 p-6 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-4 h-4"></i> 📝 GUIÓN COMPLETO (TEXTO LIBRE)
              </span>
              <button onclick="copyScriptSection('${script.id}', 'guionLibre', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-xl sm:text-2xl font-medium text-slate-100 whitespace-pre-line leading-relaxed">${escapeHtml(script.guionLibre || script.gancho || '')}</p>
          </div>
        ` : `
          <div class="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400">🪝 GANCHO (Hook - Primeros 3 seg)</span>
              <button onclick="copyScriptSection('${script.id}', 'gancho', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-amber-100 leading-relaxed">${escapeHtml(script.gancho)}</p>
          </div>

          <div class="bg-emerald-500/5 border-l-4 border-emerald-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-widest text-emerald-400">📖 HISTORIA - CONTEXTO</span>
              <button onclick="copyScriptSection('${script.id}', 'historia', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-xl sm:text-2xl font-medium text-emerald-100 whitespace-pre-line leading-relaxed">${escapeHtml(script.historia)}</p>
          </div>

          <div class="bg-rose-500/5 border-l-4 border-rose-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-widest text-rose-400">💡 MORALEJA / SOLUCIÓN</span>
              <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-xl sm:text-2xl font-medium text-rose-100 whitespace-pre-line leading-relaxed">${escapeHtml(script.moraleja)}</p>
          </div>

          <div class="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-widest text-blue-400">📣 LLAMADO A LA ACCIÓN (CTA)</span>
              <button onclick="copyScriptSection('${script.id}', 'cta', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar
              </button>
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-blue-100 leading-relaxed">${escapeHtml(script.cta)}</p>
          </div>
        `}
      </div>
    `;
  }
  refreshLucideIcons();
}
function openTeleprompterForScript(scriptId) {
  openScriptInTeleprompterPro(scriptId);
}

let activeFocusScriptId = null;

function openFocusScriptModal(scriptId) {
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;
  activeFocusScriptId = scriptId;
  const modal = document.getElementById('focusScriptModal');
  const modalTitle = document.getElementById('focusModalTitle');
  const modalBody = document.getElementById('focusModalBody');
  const btnOpenTP = document.getElementById('btnOpenTeleprompterFocusScript');
  const btnEdit = document.getElementById('btnEditFocusScript');
  const btnPrint = document.getElementById('btnPrintFocusScript');
  const btnCopy = document.getElementById('btnCopyFocusScript');

  if (modalTitle) modalTitle.textContent = `#${script.number || ''} - ${script.ideaGanadora}`;
  if (btnOpenTP) {
    btnOpenTP.onclick = () => {
      openScriptInTeleprompterPro(scriptId);
      closeFocusModal();
    };
  }
  if (btnEdit) {
    btnEdit.onclick = () => {
      closeFocusModal();
      openEditScriptModal(scriptId);
    };
  }
  if (btnPrint) {
    btnPrint.onclick = () => printSingleScript(scriptId);
  }
  if (btnCopy) {
    btnCopy.onclick = (e) => copyFullScript(scriptId, e.currentTarget);
  }

  if (modalBody) {
    const isLibre = script.scriptType === 'libre' || (!script.historia && !script.moraleja && script.guionLibre);
    
    if (isLibre) {
      modalBody.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="bg-brand-500/10 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-xl border border-brand-500/20">${escapeHtml(script.client)}</span>
            <span class="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-xl">Guión #${script.number || '-'}</span>
            <span class="bg-purple-500/15 text-purple-300 text-xs font-extrabold px-2.5 py-1 rounded-xl border border-purple-500/30 flex items-center gap-1">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i> 📝 Guión Libre
            </span>
            <span class="bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-xl border border-amber-500/20">Formato: ${escapeHtml(script.formato)}</span>
            <span class="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-xl border border-emerald-500/20">Objetivo: ${escapeHtml(script.objetivo)}</span>
            ${script.actor ? `<span class="bg-slate-800/80 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-xl">👤 ${escapeHtml(script.actor)}</span>` : ''}
          </div>

          <div class="bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-900 border-l-4 border-purple-500 p-6 rounded-r-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-4 h-4"></i> 📝 GUION COMPLETO (TEXTO LIBRE)
              </span>
              <button onclick="copyScriptSection('${script.id}', 'guionLibre', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copiar Guión
              </button>
            </div>
            <p class="text-lg sm:text-xl font-medium text-slate-100 whitespace-pre-line leading-relaxed">${escapeHtml(script.guionLibre || script.gancho || '')}</p>
          </div>

          ${script.contextoAdicional ? `
            <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">📍 Contexto Adicional / Notas</span>
              <p class="text-sm text-slate-300">${escapeHtml(script.contextoAdicional)}</p>
            </div>
          ` : ''}

          ${Array.isArray(script.attachments) && script.attachments.length > 0 ? `
            <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <span class="text-[11px] font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="paperclip" class="w-3.5 h-3.5"></i> Archivos Adjuntos (${script.attachments.length})
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${script.attachments.map(att => `
                  <div onclick="openAttachmentPreviewModal('${att.id}', '${script.id}')" class="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-brand-500/40 cursor-pointer transition">
                    <span class="text-xs font-semibold text-slate-200 truncate">${escapeHtml(att.name)}</span>
                    <span class="text-[10px] text-slate-400">${escapeHtml(att.size || '')}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      modalBody.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="bg-brand-500/10 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-xl border border-brand-500/20">${escapeHtml(script.client)}</span>
            <span class="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-xl">Guión #${script.number || '-'}</span>
            <span class="bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-xl border border-amber-500/20">Formato: ${escapeHtml(script.formato)}</span>
            <span class="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-xl border border-emerald-500/20">Objetivo: ${escapeHtml(script.objetivo)}</span>
            ${script.actor ? `<span class="bg-slate-800/80 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-xl">👤 ${escapeHtml(script.actor)}</span>` : ''}
          </div>

          <div class="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400">🪝 GANCHO</span>
              <button onclick="copyScriptSection('${script.id}', 'gancho', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">Copiar</button>
            </div>
            <p class="text-2xl font-bold text-amber-100">${escapeHtml(script.gancho)}</p>
          </div>

          <div class="bg-emerald-500/5 border-l-4 border-emerald-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-emerald-400">📖 HISTORIA - CONTEXTO</span>
              <button onclick="copyScriptSection('${script.id}', 'historia', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">Copiar</button>
            </div>
            <p class="text-xl font-medium text-emerald-100 whitespace-pre-line">${escapeHtml(script.historia)}</p>
          </div>

          <div class="bg-rose-500/5 border-l-4 border-rose-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-rose-400">💡 MORALEJA / VALOR</span>
              <button onclick="copyScriptSection('${script.id}', 'moraleja', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">Copiar</button>
            </div>
            <p class="text-xl font-medium text-rose-100 whitespace-pre-line">${escapeHtml(script.moraleja)}</p>
          </div>

          <div class="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-widest text-blue-400">📣 LLAMADO A LA ACCIÓN (CTA)</span>
              <button onclick="copyScriptSection('${script.id}', 'cta', this)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition">Copiar</button>
            </div>
            <p class="text-2xl font-bold text-blue-100">${escapeHtml(script.cta)}</p>
          </div>

          ${script.contextoAdicional ? `
            <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">📍 Contexto Adicional / Notas</span>
              <p class="text-sm text-slate-300">${escapeHtml(script.contextoAdicional)}</p>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  if (modal) modal.classList.remove('hidden');
  refreshLucideIcons();
}
function closeFocusModal() {
  const modal = document.getElementById('focusScriptModal');
  if (modal) modal.classList.add('hidden');
  activeFocusScriptId = null;
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
  let fullText = '';
  const isLibre = script.scriptType === 'libre' || (!script.historia && !script.moraleja && script.guionLibre);
  
  if (isLibre) {
    fullText = `[CLIENTE: ${script.client} - GUIÓN #${script.number || ''}]
[IDEA: ${script.ideaGanadora}]
[FORMATO: ${script.formato}]

${script.guionLibre || script.gancho || ''}`;
  } else {
    fullText = `[CLIENTE: ${script.client} - GUIÓN #${script.number || ''}]
[IDEA: ${script.ideaGanadora}]
[FORMATO: ${script.formato}]

[GANCHO]
${script.gancho}

[HISTORIA]
${script.historia}

[MORALEJA]
${script.moraleja}

[CTA]
${script.cta}`;
  }
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
  // Challenge Badge Click Handler
  const challengeBadge = document.getElementById('challengeBadge');
  if (challengeBadge) {
    challengeBadge.addEventListener('click', () => {
      const todayCol = getColombiaTodayDateString();
      const current = state.challengeStartDate || todayCol;
      const input = prompt(`🔥 Reto 365 Días (Hora Colombia)\n\nIngresa la fecha de inicio del reto (AAAA-MM-DD):\n(Fecha actual en Colombia: ${todayCol})`, current);
      if (input && input.trim()) {
        const trimmed = input.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
          state.challengeStartDate = trimmed;
          saveState();
          renderChallengeCountdown();
        } else {
          alert("Por favor ingresa la fecha en formato AAAA-MM-DD (ejemplo: 2026-09-13)");
        }
      }
    });
  }

  // Tab & View Switching (Guarded)
  const tabAiStudio = document.getElementById('tabAiStudio');
  if (tabAiStudio) tabAiStudio.addEventListener('click', () => switchView('ai_studio'));
  const btnAiStudioHeader = document.getElementById('btnAiStudioHeader');
  if (btnAiStudioHeader) btnAiStudioHeader.addEventListener('click', () => switchView('ai_studio'));
  if (tabViralCalc) tabViralCalc.addEventListener('click', () => switchView('viral_calc'));
  if (tabMatrix) tabMatrix.addEventListener('click', () => switchView('matrix'));
  if (tabCards) tabCards.addEventListener('click', () => switchView('cards'));
  if (tabTeleprompter) tabTeleprompter.addEventListener('click', () => switchView('teleprompter'));
  const tabTeleprompterPro = document.getElementById('tabTeleprompterPro');
  if (tabTeleprompterPro) tabTeleprompterPro.addEventListener('click', () => switchView('teleprompter_pro'));

  // Filters
  if (clientFilterSelect) clientFilterSelect.addEventListener('change', (e) => {
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
  if (btnNewScript) btnNewScript.addEventListener('click', () => openNewScriptModal());
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  scriptForm.addEventListener('submit', handleScriptSubmit);

  // Client Modal
  if (btnNewClient) btnNewClient.addEventListener('click', openClientManagerModal);
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

// ==========================================
// DEVICE SYNC (PC ↔ IPAD) HELPERS
// ==========================================
function getUuidFromSyncCode(code) {
  if (!code || !code.trim()) return null;
  let str = code.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  let hex = '';
  for (let i = 0; i < 32; i++) {
    const charCode = str.charCodeAt(i % str.length) ^ (Math.abs(hash + i * 17) % 256);
    hex += charCode.toString(16).padStart(2, '0').substring(0, 1);
  }
  while (hex.length < 32) hex += 'a';
  hex = hex.substring(0, 32);
  return `${hex.substring(0,8)}-${hex.substring(8,12)}-4${hex.substring(12,15)}-a${hex.substring(16,19)}-${hex.substring(20,32)}`;
}

function savePersonalSyncCode() {
  const input = document.getElementById('syncPersonalCodeInput');
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    localStorage.setItem('blex_cloud_sync_code', val);
    alert(`🔑 Clave personal '${val}' guardada en este dispositivo.\n\nColoca esta misma clave en tus otros dispositivos (PC, iPad, iPhone) para sincronización directa y automática en la nube.`);
  } else {
    localStorage.removeItem('blex_cloud_sync_code');
    alert("Se eliminó la clave personal de este dispositivo.");
  }
}

async function fetchLatestCloudData() {
  try {
    const baseUrl = getEffectiveServerUrl();
    let syncCode = localStorage.getItem('blex_cloud_sync_code');
    let syncEndpoint = baseUrl + '/api/sync?t=' + Date.now();
    if (syncCode) {
      syncEndpoint += '&channel=' + encodeURIComponent(syncCode);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(syncEndpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("fetchLatestCloudData error:", e);
  }
  return null;
}

async function forceSyncAllNow() {
  const btn = document.getElementById('btnForceSyncNow');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Sincronizando...</span>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  try {
    const remoteData = await fetchLatestCloudData();
    if (remoteData && Array.isArray(remoteData.scripts)) {
      const mergedMap = new Map();
      (remoteData.scripts || []).forEach(s => mergedMap.set(s.id, s));
      (state.scripts || []).forEach(s => mergedMap.set(s.id, s));
      
      const mergedScripts = Array.from(mergedMap.values());
      const mergedClients = Array.from(new Set([...(remoteData.clients || ['Jennil']), ...(state.clients || ['Jennil'])]));
      const mergedNotes = { ...(remoteData.notes || {}), ...(state.notes || {}) };
      const mergedEvals = [...(remoteData.viralEvaluations || []), ...(state.viralEvaluations || [])];

      const mergedPayload = {
        clients: mergedClients,
        scripts: mergedScripts,
        notes: mergedNotes,
        viralEvaluations: mergedEvals,
        challengeStartDate: state.challengeStartDate || remoteData.challengeStartDate || '2026-09-13',
        updatedAt: new Date().toISOString()
      };

      applyCloudData(mergedPayload, null, false);
      await saveStateToCloud(true);
    } else {
      await saveStateToCloud(true);
    }

    updateSyncModalDetails();
    showToastNotification('⚡ ¡Sincronización en tiempo real completada!');
  } catch (e) {
    console.warn('forceSyncAllNow error:', e);
    showToastNotification('⚠️ Sincronizado localmente', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}

function copyCleanAppUrl() {
  const url = 'https://content-script-studio.vercel.app';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToastNotification('📋 Enlace oficial copiado: ' + url);
    }).catch(() => {
      prompt('Copia este enlace para abrirlo en tu iPad o celular:', url);
    });
  } else {
    prompt('Copia este enlace para abrirlo en tu iPad o celular:', url);
  }
}

function updateSyncModalDetails() {
  const serverLabel = document.getElementById('syncModalServerStatus');
  const lastTimeLabel = document.getElementById('syncModalLastTime');
  const effServer = document.getElementById('currentConnectedServerLabel');

  if (serverLabel) {
    serverLabel.innerHTML = isServerConnected 
      ? '<i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i> Conectado'
      : '<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-400"></i> Desconectado';
    serverLabel.className = isServerConnected ? 'font-semibold text-emerald-400 flex items-center gap-1 mt-0.5' : 'font-semibold text-rose-400 flex items-center gap-1 mt-0.5';
  }

  if (lastTimeLabel) {
    const d = new Date();
    lastTimeLabel.innerText = 'Hoy ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  if (effServer) {
    effServer.innerText = getEffectiveServerUrl();
  }

  if (typeof refreshLucideIcons === 'function') refreshLucideIcons();
}

function openSyncModal() {
  const modal = document.getElementById('syncModal');
  if (modal) modal.classList.remove('hidden');
  const codeInput = document.getElementById('syncPersonalCodeInput');
  if (codeInput) {
    codeInput.value = localStorage.getItem('blex_cloud_sync_code') || '';
  }
}

function closeSyncModal() {
  const modal = document.getElementById('syncModal');
  if (modal) modal.classList.add('hidden');
}

async function loadStateFromCloud(isSilent = false) {
  const btn = document.getElementById('btnLoadCloud');
  const originalHTML = btn ? btn.innerHTML : '';

  if (btn && !isSilent) {
    btn.disabled = true;
    btn.innerHTML = '<span>☁️ Cargando...</span>';
  }

  try {
    const data = await fetchLatestCloudData();
    if (data && Array.isArray(data.scripts)) {
      updateSyncStatus(true);
      const localUpdatedAt = localStorage.getItem('css_updated_at') || '0';
      const cloudUpdatedAt = data.updatedAt || '0';

      const shouldApply = !isSilent || 
                          (cloudUpdatedAt >= localUpdatedAt) || 
                          (state.scripts.length === 0 && data.scripts.length > 0) ||
                          (data.scripts.length > state.scripts.length);

      if (shouldApply) {
        applyCloudData(data, null, isSilent);
      } else if (localUpdatedAt > cloudUpdatedAt && state.scripts.length > data.scripts.length) {
        saveStateToCloud(true);
      }
    } else {
      updateSyncStatus(true);
    }
  } catch (err) {
    updateSyncStatus(false);
    console.warn("loadStateFromCloud note:", err);
  } finally {
    if (btn && !isSilent) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }
}

function applyCloudData(data, channel = null, isSilent = false) {
  if (!data) return;
  if (Array.isArray(data.scripts)) state.scripts = data.scripts;
  if (Array.isArray(data.clients)) state.clients = data.clients;
  if (data.notes && typeof data.notes === 'object') state.notes = data.notes;
  if (Array.isArray(data.viralEvaluations)) state.viralEvaluations = data.viralEvaluations;
  if (Array.isArray(data.calendarEvents)) state.calendarEvents = data.calendarEvents;
  if (data.challengeStartDate) state.challengeStartDate = data.challengeStartDate;
  
  // Ensure default clients Jennil and Natalia
  if (!state.clients.includes("Jennil")) state.clients.unshift("Jennil");
  if (!state.clients.includes("Natalia")) state.clients.push("Natalia");

  saveState();
  renderAll();
  if (!isSilent) {
    showToastNotification(`🎉 ¡${state.scripts.length} guiones y calendario sincronizados!`);
  }
}

function getFullAppStateJSON() {
  return JSON.stringify({
    clients: state.clients,
    scripts: state.scripts,
    notes: state.notes,
    viralEvaluations: state.viralEvaluations,
    calendarEvents: state.calendarEvents,
    challengeStartDate: state.challengeStartDate,
    tpStateScripts: (typeof tpState !== 'undefined' && tpState && tpState.scripts) ? tpState.scripts : null,
    exportedAt: new Date().toISOString()
  });
}

function updateCloudStatusBadge(isSuccess) {
  const badge = document.getElementById('cloudStatusDot');
  if (!badge) return;
  if (isSuccess) {
    badge.className = "w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50";
    badge.title = "Nube Sincronizada";
  } else {
    badge.className = "w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse";
    badge.title = "Sincronizando...";
  }
}

// AUTO SAVE TIMER LOGIC (Silent background auto-save every 60 minutes after last save)
let autoSaveIntervalTimer = null;

function initAutoSaveTimer() {
  if (autoSaveIntervalTimer) clearInterval(autoSaveIntervalTimer);

  // Trigger silent auto-save every 60 minutes (3,600,000 ms) after last save
  autoSaveIntervalTimer = setInterval(() => {
    console.log("⏰ Guardado automático de 60 minutos ejecutado en segundo plano");
    savePlatformDataToCloud(true);
  }, 3600000);
}

function resetAutoSaveTimer() {
  initAutoSaveTimer();
}

function showToastNotification(message, iconName = 'check-circle') {
  let toastContainer = document.getElementById('blexToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'blexToastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-[100000] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl shadow-emerald-950/80 flex items-center gap-2.5 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto';
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 text-emerald-400 shrink-0"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

async function savePlatformDataToCloud(isSilent = false) {
  return await saveStateToCloud(isSilent);
}

// =========================================================================
// REAL-TIME AUTO-SYNC & CONNECTION STATUS SUBSYSTEM
// =========================================================================

let isServerConnected = true;
let syncPollingTimer = null;

function getEffectiveServerUrl() {
  const custom = localStorage.getItem('blex_server_url');
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}

function updateSyncStatus(connected, lastSyncMsg = '') {
  isServerConnected = !!connected;
  
  const dot = document.getElementById('cloudStatusDot');
  const text = document.getElementById('cloudStatusText');
  const btnHeader = document.getElementById('btnSyncDevicesHeader');
  const offlineAlert = document.getElementById('offlineSyncAlert');

  if (connected) {
    if (dot) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50';
      dot.title = 'Sincronización Automática 24/7 Activa';
    }
    if (text) {
      text.innerText = 'Sincronizado 24/7';
    }
    if (btnHeader) {
      btnHeader.className = 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold px-3.5 py-2 rounded-lg text-xs sm:text-sm border border-emerald-500/30 transition flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer shrink-0';
    }
    if (offlineAlert) {
      offlineAlert.classList.add('hidden');
    }
  } else {
    if (dot) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80 animate-pulse';
      dot.title = 'Sin Conexión con la Nube / Servidor';
    }
    if (text) {
      text.innerText = 'Desconectado';
    }
    if (btnHeader) {
      btnHeader.className = 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold px-3.5 py-2 rounded-lg text-xs sm:text-sm border border-rose-500/40 transition flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer shrink-0';
    }
    if (offlineAlert) {
      offlineAlert.classList.remove('hidden');
    }
  }

  if (typeof refreshLucideIcons === 'function') refreshLucideIcons();
}

async function saveStateToCloud(isSilent = false) {
  const btnHeader = document.getElementById('btnSavePlatformData');
  const btnModal = document.getElementById('btnSaveCloud');
  const originalHeaderHTML = btnHeader ? btnHeader.innerHTML : '';
  const originalModalHTML = btnModal ? btnModal.innerHTML : '';

  if (btnHeader && !isSilent) {
    btnHeader.disabled = true;
    btnHeader.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Guardando...</span>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  if (btnModal && !isSilent) {
    btnModal.disabled = true;
    btnModal.innerHTML = '<span>☁️ Guardando...</span>';
  }

  try {
    const payloadObj = JSON.parse(getFullAppStateJSON());
    payloadObj.updatedAt = new Date().toISOString();

    const baseUrl = getEffectiveServerUrl();
    let syncCode = localStorage.getItem('blex_cloud_sync_code');
    let syncEndpoint = baseUrl + '/api/sync';
    if (syncCode) {
      syncEndpoint += '?channel=' + encodeURIComponent(syncCode);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(syncEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadObj),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // Also push directly to Vercel Cloud endpoint if currently on localhost/LAN so iPad/phones get it immediately
    const vercelCloudUrl = 'https://content-script-studio.vercel.app/api/sync';
    if (!baseUrl.includes('vercel.app')) {
      try {
        fetch(vercelCloudUrl + (syncCode ? '?channel=' + encodeURIComponent(syncCode) : ''), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadObj)
        }).catch(e => console.warn('Vercel cloud background push note:', e));
      } catch (e) {}
    }

    if (res.ok) {
      updateSyncStatus(true);
      if (typeof resetAutoSaveTimer === 'function') resetAutoSaveTimer();

      if (!isSilent) {
        const scriptCount = state.scripts ? state.scripts.length : 0;
        showToastNotification('💾 ¡Datos Sincronizados con el Servidor! (' + scriptCount + ' guiones en todos tus dispositivos)');
      }
      return true;
    }

    updateSyncStatus(false);
    if (!isSilent) {
      alert("☁️ No se pudo conectar al servidor de sincronización en este momento.");
    }
  } catch (err) {
    updateSyncStatus(false);
    console.warn("Auto-sync save exception:", err);
    if (!isSilent) {
      alert("No se pudo conectar al servidor. Verifica que el servidor de BLEX Studio esté activo en el PC.");
    }
  } finally {
    if (btnHeader && !isSilent) {
      btnHeader.disabled = false;
      btnHeader.innerHTML = originalHeaderHTML;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    if (btnModal && !isSilent) {
      btnModal.disabled = false;
      btnModal.innerHTML = originalModalHTML;
    }
  }
  return false;
}

// (loadStateFromCloud defined above)

function startAutoSyncEngine() {
  if (syncPollingTimer) clearInterval(syncPollingTimer);
  // Auto-sync polling every 8 seconds in background
  syncPollingTimer = setInterval(() => {
    if (typeof loadStateFromCloud === 'function') {
      loadStateFromCloud(true);
    }
  }, 8000);
}

function applyCloudData(data, blobId, isSilent = false) {
  if (data && Array.isArray(data.scripts)) {
    state.scripts = data.scripts;
    if (Array.isArray(data.clients)) state.clients = data.clients;
    if (data.notes && typeof data.notes === 'object') state.notes = data.notes;
    if (Array.isArray(data.viralEvaluations)) state.viralEvaluations = data.viralEvaluations;
    if (data.challengeStartDate) state.challengeStartDate = data.challengeStartDate;
    if (data.updatedAt) state.updatedAt = data.updatedAt;

    if (data.tpStateScripts && typeof tpState !== 'undefined' && tpState) {
      tpState.scripts = data.tpStateScripts;
      tpSaveScriptsToStorage();
      if (typeof tpUpdateQuickSlotDropdown === 'function') tpUpdateQuickSlotDropdown();
      if (typeof tpRenderScript === 'function') tpRenderScript();
    } else if (typeof syncStudioScriptsToTeleprompter === 'function') {
      syncStudioScriptsToTeleprompter();
    }

    localStorage.setItem('css_clients', JSON.stringify(state.clients));
    localStorage.setItem('css_scripts', JSON.stringify(state.scripts));
    localStorage.setItem('css_notes', JSON.stringify(state.notes));
    localStorage.setItem('css_viral_evaluations', JSON.stringify(state.viralEvaluations));
    if (state.updatedAt) {
      localStorage.setItem('css_updated_at', state.updatedAt);
    }
    if (state.challengeStartDate) {
      localStorage.setItem('css_challenge_start_date', state.challengeStartDate);
    }

    renderAll();
    updateCloudStatusBadge(true);

    if (!isSilent) {
      closeSyncModal();
      showToastNotification(`🎉 ¡Carga Exitosa! (${state.scripts.length} guiones cargados desde la Nube)`);
    }
  }
}

function copySyncUrlToClipboard() {
  try {
    const jsonStr = getFullAppStateJSON();
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const baseUrl = window.location.origin + window.location.pathname;
    const fullUrl = `${baseUrl}?syncData=${encoded}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert("✅ ¡Enlace copiado al portapapeles!\n\nEnvía este enlace a tu iPhone o iPad (por WhatsApp, AirDrop, iMessage, Mail o Telegram). Al abrirlo, se cargarán y sincronizarán tus " + state.scripts.length + " guiones al instante.");
    }).catch(() => {
      prompt("Copia este enlace de sincronización y ábrelo en tu iPhone o iPad:", fullUrl);
    });
  } catch (e) {
    alert("Error al generar enlace de sincronización: " + e.message);
  }
}

function copySyncCodeToClipboard() {
  try {
    const jsonStr = getFullAppStateJSON();
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    navigator.clipboard.writeText(encoded).then(() => {
      alert("✅ Código de sincronización copiado al portapapeles.\n\nEn tu iPhone o iPad, presiona 'Sincronizar Dispositivos' y haz clic en 'Pegar e Importar'.");
    }).catch(() => {
      prompt("Copia este código de sincronización:", encoded);
    });
  } catch (e) {
    alert("Error al generar código: " + e.message);
  }
}

function pasteAndImportSyncCode() {
  const code = prompt("Pega aquí el código de sincronización copiado desde tu otro dispositivo:");
  if (code && code.trim()) {
    try {
      const decoded = decodeURIComponent(escape(atob(code.trim())));
      const data = JSON.parse(decoded);
      if (data.scripts && Array.isArray(data.scripts)) {
        state.scripts = data.scripts;
        if (data.clients) state.clients = data.clients;
        if (data.notes) state.notes = data.notes;
        if (data.viralEvaluations) state.viralEvaluations = data.viralEvaluations;
        if (data.challengeStartDate) state.challengeStartDate = data.challengeStartDate;
        saveState();
        renderAll();
        closeSyncModal();
        alert("🎉 ¡Sincronización exitosa!\n\nSe han restaurado tus " + state.scripts.length + " guiones en este dispositivo.");
      } else {
        alert("El código ingresado no contiene una estructura válida de guiones.");
      }
    } catch (e) {
      alert("Error al leer el código: Formato o caracteres inválidos.");
    }
  }
}

function triggerJSONExport() {
  if (typeof handleExportJSON === 'function') {
    handleExportJSON();
  }
}

function triggerJSONImport() {
  const input = document.getElementById('importFileInput');
  if (input) input.click();
}

function checkUrlForSyncData() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('syncData')) {
      const raw = urlParams.get('syncData');
      const decoded = decodeURIComponent(escape(atob(raw)));
      const data = JSON.parse(decoded);
      if (data.scripts && Array.isArray(data.scripts)) {
        state.scripts = data.scripts;
        if (data.clients) state.clients = data.clients;
        if (data.notes) state.notes = data.notes;
        if (data.viralEvaluations) state.viralEvaluations = data.viralEvaluations;
        if (data.challengeStartDate) state.challengeStartDate = data.challengeStartDate;
        saveState();
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
          alert("🎉 ¡Sincronización Exitosa!\n\nSe han cargado y guardado tus " + state.scripts.length + " guiones perfectamente en este dispositivo.");
        }, 300);
      }
    }
  } catch (e) {
    console.error("Error al sincronizar datos desde la URL:", e);
  }
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


// MASTER DROPDOWN MENU ENGINE
function toggleMasterMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('masterDropdownMenu');
  const chevron = document.getElementById('masterMenuChevron');
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    refreshLucideIcons();
  } else {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function closeMasterMenu() {
  const menu = document.getElementById('masterDropdownMenu');
  const chevron = document.getElementById('masterMenuChevron');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function selectMasterMenuOption(type, value) {
  closeMasterMenu();
  if (type === 'view') {
    switchView(value);
  } else if (type === 'action') {
    if (value === 'new_script') {
      openNewScriptModal();
    } else if (value === 'quick_idea') {
      openQuickIdeaModal();
    } else if (value === 'notes') {
      openNotesModal();
    } else if (value === 'clients') {
      openClientManagerModal();
    } else if (value === 'notifications') {
      openNotificationHubModal();
    } else if (value === 'sync') {
      openSyncModal();
    } else if (value === 'print') {
      openPrintModal();
    } else if (value === 'export') {
      handleExportJSON();
    } else if (value === 'import') {
      const input = document.getElementById('importFileInput');
      if (input) input.click();
    } else if (value === 'fullscreen') {
      toggleFullScreen();
    }
  }
}

function syncMobileClientFilter(val) {
  state.activeClient = val;
  if (clientFilterSelect) clientFilterSelect.value = val;
  const clientFilterMobile = document.getElementById('clientFilterMobile');
  if (clientFilterMobile) clientFilterMobile.value = val;
  renderAll();
}

// Global outside click listener for Master Dropdown
document.addEventListener('click', (e) => {
  const masterMenu = document.getElementById('masterDropdownMenu');
  const btnMaster = document.getElementById('btnMasterMenu');
  if (masterMenu && !masterMenu.classList.contains('hidden')) {
    if (!masterMenu.contains(e.target) && (!btnMaster || !btnMaster.contains(e.target))) {
      closeMasterMenu();
    }
  }
});

function switchView(viewName) {
  state.currentView = viewName;

  const vViral = document.getElementById('viewViralCalc');
  const vMatrix = document.getElementById('viewMatrix');
  const vCards = document.getElementById('viewCards');
  const vTele = document.getElementById('viewTeleprompter');
  const vTelePro = document.getElementById('viewTeleprompterPro');
  const vAi = document.getElementById('viewAiStudio');
  const vCal = document.getElementById('viewCalendar');
  const emptyState = document.getElementById('emptyState');

  const statsContainer = document.getElementById('statsBarContainer');

  if (vViral) vViral.classList.add('hidden');
  if (vMatrix) vMatrix.classList.add('hidden');
  if (vCards) vCards.classList.add('hidden');
  if (vTele) vTele.classList.add('hidden');
  if (vTelePro) vTelePro.classList.add('hidden');
  if (vAi) vAi.classList.add('hidden');
  if (vCal) vCal.classList.add('hidden');
  if (emptyState && viewName !== 'matrix' && viewName !== 'cards') {
    emptyState.classList.add('hidden');
  }

  const matrixFilterBar = document.getElementById('matrixFilterBar');
  if (matrixFilterBar) {
    if (viewName === 'matrix' || viewName === 'cards') {
      matrixFilterBar.classList.remove('hidden');
    } else {
      matrixFilterBar.classList.add('hidden');
    }
  }

  // Update Master Dropdown Button & Breadcrumb Info
  const masterLabel = document.getElementById('masterMenuCurrentLabel');
  const masterIcon = document.getElementById('masterMenuCurrentIcon');
  const activeViewTitle = document.getElementById('activeViewTitle');
  const activeViewIcon = document.getElementById('activeViewIcon');

  const viewMeta = {
    'matrix': { label: 'Matriz de Guiones', icon: 'table', iconColor: 'text-brand-400', badgeId: 'masterBadgeMatrix', itemId: 'masterItemMatrix' },
    'ai_studio': { label: 'Herramientas de IA', icon: 'sparkles', iconColor: 'text-purple-400', badgeId: 'masterBadgeAiStudio', itemId: 'masterItemAiStudio' },
    'viral_calc': { label: 'Calculadora de Viralidad', icon: 'flame', iconColor: 'text-amber-400', badgeId: 'masterBadgeViralCalc', itemId: 'masterItemViralCalc' },
    'cards': { label: 'Tarjetas Visuales', icon: 'layout-grid', iconColor: 'text-cyan-400', badgeId: 'masterBadgeCards', itemId: 'masterItemCards' },
    'teleprompter': { label: 'Set / Grabación', icon: 'clapperboard', iconColor: 'text-indigo-400', badgeId: 'masterBadgeTeleprompter', itemId: 'masterItemTeleprompter' },
    'teleprompter_pro': { label: 'Teleprónter iPad Pro', icon: 'tv', iconColor: 'text-emerald-400', badgeId: 'masterBadgeTeleprompterPro', itemId: 'masterItemTeleprompterPro' },
    'calendar': { label: 'Calendario de Contenidos', icon: 'calendar', iconColor: 'text-purple-400', badgeId: 'masterBadgeCalendar', itemId: 'masterItemCalendar' }
  };

  const meta = viewMeta[viewName] || viewMeta['matrix'];

  if (masterLabel) masterLabel.textContent = meta.label;
  if (masterIcon) masterIcon.innerHTML = `<i data-lucide="${meta.icon}" class="w-4 h-4 ${meta.iconColor}"></i>`;
  if (activeViewTitle) activeViewTitle.textContent = meta.label;
  if (activeViewIcon) activeViewIcon.innerHTML = `<i data-lucide="${meta.icon}" class="w-3.5 h-3.5 ${meta.iconColor}"></i>`;

  // Update Active Indicators inside Master Menu Dropdown
  Object.keys(viewMeta).forEach(vKey => {
    const itemInfo = viewMeta[vKey];
    const itemBtn = document.getElementById(itemInfo.itemId);
    const itemBadge = document.getElementById(itemInfo.badgeId);
    if (vKey === viewName) {
      if (itemBtn) {
        itemBtn.className = "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-950/60 border border-purple-500/50 transition text-left cursor-pointer";
      }
      if (itemBadge) itemBadge.classList.remove('hidden');
    } else {
      if (itemBtn) {
        itemBtn.className = "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-purple-950/50 border border-transparent hover:border-purple-500/30 transition text-left cursor-pointer";
      }
      if (itemBadge) itemBadge.classList.add('hidden');
    }
  });

  if (viewName === 'viral_calc') {
    if (vViral) vViral.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.add('hidden');
    calculateViralScore();
    renderViralHistoryTable();
  } else if (viewName === 'matrix') {
    if (vMatrix) vMatrix.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.remove('hidden');
  } else if (viewName === 'cards') {
    if (vCards) vCards.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.remove('hidden');
  } else if (viewName === 'teleprompter') {
    if (vTele) vTele.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.remove('hidden');
  } else if (viewName === 'teleprompter_pro') {
    if (vTelePro) vTelePro.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.add('hidden');
    setTimeout(() => {
      if (typeof tpRecalculateWordPositions === 'function') tpRecalculateWordPositions();
    }, 100);
  } else if (viewName === 'ai_studio') {
    if (vAi) vAi.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.add('hidden');
    if (typeof initAiStudio === 'function') initAiStudio();
  } else if (viewName === 'calendar') {
    if (vCal) vCal.classList.remove('hidden');
    if (statsContainer) statsContainer.classList.add('hidden');
    renderCalendarView();
  }

  // Handle emptyState visibility strictly per view
  if (emptyState) {
    if (viewName === 'matrix' || viewName === 'cards') {
      const filtered = getFilteredScripts();
      if (filtered && filtered.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    } else {
      emptyState.classList.add('hidden');
    }
  }

  closeMasterMenu();
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

let currentScriptModalMode = 'structured';

function setScriptModalMode(mode) {
  currentScriptModalMode = mode;
  const btnStruct = document.getElementById('btnModeStructured');
  const btnLibre = document.getElementById('btnModeLibre');
  const secStruct = document.getElementById('sectionStructuredScript');
  const secLibre = document.getElementById('sectionGuionLibre');

  if (mode === 'libre') {
    if (btnLibre) {
      btnLibre.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition bg-purple-600 text-white shadow-sm cursor-pointer';
    }
    if (btnStruct) {
      btnStruct.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer';
    }
    if (secStruct) secStruct.classList.add('hidden');
    if (secLibre) secLibre.classList.remove('hidden');
    updateGuionLibreStats();
  } else {
    if (btnStruct) {
      btnStruct.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition bg-brand-600 text-white shadow-sm cursor-pointer';
    }
    if (btnLibre) {
      btnLibre.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer';
    }
    if (secLibre) secLibre.classList.add('hidden');
    if (secStruct) secStruct.classList.remove('hidden');
  }
  refreshLucideIcons();
}

function updateGuionLibreStats() {
  const textarea = document.getElementById('formGuionLibre');
  const badge = document.getElementById('guionLibreWordCount');
  if (!textarea || !badge) return;
  const text = textarea.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const seconds = Math.round(words / 2.5); // ~150 words per minute
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const timeStr = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  badge.textContent = `${words} palabras · ~${timeStr}`;
}


function openNewScriptModal() {
  scriptPendingAttachments = [];
  renderScriptAttachmentsList();
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

  const formGuionLibre = document.getElementById('formGuionLibre');
  if (formGuionLibre) formGuionLibre.value = '';
  updateGuionLibreStats();

  setScriptModalMode('structured');

  scriptModal.classList.remove('hidden');
  refreshLucideIcons();
}

function openEditScriptModal(id) {
  const script = state.scripts.find(s => s.id === id);
  if (!script) return;

  state.editingScriptId = id;
  scriptPendingAttachments = Array.isArray(script.attachments) ? script.attachments.slice() : [];
  renderScriptAttachmentsList();
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

  const formGuionLibre = document.getElementById('formGuionLibre');
  if (formGuionLibre) {
    formGuionLibre.value = script.guionLibre || (script.scriptType === 'libre' ? script.gancho : '') || '';
  }
  updateGuionLibreStats();

  if (script.scriptType === 'libre' || (!script.historia && !script.moraleja && script.guionLibre)) {
    setScriptModalMode('libre');
  } else {
    setScriptModalMode('structured');
  }

  scriptModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeModal() {
  scriptModal.classList.add('hidden');
}

function submitScriptFormManually() {
  const formClientEl = document.getElementById('formClient');
  const formIdeaEl = document.getElementById('formIdeaGanadora');
  
  let clientName = formClientEl ? formClientEl.value.trim() : '';
  if (!clientName) {
    clientName = state.activeClient !== 'ALL' ? state.activeClient : (state.clients[0] || 'Jennil');
    if (formClientEl) formClientEl.value = clientName;
  }

  if (clientName && !state.clients.includes(clientName)) {
    state.clients.push(clientName);
    renderClientSelect();
  }

  const ideaGanadora = formIdeaEl ? formIdeaEl.value.trim() : '';
  if (!ideaGanadora) {
    if (formIdeaEl) {
      formIdeaEl.focus();
      formIdeaEl.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => formIdeaEl.classList.remove('ring-2', 'ring-amber-500'), 2500);
    }
    showToastNotification('⚠️ Por favor escribe la Idea Ganadora del guión', 'alert-circle');
    return;
  }

  const existingScript = state.editingScriptId ? state.scripts.find(s => s.id === state.editingScriptId) : null;
  const numInput = document.getElementById('formNumber');
  const scriptNumber = numInput ? parseInt(numInput.value, 10) || getNextScriptNumber() : getNextScriptNumber();

  const isLibre = currentScriptModalMode === 'libre';
  const guionLibreText = document.getElementById('formGuionLibre') ? document.getElementById('formGuionLibre').value.trim() : '';
  const ganchoText = document.getElementById('formGancho') ? document.getElementById('formGancho').value.trim() : '';
  const historiaText = document.getElementById('formHistoria') ? document.getElementById('formHistoria').value.trim() : '';
  const moralejaText = document.getElementById('formMoraleja') ? document.getElementById('formMoraleja').value.trim() : '';
  const ctaText = document.getElementById('formCTA') ? document.getElementById('formCTA').value.trim() : '';

  const scriptData = {
    id: state.editingScriptId || ('script-' + Date.now()),
    client: clientName,
    number: scriptNumber,
    status: document.getElementById('formStatus') ? document.getElementById('formStatus').value : 'Por Grabar',
    formato: normalizeScriptFormat(document.getElementById('formFormato') ? document.getElementById('formFormato').value : 'Hablando a cámara'),
    objetivo: document.getElementById('formObjetivo') ? document.getElementById('formObjetivo').value : 'VENTA',
    actor: document.getElementById('formActor') ? document.getElementById('formActor').value.trim() : clientName,
    ideaGanadora: ideaGanadora,
    linkReferencia: document.getElementById('formLinkReferencia') ? document.getElementById('formLinkReferencia').value.trim() : '',
    scriptType: isLibre ? 'libre' : 'structured',
    guionLibre: guionLibreText,
    gancho: isLibre ? (ganchoText || guionLibreText) : ganchoText,
    historia: isLibre ? '' : historiaText,
    moraleja: isLibre ? '' : moralejaText,
    cta: isLibre ? '' : ctaText,
    contextoAdicional: document.getElementById('formContextoAdicional') ? document.getElementById('formContextoAdicional').value.trim() : '',
    attachments: scriptPendingAttachments || [],
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
  renderAll();
  closeModal();
  showToastNotification('✅ Guión guardado con éxito', 'check-circle');
}

function submitQuickIdeaManually() {
  const clientEl = document.getElementById('quickIdeaClient');
  const titleEl = document.getElementById('quickIdeaTitle');
  const linkEl = document.getElementById('quickIdeaLink');
  const notesEl = document.getElementById('quickIdeaNotes');

  const clientName = clientEl ? clientEl.value.trim() : (state.clients[0] || 'Jennil');
  const title = titleEl ? titleEl.value.trim() : '';
  const link = linkEl ? linkEl.value.trim() : '';
  const notes = notesEl ? notesEl.value.trim() : '';

  if (!title) {
    if (titleEl) {
      titleEl.focus();
      titleEl.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => titleEl.classList.remove('ring-2', 'ring-amber-500'), 2500);
    }
    showToastNotification('⚠️ Por favor escribe la idea ganadora', 'alert-circle');
    return;
  }

  const nextNum = getNextScriptNumber();
  const newScript = {
    id: 'script-' + Date.now(),
    client: clientName,
    number: nextNum,
    status: 'Idea',
    ideaGanadora: title,
    linkReferencia: link,
    gancho: notes || title,
    historia: notes ? ('Notas: ' + notes) : 'Pendiente de redactar historia...',
    moraleja: 'Pendiente de redactar moraleja...',
    cta: 'Pendiente de redactar CTA...',
    formato: 'Hablando a cámara',
    objetivo: 'VIRAL',
    actor: clientName,
    contextoAdicional: notes ? ('Idea rápida: ' + notes) : '',
    attachments: quickIdeaPendingAttachments || [],
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.scripts.push(newScript);
  saveState();
  closeQuickIdeaModal();
  state.activeStatus = 'Idea';
  renderAll();
  showToastNotification('💡 ¡Idea #' + nextNum + ' guardada con éxito!');
}

function handleScriptSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  submitScriptFormManually();
}

// QUICK IDEA CAPTURE LOGIC
function openQuickIdeaModal() {
  quickIdeaPendingAttachments = [];
  renderQuickIdeaAttachmentsList();
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
  if (e && e.preventDefault) e.preventDefault();
  submitQuickIdeaManually();
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

// (openTeleprompterForScript defined above)

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

// HTML Escape Helper
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// MODULAR PRINT & EXPORT PDF STUDIO
// ==========================================

function openPrintModal() {
  currentPrintModule = 'matrix';
  printViralMode = 'current';
  setPrintModule('matrix');
  if (printModal) printModal.classList.remove('hidden');
  refreshLucideIcons();
}

function closePrintModal() {
  if (printModal) printModal.classList.add('hidden');
}

function setPrintModule(moduleName) {
  currentPrintModule = moduleName;
  
  // Update Tab active classes
  const tabs = [
    { id: 'btnPrintTabMatrix', name: 'matrix', activeBorder: 'border-brand-500', activeBg: 'bg-brand-500/10', activeText: 'text-white' },
    { id: 'btnPrintTabCards', name: 'cards', activeBorder: 'border-purple-500', activeBg: 'bg-purple-500/10', activeText: 'text-white' },
    { id: 'btnPrintTabViral', name: 'viral', activeBorder: 'border-amber-500', activeBg: 'bg-amber-500/10', activeText: 'text-white' },
    { id: 'btnPrintTabIdeas', name: 'ideas', activeBorder: 'border-yellow-500', activeBg: 'bg-yellow-500/10', activeText: 'text-white' }
  ];

  tabs.forEach(tab => {
    const el = document.getElementById(tab.id);
    if (!el) return;
    if (tab.name === moduleName) {
      el.className = `print-module-tab p-2.5 rounded-xl border ${tab.activeBorder} ${tab.activeBg} ${tab.activeText} font-bold text-xs flex flex-col items-center gap-1 transition text-center cursor-pointer shadow-sm`;
    } else {
      el.className = `print-module-tab p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-semibold text-xs flex flex-col items-center gap-1 transition text-center cursor-pointer`;
    }
  });

  const viralOptionsContainer = document.getElementById('printViralOptionsContainer');
  if (viralOptionsContainer) {
    if (moduleName === 'viral') {
      viralOptionsContainer.classList.remove('hidden');
    } else {
      viralOptionsContainer.classList.add('hidden');
    }
  }

  // Reset print selection to match the active module
  if (moduleName === 'matrix' || moduleName === 'cards') {
    printSelectedIds = new Set(getFilteredScripts().map(s => s.id));
  } else if (moduleName === 'viral') {
    printSelectedIds = new Set((state.viralEvaluations || []).map(e => e.id));
  } else if (moduleName === 'ideas') {
    printSelectedIds = new Set(getAllIdeasForPrint().map(i => i.id));
  }

  renderPrintSelectionList();
  refreshLucideIcons();
}

function handlePrintViralModeChange() {
  const selectedRadio = document.querySelector('input[name="printViralMode"]:checked');
  if (selectedRadio) {
    printViralMode = selectedRadio.value;
  }
  if (printViralMode === 'history') {
    printSelectedIds = new Set((state.viralEvaluations || []).map(e => e.id));
  }
  renderPrintSelectionList();
}

function getAllIdeasForPrint() {
  const ideasList = [];
  
  // Ideas from scripts
  (state.scripts || []).forEach(s => {
    if (s.status === 'Idea' || (!s.gancho && !s.historia)) {
      ideasList.push({
        id: s.id,
        type: 'Idea de Guión',
        title: s.ideaGanadora || 'Idea sin título',
        client: s.client || 'General',
        content: s.contextoAdicional || s.historia || s.gancho || 'Sin contenido adicional',
        date: s.createdAt || new Date().toISOString()
      });
    }
  });

  // Ideas / Notes from client notes
  if (state.notes && typeof state.notes === 'object') {
    Object.entries(state.notes).forEach(([client, notes]) => {
      if (Array.isArray(notes)) {
        notes.forEach(note => {
          ideasList.push({
            id: note.id,
            type: 'Nota / Idea Estratégica',
            title: note.title || 'Nota sin título',
            client: client,
            content: note.content || '',
            date: note.updatedAt || new Date().toISOString()
          });
        });
      }
    });
  }

  return ideasList;
}

function renderPrintSelectionList() {
  const selectionArea = document.getElementById('printSelectionArea');
  const selectionLabel = document.getElementById('printSelectionLabel');
  const buttonsWrapper = document.getElementById('printSelectButtonsWrapper');
  const listContainer = document.getElementById('printScriptsList');
  const counter = document.getElementById('printSelectionCounter');

  if (!listContainer) return;
  listContainer.innerHTML = '';

  if (currentPrintModule === 'matrix' || currentPrintModule === 'cards') {
    if (selectionArea) selectionArea.classList.remove('hidden');
    if (buttonsWrapper) buttonsWrapper.classList.remove('hidden');
    if (selectionLabel) {
      selectionLabel.textContent = currentPrintModule === 'matrix' 
        ? 'Seleccionar guiones para la Matriz & Resumen:' 
        : 'Seleccionar fichas de guión para grabación:';
    }

    const filtered = getFilteredScripts();
    if (filtered.length === 0) {
      listContainer.innerHTML = `<p class="text-slate-500 text-xs py-4 text-center">No hay guiones disponibles para el filtro actual.</p>`;
      if (counter) counter.textContent = `0 guiones seleccionados`;
      return;
    }

    filtered.forEach(script => {
      const isChecked = printSelectedIds.has(script.id);
      const item = document.createElement('div');
      item.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition";
      item.innerHTML = `
        <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePrintItemId('${script.id}')" class="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500 cursor-pointer">
          <span class="font-bold text-slate-300 shrink-0">#${script.number || '?'}</span>
          <span class="font-medium text-white truncate">${escapeHtml(script.ideaGanadora || 'Sin título')}</span>
        </label>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">${escapeHtml(script.status || 'Idea')}</span>
          <span class="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">${escapeHtml(script.client)}</span>
        </div>
      `;
      listContainer.appendChild(item);
    });

    if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${filtered.length} guión(es)`;

  } else if (currentPrintModule === 'viral') {
    if (printViralMode === 'guide') {
      if (buttonsWrapper) buttonsWrapper.classList.add('hidden');
      if (selectionLabel) selectionLabel.textContent = '📚 Manual y Conceptos de Viralidad:';
      
      listContainer.innerHTML = `
        <div class="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-amber-300 text-sm">📖 Guía de Criterios y Reglas BLEX</span>
            <span class="font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Manual Completo</span>
          </div>
          <p class="text-slate-300">Incluye la explicación de los <strong>6 Criterios Ponderados</strong> (+10.0 pts), los <strong>4 Grupos de Formatos</strong> (+4.5 pts) y la <strong>Escala de Dictámenes</strong>.</p>
          <p class="text-[11px] text-amber-400 font-semibold">✓ Listo para imprimir como documento de referencia y capacitación.</p>
        </div>
      `;
      if (counter) counter.textContent = `Se imprimirá la Guía Técnica de Conceptos y Criterios`;

    } else if (printViralMode === 'current') {
      if (buttonsWrapper) buttonsWrapper.classList.add('hidden');
      if (selectionLabel) selectionLabel.textContent = '🎯 Evaluación de la Idea Actual en Pantalla:';
      
      const currentData = getCurrentViralFormData();
      listContainer.innerHTML = `
        <div class="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-amber-300 text-sm truncate max-w-[280px]">🎯 ${escapeHtml(currentData.title || '(Idea en evaluación)')}</span>
            <span class="font-mono font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">${currentData.totalScore} / 14.5 pts</span>
          </div>
          <p class="text-slate-300"><strong>Cliente:</strong> ${escapeHtml(currentData.client)} | <strong>Formato:</strong> ${escapeHtml(currentData.format)}</p>
          <p class="text-slate-400 text-[11px]">Potencial: <strong class="text-white">${escapeHtml(currentData.potential)}</strong> (Se imprimirá la ficha técnica con todos los criterios y dictamen).</p>
        </div>
      `;
      if (counter) counter.textContent = `Se imprimirá la Ficha de Evaluación Activa (1 ficha ejecutiva)`;

    } else {
      // History mode
      if (buttonsWrapper) buttonsWrapper.classList.remove('hidden');
      if (selectionLabel) selectionLabel.textContent = '📋 Seleccionar evaluaciones del historial a imprimir:';
      
      const evals = state.viralEvaluations || [];
      if (evals.length === 0) {
        listContainer.innerHTML = `<p class="text-slate-500 text-xs py-4 text-center">No hay evaluaciones guardadas en el historial.</p>`;
        if (counter) counter.textContent = `0 evaluaciones seleccionadas`;
        return;
      }

      evals.forEach(item => {
        const isChecked = printSelectedIds.has(item.id);
        const el = document.createElement('div');
        el.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition";
        el.innerHTML = `
          <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2">
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePrintItemId('${item.id}')" class="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer">
            <span class="font-bold text-amber-400 shrink-0 font-mono">${(item.totalScore || 0).toFixed(1)}/14.5</span>
            <span class="font-medium text-white truncate">${escapeHtml(item.title || 'Sin título')}</span>
          </label>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${item.totalScore >= 10 ? 'bg-emerald-500/10 text-emerald-400' : item.totalScore >= 7 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}">${escapeHtml(item.potential || 'Bajo')}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">${escapeHtml(item.client || 'General')}</span>
          </div>
        `;
        listContainer.appendChild(el);
      });

      if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${evals.length} evaluación(es) del historial`;
    }

  } else if (currentPrintModule === 'ideas') {
    if (selectionArea) selectionArea.classList.remove('hidden');
    if (buttonsWrapper) buttonsWrapper.classList.remove('hidden');
    if (selectionLabel) selectionLabel.textContent = 'Seleccionar ideas y notas a imprimir:';

    const ideas = getAllIdeasForPrint();
    if (ideas.length === 0) {
      listContainer.innerHTML = `<p class="text-slate-500 text-xs py-4 text-center">No hay ideas o notas registradas.</p>`;
      if (counter) counter.textContent = `0 ideas seleccionadas`;
      return;
    }

    ideas.forEach(item => {
      const isChecked = printSelectedIds.has(item.id);
      const el = document.createElement('div');
      el.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition";
      el.innerHTML = `
        <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePrintItemId('${item.id}')" class="rounded border-slate-700 bg-slate-950 text-yellow-500 focus:ring-yellow-500 cursor-pointer">
          <span class="font-bold text-yellow-400 shrink-0 text-[10px] uppercase">[${item.type.includes('Nota') ? 'NOTA' : 'IDEA'}]</span>
          <span class="font-medium text-white truncate">${escapeHtml(item.title)}</span>
        </label>
        <span class="text-[10px] uppercase font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded shrink-0">${escapeHtml(item.client)}</span>
      `;
      listContainer.appendChild(el);
    });

    if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${ideas.length} idea(s)/nota(s)`;
  }
}

function togglePrintItemId(id) {
  if (printSelectedIds.has(id)) {
    printSelectedIds.delete(id);
  } else {
    printSelectedIds.add(id);
  }
  
  const counter = document.getElementById('printSelectionCounter');
  if (currentPrintModule === 'matrix' || currentPrintModule === 'cards') {
    if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${getFilteredScripts().length} guión(es)`;
  } else if (currentPrintModule === 'viral') {
    if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${(state.viralEvaluations || []).length} evaluación(es)`;
  } else if (currentPrintModule === 'ideas') {
    if (counter) counter.textContent = `Se imprimirán ${printSelectedIds.size} de ${getAllIdeasForPrint().length} idea(s)/nota(s)`;
  }
}

function selectAllPrintItems() {
  if (currentPrintModule === 'matrix' || currentPrintModule === 'cards') {
    printSelectedIds = new Set(getFilteredScripts().map(s => s.id));
  } else if (currentPrintModule === 'viral') {
    printSelectedIds = new Set((state.viralEvaluations || []).map(e => e.id));
  } else if (currentPrintModule === 'ideas') {
    printSelectedIds = new Set(getAllIdeasForPrint().map(i => i.id));
  }
  renderPrintSelectionList();
}

function deselectAllPrintItems() {
  printSelectedIds.clear();
  renderPrintSelectionList();
}

// Backwards compatibility aliases
function selectAllPrintScripts() { selectAllPrintItems(); }
function deselectAllPrintScripts() { deselectAllPrintItems(); }
function togglePrintScriptId(id) { togglePrintItemId(id); }
function handleExecutePrint() { executeEnhancedPrint(false); }

function getStandalonePrintStyles() {
  return `
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 9.5pt;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }
    .print-doc-container {
      width: 100%;
      max-width: 100%;
      padding: 6mm 8mm;
      margin: 0 auto;
      background: #ffffff;
    }
    .print-doc-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .print-kpi-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      margin-bottom: 16px;
    }
    .print-kpi-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 4px;
      text-align: center;
      background: #f8fafc;
    }
    .print-kpi-value {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      font-family: monospace, sans-serif;
    }
    .print-kpi-label {
      font-size: 6.5pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      margin-top: 2px;
    }
    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
      font-size: 8.5pt;
    }
    .print-table th {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      padding: 6px 8px !important;
      font-weight: 700;
      text-align: left;
    }
    .print-table td {
      border: 1px solid #cbd5e1 !important;
      padding: 6px 8px !important;
      color: #1e293b !important;
      vertical-align: middle;
    }
    .print-card {
      border: 1px solid #cbd5e1;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .print-section-box {
      background-color: #f8fafc;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      border-left-width: 4px;
    }
    .print-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      border: 1px solid #cbd5e1;
      background: #f1f5f9;
      color: #0f172a;
    }
    .print-avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .print-page-break {
      page-break-after: always;
      break-after: page;
    }
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: sans-serif;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      .print-doc-container {
        padding: 0 !important;
      }
    }
  `;
}

function generateCompletePrintDocument(forNewTab = false) {
  let bodyContent = '';
  const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  if (currentPrintModule === 'matrix') {
    const allFiltered = getFilteredScripts();
    const scripts = allFiltered.filter(s => printSelectedIds.has(s.id));
    if (scripts.length === 0) {
      alert('Por favor selecciona al menos un guión para imprimir.');
      return null;
    }

    const countTotal = scripts.length;
    const countIdeas = scripts.filter(s => s.status === 'Idea').length;
    const countRedactados = scripts.filter(s => s.status === 'Redactado').length;
    const countPorGrabar = scripts.filter(s => s.status === 'Por Grabar').length;
    const countEnEdicion = scripts.filter(s => s.status === 'En Edición').length;
    const countEditados = scripts.filter(s => s.status === 'Editado').length;
    const countPublicados = scripts.filter(s => s.status === 'Publicado').length;

    const statusCategories = [
      { key: 'Idea', label: 'Ideas', icon: '💡', count: countIdeas, bg: '#fef9c3', text: '#854d0e', border: '#fef08a' },
      { key: 'Redactado', label: 'Redactados', icon: '📝', count: countRedactados, bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
      { key: 'Por Grabar', label: 'Por Grabar', icon: '🎬', count: countPorGrabar, bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
      { key: 'En Edición', label: 'En Edición', icon: '💻', count: countEnEdicion, bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
      { key: 'Editado', label: 'Editados', icon: '✂️', count: countEditados, bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
      { key: 'Publicado', label: 'Publicados', icon: '🚀', count: countPublicados, bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }
    ];

    bodyContent = `
      <div class="print-doc-header">
        <div>
          <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a; letter-spacing: -0.5px;">BLEX STUDIO</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #16a34a; margin: 0;">📊 MATRIZ ESTRATÉGICA & RESUMEN DE PRODUCCIÓN</p>
        </div>
        <div style="text-align: right; font-size: 9pt; color: #64748b;">
          <p style="margin: 0;"><strong>Cliente:</strong> ${state.activeClient === 'ALL' ? 'Todos los Clientes' : escapeHtml(state.activeClient)}</p>
          <p style="margin: 2px 0 0 0;"><strong>Total Guiones Seleccionados:</strong> ${countTotal} | <strong>Fecha:</strong> ${dateStr}</p>
        </div>
      </div>

      <!-- KPI METRICS SUMMARY BAR -->
      <div class="print-kpi-grid">
        <div class="print-kpi-card" style="border-color: #0f172a; background: #0f172a; color: #ffffff;">
          <div class="print-kpi-value" style="color: #22c55e;">${countTotal}</div>
          <div class="print-kpi-label" style="color: #e2e8f0;">Total General</div>
        </div>
        ${statusCategories.map(cat => `
          <div class="print-kpi-card" style="border-color: ${cat.border}; background: ${cat.bg};">
            <div class="print-kpi-value" style="color: ${cat.text};">${cat.count}</div>
            <div class="print-kpi-label" style="color: ${cat.text};">${cat.icon} ${cat.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- DESGLOSE DETALLADO POR ESTADO (CUÁNTOS Y CUÁLES SON) -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 12pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 14px 0;">
          📋 Desglose Detallado por Estado de Producción
        </h2>

        ${statusCategories.map(cat => {
          const groupScripts = scripts.filter(s => s.status === cat.key);
          if (groupScripts.length === 0) return '';
          return `
            <div class="print-avoid-break" style="margin-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; background: ${cat.bg}; border: 1px solid ${cat.border}; padding: 6px 12px; border-radius: 6px 6px 0 0;">
                <span style="font-size: 10pt; font-weight: 800; color: ${cat.text};">${cat.icon} ${cat.label.toUpperCase()} (${groupScripts.length})</span>
                <span style="font-size: 8pt; font-weight: 600; color: ${cat.text};">${groupScripts.length === 1 ? '1 guión' : groupScripts.length + ' guiones'}</span>
              </div>
              <table class="print-table" style="margin-top: 0; border-top: none;">
                <thead>
                  <tr>
                    <th style="width: 35px; text-align: center;">#</th>
                    <th style="width: 75px;">Cliente</th>
                    <th>Título / Idea Ganadora</th>
                    <th style="width: 120px;">Formato / Obj.</th>
                    <th style="width: 70px;">Actor</th>
                    <th>Gancho Inicial</th>
                  </tr>
                </thead>
                <tbody>
                  ${groupScripts.map(s => `
                    <tr>
                      <td style="text-align: center; font-weight: bold; font-family: monospace;">#${s.number || '?'}</td>
                      <td style="font-weight: bold;">${escapeHtml(s.client)}</td>
                      <td style="font-weight: 600; color: #0f172a;">${escapeHtml(s.ideaGanadora || '-')}</td>
                      <td>
                        <div style="font-size: 8.5pt; font-weight: 600;">${escapeHtml(s.formato || '-')}</div>
                        <div style="font-size: 7.5pt; color: #64748b; text-transform: uppercase;">${escapeHtml(s.objetivo || '')}</div>
                      </td>
                      <td style="font-size: 8.5pt;">${escapeHtml(s.actor || 'Principal')}</td>
                      <td style="font-size: 8.5pt; color: #334155;">${escapeHtml(s.gancho || '-')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }).join('')}
      </div>

      <!-- TABLA GENERAL DE MATRIZ COMPLETA -->
      <div class="print-avoid-break" style="margin-top: 20px;">
        <h2 style="font-size: 12pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 10px 0;">
          📊 Matriz General Completa (${countTotal} guiones)
        </h2>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th style="width: 70px;">Cliente</th>
              <th style="width: 140px;">Título / Idea</th>
              <th style="width: 90px;">Formato</th>
              <th>🎣 Gancho</th>
              <th>📖 Historia</th>
              <th>💡 Moraleja</th>
              <th>🚀 CTA</th>
              <th style="width: 70px; text-align: center;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${scripts.map(s => `
              <tr class="print-avoid-break">
                <td style="text-align: center; font-weight: bold; font-family: monospace;">#${s.number || '?'}</td>
                <td style="font-weight: bold;">${escapeHtml(s.client)}</td>
                <td style="font-weight: bold; color: #0f172a;">${escapeHtml(s.ideaGanadora || '')}</td>
                <td style="font-size: 8pt;">${escapeHtml(s.formato || '-')}</td>
                <td style="font-size: 8pt;">${escapeHtml(s.gancho || '-')}</td>
                <td style="font-size: 8pt;">${escapeHtml(s.historia || '-')}</td>
                <td style="font-size: 8pt;">${escapeHtml(s.moraleja || '-')}</td>
                <td style="font-size: 8pt;">${escapeHtml(s.cta || '-')}</td>
                <td style="text-align: center;">
                  <span class="print-badge" style="font-size: 7.5pt;">${escapeHtml(s.status || 'Idea')}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (currentPrintModule === 'cards') {
    const scripts = getFilteredScripts().filter(s => printSelectedIds.has(s.id));
    if (scripts.length === 0) {
      alert('Por favor selecciona al menos un guión para imprimir.');
      return null;
    }

    bodyContent = `
      <div class="print-doc-header">
        <div>
          <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">BLEX STUDIO</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #7c3aed; margin: 0;">🎴 FICHAS DETALLADAS DE PRODUCCIÓN Y GRABACIÓN</p>
        </div>
        <div style="text-align: right; font-size: 9pt; color: #64748b;">
          <p style="margin: 0;"><strong>Cliente:</strong> ${state.activeClient === 'ALL' ? 'Todos' : escapeHtml(state.activeClient)}</p>
          <p style="margin: 2px 0 0 0;"><strong>Total Fichas:</strong> ${scripts.length} | <strong>Fecha:</strong> ${dateStr}</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${scripts.map(s => `
          <div class="print-card print-avoid-break">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 12pt; font-weight: 800; color: #0f172a; margin-right: 8px;">#${s.number || '?'}</span>
                <span style="font-size: 11pt; font-weight: 700; color: #0f172a;">${escapeHtml(s.ideaGanadora || 'Sin título')}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <span class="print-badge">${escapeHtml(s.client)}</span>
                <span class="print-badge" style="background: #ede9fe; color: #6b21a8; border-color: #ddd6fe;">${escapeHtml(s.formato || 'Formato')}</span>
                <span class="print-badge" style="background: #f0fdf4; color: #166534; border-color: #bbf7d0;">${escapeHtml(s.status || 'Estado')}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div class="print-section-box" style="border-left-color: #ef4444;">
                <strong style="font-size: 8.5pt; text-transform: uppercase; color: #b91c1c; display: block; margin-bottom: 4px;">🎣 Gancho (0 a 3 seg)</strong>
                <p style="font-size: 9.5pt; font-weight: 600; margin: 0; color: #0f172a; line-height: 1.4;">${escapeHtml(s.gancho || '-')}</p>
              </div>
              <div class="print-section-box" style="border-left-color: #3b82f6;">
                <strong style="font-size: 8.5pt; text-transform: uppercase; color: #1d4ed8; display: block; margin-bottom: 4px;">📖 Historia / Desarrollo</strong>
                <p style="font-size: 9.5pt; margin: 0; color: #334155; line-height: 1.4;">${escapeHtml(s.historia || '-')}</p>
              </div>
              <div class="print-section-box" style="border-left-color: #f59e0b;">
                <strong style="font-size: 8.5pt; text-transform: uppercase; color: #b45309; display: block; margin-bottom: 4px;">💡 Moraleja / Enfoque</strong>
                <p style="font-size: 9.5pt; margin: 0; color: #334155; line-height: 1.4;">${escapeHtml(s.moraleja || '-')}</p>
              </div>
              <div class="print-section-box" style="border-left-color: #10b981;">
                <strong style="font-size: 8.5pt; text-transform: uppercase; color: #047857; display: block; margin-bottom: 4px;">🚀 Llamado a la Acción (CTA)</strong>
                <p style="font-size: 9.5pt; font-weight: 600; margin: 0; color: #0f172a; line-height: 1.4;">${escapeHtml(s.cta || '-')}</p>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 8.5pt; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
              <span><strong>Actor / Vocero:</strong> ${escapeHtml(s.actor || 'Principal')}</span>
              <span><strong>Contexto / Locación:</strong> ${escapeHtml(s.contextoAdicional || 'Estudio')}</span>
              <span><strong>Objetivo:</strong> ${escapeHtml(s.objetivo || 'General')}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } else if (currentPrintModule === 'viral') {
    if (printViralMode === 'guide') {
      bodyContent = `
        <div class="print-doc-header">
          <div>
            <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a; letter-spacing: -0.5px;">BLEX STUDIO</h1>
            <p style="font-size: 11pt; font-weight: 700; color: #d97706; margin: 0;">📚 MANUAL TÉCNICO DE VIRALIDAD & RETENCIÓN DE AUDIENCIA</p>
          </div>
          <div style="text-align: right; font-size: 9pt; color: #64748b;">
            <p style="margin: 0;"><strong>Guía Metodológica Oficial</strong></p>
            <p style="margin: 2px 0 0 0;"><strong>Fecha de Emisión:</strong> ${dateStr}</p>
          </div>
        </div>

        <!-- KPI SUMMARY SUMMARY OF THE METHODOLOGY -->
        <div class="print-kpi-grid" style="grid-template-columns: repeat(4, 1fr) !important; margin-bottom: 16px;">
          <div class="print-kpi-card" style="border-color: #0f172a; background: #0f172a; color: #ffffff;">
            <div class="print-kpi-value" style="color: #f59e0b;">14.5 pts</div>
            <div class="print-kpi-label" style="color: #e2e8f0;">Puntaje Máximo Posible</div>
          </div>
          <div class="print-kpi-card" style="border-color: #fef08a; background: #fef9c3;">
            <div class="print-kpi-value" style="color: #b45309;">6 Criterios</div>
            <div class="print-kpi-label" style="color: #b45309;">Base de Viralidad (+10.0 pts)</div>
          </div>
          <div class="print-kpi-card" style="border-color: #ddd6fe; background: #faf5ff;">
            <div class="print-kpi-value" style="color: #6b21a8;">4 Grupos</div>
            <div class="print-kpi-label" style="color: #6b21a8;">Formatos de Retención (+4.5 pts)</div>
          </div>
          <div class="print-kpi-card" style="border-color: #bbf7d0; background: #f0fdf4;">
            <div class="print-kpi-value" style="color: #166534;">≥ 10.0 pts</div>
            <div class="print-kpi-label" style="color: #166534;">🚀 Umbral Viral Aprobado</div>
          </div>
        </div>

        <!-- SECCIÓN 1: LOS 6 CRITERIOS BASE PONDERADOS (10.0 PTS MAX) -->
        <div class="print-avoid-break" style="margin-bottom: 16px;">
          <h2 style="font-size: 11pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 10px 0;">
            🎯 1. Los 6 Criterios de Viralidad Ponderados (Máx 10.0 Puntos)
          </h2>
          <table class="print-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">#</th>
                <th style="width: 170px;">Criterio Estratégico</th>
                <th style="width: 80px; text-align: center;">Puntaje</th>
                <th>Definición y Regla de Cumplimiento</th>
                <th style="width: 130px;">Impacto Psicológico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center; font-weight: bold;">1</td>
                <td style="font-weight: bold; color: #0f172a;">Regla del Niño de 5 Años</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+2.5 pts</td>
                <td>El concepto y el gancho se entienden al instante. Cero palabras técnicas o tecnicismos abstractos.</td>
                <td style="font-size: 8pt; color: #475569;">Elimina fricción cognitiva inmediata en los primeros 3 segundos.</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">2</td>
                <td style="font-weight: bold; color: #0f172a;">Regla del 50 de 100</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+2.5 pts</td>
                <td>Si le preguntas a 100 personas al azar en la calle, al menos a 50 les interesa o afecta directamente.</td>
                <td style="font-size: 8pt; color: #475569;">Garantiza mercado masivo y consumo transversal del algoritmo.</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">3</td>
                <td style="font-weight: bold; color: #0f172a;">Referencia Viral Comprobada</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+2.0 pts</td>
                <td>El concepto o gancho está modelado de un video validado que superó las 100k a 1M+ reproducciones.</td>
                <td style="font-size: 8pt; color: #475569;">Reduce riesgo; reproduce patrones de retención probados.</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">4</td>
                <td style="font-weight: bold; color: #0f172a;">Mercado de Alto Consumo</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+0.5 pts</td>
                <td>Temáticas de altísimo tráfico: dinero, ahorro, salud, hábitos, relaciones, psicología o tecnología.</td>
                <td style="font-size: 8pt; color: #475569;">Aumenta ratio de compartidos por WhatsApp y guardados.</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">5</td>
                <td style="font-weight: bold; color: #0f172a;">Tendencia o Novedad</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+1.5 pts</td>
                <td>Se conecta con un tema en conversación activa: noticias del día, cambios normativos o coyuntura.</td>
                <td style="font-size: 8pt; color: #475569;">Aprovecha picos de búsqueda e interés del momento (Trend Hijacking).</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">6</td>
                <td style="font-weight: bold; color: #0f172a;">Controversia o Debate</td>
                <td style="text-align: center; font-weight: 800; color: #d97706; font-size: 9.5pt;">+1.0 pts</td>
                <td>Contiene una opinión contundente o postura sana que estimula comentarios y opiniones opuestas.</td>
                <td style="font-size: 8pt; color: #475569;">Dispara la tasa de comentarios, métrica clave para el algoritmo.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECCIÓN 2: LOS 4 GRUPOS DE FORMATOS AUDIOVISUALES (4.5 PTS MAX) -->
        <div class="print-avoid-break" style="margin-bottom: 16px;">
          <h2 style="font-size: 11pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 10px 0;">
            📹 2. Los 4 Grupos de Formatos Audiovisuales & Niveles de Retención (+4.5 pts)
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            
            <div class="print-section-box" style="border-left-color: #8b5cf6;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 9pt; color: #6d28d9; text-transform: uppercase;">🎬 Grupo 1: Inmersión Total</strong>
                <span class="print-badge" style="background: #f5f3ff; color: #6d28d9; border-color: #ddd6fe;">+3.5 a +4.5 pts</span>
              </div>
              <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">Máxima retención. La cámara es el espectador viviendo la experiencia en primera persona o con dinamismo cinematográfico.</p>
              <ul style="font-size: 8pt; color: #475569; margin: 0; padding-left: 16px;">
                <li><strong>POV (Point of View):</strong> +4.5 pts (El usuario siente que lo está viviendo)</li>
                <li><strong>Vlog Dinámico:</strong> +4.0 pts (Cambios continuos de plano y acción)</li>
                <li><strong>Formato Dinámico:</strong> +3.5 pts (B-Roll ágil y estímulos visuales)</li>
              </ul>
            </div>

            <div class="print-section-box" style="border-left-color: #0284c7;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 9pt; color: #0369a1; text-transform: uppercase;">🎙️ Grupo 2: Efecto Testigo & Curiosidad</strong>
                <span class="print-badge" style="background: #f0f9ff; color: #0369a1; border-color: #bae6fd;">+2.5 a +3.5 pts</span>
              </div>
              <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">Activa el voyerismo social y la curiosidad natural al observar una interacción espontánea entre dos personas.</p>
              <ul style="font-size: 8pt; color: #475569; margin: 0; padding-left: 16px;">
                <li><strong>Prima Pregunta:</strong> +3.5 pts (Interrupción callejera o pregunta rápida)</li>
                <li><strong>Entrevista Dinámica:</strong> +3.0 pts (Diálogo fluido con micrófono visible)</li>
                <li><strong>Mirando a la Nada:</strong> +2.5 pts (Habla a un tercero fuera de cuadro)</li>
              </ul>
            </div>

            <div class="print-section-box" style="border-left-color: #0d9488;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 9pt; color: #0f766e; text-transform: uppercase;">🟩 Grupo 3: Demostración & Comentario</strong>
                <span class="print-badge" style="background: #f0fdfa; color: #0f766e; border-color: #99f6e4;">+2.0 a +2.5 pts</span>
              </div>
              <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">Soporte visual con reacción o análisis simultáneo de pruebas, capturas o eventos en tiempo real.</p>
              <ul style="font-size: 8pt; color: #475569; margin: 0; padding-left: 16px;">
                <li><strong>Pantalla Dividida (Split):</strong> +2.5 pts (Doble estímulo visual simultáneo)</li>
                <li><strong>Pantalla Verde (Green Screen):</strong> +2.0 pts (Reacción sobre artículo o noticia)</li>
              </ul>
            </div>

            <div class="print-section-box" style="border-left-color: #f59e0b;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 9pt; color: #b45309; text-transform: uppercase;">🗣️ Grupo 4: Exposición Frontal</strong>
                <span class="print-badge" style="background: #fefce8; color: #b45309; border-color: #fef08a;">+1.0 a +1.5 pts</span>
              </div>
              <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">Formato tradicional de mayor fricción que requiere ganchos hiper-potentes para retener al usuario.</p>
              <ul style="font-size: 8pt; color: #475569; margin: 0; padding-left: 16px;">
                <li><strong>Formato Selfie:</strong> +1.5 pts (Cámara en mano, espontaneidad y cercanía)</li>
                <li><strong>Hablando a Cámara (Talking Head):</strong> +1.0 pt (Busto parlante con trípode fijo)</li>
              </ul>
            </div>

          </div>
        </div>

        <!-- SECCIÓN 3: MATRIZ DE DECISIÓN Y ESCALA DE DICTÁMENES -->
        <div class="print-avoid-break">
          <h2 style="font-size: 11pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin: 0 0 10px 0;">
            ⚖️ 3. Escala de Dictámenes & Matriz de Producción BLEX
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
            <div style="border: 1.5px solid #a7f3d0; background: #ecfdf5; border-radius: 8px; padding: 8px 10px;">
              <div style="font-size: 11pt; font-weight: 900; color: #065f46;">🟢 10.0 – 14.5 pts</div>
              <strong style="font-size: 8.5pt; color: #047857; display: block; margin: 2px 0;">ALTO POTENCIAL VIRAL</strong>
              <p style="font-size: 7.8pt; color: #064e3b; margin: 0; line-height: 1.35;">Aprobado para guionizado y grabación con máxima prioridad. Excelente combinación de atractivo masivo e inmersión.</p>
            </div>
            <div style="border: 1.5px solid #fde68a; background: #fffbeb; border-radius: 8px; padding: 8px 10px;">
              <div style="font-size: 11pt; font-weight: 900; color: #92400e;">🟡 7.0 – 9.5 pts</div>
              <strong style="font-size: 8.5pt; color: #b45309; display: block; margin: 2px 0;">POTENCIAL MEDIO</strong>
              <p style="font-size: 7.8pt; color: #78350f; margin: 0; line-height: 1.35;">Viable para audiencia tibia. Para público frío, optimizar el gancho de 0-3 segundos o migrar a un formato con mayor inmersión.</p>
            </div>
            <div style="border: 1.5px solid #fecaca; background: #fef2f2; border-radius: 8px; padding: 8px 10px;">
              <div style="font-size: 11pt; font-weight: 900; color: #991b1b;">🔴 0.0 – 6.5 pts</div>
              <strong style="font-size: 8.5pt; color: #b91c1c; display: block; margin: 2px 0;">POTENCIAL BAJO</strong>
              <p style="font-size: 7.8pt; color: #7f1d1d; margin: 0; line-height: 1.35;">No producir en este estado. Se recomienda reformular la idea, hacerla comprensible por cualquiera o buscar un caso real más sólido.</p>
            </div>
          </div>
        </div>
      `;

    } else if (printViralMode === 'current') {
      const data = getCurrentViralFormData();

      bodyContent = `
        <div class="print-doc-header">
          <div>
            <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">BLEX STUDIO</h1>
            <p style="font-size: 11pt; font-weight: 700; color: #d97706; margin: 0;">🔥 FICHA EJECUTIVA DE EVALUACIÓN VIRAL</p>
          </div>
          <div style="text-align: right; font-size: 9pt; color: #64748b;">
            <p style="margin: 0;"><strong>Cliente:</strong> ${escapeHtml(data.client)}</p>
            <p style="margin: 2px 0 0 0;"><strong>Fecha de Evaluación:</strong> ${dateStr}</p>
          </div>
        </div>

        <div class="print-card" style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
            <div>
              <span style="font-size: 8.5pt; font-weight: 800; text-transform: uppercase; color: #d97706; display: block; margin-bottom: 2px;">Idea Evaluada en Pantalla</span>
              <h2 style="font-size: 14pt; font-weight: 800; color: #0f172a; margin: 0;">${escapeHtml(data.title || '(Sin título ingresado)')}</h2>
              ${data.link ? `<p style="font-size: 8.5pt; color: #0284c7; margin: 4px 0 0 0;">🔗 ${escapeHtml(data.link)}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 26pt; font-weight: 900; font-family: monospace; color: ${data.totalScore >= 10 ? '#059669' : data.totalScore >= 7 ? '#d97706' : '#dc2626'};">${data.totalScore.toFixed(1)} <span style="font-size: 12pt; color: #64748b;">/ 14.5</span></div>
              <span class="print-badge" style="font-size: 8.5pt; background: ${data.totalScore >= 10 ? '#ecfdf5' : data.totalScore >= 7 ? '#fffbeb' : '#fef2f2'}; color: ${data.totalScore >= 10 ? '#065f46' : data.totalScore >= 7 ? '#92400e' : '#991b1b'}; border-color: ${data.totalScore >= 10 ? '#a7f3d0' : data.totalScore >= 7 ? '#fde68a' : '#fecaca'};">
                ${escapeHtml(data.potential)}
              </span>
            </div>
          </div>

          <h3 style="font-size: 10pt; font-weight: 800; text-transform: uppercase; color: #334155; margin: 0 0 8px 0;">Desglose de los 6 Criterios de Viralidad</h3>
          <table class="print-table" style="margin-bottom: 14px;">
            <thead>
              <tr>
                <th>Criterio Evaluado</th>
                <th style="width: 90px; text-align: center;">Ponderación</th>
                <th style="width: 130px; text-align: center;">Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Regla del Niño de 5 Años:</strong> Explicación sencilla, comprensible al instante por cualquiera.</td>
                <td style="text-align: center; font-weight: 600;">2.5 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.nino ? '#059669' : '#94a3b8'};">${data.criteria.nino ? '✅ CUMPLE (+2.5)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
              <tr>
                <td><strong>2. Regla del 50 de 100:</strong> De 100 personas en la calle, al menos a 50 les interesaría el tema.</td>
                <td style="text-align: center; font-weight: 600;">2.5 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.cincuenta ? '#059669' : '#94a3b8'};">${data.criteria.cincuenta ? '✅ CUMPLE (+2.5)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
              <tr>
                <td><strong>3. Referencia Viral Comprobada:</strong> Gancho o formato modelado de un video validado con >100k views.</td>
                <td style="text-align: center; font-weight: 600;">2.0 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.refViral ? '#059669' : '#94a3b8'};">${data.criteria.refViral ? '✅ CUMPLE (+2.0)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
              <tr>
                <td><strong>4. Mercado Altamente Viral:</strong> Temáticas masivas de alto consumo habitual (dinero, salud, relaciones, ahorro).</td>
                <td style="text-align: center; font-weight: 600;">0.5 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.mercadoViral ? '#059669' : '#94a3b8'};">${data.criteria.mercadoViral ? '✅ CUMPLE (+0.5)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
              <tr>
                <td><strong>5. Tendencia o Novedad:</strong> Utiliza una conversación activa, noticia del momento o coyuntura.</td>
                <td style="text-align: center; font-weight: 600;">1.5 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.tendencia ? '#059669' : '#94a3b8'};">${data.criteria.tendencia ? '✅ CUMPLE (+1.5)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
              <tr>
                <td><strong>6. Controversia o Debate:</strong> Estimula a la gente a comentar, disentir o defender posturas sanas.</td>
                <td style="text-align: center; font-weight: 600;">1.0 pts</td>
                <td style="text-align: center; font-weight: 700; color: ${data.criteria.controversia ? '#059669' : '#94a3b8'};">${data.criteria.controversia ? '✅ CUMPLE (+1.0)' : '❌ NO CUMPLE (0.0)'}</td>
              </tr>
            </tbody>
          </table>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="print-section-box" style="border-left-color: #8b5cf6;">
              <strong style="font-size: 8pt; text-transform: uppercase; color: #6d28d9; display: block; margin-bottom: 2px;">Formato Audiovisual</strong>
              <p style="font-size: 9.5pt; font-weight: bold; margin: 0; color: #0f172a;">${escapeHtml(data.format)}</p>
              <p style="font-size: 8pt; color: #64748b; margin: 2px 0 0 0;">Puntuación de formato: <strong>+${data.formatScore.toFixed(1)} / 4.5 pts</strong></p>
            </div>
            <div class="print-section-box" style="border-left-color: #10b981;">
              <strong style="font-size: 8pt; text-transform: uppercase; color: #047857; display: block; margin-bottom: 2px;">Subtotal Criterios Base</strong>
              <p style="font-size: 9.5pt; font-weight: bold; margin: 0; color: #0f172a;">${data.criteriaScore.toFixed(1)} / 10.0 Puntos</p>
              <p style="font-size: 8pt; color: #64748b; margin: 2px 0 0 0;">Total Final = <strong>${data.totalScore.toFixed(1)} / 14.5 pts</strong></p>
            </div>
          </div>

          <div class="print-section-box" style="border-left-color: ${data.totalScore >= 10 ? '#059669' : data.totalScore >= 7 ? '#d97706' : '#dc2626'}; background-color: #fafafa;">
            <strong style="font-size: 8.5pt; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 4px;">Dictamen Estratégico y Recomendación BLEX STUDIO:</strong>
            <p style="font-size: 9pt; margin: 0; color: #1e293b; line-height: 1.45;">
              ${data.totalScore >= 10 
                ? '🚀 <strong>ALTO POTENCIAL VIRAL:</strong> Esta idea cuenta con una estructura óptima de retención, simplicidad y atractivo masivo. Se recomienda proceder a guionizado y grabación con máxima prioridad.' 
                : data.totalScore >= 7 
                ? '⚡ <strong>POTENCIAL MEDIO:</strong> La idea es viable para comunidad. Para tráfico frío, se sugiere reforzar el gancho inicial de 0-3 segundos o subir a un formato de mayor inmersión (POV, Vlog o Dinámico).' 
                : '⚠️ <strong>POTENCIAL BAJO:</strong> Se recomienda pivotar el enfoque, simplificar el mensaje para que cualquiera lo comprenda al instante o buscar un caso de estudio más contundente antes de invertir tiempo de producción.'}
            </p>
          </div>
        </div>
      `;

    } else {
      // History Mode (Custom selection of selected evaluations)
      const evals = (state.viralEvaluations || []).filter(e => printSelectedIds.has(e.id));
      if (evals.length === 0) {
        alert('Por favor selecciona al menos una evaluación del historial para imprimir.');
        return null;
      }

      const countViral = evals.filter(e => (e.totalScore || 0) >= 10).length;
      const countMedio = evals.filter(e => (e.totalScore || 0) >= 7 && (e.totalScore || 0) < 10).length;
      const countBajo = evals.filter(e => (e.totalScore || 0) < 7).length;
      const avgScore = (evals.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / evals.length).toFixed(1);

      // If user selected only 1 evaluation from history, print detailed executive sheet for it!
      if (evals.length === 1) {
        const item = evals[0];
        const crit = item.criteria || {};

        bodyContent = `
          <div class="print-doc-header">
            <div>
              <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">BLEX STUDIO</h1>
              <p style="font-size: 11pt; font-weight: 700; color: #d97706; margin: 0;">🔥 FICHA EJECUTIVA DE EVALUACIÓN VIRAL</p>
            </div>
            <div style="text-align: right; font-size: 9pt; color: #64748b;">
              <p style="margin: 0;"><strong>Cliente:</strong> ${escapeHtml(item.client || 'General')}</p>
              <p style="margin: 2px 0 0 0;"><strong>Fecha de Evaluación:</strong> ${item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : dateStr}</p>
            </div>
          </div>

          <div class="print-card" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <span style="font-size: 8.5pt; font-weight: 800; text-transform: uppercase; color: #d97706; display: block; margin-bottom: 2px;">Idea Registrada en Historial</span>
                <h2 style="font-size: 14pt; font-weight: 800; color: #0f172a; margin: 0;">${escapeHtml(item.title || '(Sin título ingresado)')}</h2>
                ${item.link ? `<p style="font-size: 8.5pt; color: #0284c7; margin: 4px 0 0 0;">🔗 ${escapeHtml(item.link)}</p>` : ''}
              </div>
              <div style="text-align: right;">
                <div style="font-size: 26pt; font-weight: 900; font-family: monospace; color: ${(item.totalScore || 0) >= 10 ? '#059669' : (item.totalScore || 0) >= 7 ? '#d97706' : '#dc2626'};">${(item.totalScore || 0).toFixed(1)} <span style="font-size: 12pt; color: #64748b;">/ 14.5</span></div>
                <span class="print-badge" style="font-size: 8.5pt; background: ${(item.totalScore || 0) >= 10 ? '#ecfdf5' : (item.totalScore || 0) >= 7 ? '#fffbeb' : '#fef2f2'}; color: ${(item.totalScore || 0) >= 10 ? '#065f46' : (item.totalScore || 0) >= 7 ? '#92400e' : '#991b1b'}; border-color: ${(item.totalScore || 0) >= 10 ? '#a7f3d0' : (item.totalScore || 0) >= 7 ? '#fde68a' : '#fecaca'};">
                  ${escapeHtml(item.potential || 'Evaluado')}
                </span>
              </div>
            </div>

            <h3 style="font-size: 10pt; font-weight: 800; text-transform: uppercase; color: #334155; margin: 0 0 8px 0;">Desglose de los 6 Criterios de Viralidad</h3>
            <table class="print-table" style="margin-bottom: 14px;">
              <thead>
                <tr>
                  <th>Criterio Evaluado</th>
                  <th style="width: 90px; text-align: center;">Ponderación</th>
                  <th style="width: 130px; text-align: center;">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. Regla del Niño de 5 Años:</strong> Explicación sencilla, comprensible al instante por cualquiera.</td>
                  <td style="text-align: center; font-weight: 600;">2.5 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.nino ? '#059669' : '#94a3b8'};">${crit.nino ? '✅ CUMPLE (+2.5)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
                <tr>
                  <td><strong>2. Regla del 50 de 100:</strong> De 100 personas en la calle, al menos a 50 les interesaría el tema.</td>
                  <td style="text-align: center; font-weight: 600;">2.5 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.cincuenta ? '#059669' : '#94a3b8'};">${crit.cincuenta ? '✅ CUMPLE (+2.5)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
                <tr>
                  <td><strong>3. Referencia Viral Comprobada:</strong> Gancho o formato modelado de un video validado con >100k views.</td>
                  <td style="text-align: center; font-weight: 600;">2.0 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.refViral ? '#059669' : '#94a3b8'};">${crit.refViral ? '✅ CUMPLE (+2.0)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
                <tr>
                  <td><strong>4. Mercado Altamente Viral:</strong> Temáticas masivas de alto consumo habitual (dinero, salud, relaciones, ahorro).</td>
                  <td style="text-align: center; font-weight: 600;">0.5 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.mercadoViral ? '#059669' : '#94a3b8'};">${crit.mercadoViral ? '✅ CUMPLE (+0.5)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
                <tr>
                  <td><strong>5. Tendencia o Novedad:</strong> Utiliza una conversación activa, noticia del momento o coyuntura.</td>
                  <td style="text-align: center; font-weight: 600;">1.5 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.tendencia ? '#059669' : '#94a3b8'};">${crit.tendencia ? '✅ CUMPLE (+1.5)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
                <tr>
                  <td><strong>6. Controversia o Debate:</strong> Estimula a la gente a comentar, disentir o defender posturas sanas.</td>
                  <td style="text-align: center; font-weight: 600;">1.0 pts</td>
                  <td style="text-align: center; font-weight: 700; color: ${crit.controversia ? '#059669' : '#94a3b8'};">${crit.controversia ? '✅ CUMPLE (+1.0)' : '❌ NO CUMPLE (0.0)'}</td>
                </tr>
              </tbody>
            </table>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div class="print-section-box" style="border-left-color: #8b5cf6;">
                <strong style="font-size: 8pt; text-transform: uppercase; color: #6d28d9; display: block; margin-bottom: 2px;">Formato Audiovisual</strong>
                <p style="font-size: 9.5pt; font-weight: bold; margin: 0; color: #0f172a;">${escapeHtml(item.format || 'No especificado')}</p>
                <p style="font-size: 8pt; color: #64748b; margin: 2px 0 0 0;">Puntuación de formato: <strong>+${(item.formatScore || 0).toFixed(1)} / 4.5 pts</strong></p>
              </div>
              <div class="print-section-box" style="border-left-color: #10b981;">
                <strong style="font-size: 8pt; text-transform: uppercase; color: #047857; display: block; margin-bottom: 2px;">Subtotal Criterios Base</strong>
                <p style="font-size: 9.5pt; font-weight: bold; margin: 0; color: #0f172a;">${(item.criteriaScore || 0).toFixed(1)} / 10.0 Puntos</p>
                <p style="font-size: 8pt; color: #64748b; margin: 2px 0 0 0;">Total Final = <strong>${(item.totalScore || 0).toFixed(1)} / 14.5 pts</strong></p>
              </div>
            </div>

            <div class="print-section-box" style="border-left-color: ${(item.totalScore || 0) >= 10 ? '#059669' : (item.totalScore || 0) >= 7 ? '#d97706' : '#dc2626'}; background-color: #fafafa;">
              <strong style="font-size: 8.5pt; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 4px;">Dictamen Estratégico BLEX STUDIO:</strong>
              <p style="font-size: 9pt; margin: 0; color: #1e293b; line-height: 1.45;">
                ${(item.totalScore || 0) >= 10 
                  ? '🚀 <strong>ALTO POTENCIAL VIRAL:</strong> Esta idea cuenta con una estructura óptima de retención, simplicidad y atractivo masivo. Se recomienda proceder a guionizado y grabación con máxima prioridad.' 
                  : (item.totalScore || 0) >= 7 
                  ? '⚡ <strong>POTENCIAL MEDIO:</strong> La idea es viable para comunidad. Para tráfico frío, se sugiere reforzar el gancho inicial de 0-3 segundos o subir a un formato de mayor inmersión.' 
                  : '⚠️ <strong>POTENCIAL BAJO:</strong> Se recomienda pivotar el enfoque o buscar un caso de estudio más contundente antes de invertir tiempo de producción.'}
              </p>
            </div>
          </div>
        `;
      } else {
        // Multiple selected evaluations from history: render Comparative Report & KPI table
        bodyContent = `
          <div class="print-doc-header">
            <div>
              <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">BLEX STUDIO</h1>
              <p style="font-size: 11pt; font-weight: 700; color: #d97706; margin: 0;">🔥 REPORTE DE HISTORIAL & RANKING DE VIRALIDAD</p>
            </div>
            <div style="text-align: right; font-size: 9pt; color: #64748b;">
              <p style="margin: 0;"><strong>Total Evaluaciones Seleccionadas:</strong> ${evals.length}</p>
              <p style="margin: 2px 0 0 0;"><strong>Fecha de Reporte:</strong> ${dateStr}</p>
            </div>
          </div>

          <!-- KPI SUMMARY BAR -->
          <div class="print-kpi-grid" style="grid-template-columns: repeat(4, 1fr) !important; margin-bottom: 16px;">
            <div class="print-kpi-card" style="border-color: #0f172a; background: #0f172a; color: #ffffff;">
              <div class="print-kpi-value" style="color: #f59e0b;">${evals.length}</div>
              <div class="print-kpi-label" style="color: #e2e8f0;">Total Seleccionadas</div>
            </div>
            <div class="print-kpi-card" style="border-color: #fef08a; background: #fef9c3;">
              <div class="print-kpi-value" style="color: #b45309;">${avgScore} / 14.5</div>
              <div class="print-kpi-label" style="color: #b45309;">Promedio General</div>
            </div>
            <div class="print-kpi-card" style="border-color: #bbf7d0; background: #f0fdf4;">
              <div class="print-kpi-value" style="color: #166534;">${countViral}</div>
              <div class="print-kpi-label" style="color: #166534;">🚀 Muy Alto / Viral</div>
            </div>
            <div class="print-kpi-card" style="border-color: #fed7aa; background: #fff7ed;">
              <div class="print-kpi-value" style="color: #9a3412;">${countMedio} (Medio) / ${countBajo} (Bajo)</div>
              <div class="print-kpi-label" style="color: #9a3412;">⚡ Potencial Medio / Bajo</div>
            </div>
          </div>

          <table class="print-table">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">#</th>
                <th style="width: 75px;">Fecha</th>
                <th style="width: 75px;">Cliente</th>
                <th>Idea Evaluada & Enlace</th>
                <th style="width: 110px;">Formato</th>
                <th style="width: 85px; text-align: center;">Puntaje</th>
                <th style="width: 110px; text-align: center;">Potencial</th>
              </tr>
            </thead>
            <tbody>
              ${evals.map((e, idx) => `
                <tr class="print-avoid-break">
                  <td style="text-align: center; font-weight: bold; font-family: monospace; color: #64748b;">#${idx + 1}</td>
                  <td style="font-size: 8.5pt; color: #64748b;">${e.createdAt ? new Date(e.createdAt).toLocaleDateString('es-ES') : '-'}</td>
                  <td style="font-weight: bold;">${escapeHtml(e.client || 'General')}</td>
                  <td style="font-weight: 600; color: #0f172a;">
                    ${escapeHtml(e.title || 'Sin título')}
                    ${e.link ? `<div style="font-size: 7.5pt; color: #0284c7; font-weight: normal;">🔗 ${escapeHtml(e.link)}</div>` : ''}
                  </td>
                  <td style="font-size: 8.5pt;">${escapeHtml(e.format || '-')}</td>
                  <td style="text-align: center; font-weight: bold; font-family: monospace; font-size: 10pt; color: ${(e.totalScore || 0) >= 10 ? '#059669' : (e.totalScore || 0) >= 7 ? '#d97706' : '#dc2626'};">
                    ${(e.totalScore || 0).toFixed(1)} / 14.5
                  </td>
                  <td style="text-align: center;">
                    <span class="print-badge" style="font-size: 8pt; background: ${(e.totalScore || 0) >= 10 ? '#ecfdf5' : (e.totalScore || 0) >= 7 ? '#fffbeb' : '#fef2f2'}; color: ${(e.totalScore || 0) >= 10 ? '#065f46' : (e.totalScore || 0) >= 7 ? '#92400e' : '#991b1b'}; border-color: ${(e.totalScore || 0) >= 10 ? '#a7f3d0' : (e.totalScore || 0) >= 7 ? '#fde68a' : '#fecaca'};">
                      ${escapeHtml(e.potential || 'Evaluado')}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    }

  } else if (currentPrintModule === 'ideas') {
    const allIdeas = getAllIdeasForPrint().filter(i => printSelectedIds.has(i.id));
    if (allIdeas.length === 0) {
      alert('Por favor selecciona al menos una idea o nota para imprimir.');
      return null;
    }

    const countScriptIdeas = allIdeas.filter(i => i.type === 'Idea de Guión').length;
    const countNotes = allIdeas.filter(i => i.type.includes('Nota')).length;
    
    // Group count by client
    const clientCounts = {};
    allIdeas.forEach(i => {
      clientCounts[i.client] = (clientCounts[i.client] || 0) + 1;
    });

    bodyContent = `
      <div class="print-doc-header">
        <div>
          <h1 style="font-size: 22pt; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">BLEX STUDIO</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #ca8a04; margin: 0;">💡 BANCO DE IDEAS & NOTAS ESTRATÉGICAS</p>
        </div>
        <div style="text-align: right; font-size: 9pt; color: #64748b;">
          <p style="margin: 0;"><strong>Total Ideas / Notas:</strong> ${allIdeas.length}</p>
          <p style="margin: 2px 0 0 0;"><strong>Fecha:</strong> ${dateStr}</p>
        </div>
      </div>

      <!-- KPI METRICS SUMMARY -->
      <div class="print-kpi-grid" style="grid-template-columns: repeat(4, 1fr) !important; margin-bottom: 16px;">
        <div class="print-kpi-card" style="border-color: #0f172a; background: #0f172a; color: #ffffff;">
          <div class="print-kpi-value" style="color: #eab308;">${allIdeas.length}</div>
          <div class="print-kpi-label" style="color: #e2e8f0;">Total Ideas & Notas</div>
        </div>
        <div class="print-kpi-card" style="border-color: #fef08a; background: #fef9c3;">
          <div class="print-kpi-value" style="color: #854d0e;">${countScriptIdeas}</div>
          <div class="print-kpi-label" style="color: #854d0e;">💡 Ideas de Guiones</div>
        </div>
        <div class="print-kpi-card" style="border-color: #bae6fd; background: #f0f9ff;">
          <div class="print-kpi-value" style="color: #0369a1;">${countNotes}</div>
          <div class="print-kpi-label" style="color: #0369a1;">📝 Notas Estratégicas</div>
        </div>
        <div class="print-kpi-card" style="border-color: #e2e8f0; background: #f8fafc;">
          <div class="print-kpi-value" style="color: #334155;">${Object.keys(clientCounts).length}</div>
          <div class="print-kpi-label" style="color: #475569;">👥 Clientes con Ideas</div>
        </div>
      </div>

      <!-- DESGLOSE DETALLADO DE TODAS LAS IDEAS -->
      <div style="margin-top: 16px;">
        <h2 style="font-size: 12pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 14px 0;">
          📋 Listado y Detalle de Ideas Seleccionadas (${allIdeas.length})
        </h2>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${allIdeas.map((item, idx) => `
            <div class="print-card print-avoid-break" style="margin-bottom: 12px; padding: 12px 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 9pt; font-weight: bold; font-family: monospace; color: #64748b;">#${idx + 1}</span>
                  <span class="print-badge" style="background: ${item.type === 'Idea de Guión' ? '#fef9c3' : '#e0f2fe'}; color: ${item.type === 'Idea de Guión' ? '#854d0e' : '#0369a1'}; border-color: ${item.type === 'Idea de Guión' ? '#fef08a' : '#bae6fd'};">
                    ${escapeHtml(item.type)}
                  </span>
                  <span style="font-size: 11pt; font-weight: 700; color: #0f172a;">${escapeHtml(item.title)}</span>
                </div>
                <span class="print-badge" style="font-weight: 800;">${escapeHtml(item.client)}</span>
              </div>
              <div class="print-section-box" style="border-left-color: ${item.type === 'Idea de Guión' ? '#eab308' : '#0284c7'}; white-space: pre-line; font-size: 9.5pt; color: #334155; line-height: 1.5; margin-top: 6px;">
                ${escapeHtml(item.content)}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 8pt; color: #64748b; margin-top: 6px;">
                <span>📅 Registrado: ${item.date ? new Date(item.date).toLocaleDateString('es-ES') : '-'}</span>
                <span>BLEX STUDIO</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const topBarHtml = forNewTab ? `
    <div class="no-print-bar">
      <div style="display: flex; align-items: center; gap: 10px;">
        <strong style="font-size: 14px; letter-spacing: 0.5px;">BLEX STUDIO • Vista Previa de Impresión</strong>
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()" style="background: #16a34a; color: #fff; font-weight: bold; padding: 6px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
          🖨️ Imprimir / Guardar PDF
        </button>
        <button onclick="window.close()" style="background: #334155; color: #fff; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
          Cerrar Pestaña
        </button>
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>BLEX STUDIO - Impresión</title>
  <style>
    ${getStandalonePrintStyles()}
  </style>
</head>
<body>
  ${topBarHtml}
  <div class="print-doc-container">
    ${bodyContent}
  </div>
</body>
</html>`;
}

function executeEnhancedPrint(openInNewTab = false) {
  const fullHtml = generateCompletePrintDocument(openInNewTab);
  if (!fullHtml) return;

  closePrintModal();

  if (openInNewTab) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch(e) {}
      }, 300);
    } else {
      alert('Por favor habilita las ventanas emergentes en tu navegador para abrir la pestaña de impresión.');
    }
    return;
  }

  // Pure Isolated Iframe Printing (Guarantees zero blank pages across all devices)
  let printIframe = document.getElementById('blexPrintIframe');
  if (printIframe) {
    printIframe.remove();
  }

  printIframe = document.createElement('iframe');
  printIframe.id = 'blexPrintIframe';
  printIframe.style.position = 'fixed';
  printIframe.style.top = '-9999px';
  printIframe.style.left = '-9999px';
  printIframe.style.width = '1024px';
  printIframe.style.height = '768px';
  printIframe.style.border = 'none';
  printIframe.style.zIndex = '-9999';
  document.body.appendChild(printIframe);

  const iframeDoc = printIframe.contentDocument || printIframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullHtml);
  iframeDoc.close();

  setTimeout(() => {
    try {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
    } catch (err) {
      console.warn('Iframe print fallback to window.open:', err);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 200);
      }
    }
  }, 250);
}

function printSingleScript(scriptId) {
  currentPrintModule = 'cards';
  printSelectedIds = new Set([scriptId]);
  executeEnhancedPrint(false);
}

function printViralGuide() {
  currentPrintModule = 'viral';
  printViralMode = 'guide';
  executeEnhancedPrint(false);
}

function printCurrentViralEvaluation() {
  currentPrintModule = 'viral';
  printViralMode = 'current';
  executeEnhancedPrint(false);
}

function printViralHistory() {
  currentPrintModule = 'viral';
  printViralMode = 'history';
  printSelectedIds = new Set((state.viralEvaluations || []).map(e => e.id));
  executeEnhancedPrint(false);
}

function printSingleViralEvaluation(evalId) {
  const evals = state.viralEvaluations || [];
  const item = evals.find(e => e.id === evalId);
  if (!item) return;
  currentPrintModule = 'viral';
  printViralMode = 'history';
  printSelectedIds = new Set([evalId]);
  executeEnhancedPrint(false);
}

function printIdeasAndNotes() {
  currentPrintModule = 'ideas';
  printSelectedIds = new Set(getAllIdeasForPrint().map(i => i.id));
  executeEnhancedPrint(false);
}

window.printViralGuide = printViralGuide;
window.printCurrentViralEvaluation = printCurrentViralEvaluation;
window.printViralHistory = printViralHistory;
window.printSingleViralEvaluation = printSingleViralEvaluation;
window.printIdeasAndNotes = printIdeasAndNotes;
window.printSingleScript = printSingleScript;

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

function updateIdeasHeaderBadge() {
  const badgeNav = document.getElementById('ideasCountBadge');
  const badgeMaster = document.getElementById('masterIdeasBadge');

  let totalIdeas = 0;
  if (state.scripts && Array.isArray(state.scripts)) {
    totalIdeas = state.scripts.filter(s => s.status === 'Idea').length;
  }

  if (badgeNav) badgeNav.textContent = totalIdeas;
  if (badgeMaster) badgeMaster.textContent = totalIdeas;
}

function updateNotesHeaderBadge() {
  const badgeNav = document.getElementById('notesCountBadge');
  const badgeModal = document.getElementById('notesModalHeaderBadge');
  const badgeMaster = document.getElementById('masterNotesBadge');

  let totalNotes = 0;
  if (state.notes && typeof state.notes === 'object') {
    Object.values(state.notes).forEach(list => {
      if (Array.isArray(list)) totalNotes += list.length;
    });
  }

  if (badgeNav) {
    badgeNav.textContent = totalNotes;
  }
  if (badgeMaster) {
    badgeMaster.textContent = totalNotes;
  }
  if (badgeModal) {
    badgeModal.textContent = `${totalNotes} nota${totalNotes === 1 ? '' : 's'}`;
  }
}

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

  updateNotesHeaderBadge();
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

// (escapeHtml defined above)

function renderNotesForActiveClient() {
  const body = document.getElementById('notesModalBody');
  if (!body) return;

  const client = state.activeNotesClient;
  if (!client) return;

  if (!state.notes[client]) {
    state.notes[client] = [];
  }

  const notesList = state.notes[client];
  updateNotesHeaderBadge();

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
              id="noteTitle-${note.id}"
              type="text" 
              value="${escapeHtml(note.title || '')}" 
              placeholder="Título de la nota..." 
              oninput="updateNoteTitle('${note.id}', this.value)"
              class="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-3 py-1.5 text-sm font-bold text-white placeholder-slate-500 outline-none transition"
            >
          </div>
          <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
            ${formattedDate ? `<span class="text-[11px] text-slate-500 hidden sm:inline mr-1">🕒 ${formattedDate}</span>` : ''}
            <button onclick="saveNoteExplicit('${note.id}', this)" title="Guardar nota" class="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer">
              <i data-lucide="save" class="w-3.5 h-3.5"></i>
              <span>Guardar</span>
            </button>
            <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 text-xs shadow-sm" title="Adjuntar foto o archivo a esta nota">
              <i data-lucide="paperclip" class="w-3.5 h-3.5"></i>
              <span class="hidden md:inline">Adjuntar</span>
              <input type="file" multiple accept="image/*,application/pdf,.doc,.docx,.txt,.csv" class="hidden" onchange="handleNoteFileSelect(event, '${note.id}')">
            </label>
            <button onclick="copyNoteContent('${note.id}', this)" title="Copiar texto de la nota" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 text-xs cursor-pointer">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span class="hidden md:inline">Copiar</span>
            </button>
            <button onclick="deleteNote('${note.id}')" title="Eliminar nota" class="bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 font-semibold p-1.5 rounded-lg border border-slate-700 hover:border-rose-800/50 transition cursor-pointer">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        <div>
          <textarea 
            id="noteContent-${note.id}"
            rows="4" 
            placeholder="Escribe aquí las notas, ideas o apuntes para ${client}..." 
            oninput="updateNoteContent('${note.id}', this.value)"
            class="w-full bg-slate-950/70 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition font-sans leading-relaxed resize-y"
          >${escapeHtml(note.content || '')}</textarea>
        </div>

        <!-- Note Attachments List -->
        ${(note.attachments && note.attachments.length > 0) ? `
          <div class="pt-2 border-t border-slate-800/60">
            <p class="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <i data-lucide="paperclip" class="w-3.5 h-3.5 text-sky-400"></i>
              <span>Archivos y Fotos Adjuntas (${note.attachments.length})</span>
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              ${note.attachments.map(att => {
                const isImg = (att.type && att.type.startsWith('image/')) || (att.dataUrl && att.dataUrl.startsWith('data:image/'));
                const isPdf = (att.type === 'application/pdf') || /.pdf$/i.test(att.name || '');
                return `
                  <div class="relative bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl p-2 group transition flex flex-col justify-between">
                    <div class="cursor-pointer" onclick="previewNoteAttachment('${note.id}', '${att.id}')">
                      ${isImg ? `
                        <div class="w-full h-24 rounded-lg overflow-hidden bg-slate-900 mb-1.5 border border-slate-800">
                          <img src="${att.dataUrl}" alt="${att.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                        </div>
                      ` : `
                        <div class="w-full h-24 rounded-lg ${isPdf ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-900 text-sky-400'} flex flex-col items-center justify-center gap-1 mb-1.5 border border-slate-800">
                          <i data-lucide="${isPdf ? 'file-text' : 'paperclip'}" class="w-6 h-6"></i>
                          <span class="text-[10px] font-bold uppercase">${isPdf ? 'PDF' : 'Archivo'}</span>
                        </div>
                      `}
                      <p class="text-xs font-bold text-white truncate" title="${att.name}">${att.name}</p>
                      <p class="text-[10px] text-slate-400">${formatFileSize(att.size)}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80">
                      <button onclick="previewNoteAttachment('${note.id}', '${att.id}')" class="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
                        <i data-lucide="eye" class="w-3 h-3"></i> Ver
                      </button>
                      <button onclick="deleteNoteAttachment('${note.id}', '${att.id}')" class="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1" title="Eliminar adjunto">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
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
  updateNotesHeaderBadge();
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

function saveNoteExplicit(noteId, btnElement) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  const note = state.notes[client].find(n => n.id === noteId);
  if (!note) return;

  const titleInput = document.getElementById(`noteTitle-${noteId}`);
  const contentInput = document.getElementById(`noteContent-${noteId}`);

  if (titleInput) note.title = titleInput.value.trim() || 'Nota sin título';
  if (contentInput) note.content = contentInput.value;

  note.updatedAt = new Date().toISOString();
  saveState();
  updateNotesHeaderBadge();
  renderNotesClientTabs();

  if (btnElement) {
    const originalHTML = btnElement.innerHTML;
    btnElement.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> ¡Guardada!`;
    btnElement.classList.add('bg-emerald-500');
    refreshLucideIcons();
    setTimeout(() => {
      btnElement.innerHTML = originalHTML;
      btnElement.classList.remove('bg-emerald-500');
      refreshLucideIcons();
    }, 1800);
  }
}

function deleteNote(noteId) {
  const client = state.activeNotesClient;
  if (!state.notes[client]) return;

  if (confirm('¿Deseas eliminar esta nota?')) {
    state.notes[client] = state.notes[client].filter(n => n.id !== noteId);
    saveState();
    updateNotesHeaderBadge();
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

let currentViralDateFilter = 'ALL';

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

  const dateFilter = document.getElementById('viralDateFilter');
  if (dateFilter) {
    dateFilter.addEventListener('change', (e) => {
      currentViralDateFilter = e.target.value;
      renderViralHistoryTable();
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

  // Live title typing
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

  // Format bonus calculation (Max 4.5 pts)
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
      verdictContainer.className = "p-3 rounded-xl border transition space-y-1.5 bg-emerald-950/30 border-emerald-500/40";
      verdictIcon.className = "w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-emerald-500/20 text-emerald-400";
      verdictIcon.innerHTML = "✓";
      verdictTitle.className = "text-xs sm:text-sm font-bold text-emerald-300";
      verdictTitle.textContent = "🟢 Potencial Muy Alto / Viral (10.0 - 14.5 pts)";
      verdictDesc.textContent = "¡Candidato óptimo a escalar y volverse viral! Cumple con atracción masiva, alta retención e inmersión psicológica.";
    } else if (data.totalScore >= 7.0) {
      verdictContainer.className = "p-3 rounded-xl border transition space-y-1.5 bg-amber-950/30 border-amber-500/40";
      verdictIcon.className = "w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-amber-500/20 text-amber-400";
      verdictIcon.innerHTML = "★";
      verdictTitle.className = "text-xs sm:text-sm font-bold text-amber-300";
      verdictTitle.textContent = "🟡 Potencial Medio (7.0 - 9.5 pts)";
      verdictDesc.textContent = "Buen contenido para comunidad o nicho específico. Para tráfico frío, prueba subir la inmersión de formato.";
    } else {
      verdictContainer.className = "p-3 rounded-xl border transition space-y-1.5 bg-rose-950/30 border-rose-500/40";
      verdictIcon.className = "w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-rose-500/20 text-rose-400";
      verdictIcon.innerHTML = "!";
      verdictTitle.className = "text-xs sm:text-sm font-bold text-rose-300";
      verdictTitle.textContent = "🔴 Potencial Bajo (0.0 - 6.5 pts)";
      verdictDesc.textContent = "Poco alcance orgánico predecible. Recomendamos simplificar la idea para que cualquiera la entienda y usar formatos POV o Vlog.";
    }
  }

  // Generate dynamic optimization tips
  if (tipsContainer) {
    const tips = [];
    if (!data.criteria.nino) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold text-[11px]">💡 +2.5 pts:</span> <span class="text-[11px]">Haz que un <strong>niño de 5 años</strong> la comprenda sin tecnicismos.</span></div>`);
    }
    if (!data.criteria.cincuenta) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold text-[11px]">💡 +2.5 pts:</span> <span class="text-[11px]">Amplía el tema para que le interese a <strong>50 de 100 personas</strong>.</span></div>`);
    }
    if (!data.criteria.refViral) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold text-[11px]">💡 +2.0 pts:</span> <span class="text-[11px]">Valida con una <strong>referencia viral previa</strong> que haya superado 1M de views.</span></div>`);
    }
    if (data.formatScore < 3.5) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-emerald-400 font-bold text-[11px]">📹 +3.5 a +4.5:</span> <span class="text-[11px]">Usa formatos de <strong>Inmersión Total</strong> (POV, Vlog o Dinámico).</span></div>`);
    }
    if (!data.criteria.tendencia) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold text-[11px]">💡 +1.5 pts:</span> <span class="text-[11px]">Conecta con una <strong>tendencia actual</strong> o fecha coyuntural.</span></div>`);
    }
    if (!data.criteria.controversia) {
      tips.push(`<div class="flex items-start gap-2"><span class="text-amber-400 font-bold text-[11px]">💡 +1.0 pts:</span> <span class="text-[11px]">Añade una pregunta polarizante para generar <strong>debate</strong>.</span></div>`);
    }

    if (tips.length === 0) {
      tipsContainer.innerHTML = `<p class="text-emerald-400 font-semibold text-xs">🔥 ¡Puntuación perfecta de 14.5/14.5 pts! Esta idea tiene todos los componentes de un video viral masivo.</p>`;
    } else {
      tipsContainer.innerHTML = tips.slice(0, 3).join('');
    }
  }
}

function resetViralCalculator() {
  if (document.getElementById('viralIdeaTitle')) document.getElementById('viralIdeaTitle').value = '';
  if (document.getElementById('viralIdeaLink')) document.getElementById('viralIdeaLink').value = '';

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
  
  // Auto-switch to history tab so user sees newly added entry ranked for today
  switchViralTab('hist');

  // Button feedback
  const btnSave = document.getElementById('btnSaveViralEvaluation');
  if (btnSave) {
    const originalHTML = btnSave.innerHTML;
    btnSave.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> ¡Guardada y Rankeada!`;
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

  const activeEvalClass = "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition bg-amber-500 text-slate-950 shadow-sm cursor-pointer";
  const activeHistClass = "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition bg-sky-500 text-white shadow-sm cursor-pointer";
  const inactiveClass = "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-white cursor-pointer";

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

function getViralDateKey(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

function getFriendlyDateLabel(dateKey) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3) return dateKey;
  const [y, m, d] = parts;
  const dateObj = new Date(y, m - 1, d);

  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('es-ES', options);
  const capDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  if (dateKey === todayKey) {
    return `Hoy — ${capDate}`;
  } else if (dateKey === yesterdayKey) {
    return `Ayer — ${capDate}`;
  }
  return capDate;
}

function renderViralHistoryTable() {
  const historyContainer = document.getElementById('viralHistoryContainer');
  const counter = document.getElementById('viralHistoryCounter');
  const badge = document.getElementById('viralHistoryCountBadge');
  const tabBadge = document.getElementById('viralHistTabBadge');
  const dateFilterSelect = document.getElementById('viralDateFilter');
  if (!historyContainer) return;

  const evals = state.viralEvaluations || [];

  if (tabBadge) {
    tabBadge.textContent = evals.length;
  }

  if (badge) {
    badge.textContent = `${evals.length} idea${evals.length === 1 ? '' : 's'}`;
  }

  if (counter) {
    counter.textContent = `${evals.length} idea${evals.length === 1 ? '' : 's'} evaluada(s) en total (agrupadas y rankeadas por día)`;
  }

  if (evals.length === 0) {
    if (dateFilterSelect) {
      dateFilterSelect.innerHTML = `<option value="ALL">📅 Todas las fechas (0)</option>`;
    }
    historyContainer.innerHTML = `
      <div class="py-12 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6">
        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
          <i data-lucide="flame" class="w-6 h-6"></i>
        </div>
        <h4 class="text-sm font-bold text-slate-300">No hay ideas evaluadas en el historial</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">Evalúa tus ideas en la pestaña "1. Evaluar Idea" y guárdalas para que se agrupen y rankeen automáticamente por día.</p>
        <button type="button" onclick="switchViralTab('eval')" class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md cursor-pointer">
          <i data-lucide="plus" class="w-4 h-4"></i> Evaluar Primera Idea
        </button>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  // Group items by dateKey
  const groups = {};
  evals.forEach(item => {
    const dateKey = getViralDateKey(item.createdAt);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(item);
  });

  // Sort dates descending
  const dateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  // Sort ideas within each day descending by totalScore
  dateKeys.forEach(key => {
    groups[key].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  });

  // Populate date filter dropdown
  if (dateFilterSelect) {
    const selectedVal = dateFilterSelect.value || currentViralDateFilter || 'ALL';
    let optionsHtml = `<option value="ALL" ${selectedVal === 'ALL' ? 'selected' : ''}>📅 Todas las fechas (${evals.length} ideas)</option>`;
    dateKeys.forEach(key => {
      const label = getFriendlyDateLabel(key);
      const topScore = groups[key][0]?.totalScore?.toFixed(1) || '0.0';
      optionsHtml += `<option value="${key}" ${selectedVal === key ? 'selected' : ''}>📅 ${label} (${groups[key].length} ideas · Top: ${topScore} pts)</option>`;
    });
    dateFilterSelect.innerHTML = optionsHtml;
  }

  const activeFilter = dateFilterSelect ? dateFilterSelect.value : currentViralDateFilter;
  const keysToRender = (activeFilter === 'ALL') ? dateKeys : dateKeys.filter(k => k === activeFilter);

  if (keysToRender.length === 0) {
    historyContainer.innerHTML = `
      <div class="py-8 text-center text-slate-500 text-xs">
        No hay ideas registradas para la fecha seleccionada.
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  // Render day cards with leaderboard tables
  historyContainer.innerHTML = keysToRender.map(dateKey => {
    const dayItems = groups[dateKey];
    const dayTitle = getFriendlyDateLabel(dateKey);
    const bestItem = dayItems[0];
    const topScore = bestItem ? (bestItem.totalScore || 0).toFixed(1) : '0.0';
    const topTitle = bestItem ? bestItem.title : '';

    return `
      <div class="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg">
        <!-- Day Leaderboard Header -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
          <div class="flex items-center gap-2.5">
            <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <i data-lucide="calendar" class="w-4 h-4"></i>
            </span>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                <span>${dayTitle}</span>
                <span class="text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded-full">
                  ${dayItems.length} idea${dayItems.length === 1 ? '' : 's'}
                </span>
              </h4>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5" title="Mejor idea de este día: ${escapeHtml(topTitle)}">
              <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>🏆 Top del Día: <strong>${topScore} / 14.5 pts</strong></span>
            </span>
          </div>
        </div>

        <!-- Table for this Day -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr class="bg-slate-900/80 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th class="py-2.5 px-3 text-center w-14">Rank</th>
                <th class="py-2.5 px-3">Puntaje</th>
                <th class="py-2.5 px-4">Idea / Título Evaluado</th>
                <th class="py-2.5 px-3">Cliente</th>
                <th class="py-2.5 px-3">Formato</th>
                <th class="py-2.5 px-3">Criterios</th>
                <th class="py-2.5 px-3">Potencial</th>
                <th class="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50 text-slate-300">
              ${renderDayRows(dayItems)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  refreshLucideIcons();
}

function renderDayRows(items) {
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
    // legacy
    'pov': '👀 POV (+4.5)',
    'vlog': '📹 Vlog (+4.0)',
    'dinamico': '⚡ Dinámico (+3.5)',
    'entrevista': '🎙️ Entrevista (+3.0)',
    'talking_head': '🗣️ Hablando a cámara (+1.0)'
  };

  return items.map((item, index) => {
    let rankBadge = `<span class="text-xs font-bold text-slate-400">#${index + 1}</span>`;
    if (index === 0) {
      rankBadge = `<span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40 shadow-sm" title="1º Lugar del día">🥇 1º</span>`;
    } else if (index === 1) {
      rankBadge = `<span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-slate-400/20 text-slate-200 font-bold text-xs border border-slate-400/30" title="2º Lugar del día">🥈 2º</span>`;
    } else if (index === 2) {
      rankBadge = `<span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-amber-700/20 text-amber-500 font-bold text-xs border border-amber-700/30" title="3º Lugar del día">🥉 3º</span>`;
    }

    let potentialBadgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (item.totalScore >= 10.0) {
      potentialBadgeClass = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold";
    } else if (item.totalScore >= 7.0) {
      potentialBadgeClass = "bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold";
    }

    const criteriaTags = [];
    if (item.criteria?.nino) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Niño de 5 años">👶 Niño</span>');
    if (item.criteria?.cincuenta) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="50 de 100">👥 50/100</span>');
    if (item.criteria?.refViral) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Referencia viral">🚀 Ref</span>');
    if (item.criteria?.mercadoViral) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Mercado viral">🌐 Mercado</span>');
    if (item.criteria?.tendencia) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Tendencia">📈 Trend</span>');
    if (item.criteria?.controversia) criteriaTags.push('<span class="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]" title="Controversia">🔥 Debate</span>');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-2.5 px-3 text-center whitespace-nowrap">${rankBadge}</td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <span class="text-xs sm:text-sm font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            ${(item.totalScore || 0).toFixed(1)} <span class="text-[10px] text-slate-400 font-normal">/14.5</span>
          </span>
        </td>
        <td class="py-2.5 px-4 font-semibold text-white max-w-xs">
          <div class="truncate text-xs sm:text-sm" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mt-0.5"><i data-lucide="external-link" class="w-3 h-3"></i> Referencia</a>` : ''}
        </td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <span class="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">${item.client || 'General'}</span>
        </td>
        <td class="py-2.5 px-3 whitespace-nowrap text-xs text-slate-300 font-medium">
          ${formatLabels[item.format] || item.format}
        </td>
        <td class="py-2.5 px-3">
          <div class="flex flex-wrap gap-1 max-w-xs">
            ${criteriaTags.length > 0 ? criteriaTags.join('') : '<span class="text-slate-600 text-[10px]">Ninguno</span>'}
          </div>
        </td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <span class="text-[11px] px-2 py-0.5 rounded-full border ${potentialBadgeClass}">
            ${item.potential}
          </span>
        </td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1">
            <button onclick="sendViralEvalIdToAiStudio('${item.id}')" title="Crear Guión con IA (14.5 pts)" class="p-1.5 text-purple-400 hover:text-white hover:bg-purple-600/30 rounded-lg transition cursor-pointer">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
            </button>
            <button onclick="convertViralEvalToScriptById('${item.id}')" title="Convertir a Guión" class="p-1.5 text-brand-400 hover:text-white hover:bg-brand-600/30 rounded-lg transition cursor-pointer">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
            </button>
            <button onclick="loadViralEvaluationIntoCalc('${item.id}')" title="Cargar en Calculadora" class="p-1.5 text-amber-400 hover:text-white hover:bg-amber-600/30 rounded-lg transition cursor-pointer">
              <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
            <button onclick="printSingleViralEvaluation('${item.id}')" title="Imprimir esta evaluación" class="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition cursor-pointer">
              <i data-lucide="printer" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteViralEvaluation('${item.id}')" title="Eliminar evaluación" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
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

  const headers = ["Fecha", "Ranking_Diario", "Titulo", "Cliente", "Puntaje_Total", "Potencial", "Formato", "Puntos_Formato", "Nino_5_Anos", "50_de_100", "Ref_Viral", "Mercado_Viral", "Tendencia", "Controversia"];
  
  // Group by date to compute daily ranking
  const groups = {};
  evals.forEach(item => {
    const dateKey = getViralDateKey(item.createdAt);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(item);
  });

  const dateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  const rows = [];

  dateKeys.forEach(dateKey => {
    groups[dateKey].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    groups[dateKey].forEach((item, idx) => {
      rows.push([
        `"${dateKey}"`,
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
        item.criteria?.controversia ? 'SI (+1.0)' : 'NO (0)'
      ]);
    });
  });

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

// ==========================================
// TELEPROMPTER PRO (IPAD ENGINE) LOGIC - DUAL MODE
// ==========================================

const TP_SAMPLE_SCRIPTS = {
  presentation: `¡Hola a todos! Bienvenidos a esta presentación especial.\n\nHoy vamos a explorar una manera increíblemente fácil y fluida de utilizar un teleprompter profesional directamente desde cualquier iPad o navegador web.\n\nCon este sistema, puedes ajustar la velocidad de desplazamiento exacta que necesitas para tu ritmo de habla, cambiar el tamaño del texto para leer a mayor distancia y tener el resaltado activo palabra por palabra en tiempo real.\n\n¡Es hora de comenzar tus grabaciones con total confianza y fluidez!`,
  youtube: `¡Qué tal amigos! Bienvenidos de nuevo al canal.\n\nEn el video de hoy vamos a analizar un tema súper interesante que me han estado pidiendo mucho en los comentarios.\n\nRecuerda darle me gusta a este video, suscribirte al canal si aún no lo has hecho, y activar la campanita de notificaciones.\n\n¡Comencemos!`
};

const TP_DEFAULT_LIBRE_SLOTS = {
  1: { title: 'Presentación', text: TP_SAMPLE_SCRIPTS.presentation },
  2: { title: 'YouTube Video', text: TP_SAMPLE_SCRIPTS.youtube },
  3: { title: 'Guión 3', text: '' },
  4: { title: 'Guión 4', text: '' },
  5: { title: 'Guión 5', text: '' },
  6: { title: 'Guión 6', text: '' },
  7: { title: 'Guión 7', text: '' },
  8: { title: 'Guión 8', text: '' },
  9: { title: 'Guión 9', text: '' },
  10: { title: 'Guión 10', text: '' }
};

const TP_DEFAULT_REEL_SLOTS = {
  1: {
    title: 'Presupuesto Miami',
    gancho: '¿Cuánto gastas al mes viviendo en Miami?',
    historia: 'El latino promedio gasta más de 4,000 dólares al mes entre renta, comida, seguro y gasolina.\n\n¿Y sabes cuál es el peor error? Pagarlo todo con tarjeta de débito sin acumular beneficios.',
    moraleja: 'Si utilizas una tarjeta con cashback o puntos y pagas el balance completo cada mes, recuperas dinero y elevas tu puntaje crediticio.',
    cta: 'Escribe la palabra CREDITO en los comentarios y te envío una guía gratuita para optimizar tu score.'
  },
  2: {
    title: '3 Errores Financieros',
    gancho: 'Deja de usar tu tarjeta de crédito hasta que no conozcas estos 3 trucos.',
    historia: '1. Revisa tu fecha de corte, no la fecha límite de pago.\n2. No uses más del 30% del límite asignado.\n3. Nunca saques dinero en efectivo del cajero con crédito.',
    moraleja: 'Corregir estos 3 hábitos te ahorrará miles en intereses y elevará tu aprobación bancaria.',
    cta: 'Comenta SCORE y te ayudo a evaluar tu perfil hoy mismo.'
  },
  3: { title: 'Reel 3', gancho: '', historia: '', moraleja: '', cta: '' },
  4: { title: 'Reel 4', gancho: '', historia: '', moraleja: '', cta: '' },
  5: { title: 'Reel 5', gancho: '', historia: '', moraleja: '', cta: '' }
};

let tpStoredLibre = null;
try {
  tpStoredLibre = JSON.parse(localStorage.getItem('tp_libre_scripts_v3'));
} catch(e) {}
if (!tpStoredLibre) tpStoredLibre = TP_DEFAULT_LIBRE_SLOTS;

let tpStoredReels = null;
try {
  tpStoredReels = JSON.parse(localStorage.getItem('tp_reel_scripts_v3'));
} catch(e) {}
if (!tpStoredReels) tpStoredReels = TP_DEFAULT_REEL_SLOTS;

const tpSavedMode = localStorage.getItem('tp_active_mode') || 'libre';
const tpSavedLibreSlot = parseInt(localStorage.getItem('tp_active_libre_slot')) || 1;
const tpSavedReelSlot = parseInt(localStorage.getItem('tp_active_reel_slot')) || 1;
const tpSavedReelSection = localStorage.getItem('tp_active_reel_section') || 'all';
const tpSavedOrientMode = localStorage.getItem('tp_orient_mode') || 'auto';
const tpSavedGuidePos = parseInt(localStorage.getItem('tp_guide_pos')) || 40;

function tpGetWordsPreview(text, maxWords = 4) {
  if (!text || !text.trim()) return '(Vacío)';
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const words = cleaned.split(' ');
  if (words.length <= maxWords) {
    return words.join(' ');
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

function tpGetReelWordsPreview(reel, maxWords = 4) {
  if (!reel) return '(Vacío)';
  const text = reel.gancho || reel.historia || reel.moraleja || reel.cta || '';
  return tpGetWordsPreview(text, maxWords);
}

function tpGetActiveDisplayScript() {
  if (tpState.mode === 'libre') {
    const slot = tpState.libreScripts[tpState.activeLibreSlot] || { title: 'Guión ' + tpState.activeLibreSlot, text: '' };
    return slot.text || '';
  } else {
    const slot = tpState.reelScripts[tpState.activeReelSlot] || { title: 'Reel ' + tpState.activeReelSlot, gancho: '', historia: '', moraleja: '', cta: '' };
    const sec = tpState.activeReelSection || 'all';
    if (sec === 'gancho') return slot.gancho && slot.gancho.trim() ? '🎣 GANCHO:\n' + slot.gancho.trim() : (slot.gancho || '');
    if (sec === 'historia') return slot.historia && slot.historia.trim() ? '📖 CONTEXTO / HISTORIA:\n' + slot.historia.trim() : (slot.historia || '');
    if (sec === 'moraleja') return slot.moraleja && slot.moraleja.trim() ? '💡 MORALEJA:\n' + slot.moraleja.trim() : (slot.moraleja || '');
    if (sec === 'cta') return slot.cta && slot.cta.trim() ? '📣 CTA:\n' + slot.cta.trim() : (slot.cta || '');

    let parts = [];
    if (slot.gancho && slot.gancho.trim()) parts.push("🎣 GANCHO:\n" + slot.gancho.trim());
    if (slot.historia && slot.historia.trim()) parts.push("📖 CONTEXTO / HISTORIA:\n" + slot.historia.trim());
    if (slot.moraleja && slot.moraleja.trim()) parts.push("💡 MORALEJA:\n" + slot.moraleja.trim());
    if (slot.cta && slot.cta.trim()) parts.push("📣 CTA:\n" + slot.cta.trim());
    return parts.join("\n\n");
  }
}

const tpState = {
  mode: tpSavedMode, // 'libre' or 'reel'
  libreScripts: tpStoredLibre,
  reelScripts: tpStoredReels,
  activeLibreSlot: tpSavedLibreSlot,
  activeReelSlot: tpSavedReelSlot,
  activeReelSection: tpSavedReelSection,
  
  editingMode: tpSavedMode,
  editingLibreSlot: tpSavedLibreSlot,
  editingReelSlot: tpSavedReelSlot,

  scriptText: '',
  isPlaying: false,
  speed: parseInt(localStorage.getItem('tp_speed')) || 35,
  fontSize: parseInt(localStorage.getItem('tp_font_size')) || 64,
  highlightColor: localStorage.getItem('tp_highlight_color') || '#ffee58',
  mirrorX: localStorage.getItem('tp_mirror_x') === 'true',
  mirrorY: localStorage.getItem('tp_mirror_y') === 'true',
  showGuide: localStorage.getItem('tp_show_guide') !== 'false',
  marginWidth: parseInt(localStorage.getItem('tp_margin')) || 88,
  orientationMode: tpSavedOrientMode,
  guidePosPct: tpSavedGuidePos,
  words: [],
  lines: [],
  activeLineIdx: -1,
  currentScrollY: 0,
  lastTimestamp: 0,
  controlsTimeout: null
};

tpState.scriptText = tpGetActiveDisplayScript();

let tpPrompterView, tpPrompterTransform, tpPrompterContent, tpReadingGuide, tpGuidePosLabel, tpControlBar;
let tpBtnPlay, tpIconPlay, tpIconPause, tpBtnReset, tpBtnMirror, tpBtnOrient, tpBtnEdit, tpBtnSettings, tpBtnFullscreen, tpFullscreenCloseBtn;
let tpLibreSlotSelect, tpReelSlotSelect, tpSpeedSlider, tpSpeedVal, tpFontSlider, tpFontVal, tpStatusDot, tpStatusText;

// Modal Elements
let tpEditorModal, tpBtnCloseEditor, tpBtnCancelEditor, tpBtnSaveEditor;
let tpTabModeLibre, tpTabModeReel, tpPanelModeLibre, tpPanelModeReel;
// Libre Panel
let tpLibreChipsContainer, tpLibreTitleInput, tpLibreScriptTextarea, tpPresetSample1, tpPresetSample2, tpBtnClearCurrentLibre, tpBtnClearAllLibre;
// Reel Panel
let tpReelChipsContainer, tpReelTitleInput, tpPresetSyncReels, tpBtnClearCurrentReel, tpBtnClearAllReels;
let tpReelGancho, tpReelHistoria, tpReelMoraleja, tpReelCTA;

// Settings Modal
let tpSettingsModal, tpBtnCloseSettings, tpBtnSaveSettings, tpToggleMirrorY, tpToggleGuideLine;
let tpGuidePosSlider, tpGuidePosVal, tpMarginSlider, tpMarginVal, tpColorSwatches;

let isTpFullscreen = false;

function tpToggleFullscreen(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const tpAppElem = document.getElementById('tpApp');
  isTpFullscreen = !isTpFullscreen;

  if (isTpFullscreen) {
    if (tpAppElem) tpAppElem.classList.add('tp-app-fullscreen');
    document.body.classList.add('tp-fullscreen-locked');
    if (tpBtnFullscreen) tpBtnFullscreen.classList.add('tp-btn-active');

    try {
      if (!document.fullscreenElement && tpAppElem && tpAppElem.requestFullscreen) {
        tpAppElem.requestFullscreen().catch(() => {});
      } else if (!document.fullscreenElement && tpAppElem && tpAppElem.webkitRequestFullscreen) {
        tpAppElem.webkitRequestFullscreen();
      }
    } catch(err) {}
  } else {
    if (tpAppElem) tpAppElem.classList.remove('tp-app-fullscreen');
    document.body.classList.remove('tp-fullscreen-locked');
    if (tpBtnFullscreen) tpBtnFullscreen.classList.remove('tp-btn-active');

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } catch(err) {}
  }

  setTimeout(() => {
    if (typeof tpRecalculateWordPositions === 'function') {
      tpRecalculateWordPositions();
    }
  }, 80);
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && isTpFullscreen) {
    const tpAppElem = document.getElementById('tpApp');
    if (tpAppElem) tpAppElem.classList.remove('tp-app-fullscreen');
    document.body.classList.remove('tp-fullscreen-locked');
    if (tpBtnFullscreen) tpBtnFullscreen.classList.remove('tp-btn-active');
    isTpFullscreen = false;
    setTimeout(tpRecalculateWordPositions, 80);
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement && isTpFullscreen) {
    const tpAppElem = document.getElementById('tpApp');
    if (tpAppElem) tpAppElem.classList.remove('tp-app-fullscreen');
    document.body.classList.remove('tp-fullscreen-locked');
    if (tpBtnFullscreen) tpBtnFullscreen.classList.remove('tp-btn-active');
    isTpFullscreen = false;
    setTimeout(tpRecalculateWordPositions, 80);
  }
});

function tpSaveScriptsToStorage() {
  localStorage.setItem('tp_libre_scripts_v3', JSON.stringify(tpState.libreScripts));
  localStorage.setItem('tp_reel_scripts_v3', JSON.stringify(tpState.reelScripts));
  localStorage.setItem('tp_active_mode', tpState.mode);
  localStorage.setItem('tp_active_libre_slot', tpState.activeLibreSlot);
  localStorage.setItem('tp_active_reel_slot', tpState.activeReelSlot);
  localStorage.setItem('tp_active_reel_section', tpState.activeReelSection);
}

function syncStudioScriptsToTeleprompter() {
  if (!tpState) return;
  const clientScripts = state.activeClient === 'ALL'
    ? state.scripts
    : state.scripts.filter(s => s.client === state.activeClient);
    
  if (!clientScripts || clientScripts.length === 0) return;

  // Import top 5 into Reels
  clientScripts.slice(0, 5).forEach((s, idx) => {
    const slotNum = idx + 1;
    const title = s.ideaGanadora ? s.ideaGanadora.substring(0, 25) : ('Reel ' + slotNum);
    tpState.reelScripts[slotNum] = {
      title: title,
      gancho: s.gancho || '',
      historia: s.historia || '',
      moraleja: s.moraleja || '',
      cta: s.cta || ''
    };
  });

  // Also import top 10 into Libre
  clientScripts.slice(0, 10).forEach((s, idx) => {
    const slotNum = idx + 1;
    const title = s.ideaGanadora ? s.ideaGanadora.substring(0, 25) : ('Guión ' + slotNum);
    let textParts = [];
    if (s.gancho && s.gancho.trim()) textParts.push(s.gancho.trim());
    if (s.historia && s.historia.trim()) textParts.push(s.historia.trim());
    if (s.moraleja && s.moraleja.trim()) textParts.push(s.moraleja.trim());
    if (s.cta && s.cta.trim()) textParts.push(s.cta.trim());
    const fullText = textParts.join("\n\n") || (s.ideaGanadora || '');
    tpState.libreScripts[slotNum] = {
      title: title,
      text: fullText
    };
  });

  tpState.scriptText = tpGetActiveDisplayScript();
  tpSaveScriptsToStorage();
  tpUpdateToolbarSelectors();
  tpRenderScript();
}

function openScriptInTeleprompterPro(scriptId) {
  if (isSetCardFullscreen) {
    toggleSetCardFullscreen();
  }
  const script = state.scripts.find(s => s.id === scriptId);
  if (!script) return;
  
  const title = script.ideaGanadora ? script.ideaGanadora.substring(0, 25) : 'Reel 1';
  
  tpState.mode = 'reel';
  tpState.activeReelSlot = 1;
  tpState.activeReelSection = 'all';
  
  tpState.reelScripts[1] = {
    title: title,
    gancho: script.gancho || '',
    historia: script.historia || '',
    moraleja: script.moraleja || '',
    cta: script.cta || ''
  };

  tpState.scriptText = tpGetActiveDisplayScript();
  tpSaveScriptsToStorage();
  tpUpdateToolbarSelectors();
  tpRenderScript();
  tpResetToTop();
  
  switchView('teleprompter_pro');
}

function tpUpdateToolbarSelectors() {
  // Populate Libre Dropdown (1 to 10) with smart words preview
  if (tpLibreSlotSelect) {
    tpLibreSlotSelect.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      const slot = tpState.libreScripts[i] || { title: 'Guión ' + i, text: '' };
      const hasText = slot.text && slot.text.trim();
      const preview = tpGetWordsPreview(slot.text, 4);
      opt.textContent = `📝 Guión ${i}: ${preview}${hasText ? ' ●' : ''}`;
      if (tpState.mode === 'libre' && i === tpState.activeLibreSlot) {
        opt.selected = true;
      }
      tpLibreSlotSelect.appendChild(opt);
    }
  }

  // Populate Reel Dropdown (1 to 5 + Sections) with smart words preview
  if (tpReelSlotSelect) {
    tpReelSlotSelect.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const slot = tpState.reelScripts[i] || { title: 'Reel ' + i };
      const hasContent = (slot.gancho?.trim() || slot.historia?.trim() || slot.moraleja?.trim() || slot.cta?.trim());
      const preview = tpGetReelWordsPreview(slot, 4);
      
      const optGroup = document.createElement('optgroup');
      optGroup.label = `📱 Reel ${i}: ${preview}${hasContent ? ' ●' : ''}`;

      const secAll = document.createElement('option');
      secAll.value = `${i}:all`;
      secAll.textContent = `▶ Reel ${i}: Todo Completo`;
      if (tpState.mode === 'reel' && tpState.activeReelSlot === i && tpState.activeReelSection === 'all') secAll.selected = true;
      optGroup.appendChild(secAll);

      const secGancho = document.createElement('option');
      secGancho.value = `${i}:gancho`;
      secGancho.textContent = `  🎣 1. Gancho (Hook)`;
      if (tpState.mode === 'reel' && tpState.activeReelSlot === i && tpState.activeReelSection === 'gancho') secGancho.selected = true;
      optGroup.appendChild(secGancho);

      const secHist = document.createElement('option');
      secHist.value = `${i}:historia`;
      secHist.textContent = `  📖 2. Contexto / Historia`;
      if (tpState.mode === 'reel' && tpState.activeReelSlot === i && tpState.activeReelSection === 'historia') secHist.selected = true;
      optGroup.appendChild(secHist);

      const secMor = document.createElement('option');
      secMor.value = `${i}:moraleja`;
      secMor.textContent = `  💡 3. Moraleja`;
      if (tpState.mode === 'reel' && tpState.activeReelSlot === i && tpState.activeReelSection === 'moraleja') secMor.selected = true;
      optGroup.appendChild(secMor);

      const secCTA = document.createElement('option');
      secCTA.value = `${i}:cta`;
      secCTA.textContent = `  📣 4. CTA Final`;
      if (tpState.mode === 'reel' && tpState.activeReelSlot === i && tpState.activeReelSection === 'cta') secCTA.selected = true;
      optGroup.appendChild(secCTA);

      tpReelSlotSelect.appendChild(optGroup);
    }
  }
}

function tpSwitchEditorTab(mode) {
  tpState.editingMode = mode;
  if (mode === 'libre') {
    if (tpTabModeLibre) {
      tpTabModeLibre.className = 'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 bg-cyan-600 text-white shadow-md shadow-cyan-950/50 cursor-pointer';
    }
    if (tpTabModeReel) {
      tpTabModeReel.className = 'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer';
    }
    if (tpPanelModeLibre) tpPanelModeLibre.classList.remove('hidden');
    if (tpPanelModeReel) tpPanelModeReel.classList.add('hidden');
    tpSwitchEditingLibreSlot(tpState.editingLibreSlot || 1);
  } else {
    if (tpTabModeReel) {
      tpTabModeReel.className = 'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50 cursor-pointer';
    }
    if (tpTabModeLibre) {
      tpTabModeLibre.className = 'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer';
    }
    if (tpPanelModeReel) tpPanelModeReel.classList.remove('hidden');
    if (tpPanelModeLibre) tpPanelModeLibre.classList.add('hidden');
    tpSwitchEditingReelSlot(tpState.editingReelSlot || 1);
  }
}

function tpRenderLibreChips() {
  if (!tpLibreChipsContainer) return;
  tpLibreChipsContainer.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-slot-chip' + (i === tpState.editingLibreSlot ? ' active' : '');
    
    const slot = tpState.libreScripts[i] || { title: 'Guión ' + i, text: '' };
    const preview = tpGetWordsPreview(slot.text, 3);
    btn.textContent = `Guión ${i}: ${preview}`;

    if (slot.text && slot.text.trim()) {
      const dot = document.createElement('span');
      dot.className = 'tp-dot-has-text';
      btn.appendChild(dot);
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      tpSwitchEditingLibreSlot(i);
    });

    tpLibreChipsContainer.appendChild(btn);
  }
}

function tpSwitchEditingLibreSlot(newSlotNum) {
  if (tpState.libreScripts[tpState.editingLibreSlot]) {
    const prev = tpState.libreScripts[tpState.editingLibreSlot];
    if (tpLibreTitleInput) prev.title = tpLibreTitleInput.value.trim() || ('Guión ' + tpState.editingLibreSlot);
    if (tpLibreScriptTextarea) prev.text = tpLibreScriptTextarea.value;
  }

  tpState.editingLibreSlot = newSlotNum;
  const currentData = tpState.libreScripts[newSlotNum] || { title: 'Guión ' + newSlotNum, text: '' };
  if (tpLibreTitleInput) tpLibreTitleInput.value = currentData.title || ('Guión ' + newSlotNum);
  if (tpLibreScriptTextarea) tpLibreScriptTextarea.value = currentData.text || '';
  tpRenderLibreChips();
}

function tpRenderReelChips() {
  if (!tpReelChipsContainer) return;
  tpReelChipsContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-slot-chip' + (i === tpState.editingReelSlot ? ' active' : '');
    
    const reel = tpState.reelScripts[i] || { title: 'Reel ' + i };
    const preview = tpGetReelWordsPreview(reel, 3);
    btn.textContent = `Reel ${i}: ${preview}`;

    if (reel.gancho?.trim() || reel.historia?.trim() || reel.moraleja?.trim() || reel.cta?.trim()) {
      const dot = document.createElement('span');
      dot.className = 'tp-dot-has-text';
      btn.appendChild(dot);
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      tpSwitchEditingReelSlot(i);
    });

    tpReelChipsContainer.appendChild(btn);
  }
}

function tpSwitchEditingReelSlot(newSlotNum) {
  if (tpState.reelScripts[tpState.editingReelSlot]) {
    const prev = tpState.reelScripts[tpState.editingReelSlot];
    if (tpReelTitleInput) prev.title = tpReelTitleInput.value.trim() || ('Reel ' + tpState.editingReelSlot);
    if (tpReelGancho) prev.gancho = tpReelGancho.value;
    if (tpReelHistoria) prev.historia = tpReelHistoria.value;
    if (tpReelMoraleja) prev.moraleja = tpReelMoraleja.value;
    if (tpReelCTA) prev.cta = tpReelCTA.value;
  }

  tpState.editingReelSlot = newSlotNum;
  const currentData = tpState.reelScripts[newSlotNum] || { title: 'Reel ' + newSlotNum, gancho: '', historia: '', moraleja: '', cta: '' };
  if (tpReelTitleInput) tpReelTitleInput.value = currentData.title || ('Reel ' + newSlotNum);
  if (tpReelGancho) tpReelGancho.value = currentData.gancho || '';
  if (tpReelHistoria) tpReelHistoria.value = currentData.historia || '';
  if (tpReelMoraleja) tpReelMoraleja.value = currentData.moraleja || '';
  if (tpReelCTA) tpReelCTA.value = currentData.cta || '';
  tpRenderReelChips();
}

function tpApplyStylesAndTransforms() {
  document.documentElement.style.setProperty('--tp-highlight-color', tpState.highlightColor);
  
  if (tpSpeedSlider) tpSpeedSlider.value = tpState.speed;
  if (tpSpeedVal) tpSpeedVal.textContent = tpState.speed;
  
  if (tpFontSlider) tpFontSlider.value = tpState.fontSize;
  if (tpFontVal) tpFontVal.textContent = tpState.fontSize + 'px';
  if (tpPrompterContent) tpPrompterContent.style.fontSize = tpState.fontSize + 'px';

  if (tpMarginSlider) tpMarginSlider.value = tpState.marginWidth;
  if (tpMarginVal) tpMarginVal.textContent = tpState.marginWidth + '%';
  if (tpPrompterContent) tpPrompterContent.style.maxWidth = tpState.marginWidth + '%';

  if (tpReadingGuide) tpReadingGuide.style.display = tpState.showGuide ? 'flex' : 'none';
  if (tpToggleGuideLine) tpToggleGuideLine.textContent = tpState.showGuide ? 'Visible' : 'Oculto';

  if (tpToggleMirrorY) tpToggleMirrorY.textContent = tpState.mirrorY ? 'Activado' : 'Desactivado';

  tpUpdateMirrorClasses();
  tpUpdateColorSwatchSelection();
  tpApplyOrientationMode();
  tpUpdateGuidePosition(tpState.guidePosPct);
}

function tpUpdateGuidePosition(newPct) {
  tpState.guidePosPct = Math.max(15, Math.min(75, Math.round(newPct)));
  if (tpReadingGuide) tpReadingGuide.style.top = tpState.guidePosPct + '%';
  if (tpPrompterTransform) {
    tpPrompterTransform.style.paddingTop = tpState.guidePosPct + 'vh';
    tpPrompterTransform.style.paddingBottom = (100 - tpState.guidePosPct + 25) + 'vh';
  }

  if (tpGuidePosSlider) tpGuidePosSlider.value = tpState.guidePosPct;
  if (tpGuidePosVal) tpGuidePosVal.textContent = tpState.guidePosPct + '%';
  if (tpGuidePosLabel) tpGuidePosLabel.textContent = tpState.guidePosPct + '%';

  localStorage.setItem('tp_guide_pos', tpState.guidePosPct);
  setTimeout(tpRecalculateWordPositions, 40);
}

function tpApplyOrientationMode() {
  document.body.classList.remove('tp-mode-portrait', 'tp-mode-landscape', 'tp-mode-rotate90');
  if (tpState.orientationMode && tpState.orientationMode !== 'auto') {
    document.body.classList.add('tp-mode-' + tpState.orientationMode);
  }

  const chips = document.querySelectorAll('#tp-orient-chips .tp-chip-btn');
  chips.forEach(chip => {
    if (chip.getAttribute('data-orient') === tpState.orientationMode) {
      chip.style.background = '#ffee58';
      chip.style.color = '#000000';
      chip.style.fontWeight = '700';
    } else {
      chip.style.background = '';
      chip.style.color = '';
      chip.style.fontWeight = '';
    }
  });

  if (tpBtnOrient) {
    tpBtnOrient.classList.toggle('tp-btn-active', tpState.orientationMode !== 'auto');
  }

  setTimeout(tpRecalculateWordPositions, 60);
}

function tpCycleOrientationMode() {
  const modes = ['auto', 'portrait', 'landscape', 'rotate90'];
  const currentIdx = modes.indexOf(tpState.orientationMode);
  const nextMode = modes[(currentIdx + 1) % modes.length];
  tpState.orientationMode = nextMode;
  localStorage.setItem('tp_orient_mode', nextMode);
  tpApplyOrientationMode();
}

function tpUpdateMirrorClasses() {
  if (!tpPrompterTransform) return;
  tpPrompterTransform.className = '';
  if (tpState.mirrorX && tpState.mirrorY) {
    tpPrompterTransform.classList.add('tp-mirror-xy');
  } else if (tpState.mirrorX) {
    tpPrompterTransform.classList.add('tp-mirror-x');
  } else if (tpState.mirrorY) {
    tpPrompterTransform.classList.add('tp-mirror-y');
  }
  if (tpBtnMirror) tpBtnMirror.classList.toggle('tp-btn-active', tpState.mirrorX);
}

function tpUpdateColorSwatchSelection() {
  if (!tpColorSwatches) return;
  tpColorSwatches.forEach(swatch => {
    if (swatch.getAttribute('data-color') === tpState.highlightColor) {
      swatch.classList.add('selected');
    } else {
      swatch.classList.remove('selected');
    }
  });
}

function tpRenderScript() {
  if (!tpPrompterContent) return;
  tpPrompterContent.innerHTML = '';
  tpState.words = [];
  tpState.lines = [];

  const textToRender = tpState.scriptText || '';
  const paragraphs = textToRender.split(/\n+/);
  let globalWordIdx = 0;

  paragraphs.forEach(pText => {
    if (!pText.trim()) return;
    const pElem = document.createElement('div');
    pElem.className = 'tp-paragraph';

    const wordTokens = pText.trim().split(/\s+/);
    wordTokens.forEach((w, idx) => {
      const span = document.createElement('span');
      span.className = 'tp-word';
      span.textContent = w;
      span.setAttribute('data-idx', globalWordIdx);
      
      pElem.appendChild(span);
      if (idx < wordTokens.length - 1) {
        pElem.appendChild(document.createTextNode(' '));
      }

      tpState.words.push({
        text: w,
        elem: span,
        idx: globalWordIdx
      });

      globalWordIdx++;
    });

    tpPrompterContent.appendChild(pElem);
  });

  tpRecalculateWordPositions();
  requestAnimationFrame(tpRecalculateWordPositions);
}

function tpRecalculateWordPositions() {
  tpState.lines = [];
  if (!tpPrompterContent || tpState.words.length === 0) return;

  const contentTop = tpPrompterContent.getBoundingClientRect().top;

  let currentLineWords = [];
  let currentTop = null;

  tpState.words.forEach(w => {
    const absTop = w.elem.getBoundingClientRect().top - contentTop;
    w.top = absTop;
    w.height = w.elem.offsetHeight;

    if (currentTop === null) {
      currentTop = absTop;
      currentLineWords.push(w);
    } else if (Math.abs(absTop - currentTop) < 14) {
      currentLineWords.push(w);
    } else {
      tpState.lines.push({
        words: currentLineWords,
        top: currentTop
      });
      currentTop = absTop;
      currentLineWords = [w];
    }
  });

  if (currentLineWords.length > 0) {
    tpState.lines.push({
      words: currentLineWords,
      top: currentTop
    });
  }
}

function tpRenderLoop(timestamp) {
  if (!tpState.lastTimestamp) tpState.lastTimestamp = timestamp;
  const dt = (timestamp - tpState.lastTimestamp) / 1000;
  tpState.lastTimestamp = timestamp;

  if (tpState.isPlaying && tpPrompterView) {
    const pixelsPerSec = tpState.speed * 2.8;
    tpState.currentScrollY += pixelsPerSec * dt;
    tpPrompterView.scrollTop = tpState.currentScrollY;

    if (tpPrompterView.scrollTop + tpPrompterView.clientHeight >= tpPrompterView.scrollHeight - 20) {
      tpPause();
    }
  }

  tpUpdateWordHighlights();
  requestAnimationFrame(tpRenderLoop);
}

function tpUpdateWordHighlights() {
  if (!tpReadingGuide || !tpState.words || tpState.words.length === 0) return;

  const guideRect = tpReadingGuide.getBoundingClientRect();
  const guideCenterY = guideRect.top + (guideRect.height / 2);

  const linesMap = new Map();

  tpState.words.forEach(w => {
    const rect = w.elem.getBoundingClientRect();
    if (rect.height === 0 || rect.width === 0) return;
    const centerY = rect.top + (rect.height / 2);
    
    let matchedLineY = null;
    for (const lineY of linesMap.keys()) {
      if (Math.abs(centerY - lineY) < 12) {
        matchedLineY = lineY;
        break;
      }
    }

    if (matchedLineY !== null) {
      linesMap.get(matchedLineY).push({ word: w, centerY });
    } else {
      linesMap.set(centerY, [{ word: w, centerY }]);
    }
  });

  if (linesMap.size === 0) return;

  let closestLineY = null;
  let minDiff = Infinity;

  for (const [lineY, wordGroup] of linesMap.entries()) {
    const diff = Math.abs(lineY - guideCenterY);
    if (diff < minDiff) {
      minDiff = diff;
      closestLineY = lineY;
    }
  }

  linesMap.forEach((wordGroup, lineY) => {
    const isCurrentActiveLine = (lineY === closestLineY);
    const isPastLine = (!isCurrentActiveLine && lineY < guideCenterY - 14);

    wordGroup.forEach(item => {
      if (isCurrentActiveLine) {
        item.word.elem.className = 'tp-word active';
      } else if (isPastLine) {
        item.word.elem.className = 'tp-word past';
      } else {
        item.word.elem.className = 'tp-word';
      }
    });
  });
}

function tpTogglePlay() {
  if (tpState.isPlaying) {
    tpPause();
  } else {
    tpPlay();
  }
}

function tpPlay() {
  tpState.isPlaying = true;
  if (tpPrompterView) tpState.currentScrollY = tpPrompterView.scrollTop;
  if (tpIconPlay) tpIconPlay.style.display = 'none';
  if (tpIconPause) tpIconPause.style.display = 'block';
  if (tpStatusDot) tpStatusDot.classList.add('playing');
  if (tpStatusText) tpStatusText.textContent = 'TRANSMITIENDO';
  tpScheduleHideControls();
}

function tpPause() {
  tpState.isPlaying = false;
  if (tpIconPlay) tpIconPlay.style.display = 'block';
  if (tpIconPause) tpIconPause.style.display = 'none';
  if (tpStatusDot) tpStatusDot.classList.remove('playing');
  if (tpStatusText) tpStatusText.textContent = 'PAUSADO';
  tpShowControls();
}

function tpResetToTop() {
  tpPause();
  if (tpPrompterView) tpPrompterView.scrollTop = 0;
  tpState.currentScrollY = 0;
  tpState.activeLineIdx = -1;
  tpUpdateWordHighlights();
}

function tpShowControls() {
  if (!tpControlBar) return;
  tpControlBar.classList.remove('hidden');
  clearTimeout(tpState.controlsTimeout);
  if (tpState.isPlaying) {
    tpScheduleHideControls();
  }
}

function tpScheduleHideControls() {
  clearTimeout(tpState.controlsTimeout);
  tpState.controlsTimeout = setTimeout(() => {
    if (tpState.isPlaying && tpControlBar) {
      tpControlBar.classList.add('hidden');
    }
  }, 3200);
}

function initTeleprompterProEngine() {
  tpPrompterView = document.getElementById('tp-prompter-view');
  tpPrompterTransform = document.getElementById('tp-prompter-transform');
  tpPrompterContent = document.getElementById('tp-prompter-content');
  tpReadingGuide = document.getElementById('tp-reading-guide');
  tpGuidePosLabel = document.getElementById('tp-guide-pos-label');
  tpControlBar = document.getElementById('tp-control-bar');
  
  tpBtnPlay = document.getElementById('tp-btn-play');
  tpIconPlay = document.getElementById('tp-icon-play');
  tpIconPause = document.getElementById('tp-icon-pause');
  tpBtnReset = document.getElementById('tp-btn-reset');
  tpBtnMirror = document.getElementById('tp-btn-mirror');
  tpBtnOrient = document.getElementById('tp-btn-orient');
  tpBtnEdit = document.getElementById('tp-btn-edit');
  tpBtnSettings = document.getElementById('tp-btn-settings');
  tpBtnFullscreen = document.getElementById('tp-btn-fullscreen');
  tpFullscreenCloseBtn = document.getElementById('tp-fullscreen-close-btn');
  
  tpLibreSlotSelect = document.getElementById('tp-libre-slot-select');
  tpReelSlotSelect = document.getElementById('tp-reel-slot-select');
  
  tpSpeedSlider = document.getElementById('tp-speed-slider');
  tpSpeedVal = document.getElementById('tp-speed-val');
  tpFontSlider = document.getElementById('tp-font-slider');
  tpFontVal = document.getElementById('tp-font-val');
  
  tpStatusDot = document.getElementById('tp-status-dot');
  tpStatusText = document.getElementById('tp-status-text');

  // Modal Elements
  tpEditorModal = document.getElementById('tp-editor-modal');
  tpBtnCloseEditor = document.getElementById('tp-btn-close-editor');
  tpBtnCancelEditor = document.getElementById('tp-btn-cancel-editor');
  tpBtnSaveEditor = document.getElementById('tp-btn-save-editor');

  tpTabModeLibre = document.getElementById('tp-tab-mode-libre');
  tpTabModeReel = document.getElementById('tp-tab-mode-reel');
  tpPanelModeLibre = document.getElementById('tp-panel-mode-libre');
  tpPanelModeReel = document.getElementById('tp-panel-mode-reel');

  // Mode Libre
  tpLibreChipsContainer = document.getElementById('tp-libre-chips-container');
  tpLibreTitleInput = document.getElementById('tp-libre-title-input');
  tpLibreScriptTextarea = document.getElementById('tp-libre-script-textarea');
  tpPresetSample1 = document.getElementById('tp-preset-sample1');
  tpPresetSample2 = document.getElementById('tp-preset-sample2');
  tpBtnClearCurrentLibre = document.getElementById('tp-btn-clear-current-libre');
  tpBtnClearAllLibre = document.getElementById('tp-btn-clear-all-libre');

  // Mode Reel
  tpReelChipsContainer = document.getElementById('tp-reel-chips-container');
  tpReelTitleInput = document.getElementById('tp-reel-title-input');
  tpPresetSyncReels = document.getElementById('tp-preset-sync-reels');
  tpBtnClearCurrentReel = document.getElementById('tp-btn-clear-current-reel');
  tpBtnClearAllReels = document.getElementById('tp-btn-clear-all-reels');
  tpReelGancho = document.getElementById('tp-reel-gancho');
  tpReelHistoria = document.getElementById('tp-reel-historia');
  tpReelMoraleja = document.getElementById('tp-reel-moraleja');
  tpReelCTA = document.getElementById('tp-reel-cta');

  // Settings Modal
  tpSettingsModal = document.getElementById('tp-settings-modal');
  tpBtnCloseSettings = document.getElementById('tp-btn-close-settings');
  tpBtnSaveSettings = document.getElementById('tp-btn-save-settings');
  tpToggleMirrorY = document.getElementById('tp-toggle-mirror-y');
  tpToggleGuideLine = document.getElementById('tp-toggle-guide-line');
  tpGuidePosSlider = document.getElementById('tp-guide-pos-slider');
  tpGuidePosVal = document.getElementById('tp-guide-pos-val');
  tpMarginSlider = document.getElementById('tp-margin-slider');
  tpMarginVal = document.getElementById('tp-margin-val');
  tpColorSwatches = document.querySelectorAll('.tp-color-swatch');

  if (!tpPrompterView) return;

  tpApplyStylesAndTransforms();
  tpUpdateToolbarSelectors();
  tpRenderScript();
  setupTeleprompterProEventListeners();
  requestAnimationFrame(tpRenderLoop);
}

function setupTeleprompterProEventListeners() {
  if (tpLibreSlotSelect) {
    tpLibreSlotSelect.addEventListener('change', (e) => {
      const chosenSlot = parseInt(e.target.value);
      if (!chosenSlot) return;
      tpState.mode = 'libre';
      tpState.activeLibreSlot = chosenSlot;
      tpState.scriptText = tpGetActiveDisplayScript();
      tpSaveScriptsToStorage();
      tpUpdateToolbarSelectors();
      tpRenderScript();
      tpResetToTop();
    });
  }

  if (tpReelSlotSelect) {
    tpReelSlotSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      const parts = val.split(':');
      const chosenSlot = parseInt(parts[0]);
      const chosenSec = parts[1] || 'all';
      tpState.mode = 'reel';
      tpState.activeReelSlot = chosenSlot;
      tpState.activeReelSection = chosenSec;
      tpState.scriptText = tpGetActiveDisplayScript();
      tpSaveScriptsToStorage();
      tpUpdateToolbarSelectors();
      tpRenderScript();
      tpResetToTop();
    });
  }

  if (tpPrompterView) {
    tpPrompterView.addEventListener('scroll', () => {
      if (!tpState.isPlaying || Math.abs(tpPrompterView.scrollTop - tpState.currentScrollY) > 30) {
        tpState.currentScrollY = tpPrompterView.scrollTop;
      }
    });

    tpPrompterView.addEventListener('click', (e) => {
      if (tpControlBar && tpControlBar.classList.contains('hidden')) {
        tpShowControls();
      } else {
        tpTogglePlay();
      }
    });
  }

  const tpAppElem = document.getElementById('tpApp');
  if (tpAppElem) {
    tpAppElem.addEventListener('mousemove', tpShowControls);
    tpAppElem.addEventListener('touchstart', tpShowControls);
  }

  if (tpBtnPlay) tpBtnPlay.addEventListener('click', (e) => { e.stopPropagation(); tpTogglePlay(); });
  if (tpBtnReset) tpBtnReset.addEventListener('click', (e) => { e.stopPropagation(); tpResetToTop(); });

  if (tpBtnMirror) {
    tpBtnMirror.addEventListener('click', (e) => {
      e.stopPropagation();
      tpState.mirrorX = !tpState.mirrorX;
      localStorage.setItem('tp_mirror_x', tpState.mirrorX);
      tpUpdateMirrorClasses();
    });
  }

  if (tpBtnOrient) {
    tpBtnOrient.addEventListener('click', (e) => {
      e.stopPropagation();
      tpCycleOrientationMode();
    });
  }

  const orientChips = document.querySelectorAll('#tp-orient-chips .tp-chip-btn');
  orientChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const mode = chip.getAttribute('data-orient');
      tpState.orientationMode = mode;
      localStorage.setItem('tp_orient_mode', mode);
      tpApplyOrientationMode();
    });
  });

  if (tpSpeedSlider) {
    tpSpeedSlider.addEventListener('input', (e) => {
      tpState.speed = parseInt(e.target.value);
      if (tpSpeedVal) tpSpeedVal.textContent = tpState.speed;
      localStorage.setItem('tp_speed', tpState.speed);
    });
  }

  if (tpFontSlider) {
    tpFontSlider.addEventListener('input', (e) => {
      tpState.fontSize = parseInt(e.target.value);
      if (tpFontVal) tpFontVal.textContent = tpState.fontSize + 'px';
      if (tpPrompterContent) tpPrompterContent.style.fontSize = tpState.fontSize + 'px';
      localStorage.setItem('tp_font_size', tpState.fontSize);
      setTimeout(tpRecalculateWordPositions, 50);
    });
  }

  if (tpBtnFullscreen) tpBtnFullscreen.addEventListener('click', tpToggleFullscreen);
  if (tpFullscreenCloseBtn) tpFullscreenCloseBtn.addEventListener('click', tpToggleFullscreen);
  
  const tpBtnExpandFullscreen = document.getElementById('tpBtnExpandFullscreen');
  if (tpBtnExpandFullscreen) tpBtnExpandFullscreen.addEventListener('click', tpToggleFullscreen);

  const tpBtnSyncStudio = document.getElementById('tpBtnSyncStudio');
  if (tpBtnSyncStudio) {
    tpBtnSyncStudio.addEventListener('click', () => {
      syncStudioScriptsToTeleprompter();
      alert("✅ ¡Guiones de Blex Studio sincronizados correctamente con el Teleprónter!");
    });
  }

  // Edit Mode & Tabs
  if (tpTabModeLibre) {
    tpTabModeLibre.addEventListener('click', () => {
      tpSwitchEditorTab('libre');
    });
  }

  if (tpTabModeReel) {
    tpTabModeReel.addEventListener('click', () => {
      tpSwitchEditorTab('reel');
    });
  }

  if (tpBtnEdit) {
    tpBtnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      tpPause();
      tpSwitchEditorTab(tpState.mode || 'libre');
      if (tpState.mode === 'libre') {
        tpSwitchEditingLibreSlot(tpState.activeLibreSlot || 1);
      } else {
        tpSwitchEditingReelSlot(tpState.activeReelSlot || 1);
      }
      if (tpEditorModal) tpEditorModal.classList.add('open');
    });
  }

  if (tpBtnCloseEditor) tpBtnCloseEditor.addEventListener('click', () => tpEditorModal.classList.remove('open'));
  if (tpBtnCancelEditor) tpBtnCancelEditor.addEventListener('click', () => tpEditorModal.classList.remove('open'));

  // Live update Libre Chip text on typing
  if (tpLibreScriptTextarea) {
    tpLibreScriptTextarea.addEventListener('input', () => {
      if (tpState.libreScripts[tpState.editingLibreSlot]) {
        tpState.libreScripts[tpState.editingLibreSlot].text = tpLibreScriptTextarea.value;
      }
      tpRenderLibreChips();
    });
  }

  // Live update Reel Chip text on typing
  const updateReelSlotLive = () => {
    if (tpState.reelScripts[tpState.editingReelSlot]) {
      if (tpReelGancho) tpState.reelScripts[tpState.editingReelSlot].gancho = tpReelGancho.value;
      if (tpReelHistoria) tpState.reelScripts[tpState.editingReelSlot].historia = tpReelHistoria.value;
      if (tpReelMoraleja) tpState.reelScripts[tpState.editingReelSlot].moraleja = tpReelMoraleja.value;
      if (tpReelCTA) tpState.reelScripts[tpState.editingReelSlot].cta = tpReelCTA.value;
    }
    tpRenderReelChips();
  };

  if (tpReelGancho) tpReelGancho.addEventListener('input', updateReelSlotLive);
  if (tpReelHistoria) tpReelHistoria.addEventListener('input', updateReelSlotLive);
  if (tpReelMoraleja) tpReelMoraleja.addEventListener('input', updateReelSlotLive);
  if (tpReelCTA) tpReelCTA.addEventListener('input', updateReelSlotLive);

  // Save Modal Action
  if (tpBtnSaveEditor) {
    tpBtnSaveEditor.addEventListener('click', () => {
      if (tpState.editingMode === 'libre') {
        if (tpState.libreScripts[tpState.editingLibreSlot]) {
          const slot = tpState.libreScripts[tpState.editingLibreSlot];
          if (tpLibreTitleInput) slot.title = tpLibreTitleInput.value.trim() || ('Guión ' + tpState.editingLibreSlot);
          if (tpLibreScriptTextarea) slot.text = tpLibreScriptTextarea.value;
        }
        tpState.mode = 'libre';
        tpState.activeLibreSlot = tpState.editingLibreSlot;
      } else {
        if (tpState.reelScripts[tpState.editingReelSlot]) {
          const slot = tpState.reelScripts[tpState.editingReelSlot];
          if (tpReelTitleInput) slot.title = tpReelTitleInput.value.trim() || ('Reel ' + tpState.editingReelSlot);
          if (tpReelGancho) slot.gancho = tpReelGancho.value;
          if (tpReelHistoria) slot.historia = tpReelHistoria.value;
          if (tpReelMoraleja) slot.moraleja = tpReelMoraleja.value;
          if (tpReelCTA) slot.cta = tpReelCTA.value;
        }
        tpState.mode = 'reel';
        tpState.activeReelSlot = tpState.editingReelSlot;
        tpState.activeReelSection = 'all';
      }

      tpState.scriptText = tpGetActiveDisplayScript();
      tpSaveScriptsToStorage();
      tpUpdateToolbarSelectors();
      tpRenderScript();
      tpResetToTop();
      if (tpEditorModal) tpEditorModal.classList.remove('open');
    });
  }

  // Mode Libre Buttons
  if (tpPresetSample1) tpPresetSample1.addEventListener('click', () => {
    if (tpLibreScriptTextarea) {
      tpLibreScriptTextarea.value = TP_SAMPLE_SCRIPTS.presentation;
      if (tpState.libreScripts[tpState.editingLibreSlot]) tpState.libreScripts[tpState.editingLibreSlot].text = TP_SAMPLE_SCRIPTS.presentation;
      tpRenderLibreChips();
    }
  });
  if (tpPresetSample2) tpPresetSample2.addEventListener('click', () => {
    if (tpLibreScriptTextarea) {
      tpLibreScriptTextarea.value = TP_SAMPLE_SCRIPTS.youtube;
      if (tpState.libreScripts[tpState.editingLibreSlot]) tpState.libreScripts[tpState.editingLibreSlot].text = TP_SAMPLE_SCRIPTS.youtube;
      tpRenderLibreChips();
    }
  });

  if (tpBtnClearCurrentLibre) {
    tpBtnClearCurrentLibre.addEventListener('click', () => {
      if (tpLibreScriptTextarea) tpLibreScriptTextarea.value = '';
      if (tpState.libreScripts[tpState.editingLibreSlot]) {
        tpState.libreScripts[tpState.editingLibreSlot].text = '';
      }
      tpRenderLibreChips();
    });
  }

  if (tpBtnClearAllLibre) {
    tpBtnClearAllLibre.addEventListener('click', () => {
      if (confirm('⚠️ ¿Estás seguro de que deseas vaciar el texto de los 10 Guiones Libres?')) {
        for (let i = 1; i <= 10; i++) {
          tpState.libreScripts[i] = { title: 'Guión ' + i, text: '' };
        }
        if (tpLibreTitleInput) tpLibreTitleInput.value = 'Guión ' + tpState.editingLibreSlot;
        if (tpLibreScriptTextarea) tpLibreScriptTextarea.value = '';
        tpRenderLibreChips();
      }
    });
  }

  // Mode Reel Buttons
  if (tpPresetSyncReels) {
    tpPresetSyncReels.addEventListener('click', () => {
      const clientScripts = state.activeClient === 'ALL'
        ? state.scripts
        : state.scripts.filter(s => s.client === state.activeClient);
        
      if (!clientScripts || clientScripts.length === 0) {
        alert("No hay guiones guardados en Blex Studio para importar.");
        return;
      }

      clientScripts.slice(0, 5).forEach((s, idx) => {
        const slotNum = idx + 1;
        const title = s.ideaGanadora ? s.ideaGanadora.substring(0, 25) : ('Reel ' + slotNum);
        tpState.reelScripts[slotNum] = {
          title: title,
          gancho: s.gancho || '',
          historia: s.historia || '',
          moraleja: s.moraleja || '',
          cta: s.cta || ''
        };
      });

      tpSwitchEditingReelSlot(tpState.editingReelSlot);
      alert("✅ ¡Se han importado los guiones de Blex Studio a los 5 Reels!");
    });
  }

  if (tpBtnClearCurrentReel) {
    tpBtnClearCurrentReel.addEventListener('click', () => {
      if (tpReelGancho) tpReelGancho.value = '';
      if (tpReelHistoria) tpReelHistoria.value = '';
      if (tpReelMoraleja) tpReelMoraleja.value = '';
      if (tpReelCTA) tpReelCTA.value = '';
      if (tpState.reelScripts[tpState.editingReelSlot]) {
        tpState.reelScripts[tpState.editingReelSlot].gancho = '';
        tpState.reelScripts[tpState.editingReelSlot].historia = '';
        tpState.reelScripts[tpState.editingReelSlot].moraleja = '';
        tpState.reelScripts[tpState.editingReelSlot].cta = '';
      }
      tpRenderReelChips();
    });
  }

  if (tpBtnClearAllReels) {
    tpBtnClearAllReels.addEventListener('click', () => {
      if (confirm('⚠️ ¿Estás seguro de que deseas vaciar los 5 Reels estructurados?')) {
        for (let i = 1; i <= 5; i++) {
          tpState.reelScripts[i] = { title: 'Reel ' + i, gancho: '', historia: '', moraleja: '', cta: '' };
        }
        if (tpReelTitleInput) tpReelTitleInput.value = 'Reel ' + tpState.editingReelSlot;
        if (tpReelGancho) tpReelGancho.value = '';
        if (tpReelHistoria) tpReelHistoria.value = '';
        if (tpReelMoraleja) tpReelMoraleja.value = '';
        if (tpReelCTA) tpReelCTA.value = '';
        tpRenderReelChips();
      }
    });
  }

  // Settings Modal Listeners
  if (tpBtnSettings) {
    tpBtnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      tpPause();
      if (tpSettingsModal) tpSettingsModal.classList.add('open');
    });
  }

  if (tpBtnCloseSettings) tpBtnCloseSettings.addEventListener('click', () => tpSettingsModal.classList.remove('open'));
  if (tpBtnSaveSettings) tpBtnSaveSettings.addEventListener('click', () => tpSettingsModal.classList.remove('open'));

  if (tpColorSwatches) {
    tpColorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        tpState.highlightColor = swatch.getAttribute('data-color');
        localStorage.setItem('tp_highlight_color', tpState.highlightColor);
        document.documentElement.style.setProperty('--tp-highlight-color', tpState.highlightColor);
        tpUpdateColorSwatchSelection();
      });
    });
  }

  if (tpToggleMirrorY) {
    tpToggleMirrorY.addEventListener('click', () => {
      tpState.mirrorY = !tpState.mirrorY;
      localStorage.setItem('tp_mirror_y', tpState.mirrorY);
      tpToggleMirrorY.textContent = tpState.mirrorY ? 'Activado' : 'Desactivado';
      tpUpdateMirrorClasses();
    });
  }

  if (tpToggleGuideLine) {
    tpToggleGuideLine.addEventListener('click', () => {
      tpState.showGuide = !tpState.showGuide;
      localStorage.setItem('tp_show_guide', tpState.showGuide);
      if (tpReadingGuide) tpReadingGuide.style.display = tpState.showGuide ? 'flex' : 'none';
      tpToggleGuideLine.textContent = tpState.showGuide ? 'Visible' : 'Oculto';
    });
  }

  if (tpGuidePosSlider) {
    tpGuidePosSlider.addEventListener('input', (e) => {
      tpUpdateGuidePosition(parseInt(e.target.value));
    });
  }

  let isDraggingGuide = false;
  const onGuideDragStart = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    isDraggingGuide = true;
    if (tpReadingGuide) tpReadingGuide.classList.add('dragging');
  };
  const onGuideDragMove = (e) => {
    if (!isDraggingGuide) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pct = (clientY / window.innerHeight) * 100;
    tpUpdateGuidePosition(pct);
  };
  const onGuideDragEnd = () => {
    if (isDraggingGuide) {
      isDraggingGuide = false;
      if (tpReadingGuide) tpReadingGuide.classList.remove('dragging');
    }
  };

  if (tpReadingGuide) {
    tpReadingGuide.addEventListener('mousedown', onGuideDragStart);
    tpReadingGuide.addEventListener('touchstart', onGuideDragStart, { passive: true });
  }
  window.addEventListener('mousemove', onGuideDragMove);
  window.addEventListener('touchmove', onGuideDragMove, { passive: true });
  window.addEventListener('mouseup', onGuideDragEnd);
  window.addEventListener('touchend', onGuideDragEnd);

  if (tpMarginSlider) {
    tpMarginSlider.addEventListener('input', (e) => {
      tpState.marginWidth = parseInt(e.target.value);
      if (tpMarginVal) tpMarginVal.textContent = tpState.marginWidth + '%';
      if (tpPrompterContent) tpPrompterContent.style.maxWidth = tpState.marginWidth + '%';
      localStorage.setItem('tp_margin', tpState.marginWidth);
      setTimeout(tpRecalculateWordPositions, 50);
    });
  }

  window.addEventListener('resize', () => {
    setTimeout(tpRecalculateWordPositions, 100);
  });

  window.addEventListener('keydown', (e) => {
    if (state.currentView !== 'teleprompter_pro') return;
    if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
      return;
    }

    switch(e.code) {
      case 'Space':
      case 'Enter':
        e.preventDefault();
        tpTogglePlay();
        break;
      case 'ArrowUp':
        e.preventDefault();
        tpState.speed = Math.min(100, tpState.speed + 3);
        if (tpSpeedSlider) tpSpeedSlider.value = tpState.speed;
        if (tpSpeedVal) tpSpeedVal.textContent = tpState.speed;
        localStorage.setItem('tp_speed', tpState.speed);
        break;
      case 'ArrowDown':
        e.preventDefault();
        tpState.speed = Math.max(1, tpState.speed - 3);
        if (tpSpeedSlider) tpSpeedSlider.value = tpState.speed;
        if (tpSpeedVal) tpSpeedVal.textContent = tpState.speed;
        localStorage.setItem('tp_speed', tpState.speed);
        break;
      case 'ArrowRight':
        e.preventDefault();
        tpState.fontSize = Math.min(120, tpState.fontSize + 4);
        if (tpFontSlider) tpFontSlider.value = tpState.fontSize;
        if (tpFontVal) tpFontVal.textContent = tpState.fontSize + 'px';
        if (tpPrompterContent) tpPrompterContent.style.fontSize = tpState.fontSize + 'px';
        localStorage.setItem('tp_font_size', tpState.fontSize);
        setTimeout(tpRecalculateWordPositions, 50);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        tpState.fontSize = Math.max(28, tpState.fontSize - 4);
        if (tpFontSlider) tpFontSlider.value = tpState.fontSize;
        if (tpFontVal) tpFontVal.textContent = tpState.fontSize + 'px';
        if (tpPrompterContent) tpPrompterContent.style.fontSize = tpState.fontSize + 'px';
        localStorage.setItem('tp_font_size', tpState.fontSize);
        setTimeout(tpRecalculateWordPositions, 50);
        break;
      case 'KeyR':
        tpResetToTop();
        break;
      case 'KeyM':
        tpState.mirrorX = !tpState.mirrorX;
        localStorage.setItem('tp_mirror_x', tpState.mirrorX);
        tpUpdateMirrorClasses();
        break;
      case 'KeyO':
        tpCycleOrientationMode();
        break;
      case 'KeyF':
        tpToggleFullscreen(e);
        break;
      case 'Escape':
        if (isTpFullscreen) {
          tpToggleFullscreen(e);
        }
        break;
      case 'KeyE':
        if (tpBtnEdit) tpBtnEdit.click();
        break;
    }
  });
}


// =======================================================
// BLEX AI STUDIO & 64 VIRAL HOOKS ENGINE (QWEN 2.5 LOCAL)
// =======================================================


// =========================================================================
// ENCICLOPEDIA MAESTRA DE CONTENIDO: DINERO & DESARROLLO PERSONAL EN REDES
// =========================================================================
const BLEX_MONEY_PERSONAL_DEV_KNOWLEDGE = `
ENCICLOPEDIA MAESTRA DE CONTENIDO VIRAL: DINERO, FINANZAS & DESARROLLO PERSONAL (BLEX STUDIO)

=============================================================================
I. DOMINIO DEL DINERO & FINANZAS EN REDES SOCIALES
=============================================================================
1. PSICOLOGÍA DEL DINERO & SESGOS COGNITIVOS:
   • La trampa del estatus (Status Trap): Gastar dinero que no tienes para impresionar a gente que no te importa.
   • Riqueza Silenciosa (Stealth Wealth) vs. "Pobreza con Ropa Cara": El rico compra activos y tiempo; el que aparenta compra pasivos con logotipos gigantes.
   • Gratificación Instantánea vs. Interés Compuesto: Por qué el 95% prefiere $100 hoy que $100,000 en 5 años.
   • El Dolor de Pagar & Microfugas: Cómo las suscripciones invisibles y los "gastos hormiga" drenan más capital que un gasto grande.
   • Relación emocional con el dinero: Curar la mentalidad de escasez (creer que el dinero es malo o finito) y adoptar mentalidad de valor (el dinero sigue al valor que aportas).

2. EDUCACIÓN FINANCIERA PRÁCTICA & NIVELES DE RIQUEZA:
   • Nivel 1: Sobrevivencia Financiera (Gastas más de lo que ganas, dependes de una sola fuente, deudas de consumo tóxicas con intereses altos).
   • Nivel 2: Estabilidad & Control (Fondo de paz mental de 3 a 6 meses, presupuesto 50/30/20 real, 0 deudas destructivas).
   • Nivel 3: Crecimiento & Habilidades de Alto Valor (Ventas, copywriting, creación de contenido, tecnología, consultoría, monetización de audiencia).
   • Nivel 4: Libertad & Activos (Negocios digitales escalables, inversiones indexadas, bienes raíces, sistemas automatizados).

3. ERRORES FATALES CON EL DINERO QUE LA GENTE COMETE:
   • Dejar el dinero quieto en el banco perdiendo valor contra la inflación todos los días.
   • Comprar un auto nuevo financiado a 5 o 7 años como "primer gran logro".
   • Usar las tarjetas de crédito como una extensión del sueldo en vez de una herramienta de apalancamiento y cashback.
   • Creer que necesitas ganar mucho dinero para empezar a invertir (el hábito y el tiempo importan más que la cantidad inicial).

4. ÁNGULOS Y GANCHOS VIRALES DE DINERO:
   • "Si tienes entre 20 y 35 años y tu cuenta bancaria sigue en cero, este es el porqué..."
   • "La diferencia entre alguien que gana $1,000 y alguien que gana $10,000 no es el esfuerzo..."
   • "3 cosas que los millonarios nunca compran (y la clase media presume)..."
   • "La regla de las 72 horas antes de comprar cualquier cosa que supere $50..."

=============================================================================
II. DOMINIO DEL DESARROLLO PERSONAL & ALTO RENDIMIENTO (HIGH PERFORMANCE)
=============================================================================
1. DISCIPLINA SOBRE MOTIVACIÓN:
   • La motivación es una emoción temporal; la disciplina es un sistema que funciona cuando no tienes ganas.
   • Fricción vs. Facilidad: Cómo diseñar tu entorno para que los malos hábitos sean difíciles y los buenos sean automáticos.
   • La Regla del 1% (Mejora Continua Kaizen): Pequeñas victorias diarias invisibles que producen resultados exponenciales en 1 año.

2. DESINTOXICACIÓN DE DOPAMINA & ENFOQUE PROFUNDO (DEEP WORK):
   • La epidemia del cerebro quemado (Brain Rot): Scroll infinito, pornografía, comida chatarra y recompensas sin esfuerzo.
   • Cómo recuperar la concentración: Bloques de 90 minutos de trabajo sin teléfono ni notificaciones.
   • El poder del Aburrimiento: Los momentos de creatividad nacen cuando dejas que tu cerebro descanse sin pantallas.

3. RELACIONES & EL ENTORNO (LA REGLA DE LAS 5 PERSONAS):
   • Eres el promedio de las 5 personas con las que más tiempo pasas y el contenido que más consumes.
   • Aprender a decir NO sin sentir culpa: Proteger tu tiempo y energía como el activo más valioso.
   • El silencio estratégico: Trabajar en secreto hasta que tus resultados hablen por ti.

4. RESILIENCIA & RESPONSABILIDAD TOTAL (EXTREME OWNERSHIP):
   • No es tu culpa de dónde vienes, pero es 100% tu responsabilidad dónde terminas.
   • El fracaso no es lo opuesto al éxito, es el ingrediente principal del aprendizaje.
   • Cómo matar el síndrome del impostor: Enfocarse en el servicio y en los hechos, no en las opiniones ajenas.

5. ÁNGULOS Y GANCHOS VIRALES DE DESARROLLO PERSONAL:
   • "El 99% de las personas va a desperdiciar este año haciendo exactamente lo mismo..."
   • "Una verdad incómoda que tardé 5 años en aceptar..."
   • "Cómo reprogramar tu mente en 30 días eliminando estas 3 cosas..."
   • "Tus amigos no quieren verte quebrado, pero tampoco quieren verte más exitoso que ellos..."
`;

const BLEX_VIRAL_CALCULATOR_KNOWLEDGE = `
MATRIZ Y CRITERIOS DE VIRALIDAD BLEX STUDIO (MÁXIMO 14.5 PUNTOS):
Para que cualquier guión o gancho alcance millones de reproducciones y máxima retención en Reels, TikTok y YouTube Shorts, debe estructurarse obligatoriamente bajo estos 7 pilares:

1. COMPRENSIÓN SIMPLE / NIÑO DE 5 AÑOS (+2.5 pts):
   - Cero jerga técnica o explicaciones complejas. La idea debe entenderse en los primeros 2 segundos.

2. ATRACCIÓN MASIVA / 50 DE 100 PERSONAS (+2.5 pts):
   - Toca dolores y deseos universales (dinero, ahorro, errores cotidianos, estatus, tiempo, salud, relaciones).

3. REFERENCIA VIRAL PREVIA / ÁNGULO PROBADO (+2.0 pts):
   - Estructura inspirada en patrones y ganchos que ya superaron 1 millón de vistas.

4. MERCADO Y AVATAR ACTIVO (+0.5 pts):
   - Conexión emocional auténtica con la audiencia del creador/cliente.

5. TENDENCIA / COYUNTURA ACTUAL (+1.5 pts):
   - Conexión con temas actuales, patrones de búsqueda o sentido de urgencia temporal ("en 2026...", "hoy mismo...").

6. CONTROVERSIA / DEBATE POLARIZANTE (+1.0 pts):
   - Plantea afirmaciones contraintuitivas o preguntas provocativas respetuosas para que el público comente masivamente.

7. INMERSIÓN VISUAL Y FORMATO DINÁMICO (+4.5 pts):
   - Ritmo ágil: Gancho magnético (0-3s), Historia/Contexto sin relleno (3-30s), Moraleja con la pepita de oro (30-40s) y un CTA con palabra clave para comentar.
`;

const aiState = {
  serverUrl: localStorage.getItem('ai_server_url') || 'http://localhost:11434',
  model: localStorage.getItem('ai_model') || 'qwen2.5:7b',
  isConnected: false,
  isGenerating: false,
  activeTab: 'hooks',
  selectedCatalogHookId: null
};

function getAiServerEndpoint() {
  let url = (aiState.serverUrl || 'http://localhost:11434').trim().replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  return url;
}

function aiUpdateConnectionBadge(connected) {
  aiState.isConnected = connected;
  const dots = [document.getElementById('aiStatusHeaderDot'), document.getElementById('aiServerStatusDot')];
  const textElem = document.getElementById('aiServerStatusText');
  
  dots.forEach(d => {
    if (!d) return;
    if (connected) {
      d.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80';
    } else {
      d.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80';
    }
  });

  if (textElem) {
    textElem.textContent = connected ? 'IA Conectada' : 'IA Desconectada (Verificar Servidor)';
    textElem.className = connected ? 'font-bold text-emerald-300' : 'font-bold text-rose-400';
  }
}


function getAiApiEndpoint(base, route) {
  let clean = (base || aiState.serverUrl || 'http://localhost:11434').trim().replace(/\/+$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'http://' + clean;
  }
  if (clean.endsWith('/api/ollama') || clean.endsWith('/ollama')) {
    return `${clean}/${route}`;
  }
  if (clean.endsWith('/api')) {
    return `${clean}/${route}`;
  }
  return `${clean}/api/${route}`;
}

// =============================================================================
// MODAL DE CONFIGURACIÓN DE SERVIDOR IA (OLLAMA / MODELO)
// =============================================================================

function setServerUrlPreset(url) {
  const input = document.getElementById('aiConfigServerUrl');
  if (input) input.value = url;
  testAiServerConnection();
}

function openAiServerConfigModal() {
  const modal = document.getElementById('aiServerConfigModal');
  if (!modal) {
    console.error('aiServerConfigModal not found');
    return;
  }
  
  const urlInput = document.getElementById('aiConfigServerUrl');
  const modelInput = document.getElementById('aiConfigModelName');
  const resultDiv = document.getElementById('aiConfigTestResult');

  const savedUrl = localStorage.getItem('ai_server_url') || aiState.serverUrl || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:11434' : 'http://192.168.1.10:11434');
  const savedModel = localStorage.getItem('ai_model') || aiState.model || 'qwen2.5:7b';

  if (urlInput) {
    urlInput.value = savedUrl;
  }
  if (modelInput) {
    modelInput.value = savedModel;
  }
  if (resultDiv) {
    resultDiv.classList.add('hidden');
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}

function closeAiServerConfigModal() {
  const modal = document.getElementById('aiServerConfigModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

async function testAiServerConnection() {
  const urlInput = document.getElementById('aiConfigServerUrl');
  const modelInput = document.getElementById('aiConfigModelName');
  const resultDiv = document.getElementById('aiConfigTestResult');
  const btn = document.getElementById('btnAiTestConn');

  const testUrl = urlInput ? urlInput.value.trim() : aiState.serverUrl;
  const testModel = modelInput ? modelInput.value.trim() : aiState.model;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block animate-spin mr-1">⏳</span> Conectando...';
  }

  if (resultDiv) {
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = 'block';
    resultDiv.className = 'p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300';
    resultDiv.innerHTML = 'Probando conexión con <code>' + testUrl + '</code>...';
  }

  try {
    const targetUrl = getAiApiEndpoint(testUrl, 'tags');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const models = data.models || [];
      const modelNames = models.map(m => m.name).join(', ') || 'OK';
      
      aiUpdateConnectionBadge(true);
      if (resultDiv) {
        resultDiv.className = 'p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 space-y-1';
        resultDiv.innerHTML = '<strong>✅ ¡Conexión exitosa!</strong><br><span class="text-[11px] text-slate-300">Servidor IA detectado y listo. Modelos disponibles: <b>' + (modelNames || testModel) + '</b></span>';
      }
      showToast('✅ ¡Conexión con servidor IA exitosa!', 'success');
    } else {
      throw new Error('Servidor respondió con código ' + res.status);
    }
  } catch (err) {
    aiUpdateConnectionBadge(false);
    if (resultDiv) {
      resultDiv.className = 'p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 space-y-1.5';
      resultDiv.innerHTML = '<strong>❌ No se pudo conectar al servidor IA</strong><br>' +
        '<span class="text-[11px] text-slate-300">Asegúrate de que tu PC esté encendido con Ollama activo. Si estás en iPad/iPhone por WiFi, usa: <code>http://192.168.1.10:11434</code> o <code>http://192.168.1.10:3000/api/ollama</code>.</span>';
    }
    showToast('No se pudo conectar al servidor IA', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> <span>Probar Conexión</span>';
      if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
    }
  }
}

function saveAiServerConfig() {
  const urlInput = document.getElementById('aiConfigServerUrl');
  const modelInput = document.getElementById('aiConfigModelName');

  if (urlInput) {
    const cleanUrl = urlInput.value.trim().replace(/\/+$/, '');
    aiState.serverUrl = cleanUrl;
    localStorage.setItem('ai_server_url', cleanUrl);
  }

  if (modelInput) {
    const cleanModel = modelInput.value.trim();
    aiState.model = cleanModel;
    localStorage.setItem('ai_model', cleanModel);
  }

  showToast('💾 Ajustes de servidor guardados con éxito', 'success');
  closeAiServerConfigModal();
  checkAiServerHealth();
}

// =============================================================================
// CONECTOR: ENVIAR EVALUACIÓN VIRAL AL CREADOR DE REEL CON IA
// =============================================================================

function sendViralEvaluationToAiStudio() {
  const titleInput = document.getElementById('viralIdeaTitle');
  const ideaTitle = titleInput ? titleInput.value.trim() : '';

  if (!ideaTitle) {
    showToast('Ingresa un título o idea primero en la calculadora.', 'warning');
    if (titleInput) titleInput.focus();
    return;
  }

  const selectedFormatRadio = document.querySelector('input[name="viralFormatoRadio"]:checked');
  const format = selectedFormatRadio ? selectedFormatRadio.value : 'Formato POV';

  // Set topic in AI Studio Wizard
  const wizardTopic = document.getElementById('aiWizardInputTopic');
  if (wizardTopic) {
    wizardTopic.value = ideaTitle;
  }

  // Switch to AI Studio view and wizard tab
  switchView('ai_studio');
  if (typeof switchAiTab === 'function') {
    switchAiTab('wizard');
  }

  showToast('🎬 ¡Idea cargada en el Creador de Reel (4 Pasos) con IA!', 'success');
}


async function checkAiServerHealth() {
  try {
    const targetUrl = getAiApiEndpoint(aiState.serverUrl, 'tags');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      aiUpdateConnectionBadge(true);
      return true;
    }
  } catch(e) {}
  aiUpdateConnectionBadge(false);
  return false;
}

async function aiCallOllama(prompt, systemInstruction = '', temperature = 0.7) {
  aiState.isGenerating = true;
  const targetUrl = getAiApiEndpoint(aiState.serverUrl, 'generate');

  const payload = {
    model: aiState.model,
    prompt: prompt,
    stream: false,
    options: {
      temperature: temperature
    }
  };
  if (systemInstruction) {
    payload.system = systemInstruction;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Servidor IA respondió con error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    aiUpdateConnectionBadge(true);
    return data.response;
  } catch (error) {
    aiUpdateConnectionBadge(false);
    throw error;
  } finally {
    aiState.isGenerating = false;
  }
}

function initAiStudio() {
  checkAiServerHealth();
  populateAiClientDropdowns();
  renderAiCatalog();
}

function populateAiClientDropdowns() {
  const clients = state.clients || ['Jennil'];
  const selects = ['wizClientSelect', 'aiToneClientSelect', 'aiCloneClientSelect'];
  
  selects.forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const currentVal = sel.value;
    sel.innerHTML = '';
    clients.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `👤 ${c}`;
      sel.appendChild(opt);
    });
    if (currentVal && clients.includes(currentVal)) {
      sel.value = currentVal;
    } else if (state.activeClient && state.activeClient !== 'ALL' && clients.includes(state.activeClient)) {
      sel.value = state.activeClient;
    }
  });
}

function switchAiTab(tabName) {
  aiState.activeTab = tabName;
  const tabs = ['wizard', 'audit', 'catalog', 'brain'];
  
  tabs.forEach(t => {
    const panel = document.getElementById('aiPanel' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = document.getElementById('aiTabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    
    if (panel) {
      if (t === tabName) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }

    if (btn) {
      if (t === tabName) {
        btn.className = 'flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md cursor-pointer';
      } else {
        btn.className = 'flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition text-slate-400 hover:text-white cursor-pointer';
      }
    }
  });

  if (tabName === 'catalog') {
    renderAiCatalog();
  } else if (tabName === 'brain') {
    renderBrainStudio();
  }
}


// -------------------------------------------------------
// 6. CLONADOR & MODELADOR VIRAL POR LINK (INGENIERÍA INVERSA)
// -------------------------------------------------------
let aiCloneGeneratedScriptsCache = [];

async function runAiCloneViralVideo() {
  const url = document.getElementById('aiCloneInputUrl')?.value?.trim();
  const desc = document.getElementById('aiCloneInputDesc')?.value?.trim();
  const subNiche = document.getElementById('aiCloneSubNicheSelect')?.value || 'ALL_VARIED';
  const count = parseInt(document.getElementById('aiCloneCountSelect')?.value || '4', 10);
  const client = document.getElementById('aiCloneClientSelect')?.value || 'Jennil';
  
  const btn = document.getElementById('btnAiRunClone');
  const timerBadge = document.getElementById('aiCloneTimerBadge');
  const analysisCard = document.getElementById('aiCloneAnalysisCard');
  const analysisContent = document.getElementById('aiCloneAnalysisContent');
  const scriptsContainer = document.getElementById('aiCloneScriptsContainer');

  if (!url && !desc) {
    alert('Por favor ingresa al menos un enlace de Reel/TikTok o una breve descripción del video que deseas modelar.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Qwen 2.5 deconstruyendo video y redactando guiones...</span>';
  }
  if (timerBadge) timerBadge.textContent = '⏳ Analizando en GPU RTX...';

  const startTime = Date.now();

  const systemPrompt = `Eres el Director Estratégico de Contenido y Guionista Principal de BLEX STUDIO.
Tu especialidad es la INGENIERÍA INVERSA VIRAL: tomas un video exitoso de redes sociales (Instagram, TikTok, YouTube Shorts), analizas por qué se volvió viral y trasladas su misma fórmula psicológica, gancho y cadencia al nicho de DINERO, FINANZAS Y DESARROLLO PERSONAL para el creador "${client}".

BASE DE CONOCIMIENTO MAESTRA DE DINERO & DESARROLLO PERSONAL:
${BLEX_MONEY_PERSONAL_DEV_KNOWLEDGE}

MATRIZ DE VIRALIDAD (14.5 PUNTOS):
${BLEX_VIRAL_CALCULATOR_KNOWLEDGE}

OBJETIVO:
1. Realiza una breve RADIOGRAFÍA VIRAL del video de referencia (Tipo de Gancho utilizado del catálogo de 64, Gatillo psicológico y Por qué retiene).
2. Genera exactamente ${count} GUIONES COMPLETOS Y DIFERENTES adaptados al nicho de DINERO & DESARROLLO PERSONAL (Sub-enfoque: ${subNiche}).
Cada guion debe estructurarse en 4 secciones obligatorias:
- GANCHO (0-3s): Magnético, directo, aplicando la fórmula viral.
- HISTORIA / CONTEXTO (3-30s): Lenguaje simple (entendible por un niño de 5 años), dinámico y de interés masivo (50 de 100 personas).
- MORALEJA (30-40s): La pepita de oro o aprendizaje sintetizado.
- CTA (40-50s): Llamado a la acción específico pidiendo comentar una palabra clave (ej: "Comenta DINERO...", "Escribe HABITOS...").

FORMATO OBLIGATORIO DE RESPUESTA:
[RADIOGRAFIA]
• Fórmula de Gancho: [Nombre del gancho usado en el original]
• Gatillo Psicológico: [Curiosidad, Controversia, Dolor/Error, etc.]
• Por qué funciona: [Explicación de 1 o 2 líneas]

[GUION 1: Sub-enfoque 1 (ej: Mentalidad & Psicología del Dinero)]
[GANCHO]:
[HISTORIA]:
[MORALEJA]:
[CTA]:

[GUION 2: Sub-enfoque 2 (ej: Errores Financieros & Fugas de Capital)]
[GANCHO]:
[HISTORIA]:
[MORALEJA]:
[CTA]:

[GUION 3: Sub-enfoque 3 (ej: Disciplina, Hábitos & Alto Rendimiento)]
[GANCHO]:
[HISTORIA]:
[MORALEJA]:
[CTA]:

[GUION 4: Sub-enfoque 4 (ej: Creación de Riqueza & Habilidades de Alto Valor)]
[GANCHO]:
[HISTORIA]:
[MORALEJA]:
[CTA]:` + (count === 5 ? `\n\n[GUION 5: Sub-enfoque 5 (ej: Contraintuitivo / Rompiendo Mitos)]\n[GANCHO]:\n[HISTORIA]:\n[MORALEJA]:\n[CTA]:` : '');

  const userPrompt = `Video de referencia:
URL: ${url || 'No especificada'}
Descripción o contenido del video original: ${desc || 'Modelar la estructura y ángulo de éxito para el nicho de dinero y superación personal'}`;

  try {
    const response = await aiCallOllama(userPrompt, systemPrompt, 0.72);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    if (timerBadge) timerBadge.textContent = `⚡ Generado en ${duration}s`;

    // Extract Radiografia
    const radioMatch = response.match(/\[RADIOGRAFIA\]([\s\S]*?)(?=\[GUION 1|$)/i);
    if (radioMatch && analysisCard && analysisContent) {
      analysisContent.innerHTML = radioMatch[1].trim().replace(/\n/g, '<br>');
      analysisCard.classList.remove('hidden');
    }

    // Extract Scripts
    aiCloneGeneratedScriptsCache = [];
    const scriptBlocks = response.split(/\[GUION\s*(\d+):?\s*([^\]]*)\]/i);
    
    // Parse the matched blocks
    for (let i = 1; i < scriptBlocks.length; i += 3) {
      const num = scriptBlocks[i];
      const title = scriptBlocks[i + 1] ? scriptBlocks[i + 1].trim() : `Guión ${num}`;
      const body = scriptBlocks[i + 2] || '';

      const ganchoMatch = body.match(/\[GANCHO\]:?([\s\S]*?)(?=\[HISTORIA\]|$)/i);
      const historiaMatch = body.match(/\[HISTORIA\]:?([\s\S]*?)(?=\[MORALEJA\]|$)/i);
      const moralejaMatch = body.match(/\[MORALEJA\]:?([\s\S]*?)(?=\[CTA\]|$)/i);
      const ctaMatch = body.match(/\[CTA\]:?([\s\S]*?)$/i);

      aiCloneGeneratedScriptsCache.push({
        number: parseInt(num, 10) || (aiCloneGeneratedScriptsCache.length + 1),
        title: title || `Guión ${aiCloneGeneratedScriptsCache.length + 1}`,
        gancho: ganchoMatch ? ganchoMatch[1].trim() : '',
        historia: historiaMatch ? historiaMatch[1].trim() : '',
        moraleja: moralejaMatch ? moralejaMatch[1].trim() : '',
        cta: ctaMatch ? ctaMatch[1].trim() : '',
        client: client
      });
    }

    // Render cards
    renderAiCloneScripts(scriptsContainer);
    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    alert('Error al clonar video con IA: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>Desglosar Video y Crear Guiones de Nicho</span>';
    }
  }
}

function renderAiCloneScripts(container) {
  if (!container) return;
  container.innerHTML = '';

  if (aiCloneGeneratedScriptsCache.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
        No se pudieron estructurar los guiones. Intenta de nuevo.
      </div>
    `;
    return;
  }

  aiCloneGeneratedScriptsCache.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 hover:border-fuchsia-500/50 rounded-2xl p-5 shadow-xl space-y-4 transition group';
    
    card.innerHTML = `
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
            ${s.number || idx + 1}
          </span>
          <h4 class="font-bold text-white text-xs sm:text-sm">${escapeHtml(s.title)}</h4>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button type="button" onclick="sendCloneScriptToTeleprompter(${idx})" class="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer" title="Cargar este guión en el Teleprónter Pro para iPad">
            <i data-lucide="tv" class="w-3.5 h-3.5"></i>
            <span>Teleprónter Pro</span>
          </button>
          <button type="button" onclick="saveCloneScriptToMatrix(${idx})" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer" title="Guardar en Matriz de Guiones">
            <i data-lucide="save" class="w-3.5 h-3.5 text-brand-400"></i>
            <span class="hidden sm:inline">Guardar en</span> Matriz
          </button>
          <button type="button" onclick="copyCloneScript(${idx})" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs p-1.5 rounded-lg border border-slate-700 transition cursor-pointer" title="Copiar guión completo">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>

      <!-- 4 Structured Boxes -->
      <div class="space-y-3 text-xs">
        <!-- Hook -->
        <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            <span>🎣 1. Gancho (0-3s)</span>
            <span class="text-[10px] text-slate-400 lowercase">alta retención</span>
          </div>
          <p class="text-slate-100 font-medium leading-relaxed">${escapeHtml(s.gancho)}</p>
        </div>

        <!-- Story / Context -->
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-sky-400 uppercase tracking-wider">
            <span>📖 2. Historia / Desarrollo (3-30s)</span>
            <span class="text-[10px] text-slate-400 lowercase">sin relleno</span>
          </div>
          <p class="text-slate-200 leading-relaxed whitespace-pre-wrap">${escapeHtml(s.historia)}</p>
        </div>

        <!-- Moral -->
        <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            <span>💡 3. Moraleja / Valor (30-40s)</span>
            <span class="text-[10px] text-slate-400 lowercase">la pepita de oro</span>
          </div>
          <p class="text-slate-100 font-medium leading-relaxed">${escapeHtml(s.moraleja)}</p>
        </div>

        <!-- CTA -->
        <div class="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-purple-400 uppercase tracking-wider">
            <span>📣 4. CTA / Llamado a la Acción (40-50s)</span>
            <span class="text-[10px] text-slate-400 lowercase">generador de comentarios</span>
          </div>
          <p class="text-slate-100 font-semibold leading-relaxed">${escapeHtml(s.cta)}</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function sendCloneScriptToTeleprompter(index) {
  const s = aiCloneGeneratedScriptsCache[index];
  if (!s) return;

  if (typeof tpState !== 'undefined') {
    tpState.mode = 'reel';
    tpState.activeReelSlot = 1;
    tpState.activeReelSection = 'all';
    tpState.reelScripts[1] = {
      title: s.title.substring(0, 25),
      gancho: s.gancho,
      historia: s.historia,
      moraleja: s.moraleja,
      cta: s.cta
    };
    if (typeof tpSaveScriptsToStorage === 'function') tpSaveScriptsToStorage();
    if (typeof tpUpdateToolbarSelectors === 'function') tpUpdateToolbarSelectors();
    if (typeof tpGetActiveDisplayScript === 'function') tpState.scriptText = tpGetActiveDisplayScript();
    if (typeof tpRenderScript === 'function') tpRenderScript();
    if (typeof tpResetToTop === 'function') tpResetToTop();
  }

  switchView('teleprompter_pro');
  alert(`✅ Guión "${s.title}" cargado en el Teleprónter Pro para iPad.`);
}

function saveCloneScriptToMatrix(index) {
  const s = aiCloneGeneratedScriptsCache[index];
  if (!s) return;

  const nextNumber = state.scripts.length > 0 ? Math.max(...state.scripts.map(sc => sc.number || 0)) + 1 : 1;
  const newScript = {
    id: generateId(),
    number: nextNumber,
    client: s.client || 'Jennil',
    ideaGanadora: s.title.substring(0, 80),
    gancho: s.gancho,
    historia: s.historia,
    moraleja: s.moraleja,
    cta: s.cta,
    actor: s.client || 'Jennil',
    status: 'Idea',
    createdAt: new Date().toISOString()
  };

  state.scripts.unshift(newScript);
  saveScripts();
  renderMatrix();
  renderCards();
  alert(`✅ Guión #${nextNumber} ("${s.title}") guardado en la Matriz de Guiones.`);
}

function copyCloneScript(index) {
  const s = aiCloneGeneratedScriptsCache[index];
  if (!s) return;

  const full = [
    `🎬 TÍTULO: ${s.title}`,
    `🎣 GANCHO (0-3s):\n${s.gancho}`,
    `📖 HISTORIA / DESARROLLO:\n${s.historia}`,
    `💡 MORALEJA:\n${s.moraleja}`,
    `📣 CTA:\n${s.cta}`
  ].join('\n\n');

  navigator.clipboard.writeText(full);
  alert('✅ Guión copiado al portapapeles.');
}

// -------------------------------------------------------

async function callOllama(prompt, temperature = 0.7) {
  return await aiCallOllama(prompt, '', temperature);
}

// =============================================================================
// BLEX AI STUDIO - CREADOR DE REEL INTERACTIVO EN 4 PASOS + DIAGNÓSTICO ESTRATÉGICO
// =============================================================================

let wizardState = {
  currentStep: 0,
  link: '',
  niche: '💰 Riqueza, Mentalidad & Psicología del Dinero',
  customNiche: '',
  topic: '',
  strategy: null,
  selectedAngle: '',
  userIntent: '',
  selectedHook: '',
  selectedStory: '',
  selectedMoral: '',
  selectedCTA: '',
  generatedHooks: [],
  generatedStories: [],
  generatedMorals: [],
  generatedCTAs: []
};

function toggleWizardCustomNiche(val) {
  const container = document.getElementById('aiWizardCustomNicheContainer');
  const input = document.getElementById('aiWizardCustomNicheInput');
  if (val === 'CUSTOM') {
    if (container) container.classList.remove('hidden');
    if (input) input.focus();
  } else {
    if (container) container.classList.add('hidden');
  }
}

function getEffectiveNiche() {
  const select = document.getElementById('aiWizardNicheArea');
  const customInput = document.getElementById('aiWizardCustomNicheInput');
  const val = select ? select.value : '💰 Riqueza, Mentalidad & Psicología del Dinero';
  if (val === 'CUSTOM') {
    return (customInput && customInput.value.trim()) ? customInput.value.trim() : 'Dinero, Estrategia & Crecimiento Personal';
  }
  return val;
}

function resetWizard() {
  wizardState = {
    currentStep: 0,
    link: '',
    niche: '💰 Riqueza, Mentalidad & Psicología del Dinero',
    customNiche: '',
    topic: '',
    strategy: null,
    selectedAngle: '',
    userIntent: '',
    selectedHook: '',
    selectedStory: '',
    selectedMoral: '',
    selectedCTA: '',
    generatedHooks: [],
    generatedStories: [],
    generatedMorals: [],
    generatedCTAs: []
  };

  const elLink = document.getElementById('aiWizardInputLink');
  const elTopic = document.getElementById('aiWizardInputTopic');
  const elHook = document.getElementById('wizSelectedGancho');
  const elStory = document.getElementById('wizSelectedHistoria');
  const elMoral = document.getElementById('wizSelectedMoraleja');
  const elCTA = document.getElementById('wizSelectedCTA');
  const elIntent = document.getElementById('wizStrategyUserIntent');
  const elStrat = document.getElementById('wizStrategyCardContainer');
  const elGrid1 = document.getElementById('wizCardsGrid1');

  if (elLink) elLink.value = '';
  if (elTopic) elTopic.value = '';
  if (elHook) elHook.value = '';
  if (elStory) elStory.value = '';
  if (elMoral) elMoral.value = '';
  if (elCTA) elCTA.value = '';
  if (elIntent) elIntent.value = '';
  
  if (elStrat) {
    elStrat.innerHTML = '<div class="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2"><i data-lucide="sparkles" class="w-8 h-8 mx-auto text-purple-400/50"></i><p class="text-xs text-slate-400">Ingresa tu idea o link arriba y pulsa <b>Crear con IA</b> para que la IA realice el diagnóstico estratégico previo.</p></div>';
  }

  if (elGrid1) {
    elGrid1.innerHTML = '';
  }

  goToWizardStep(0);
}

function goToWizardStep(stepNum) {
  wizardState.currentStep = stepNum;

  // Update stepper buttons 0 through 5
  for (let i = 0; i <= 5; i++) {
    const pill = document.getElementById('wizStepPill' + i);
    const view = document.getElementById('wizStepView' + i);

    if (pill) {
      if (i === stepNum) {
        pill.className = 'flex-1 min-w-[125px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md cursor-pointer';
        const sp = pill.querySelector('span:first-child');
        if (sp) sp.className = 'w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]';
      } else if (i < stepNum) {
        pill.className = 'flex-1 min-w-[125px] px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 cursor-pointer';
        const sp = pill.querySelector('span:first-child');
        if (sp) sp.className = 'w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]';
      } else {
        pill.className = 'flex-1 min-w-[125px] px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white bg-slate-900/50 cursor-pointer';
        const sp = pill.querySelector('span:first-child');
        if (sp) sp.className = 'w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]';
      }
    }

    if (view) {
      if (i === stepNum) view.classList.remove('hidden');
      else view.classList.add('hidden');
    }
  }

  // If jumping to step 5, sync values
  if (stepNum === 5) {
    const finalHook = document.getElementById('wizFinalHook');
    const finalStory = document.getElementById('wizFinalStory');
    const finalMoral = document.getElementById('wizFinalMoral');
    const finalCTA = document.getElementById('wizFinalCTA');

    if (finalHook) finalHook.value = wizardState.selectedHook || (document.getElementById('wizSelectedGancho') ? document.getElementById('wizSelectedGancho').value : '');
    if (finalStory) finalStory.value = wizardState.selectedStory || (document.getElementById('wizSelectedHistoria') ? document.getElementById('wizSelectedHistoria').value : '');
    if (finalMoral) finalMoral.value = wizardState.selectedMoral || (document.getElementById('wizSelectedMoraleja') ? document.getElementById('wizSelectedMoraleja').value : '');
    if (finalCTA) finalCTA.value = wizardState.selectedCTA || (document.getElementById('wizSelectedCTA') ? document.getElementById('wizSelectedCTA').value : '');
  }

  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}


// Helper to inspect links on the fly
let linkDebounceTimer = null;
async function handleWizardLinkInput(url) {
  clearTimeout(linkDebounceTimer);
  const badge = document.getElementById('aiWizardLinkBadge');
  const topicInput = document.getElementById('aiWizardInputTopic');

  const trimmed = (url || '').trim();
  if (!trimmed || !trimmed.startsWith('http')) {
    if (badge) badge.classList.add('hidden');
    return;
  }

  if (badge) {
    badge.className = 'text-[10px] text-amber-400 flex items-center gap-1';
    badge.innerHTML = '<span class="inline-block animate-spin w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full"></span> Inspeccionando link...';
    badge.classList.remove('hidden');
  }

  linkDebounceTimer = setTimeout(async () => {
    try {
      const res = await fetch('/api/extract-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.title) {
          if (badge) {
            badge.className = 'text-[10px] text-emerald-400 font-bold flex items-center gap-1';
            badge.innerHTML = '✓ Video detectado (' + data.platform + ')';
            badge.classList.remove('hidden');
          }
          if (topicInput && !topicInput.value.trim()) {
            topicInput.value = data.title;
          }
        } else if (data.requiresManualText) {
          if (badge) {
            badge.className = 'text-[10px] text-sky-400 flex items-center gap-1';
            badge.innerHTML = 'ℹ️ Escribe abajo brevemente de qué habla el video';
            badge.classList.remove('hidden');
          }
        } else {
          if (badge) badge.classList.add('hidden');
        }
      }
    } catch (e) {
      if (badge) badge.classList.add('hidden');
    }
  }, 600);
}



function getCleanCoreTheme(text) {
  if (!text) return 'el éxito y las finanzas';
  const clean = text.replace(/[\r\n]+/g, ' ').replace(/["']/g, '').trim();
  const words = clean.split(/\s+/);
  if (words.length <= 6) return clean;
  return words.slice(0, 6).join(' ');
}


// =============================================================================
// AUDITOR DE VIRALIDAD CON IA (ANÁLISIS DE RETENCIÓN, TEST 5 AÑOS Y SCORE)
// =============================================================================

function sendWizardToAudit() {
  const hook = (document.getElementById('wizFinalHook') ? document.getElementById('wizFinalHook').value.trim() : '') || wizardState.selectedHook;
  const story = (document.getElementById('wizFinalStory') ? document.getElementById('wizFinalStory').value.trim() : '') || wizardState.selectedStory;
  const moral = (document.getElementById('wizFinalMoral') ? document.getElementById('wizFinalMoral').value.trim() : '') || wizardState.selectedMoral;
  const cta = (document.getElementById('wizFinalCTA') ? document.getElementById('wizFinalCTA').value.trim() : '') || wizardState.selectedCTA;

  if (!hook && !story) {
    showToast('El guión está vacío.', 'warning');
    return;
  }

  const fullScript = '[🎣 GANCHO (0-3s)]\n' + hook + '\n\n[📖 HISTORIA (3-30s)]\n' + story + '\n\n[💡 MORALEJA (30-40s)]\n' + moral + '\n\n[📣 CTA (40-50s)]\n' + cta;

  // Switch to audit tab
  switchAiTab('audit');

  // Fill audit textarea
  const auditInput = document.getElementById('aiAuditInputText');
  if (auditInput) {
    auditInput.value = fullScript;
  }

  // Automatically run audit
  runAiAuditViral();
  showToast('🔥 Analizando potencial viral de tu guión...', 'info');
}

function loadCurrentScriptIntoAudit() {
  const auditInput = document.getElementById('aiAuditInputText');
  if (!auditInput) return;

  const hook = wizardState.selectedHook || (document.getElementById('wizFinalHook') ? document.getElementById('wizFinalHook').value.trim() : '');
  const story = wizardState.selectedStory || (document.getElementById('wizFinalStory') ? document.getElementById('wizFinalStory').value.trim() : '');
  const moral = wizardState.selectedMoral || (document.getElementById('wizFinalMoral') ? document.getElementById('wizFinalMoral').value.trim() : '');
  const cta = wizardState.selectedCTA || (document.getElementById('wizFinalCTA') ? document.getElementById('wizFinalCTA').value.trim() : '');

  if (hook || story) {
    auditInput.value = '[🎣 GANCHO (0-3s)]\n' + hook + '\n\n[📖 HISTORIA (3-30s)]\n' + story + '\n\n[💡 MORALEJA (30-40s)]\n' + moral + '\n\n[📣 CTA (40-50s)]\n' + cta;
    showToast('Guión activo cargado.', 'success');
  } else if (state.scripts && state.scripts.length > 0) {
    const s = state.scripts[0];
    auditInput.value = '[🎣 GANCHO (0-3s)]\n' + (s.gancho || '') + '\n\n[📖 HISTORIA (3-30s)]\n' + (s.historia || '') + '\n\n[💡 MORALEJA (30-40s)]\n' + (s.moraleja || '') + '\n\n[📣 CTA (40-50s)]\n' + (s.cta || '');
    showToast('Último guión de la Matriz cargado.', 'success');
  } else {
    showToast('No hay guiones activos para cargar.', 'info');
  }
}

async function runAiAuditViral() {
  const textInput = document.getElementById('aiAuditInputText');
  const container = document.getElementById('aiAuditResultsContainer');
  const scriptText = textInput ? textInput.value.trim() : '';

  if (!scriptText) {
    showToast('Por favor escribe o carga un guión para auditar.', 'warning');
    if (textInput) textInput.focus();
    return;
  }

  if (container) {
    container.innerHTML = '<div class="p-10 text-center text-slate-400 space-y-4 bg-slate-950/60 rounded-2xl border border-slate-800">' +
      '<div class="inline-block animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>' +
      '<p class="text-base font-bold text-white">Auditando potencial viral con IA...</p>' +
      '<p class="text-xs text-slate-400">Evaluando los 6 Criterios de Viralidad (10.0 pts máx), formato de retención (+4.5 pts) y tiempos de retención (0-3s, 3-30s, 30-40s, 40-50s).</p>' +
    '</div>';
  }

  const prompt = [
    'Actúa como el auditor de viralidad y director de retención #1 en Instagram Reels y TikTok.',
    '',
    'GUIÓN O IDEA A AUDITAR:',
    scriptText,
    '',
    'OBJETIVO:',
    'Audita este guión evaluando minuciosamente los 6 CRITERIOS DE VIRALIDAD y recomendando el FORMATO DE PRODUCCIÓN más efectivo.',
    '',
    'CRITERIOS DE VIRALIDAD (Evalúa cada uno como true o false con criterio profesional):',
    '1. "nino": (¿Entiende niño de 5 años? +2.5 pts) - Lenguaje ultra claro, directo, sin tecnicismos que confundan.',
    '2. "cincuenta": (¿Interesa a 50 de 100 personas? +2.5 pts) - Tema masivo, amplio y de interés universal.',
    '3. "refViral": (¿Tiene referencia viral previa o patrón validado? +2.0 pts) - Concepto/gancho probado.',
    '4. "tendencia": (¿Conecta con tendencia actual, coyuntura o fecha? +1.5 pts) - Relevancia temporal.',
    '5. "controversia": (¿Genera debate o posturas divididas sanas? +1.0 pts) - Incita a comentar.',
    '6. "mercadoViral": (¿Mercado viral/consumo masivo en Reels/Shorts? +0.5 pts) - Alto volumen de consumo.',
    '',
    'FORMATO DE PRODUCCIÓN RECOMENDADO:',
    'Elige exactamente uno de estos valores:',
    '"Formato POV" (+4.5 pts), "Formato Vlog" (+4.0 pts), "Formato Dinámico" (+3.5 pts), "Formato prima pregunta" (+3.5 pts), "Formato entrevista" (+3.0 pts), "Formato mirando a la nada" (+2.5 pts), "Formato pantalla dividida" (+2.5 pts), "Formato pantalla verde" (+2.0 pts), "Formato selfie" (+1.5 pts), "Hablando a cámara" (+1.0 pts).',
    '',
    'DIAGNÓSTICO DETALLADO:',
    '- "fiveYearOldTest": Análisis de simplicidad y claridad (Test del Niño de 5 Años).',
    '- "hookAnalysis": Diagnóstico del Gancho (0-3s) - ¿Detiene el scroll o genera fricción?',
    '- "storyAnalysis": Diagnóstico de la Historia (3-30s) - ¿Mantiene el ritmo o hay caídas de atención?',
    '- "moralAnalysis": Diagnóstico de la Moraleja (30-40s) - ¿El valor es memorable y dan ganas de guardarlo?',
    '- "ctaAnalysis": Diagnóstico del CTA (40-50s) - ¿Es claro y fácil de responder?',
    '- "suggestions": Lista de 2-3 sugerencias concretas de optimización.',
    '- "optimizedVersion": El guión completo pulido y estructurado en los 4 pasos.',
    '',
    'Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:',
    '{',
    '  "criteria": {',
    '    "nino": true,',
    '    "cincuenta": true,',
    '    "refViral": true,',
    '    "tendencia": true,',
    '    "controversia": false,',
    '    "mercadoViral": true',
    '  },',
    '  "recommendedFormat": "Formato POV",',
    '  "fiveYearOldTest": "Lenguaje ultra claro, directo y con conceptos cotidianos que cualquier persona comprende al instante.",',
    '  "hookAnalysis": "El gancho crea una brecha de curiosidad instantánea en los primeros 3 segundos.",',
    '  "storyAnalysis": "Estructura ágil en 4 puntos sin relleno que mantiene la retención alta del segundo 3 al 30.",',
    '  "moralAnalysis": "Aporta un insight valioso y memorable que motiva al espectador a guardar el video.",',
    '  "ctaAnalysis": "Llamada a la acción con palabra clave directa y baja fricción para disparar comentarios.",',
    '  "suggestions": ["Mantener tono seguro y pausado al inicio.", "Hacer un corte visual en cada punto de la historia."],',
    '  "optimizedVersion": "' + scriptText.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"',
    '}'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.6);
    let parsed = null;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}

    if (parsed && (parsed.criteria || parsed.score)) {
      renderAiAuditResults(parsed, scriptText);
    } else {
      renderAiAuditResults(getFallbackAudit(scriptText), scriptText);
    }
  } catch (err) {
    console.warn('Audit error, using fallback:', err);
    renderAiAuditResults(getFallbackAudit(scriptText), scriptText);
  }
}

function renderAiAuditResults(data, originalScript) {
  const container = document.getElementById('aiAuditResultsContainer');
  if (!container) return;

  // Criteria defaults from AI
  const crit = data.criteria || {
    nino: true,
    cincuenta: true,
    refViral: true,
    tendencia: true,
    controversia: false,
    mercadoViral: true
  };

  const recommendedFmt = data.recommendedFormat || 'Formato POV';

  let html = '<div class="space-y-4">';

  // 1. Live Score & Verdict Header Banner
  html += '<div id="aiAuditHeaderCard" class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">' +
    '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
      '<div class="flex items-center gap-3.5">' +
        '<div class="min-w-[84px] px-3 py-2 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col items-center justify-center shadow-inner shrink-0">' +
          '<div class="flex items-baseline justify-center gap-1 leading-none">' +
            '<span id="aiAuditTotalScoreDisplay" class="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">11.5</span>' +
            '<span class="text-xs text-slate-400 font-extrabold">/14.5</span>' +
          '</div>' +
          '<span class="text-[9px] text-amber-400/90 uppercase font-black tracking-wider mt-0.5">PUNTOS</span>' +
        '</div>' +
        '<div>' +
          '<div class="flex items-center gap-2 mb-0.5">' +
            '<span class="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Modelo 14.5 Puntos</span>' +
            '<span id="aiAuditPercentBadge" class="text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">79%</span>' +
          '</div>' +
          '<h4 id="aiAuditVerdictTitle" class="text-base font-black text-white flex items-center gap-2">🟢 Potencial Muy Alto / Viral</h4>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center gap-2 flex-wrap">' +
        '<button type="button" onclick="saveAuditedScriptToMatrix()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer">' +
          '<i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>' +
          '<span>📥 Guardar en Matriz</span>' +
        '</button>' +
        '<button type="button" onclick="sendAuditedScriptToTeleprompter()" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer">' +
          '<i data-lucide="tv" class="w-3.5 h-3.5"></i>' +
          '<span>📺 Teleprónter</span>' +
        '</button>' +
        '<button type="button" onclick="sendAuditToViralCalc()" class="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer" title="Cargar esta evaluación en la Calculadora de Viralidad completa">' +
          '<i data-lucide="calculator" class="w-3.5 h-3.5"></i>' +
          '<span>Calculadora</span>' +
        '</button>' +
      '</div>' +
    '</div>' +

    '<!-- Breakdown Pills & Progress Bar -->' +
    '<div class="space-y-2 pt-1 border-t border-slate-800/80">' +
      '<div class="flex flex-wrap items-center justify-between text-xs font-semibold gap-2">' +
        '<div class="flex items-center gap-3">' +
          '<span class="text-slate-400">🎯 Criterios: <strong id="aiAuditCriteriaScore" class="text-amber-300 font-bold">7.0 / 10.0 pts</strong></span>' +
          '<span class="text-slate-400">📹 Formato: <strong id="aiAuditFormatScore" class="text-emerald-300 font-bold">4.5 / 4.5 pts</strong></span>' +
        '</div>' +
        '<span id="aiAuditVerdictDesc" class="text-[11px] text-slate-400">Modifica las casillas abajo para recalcular en tiempo real.</span>' +
      '</div>' +
      '<div class="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">' +
        '<div id="aiAuditProgressBar" class="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style="width: 79%"></div>' +
      '</div>' +
    '</div>' +
  '</div>';

  // 2. Interactive Viral Criteria Checklist (Auto-filled by AI & User-editable)
  html += '<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3">' +
    '<div class="flex items-center justify-between border-b border-slate-800 pb-2">' +
      '<div>' +
        '<h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">' +
          '<span>🎯</span> 1. Criterios de Viralidad Evaluados por la IA' +
        '</h4>' +
        '<p class="text-[11px] text-slate-400 mt-0.5">La IA los autorrellenó según el guión. Puedes marcar o desmarcar cualquier casilla y la puntuación se recalcula automáticamente.</p>' +
      '</div>' +
      '<span class="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">Máx 10.0 pts</span>' +
    '</div>' +

    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">' +

      '<!-- 1. Niño de 5 años (+2.5 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCritNino" onchange="recalculateAiAuditScore()" ' + (crit.nino ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Entiende niño de 5 años?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+2.5 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Claridad extrema, mensaje intuitivo, cero tecnicismos confusos.</p>' +
        '</div>' +
      '</label>' +

      '<!-- 2. 50 de 100 (+2.5 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCrit50de100" onchange="recalculateAiAuditScore()" ' + (crit.cincuenta ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Interesa a 50 de 100?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+2.5 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Mercado amplio, masivo y de interés universal.</p>' +
        '</div>' +
      '</label>' +

      '<!-- 3. Referencia viral previa (+2.0 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCritRefViral" onchange="recalculateAiAuditScore()" ' + (crit.refViral ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Referencia viral previa?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+2.0 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Gancho/concepto validado previamente con millones de views.</p>' +
        '</div>' +
      '</label>' +

      '<!-- 4. Tendencia o coyuntura (+1.5 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCritTendencia" onchange="recalculateAiAuditScore()" ' + (crit.tendencia ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Tendencia o coyuntura?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+1.5 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Fechas específicas, noticias o audios y formatos en auge.</p>' +
        '</div>' +
      '</label>' +

      '<!-- 5. Controversia o debate (+1.0 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCritControversia" onchange="recalculateAiAuditScore()" ' + (crit.controversia ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Controversia o debate?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+1.0 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Polariza posturas sanas e incita a comentar y debatir.</p>' +
        '</div>' +
      '</label>' +

      '<!-- 6. Mercado viral / consumo (+0.5 pts) -->' +
      '<label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none group">' +
        '<input type="checkbox" id="auditCritMercadoViral" onchange="recalculateAiAuditScore()" ' + (crit.mercadoViral ? 'checked' : '') + ' class="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="text-xs font-bold text-white group-hover:text-amber-300 transition">¿Mercado viral/consumo?</span>' +
            '<span class="text-[10px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0">+0.5 pts</span>' +
          '</div>' +
          '<p class="text-[10px] text-slate-400 mt-0.5 leading-tight">Alto volumen de consumo habitual en Reels/TikTok/Shorts.</p>' +
        '</div>' +
      '</label>' +

    '</div>' +
  '</div>';

  // 3. Recommended Production Format (Interactive dropdown/selector)
  html += '<div class="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3">' +
    '<div class="flex items-center justify-between border-b border-slate-800 pb-2">' +
      '<div>' +
        '<h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">' +
          '<span>📹</span> 2. Formato de Producción Recomendado' +
        '</h4>' +
        '<p class="text-[11px] text-slate-400 mt-0.5">El formato determina el multiplicador de retención y la inmersión del video.</p>' +
      '</div>' +
      '<span class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">Hasta +4.5 pts</span>' +
    '</div>' +

    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">' +
      '<div>' +
        '<label class="block text-xs font-semibold text-slate-300 mb-1">Formato de Grabación Elegido:</label>' +
        '<select id="aiAuditFormatSelect" onchange="recalculateAiAuditScore()" class="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-semibold outline-none cursor-pointer">' +
          '<optgroup label="🎬 Grupo 1: Alta Retención e Inmersión Total (3.5 – 4.5 pts)">' +
            '<option value="Formato POV"' + (recommendedFmt === 'Formato POV' ? ' selected' : '') + '>Formato POV (+4.5 pts) — Inmersión 1ª persona</option>' +
            '<option value="Formato Vlog"' + (recommendedFmt === 'Formato Vlog' ? ' selected' : '') + '>Formato Vlog (+4.0 pts) — Cambios de plano constantes</option>' +
            '<option value="Formato Dinámico"' + (recommendedFmt === 'Formato Dinámico' ? ' selected' : '') + '>Formato Dinámico (+3.5 pts) — Movimiento y b-rolls ágiles</option>' +
          '</optgroup>' +
          '<optgroup label="👥 Grupo 2: Curiosidad Social y Efecto Testigo (2.5 – 3.5 pts)">' +
            '<option value="Formato prima pregunta"' + (recommendedFmt === 'Formato prima pregunta' ? ' selected' : '') + '>Formato Prima Pregunta (+3.5 pts) — Intriga segundo 0</option>' +
            '<option value="Formato entrevista"' + (recommendedFmt === 'Formato entrevista' ? ' selected' : '') + '>Formato Entrevista (+3.0 pts) — Dinámica 2 personas</option>' +
            '<option value="Formato mirando a la nada"' + (recommendedFmt === 'Formato mirando a la nada' ? ' selected' : '') + '>Formato Mirando a la Nada (+2.5 pts) — Voz en off reflexiva</option>' +
          '</optgroup>' +
          '<optgroup label="📺 Grupo 3: Demostración Visual (2.0 – 2.5 pts)">' +
            '<option value="Formato pantalla dividida"' + (recommendedFmt === 'Formato pantalla dividida' ? ' selected' : '') + '>Pantalla Dividida (+2.5 pts) — Reacción o antes/después</option>' +
            '<option value="Formato pantalla verde"' + (recommendedFmt === 'Formato pantalla verde' ? ' selected' : '') + '>Pantalla Verde (+2.0 pts) — Comentario sobre captura</option>' +
          '</optgroup>' +
          '<optgroup label="🗣️ Grupo 4: Exposición Frontal (1.0 – 1.5 pts)">' +
            '<option value="Formato selfie"' + (recommendedFmt === 'Formato selfie' ? ' selected' : '') + '>Formato Selfie (+1.5 pts) — Casual y directo</option>' +
            '<option value="Hablando a cámara"' + (recommendedFmt === 'Hablando a cámara' ? ' selected' : '') + '>Hablando a Cámara (+1.0 pts) — Talking head estático</option>' +
          '</optgroup>' +
        '</select>' +
      '</div>' +
      '<div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">' +
        '<span class="text-[11px] font-bold text-slate-300">💡 Tip de Producción:</span>' +
        '<p class="text-[11px] text-slate-400 leading-tight">Los formatos POV y Vlog suben la tasa de retención un +40% frente al plano fijo hablando a cámara.</p>' +
      '</div>' +
    '</div>' +
  '</div>';

  // 4. Test del Niño de 5 Años (Claridad)
  html += '<div class="bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4.5 space-y-2">' +
    '<div class="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">' +
      '<span class="text-sm">👶</span>' +
      '<span>Test del Niño de 5 Años (Claridad & Simplicidad)</span>' +
    '</div>' +
    '<p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">' + (data.fiveYearOldTest || 'El guión utiliza lenguaje directo y comprensible sin tecnicismos que confundan al espectador.') + '</p>' +
  '</div>';

  // 5. Auditoría por Etapas de Tiempo (4 Cajas)
  html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">' +
    '<!-- Gancho -->' +
    '<div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">' +
      '<span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">' +
        '<span>🎣 Gancho (0-3s)</span>' +
      '</span>' +
      '<p class="text-xs text-slate-300 leading-relaxed">' + (data.hookAnalysis || 'Apertura sólida que frena el scroll en los primeros segundos.') + '</p>' +
    '</div>' +

    '<!-- Historia -->' +
    '<div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">' +
      '<span class="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">' +
        '<span>📖 Historia (3-30s)</span>' +
      '</span>' +
      '<p class="text-xs text-slate-300 leading-relaxed">' + (data.storyAnalysis || 'Desarrollo dinámico y fluido que evita caídas de atención.') + '</p>' +
    '</div>' +

    '<!-- Moraleja -->' +
    '<div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">' +
      '<span class="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">' +
        '<span>💡 Moraleja (30-40s)</span>' +
      '</span>' +
      '<p class="text-xs text-slate-300 leading-relaxed">' + (data.moralAnalysis || 'Aporta un insight valioso que motiva a guardar el video.') + '</p>' +
    '</div>' +

    '<!-- CTA -->' +
    '<div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">' +
      '<span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">' +
        '<span>📣 CTA (40-50s)</span>' +
      '</span>' +
      '<p class="text-xs text-slate-300 leading-relaxed">' + (data.ctaAnalysis || 'Llamada a la acción con palabra clave de fácil conversión.') + '</p>' +
    '</div>' +
  '</div>';

  // 6. Guión Pulido / Optimizado
  const optScript = data.optimizedVersion || originalScript;
  html += '<div class="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4.5 space-y-2">' +
    '<div class="flex items-center justify-between">' +
      '<span class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">' +
        '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i>' +
        '<span>Guión Optimizado Listo para Producción</span>' +
      '</span>' +
      '<button type="button" onclick="navigator.clipboard.writeText(document.getElementById(\'aiAuditedOptimizedText\').value); showToast(\'Copiado al portapapeles\', \'success\');" class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">' +
        '<i data-lucide="copy" class="w-3 h-3"></i> Copiar' +
      '</button>' +
    '</div>' +
    '<textarea id="aiAuditedOptimizedText" rows="6" class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white font-mono leading-relaxed outline-none focus:border-emerald-500">' + optScript + '</textarea>' +
  '</div>';

  html += '</div>';

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }

  // Run initial calculation to update live score badges and verdict
  recalculateAiAuditScore();
}

function recalculateAiAuditScore() {
  const nino = document.getElementById('auditCritNino')?.checked || false;
  const cincuenta = document.getElementById('auditCrit50de100')?.checked || false;
  const refViral = document.getElementById('auditCritRefViral')?.checked || false;
  const tendencia = document.getElementById('auditCritTendencia')?.checked || false;
  const controversia = document.getElementById('auditCritControversia')?.checked || false;
  const mercadoViral = document.getElementById('auditCritMercadoViral')?.checked || false;

  let criteriaScore = 0;
  if (nino) criteriaScore += 2.5;
  if (cincuenta) criteriaScore += 2.5;
  if (refViral) criteriaScore += 2.0;
  if (tendencia) criteriaScore += 1.5;
  if (controversia) criteriaScore += 1.0;
  if (mercadoViral) criteriaScore += 0.5;

  const formatSelect = document.getElementById('aiAuditFormatSelect');
  const formatVal = formatSelect ? formatSelect.value : 'Formato POV';
  const formatScore = typeof getPointsForFormat === 'function' ? getPointsForFormat(formatVal) : 4.5;

  const totalScore = parseFloat((criteriaScore + formatScore).toFixed(1));
  const percent = Math.min(100, Math.round((totalScore / 14.5) * 100));

  const totalScoreDisplay = document.getElementById('aiAuditTotalScoreDisplay');
  const percentBadge = document.getElementById('aiAuditPercentBadge');
  const criteriaScoreDisplay = document.getElementById('aiAuditCriteriaScore');
  const formatScoreDisplay = document.getElementById('aiAuditFormatScore');
  const progressBar = document.getElementById('aiAuditProgressBar');
  const verdictTitle = document.getElementById('aiAuditVerdictTitle');
  const verdictDesc = document.getElementById('aiAuditVerdictDesc');

  if (totalScoreDisplay) totalScoreDisplay.textContent = totalScore.toFixed(1);
  if (percentBadge) percentBadge.textContent = percent + '%';
  if (criteriaScoreDisplay) criteriaScoreDisplay.textContent = criteriaScore.toFixed(1) + ' / 10.0 pts';
  if (formatScoreDisplay) formatScoreDisplay.textContent = formatScore.toFixed(1) + ' / 4.5 pts';
  if (progressBar) progressBar.style.width = percent + '%';

  if (verdictTitle) {
    if (totalScore >= 10.0) {
      verdictTitle.innerHTML = '<span class="text-emerald-400">🟢 Potencial Muy Alto / Viral</span>';
      if (progressBar) progressBar.className = 'bg-emerald-500 h-2.5 rounded-full transition-all duration-500';
      if (verdictDesc) verdictDesc.textContent = '¡Candidato óptimo a escalar y volverse viral! Alta inmersión y retención masiva.';
    } else if (totalScore >= 7.0) {
      verdictTitle.innerHTML = '<span class="text-amber-400">🟡 Potencial Medio (Nicho / Comunidad)</span>';
      if (progressBar) progressBar.className = 'bg-amber-500 h-2.5 rounded-full transition-all duration-500';
      if (verdictDesc) verdictDesc.textContent = 'Buen contenido para comunidad existente. Para viralidad fría, prueba formatos POV o más claridad.';
    } else {
      verdictTitle.innerHTML = '<span class="text-rose-400">🔴 Potencial Bajo (Ajustes Requeridos)</span>';
      if (progressBar) progressBar.className = 'bg-rose-500 h-2.5 rounded-full transition-all duration-500';
      if (verdictDesc) verdictDesc.textContent = 'Poco alcance orgánico predecible. Simplifica la idea al nivel de 5 años y aumenta el gancho.';
    }
  }
}

function sendAuditToViralCalc() {
  const nino = document.getElementById('auditCritNino')?.checked || false;
  const cincuenta = document.getElementById('auditCrit50de100')?.checked || false;
  const refViral = document.getElementById('auditCritRefViral')?.checked || false;
  const tendencia = document.getElementById('auditCritTendencia')?.checked || false;
  const controversia = document.getElementById('auditCritControversia')?.checked || false;
  const mercadoViral = document.getElementById('auditCritMercadoViral')?.checked || false;

  const formatSelect = document.getElementById('aiAuditFormatSelect');
  const formatVal = formatSelect ? formatSelect.value : 'Formato POV';

  const optTextarea = document.getElementById('aiAuditedOptimizedText');
  const rawText = optTextarea ? optTextarea.value.trim() : (document.getElementById('aiAuditInputText')?.value?.trim() || '');

  // Fill in the main Viral Calculator elements
  if (document.getElementById('viralCritNino')) document.getElementById('viralCritNino').checked = nino;
  if (document.getElementById('viralCrit50de100')) document.getElementById('viralCrit50de100').checked = cincuenta;
  if (document.getElementById('viralCritRefViral')) document.getElementById('viralCritRefViral').checked = refViral;
  if (document.getElementById('viralCritTendencia')) document.getElementById('viralCritTendencia').checked = tendencia;
  if (document.getElementById('viralCritControversia')) document.getElementById('viralCritControversia').checked = controversia;
  if (document.getElementById('viralCritMercadoViral')) document.getElementById('viralCritMercadoViral').checked = mercadoViral;

  const titleInput = document.getElementById('viralIdeaTitle');
  if (titleInput && rawText) {
    titleInput.value = rawText.slice(0, 80);
  }

  const targetRadio = document.querySelector(`input[name="viralFormatoRadio"][value="${formatVal}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
  }

  if (typeof calculateViralScore === 'function') {
    calculateViralScore();
  }

  switchView('viral_calc');
  showToast('🏆 ¡Evaluación cargada en la Calculadora de Viralidad!', 'success');
}

function saveAuditedScriptToMatrix() {
  const optTextarea = document.getElementById('aiAuditedOptimizedText');
  const rawText = optTextarea ? optTextarea.value.trim() : (document.getElementById('aiAuditInputText')?.value?.trim() || '');

  if (!rawText) {
    showToast('No hay guión para guardar.', 'warning');
    return;
  }

  let clientName = state.activeClient;
  if (!clientName || clientName === 'ALL') {
    clientName = (state.clients && state.clients.length > 0) ? state.clients[0] : 'Jennil';
  }

  const nextNumber = state.scripts.length + 1;

  // Extract parts if formatted or use raw
  let hook = '';
  let story = '';
  let moral = '';
  let cta = '';

  const hookMatch = rawText.match(/\[🎣 GANCHO[^\]]*\]\s*([\s\S]*?)(?=\[📖|\[💡|\[📣|$)/i);
  const storyMatch = rawText.match(/\[📖 HISTORIA[^\]]*\]\s*([\s\S]*?)(?=\[💡|\[📣|$)/i);
  const moralMatch = rawText.match(/\[💡 MORALEJA[^\]]*\]\s*([\s\S]*?)(?=\[📣|$)/i);
  const ctaMatch = rawText.match(/\[📣 CTA[^\]]*\]\s*([\s\S]*?)$/i);

  if (hookMatch) hook = hookMatch[1].trim();
  if (storyMatch) story = storyMatch[1].trim();
  if (moralMatch) moral = moralMatch[1].trim();
  if (ctaMatch) cta = ctaMatch[1].trim();

  if (!hook) {
    hook = rawText.slice(0, 80);
    story = rawText;
  }

  const formatSelect = document.getElementById('aiAuditFormatSelect');
  const chosenFormat = formatSelect ? formatSelect.value : 'Reel / 4 Pasos';

  const totalScore = document.getElementById('aiAuditTotalScoreDisplay')?.textContent || '11.5';

  const newScript = {
    id: 'scr_' + Date.now().toString(),
    number: nextNumber,
    day: 'Día ' + nextNumber,
    client: clientName,
    actor: clientName,
    ideaGanadora: hook.slice(0, 40) + '...',
    formato: chosenFormat,
    objetivo: 'Viralidad (' + totalScore + ' / 14.5 pts)',
    tipoGancho: 'Auditado con IA',
    gancho: hook,
    historia: story,
    moraleja: moral,
    cta: cta,
    date: getColombiaTodayDateString(),
    status: 'Idea',
    completed: false,
    createdVia: 'Auditor de Viralidad IA'
  };

  state.scripts.unshift(newScript);
  saveState();

  if (typeof renderAll === 'function') {
    renderAll();
  }

  showToast('📥 ¡Guión auditado guardado con éxito en tu Matriz!', 'success');
  setTimeout(() => {
    switchView('matrix');
  }, 400);
}

function sendAuditedScriptToTeleprompter() {
  const optTextarea = document.getElementById('aiAuditedOptimizedText');
  const rawText = optTextarea ? optTextarea.value.trim() : (document.getElementById('aiAuditInputText')?.value?.trim() || '');

  if (!rawText) {
    showToast('El guión está vacío.', 'warning');
    return;
  }

  if (typeof tpState !== 'undefined') {
    tpState.rawText = rawText;
    tpState.activeScriptTitle = 'Guión Auditado con IA';
  }

  switchView('teleprompter_pro');
  if (typeof renderTeleprompter === 'function') {
    renderTeleprompter();
  }
  showToast('📺 ¡Guión auditado cargado en el Teleprónter Pro!', 'success');
}

function getFallbackAudit(scriptText) {
  return {
    criteria: {
      nino: true,
      cincuenta: true,
      refViral: true,
      tendencia: true,
      controversia: false,
      mercadoViral: true
    },
    recommendedFormat: "Formato POV",
    fiveYearOldTest: "Excelente. Lenguaje ultra claro, directo y con conceptos cotidianos que cualquier persona comprende al instante sin tecnicismos.",
    hookAnalysis: "El gancho crea una brecha de curiosidad instantánea y se habla en menos de 3 segundos sin rodeos.",
    storyAnalysis: "Estructura ágil en 4 puntos sin relleno que mantiene la retención alta del segundo 3 al 30.",
    moralAnalysis: "Aporta un insight valioso y memorable que motiva al espectador a guardar el video.",
    ctaAnalysis: "Llamada a la acción con palabra clave directa y baja fricción para disparar comentarios.",
    suggestions: [
      "Mantener tono seguro y pausado en el gancho de los primeros 3 segundos.",
      "Hacer un corte visual dinámico en cada punto de la historia."
    ],
    optimizedVersion: scriptText
  };
}



// =============================================================================
// =============================================================================
// TRANSCRIPTOR DE AUDIO EN VIVO (PERFECCIONADO PARA IPAD / IPHONE / SAFARI / CHROME)
// =============================================================================
let liveSpeechRecognition = null;
let isListeningLiveAudio = false;
let autoRestartLiveAudio = false;
let liveAudioTimerInterval = null;
let liveAudioSeconds = 0;

function toggleAudioTranscription() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const topicTextarea = document.getElementById('aiWizardInputTopic');

  // If already listening, stop it
  if (isListeningLiveAudio) {
    stopLiveAudioTranscription(true);
    return;
  }

  // Check support
  if (!SpeechRecognition) {
    showToast('🎙️ Dictado: Toca el micrófono del teclado de tu iPad/celular para dictar directamente.', 'info');
    if (topicTextarea) {
      topicTextarea.focus();
      topicTextarea.placeholder = '🎙️ Toca el micrófono de tu teclado para dictar el audio o la idea...';
    }
    return;
  }

  try {
    // Reset previous instance
    if (liveSpeechRecognition) {
      try { liveSpeechRecognition.abort(); } catch (e) {}
      liveSpeechRecognition = null;
    }

    liveSpeechRecognition = new SpeechRecognition();
    liveSpeechRecognition.continuous = true;
    liveSpeechRecognition.interimResults = true;
    liveSpeechRecognition.lang = 'es-ES';
    liveSpeechRecognition.maxAlternatives = 1;

    autoRestartLiveAudio = true;
    isListeningLiveAudio = true;

    if (topicTextarea) {
      topicTextarea.setAttribute('data-initial-speech', topicTextarea.value.trim());
    }

    liveSpeechRecognition.onstart = function() {
      isListeningLiveAudio = true;
      updateLiveAudioUI(true);
      startLiveAudioTimer();
      showToast('🎙️ Escuchando... Reproduce el reel o habla cerca del micrófono.', 'info');
    };

    liveSpeechRecognition.onresult = function(event) {
      var finalTranscript = '';
      var interimTranscript = '';

      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (topicTextarea) {
        var baseText = topicTextarea.getAttribute('data-initial-speech') || '';
        var currentSpeech = (finalTranscript + interimTranscript).trim();
        if (currentSpeech) {
          topicTextarea.value = (baseText ? baseText + ' ' : '') + currentSpeech;
        }
      }
    };

    liveSpeechRecognition.onerror = function(event) {
      console.warn('Live speech recognition event error:', event.error);
      if (event.error === 'not-allowed') {
        showToast('⚠️ Permiso de micrófono denegado. Permite el micrófono en los ajustes de Safari.', 'error');
        stopLiveAudioTranscription(false);
      } else if (event.error === 'network') {
        showToast('⚠️ Error de red en el reconocimiento de voz de Apple.', 'warning');
      }
    };

    liveSpeechRecognition.onend = function() {
      if (autoRestartLiveAudio && isListeningLiveAudio) {
        // Auto-restart for continuous audio capture on iOS Safari
        try {
          if (liveSpeechRecognition) liveSpeechRecognition.start();
        } catch (e) {
          setTimeout(function() {
            if (autoRestartLiveAudio && isListeningLiveAudio) {
              try { if (liveSpeechRecognition) liveSpeechRecognition.start(); } catch (err) {}
            }
          }, 300);
        }
      } else {
        stopLiveAudioUI();
      }
    };

    liveSpeechRecognition.start();
    updateLiveAudioUI(true);
  } catch (err) {
    console.warn('SpeechRecognition start error:', err);
    // Fallback: trigger textarea focus for iOS native dictation
    isListeningLiveAudio = false;
    updateLiveAudioUI(false);
    if (topicTextarea) {
      topicTextarea.focus();
      showToast('🎙️ Toca el micrófono en el teclado de tu iPad para dictar.', 'info');
    }
  }
}

function stopLiveAudioTranscription(notifyUser) {
  autoRestartLiveAudio = false;
  isListeningLiveAudio = false;
  clearInterval(liveAudioTimerInterval);

  if (liveSpeechRecognition) {
    try {
      liveSpeechRecognition.stop();
    } catch (e) {}
  }

  stopLiveAudioUI();
  if (notifyUser) {
    showToast('⏹️ Grabación finalizada. Revisa el texto y pulsa "Crear con IA".', 'success');
  }
}

function startLiveAudioTimer() {
  clearInterval(liveAudioTimerInterval);
  liveAudioSeconds = 0;
  const timerElem = document.getElementById('aiAudioTimerDisplay');
  if (timerElem) timerElem.textContent = '00:00';

  liveAudioTimerInterval = setInterval(function() {
    liveAudioSeconds++;
    var mins = Math.floor(liveAudioSeconds / 60);
    var secs = liveAudioSeconds % 60;
    var str = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    if (timerElem) timerElem.textContent = str;
  }, 1000);
}

function updateLiveAudioUI(active) {
  const btn = document.getElementById('btnToggleLiveAudio');
  const statusBox = document.getElementById('aiAudioStatusBox');
  const btnText = document.getElementById('btnToggleLiveAudioText');

  if (active) {
    if (btn) {
      btn.className = 'w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer animate-pulse';
    }
    if (btnText) btnText.innerHTML = '⏹️ Detener Escucha (<span id="aiAudioTimerDisplay">00:00</span>)';
    if (statusBox) statusBox.classList.remove('hidden');
  } else {
    stopLiveAudioUI();
  }
}

function stopLiveAudioUI() {
  clearInterval(liveAudioTimerInterval);
  const btn = document.getElementById('btnToggleLiveAudio');
  const statusBox = document.getElementById('aiAudioStatusBox');
  const btnText = document.getElementById('btnToggleLiveAudioText');

  if (btn) {
    btn.className = 'w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer';
  }
  if (btnText) btnText.innerHTML = '🎙️ Escuchar Reel / Audio en Vivo';
  if (statusBox) statusBox.classList.add('hidden');
}

function clearTranscribedAudio() {
  const topicTextarea = document.getElementById('aiWizardInputTopic');
  if (topicTextarea) {
    topicTextarea.value = '';
    topicTextarea.removeAttribute('data-initial-speech');
    topicTextarea.focus();
  }
  showToast('Cajón de transcripción vaciado.', 'info');
}


async function polishTranscriptWithAi() {
  const topicTextarea = document.getElementById('aiWizardInputTopic');
  const rawText = topicTextarea ? topicTextarea.value.trim() : '';

  if (!rawText) {
    showToast('Por favor habla o escribe algo primero en el cajón de transcripción.', 'warning');
    if (topicTextarea) topicTextarea.focus();
    return;
  }

  const btn = document.getElementById('btnPolishTranscript');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block animate-spin mr-1">⏳</span> Pulinedo con IA...';
  }

  const prompt = [
    'Actúa como el editor de texto y transcriptor profesional #1 para creadores de contenido viral.',
    '',
    'TEXTO EN BRUTO / TRANSCRIPCIÓN HABLADA:',
    rawText,
    '',
    'OBJETIVO:',
    'Limpia, corrige la ortografía, elimina muletillas ("ehh", "este", "o sea", "bueno pues"), ordena las ideas con claridad y redáctalo de forma concisa, profesional y de alto impacto manteniendo fielmente la idea original.',
    '',
    'Devuelve ÚNICAMENTE el texto limpio pulido en un solo párrafo claro y directo, sin explicaciones ni saludos.'
  ].join('\n');

  try {
    const cleanText = await callOllama(prompt, 0.4);
    if (topicTextarea && cleanText && cleanText.trim()) {
      topicTextarea.value = cleanText.trim().replace(/^["']|["']$/g, '');
      showToast('✨ ¡Transcripción pulida y optimizada profesionalmente con IA!', 'success');
    }
  } catch (err) {
    console.warn('Error polishing transcript with AI:', err);
    showToast('No se pudo conectar con la IA de tu PC para pulir. Revisa la conexión.', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="sparkles" class="w-3 h-3 text-amber-300"></i> <span>✨ Pulir con IA</span>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      } else if (typeof window !== 'undefined' && window.lucide) {
        window.lucide.createIcons();
      }
    }
  }
}


async function startWizardProcess() {
  const elTopic = document.getElementById('aiWizardInputTopic');
  const btn = document.getElementById('btnStartWizard');

  const topicText = elTopic ? elTopic.value.trim() : '';
  wizardState.topic = topicText;
  wizardState.niche = typeof getEffectiveNiche === 'function' ? getEffectiveNiche() : '💰 Riqueza, Mentalidad & Psicología del Dinero';
  wizardState.link = '';

  if (!wizardState.topic) {
    showToast('Por favor escribe tu idea o pulsa "🎙️ Escuchar Reel" para capturar el audio del video.', 'warning');
    if (elTopic) elTopic.focus();
    return;
  }

  // Stop listening if active
  if (typeof isListeningAudio !== 'undefined' && isListeningAudio && speechRecognition) {
    try { speechRecognition.stop(); } catch (e) {}
    isListeningAudio = false;
    if (typeof updateAudioListeningUI === 'function') updateAudioListeningUI(false);
  }

  // Visual feedback on the yellow button
  const originalBtnHTML = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Analizando Estrategia...</span>';
    refreshLucideIcons();
  }

  try {
    goToWizardStep(0);
    const step0View = document.getElementById('wizStepView0');
    if (step0View) {
      step0View.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    await generateWizardStep0Strategy();
  } catch (err) {
    console.error('Error starting wizard:', err);
    showToast('Error al analizar la estrategia con la IA. Se utilizó la estrategia recomendada.', 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnHTML || '<i data-lucide="sparkles" class="w-4 h-4"></i><span>Crear con IA</span>';
      refreshLucideIcons();
    }
  }
}

// STEP 0: Generate Strategic Diagnosis & Adaptation Angles
async function generateWizardStep0Strategy() {
  const topic = wizardState.topic || (document.getElementById('aiWizardInputTopic') ? document.getElementById('aiWizardInputTopic').value.trim() : '');
  const link = wizardState.link;
  const niche = wizardState.niche || (typeof getEffectiveNiche === 'function' ? getEffectiveNiche() : 'DINERO Y FINANZAS');
  const client = wizardState.client || (document.getElementById('wizClientSelect') ? document.getElementById('wizClientSelect').value : 'Jennil');

  const container = document.getElementById('wizStrategyCardContainer');
  if (container) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800"><div class="inline-block animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"></div><p class="text-sm font-bold text-white">Analizando estrategia de impacto y diferenciación...</p><p class="text-xs text-slate-400">Estructurando cómo darle la vuelta a tu idea para ' + niche + '.</p></div>';
  }

  const videoContentDesc = topic ? topic : 'crecimiento y finanzas';

  const prompt = [
    'Actúa como el estratega creativo y director de contenido viral #1 en redes sociales especializado en transformar cualquier idea o video hacia DINERO, FINANZAS Y DESARROLLO PERSONAL.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(client) : ''),
    '',
    'INFORMACIÓN DEL CREADOR Y ENCARGO:',
    '- Contenido o idea: "' + videoContentDesc + '"',
    '- Nicho objetivo: ' + niche,
    '',
    'TU TAREA DE ESTRATEGIA (Paso 0):',
    '1. En "overview": Explica brevemente sobre qué trata el tema ("' + videoContentDesc + '").',
    '2. En "howToFlip": Redacta una ESTRATEGIA DE IMPACTO Y DIFERENCIACIÓN clara, contundente y detallada sobre cómo abordar este tema para el creador ' + client + ' en ' + niche + ' (este texto será editable por el usuario y servirá de guía maestra para todo el guión).',
    '',
    'Responde ÚNICAMENTE con un objeto JSON válido:',
    '{',
    '  "overview": "Diagnóstico breve del tema (' + videoContentDesc.replace(/"/g, '') + ')",',
    '  "howToFlip": "Estrategia de impacto y diferenciación concreta para ' + niche + '"',
    '}'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.7);
    let parsed = null;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch (pe) {}

    if (parsed && (parsed.howToFlip || parsed.overview)) {
      wizardState.strategy = parsed;
      renderWizardStep0Strategy(parsed);
    } else {
      wizardState.strategy = getFallbackStrategy(topic, link, niche);
      renderWizardStep0Strategy(wizardState.strategy);
    }
  } catch (err) {
    console.warn('Ollama Step 0 error, using high-quality fallback strategy:', err);
    wizardState.strategy = getFallbackStrategy(topic, link, niche);
    renderWizardStep0Strategy(wizardState.strategy);
  }
}

function renderWizardStep0Strategy(strat) {
  const container = document.getElementById('wizStrategyCardContainer');
  if (!container) return;

  const isLink = Boolean(wizardState.link);
  const howToFlipContent = strat.howToFlip || `Para adaptar este tema al nicho de ${wizardState.niche || 'Finanzas'}, desmitificaremos las falsas creencias y nos enfocaremos en aportar una solución práctica y directa basada en sistemas y activos.`;

  container.innerHTML = `
    <div class="space-y-4">
      <!-- 1. Overview Card -->
      <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
        <div class="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
          <i data-lucide="${isLink ? 'video' : 'compass'}" class="w-4 h-4"></i>
          <span>1. Diagnóstico de la Idea & Audiencia</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          ${strat.overview || 'Análisis del concepto y enfoque del contenido.'}
        </p>
      </div>

      <!-- 2. Editable Impact & Differentiation Strategy Card -->
      <div class="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 p-4.5 rounded-xl space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            <span>2. Estrategia de Impacto & Diferenciación (Editable)</span>
          </div>
          <span class="text-[10px] font-bold text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Guía Maestra del Guión</span>
        </div>
        <textarea 
          id="wizStrategyImpactText" 
          rows="4" 
          class="w-full bg-slate-950/90 border border-purple-500/40 focus:border-amber-400 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed outline-none transition resize-y"
          placeholder="Escribe o afina aquí la estrategia de impacto sobre la que la IA debe construir el guión..."
        >${howToFlipContent}</textarea>
        <p class="text-[11px] text-slate-400 leading-snug">
          💡 <em>Puedes editar este texto directamente para orientar a la IA si necesitas ajustar el enfoque antes de generar los ganchos.</em>
        </p>
      </div>
    </div>
  `;

  refreshLucideIcons();
}

function confirmStrategyAndAdvanceToStep1() {
  const impactInput = document.getElementById('wizStrategyImpactText');
  const intentInput = document.getElementById('wizStrategyUserIntent');

  const strategyText = impactInput ? impactInput.value.trim() : (wizardState.strategy?.howToFlip || '');
  wizardState.strategyText = strategyText;
  if (intentInput) wizardState.userIntent = intentInput.value.trim();

  const badge = document.getElementById('wizBadgeChosenAngle');
  if (badge) {
    badge.innerText = strategyText ? strategyText.slice(0, 90) + '...' : 'Estrategia Viral Alineada';
  }

  goToWizardStep(1);
  generateWizardStep1Hooks();
}

// =========================================================================
// 64 VIRAL HOOKS DYNAMIC ADAPTATION & SLOT MANAGEMENT
// =========================================================================

function cleanHookTopic(topic) {
  if (!topic) return 'Multiplicar tus ingresos';
  return topic
    .replace(/^Tema:s*/i, '')
    .replace(/^Fórmula[^:]*:s*/i, '')
    .replace(/(Gancho:[^)]+)/i, '')
    .replace(/["']/g, '')
    .trim();
}

function adaptHookFormulaToContext(hook, rawTopic, manualContext, niche, variantIndex = 0) {
  if (!hook) return 'La clave sobre ' + (rawTopic || 'este tema') + ' que casi nadie aplica.';
  
  const topic = cleanHookTopic(rawTopic) || 'este método financiero';
  const formula = hook.formula || '';
  const example = hook.example || '';
  const manual = manualContext ? manualContext.trim() : '';

  const amounts = ['$10.000', '$50.000', '$100.000', 'el triple', '7 cifras'];
  const times = ['30 días', '90 días', '6 meses', '1 año', '24 horas'];
  const numbers = ['3', '5', '4', '7', '10'];
  const amountsVar = amounts[variantIndex % amounts.length];
  const timesVar = times[variantIndex % times.length];
  const numbersVar = numbers[variantIndex % numbers.length];

  if (!formula.includes('[')) {
    return (example || ('Lo que nadie te cuenta sobre ' + topic)).replace(/\.\.\.$/, '').trim();
  }

  return formula.replace(/\[([^\]]+)\]/g, (match, tag) => {
    const t = tag.toLowerCase();
    if (manual && manual.length > 5 && !manual.toLowerCase().startsWith('ej:')) {
      if (t.includes('opción impopular') || t.includes('error') || t.includes('secreto') || t.includes('resultado') || t.includes('tema')) {
        return manual;
      }
    }
    if (t.includes('cifra exacta') || t.includes('cifra real') || t.includes('dinero')) return amountsVar;
    if (t.includes('tiempo') || t.includes('segundos') || t.includes('minutos')) return timesVar;
    if (t.includes('número')) return numbersVar;
    if (t.includes('opción impopular') || t.includes('opción a')) return topic;
    if (t.includes('opción masiva') || t.includes('opción b') || t.includes('método tradicional')) return 'guardar tu dinero bajo el colchón';
    if (t.includes('error') || t.includes('mal hábito') || t.includes('comportamiento')) return 'cometer este error con ' + topic;
    if (t.includes('consecuencia negativa') || t.includes('situación dolorosa')) return 'perder tu dinero';
    if (t.includes('resultado') || t.includes('logro') || t.includes('objetivo') || t.includes('beneficio')) return 'multiplicar tu capital con ' + topic;
    if (t.includes('persona') || t.includes('empresario') || t.includes('celebridad')) return 'Warren Buffett';
    if (t.includes('bancos') || t.includes('corporaciones')) return 'los grandes bancos';
    if (t.includes('postura común')) return 'esperar el momento perfecto';
    if (t.includes('postura disruptiva')) return 'empezar hoy mismo con ' + topic;
    if (t.includes('elemento visual') || t.includes('efecto')) return 'Mira esto con atención';
    if (t.includes('pregunta') || t.includes('cifra tabú')) return '¿Cuánto dinero estás perdiendo por no saber ' + topic + '?';
    if (t.includes('refrán') || t.includes('creencia')) return 'que necesitas millones para ' + topic;
    if (t.includes('hecho')) return 'la clave está en la constancia';
    return topic;
  }).replace(/\.\.\.$/, '').trim();
}

function populateGlobalHookDropdown() {
  const globalSelect = document.getElementById('wizGlobalHookSelect');
  if (!globalSelect) return;

  const allHooks = getHooksData();
  const currentVal = wizardState.globalHookId || 'custom';

  let optionsHtml = '<option value="custom" ' + (currentVal === 'custom' ? 'selected' : '') + '>🎲 Ganchos variados / personalizados por tarjeta</option>';
  optionsHtml += allHooks.map(h => {
    const isSel = String(currentVal) === String(h.id) ? 'selected' : '';
    return '<option value="' + h.id + '" ' + isSel + '>🎯 Gancho #' + h.id + ': ' + h.name + ' (' + h.category + ')</option>';
  }).join('');

  globalSelect.innerHTML = optionsHtml;
}

function onWizardGlobalHookChange(val) {
  wizardState.globalHookId = val;
  if (val !== 'custom') {
    const hookId = parseInt(val, 10);
    wizardState.slotHookIds = [hookId, hookId, hookId, hookId, hookId];
    applyGlobalHookToAllSlots();
  }
}

function applyGlobalHookToAllSlots() {
  const globalSelect = document.getElementById('wizGlobalHookSelect');
  const val = globalSelect ? globalSelect.value : 'custom';
  if (val !== 'custom') {
    const hookId = parseInt(val, 10);
    wizardState.slotHookIds = [hookId, hookId, hookId, hookId, hookId];
    wizardState.globalHookId = hookId;
  }
  generateWizardStep1Hooks();
}

function distribute5RecommendedHooks() {
  wizardState.slotHookIds = [1, 3, 2, 8, 5];
  wizardState.globalHookId = 'custom';
  const globalSelect = document.getElementById('wizGlobalHookSelect');
  if (globalSelect) globalSelect.value = 'custom';
  generateWizardStep1Hooks();
}

function changeWizardSlotHook(slotIdx, hookIdVal) {
  const hookId = parseInt(hookIdVal, 10);
  if (!wizardState.slotHookIds) wizardState.slotHookIds = [1, 3, 2, 8, 5];
  wizardState.slotHookIds[slotIdx] = hookId;
  wizardState.globalHookId = 'custom';

  const globalSelect = document.getElementById('wizGlobalHookSelect');
  if (globalSelect) globalSelect.value = 'custom';

  const allHooks = getHooksData();
  const hookDef = allHooks.find(h => String(h.id) === String(hookId));
  if (!hookDef) return;

  const topic = wizardState.topic || '';
  const manualInput = document.getElementById('wizHookManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const newHookText = adaptHookFormulaToContext(hookDef, topic, manualContext, wizardState.niche, slotIdx);

  if (!wizardState.generatedHooks) wizardState.generatedHooks = [];
  wizardState.generatedHooks[slotIdx] = {
    hookId: hookDef.id,
    formula: '#' + hookDef.id + ' ' + hookDef.name,
    hook: newHookText,
    reason: hookDef.summary || 'Alta retención en 3 segundos'
  };

  renderWizardStep1Cards(wizardState.generatedHooks);
  selectWizardHook(slotIdx);
}

async function regenerateSingleWizardHook(slotIdx) {
  if (!wizardState.slotHookIds) wizardState.slotHookIds = [1, 3, 2, 8, 5];
  const hookId = wizardState.slotHookIds[slotIdx] || 1;
  const allHooks = getHooksData();
  const hookDef = allHooks.find(h => String(h.id) === String(hookId)) || allHooks[0];

  const topic = wizardState.topic || '';
  const strategy = wizardState.strategyText || (wizardState.strategy?.howToFlip) || 'Enfoque de alto valor';
  const manualInput = document.getElementById('wizHookManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const card = document.getElementById('wizHookCard_' + slotIdx);
  if (card) {
    const p = card.querySelector('p');
    if (p) p.innerHTML = '<span class="text-amber-400 animate-pulse font-medium">⚡ Regenerando con IA...</span>';
  }

  const prompt = [
    'Actúa como el estratega viral #1 en Instagram Reels y TikTok de BLEX STUDIO.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(wizardState.client || 'Jennil') : ''),
    '',
    'CONTEXTO DEL CONTENIDO:',
    '- Tema central: "' + topic + '"',
    '- Estrategia de impacto: "' + strategy + '"',
    (manualContext ? '- GUÍA O ENFOQUE MANUAL DEL USUARIO: "' + manualContext + '"' : ''),
    '- FÓRMULA ASIGNADA: #' + hookDef.id + ' ' + hookDef.name + ' (' + hookDef.formula + ')',
    '- Ejemplo de referencia: "' + hookDef.example + '"',
    '',
    'REGLAS CRÍTICAS:',
    '1. Genera UN SOLO gancho magnético de 0 a 3 segundos (máximo 8 a 12 palabras) que aplique exactamente la fórmula #' + hookDef.id + '.',
    '2. Responde ÚNICAMENTE con el texto exacto del gancho (sin comillas, sin explicaciones).'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.8);
    let hookText = (raw || '').trim().replace(/^[\"']|[\"']$/g, '').replace(/^Gancho:\s*/i, '');
    if (!hookText || hookText.length < 5) {
      hookText = adaptHookFormulaToContext(hookDef, topic, manualContext, wizardState.niche, slotIdx + 2);
    }
    wizardState.generatedHooks[slotIdx] = {
      hookId: hookDef.id,
      formula: '#' + hookDef.id + ' ' + hookDef.name,
      hook: hookText,
      reason: hookDef.summary || 'Alta retención en 3 segundos'
    };
    renderWizardStep1Cards(wizardState.generatedHooks);
    selectWizardHook(slotIdx);
  } catch (e) {
    const fallbackText = adaptHookFormulaToContext(hookDef, topic, manualContext, wizardState.niche, slotIdx + 2);
    wizardState.generatedHooks[slotIdx] = {
      hookId: hookDef.id,
      formula: '#' + hookDef.id + ' ' + hookDef.name,
      hook: fallbackText,
      reason: hookDef.summary || 'Alta retención en 3 segundos'
    };
    renderWizardStep1Cards(wizardState.generatedHooks);
    selectWizardHook(slotIdx);
  }
}

// STEP 1: Generate 5 Hooks
async function generateWizardStep1Hooks() {
  populateGlobalHookDropdown();

  const allHooks = getHooksData();
  const topic = wizardState.topic || '';
  const niche = wizardState.niche || 'Finanzas y Dinero';
  const strategy = wizardState.strategyText || (wizardState.strategy?.howToFlip) || 'Enfoque de alto valor y diferenciación';
  const intent = wizardState.userIntent || '';
  
  if (!wizardState.slotHookIds || wizardState.slotHookIds.length !== 5) {
    if (wizardState.selectedCatalogHook) {
      const catId = wizardState.selectedCatalogHook.id;
      wizardState.slotHookIds = [catId, catId, catId, catId, catId];
      wizardState.globalHookId = catId;
    } else {
      wizardState.slotHookIds = [1, 3, 2, 8, 5];
      wizardState.globalHookId = 'custom';
    }
  }

  const manualInput = document.getElementById('wizHookManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const grid = document.getElementById('wizCardsGrid1');
  if (grid) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800"><div class="inline-block animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div><p class="text-sm font-bold text-white">Generando 5 ganchos virales adaptados (0-3s)...</p><p class="text-xs text-slate-400">' + (manualContext ? 'Integrando tu enfoque manual: "' + manualContext + '"' : 'Adaptando las 5 fórmulas psicológicas seleccionadas.') + '</p></div>';
  }

  const assignedHooks = wizardState.slotHookIds.map((id, idx) => {
    return allHooks.find(h => String(h.id) === String(id)) || allHooks[idx] || allHooks[0];
  });

  const prompt = [
    'Actúa como el estratega viral #1 en Instagram Reels y TikTok especializado en DINERO, FINANZAS Y DESARROLLO PERSONAL de BLEX STUDIO.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(wizardState.client || 'Jennil') : ''),
    '',
    'CONTEXTO DEL CONTENIDO:',
    '- Tema central: "' + topic + '"',
    '- Estrategia de impacto a seguir: "' + strategy + '"',
    (manualContext ? '- GUÍA O ENFOQUE MANUAL DEL USUARIO PARA EL GANCHO: "' + manualContext + '"' : ''),
    '- Nicho objetivo: ' + niche,
    (intent ? '- Intención: "' + intent + '"' : ''),
    '',
    'DEBES GENERAR EXACTAMENTE 5 GANCHOS VIRALES DE 0 A 3 SEGUNDOS (MÁXIMO 8-12 PALABRAS) APLICANDO ESTRICTAMENTE LAS SIGUIENTES 5 FÓRMULAS DEL CATÁLOGO:',
    '',
    assignedHooks.map((h, i) => {
      return 'Opción ' + (i + 1) + ' (Fórmula #' + h.id + ' - ' + h.name + '):\n' +
        '- Estructura: ' + h.formula + '\n' +
        '- Explicación: ' + h.summary + '\n' +
        '- Ejemplo de referencia: "' + h.example + '"';
    }).join('\n\n'),
    '',
    'REGLAS CRÍTICAS PARA EL GANCHO (Paso 1):',
    '1. TIEMPO EXACTO: El gancho debe durar 0 a 3 segundos (máximo 8 a 12 palabras).',
    '2. ADAPTACIÓN: Aplica estrictamente cada fórmula al tema "' + topic + '" y la guía manual del usuario.',
    (manualContext ? '3. ALINEACIÓN MANUAL: Cada una de las 5 opciones debe aplicar tu enfoque manual: "' + manualContext + '".' : ''),
    '',
    'Responde ÚNICAMENTE con un arreglo JSON válido de 5 objetos:',
    '[',
    '  {',
    '    "hookId": ' + assignedHooks[0].id + ',',
    '    "formula": "#' + assignedHooks[0].id + ' ' + assignedHooks[0].name + '",',
    '    "hook": "Frase de 8-12 palabras",',
    '    "reason": "Por qué detiene el scroll"',
    '  }',
    ']'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.7);
    let parsed = null;
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}

    if (parsed && Array.isArray(parsed) && parsed.length >= 3) {
      wizardState.generatedHooks = parsed.slice(0, 5).map((h, idx) => {
        let hookText = (h.hook || '').trim().replace(/^[\"']|[\"']$/g, '');
        const hookDef = assignedHooks[idx] || allHooks[0];
        return {
          hookId: h.hookId || hookDef.id,
          formula: h.formula || ('#' + hookDef.id + ' ' + hookDef.name),
          hook: hookText || adaptHookFormulaToContext(hookDef, topic, manualContext, niche, idx),
          reason: h.reason || hookDef.summary || 'Alta retención en 3 segundos'
        };
      });
      renderWizardStep1Cards(wizardState.generatedHooks);
    } else {
      wizardState.generatedHooks = assignedHooks.map((h, idx) => ({
        hookId: h.id,
        formula: '#' + h.id + ' ' + h.name,
        hook: adaptHookFormulaToContext(h, topic, manualContext, niche, idx),
        reason: h.summary || 'Alta retención en 3 segundos'
      }));
      renderWizardStep1Cards(wizardState.generatedHooks);
    }
  } catch (err) {
    console.warn('Step 1 hook generation fallback:', err);
    wizardState.generatedHooks = assignedHooks.map((h, idx) => ({
      hookId: h.id,
      formula: '#' + h.id + ' ' + h.name,
      hook: adaptHookFormulaToContext(h, topic, manualContext, niche, idx),
      reason: h.summary || 'Alta retención en 3 segundos'
    }));
    renderWizardStep1Cards(wizardState.generatedHooks);
  }
}

function renderWizardStep1Cards(hooks) {
  const grid = document.getElementById('wizCardsGrid1');
  if (!grid) return;

  const allHooks = getHooksData();
  const letters = ['A', 'B', 'C', 'D', 'E'];

  grid.innerHTML = hooks.map((item, idx) => {
    const letter = letters[idx] || (idx + 1);
    const isSelected = wizardState.selectedHook === item.hook;
    const currentHookId = item.hookId || (wizardState.slotHookIds ? wizardState.slotHookIds[idx] : 1);
    const hookDef = allHooks.find(h => String(h.id) === String(currentHookId)) || allHooks[0];

    const optionsHtml = allHooks.map(h => {
      const isSel = String(h.id) === String(currentHookId) ? 'selected' : '';
      return '<option value="' + h.id + '" ' + isSel + '>#' + h.id + ' ' + h.name + ' (' + h.category + ')</option>';
    }).join('');

    return '<div id="wizHookCard_' + idx + '" class="p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ' + (isSelected ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60') + '">' +
      '<div class="space-y-2.5">' +
        '<div class="flex items-center justify-between gap-2">' +
          '<span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/30 shrink-0">' + letter + '</span>' +
          '<div class="flex-1 min-w-0" onclick="event.stopPropagation()">' +
            '<select onchange="changeWizardSlotHook(' + idx + ', this.value)" class="w-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-[11px] font-bold text-amber-200 rounded-lg px-2 py-1 outline-none truncate cursor-pointer" title="Cambiar la fórmula de este gancho">' +
              optionsHtml +
            '</select>' +
          '</div>' +
          '<button type="button" onclick="event.stopPropagation(); regenerateSingleWizardHook(' + idx + ')" class="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition shrink-0 cursor-pointer" title="Regenerar solo esta opción con IA">' +
            '<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>' +
          '</button>' +
        '</div>' +
        '<div class="text-[10.5px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 leading-tight">' +
          '<span class="text-amber-400/90 font-mono font-semibold">Fórmula:</span> ' + escapeHtml(hookDef ? hookDef.formula : (item.formula || 'Fórmula')) +
        '</div>' +
        '<div onclick="selectWizardHook(' + idx + ')" class="cursor-pointer">' +
          '<p class="text-xs sm:text-sm font-bold text-white leading-snug">"' + escapeHtml(item.hook) + '"</p>' +
        '</div>' +
      '</div>' +
      '<div onclick="selectWizardHook(' + idx + ')" class="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 cursor-pointer">' +
        '<span class="italic line-clamp-1">' + escapeHtml(item.reason || hookDef?.summary || 'Alto impacto psicológico') + '</span>' +
        '<span class="text-amber-400 font-bold shrink-0 ml-2">' + (isSelected ? '✓ Elegido' : 'Elegir') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!wizardState.selectedHook && hooks.length > 0) {
    selectWizardHook(0);
  }

  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}

function selectWizardHook(idx) {
  const hookObj = wizardState.generatedHooks[idx];
  if (!hookObj) return;

  wizardState.selectedHook = hookObj.hook;
  const input = document.getElementById('wizSelectedGancho');
  if (input) input.value = hookObj.hook;

  wizardState.generatedHooks.forEach((_, i) => {
    const card = document.getElementById('wizHookCard_' + i);
    if (card) {
      if (i === idx) {
        card.className = 'p-4 rounded-xl border transition flex flex-col justify-between space-y-3 bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/50';
        const span = card.querySelector('.pt-2 span:last-child');
        if (span) span.innerText = '✓ Elegido';
      } else {
        card.className = 'p-4 rounded-xl border transition flex flex-col justify-between space-y-3 bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
        const span = card.querySelector('.pt-2 span:last-child');
        if (span) span.innerText = 'Elegir';
      }
    }
  });
}

function advanceWizardToStep2() {
  const hookInput = document.getElementById('wizSelectedGancho');
  const chosenHook = hookInput ? hookInput.value.trim() : wizardState.selectedHook;

  if (!chosenHook) {
    showToast('Por favor selecciona o escribe un gancho para continuar.', 'warning');
    return;
  }

  wizardState.selectedHook = chosenHook;

  const badge = document.getElementById('wizBadgeChosenHook');
  if (badge) badge.innerText = '"' + chosenHook + '"';

  goToWizardStep(2);

  if (!wizardState.generatedStories || wizardState.generatedStories.length === 0) {
    generateWizardStep2Stories();
  }
}

// STEP 2: Generate 5 Stories
async function generateWizardStep2Stories() {
  const hook = wizardState.selectedHook || (document.getElementById('wizSelectedGancho') ? document.getElementById('wizSelectedGancho').value.trim() : '');
  const topic = wizardState.topic || '';
  const niche = wizardState.niche || 'Finanzas y Dinero';
  const strategy = wizardState.strategyText || '';
  const intent = wizardState.userIntent || '';

  const manualInput = document.getElementById('wizStoryManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const grid = document.getElementById('wizCardsGrid2');
  if (grid) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800"><div class="inline-block animate-spin w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full"></div><p class="text-sm font-bold text-white">Generando 5 opciones de historia y contexto (3-30s)...</p><p class="text-xs text-slate-400">' + (manualContext ? 'Desarrollando la anécdota y guía que proporcionaste...' : 'Conectando con el gancho para mantener la retención alta.') + '</p></div>';
  }

  const prompt = [
    'Actúa como el guionista y storyteller #1 en videos cortos de alta retención para DINERO, FINANZAS Y DESARROLLO PERSONAL.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(wizardState.client || 'Jennil') : ''),
    '',
    'CONTEXTO DEL REEL:',
    '- Gancho de apertura seleccionado (0-3s): "' + hook + '"',
    '- Estrategia de impacto: "' + strategy + '"',
    (manualContext ? '- GUÍA / ANÉCDOTA MANUAL DEL USUARIO PARA LA HISTORIA: "' + manualContext + '"' : ''),
    '- Nicho: ' + niche,
    (intent ? '- Intención: "' + intent + '"' : ''),
    '',
    'REGLAS DE LA HISTORIA (Paso 2):',
    '1. TIEMPO: Duración de 3 a 30 segundos (40 a 60 palabras).',
    '2. ESTRUCTURA: Cero rodeos, desarrollo ágil, datos concretos, anécdota de alto valor o contraste.',
    (manualContext ? '3. ANÉCDOTA: Basa la historia en la guía manual del usuario: "' + manualContext + '".' : ''),
    '',
    'Responde ÚNICAMENTE con un arreglo JSON válido de 5 opciones de historia:',
    '[',
    '  {',
    '    "type": "Contraste & Aprendizaje Rápido",',
    '    "story": "Texto completo de la historia (40-60 palabras)",',
    '    "focus": "Enfoque de valor"',
    '  }',
    ']'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.7);
    let parsed = null;
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}

    if (parsed && Array.isArray(parsed) && parsed.length >= 3) {
      wizardState.generatedStories = parsed.slice(0, 5).map(s => ({
        type: s.type || 'Historia de Alto Valor',
        story: (s.story || '').trim().replace(/^[\"']|[\"']$/g, ''),
        focus: s.focus || 'Retención fluida'
      }));
      renderWizardStep2Cards(wizardState.generatedStories);
    } else {
      wizardState.generatedStories = getFallbackStories(hook, topic, manualContext);
      renderWizardStep2Cards(wizardState.generatedStories);
    }
  } catch (err) {
    console.warn('Step 2 story error, using fallback:', err);
    wizardState.generatedStories = getFallbackStories(hook, topic, manualContext);
    renderWizardStep2Cards(wizardState.generatedStories);
  }
}

function renderWizardStep2Cards(stories) {
  const grid = document.getElementById('wizCardsGrid2');
  if (!grid) return;

  grid.innerHTML = stories.map((item, idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const letter = letters[idx] || (idx + 1);
    const isSelected = wizardState.selectedStory === item.story;

    return '<div onclick="selectWizardStory(' + idx + ')" id="wizStoryCard_' + idx + '" class="p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ' + (isSelected ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60') + '">' +
      '<div class="space-y-2">' +
        '<div class="flex items-center justify-between">' +
          '<span class="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 font-black text-xs flex items-center justify-center border border-sky-500/30">' + letter + '</span>' +
          '<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">' + (item.angle || 'Ángulo Dinámico') + '</span>' +
        '</div>' +
        '<p class="text-xs sm:text-sm text-slate-200 leading-relaxed">' + item.story + '</p>' +
      '</div>' +
      '<div class="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">' +
        '<span class="italic line-clamp-1">' + (item.highlight || 'Retención acelerada') + '</span>' +
        '<span class="text-sky-400 font-bold shrink-0 ml-2">' + (isSelected ? '✓ Elegido' : 'Seleccionar') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!wizardState.selectedStory && stories.length > 0) {
    selectWizardStory(0);
  }

  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}

function selectWizardStory(idx) {
  const storyObj = wizardState.generatedStories[idx];
  if (!storyObj) return;

  wizardState.selectedStory = storyObj.story;
  const input = document.getElementById('wizSelectedHistoria');
  if (input) input.value = storyObj.story;

  wizardState.generatedStories.forEach((_, i) => {
    const card = document.getElementById('wizStoryCard_' + i);
    if (card) {
      if (i === idx) {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/50';
      } else {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
      }
    }
  });
}

function advanceWizardToStep3() {
  const storyInput = document.getElementById('wizSelectedHistoria');
  const chosenStory = storyInput ? storyInput.value.trim() : wizardState.selectedStory;

  if (!chosenStory) {
    showToast('Por favor selecciona o redacta la historia/contexto para continuar.', 'warning');
    return;
  }

  wizardState.selectedStory = chosenStory;
  goToWizardStep(3);

  if (!wizardState.generatedMorals || wizardState.generatedMorals.length === 0) {
    generateWizardStep3Morals();
  }
}

// STEP 3: Generate 5 Morals / Lessons
async function generateWizardStep3Morals() {
  const hook = wizardState.selectedHook || '';
  const story = wizardState.selectedStory || '';
  const topic = wizardState.topic || '';
  const niche = wizardState.niche || 'Finanzas y Dinero';

  const manualInput = document.getElementById('wizMoralManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const grid = document.getElementById('wizCardsGrid3');
  if (grid) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800"><div class="inline-block animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"></div><p class="text-sm font-bold text-white">Generando 5 moralejas y lecciones clave (30-40s)...</p><p class="text-xs text-slate-400">' + (manualContext ? 'Estructurando la lección que indicaste...' : 'Extrayendo el principio contundente para que guarden el video.') + '</p></div>';
  }

  const prompt = [
    'Actúa como el estratega de contenido #1 en redes sociales especializado en crear MORALEJAS Y VALOR MEMORABLE en videos cortos.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(wizardState.client || 'Jennil') : ''),
    '',
    'CONTEXTO DEL REEL HASTA AHORA:',
    '- Gancho (0-3s): "' + hook + '"',
    '- Historia (3-30s): "' + story + '"',
    (manualContext ? '- LECCIÓN / GUÍA MANUAL DEL USUARIO PARA LA MORALEJA: "' + manualContext + '"' : ''),
    '- Nicho: ' + niche,
    '',
    'REGLAS DE LA MORALEJA (Paso 3):',
    '1. TIEMPO: Duración de 30 a 40 segundos (15 a 25 palabras).',
    '2. FORMATO: 1 o 2 frases contundentes, memorables y fáciles de recordar.',
    (manualContext ? '3. LECCIÓN: Plasma exactamente la lección indicada: "' + manualContext + '".' : ''),
    '',
    'Responde ÚNICAMENTE con un arreglo JSON válido de 5 moralejas:',
    '[',
    '  {',
    '    "type": "Regla de Oro",',
    '    "moral": "Frase memorable de 15-25 palabras",',
    '    "takeaway": "Insight clave"',
    '  }',
    ']'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.7);
    let parsed = null;
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}

    if (parsed && Array.isArray(parsed) && parsed.length >= 3) {
      wizardState.generatedMorals = parsed.slice(0, 5).map(m => ({
        type: m.type || 'Lección Maestra',
        moral: (m.moral || '').trim().replace(/^[\"']|[\"']$/g, ''),
        takeaway: m.takeaway || 'Alto valor para guardar'
      }));
      renderWizardStep3Cards(wizardState.generatedMorals);
    } else {
      wizardState.generatedMorals = getFallbackMorals(story, topic, manualContext);
      renderWizardStep3Cards(wizardState.generatedMorals);
    }
  } catch (err) {
    console.warn('Step 3 moral error, using fallback:', err);
    wizardState.generatedMorals = getFallbackMorals(story, topic, manualContext);
    renderWizardStep3Cards(wizardState.generatedMorals);
  }
}

function renderWizardStep3Cards(morals) {
  const grid = document.getElementById('wizCardsGrid3');
  if (!grid) return;

  grid.innerHTML = morals.map((item, idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const letter = letters[idx] || (idx + 1);
    const isSelected = wizardState.selectedMoral === item.moral;

    return '<div onclick="selectWizardMoral(' + idx + ')" id="wizMoralCard_' + idx + '" class="p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ' + (isSelected ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60') + '">' +
      '<div class="space-y-2">' +
        '<div class="flex items-center justify-between">' +
          '<span class="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center border border-purple-500/30">' + letter + '</span>' +
          '<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">' + (item.type || 'Lección de Valor') + '</span>' +
        '</div>' +
        '<p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">"' + item.moral + '"</p>' +
      '</div>' +
      '<div class="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">' +
        '<span class="italic line-clamp-1">' + (item.takeaway || 'Impacto garantizado') + '</span>' +
        '<span class="text-purple-400 font-bold shrink-0 ml-2">' + (isSelected ? '✓ Elegido' : 'Seleccionar') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!wizardState.selectedMoral && morals.length > 0) {
    selectWizardMoral(0);
  }

  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}

function selectWizardMoral(idx) {
  const moralObj = wizardState.generatedMorals[idx];
  if (!moralObj) return;

  wizardState.selectedMoral = moralObj.moral;
  const input = document.getElementById('wizSelectedMoraleja');
  if (input) input.value = moralObj.moral;

  wizardState.generatedMorals.forEach((_, i) => {
    const card = document.getElementById('wizMoralCard_' + i);
    if (card) {
      if (i === idx) {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50';
      } else {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
      }
    }
  });
}

function advanceWizardToStep4() {
  const moralInput = document.getElementById('wizSelectedMoraleja');
  const chosenMoral = moralInput ? moralInput.value.trim() : wizardState.selectedMoral;

  if (!chosenMoral) {
    showToast('Por favor selecciona o edita la moraleja antes de continuar.', 'warning');
    return;
  }

  wizardState.selectedMoral = chosenMoral;
  goToWizardStep(4);

  if (!wizardState.generatedCTAs || wizardState.generatedCTAs.length === 0) {
    generateWizardStep4CTAs();
  }
}

// STEP 4: Generate 5 CTAs
async function generateWizardStep4CTAs() {
  const hook = wizardState.selectedHook || '';
  const niche = wizardState.niche || 'Finanzas y Dinero';

  const manualInput = document.getElementById('wizCtaManualContext');
  const manualContext = manualInput ? manualInput.value.trim() : '';

  const grid = document.getElementById('wizCardsGrid4');
  if (grid) {
    grid.innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800"><div class="inline-block animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div><p class="text-sm font-bold text-white">Generando 5 opciones de llamado a la acción (40-50s)...</p><p class="text-xs text-slate-400">' + (manualContext ? 'Adaptando a tu palabra clave y llamado...' : 'Fórmulas de baja fricción para disparar comentarios y guardados.') + '</p></div>';
  }

  const prompt = [
    'Actúa como el estratega de conversión y retención #1 en Instagram Reels y TikTok.',
    '',
    (typeof getBrandDnaPromptSnippet === 'function' ? getBrandDnaPromptSnippet(wizardState.client || 'Jennil') : ''),
    '',
    'CONTEXTO DEL REEL:',
    '- Gancho de apertura: "' + hook + '"',
    (manualContext ? '- CTA / PALABRA CLAVE MANUAL INDICADA POR EL USUARIO: "' + manualContext + '"' : ''),
    '- Nicho: ' + niche,
    '',
    'REGLAS DEL CTA (Paso 4):',
    '1. TIEMPO: Duración de 40 a 50 segundos (10 a 15 palabras).',
    '2. CONVERSIÓN: Palabra clave de 1 sola palabra o acción inmediata.',
    (manualContext ? '3. ALINEACIÓN: Usa exactamente la palabra o llamado indicado: "' + manualContext + '".' : ''),
    '',
    'Responde ÚNICAMENTE con un arreglo JSON válido de 5 CTAs:',
    '[',
    '  {',
    '    "type": "Comentario con Palabra Clave",',
    '    "cta": "Frase de 10-15 palabras",',
    '    "benefit": "Dispara interacción"',
    '  }',
    ']'
  ].join('\n');

  try {
    const raw = await callOllama(prompt, 0.7);
    let parsed = null;
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}

    if (parsed && Array.isArray(parsed) && parsed.length >= 3) {
      wizardState.generatedCTAs = parsed.slice(0, 5).map(c => ({
        type: c.type || 'Llamado a la Acción',
        cta: (c.cta || '').trim().replace(/^[\"']|[\"']$/g, ''),
        benefit: c.benefit || 'Fácil conversión'
      }));
      renderWizardStep4Cards(wizardState.generatedCTAs);
    } else {
      wizardState.generatedCTAs = getFallbackCTAs(niche, manualContext);
      renderWizardStep4Cards(wizardState.generatedCTAs);
    }
  } catch (err) {
    console.warn('Step 4 CTA error, using fallback:', err);
    wizardState.generatedCTAs = getFallbackCTAs(niche, manualContext);
    renderWizardStep4Cards(wizardState.generatedCTAs);
  }
}

function renderWizardStep4Cards(ctas) {
  const grid = document.getElementById('wizCardsGrid4');
  if (!grid) return;

  grid.innerHTML = ctas.map((item, idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const letter = letters[idx] || (idx + 1);
    const isSelected = wizardState.selectedCTA === item.cta;

    return '<div onclick="selectWizardCTA(' + idx + ')" id="wizCtaCard_' + idx + '" class="p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ' + (isSelected ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60') + '">' +
      '<div class="space-y-2">' +
        '<div class="flex items-center justify-between">' +
          '<span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-500/30">' + letter + '</span>' +
          '<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">' + (item.action || 'Conversión') + '</span>' +
        '</div>' +
        '<p class="text-xs sm:text-sm text-white font-bold leading-relaxed">"' + item.cta + '"</p>' +
      '</div>' +
      '<div class="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">' +
        '<span class="text-emerald-400 font-mono font-bold">' + (item.triggerWord ? '🔑 ' + item.triggerWord : '⚡ Conversión rápida') + '</span>' +
        '<span class="text-emerald-400 font-bold shrink-0 ml-2">' + (isSelected ? '✓ Elegido' : 'Seleccionar') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!wizardState.selectedCTA && ctas.length > 0) {
    selectWizardCTA(0);
  }

  if (typeof lucide !== 'undefined') { lucide.createIcons(); } else if (typeof window !== 'undefined' && window.lucide) { window.lucide.createIcons(); }
}

function selectWizardCTA(idx) {
  const ctaObj = wizardState.generatedCTAs[idx];
  if (!ctaObj) return;

  wizardState.selectedCTA = ctaObj.cta;
  const input = document.getElementById('wizSelectedCTA');
  if (input) input.value = ctaObj.cta;

  wizardState.generatedCTAs.forEach((_, i) => {
    const card = document.getElementById('wizCtaCard_' + i);
    if (card) {
      if (i === idx) {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50';
      } else {
        card.className = 'p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
      }
    }
  });
}

function advanceWizardToFinalAssembly() {
  const ctaInput = document.getElementById('wizSelectedCTA');
  const chosenCTA = ctaInput ? ctaInput.value.trim() : wizardState.selectedCTA;

  if (!chosenCTA) {
    showToast('Por favor selecciona o redacta un CTA.', 'warning');
    return;
  }

  wizardState.selectedCTA = chosenCTA;
  goToWizardStep(5);
}

// STEP 5 ACTIONS: Teleprompter, Matrix, Copy
function sendWizardToTeleprompter() {
  const hook = (document.getElementById('wizFinalHook') ? document.getElementById('wizFinalHook').value.trim() : '') || wizardState.selectedHook;
  const story = (document.getElementById('wizFinalStory') ? document.getElementById('wizFinalStory').value.trim() : '') || wizardState.selectedStory;
  const moral = (document.getElementById('wizFinalMoral') ? document.getElementById('wizFinalMoral').value.trim() : '') || wizardState.selectedMoral;
  const cta = (document.getElementById('wizFinalCTA') ? document.getElementById('wizFinalCTA').value.trim() : '') || wizardState.selectedCTA;

  if (!hook && !story) {
    showToast('El guión está vacío.', 'warning');
    return;
  }

  if (typeof tpState !== 'undefined') {
    tpState.structuredParts = {
      hook: hook,
      context: story,
      moral: moral,
      cta: cta
    };
    tpState.rawText = hook + '\n\n' + story + '\n\n' + moral + '\n\n' + cta;
    tpState.activeScriptTitle = (hook ? hook.slice(0, 35) + '...' : 'Guión BLEX Studio');
  }

  switchView('teleprompter_pro');

  if (typeof renderTeleprompter === 'function') {
    renderTeleprompter();
  }

  showToast('📺 ¡Guión cargado con éxito en el Teleprónter Pro para iPad!', 'success');
}

function saveWizardToMatrix() {
  const hook = (document.getElementById('wizFinalHook') ? document.getElementById('wizFinalHook').value.trim() : '') || wizardState.selectedHook;
  const story = (document.getElementById('wizFinalStory') ? document.getElementById('wizFinalStory').value.trim() : '') || wizardState.selectedStory;
  const moral = (document.getElementById('wizFinalMoral') ? document.getElementById('wizFinalMoral').value.trim() : '') || wizardState.selectedMoral;
  const cta = (document.getElementById('wizFinalCTA') ? document.getElementById('wizFinalCTA').value.trim() : '') || wizardState.selectedCTA;

  if (!hook && !story) {
    showToast('El guión no tiene contenido para guardar.', 'warning');
    return;
  }

  let clientName = state.activeClient;
  if (!clientName || clientName === 'ALL') {
    clientName = (state.clients && state.clients.length > 0) ? state.clients[0] : 'Jennil';
  }

  // Build winning idea title (clean 4-7 words)
  let ideaTitle = 'Estrategia: ' + (wizardState.selectedAngle || 'Reel 4 Pasos');
  if (wizardState.topic) {
    const cleanT = wizardState.topic.replace(/\s+/g, ' ').trim();
    const words = cleanT.split(' ');
    if (words.length > 6) {
      ideaTitle = words.slice(0, 6).join(' ') + '...';
    } else if (words.length > 0 && cleanT) {
      ideaTitle = cleanT;
    }
  }

  const nextNumber = state.scripts.length + 1;

  const newScript = {
    id: 'scr_' + Date.now().toString(),
    number: nextNumber,
    day: 'Día ' + nextNumber,
    client: clientName,
    actor: clientName,
    ideaGanadora: ideaTitle,
    formato: 'Reel / 4 Pasos',
    objetivo: 'Viralidad & Retención',
    tipoGancho: (wizardState.selectedAngle || 'Gancho 0-3s').slice(0, 30),
    gancho: hook,
    historia: story,
    moraleja: moral,
    cta: cta,
    date: getColombiaTodayDateString(),
    status: 'Idea',
    completed: false,
    createdVia: 'BLEX AI Studio'
  };

  state.scripts.unshift(newScript);
  saveState();

  // Re-render whole application (Matrix, Cards, Analytics, Counters)
  if (typeof renderAll === 'function') {
    renderAll();
  }

  showToast('📥 ¡Guión guardado exitosamente en tu Matriz!', 'success');

  // Switch to matrix view so the user can immediately see and verify it
  setTimeout(() => {
    switchView('matrix');
  }, 400);
}

function copyWizardScript() {
  const hook = (document.getElementById('wizFinalHook') ? document.getElementById('wizFinalHook').value.trim() : '') || wizardState.selectedHook;
  const story = (document.getElementById('wizFinalStory') ? document.getElementById('wizFinalStory').value.trim() : '') || wizardState.selectedStory;
  const moral = (document.getElementById('wizFinalMoral') ? document.getElementById('wizFinalMoral').value.trim() : '') || wizardState.selectedMoral;
  const cta = (document.getElementById('wizFinalCTA') ? document.getElementById('wizFinalCTA').value.trim() : '') || wizardState.selectedCTA;

  const fullText = '[🎣 GANCHO (0-3s)]\n' + hook + '\n\n[📖 HISTORIA / CONTEXTO (3-30s)]\n' + story + '\n\n[💡 MORALEJA / VALOR (30-40s)]\n' + moral + '\n\n[📣 CTA (40-50s)]\n' + cta;

  navigator.clipboard.writeText(fullText).then(() => {
    showToast('📋 ¡Guión completo copiado al portapapeles!', 'success');
  }).catch(() => {
    showToast('No se pudo copiar automáticamente, copia el texto manualmente.', 'warning');
  });
}

// -----------------------------------------------------------------------------
// INTELLIGENT FALLBACKS (ESTRATEGIA, GANCHOS, HISTORIAS, MORALEJAS, CTAS)
// -----------------------------------------------------------------------------

function getFallbackStrategy(topic, link, niche) {
  const isLink = Boolean(link);
  const displayTopic = topic || (isLink ? 'el video de referencia' : 'estrategia financiera');

  return {
    overview: 'El contenido de referencia trata sobre: "' + displayTopic + '", utilizando una estructura de alto impacto para retener la atención.',
    howToFlip: 'Para adaptarlo a ' + niche + ', mantendremos la estructura original de "' + displayTopic + '", pero redirigiendo la conclusión y el aprendizaje hacia la psicología del dinero, hábitos de riqueza y toma de decisiones inteligentes.',
    keyQuestion: '¿Quieres enfocar este reel hacia inspirar acción inmediata o hacia advertir de un error grave sobre ' + displayTopic + '?',
    angles: [
      {
        title: 'Contraintuitivo & Romper Creencias',
        desc: 'Desafía lo que el 90% cree sobre ' + displayTopic + ' y muestra por qué aplicarlo con mentalidad de riqueza lo cambia todo.',
        hookIdea: 'Si aplicas ' + displayTopic + ' como la mayoría, estás perdiendo tiempo y dinero sin darte cuenta.'
      },
      {
        title: 'La Regla del 1% vs 99%',
        desc: 'Compara cómo la persona promedio ignora ' + displayTopic + ' mientras el 1% lo usa como ventaja competitiva.',
        hookIdea: 'El 99% no entiende el verdadero poder de ' + displayTopic + ', pero el 1% construye su libertad con esta regla.'
      },
      {
        title: 'Storytelling & Monetización',
        desc: 'Comparte una lección práctica de cómo dominar ' + displayTopic + ' acelera tus resultados financieros.',
        hookIdea: 'Cuando entendí cómo aplicar ' + displayTopic + ' a mis finanzas personales, mis resultados se multiplicaron.'
      }
    ]
  };
}

function getFallbackHooks(topic, niche, angle) {
  return [
    {
      formula: "Alerta & Silencio (0-3s)",
      hook: "Si quieres tener éxito real, jamás le cuentes estas 4 cosas a nadie.",
      reason: "Detiene el scroll en 2.5 segundos con misterio y aversión a la pérdida."
    },
    {
      formula: "El Error del 99% (0-3s)",
      hook: "El 99% arruina su futuro financiero por cometer este grave error al hablar.",
      reason: "Contraste psicológico directo y deseo de pertenecer al 1%."
    },
    {
      formula: "Mito Contraintuitivo (0-3s)",
      hook: "Guardar silencio sobre tus metas es el mejor secreto para alcanzarlas.",
      reason: "Rompe el consejo popular y crea intriga instantánea."
    },
    {
      formula: "Regla del 1% (0-3s)",
      hook: "La gente con verdadera riqueza aplica esta regla estricta en silencio.",
      reason: "Autoridad y promesa de conocimiento reservado."
    },
    {
      formula: "Pregunta de Shock (0-3s)",
      hook: "¿Por qué los que más dinero ganan son los que menos hablan de sus planes?",
      reason: "Pregunta directa que engancha la mente en 2.5 segundos."
    }
  ];
}

function getFallbackStories(hook, topic, niche) {
  return [
    {
      angle: "Los 4 Puntos de Poder",
      story: "Primero: nunca hables mal de tu familia. Segundo: jamás reveles tus proyectos antes de ver resultados. Tercero: no digas cuánto ganas ni tus problemas de dinero. Y cuarto: no presumas tus logros ante desconocidos. Cuando expones tus planes antes de tiempo, invitas a la duda a sabotear tu enfoque.",
      highlight: "Directo, estructurado y sin relleno."
    },
    {
      angle: "Contraste 1% vs 99%",
      story: "La persona promedio habla de lo que va a hacer para recibir validación barata. Quien construye riqueza real trabaja en silencio, protege su energía y solo habla cuando los resultados son inevitables. Tu privacidad es tu mayor ventaja estratégica.",
      highlight: "Mentalidad de resultados silenciosos."
    },
    {
      angle: "Lección Práctica",
      story: "Decirle a otros que estás por recibir dinero o iniciar un negocio solo atrae expectativas ajenas y envidia innecesaria. Cuando aprendes a guardarte los números y las ideas, tu mente se enfoca 100% en la ejecución y no en aparentar.",
      highlight: "Eliminación de distracciones externas."
    },
    {
      angle: "Estrategia Financiera",
      story: "El dinero ama el silencio. Cada vez que publicas tus metas antes de lograrlas, tu cerebro siente una falsa sensación de éxito y pierde la disciplina. Protege tus proyectos como protegerías tus activos más valiosos.",
      highlight: "Psicología del logro y consistencia."
    },
    {
      angle: "Transformación Personal",
      story: "Pensaba que necesitaba compartir mis ideas para que me apoyaran. Pero entendí que los verdaderos ganadores no buscan aplausos tempranos; construyen sistemas sólidos y dejan que el impacto hable por ellos.",
      highlight: "Superación de la necesidad de aprobación."
    }
  ];
}

function getFallbackMorals(hook, story, niche) {
  return [
    {
      type: "Regla de Oro",
      moral: "El éxito verdadero se construye en silencio y se deja que los resultados hagan todo el ruido. Tu tranquilidad vale más que los aplausos.",
      takeaway: "Paz mental y enfoque absoluto."
    },
    {
      type: "Mentalidad del 1%",
      moral: "La riqueza no se mide por lo que presumes ante los demás, sino por la libertad de hacer lo que quieras sin pedir permiso a nadie.",
      takeaway: "Autonomía y libertad real."
    },
    {
      type: "Principio de Enfoque",
      moral: "Quien mucho habla, poco construye. Guarda tus planes para ti y deja que tu cuenta bancaria y tu progreso hablen por ti.",
      takeaway: "Disciplina de ejecución."
    },
    {
      type: "Ley de Crecimiento",
      moral: "Tus metas son demasiado valiosas para exponerlas a la opinión de personas que no han construido nada de lo que tú buscas.",
      takeaway: "Protección de tus objetivos."
    },
    {
      type: "Regla Práctica",
      moral: "Trabaja tan duro en silencio que tu única señal de éxito sea la vida tranquila y libre que has logrado edificar.",
      takeaway: "Resultados tangibles."
    }
  ];
}

function getFallbackCTAs(hook, niche) {
  return [
    {
      action: "Comentarios con Palabra Clave",
      cta: "Comenta la palabra 'ENFOQUE' y te envío la guía paso a paso para blindar tus metas este año.",
      triggerWord: "ENFOQUE"
    },
    {
      action: "Guardar Video",
      cta: "Guarda este video para que lo recuerdes antes de contar tu próximo proyecto a cualquiera.",
      triggerWord: "GUARDAR"
    },
    {
      action: "Seguir la Cuenta",
      cta: "Sígueme si quieres dominar tu mentalidad, multiplicar tus ingresos y construir verdadera libertad.",
      triggerWord: "SEGUIR"
    },
    {
      action: "Compartir",
      cta: "Comparte este reel con un amigo que necesite escuchar este consejo hoy mismo.",
      triggerWord: "COMPARTIR"
    },
    {
      action: "Mensaje Directo",
      cta: "Escríbeme 'SILENCIO' por privado y hablemos de cómo estructurar tu plan de crecimiento personal.",
      triggerWord: "SILENCIO"
    }
  ];
}

// =========================================================================
// CALENDARIO EDITORIAL & MONITOREO DE CONTENIDOS (2026 - 2028)
// =========================================================================

let calCurrentDate = new Date();
let calDisplayMode = 'month'; // 'month' or 'list'
let activeEditingCalEventId = null;

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function setCalendarDisplayMode(mode) {
  calDisplayMode = mode;
  const btnMonth = document.getElementById('btnCalViewMonth');
  const btnList = document.getElementById('btnCalViewList');
  const monthContainer = document.getElementById('calMonthViewContainer');
  const listContainer = document.getElementById('calListViewContainer');

  if (mode === 'month') {
    if (btnMonth) btnMonth.className = 'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition bg-purple-600 text-white shadow-sm cursor-pointer';
    if (btnList) btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-white cursor-pointer';
    if (monthContainer) monthContainer.classList.remove('hidden');
    if (listContainer) listContainer.classList.add('hidden');
  } else {
    if (btnList) btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition bg-purple-600 text-white shadow-sm cursor-pointer';
    if (btnMonth) btnMonth.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-white cursor-pointer';
    if (monthContainer) monthContainer.classList.add('hidden');
    if (listContainer) listContainer.classList.remove('hidden');
  }
  renderCalendarView();
  refreshLucideIcons();
}

function navigateCalendarMonth(delta) {
  calCurrentDate.setMonth(calCurrentDate.getMonth() + delta);
  renderCalendarView();
}

function setCalendarYear(year) {
  const y = parseInt(year, 10);
  if (!isNaN(y)) {
    calCurrentDate.setFullYear(y);
    renderCalendarView();
  }
}

function goToCurrentMonth() {
  calCurrentDate = new Date();
  renderCalendarView();
}

function getFilteredCalendarEvents() {
  const events = state.calendarEvents || [];
  const clientFilter = document.getElementById('calFilterClient') ? document.getElementById('calFilterClient').value : 'ALL';
  const typeFilter = document.getElementById('calFilterType') ? document.getElementById('calFilterType').value : 'ALL';
  const statusFilter = document.getElementById('calFilterStatus') ? document.getElementById('calFilterStatus').value : 'ALL';

  return events.filter(e => {
    if (clientFilter !== 'ALL' && e.client !== clientFilter) return false;
    if (typeFilter !== 'ALL' && e.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    return true;
  });
}

function renderCalendarView() {
  // Update Month & Year header label
  const label = document.getElementById('calCurrentMonthLabel');
  const yearSelect = document.getElementById('calYearSelect');
  const currentYear = calCurrentDate.getFullYear();
  const currentMonthIdx = calCurrentDate.getMonth();

  if (label) {
    label.textContent = `${MONTH_NAMES_ES[currentMonthIdx]} ${currentYear}`;
  }
  if (yearSelect && yearSelect.value !== String(currentYear)) {
    yearSelect.value = String(currentYear);
  }

  // Populate client filter options
  populateCalendarClientFilter();

  // Render KPIs for the active month
  renderCalendarKpis();

  // Render Grid or List
  if (calDisplayMode === 'month') {
    renderCalendarMonthGrid();
  } else {
    renderCalendarListView();
  }

  // Update total badge count
  const badge = document.getElementById('calEventsCountBadge');
  if (badge) {
    badge.textContent = (state.calendarEvents || []).length;
  }

  refreshLucideIcons();
}

function populateCalendarClientFilter() {
  const select = document.getElementById('calFilterClient');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '<option value="ALL">👥 Todos los Clientes</option>';
  (state.clients || ['Jennil', 'Natalia']).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `👤 ${c}`;
    select.appendChild(opt);
  });
  if (currentVal && (currentVal === 'ALL' || state.clients.includes(currentVal))) {
    select.value = currentVal;
  }
}

function renderCalendarKpis() {
  const currentYear = calCurrentDate.getFullYear();
  const currentMonthIdx = calCurrentDate.getMonth();
  const monthStr = String(currentMonthIdx + 1).padStart(2, '0');
  const prefix = `${currentYear}-${monthStr}`;

  const allFiltered = getFilteredCalendarEvents();
  const monthEvents = allFiltered.filter(e => (e.date || '').startsWith(prefix));

  const total = monthEvents.length;
  const rodaje = monthEvents.filter(e => e.type === 'RODAJE').length;
  const porPublicar = monthEvents.filter(e => e.type === 'PUBLICACION' && e.status !== 'COMPLETADO').length;
  const publicados = monthEvents.filter(e => e.status === 'COMPLETADO').length;

  const elTotal = document.getElementById('calStatTotalMonth');
  const elRodaje = document.getElementById('calStatRodajeMonth');
  const elPorPub = document.getElementById('calStatPorPublicarMonth');
  const elPub = document.getElementById('calStatPublicadosMonth');

  if (elTotal) elTotal.textContent = total;
  if (elRodaje) elRodaje.textContent = rodaje;
  if (elPorPub) elPorPub.textContent = porPublicar;
  if (elPub) elPub.textContent = publicados;
}

function renderCalendarMonthGrid() {
  const grid = document.getElementById('calMonthGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const year = calCurrentDate.getFullYear();
  const month = calCurrentDate.getMonth();

  // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDay = new Date(year, month, 1);
  let startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  // Convert so 0 = Monday, 6 = Sunday
  startDayOfWeek = (startDayOfWeek + 6) % 7;

  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Number of days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const events = getFilteredCalendarEvents();

  // 1. Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const cell = document.createElement('div');
    cell.className = 'min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl bg-slate-950/30 border border-slate-900/60 opacity-35 text-slate-600 flex flex-col justify-between';
    cell.innerHTML = `<span class="text-xs font-semibold">${dayNum}</span>`;
    grid.appendChild(cell);
  }

  // 2. Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${dayStr}`;
    const isToday = fullDateStr === todayStr;

    const dayEvents = events.filter(e => e.date === fullDateStr);

    const cell = document.createElement('div');
    cell.className = `min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border transition flex flex-col justify-between group cursor-pointer ${
      isToday 
        ? 'bg-purple-950/30 border-purple-500/70 shadow-lg shadow-purple-950/50' 
        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
    }`;

    cell.onclick = (e) => {
      // If clicked on an event pill, event handles it, otherwise open new event modal for this date
      if (e.target.closest('.cal-event-pill')) return;
      openNewCalendarEventModal(fullDateStr);
    };

    // Header of the day cell: day number + add button on hover
    let cellHeaderHtml = `
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold ${isToday ? 'text-cyan-300 bg-purple-500/30 px-1.5 py-0.2 rounded-full border border-purple-400/50' : 'text-slate-300'}">
          ${day} ${isToday ? '<span class="text-[9px] uppercase tracking-wider font-mono">HOY</span>' : ''}
        </span>
        <button onclick="openNewCalendarEventModal('${fullDateStr}')" title="Programar en este día" class="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-white bg-slate-800 transition">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>
    `;

    // Event pills inside the day cell
    let eventsHtml = '<div class="space-y-1 mt-1 overflow-hidden">';
    dayEvents.slice(0, 3).forEach(ev => {
      const typeInfo = getCalendarEventTypeInfo(ev.type);
      const isCompleted = ev.status === 'COMPLETADO';
      eventsHtml += `
        <div onclick="openEditCalendarEventModal('${ev.id}')" title="${escapeHtml(ev.time || '')} - ${escapeHtml(ev.title)} (${escapeHtml(ev.client)})" class="cal-event-pill flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
          isCompleted 
            ? 'bg-slate-900 text-slate-400 border-slate-800 line-through' 
            : `${typeInfo.bg} ${typeInfo.text} ${typeInfo.border}`
        } hover:scale-[1.02] transition cursor-pointer">
          <span>${typeInfo.icon}</span>
          <span class="font-mono text-[9px] opacity-80">${escapeHtml(ev.time || '')}</span>
          <span class="truncate">${escapeHtml(ev.title)}</span>
        </div>
      `;
    });

    if (dayEvents.length > 3) {
      eventsHtml += `
        <div class="text-[9px] font-bold text-slate-400 pl-1">
          +${dayEvents.length - 3} más...
        </div>
      `;
    }
    eventsHtml += '</div>';

    cell.innerHTML = cellHeaderHtml + eventsHtml;
    grid.appendChild(cell);
  }

  // 3. Next month trailing days to complete 35 or 42 cells grid
  const totalCellsSoFar = startDayOfWeek + daysInMonth;
  const targetTotal = totalCellsSoFar > 35 ? 42 : 35;
  const remainingCells = targetTotal - totalCellsSoFar;

  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    const cell = document.createElement('div');
    cell.className = 'min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl bg-slate-950/30 border border-slate-900/60 opacity-35 text-slate-600 flex flex-col justify-between';
    cell.innerHTML = `<span class="text-xs font-semibold">${nextDay}</span>`;
    grid.appendChild(cell);
  }
}

function renderCalendarListView() {
  const container = document.getElementById('calListEventsContainer');
  if (!container) return;
  container.innerHTML = '';

  const events = getFilteredCalendarEvents().slice().sort((a, b) => {
    const dtA = (a.date || '') + ' ' + (a.time || '00:00');
    const dtB = (b.date || '') + ' ' + (b.time || '00:00');
    return dtA.localeCompare(dtB);
  });

  if (events.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 p-6 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
          <i data-lucide="calendar" class="w-6 h-6"></i>
        </div>
        <h4 class="text-base font-bold text-white">No hay actividades programadas</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Comienza programando una jornada de rodaje, creación de guiones o publicación en redes.</p>
        <button onclick="openNewCalendarEventModal()" class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
          + Programar Actividad
        </button>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  events.forEach(ev => {
    const typeInfo = getCalendarEventTypeInfo(ev.type);
    const isCompleted = ev.status === 'COMPLETADO';
    const scriptLinked = ev.scriptId ? state.scripts.find(s => s.id === ev.scriptId) : null;

    const card = document.createElement('div');
    card.className = `bg-slate-900 border ${isCompleted ? 'border-emerald-500/30 bg-slate-950/60' : 'border-slate-800'} rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700`;

    card.innerHTML = `
      <div class="flex items-start gap-3.5 min-w-0 flex-1">
        <div class="w-10 h-10 rounded-xl ${typeInfo.bg} ${typeInfo.text} border ${typeInfo.border} flex items-center justify-center text-lg shrink-0 mt-0.5">
          ${typeInfo.icon}
        </div>
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">${escapeHtml(ev.client)}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-md ${typeInfo.bg} ${typeInfo.text} border ${typeInfo.border}">${typeInfo.label}</span>
            <span class="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md">
              📅 ${escapeHtml(ev.date || '')} · ⏰ ${escapeHtml(ev.time || '19:00')}
            </span>
            ${ev.platform ? `<span class="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">${escapeHtml(ev.platform)}</span>` : ''}
          </div>

          <h4 class="text-base font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'} leading-snug">
            ${escapeHtml(ev.title)}
          </h4>

          ${scriptLinked ? `
            <div class="text-xs text-purple-300 flex items-center gap-1 font-medium">
              <i data-lucide="file-text" class="w-3.5 h-3.5 text-purple-400"></i>
              <span>Guión vinculado: <strong>#${scriptLinked.number} - ${escapeHtml(scriptLinked.ideaGanadora)}</strong></span>
            </div>
          ` : ''}

          ${ev.notes ? `
            <p class="text-xs text-slate-400 line-clamp-2">${escapeHtml(ev.notes)}</p>
          ` : ''}
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <!-- Toggle Completed button -->
        <button onclick="toggleCalendarEventStatus('${ev.id}')" class="p-2 rounded-xl border ${
          isCompleted 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-emerald-300 hover:border-emerald-500/40'
        } transition cursor-pointer text-xs font-semibold flex items-center gap-1.5" title="Marcar como Completado / Publicado">
          <i data-lucide="${isCompleted ? 'check-circle' : 'circle'}" class="w-4 h-4"></i>
          <span>${isCompleted ? 'Completado' : 'Marcar Hecho'}</span>
        </button>

        <!-- Open in Google Calendar -->
        <button onclick="openInGoogleCalendar('${ev.id}')" title="Abrir en Google Calendar / Notificar por Gmail" class="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer">
          <i data-lucide="globe" class="w-4 h-4"></i>
        </button>

        <!-- Download iCal / Alarm for iPhone -->
        <button onclick="exportEventToICalendar('${ev.id}')" title="Descargar alarma nativa para iPhone / iPad / Apple Calendar" class="p-2 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer">
          <i data-lucide="smartphone" class="w-4 h-4"></i>
        </button>

        <!-- Edit -->
        <button onclick="openEditCalendarEventModal('${ev.id}')" title="Editar Actividad" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>

        <!-- Delete -->
        <button onclick="deleteCalendarEvent('${ev.id}')" title="Eliminar Actividad" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  refreshLucideIcons();
}

function getCalendarEventTypeInfo(type) {
  switch(type) {
    case 'RODAJE':
      return { label: 'Rodaje / Grabación', icon: '🎬', bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/30' };
    case 'CREACION':
      return { label: 'Creación de Guiones', icon: '💡', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' };
    case 'EDICION':
      return { label: 'Entrega Edición', icon: '💻', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' };
    case 'PUBLICACION':
    default:
      return { label: 'Publicación', icon: '🚀', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' };
  }
}

// CALENDAR MODAL CRUD
function openNewCalendarEventModal(dateStr = null) {
  activeEditingCalEventId = null;
  const modal = document.getElementById('calendarEventModal');
  const title = document.getElementById('calModalTitle');
  const btnDelete = document.getElementById('btnDeleteCalEvent');
  const form = document.getElementById('calendarEventForm');

  if (!modal) return;
  if (form) form.reset();

  if (title) title.innerHTML = `<i data-lucide="calendar-plus" class="w-5 h-5 text-purple-400"></i> Programar Actividad de Contenido`;
  if (btnDelete) btnDelete.classList.add('hidden');

  // Populate client selector
  populateCalendarModalClientSelect();

  // Set default date and time
  const defaultDate = dateStr || new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('calEventDate');
  const timeInput = document.getElementById('calEventTime');
  const idInput = document.getElementById('calEventId');

  if (idInput) idInput.value = '';
  if (dateInput) dateInput.value = defaultDate;
  if (timeInput) timeInput.value = '19:00';

  // Populate scripts dropdown for active client
  const clientSelect = document.getElementById('calEventClient');
  const client = clientSelect ? clientSelect.value : (state.clients[0] || 'Jennil');
  populateCalendarScriptSelect(client);

  modal.classList.remove('hidden');
  refreshLucideIcons();
}

function openEditCalendarEventModal(eventId) {
  const ev = (state.calendarEvents || []).find(e => e.id === eventId);
  if (!ev) return;

  activeEditingCalEventId = eventId;
  const modal = document.getElementById('calendarEventModal');
  const title = document.getElementById('calModalTitle');
  const btnDelete = document.getElementById('btnDeleteCalEvent');

  if (!modal) return;
  if (title) title.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-purple-400"></i> Editar Actividad Programada`;
  if (btnDelete) btnDelete.classList.remove('hidden');

  populateCalendarModalClientSelect(ev.client);

  document.getElementById('calEventId').value = ev.id;
  document.getElementById('calEventClient').value = ev.client;
  document.getElementById('calEventType').value = ev.type || 'PUBLICACION';
  document.getElementById('calEventTitle').value = ev.title || '';
  document.getElementById('calEventDate').value = ev.date || '';
  document.getElementById('calEventTime').value = ev.time || '19:00';
  document.getElementById('calEventPlatform').value = ev.platform || 'Instagram';
  document.getElementById('calEventStatus').value = ev.status || 'PROGRAMADO';
  document.getElementById('calEventReminder').value = ev.reminder || 'exact';
  document.getElementById('calEventNotes').value = ev.notes || '';

  populateCalendarScriptSelect(ev.client, ev.scriptId);

  modal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeCalendarEventModal() {
  const modal = document.getElementById('calendarEventModal');
  if (modal) modal.classList.add('hidden');
  activeEditingCalEventId = null;
}

function populateCalendarModalClientSelect(selectedClient = null) {
  const select = document.getElementById('calEventClient');
  if (!select) return;
  select.innerHTML = '';
  (state.clients || ['Jennil', 'Natalia']).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `👤 ${c}`;
    select.appendChild(opt);
  });
  if (selectedClient && state.clients.includes(selectedClient)) {
    select.value = selectedClient;
  }
}

function onCalendarClientChange() {
  const clientSelect = document.getElementById('calEventClient');
  const client = clientSelect ? clientSelect.value : (state.clients[0] || 'Jennil');
  populateCalendarScriptSelect(client);
}

function populateCalendarScriptSelect(clientName, selectedScriptId = null) {
  const select = document.getElementById('calEventScriptSelect');
  if (!select) return;
  select.innerHTML = '<option value="">-- Ninguno (Actividad libre o nuevo video) --</option>';

  const clientScripts = (state.scripts || []).filter(s => s.client === clientName);
  clientScripts.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `#${s.number || '?'} - ${s.ideaGanadora} (${s.status || 'Idea'})`;
    select.appendChild(opt);
  });

  if (selectedScriptId) {
    select.value = selectedScriptId;
  }
}

function onCalendarScriptSelectChange() {
  const select = document.getElementById('calEventScriptSelect');
  const titleInput = document.getElementById('calEventTitle');
  if (!select || !titleInput) return;

  const scriptId = select.value;
  if (scriptId) {
    const script = state.scripts.find(s => s.id === scriptId);
    if (script) {
      const type = document.getElementById('calEventType')?.value || 'PUBLICACION';
      const prefix = type === 'RODAJE' ? '🎬 Rodaje: ' : (type === 'CREACION' ? '💡 Redactar: ' : '🚀 Publicar: ');
      titleInput.value = `${prefix}#${script.number || ''} ${script.ideaGanadora}`;
    }
  }
}

function saveCalendarEvent() {
  const client = document.getElementById('calEventClient')?.value.trim() || 'Jennil';
  const type = document.getElementById('calEventType')?.value || 'PUBLICACION';
  const title = document.getElementById('calEventTitle')?.value.trim() || '';
  const date = document.getElementById('calEventDate')?.value || '';
  const time = document.getElementById('calEventTime')?.value || '19:00';
  const platform = document.getElementById('calEventPlatform')?.value || 'Instagram';
  const status = document.getElementById('calEventStatus')?.value || 'PROGRAMADO';
  const reminder = document.getElementById('calEventReminder')?.value || 'exact';
  const notes = document.getElementById('calEventNotes')?.value.trim() || '';
  const scriptId = document.getElementById('calEventScriptSelect')?.value || null;

  if (!title) {
    showToastNotification('⚠️ Por favor escribe el título de la actividad', 'alert-circle');
    return;
  }
  if (!date) {
    showToastNotification('⚠️ Por favor selecciona la fecha', 'alert-circle');
    return;
  }

  if (!state.calendarEvents) state.calendarEvents = [];

  const eventData = {
    id: activeEditingCalEventId || ('calevent-' + Date.now()),
    client: client,
    type: type,
    title: title,
    date: date,
    time: time,
    platform: platform,
    status: status,
    reminder: reminder,
    notes: notes,
    scriptId: scriptId,
    notified: false,
    updatedAt: new Date().toISOString()
  };

  if (activeEditingCalEventId) {
    const idx = state.calendarEvents.findIndex(e => e.id === activeEditingCalEventId);
    if (idx !== -1) {
      state.calendarEvents[idx] = { ...state.calendarEvents[idx], ...eventData };
    }
  } else {
    eventData.createdAt = new Date().toISOString();
    state.calendarEvents.push(eventData);
  }

  saveState();
  renderCalendarView();
  closeCalendarEventModal();
  showToastNotification('✅ Actividad programada en el calendario con éxito', 'check-circle');

  // Trigger automatic email dispatch to user and spouse Gmail
  dispatchEmailNotification(eventData);

  // Request browser notification permission proactively if reminder configured
  if (reminder !== 'none') {
    requestNotificationPermission();
  }
}

function deleteCurrentCalendarEvent() {
  if (activeEditingCalEventId) {
    deleteCalendarEvent(activeEditingCalEventId);
    closeCalendarEventModal();
  }
}

function deleteCalendarEvent(eventId) {
  if (confirm('¿Estás seguro de eliminar esta actividad del calendario?')) {
    state.calendarEvents = (state.calendarEvents || []).filter(e => e.id !== eventId);
    saveState();
    renderCalendarView();
    showToastNotification('Actividad eliminada del calendario.', 'trash-2');
  }
}

function toggleCalendarEventStatus(eventId) {
  const ev = (state.calendarEvents || []).find(e => e.id === eventId);
  if (ev) {
    ev.status = ev.status === 'COMPLETADO' ? 'PROGRAMADO' : 'COMPLETADO';
    saveState();
    renderCalendarView();
  }
}

// =========================================================================
// NOTIFICATIONS, GMAIL & MULTI-CHANNEL ALARM ENGINE (iPhone / Google / Web)
// =========================================================================

// Synthesizer Audio Chime (Web Audio API - Works everywhere without external audio files)
function playChimeSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Pleasant bright chime chord)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.11);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.11 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.11);
      osc.stop(ctx.currentTime + idx * 0.11 + 0.45);
    });
  } catch (e) {
    console.warn('Audio chime note:', e);
  }
}

// Request and Check Notification Permissions
function requestNotificationPermission(showFeedback = false) {
  if (typeof Notification !== 'undefined') {
    Notification.requestPermission().then(permission => {
      updatePushPermissionBadge();
      if (showFeedback) {
        if (permission === 'granted') {
          showToastNotification('🔔 ¡Notificaciones activadas con éxito!', 'check-circle');
          testStudioAlarmNotification();
        } else if (permission === 'denied') {
          showToastNotification('⚠️ Permiso denegado en el navegador. Revisa la configuración del sitio.', 'alert-circle');
        }
      }
    });
  } else {
    if (showFeedback) {
      showToastNotification('ℹ️ Este navegador no soporta notificaciones push web.', 'info');
    }
  }
}

function updatePushPermissionBadge() {
  const badge = document.getElementById('pushPermissionBadge');
  if (!badge) return;

  if (typeof Notification === 'undefined') {
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700';
    badge.textContent = 'No soportado';
    return;
  }

  const perm = Notification.permission;
  if (perm === 'granted') {
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    badge.textContent = '✅ Activo / Permitido';
  } else if (perm === 'denied') {
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40';
    badge.textContent = '❌ Bloqueado en Navegador';
  } else {
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40';
    badge.textContent = '🟡 Pendiente de Aprobación';
  }
}

// Notification Hub Modal
function openNotificationHubModal() {
  const modal = document.getElementById('notificationHubModal');
  if (!modal) return;

  // Load saved Gmails (Primary + Wife)
  const email1Input = document.getElementById('userNotificationEmail');
  const email2Input = document.getElementById('partnerNotificationEmail');
  const inlineFeedback = document.getElementById('emailSaveInlineFeedback');
  const inlineText = document.getElementById('emailSaveInlineText');

  const e1 = localStorage.getItem('blex_user_email') || (state.notificationEmails && state.notificationEmails.primary) || '';
  const e2 = localStorage.getItem('blex_partner_email') || (state.notificationEmails && state.notificationEmails.secondary) || '';

  if (email1Input) email1Input.value = e1;
  if (email2Input) email2Input.value = e2;

  if (inlineFeedback && inlineText && (e1 || e2)) {
    let summary = '✅ Correos activos en la nube: ';
    if (e1 && e2) summary += `${e1} y ${e2}`;
    else if (e1) summary += e1;
    else if (e2) summary += e2;
    inlineText.textContent = summary;
    inlineFeedback.classList.remove('hidden');
  } else if (inlineFeedback) {
    inlineFeedback.classList.add('hidden');
  }

  updatePushPermissionBadge();
  modal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeNotificationHubModal(e = null) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('notificationHubModal');
  if (modal) modal.classList.add('hidden');
}

function saveUserNotificationEmails() {
  const email1Input = document.getElementById('userNotificationEmail');
  const email2Input = document.getElementById('partnerNotificationEmail');
  const btnSave = document.getElementById('btnSaveEmailsHub');
  const btnText = document.getElementById('btnSaveEmailsHubText');
  const inlineFeedback = document.getElementById('emailSaveInlineFeedback');
  const inlineText = document.getElementById('emailSaveInlineText');

  const email1 = email1Input ? email1Input.value.trim() : '';
  const email2 = email2Input ? email2Input.value.trim() : '';

  if (email1 && !email1.includes('@')) {
    showToastNotification('⚠️ El correo principal debe contener un formato válido (@)', 'alert-circle');
    if (email1Input) email1Input.focus();
    return;
  }
  if (email2 && !email2.includes('@')) {
    showToastNotification('⚠️ El correo de tu esposa debe contener un formato válido (@)', 'alert-circle');
    if (email2Input) email2Input.focus();
    return;
  }

  // Persist locally and in synced cloud state
  localStorage.setItem('blex_user_email', email1);
  localStorage.setItem('blex_partner_email', email2);

  if (!state.notificationEmails) state.notificationEmails = {};
  state.notificationEmails = {
    primary: email1,
    secondary: email2
  };
  saveState();

  // Play audio confirmation chime
  if (typeof playChimeSound === 'function') playChimeSound();

  // High visibility button feedback
  if (btnSave && btnText) {
    btnSave.className = "bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-xs shadow-lg shadow-emerald-950/80 flex items-center gap-1.5 animate-pulse";
    btnText.textContent = "✅ ¡Guardados con Éxito!";
  }

  // Inline feedback box
  if (inlineFeedback && inlineText) {
    let summary = '✅ Correos guardados en la nube: ';
    if (email1 && email2) summary += `${email1} y ${email2}`;
    else if (email1) summary += email1;
    else if (email2) summary += email2;
    else summary = 'Se han borrado los correos.';

    inlineText.textContent = summary;
    inlineFeedback.classList.remove('hidden');
  }

  showToastNotification('✅ ¡Correos guardados y sincronizados en la nube!', 'check-circle');

  // Reset button state after 3 seconds
  setTimeout(() => {
    if (btnSave && btnText) {
      btnSave.className = "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-xs shadow-md flex items-center gap-1.5 active:scale-95";
      btnText.textContent = "Guardar Ambos Correos";
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }, 3500);
}

// Alias for backwards compatibility
function saveUserNotificationEmail() {
  saveUserNotificationEmails();
}

// Google Calendar URL Generator
function buildGoogleCalendarUrl(ev) {
  if (!ev || !ev.date) return '#';
  const dateClean = ev.date.replace(/-/g, '');
  const timeClean = (ev.time || '19:00').replace(':', '') + '00';
  const start = `${dateClean}T${timeClean}`;

  const startDate = new Date(`${ev.date}T${ev.time || '19:00'}:00`);
  const endDate = new Date(startDate.getTime() + 60 * 60000);
  const endHour = String(endDate.getHours()).padStart(2, '0');
  const endMin = String(endDate.getMinutes()).padStart(2, '0');
  const end = `${dateClean}T${endHour}${endMin}00`;

  const title = encodeURIComponent(`[${ev.client}] ${ev.title}`);
  const userEmail = localStorage.getItem('blex_user_email') || (state.notificationEmails && state.notificationEmails.primary) || '';
  const partnerEmail = localStorage.getItem('blex_partner_email') || (state.notificationEmails && state.notificationEmails.secondary) || '';
  const details = encodeURIComponent(`Tipo de Actividad: ${ev.type}\nCliente: ${ev.client}\nPlataforma: ${ev.platform || 'General'}\nNotas: ${ev.notes || 'Sin notas'}\n\nOrganizado desde BLEX Content Script Studio`);

  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  if (userEmail) {
    url += `&add=${encodeURIComponent(userEmail)}`;
  }
  if (partnerEmail) {
    url += `&add=${encodeURIComponent(partnerEmail)}`;
  }
  return url;
}

function openInGoogleCalendar(eventId) {
  const ev = (state.calendarEvents || []).find(e => e.id === eventId);
  if (!ev) return;
  const url = buildGoogleCalendarUrl(ev);
  window.open(url, '_blank');
}

function saveAndOpenGoogleCalendar() {
  saveCalendarEvent();
  const latestEvent = state.calendarEvents[state.calendarEvents.length - 1];
  if (latestEvent) {
    const url = buildGoogleCalendarUrl(latestEvent);
    window.open(url, '_blank');
  }
}

function saveAndDownloadIPhoneAlarm() {
  saveCalendarEvent();
  const latestEvent = state.calendarEvents[state.calendarEvents.length - 1];
  if (latestEvent) {
    exportEventToICalendar(latestEvent.id);
  }
}

// In-App Alarm Alert Popup Modal
function showInAppAlarmModal(ev) {
  const modal = document.getElementById('inAppAlarmModal');
  const titleEl = document.getElementById('alarmModalTitle');
  const metaEl = document.getElementById('alarmModalMeta');
  const notesBox = document.getElementById('alarmModalNotesBox');
  const notesEl = document.getElementById('alarmModalNotes');
  const btnDone = document.getElementById('btnAlarmMarkDone');
  const btnSnooze = document.getElementById('btnAlarmSnooze');

  if (!modal) return;

  playChimeSound();

  if (titleEl) titleEl.textContent = ev.title || 'Actividad Programada';
  if (metaEl) metaEl.textContent = `Cliente: ${ev.client} · ⏰ ${ev.time || '19:00'} · ${ev.platform || 'General'}`;

  if (notesBox && notesEl) {
    if (ev.notes) {
      notesEl.textContent = ev.notes;
      notesBox.classList.remove('hidden');
    } else {
      notesBox.classList.add('hidden');
    }
  }

  if (btnDone) {
    btnDone.onclick = () => {
      if (ev.id) toggleCalendarEventStatus(ev.id);
      closeInAppAlarmModal();
      showToastNotification('🎉 ¡Actividad marcada como completada!', 'check-circle');
    };
  }

  if (btnSnooze) {
    btnSnooze.onclick = () => {
      closeInAppAlarmModal();
      showToastNotification('⏰ Alarma pospuesta por 15 minutos.', 'clock');
      // Set a temporary 15 min reminder
      setTimeout(() => {
        showInAppAlarmModal(ev);
      }, 15 * 60000);
    };
  }

  modal.classList.remove('hidden');
  refreshLucideIcons();
}

function closeInAppAlarmModal() {
  const modal = document.getElementById('inAppAlarmModal');
  if (modal) modal.classList.add('hidden');
}

// Test Alarm & Sound System
function testStudioAlarmNotification() {
  playChimeSound();

  const sampleEvent = {
    id: 'test-sample',
    title: '🚀 ¡Prueba de Alarma BLEX Studio!',
    client: (state.clients && state.clients[0]) || 'Jennil',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    platform: 'Instagram Reels',
    notes: '¡Esta es una prueba exitosa! Tu sonido de alerta y notificación visual están funcionando a la perfección.'
  };

  // Push notification if permitted
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification('🔔 BLEX Studio - Alarma de Prueba', {
        body: '¡Sonido y notificaciones activados y funcionando correctamente!',
        icon: 'logo.png'
      });
    } catch (e) {}
  }

  // Open in-app popup
  showInAppAlarmModal(sampleEvent);
  showToastNotification('🔊 Alarma de prueba ejecutada con éxito', 'volume-2');
}

// Background upcoming notification scheduler check
function checkUpcomingNotifications() {
  if (!state.calendarEvents || state.calendarEvents.length === 0) return;
  const now = new Date();

  state.calendarEvents.forEach(ev => {
    if (ev.status === 'COMPLETADO' || ev.notified || ev.reminder === 'none') return;
    if (!ev.date || !ev.time) return;

    const eventDateTime = new Date(`${ev.date}T${ev.time}:00`);
    if (isNaN(eventDateTime.getTime())) return;

    let targetTime = new Date(eventDateTime);
    if (ev.reminder === '15min') {
      targetTime = new Date(eventDateTime.getTime() - 15 * 60000);
    } else if (ev.reminder === '1hour') {
      targetTime = new Date(eventDateTime.getTime() - 60 * 60000);
    } else if (ev.reminder === '1day') {
      targetTime = new Date(eventDateTime.getTime() - 24 * 60 * 60000);
    }

    const diffMinutes = (now - targetTime) / 60000;

    // Trigger if within 0 to 5 minutes window
    if (diffMinutes >= 0 && diffMinutes <= 5) {
      ev.notified = true;
      saveState();
      triggerAlarmNotification(ev);
    }
  });
}

function triggerAlarmNotification(ev) {
  const typeInfo = getCalendarEventTypeInfo(ev.type);
  const title = `🔔 RECORDATORIO BLEX: ${typeInfo.icon} ${ev.title}`;
  const body = `Cliente: ${ev.client} | Fecha: ${ev.date} a las ${ev.time} (${ev.platform || 'General'})`;

  // Native Browser Notification
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: 'logo.png'
      });
    } catch (e) {}
  }

  // In-App Alarm Popup with Chime Sound
  showInAppAlarmModal(ev);
  showToastNotification(`🔔 ${ev.title} (${ev.client} - ${ev.time})`, 'bell');
}

// Run notification check every 60 seconds
setInterval(checkUpcomingNotifications, 60000);

function exportEventToICalendar(eventId) {
  const ev = (state.calendarEvents || []).find(e => e.id === eventId);
  if (!ev) return;
  generateAndDownloadICS([ev], `evento-${ev.date}-${ev.client}.ics`);
}

function exportAllCalendarToICalendar() {
  const events = state.calendarEvents || [];
  if (events.length === 0) {
    alert('No hay actividades programadas para exportar.');
    return;
  }
  generateAndDownloadICS(events, `calendario-completo-blex-${calCurrentDate.getFullYear()}.ics`);
}

function generateAndDownloadICS(eventsList, filename) {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BLEX STUDIO//Content Calendar Engine//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:BLEX STUDIO - Calendario de Contenidos'
  ];

  eventsList.forEach(ev => {
    if (!ev.date) return;
    const timeStr = (ev.time || '19:00').replace(':', '') + '00';
    const dateFormatted = ev.date.replace(/-/g, '');
    const dtStart = `${dateFormatted}T${timeStr}`;
    
    // Add 1 hour duration
    const startDate = new Date(`${ev.date}T${ev.time || '19:00'}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60000);
    const endFormatted = endDate.toISOString().split('T')[0].replace(/-/g, '') + 'T' + String(endDate.getHours()).padStart(2, '0') + String(endDate.getMinutes()).padStart(2, '0') + '00';

    const uid = (ev.id || 'event-' + Date.now()) + '@content-script-studio.vercel.app';
    const summary = `[${ev.client}] ${ev.title}`;
    const description = `Tipo: ${ev.type}\nPlataforma: ${ev.platform || 'N/A'}\nNotas: ${ev.notes || 'Sin notas'}\n\nOrganizado en BLEX Content Script Studio`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${uid}`);
    icsContent.push(`DTSTAMP:${dateFormatted}T000000Z`);
    icsContent.push(`DTSTART:${dtStart}`);
    icsContent.push(`DTEND:${endFormatted}`);
    icsContent.push(`SUMMARY:${summary}`);
    icsContent.push(`DESCRIPTION:${description}`);
    icsContent.push('STATUS:CONFIRMED');

    // Add Alarm Trigger for iPhone / Mac / Google Calendar
    icsContent.push('BEGIN:VALARM');
    icsContent.push('ACTION:DISPLAY');
    icsContent.push(`DESCRIPTION:Recordatorio BLEX: ${summary}`);
    if (ev.reminder === '15min') {
      icsContent.push('TRIGGER:-PT15M');
    } else if (ev.reminder === '1hour') {
      icsContent.push('TRIGGER:-PT1H');
    } else if (ev.reminder === '1day') {
      icsContent.push('TRIGGER:-P1D');
    } else {
      icsContent.push('TRIGGER:-PT0M');
    }
    icsContent.push('END:VALARM');

    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToastNotification('📅 Archivo de calendario descargado con alarma para iPhone/Google', 'download');
}


// Register Service Worker for PWA Push Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('✅ ServiceWorker registrado con éxito:', reg.scope);
      })
      .catch(err => {
        console.warn('⚠️ Error al registrar ServiceWorker:', err);
      });
  });
}

// Check if mobile banner should be shown
function checkMobileNotificationBanner() {
  const banner = document.getElementById('mobileNotificationBanner');
  if (!banner) return;

  const dismissed = sessionStorage.getItem('blex_banner_dismissed');
  if (dismissed) {
    banner.classList.add('hidden');
    return;
  }

  if (typeof Notification !== 'undefined') {
    if (Notification.permission === 'granted') {
      banner.classList.add('hidden');
    } else {
      banner.classList.remove('hidden');
    }
  } else {
    banner.classList.add('hidden');
  }
}

function dismissMobileBanner() {
  sessionStorage.setItem('blex_banner_dismissed', 'true');
  const banner = document.getElementById('mobileNotificationBanner');
  if (banner) banner.classList.add('hidden');
}

function activateMobilePushPermission() {
  if (typeof Notification !== 'undefined') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        const banner = document.getElementById('mobileNotificationBanner');
        if (banner) banner.classList.add('hidden');
        showToastNotification('🎉 ¡Notificaciones activadas en este dispositivo!', 'check-circle');
        testStudioAlarmNotification();
      } else {
        showToastNotification('⚠️ Permiso no concedido. Revisa los ajustes de tu navegador.', 'alert-circle');
      }
    });
  } else {
    showToastNotification('ℹ️ Este dispositivo no admite notificaciones web push.', 'info');
  }
}

// Subscribe Apple / Google Calendar Live Feed (webcal://)
function subscribeLiveCalendarFeed() {
  const host = window.location.host;
  const webcalUrl = 'webcal://' + host + '/api/calendar';
  const httpsUrl = 'https://' + host + '/api/calendar';

  // Try opening webcal:// protocol for native Apple Calendar subscription on iOS/Mac
  window.location.href = webcalUrl;
  
  // Also provide fallback toast and modal
  setTimeout(() => {
    showToastNotification('📲 Abriendo suscripción de calendario para tus 2 celulares y iPad...', 'smartphone');
  }, 1000);
}

// Run banner check after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(checkMobileNotificationBanner, 1500);
});


// Automatic Email Dispatcher via Serverless API
async function dispatchEmailNotification(ev) {
  const email1 = localStorage.getItem('blex_user_email') || (state.notificationEmails && state.notificationEmails.primary) || '';
  const email2 = localStorage.getItem('blex_partner_email') || (state.notificationEmails && state.notificationEmails.secondary) || '';

  const emails = [email1, email2].filter(e => e && e.includes('@'));
  if (emails.length === 0) return;

  try {
    const payload = {
      emails: emails,
      title: ev.title || 'Actividad Programada',
      client: ev.client || 'General',
      date: ev.date || '',
      time: ev.time || '19:00',
      platform: ev.platform || 'Instagram',
      notes: ev.notes || ''
    };

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
      console.log('📧 Email dispatch status:', data);
    }).catch(err => {
      console.warn('Email dispatch warning:', err);
    });
  } catch (e) {
    console.warn('Dispatch error:', e);
  }
}

async function testEmailDispatch() {
  const email1Input = document.getElementById('userNotificationEmail');
  const email2Input = document.getElementById('partnerNotificationEmail');

  const email1 = (email1Input ? email1Input.value.trim() : '') || localStorage.getItem('blex_user_email') || '';
  const email2 = (email2Input ? email2Input.value.trim() : '') || localStorage.getItem('blex_partner_email') || '';

  const emails = [email1, email2].filter(e => e && e.includes('@'));

  if (emails.length === 0) {
    showToastNotification('⚠️ Primero ingresa al menos un correo de Gmail', 'alert-circle');
    return;
  }

  showToastNotification('📤 Enviando correo de prueba a Gmail...', 'send');

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emails: emails,
        title: '🚀 ¡Prueba Exitosa de Notificación BLEX Studio!',
        client: (state.clients && state.clients[0]) || 'Jennil',
        date: new Date().toLocaleDateString('es-CO'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        platform: 'Instagram Reels / TikTok',
        notes: '¡Hola! Este correo confirma que tus notificaciones y recordatorios de contenido están 100% activos y funcionando.'
      })
    });

    const data = await res.json();
    if (data.success) {
      showToastNotification(`✅ Correo enviado con éxito a: ${emails.join(', ')}. ¡Revisa tu bandeja de entrada!`, 'check-circle');
    } else {
      showToastNotification('⚠️ Error al enviar correo. Revisa que el correo esté bien escrito.', 'alert-circle');
    }
  } catch (err) {
    showToastNotification('⚠️ No se pudo conectar con el servidor de correo.', 'alert-circle');
  }
}
