# I Semillero de Investigación FMH-DAC-SOCEMI

Dashboard público de los grupos de semillero de investigación de la Facultad de Medicina Humana Daniel Alcides Carrión, Universidad Nacional San Luis Gonzaga de Ica.

## Estructura

- `index.html` — Dashboard público con grupos en tiempo real
- `normativa.html` — Marco normativo y gobernanza
- `css/style.css` — Estilos
- `js/` — Lógica de carga y renderizado de datos

## Datos

Los datos se cargan en tiempo real desde un Google Sheet publicado como CSV.

## Mantenimiento

- **Agregar/editar miembros:** Editar directamente en Google Sheets (cada coordinador tiene permisos sobre su grupo)
- **Agregar nuevo grupo:** Llenar el formulario de solicitud desde el dashboard, o agregar fila en la hoja "Grupos"
- **Actualizar URLs:** Editar `js/config.js`

## Contacto

Coordinación de Semilleros — CPC-Local SOCEMI
Universidad Nacional San Luis Gonzaga de Ica
