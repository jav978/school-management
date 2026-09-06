# 3. UI/UX Design Brief
## Sistema de Gestión Escolar Integral — U.E. Santa Luisa v1.0

---

## 1. Filosofía de Diseño e Identidad Institucional

El diseño visual de la plataforma de la **U.E. Santa Luisa** fusiona la dignidad y tradición de la pedagogía vicenciana con los estándares más avanzados de la ingeniería web moderna: **Glassmorphism calibrado, micro-interacciones fluidas, dualidad de modo Oscuro/Claro y visualización ceremonial de documentos oficiales**.

### Principios Rectores
1. **Dignidad y Claridad Educativa**:
   - La información académica de estudiantes, calificaciones y solvencias debe presentarse con jerarquía tipográfica impecable, evitando ruido visual o elementos distractores.
2. **Cero Dependencia de Librerías con Bloqueo de Licencia**:
   - Todo el sistema iconográfico se implementa mediante **trazos vectoriales nativos SVG sin relleno** (`fill="none" stroke="currentColor"`), erradicando el uso de fuentes de iconos comerciales (como PrimeIcons) que desencadenaban errores de validación de licencias en el software previo.
3. **Estandarización Rigurosa de Componentes**:
   - Todas las tarjetas de indicadores clave (KPIs), tablas de datos, botones de acción y modales comparten un lenguaje visual coherente en los 14 módulos de la aplicación.
4. **Legibilidad y Ergonomía Visual**:
   - Diseñado para largas jornadas de trabajo de docentes y coordinadores, ofreciendo un Modo Oscuro profundo (*Slate Night*) con alto contraste que previene la fatiga ocular, y un Modo Claro pulcro y luminoso (*Crisp Daylight*).

---

## 2. Paleta de Colores y Tokens de Diseño

```
+-------------------------------------------------------------------------------+
|  COLOR PRINCIPAL DE MARCA (Institucional U.E. Santa Luisa)                    |
|  Primario: Indigo / Violeta (#6366f1 / #4f46e5) | Acento Oro: #f59e0b / #d97706|
+-------------------------------------------------------------------------------+
|  SUPERFICIES Y FONDOS EN MODO OSCURO (Slate Deep Dark):                       |
|  - Fondo Principal:     #0b0f19 (Slate 950 ultra oscuro)                      |
|  - Tarjetas Glass:      #111827 / #1e293b con backdrop-blur de 16px           |
|  - Bordes y Líneas:     rgba(255, 255, 255, 0.08) a #334155                  |
|  - Texto Principal:     #f8fafc (Slate 50) | Secundario: #94a3b8 (Slate 400)  |
+-------------------------------------------------------------------------------+
|  SUPERFICIES Y FONDOS EN MODO CLARO (Crisp Clean):                            |
|  - Fondo Principal:     #f8fafc (Slate 50)                                    |
|  - Tarjetas Glass:      #ffffff con sutil elevación de sombra suave           |
|  - Bordes y Líneas:     #e2e8f0 (Slate 200)                                   |
|  - Texto Principal:     #0f172a (Slate 900) | Secundario: #64748b (Slate 500)  |
+-------------------------------------------------------------------------------+
|  COLORES SEMÁNTICOS Y DE ESTADO:                                              |
|  - Éxito / Solvente / Aprobado (10-20 o A-B):   #10b981 (Emerald 500)         |
|  - Advertencia / En Observación / C-D:          #f59e0b (Amber 500)           |
|  - Peligro / Reprobado / Inasistente / E:       #f43f5e (Rose 500)            |
|  - Informativo / Planificación / Matrícula:     #38bdf8 (Sky 400)             |
+-------------------------------------------------------------------------------+
```

---

## 3. Sistema de Iconografía y Reglas de Trazos Vectoriales

El sistema prohíbe el uso de emojis informales en tarjetas KPI y en encabezados de tablas, reemplazándolos por iconos vectoriales SVG de alta definición:

```html
<!-- Estándar de Icono Vectorial SVG sin relleno -->
<svg class="w-5 h-5 text-indigo-400" 
     fill="none" 
     stroke="currentColor" 
     viewBox="0 0 24 24" 
     stroke-width="2" 
     stroke-linecap="round" 
     stroke-linejoin="round">
  <!-- Trazos geométricos puros -->
</svg>
```

