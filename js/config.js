const CONFIG = {
    SHEET_ID: 'PENDING_SHEET_ID',

    get GRUPOS_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Grupos`;
    },

    get MIEMBROS_CSV_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Miembros`;
    },

    FORM_NUEVO_GRUPO: 'PENDING_FORM_URL',
    FORM_POSTULAR: 'PENDING_FORM_URL',
    FORM_POSTULAR_ENTRY_GRUPO: 'entry.XXXXXXXXXX',

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
            coordinador_ciclo: 'XI',
            cupos_max: '20',
            estado: 'En formación'
        },
        {
            grupo_id: 'G004',
            docente_nombre: 'Miranda Soberón Ubaldo Efrain',
            docente_grado: 'Dr.',
            linea_investigacion: 'General',
            coordinador_nombre: 'Pineda Muñoz Luciana',
            coordinador_ciclo: 'XI',
            cupos_max: '20',
            estado: 'En formación'
        }
    ],

    FALLBACK_MIEMBROS: [
        { grupo_id: 'G002', nombre: 'Canchari Ramos Fabricio', ciclo: 'IX', fecha_ingreso: '2026-04-08', rol: 'Coordinador' },
        { grupo_id: 'G003', nombre: 'Bellido Cornejo Carlos Jesus', ciclo: 'XI', fecha_ingreso: '2026-04-08', rol: 'Coordinador' },
        { grupo_id: 'G004', nombre: 'Pineda Muñoz Luciana', ciclo: 'XI', fecha_ingreso: '2026-04-08', rol: 'Coordinador' }
    ]
};
