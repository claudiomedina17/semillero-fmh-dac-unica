const CONFIG = {
    SHEET_ID: '1Y0nci5dEqhwUsx1zWbdghd5l4lrkb_VLUlZtP38gJ8Y',

    get GRUPOS_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Grupos`;
    },

    get MIEMBROS_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Miembros`;
    },

    get POSTULACIONES_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Postulaciones`;
    },

    // Hojas de aprobación por grupo (creadas por setup_vistas_coordinadores.gs)
    aprobacionesURL(grupoId) {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Aprobaciones_${grupoId}`;
    },

    get SOLICITUDES_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Solicitudes_Nuevo_Grupo`;
    },

    FORM_NUEVO_GRUPO: 'https://docs.google.com/forms/d/e/1FAIpQLScctwO0rjbru4bI3XcKXCf7b42l3qwPwVoN2vrjtrve30we5g/viewform',
    FORM_POSTULAR: 'https://docs.google.com/forms/d/e/1FAIpQLSfIntJ7RT_MRKvTzYumYTy9_nnrOuKRHUJbE4V37Yn83UX1yA/viewform',
    FORM_POSTULAR_ENTRY_GRUPO: 'entry.1395910596',

    FALLBACK_GRUPOS: [
        {
            grupo_id: 'G001',
            docente_nombre: 'Flores Hernández Oriele Noemi',
            docente_grado: 'Dra.',
            linea_investigacion: 'General',
            coordinador_nombre: '',
            coordinador_ciclo: '',
            cupos_max: '20',
            estado: 'Buscando coordinador'
        },
        {
            grupo_id: 'G002',
            docente_nombre: 'Anicama Hernández Angel Antonio',
            docente_grado: 'Dr.',
            linea_investigacion: 'General',
            coordinador_nombre: 'Canchari Ramos Fabricio',
            coordinador_ciclo: 'IX',
            cupos_max: '20',
            estado: 'En formación'
        },
        {
            grupo_id: 'G003',
            docente_nombre: 'Massironi Palomino Ysabel Rossana',
            docente_grado: 'Dra.',
            linea_investigacion: 'General',
            coordinador_nombre: 'Bellido Cornejo Carlos Jesus',
            coordinador_ciclo: 'VI',
            cupos_max: '20',
            estado: 'En formación'
        },
        {
            grupo_id: 'G004',
            docente_nombre: 'Miranda Soberón Ubaldo Efrain',
            docente_grado: 'Dr.',
            linea_investigacion: 'General',
            coordinador_nombre: 'Pineda Muñoz Luciana',
            coordinador_ciclo: 'VI',
            cupos_max: '20',
            estado: 'En formación'
        }
    ],

    FALLBACK_MIEMBROS: [
        { grupo_id: 'G002', nombre: 'Canchari Ramos Fabricio', ciclo: 'IX', fecha_ingreso: '2026-04-08', rol: 'Coordinador' },
        { grupo_id: 'G003', nombre: 'Bellido Cornejo Carlos Jesus', ciclo: 'VI', fecha_ingreso: '2026-04-08', rol: 'Coordinador' },
        { grupo_id: 'G004', nombre: 'Pineda Muñoz Luciana', ciclo: 'VI', fecha_ingreso: '2026-04-08', rol: 'Coordinador' }
    ]
};