### Catálogo de Iconografía Clave:
- **Estudiantes / Matrícula**: Silueta académica con birrete o grupo de estudiantes.
- **Docentes / Personal**: Credencial de identificación y portafolio profesional.
- **Aulas y Espacios**: Edificio escolar con pórtico clásico de tres columnas.
- **Planificación Pedagógica**: Cuaderno de notas con lápiz trazador.
- **Evaluación y Calificaciones**: Portapapeles de notas con marca de verificación.
- **Boletas Oficiales**: Documento orlado con sello de autenticidad.
- **Solvencia / Cobranzas**: Billetera y escudo de validación financiera.
- **Certificados y Diplomas**: Medalla laureada con cinta ceremonial y roseta.

---

## 4. Estándar de Botones de Acción y Tablas de Datos

Para garantizar consistencia operativa en todas las tablas del sistema (`/students`, `/staff`, `/classrooms`, `/planning`, `/evaluations`), se establecen los siguientes componentes de acción estandarizados:

| Acción | Icono SVG | Estilo Visual | Tooltip Obligatorio |
|---|---|---|---|
| **Editar Registro** | Lápiz de edición | `text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20` | `title="Editar"` |
| **Eliminar / Desactivar** | Papelera con tapa | `text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20` | `title="Eliminar"` o `title="Desactivar"` |
| **Ver Expediente / Boleta** | Ojo o Documento | `text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20` | `title="Ver Detalle"` |
| **Imprimir / Exportar** | Impresora / Descarga | `text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20` | `title="Imprimir / Exportar"` |

---

## 5. Diseño Ceremonial de Diplomas y Certificados Oficiales

El módulo de Certificados (`/certificates`) cuenta con un lienzo de renderizado ceremonial en orientación horizontal (Landscape) que recrea la solemnidad de los títulos institucionales:
1. **Marco Perimetral Doble**: Borde exterior dorado vicenciano con esquinas decorativas en greca geométrica.
2. **Marca de Agua de Seguridad**: Escudo institucional de la U.E. Santa Luisa centrado con baja opacidad (5%) en el fondo del papel.
3. **Tipografía Clásica**: Combinación de tipografía serifada elegante para los títulos de honor ("DIPLOMA DE EXCELENCIA") y tipografía sans-serif de alta legibilidad para los datos del alumno y las autoridades.
4. **Sello y Roseta Dorada**: Roseta con cintas en relieve, medalla de bronce/oro grabada y código QR de verificación criptográfica de autenticidad.
5. **Firmas Ministeriales**: Espacio para firma del Director(a) del Plantel, Coordinador(a) de Evaluación y sello húmedo oficial.

---

## 6. Layout Maestro, Cabecera y Pie Institucional

### A. Barra Lateral (Sidebar)
- Logotipo institucional de la **U.E. Santa Luisa** con lema educativo.
- Agrupaciones semánticas de navegación:
  - **Académico**: Dashboard, Estudiantes, Personal, Aulas, Horarios, Planificación, Calificaciones, Asistencia.
  - **Evaluación y Trámites**: Boletas de Lapso, Certificados, Solvencias.
  - **Gestión**: Cobranzas, Mensajería, Reportes, Configuración.
- Pie de menú con indicador de estado en vivo: **Versión 1.0.0** con punto pulsante color esmeralda.

### B. Barra Superior (Header)
- Denominación de la autoridad en funciones: *"Director del plantel"*.
- Buscador rápido global de estudiantes, cédulas y expedientes.
- Conmutador instantáneo de Modo Oscuro / Claro.
- Popover interactivo de Mensajería Escolar directa.
- Popover interactivo de Notificaciones y Alertas con badges de no leídos.
- Avatar personalizado con iniciales de 2 letras de reserva (`SJ`) y menú desplegable de perfil, configuración y cierre de sesión.

### C. Pie de Página Institucional (Footer)
- Integrado de forma permanente en el layout base:
  - `© 2026 U.E Santa Luisa • Todos los derechos reservados • Licencia MIT`
  - Crédito de autoría: `Desarrollado por José Vásquez (jvasquez@santaluisa.edu.ve)`.
