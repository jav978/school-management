/**
 * seed-mppe-curriculum.js
 * Configuración y población del Pensum Oficial MPPE para Educación Media General (1er a 5to Año)
 * U.E Colegio Santa Luisa - República Bolivariana de Venezuela
 */

const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const MPPE_SUBJECTS = [
  // ==========================================
  // 1ER AÑO DE EDUCACIÓN MEDIA GENERAL (10 cátedras)
  // ==========================================
  {
    code: 'CAS-1',
    name: 'Castellano I',
    short_name: 'Castellano',
    grade_level: '1er Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#8b5cf6',
    description: 'Comprensión lectora, gramática básica, expresión oral y escrita, y literatura introductoria.'
  },
  {
    code: 'ING-1',
    name: 'Inglés I',
    short_name: 'Inglés',
    grade_level: '1er Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#06b6d4',
    description: 'Fundamentos de lengua extranjera, vocabulario básico, estructuras de saludo y comunicación cotidiana.'
  },
  {
    code: 'MAT-1',
    name: 'Matemáticas I',
    short_name: 'Matemáticas',
    grade_level: '1er Año',
    department: 'Matemática y Lógica',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#3b82f6',
    description: 'Conjuntos numéricos (N, Z, Q), operaciones aritméticas fundamentales, proporcionalidad y geometría plana básica.'
  },
  {
    code: 'EDF-1',
    name: 'Educación Física I',
    short_name: 'Educ. Física',
    grade_level: '1er Año',
    department: 'Formación Integral y Deportes',
    credits: 2,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#f59e0b',
    description: 'Acondicionamiento neuromuscular, destrezas motrices básicas y práctica de disciplinas deportivas colectivas.'
  },
  {
    code: 'CN-1',
    name: 'Ciencias Naturales I',
    short_name: 'Ciencias Nat.',
    grade_level: '1er Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#10b981',
    description: 'El método científico, biodiversidad, ecosistemas, la materia y su estructura elemental.'
  },
  {
    code: 'GHC-1',
    name: 'Geografía, Historia y Ciudadanía I',
    short_name: 'GHC I',
    grade_level: '1er Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 3,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#ec4899',
    description: 'Poblamiento territorial, raíces indígenas y afrodescendientes, geografía física de Venezuela y convivencia democrática.'
  },
  {
    code: 'AYP-1',
    name: 'Arte y Patrimonio I',
    short_name: 'Arte y Pat.',
    grade_level: '1er Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#a855f7',
    description: 'Expresiones artísticas venezolanas, patrimonio histórico y cultural nacional, y técnicas plástico-visuales.'
  },
  {
    code: 'OYC-1',
    name: 'Orientación y Convivencia I',
    short_name: 'Orientación',
    grade_level: '1er Año',
    department: 'Formación Integral y Valores',
    credits: 1,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#14b8a6',
    description: 'Autoconocimiento, integración grupal, resolución pacífica de conflictos y hábitos de estudio.'
  },
  {
    code: 'COMP-1',
    name: 'Computación y Tecnología I',
    short_name: 'Computación',
    grade_level: '1er Año',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#6366f1',
    description: 'Introducción a la ofimática, manejo seguro de internet, arquitectura del computador y procesadores de texto.'
  },
  {
    code: 'EDFE-1',
    name: 'Educación de la Fe y Valores I',
    short_name: 'Educ. de la Fe',
    grade_level: '1er Año',
    department: 'Formación Integral y Valores',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#f43f5e',
    description: 'Carisma vicentino Santa Luisa, virtudes humanas y cristianas, y compromiso comunitario solidario.'
  },

  // ==========================================
  // 2DO AÑO DE EDUCACIÓN MEDIA GENERAL (10 cátedras)
  // ==========================================
  {
    code: 'CAS-2',
    name: 'Castellano II',
    short_name: 'Castellano',
    grade_level: '2do Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#8b5cf6',
    description: 'Sintaxis, análisis textual de obras literarias, redacción de párrafos argumentativos e investigación documental.'
  },
  {
    code: 'ING-2',
    name: 'Inglés II',
    short_name: 'Inglés',
    grade_level: '2do Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#06b6d4',
    description: 'Tiempos verbales del pasado, descripciones de personas y lugares, y diálogos situacionales estructurados.'
  },
  {
    code: 'MAT-2',
    name: 'Matemáticas II',
    short_name: 'Matemáticas',
    grade_level: '2do Año',
    department: 'Matemática y Lógica',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#3b82f6',
    description: 'Polinomios, factorización, ecuaciones de primer grado con una incógnita, estadística descriptiva y probabilidad simple.'
  },
  {
    code: 'EDF-2',
    name: 'Educación Física II',
    short_name: 'Educ. Física',
    grade_level: '2do Año',
    department: 'Formación Integral y Deportes',
    credits: 2,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#f59e0b',
    description: 'Entrenamiento en circuito, fundamentos tácticos del voleibol y baloncesto, y salud preventiva integral.'
  },
  {
    code: 'CN-2',
    name: 'Ciencias Naturales II',
    short_name: 'Ciencias Nat.',
    grade_level: '2do Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#10b981',
    description: 'Introducción a la química y la física, transformaciones de la energía, fisiología humana y sistemas del cuerpo.'
  },
  {
    code: 'GHC-2',
    name: 'Geografía, Historia y Ciudadanía II',
    short_name: 'GHC II',
    grade_level: '2do Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 3,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#ec4899',
    description: 'Período colonial, proceso independentista de Venezuela, pensamiento bolivariano y soberanía nacional.'
  },
  {
    code: 'AYP-2',
    name: 'Arte y Patrimonio II',
    short_name: 'Arte y Pat.',
    grade_level: '2do Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#a855f7',
    description: 'Artes escénicas, música tradicional venezolana, arquitectura colonial y vanguardias artísticas universales.'
  },
  {
    code: 'OYC-2',
    name: 'Orientación y Convivencia II',
    short_name: 'Orientación',
    grade_level: '2do Año',
    department: 'Formación Integral y Valores',
    credits: 1,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#14b8a6',
    description: 'Inteligencia emocional, prevención de adicciones, uso responsable de redes sociales y trabajo en equipo.'
  },
  {
    code: 'COMP-2',
    name: 'Computación y Tecnología II',
    short_name: 'Computación',
    grade_level: '2do Año',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#6366f1',
    description: 'Hojas de cálculo avanzadas, diseño de presentaciones ejecutivas y conceptos iniciales de lógica de programación.'
  },
  {
    code: 'EDFE-2',
    name: 'Educación de la Fe y Valores II',
    short_name: 'Educ. de la Fe',
    grade_level: '2do Año',
    department: 'Formación Integral y Valores',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#f43f5e',
    description: 'Dignidad de la persona, doctrina social de la Iglesia y servicio fraterno a los más vulnerables.'
  },

  // ==========================================
  // 3ER AÑO DE EDUCACIÓN MEDIA GENERAL (11 cátedras)
  // ==========================================
  {
    code: 'CAS-3',
    name: 'Castellano III',
    short_name: 'Castellano',
    grade_level: '3er Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#8b5cf6',
    description: 'Literatura venezolana precolombina y decimonónica, ensayo crítico, figuras literarias y oratoria básica.'
  },
  {
    code: 'ING-3',
    name: 'Inglés III',
    short_name: 'Inglés',
    grade_level: '3er Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#06b6d4',
    description: 'Tiempos perfectos, voz pasiva introductoria y lectura comprensiva de textos de divulgación científica.'
  },
  {
    code: 'MAT-3',
    name: 'Matemáticas III',
    short_name: 'Matemáticas',
    grade_level: '3er Año',
    department: 'Matemática y Lógica',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#3b82f6',
    description: 'Radicación, ecuaciones de segundo grado, Teorema de Pitágoras, trigonometría básica y relaciones métricas.'
  },
  {
    code: 'EDF-3',
    name: 'Educación Física III',
    short_name: 'Educ. Física',
    grade_level: '3er Año',
    department: 'Formación Integral y Deportes',
    credits: 2,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#f59e0b',
    description: 'Atletismo (carreras de velocidad, relevo), fútbol de salón y normas de arbitraje escolar.'
  },
  {
    code: 'FIS-3',
    name: 'Física I',
    short_name: 'Física',
    grade_level: '3er Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#2563eb',
    description: 'Cinemática rectilínea (MRU, MRUV), magnitudes vectoriales, caída libre y leyes de Newton básicas.'
  },
  {
    code: 'QUI-3',
    name: 'Química I',
    short_name: 'Química',
    grade_level: '3er Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#059669',
    description: 'Estructura atómica, tabla periódica, enlaces químicos, nomenclatura inorgánica y leyes ponderales.'
  },
  {
    code: 'BIO-3',
    name: 'Biología I',
    short_name: 'Biología',
    grade_level: '3er Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#16a34a',
    description: 'La célula como unidad de vida, organelos celulares, fotosíntesis, respiración celular y genética elemental.'
  },
  {
    code: 'GHC-3',
    name: 'Geografía, Historia y Ciudadanía III',
    short_name: 'GHC III',
    grade_level: '3er Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 3,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#ec4899',
    description: 'Historia republicana del siglo XIX y XX en Venezuela, evolución de la industria petrolera y democracia.'
  },
  {
    code: 'OYC-3',
    name: 'Orientación y Convivencia III',
    short_name: 'Orientación',
    grade_level: '3er Año',
    department: 'Formación Integral y Valores',
    credits: 1,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#14b8a6',
    description: 'Proyecto de vida inicial, orientación hacia el ciclo diversificado y toma de decisiones éticas.'
  },
  {
    code: 'COMP-3',
    name: 'Computación y Programación III',
    short_name: 'Computación',
    grade_level: '3er Año',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#6366f1',
    description: 'Pensamiento algorítmico, diagramas de flujo, pseudocódigo y fundamentos de programación con Scratch/Python.'
  },
  {
    code: 'EDFE-3',
    name: 'Educación de la Fe y Valores III',
    short_name: 'Educ. de la Fe',
    grade_level: '3er Año',
    department: 'Formación Integral y Valores',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#f43f5e',
    description: 'Liderazgo juvenil católico, apostolado vicentino y discernimiento moral en la adolescencia.'
  },

  // ==========================================
  // 4TO AÑO DE EDUCACIÓN MEDIA GENERAL (12 cátedras)
  // ==========================================
  {
    code: 'CAS-4',
    name: 'Castellano IV',
    short_name: 'Castellano',
    grade_level: '4to Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#8b5cf6',
    description: 'Literatura hispanoamericana contemporánea, análisis semiótico y redacción de ensayos académicos.'
  },
  {
    code: 'ING-4',
    name: 'Inglés IV',
    short_name: 'Inglés',
    grade_level: '4to Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#06b6d4',
    description: 'Condicionales (0, 1, 2), estilo indirecto (reported speech) y conversación sobre temas de actualidad.'
  },
  {
    code: 'MAT-4',
    name: 'Matemáticas IV',
    short_name: 'Matemáticas',
    grade_level: '4to Año',
    department: 'Matemática y Lógica',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#3b82f6',
    description: 'Funciones reales, polinomios de grado superior, trigonometría analítica, geometría del espacio y vectores en R2 y R3.'
  },
  {
    code: 'EDF-4',
    name: 'Educación Física IV',
    short_name: 'Educ. Física',
    grade_level: '4to Año',
    department: 'Formación Integral y Deportes',
    credits: 2,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#f59e0b',
    description: 'Preparación física sistemática, organización de torneos intraescolares y técnicas avanzadas de primeros auxilios.'
  },
  {
    code: 'FIS-4',
    name: 'Física II',
    short_name: 'Física',
    grade_level: '4to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#2563eb',
    description: 'Dinámica clásica, fuerzas de fricción, trabajo, energía cinética y potencial, potencia mecánica e hidrostática.'
  },
  {
    code: 'QUI-4',
    name: 'Química II',
    short_name: 'Química',
    grade_level: '4to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#059669',
    description: 'Cálculos estequiométricos, unidades de concentración química, soluciones valoradas, ácidos, bases y pH.'
  },
  {
    code: 'BIO-4',
    name: 'Biología II',
    short_name: 'Biología',
    grade_level: '4to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#16a34a',
    description: 'Leyes de Mendel, genética molecular, replicación del ADN, transcripción, traducción y teoría de la evolución biológica.'
  },
  {
    code: 'GHC-4',
    name: 'Geografía, Historia y Ciudadanía IV',
    short_name: 'GHC IV',
    grade_level: '4to Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#ec4899',
    description: 'Geografía económica de Venezuela, cuencas hidrográficas, recursos minerales y energéticos, e integración regional.'
  },
  {
    code: 'FSN-4',
    name: 'Formación para la Soberanía Nacional I',
    short_name: 'FSN I',
    grade_level: '4to Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#b45309',
    description: 'Seguridad de la Nación, defensa integral del territorio, orden cerrado militar básico, identidad patriótica y derecho internacional humanitario.'
  },
  {
    code: 'OYC-4',
    name: 'Orientación y Convivencia IV',
    short_name: 'Orientación',
    grade_level: '4to Año',
    department: 'Formación Integral y Valores',
    credits: 1,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#14b8a6',
    description: 'Autonomía personal, exploración vocacional universitaria (sistema OPSU/SNI) y orientación profesional.'
  },
  {
    code: 'COMP-4',
    name: 'Computación y Desarrollo Web IV',
    short_name: 'Computación',
    grade_level: '4to Año',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#6366f1',
    description: 'Estructuración web con HTML5/CSS3, bases de datos relacionales introductorias y seguridad informática.'
  },
  {
    code: 'EDFE-4',
    name: 'Educación de la Fe y Valores IV',
    short_name: 'Educ. de la Fe',
    grade_level: '4to Año',
    department: 'Formación Integral y Valores',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#f43f5e',
    description: 'Bioética, defensa de la vida humana, compromiso social cristiano y justicia distributiva.'
  },

  // ==========================================
  // 5TO AÑO DE EDUCACIÓN MEDIA GENERAL (13 cátedras)
  // ==========================================
  {
    code: 'CAS-5',
    name: 'Castellano V',
    short_name: 'Castellano',
    grade_level: '5to Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#8b5cf6',
    description: 'Literatura universal, corrientes literarias contemporáneas, elaboración de monografías e informes de investigación científica.'
  },
  {
    code: 'ING-5',
    name: 'Inglés V',
    short_name: 'Inglés',
    grade_level: '5to Año',
    department: 'Lengua, Humanidades y Arte',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#06b6d4',
    description: 'Inglés técnico para la educación universitaria, comprensión de abstracts científicos y debates formales.'
  },
  {
    code: 'MAT-5',
    name: 'Matemáticas V',
    short_name: 'Matemáticas',
    grade_level: '5to Año',
    department: 'Matemática y Lógica',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#3b82f6',
    description: 'Límites, continuidad, derivadas de funciones algebraicas, matrices, determinantes y sistemas de ecuaciones lineales.'
  },
  {
    code: 'EDF-5',
    name: 'Educación Física V',
    short_name: 'Educ. Física',
    grade_level: '5to Año',
    department: 'Formación Integral y Deportes',
    credits: 2,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#f59e0b',
    description: 'Gestión deportiva institucional, recreación comunitaria y mantenimiento de la condición física para la vida adulta.'
  },
  {
    code: 'FIS-5',
    name: 'Física III',
    short_name: 'Física',
    grade_level: '5to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#2563eb',
    description: 'Electrostática, Ley de Coulomb, campo y potencial eléctrico, corriente continua, Ley de Ohm y circuitos resistivos.'
  },
  {
    code: 'QUI-5',
    name: 'Química III',
    short_name: 'Química',
    grade_level: '5to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#059669',
    description: 'Química orgánica, hidrocarburos alifáticos y aromáticos, grupos funcionales oxigenados y nitrogenados, y polímeros sintéticos.'
  },
  {
    code: 'BIO-5',
    name: 'Biología III',
    short_name: 'Biología',
    grade_level: '5to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 4,
    hours_per_week: 4,
    is_elective: false,
    color_hex: '#16a34a',
    description: 'Biotecnología, ecología de poblaciones, impacto ambiental, bioética de la clonación y biodiversidad en Venezuela.'
  },
  {
    code: 'CT-5',
    name: 'Ciencias de la Tierra',
    short_name: 'Cs. de la Tierra',
    grade_level: '5to Año',
    department: 'Ciencias Naturales y Exactas',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#d97706',
    description: 'Geología física, tectónica de placas, hidrosfera, dinámica atmosférica, sismicidad y recursos naturales venezolanos.'
  },
  {
    code: 'GHC-5',
    name: 'Geografía, Historia y Ciudadanía V',
    short_name: 'GHC V',
    grade_level: '5to Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 3,
    hours_per_week: 3,
    is_elective: false,
    color_hex: '#ec4899',
    description: 'Venezuela en el contexto geopolítico mundial, tratados internacionales, fronteras patrias y desarrollo sustentable.'
  },
  {
    code: 'FSN-5',
    name: 'Formación para la Soberanía Nacional II',
    short_name: 'FSN II',
    grade_level: '5to Año',
    department: 'Ciencias Sociales y Ciudadanía',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#b45309',
    description: 'Doctrina de defensa integral de la Nación, resguardo del espacio geográfico, gestión de riesgos ante catástrofes y deberes ciudadanos.'
  },
  {
    code: 'OYC-5',
    name: 'Orientación y Convivencia V',
    short_name: 'Orientación',
    grade_level: '5to Año',
    department: 'Formación Integral y Valores',
    credits: 1,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#14b8a6',
    description: 'Culminación del bachillerato, preparación psicológica para la transición universitaria y liderazgo comunitario.'
  },
  {
    code: 'COMP-5',
    name: 'Computación e Innovación Tecnológica V',
    short_name: 'Computación',
    grade_level: '5to Año',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#6366f1',
    description: 'Introducción a la Inteligencia Artificial, automatización de procesos, análisis de datos y ciudadanía digital ética.'
  },
  {
    code: 'EDFE-5',
    name: 'Educación de la Fe y Metodología de Proyecto V',
    short_name: 'Proyecto de Grado',
    grade_level: '5to Año',
    department: 'Formación Integral y Valores',
    credits: 2,
    hours_per_week: 2,
    is_elective: false,
    color_hex: '#f43f5e',
    description: 'Desarrollo y defensa del Proyecto de Investigación Científico-Comunitario obligatorio y pastoral de grado.'
  },

  // ==========================================
  // ASIGNATURAS OPIONALES / ELECTIVAS INSTITUCIONALES
  // ==========================================
  {
    code: 'ROB-M',
    name: 'Robótica y Automatización Aplicada',
    short_name: 'Robótica',
    grade_level: 'Media General',
    department: 'Tecnología e Innovación',
    credits: 2,
    hours_per_week: 2,
    is_elective: true,
    color_hex: '#f59e0b',
    description: 'Cátedra institucional electiva: Diseño y programación de circuitos con microcontroladores Arduino, sensores y robótica educativa.'
  },
  {
    code: 'FRA-M',
    name: 'Francés Conversacional Básico',
    short_name: 'Francés',
    grade_level: 'Media General',
    department: 'Lengua, Humanidades y Arte',
    credits: 2,
    hours_per_week: 2,
    is_elective: true,
    color_hex: '#38bdf8',
    description: 'Cátedra institucional electiva: Iniciación a la fonética francesa, saludos, frases esenciales y cultura francófona.'
  }
];

