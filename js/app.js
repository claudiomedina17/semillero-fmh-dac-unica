document.addEventListener('DOMContentLoaded', init);

async function init() {
    setFormURLs();
    const grupos = await loadGrupos();
    const miembros = await loadMiembros();
    renderStats(grupos, miembros);
    renderGroups(grupos, miembros);
}

function setFormURLs() {
    const btnNuevo = document.getElementById('btn-nuevo-grupo');
    const btnNuevoFooter = document.getElementById('btn-nuevo-grupo-footer');
    if (btnNuevo) btnNuevo.href = CONFIG.FORM_NUEVO_GRUPO;
    if (btnNuevoFooter) btnNuevoFooter.href = CONFIG.FORM_NUEVO_GRUPO;
}

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

function renderStats(grupos, miembros) {
    const totalGrupos = grupos.length;
    const totalDocentes = new Set(grupos.map(g => g.docente_nombre)).size;
    const totalMiembros = miembros.length;
    const totalCupos = grupos.reduce((sum, g) => sum + (parseInt(g.cupos_max) || 20), 0) - totalMiembros;

    document.getElementById('stat-grupos').textContent = totalGrupos;
    document.getElementById('stat-docentes').textContent = totalDocentes;
    document.getElementById('stat-miembros').textContent = totalMiembros;
    document.getElementById('stat-cupos').textContent = Math.max(0, totalCupos);
}

function renderGroups(grupos, miembros) {
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    if (grupos.length === 0) {
        container.innerHTML = '<div class="error-msg">No se encontraron grupos de semillero.</div>';
        return;
    }

    grupos.forEach(grupo => {
        const grupoMiembros = miembros.filter(m => m.grupo_id === grupo.grupo_id);
        const card = createGroupCard(grupo, grupoMiembros);
        container.appendChild(card);
    });
}

function createGroupCard(grupo, miembros) {
    const card = document.createElement('div');
    card.className = 'group-card';

    const totalMiembros = miembros.length;
    const cuposMax = parseInt(grupo.cupos_max) || 20;
    const cuposDisp = cuposMax - totalMiembros;

    const badgeClass = getBadgeClass(grupo.estado);
    const coordinadorText = grupo.coordinador_nombre
        ? `${grupo.coordinador_nombre} — ${grupo.coordinador_ciclo} Ciclo`
        : 'Sin asignar';

    let membersHTML = '';
    if (miembros.length > 0) {
        const memberRows = miembros.map(m => {
            const rolClass = m.rol === 'Coordinador' ? ' member-rol-coord' : '';
            const rolTag = m.rol === 'Coordinador' ? ' (Coord.)' : '';
            return `<div class="member-row">
                <span class="member-name${rolClass}">${m.nombre}${rolTag}</span>
                <span class="member-ciclo">${m.ciclo} Ciclo</span>
            </div>`;
        }).join('');

        membersHTML = `
            <button class="members-toggle" onclick="toggleMembers(this)">
                Ver miembros (${totalMiembros})
            </button>
            <div class="members-list">
                ${memberRows}
            </div>
        `;
    } else {
        membersHTML = '<p style="font-size:0.85rem; color:var(--color-text-light);">Abierto a postulaciones</p>';
    }

    const postularURL = buildPostularURL(grupo.grupo_id, grupo.docente_nombre);

    card.innerHTML = `
        <div class="card-header">
            <div class="docente">${grupo.docente_grado} ${grupo.docente_nombre}</div>
            <div class="linea">${grupo.linea_investigacion}</div>
        </div>
        <div class="card-body">
            <div class="card-field">
                <div class="field-label">Estado</div>
                <div class="field-value"><span class="badge ${badgeClass}">${grupo.estado}</span></div>
            </div>
            <div class="card-field">
                <div class="field-label">Coordinador estudiantil</div>
                <div class="field-value">${coordinadorText}</div>
            </div>
            <div class="card-field">
                <div class="field-label">Cupos</div>
                <div class="field-value">${totalMiembros} / ${cuposMax} ${cuposDisp > 0 ? `(${cuposDisp} disponibles)` : '(Completo)'}</div>
            </div>
            <div class="card-field">
                <div class="field-label">Miembros</div>
                ${membersHTML}
            </div>
            <a href="${postularURL}" target="_blank" class="btn btn-outline btn-card">
                Postular a este grupo
            </a>
        </div>
    `;

    return card;
}

function getBadgeClass(estado) {
    if (!estado) return 'badge-formacion';
    const lower = estado.toLowerCase();
    if (lower.includes('activo')) return 'badge-activo';
    if (lower.includes('buscando')) return 'badge-buscando';
    return 'badge-formacion';
}

function buildPostularURL(grupoId, docenteNombre) {
    if (CONFIG.FORM_POSTULAR === 'PENDING_FORM_URL') return '#';
    const prefill = `${CONFIG.FORM_POSTULAR_ENTRY_GRUPO}=${encodeURIComponent(grupoId + ' - ' + docenteNombre)}`;
    return `${CONFIG.FORM_POSTULAR}?${prefill}`;
}

function toggleMembers(btn) {
    const list = btn.nextElementSibling;
    list.classList.toggle('open');
    const count = list.querySelectorAll('.member-row').length;
    btn.textContent = list.classList.contains('open')
        ? `Ocultar miembros (${count})`
        : `Ver miembros (${count})`;
}
