document.addEventListener('DOMContentLoaded', init);

async function init() {
    setFormURLs();

    // Cargar datos base
    const grupos = await loadGrupos();
    const miembros = await loadMiembros();

    // Cargar postulaciones aprobadas y fusionar con miembros
    const postulacionesAprobadas = await loadPostulacionesAprobadas();
    const todosLosMiembros = mergeMiembros(miembros, postulacionesAprobadas);

    // Cargar solicitudes de nuevos grupos aprobadas y fusionar con grupos
    const nuevosGruposAprobados = await loadNuevosGruposAprobados();
    const todosLosGrupos = mergeGrupos(grupos, nuevosGruposAprobados);

    renderStats(todosLosGrupos, todosLosMiembros);
    renderGroups(todosLosGrupos, todosLosMiembros);
}

function setFormURLs() {
    const btnNuevo = document.getElementById('btn-nuevo-grupo');
    const btnNuevoFooter = document.getElementById('btn-nuevo-grupo-footer');
    if (btnNuevo) btnNuevo.href = CONFIG.FORM_NUEVO_GRUPO;
    if (btnNuevoFooter) btnNuevoFooter.href = CONFIG.FORM_NUEVO_GRUPO;
}

// === DATA LOADING ===

async function loadGrupos() {
    if (CONFIG.SHEET_ID === 'PENDING_SHEET_ID') return CONFIG.FALLBACK_GRUPOS;
    const data = await fetchSheetCSV(CONFIG.GRUPOS_CSV_URL);
    return data && data.length > 0 ? data : CONFIG.FALLBACK_GRUPOS;
}

async function loadMiembros() {
    if (CONFIG.SHEET_ID === 'PENDING_SHEET_ID') return CONFIG.FALLBACK_MIEMBROS;
    const data = await fetchSheetCSV(CONFIG.MIEMBROS_CSV_URL);
    return data && data.length > 0 ? data : CONFIG.FALLBACK_MIEMBROS;
}

async function loadPostulacionesAprobadas() {
    if (CONFIG.SHEET_ID === 'PENDING_SHEET_ID') return [];
    const data = await fetchSheetCSV(CONFIG.POSTULACIONES_CSV_URL);
    if (!data) return [];
    return data.filter(function(row) {
        return row.estado && row.estado.trim().toLowerCase() === 'aprobado';
    });
}

async function loadNuevosGruposAprobados() {
    if (CONFIG.SHEET_ID === 'PENDING_SHEET_ID') return [];
    const data = await fetchSheetCSV(CONFIG.SOLICITUDES_CSV_URL);
    if (!data) return [];
    return data.filter(function(row) {
        return row.estado && row.estado.trim().toLowerCase() === 'aprobado';
    });
}

// === MERGE LOGIC ===

function mergeMiembros(miembrosBase, postulacionesAprobadas) {
    var merged = miembrosBase.slice();

    postulacionesAprobadas.forEach(function(p) {
        // Extraer grupo_id del campo "Grupo al que postula" (formato: "G002 — Dr. Nombre")
        var grupoId = extractGrupoId(p['Grupo al que postula'] || '');
        if (!grupoId) return;

        // Evitar duplicados: si ya existe en miembros base, no agregar
        var nombre = (p['Nombre completo'] || '').trim();
        var yaExiste = merged.some(function(m) {
            return m.grupo_id === grupoId && m.nombre === nombre;
        });
        if (yaExiste) return;

        merged.push({
            grupo_id: grupoId,
            nombre: nombre,
            ciclo: p['Ciclo actual'] || '',
            fecha_ingreso: formatTimestamp(p['Marca temporal'] || ''),
            rol: 'Miembro'
        });
    });

    return merged;
}

function mergeGrupos(gruposBase, solicitudesAprobadas) {
    var merged = gruposBase.slice();

    solicitudesAprobadas.forEach(function(s) {
        var grupoId = (s['grupo_id_asignado'] || '').trim();
        if (!grupoId) return;

        // Evitar duplicados
        var yaExiste = merged.some(function(g) { return g.grupo_id === grupoId; });
        if (yaExiste) return;

        merged.push({
            grupo_id: grupoId,
            docente_nombre: s['Nombre completo del docente sembrador propuesto'] || '',
            docente_grado: s['Grado académico del docente'] || s['Grado académico'] || '',
            linea_investigacion: s['Línea de investigación propuesta'] || s['Línea de investigación'] || 'General',
            coordinador_nombre: s['Nombre del coordinador estudiantil propuesto'] || s['Nombre completo del coordinador estudiantil propuesto'] || '',
            coordinador_ciclo: s['Ciclo actual del coordinador'] || s['Ciclo del coordinador'] || '',
            cupos_max: '20',
            estado: 'En formación'
        });
    });

    return merged;
}

// === HELPERS ===

function extractGrupoId(text) {
    // "G002 — Dr. Anicama..." → "G002"
    var match = text.match(/^(G\d{3})/);
    return match ? match[1] : '';
}