const CLASSROOMS = [
  { room_number: 'AULA-101', name: 'Aula 1er Año - Bachillerato', building: 'Edificio Central San Vicente', floor: '1', capacity: 35, room_type: 'aula_regular' },
  { room_number: 'AULA-102', name: 'Aula 2do Año - Bachillerato', building: 'Edificio Central San Vicente', floor: '1', capacity: 35, room_type: 'aula_regular' },
  { room_number: 'AULA-103', name: 'Aula 3er Año - Bachillerato', building: 'Edificio Central San Vicente', floor: '2', capacity: 35, room_type: 'aula_regular' },
  { room_number: 'AULA-104', name: 'Aula 4to Año - Bachillerato', building: 'Edificio Central San Vicente', floor: '2', capacity: 35, room_type: 'aula_regular' },
  { room_number: 'AULA-105', name: 'Aula 5to Año - Bachillerato', building: 'Edificio Central San Vicente', floor: '3', capacity: 35, room_type: 'aula_regular' },
  { room_number: 'LAB-01', name: 'Laboratorio de Ciencias y Química', building: 'Pabellón Científico', floor: '1', capacity: 30, room_type: 'laboratorio' },
  { room_number: 'LAB-INFO', name: 'Laboratorio de Informática y Robótica', building: 'Pabellón Científico', floor: '2', capacity: 30, room_type: 'laboratorio' },
  { room_number: 'CANCHA', name: 'Cancha Polideportiva Santa Luisa', building: 'Área Deportiva', floor: 'PB', capacity: 60, room_type: 'cancha' }
];