function formatTimestamp(ts) {
    if (!ts) return '';
    // Google Forms timestamp: "4/9/2026 1:30:00" → "2026-04-09"
    try {
        var d = new Date(ts);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
}

// === RENDERING ===

function renderStats(grupos, miembros) {
    var totalGrupos = grupos.length;
    var totalDocentes = new Set(grupos.map(function(g) { return g.docente_nombre; })).size;
    var totalMiembros = miembros.length;
    var totalCupos = grupos.reduce(function(sum, g) { return sum + (parseInt(g.cupos_max) || 20); }, 0) - totalMiembros;

    document.getElementById('stat-grupos').textContent = totalGrupos;
    document.getElementById('stat-docentes').textContent = totalDocentes;
    document.getElementById('stat-miembros').textContent = totalMiembros;
    document.getElementById('stat-cupos').textContent = Math.max(0, totalCupos);
}

function renderGroups(grupos, miembros) {
    var container = document.getElementById('groups-container');
    container.innerHTML = '';

    if (grupos.length === 0) {
        container.innerHTML = '<div class="error-msg">No se encontraron grupos de semillero.</div>';
        return;
    }

    grupos.forEach(function(grupo) {
        var grupoMiembros = miembros.filter(function(m) { return m.grupo_id === grupo.grupo_id; });
        var card = createGroupCard(grupo, grupoMiembros);
        container.appendChild(card);
    });
}

function createGroupCard(grupo, miembros) {
    var card = document.createElement('div');
    card.className = 'group-card';

    var totalMiembros = miembros.length;
    var cuposMax = parseInt(grupo.cupos_max) || 20;
    var cuposDisp = cuposMax - totalMiembros;

    var badgeClass = getBadgeClass(grupo.estado);
    var coordinadorText = grupo.coordinador_nombre
        ? grupo.coordinador_nombre + ' — ' + grupo.coordinador_ciclo + ' Ciclo'
        : 'Sin asignar';

    var membersHTML = '';
    if (miembros.length > 0) {
        var memberRows = miembros.map(function(m) {
            var rolClass = m.rol === 'Coordinador' ? ' member-rol-coord' : '';
            var rolTag = m.rol === 'Coordinador' ? ' (Coord.)' : '';
            return '<div class="member-row">' +
                '<span class="member-name' + rolClass + '">' + m.nombre + rolTag + '</span>' +
                '<span class="member-ciclo">' + m.ciclo + ' Ciclo</span>' +
            '</div>';
        }).join('');

        membersHTML =
            '<button class="members-toggle" onclick="toggleMembers(this)" aria-expanded="false">' +
                'Ver miembros (' + totalMiembros + ')' +
            '</button>' +
            '<div class="members-list">' + memberRows + '</div>';
    } else {
        membersHTML = '<p style="font-size:0.85rem; color:var(--color-text-muted);">Abierto a postulaciones</p>';
    }

    var postularURL = buildPostularURL(grupo.grupo_id, grupo.docente_nombre);

    card.innerHTML =
        '<div class="card-header">' +
            '<div class="docente">' + grupo.docente_grado + ' ' + grupo.docente_nombre + '</div>' +
            '<div class="linea">' + grupo.linea_investigacion + '</div>' +
        '</div>' +
        '<div class="card-body">' +
            '<div class="card-field">' +
                '<div class="field-label">Estado</div>' +
                '<div class="field-value"><span class="badge ' + badgeClass + '">' + grupo.estado + '</span></div>' +
            '</div>' +
            '<div class="card-field">' +
                '<div class="field-label">Coordinador estudiantil</div>' +
                '<div class="field-value">' + coordinadorText + '</div>' +
            '</div>' +
            '<div class="card-field">' +
                '<div class="field-label">Cupos</div>' +
                '<div class="field-value">' + totalMiembros + ' / ' + cuposMax + ' ' + (cuposDisp > 0 ? '(' + cuposDisp + ' disponibles)' : '(Completo)') + '</div>' +
            '</div>' +
            '<div class="card-field">' +
                '<div class="field-label">Miembros</div>' +
                membersHTML +
            '</div>' +
            '<a href="' + postularURL + '" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-card">' +
                'Postular a este grupo' +
            '</a>' +
        '</div>';

    return card;
}

function getBadgeClass(estado) {
    if (!estado) return 'badge-formacion';
    var lower = estado.toLowerCase();
    if (lower.indexOf('activo') !== -1) return 'badge-activo';
    if (lower.indexOf('buscando') !== -1) return 'badge-buscando';
    return 'badge-formacion';
}

function buildPostularURL(grupoId, docenteNombre) {
    if (CONFIG.FORM_POSTULAR === 'PENDING_FORM_URL') return '#';
    var prefill = CONFIG.FORM_POSTULAR_ENTRY_GRUPO + '=' + encodeURIComponent(grupoId + ' — ' + docenteNombre);
    return CONFIG.FORM_POSTULAR + '?' + prefill;
}

function toggleMembers(btn) {
    var list = btn.nextElementSibling;
    list.classList.toggle('open');
    var count = list.querySelectorAll('.member-row').length;
    var isOpen = list.classList.contains('open');
    btn.textContent = isOpen
        ? 'Ocultar miembros (' + count + ')'
        : 'Ver miembros (' + count + ')';
    btn.setAttribute('aria-expanded', isOpen);
}