async function seed() {
  console.log('🚀 Iniciando población del Pensum Oficial MPPE para Media General...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Asegurar Años/Grados en school.grades
    console.log('📚 Verificando y creando grados escolares (1er a 5to Año)...');
    const gradeDefs = [
      { name: '1er Año', order_num: 1, desc: '1er Año de Educación Media General (Bachillerato)' },
      { name: '2do Año', order_num: 2, desc: '2do Año de Educación Media General (Bachillerato)' },
      { name: '3er Año', order_num: 3, desc: '3er Año de Educación Media General (Bachillerato)' },
      { name: '4to Año', order_num: 4, desc: '4to Año de Educación Media General (Bachillerato)' },
      { name: '5to Año', order_num: 5, desc: '5to Año de Educación Media General (Bachillerato)' }
    ];

    const gradeMap = {}; // name -> id

    for (const g of gradeDefs) {
      const existing = await client.query('SELECT id, name FROM school.grades WHERE name = $1 AND is_deleted = false', [g.name]);
      if (existing.rows.length > 0) {
        gradeMap[g.name] = existing.rows[0].id;
        console.log(`  ✓ Grado existente: "${g.name}" (ID: ${existing.rows[0].id})`);
      } else {
        const ins = await client.query(`
          INSERT INTO school.grades (institution_id, name, order_num, description, is_active, created_at, updated_at)
          VALUES (1, $1, $2, $3, true, NOW(), NOW())
          RETURNING id, name
        `, [g.name, g.order_num, g.desc]);
        gradeMap[g.name] = ins.rows[0].id;
        console.log(`  + Grado creado: "${g.name}" (ID: ${ins.rows[0].id})`);
      }
    }

    // 2. Asegurar Secciones en school.classes
    console.log('🏫 Verificando y creando clases/secciones oficiales...');
    const classDefs = [
      { name: '1er Año Sección U', grade_name: '1er Año', section: 'U' },
      { name: '2do Año Sección U', grade_name: '2do Año', section: 'U' },
      { name: '3er Año Sección U', grade_name: '3er Año', section: 'U' },
      { name: '4to Año Sección U', grade_name: '4to Año', section: 'U' },
      { name: '5to Año Sección A', grade_name: '5to Año', section: 'A' }
    ];

    for (const c of classDefs) {
      const gradeId = gradeMap[c.grade_name];
      const existing = await client.query(
        'SELECT id FROM school.classes WHERE grade_id = $1 AND section = $2 AND is_deleted = false',
        [gradeId, c.section]
      );
      if (existing.rows.length === 0) {
        await client.query(`
          INSERT INTO school.classes (institution_id, academic_year_id, grade_id, name, section, is_active, created_at, updated_at)
          VALUES (1, 1, $1, $2, $3, true, NOW(), NOW())
        `, [gradeId, c.name, c.section]);
        console.log(`  + Sección creada: "${c.name}"`);
      } else {
        console.log(`  ✓ Sección existente: "${c.name}" (ID: ${existing.rows[0].id})`);
      }
    }

    // 3. Asegurar Aulas en school.classrooms
    console.log('🚪 Verificando y registrando aulas e instalaciones físicas...');
    for (const room of CLASSROOMS) {
      const existing = await client.query(
        'SELECT id, is_deleted FROM school.classrooms WHERE room_number = $1',
        [room.room_number]
      );
      if (existing.rows.length === 0) {
        await client.query(`
          INSERT INTO school.classrooms (institution_id, name, room_number, building, floor, capacity, room_type, is_active, is_deleted, created_at)
          VALUES (1, $1, $2, $3, $4, $5, $6, true, false, NOW())
        `, [room.name, room.room_number, room.building, room.floor, room.capacity, room.room_type]);
        console.log(`  + Aula creada: [${room.room_number}] ${room.name}`);
      } else if (existing.rows[0].is_deleted) {
        await client.query(
          'UPDATE school.classrooms SET is_deleted = false, is_active = true, name = $1, building = $2, capacity = $3 WHERE room_number = $4',
          [room.name, room.building, room.capacity, room.room_number]
        );
        console.log(`  ✓ Aula reactivada: [${room.room_number}] ${room.name}`);
      } else {
        console.log(`  ✓ Aula disponible: [${room.room_number}] ${room.name}`);
      }
    }

    // 4. Poblar Asignaturas MPPE en school.subjects
    console.log(`📖 Registrando ${MPPE_SUBJECTS.length} asignaturas oficiales MPPE y electivas...`);
    const subjectMap = {}; // code -> id

    for (const sub of MPPE_SUBJECTS) {
      const existing = await client.query(
        'SELECT id, code, name FROM school.subjects WHERE code = $1',
        [sub.code]
      );

      if (existing.rows.length > 0) {
        // Actualizar datos
        await client.query(`
          UPDATE school.subjects
          SET name = $1, short_name = $2, grade_level = $3, credits = $4, hours_per_week = $5,
              is_elective = $6, color_hex = $7, description = $8, is_active = true, is_deleted = false, updated_at = NOW()
          WHERE code = $9
        `, [sub.name, sub.short_name, sub.grade_level, sub.credits, sub.hours_per_week, sub.is_elective, sub.color_hex, sub.description, sub.code]);
        subjectMap[sub.code] = existing.rows[0].id;
        console.log(`  ✓ Actualizada materia: [${sub.code}] ${sub.name} (${sub.grade_level})`);
      } else {
        const ins = await client.query(`
          INSERT INTO school.subjects (
            institution_id, code, name, short_name, grade_level, credits, hours_per_week,
            is_elective, color_hex, description, is_active, is_deleted, created_at, updated_at
          ) VALUES (
            1, $1, $2, $3, $4, $5, $6, $7, $8, $9, true, false, NOW(), NOW()
          ) RETURNING id
        `, [
          sub.code, sub.name, sub.short_name, sub.grade_level, sub.credits, sub.hours_per_week,
          sub.is_elective, sub.color_hex, sub.description
        ]);
        subjectMap[sub.code] = ins.rows[0].id;
        console.log(`  + Creada materia: [${sub.code}] ${sub.name} (${sub.grade_level})`);
      }
    }

    // 5. Asignar Profesores a las Materias y Sembrar Horarios Base
    console.log('⏰ Configurando horarios semanales oficiales en school.schedules...');
    // Obtener docentes activos
    const teacherRows = await client.query('SELECT id, first_name, last_name FROM school.teachers WHERE is_deleted = false ORDER BY id');
    const teacherParedes = teacherRows.rows.find(t => t.last_name.includes('Paredes')) || teacherRows.rows[0];
    const teacherVasquez = teacherRows.rows.find(t => t.last_name.includes('Vásquez')) || teacherRows.rows[1] || teacherRows.rows[0];

    // Limpiar horarios previos generados para evitar duplicidades
    await client.query('DELETE FROM school.schedules WHERE academic_year = $1', ['2025-2026']);

    // Definición de horario base de 7:00 a 12:40 (6 bloques pedagógicos de 45m + 2 recesos)
    // Bloques: 07:00-07:45, 07:45-08:30, 08:45-09:30, 09:30-10:15, 10:30-11:15, 11:15-12:00, 12:00-12:45
    const timeSlots = [
      { start: '07:00', end: '07:45' },
      { start: '07:45', end: '08:30' },
      { start: '08:45', end: '09:30' },
      { start: '09:30', end: '10:15' },
      { start: '10:30', end: '11:15' },
      { start: '11:15', end: '12:00' },
      { start: '12:00', end: '12:45' }
    ];

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    // Distribución semanal por año:
    const yearSchedules = [
      {
        grade: '1er Año',
        section: 'U',
        classroom: 'AULA-101',
        grid: {
          monday: ['MAT-1', 'MAT-1', 'CAS-1', 'CAS-1', 'GHC-1', 'GHC-1', 'OYC-1'],
          tuesday: ['CN-1', 'CN-1', 'ING-1', 'ING-1', 'COMP-1', 'COMP-1', 'EDFE-1'],
          wednesday: ['CAS-1', 'CAS-1', 'MAT-1', 'MAT-1', 'AYP-1', 'AYP-1', 'EDFE-1'],
          thursday: ['EDF-1', 'EDF-1', 'EDF-1', 'CN-1', 'CN-1', 'GHC-1', 'GHC-1'],
          friday: ['ING-1', 'MAT-1', 'CAS-1', 'ROB-M', 'ROB-M', 'OYC-1', 'FRA-M']
        }
      },
      {
        grade: '2do Año',
        section: 'U',
        classroom: 'AULA-102',
        grid: {
          monday: ['CAS-2', 'CAS-2', 'MAT-2', 'MAT-2', 'CN-2', 'CN-2', 'OYC-2'],
          tuesday: ['MAT-2', 'MAT-2', 'ING-2', 'ING-2', 'GHC-2', 'GHC-2', 'EDFE-2'],
          wednesday: ['CN-2', 'CN-2', 'CAS-2', 'CAS-2', 'COMP-2', 'COMP-2', 'EDFE-2'],
          thursday: ['GHC-2', 'GHC-2', 'EDF-2', 'EDF-2', 'EDF-2', 'AYP-2', 'AYP-2'],
          friday: ['ING-2', 'MAT-2', 'CAS-2', 'ROB-M', 'ROB-M', 'OYC-2', 'FRA-M']
        }
      },
      {
        grade: '3er Año',
        section: 'U',
        classroom: 'AULA-103',
        grid: {
          monday: ['MAT-3', 'MAT-3', 'FIS-3', 'FIS-3', 'QUI-3', 'QUI-3', 'OYC-3'],
          tuesday: ['BIO-3', 'BIO-3', 'CAS-3', 'CAS-3', 'GHC-3', 'GHC-3', 'EDFE-3'],
          wednesday: ['FIS-3', 'FIS-3', 'QUI-3', 'QUI-3', 'MAT-3', 'MAT-3', 'COMP-3'],
          thursday: ['EDF-3', 'EDF-3', 'EDF-3', 'BIO-3', 'BIO-3', 'ING-3', 'ING-3'],
          friday: ['CAS-3', 'CAS-3', 'GHC-3', 'GHC-3', 'COMP-3', 'EDFE-3', 'ROB-M']
        }
      },
      {
        grade: '4to Año',
        section: 'U',
        classroom: 'AULA-104',
        grid: {
          monday: ['FIS-4', 'FIS-4', 'MAT-4', 'MAT-4', 'QUI-4', 'QUI-4', 'FSN-4'],
          tuesday: ['QUI-4', 'QUI-4', 'BIO-4', 'BIO-4', 'CAS-4', 'CAS-4', 'FSN-4'],
          wednesday: ['MAT-4', 'MAT-4', 'FIS-4', 'FIS-4', 'GHC-4', 'GHC-4', 'OYC-4'],
          thursday: ['BIO-4', 'BIO-4', 'EDF-4', 'EDF-4', 'EDF-4', 'ING-4', 'ING-4'],
          friday: ['CAS-4', 'CAS-4', 'COMP-4', 'COMP-4', 'EDFE-4', 'EDFE-4', 'OYC-4']
        }
      },
      {
        grade: '5to Año',
        section: 'A',
        classroom: 'AULA-105',
        grid: {
          monday: ['FIS-5', 'FIS-5', 'MAT-5', 'MAT-5', 'QUI-5', 'QUI-5', 'FSN-5'],
          tuesday: ['QUI-5', 'QUI-5', 'BIO-5', 'BIO-5', 'CT-5', 'CT-5', 'FSN-5'],
          wednesday: ['MAT-5', 'MAT-5', 'FIS-5', 'FIS-5', 'CT-5', 'GHC-5', 'OYC-5'],
          thursday: ['BIO-5', 'BIO-5', 'EDF-5', 'EDF-5', 'EDF-5', 'ING-5', 'ING-5'],
          friday: ['CAS-5', 'CAS-5', 'GHC-5', 'GHC-5', 'COMP-5', 'COMP-5', 'EDFE-5']
        }
      }
    ];

    let schedulesCount = 0;

    for (const year of yearSchedules) {
      for (const day of days) {
        const codes = year.grid[day];
        for (let i = 0; i < codes.length; i++) {
          const subCode = codes[i];
          const subId = subjectMap[subCode];
          if (!subId) {
            console.warn(`Materia no encontrada para código ${subCode}`);
            continue;
          }

          const slot = timeSlots[i];
          // Asignar docente según materia
          let tId = teacherParedes.id;
          if (subCode.includes('COMP') || subCode.includes('ROB')) {
            tId = teacherVasquez.id;
          }

          // Aulas especiales según materia
          let rId = year.classroom;
          if (subCode.includes('EDF')) rId = 'CANCHA';
          else if (subCode.includes('QUI') || subCode.includes('BIO') || subCode.includes('FIS')) rId = 'LAB-01';
          else if (subCode.includes('COMP') || subCode.includes('ROB')) rId = 'LAB-INFO';

          await client.query(`
            INSERT INTO school.schedules (
              institution_id, subject_id, teacher_id, classroom_id,
              grade, section, day_of_week, start_time, end_time,
              semester, academic_year, is_active, is_deleted, created_at, updated_at
            ) VALUES (
              1, $1, $2, $3, $4, $5, $6, $7, $8, '1er Lapso', '2025-2026', true, false, NOW(), NOW()
            )
          `, [subId, tId, rId, year.grade, year.section, day, slot.start, slot.end]);
          schedulesCount++;
        }
      }
    }

    await client.query('COMMIT');
    console.log(`\n🎉 ¡Pensum Oficial MPPE para Media General configurado con éxito!`);
    console.log(`   - Grados: 1er a 5to Año verificados.`);
    console.log(`   - Aulas: ${CLASSROOMS.length} aulas/laboratorios activos.`);
    console.log(`   - Materias registradas: ${MPPE_SUBJECTS.length} asignaturas oficiales + electivas.`);
    console.log(`   - Bloques semanales programados: ${schedulesCount} bloques asignados.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante la población curricular:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
