-- ============================================================
-- EduFlow / EduManager — Sistema de Gestión Escolar
-- Schema de Base de Datos (SQL — Compatible con MySQL 8+)
-- Generado el 2026-09-04
-- ============================================================
-- Nota: La base de datos real usa MongoDB (documental) gestionada
-- por Base44. Este SQL es una representación relacional equivalente
-- para referencia, migración o despliegue alternativo.
-- ============================================================

-- --------------------------------------------------------
-- TABLA: users (Entidad integrada de Base44)
-- --------------------------------------------------------
CREATE TABLE users (
  id              VARCHAR(36)   PRIMARY KEY,
  full_name       VARCHAR(255),
  email           VARCHAR(255)  UNIQUE NOT NULL,
  role            ENUM('admin','user') DEFAULT 'user',
  user_type       ENUM('admin','student','teacher','parent','administrative','academic_control') NOT NULL,
  profile_completed BOOLEAN DEFAULT FALSE,
  student_id      VARCHAR(36),
  teacher_id      VARCHAR(36),
  parent_id       VARCHAR(36),
  department      VARCHAR(100),
  phone           VARCHAR(30),
  address         TEXT,
  emergency_contact VARCHAR(255),
  status          ENUM('active','inactive','pending') DEFAULT 'pending',
  last_login      TIMESTAMP,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- TABLA: parents (Padres y representantes)
-- --------------------------------------------------------
CREATE TABLE parents (
  id              VARCHAR(36)   PRIMARY KEY,
  parent_id       VARCHAR(50)   UNIQUE NOT NULL,
  first_name      VARCHAR(100)  NOT NULL,
  last_name       VARCHAR(100)  NOT NULL,
  email           VARCHAR(255),
  phone           VARCHAR(30)   NOT NULL,
  relationship    ENUM('padre','madre','abuelo','abuela','tutor','otro'),
  occupation      VARCHAR(255),
  address         TEXT,
  emergency_contact BOOLEAN DEFAULT TRUE,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: students (Estudiantes)
-- --------------------------------------------------------
CREATE TABLE students (
  id              VARCHAR(36)   PRIMARY KEY,
  student_id      VARCHAR(50)   UNIQUE NOT NULL,
  first_name      VARCHAR(100)  NOT NULL,
  last_name       VARCHAR(100)  NOT NULL,
  date_of_birth   DATE,
  grade           VARCHAR(50)   NOT NULL,
  section         VARCHAR(10),
  gender          ENUM('masculino','femenino'),
  address         TEXT,
  phone           VARCHAR(30),
  emergency_contact VARCHAR(255),
  parent_id       VARCHAR(36),
  enrollment_date DATE,
  status          ENUM('activo','inactivo','graduado') DEFAULT 'activo',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: teachers (Profesores)
-- --------------------------------------------------------
CREATE TABLE teachers (
  id              VARCHAR(36)   PRIMARY KEY,
  teacher_id      VARCHAR(50)   UNIQUE NOT NULL,
  first_name      VARCHAR(100)  NOT NULL,
  last_name       VARCHAR(100)  NOT NULL,
  email           VARCHAR(255)  NOT NULL,
  phone           VARCHAR(30),
  specialization  VARCHAR(255),
  hire_date       DATE,
  status          ENUM('activo','inactivo','licencia') DEFAULT 'activo',
  department      VARCHAR(100),
  salary          DECIMAL(10,2),
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: staff (Personal administrativo, obrero, profesional)
-- --------------------------------------------------------
CREATE TABLE staff (
  id              VARCHAR(36)   PRIMARY KEY,
  staff_id        VARCHAR(50)   UNIQUE NOT NULL,
  first_name      VARCHAR(100)  NOT NULL,
  last_name       VARCHAR(100)  NOT NULL,
  id_card         VARCHAR(20),
  staff_type      ENUM('administrativo','obrero','profesional') NOT NULL,
  position        VARCHAR(100),
  department      VARCHAR(100),
  phone           VARCHAR(30),
  email           VARCHAR(255),
  address         TEXT,
  photo_url       TEXT,
  hire_date       DATE,
  blood_type      VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(30),
  status          ENUM('activo','inactivo','licencia') DEFAULT 'activo',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: subjects (Materias)
-- --------------------------------------------------------
CREATE TABLE subjects (
  id              VARCHAR(36)   PRIMARY KEY,
  subject_code    VARCHAR(20)   UNIQUE NOT NULL,
  name            VARCHAR(200)  NOT NULL,
  description     TEXT,
  grade_level     VARCHAR(50)   NOT NULL,
  credits         DECIMAL(3,1),
  teacher_id      VARCHAR(36),
  department      VARCHAR(100),
  prerequisites   TEXT,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: classrooms (Aulas)
-- --------------------------------------------------------
CREATE TABLE classrooms (
  id              VARCHAR(36)   PRIMARY KEY,
  room_number     VARCHAR(20)   NOT NULL,
  name            VARCHAR(100)  NOT NULL,
  capacity        INT           NOT NULL,
  type            ENUM('aula_regular','laboratorio','biblioteca','auditorio','gimnasio'),
  floor           INT,
  building        VARCHAR(100),
  equipment       TEXT,
  status          ENUM('disponible','ocupada','mantenimiento') DEFAULT 'disponible',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: schedules (Horarios de clases)
-- --------------------------------------------------------
CREATE TABLE schedules (
  id              VARCHAR(36)   PRIMARY KEY,
  subject_id      VARCHAR(36)   NOT NULL,
  teacher_id      VARCHAR(36)   NOT NULL,
  classroom_id    VARCHAR(36),
  grade           VARCHAR(50),
  section         VARCHAR(10),
  day_of_week     ENUM('lunes','martes','miércoles','jueves','viernes') NOT NULL,
  start_time      VARCHAR(5)    NOT NULL,
  end_time        VARCHAR(5)    NOT NULL,
  semester        VARCHAR(50),
  academic_year   VARCHAR(20),
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: schedule_templates (Plantillas de horario)
-- --------------------------------------------------------
CREATE TABLE schedule_templates (
  id              VARCHAR(36)   PRIMARY KEY,
  teacher_id      VARCHAR(36)   NOT NULL,
  academic_year   VARCHAR(20)  NOT NULL,
  education_level ENUM('primaria','media') NOT NULL,
  schedule_type   ENUM('mañana','tarde','mañana-tarde') NOT NULL,
  max_hours       DECIMAL(4,1),
  current_hours   DECIMAL(4,1) DEFAULT 0,
  schedule_slots  JSON,
  status          ENUM('borrador','aprobado','finalizado') DEFAULT 'borrador',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: grades (Calificaciones individuales)
-- --------------------------------------------------------
CREATE TABLE grades (
  id              VARCHAR(36)   PRIMARY KEY,
  student_id      VARCHAR(36)   NOT NULL,
  subject_id      VARCHAR(36)   NOT NULL,
  teacher_id      VARCHAR(36),
  grade_type      ENUM('examen','tarea','proyecto','participacion','quiz') NOT NULL,
  score           DECIMAL(5,2)  NOT NULL CHECK (score >= 0 AND score <= 100),
  max_score       DECIMAL(5,2)  DEFAULT 100,
  weight          DECIMAL(5,2),
  date            DATE,
  semester        VARCHAR(50),
  comments        TEXT,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: attendance (Asistencia)
-- --------------------------------------------------------
CREATE TABLE attendance (
  id              VARCHAR(36)   PRIMARY KEY,
  student_id      VARCHAR(36)   NOT NULL,
  subject_id      VARCHAR(36)   NOT NULL,
  teacher_id      VARCHAR(36),
  date            DATE          NOT NULL,
  status          ENUM('presente','ausente','tardanza','justificado') NOT NULL,
  arrival_time    VARCHAR(5),
  notes           TEXT,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: exams (Exámenes)
-- --------------------------------------------------------
CREATE TABLE exams (
  id              VARCHAR(36)   PRIMARY KEY,
  exam_title      VARCHAR(200)  NOT NULL,
  subject_id      VARCHAR(36)   NOT NULL,
  teacher_id      VARCHAR(36),
  exam_date       DATE          NOT NULL,
  start_time      VARCHAR(5),
  duration        INT,
  classroom_id    VARCHAR(36),
  grade_level     VARCHAR(50),
  max_score       DECIMAL(5,2)  DEFAULT 100,
  instructions    TEXT,
  status          ENUM('programado','en_progreso','finalizado','cancelado') DEFAULT 'programado',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: exam_questions (Preguntas de exámenes)
-- --------------------------------------------------------
CREATE TABLE exam_questions (
  id              VARCHAR(36)   PRIMARY KEY,
  exam_id         VARCHAR(36)   NOT NULL,
  question_type   ENUM('verdadero_falso','seleccion_simple','seleccion_multiple','completacion','respuesta_corta','ordenamiento') NOT NULL,
  question_text   TEXT          NOT NULL,
  options         JSON,
  correct_answer  VARCHAR(500),
  correct_answers JSON,
  points          DECIMAL(4,1)  DEFAULT 1,
  `order`         INT           DEFAULT 0,
  explanation     TEXT,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: report_cards (Boletas de calificaciones)
-- --------------------------------------------------------
CREATE TABLE report_cards (
  id              VARCHAR(36)   PRIMARY KEY,
  student_id      VARCHAR(36)   NOT NULL,
  academic_year   VARCHAR(20)   NOT NULL,
  period          ENUM('1er lapso','2do lapso','3er lapso','1er momento','2do momento','3er momento','final') NOT NULL,
  education_level ENUM('preescolar','primaria','media') NOT NULL,
  subject_grades  JSON,
  final_average   DECIMAL(4,2),
  final_letter    ENUM('A','B','C','D','E'),
  attendance_present INT DEFAULT 0,
  attendance_absent   INT DEFAULT 0,
  attendance_late     INT DEFAULT 0,
  conduct_grade       VARCHAR(10),
  participation_grade VARCHAR(10),
  teacher_observations TEXT,
  verification_code   VARCHAR(50) UNIQUE,
  status          ENUM('borrador','emitida','entregada') DEFAULT 'borrador',
  issue_date      DATE,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: academic_plannings (Planificaciones académicas)
-- --------------------------------------------------------
CREATE TABLE academic_plannings (
  id              VARCHAR(36)   PRIMARY KEY,
  teacher_id      VARCHAR(36)   NOT NULL,
  subject_id      VARCHAR(36)   NOT NULL,
  academic_year   VARCHAR(20)   NOT NULL,
  period          ENUM('1er lapso','2do lapso','3er lapso') NOT NULL,
  grade           VARCHAR(50)   NOT NULL,
  section         VARCHAR(10),
  group_schedule  VARCHAR(200),
  indispensable_theme TEXT,
  project_theme   TEXT,
  weekly_planning JSON,
  general_objectives JSON,
  evaluation_plan JSON,
  student_list    JSON,
  additional_resources JSON,
  evaluation_criteria JSON,
  status          ENUM('borrador','finalizada','aprobada') DEFAULT 'borrador',
  submission_date DATE,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: announcements (Anuncios)
-- --------------------------------------------------------
CREATE TABLE announcements (
  id              VARCHAR(36)   PRIMARY KEY,
  title           VARCHAR(200)  NOT NULL,
  content         TEXT         NOT NULL,
  author_id       VARCHAR(36),
  target_audience ENUM('todos','estudiantes','profesores','padres','administrativos') NOT NULL,
  priority        ENUM('baja','media','alta','urgente') DEFAULT 'media',
  publish_date    DATE,
  expiry_date     DATE,
  category        ENUM('academico','administrativo','evento','emergencia','general'),
  is_active        BOOLEAN DEFAULT TRUE,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: notifications (Notificaciones del sistema)
-- --------------------------------------------------------
CREATE TABLE notifications (
  id              VARCHAR(36)   PRIMARY KEY,
  user_id         VARCHAR(36),
  title           VARCHAR(200)  NOT NULL,
  message         TEXT         NOT NULL,
  type            ENUM('exam','task','announcement','general') NOT NULL,
  reference_id    VARCHAR(36),
  is_read         BOOLEAN DEFAULT FALSE,
  target_audience ENUM('todos','estudiantes','profesores','padres','administrativos') NOT NULL,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: payments (Pagos y comprobantes)
-- --------------------------------------------------------
CREATE TABLE payments (
  id              VARCHAR(36)   PRIMARY KEY,
  payer_first_name VARCHAR(100) NOT NULL,
  payer_last_name  VARCHAR(100) NOT NULL,
  payer_id_card    VARCHAR(20)  NOT NULL,
  payer_phone      VARCHAR(30),
  payment_type     ENUM('pago movil','transferencia') NOT NULL,
  bank_name        VARCHAR(100),
  reference_number VARCHAR(50)  NOT NULL,
  amount           DECIMAL(10,2) NOT NULL,
  payment_date     DATE         NOT NULL,
  receipt_image_url TEXT        NOT NULL,
  status           ENUM('pendiente','verificado','rechazado') DEFAULT 'pendiente',
  admin_notes      TEXT,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: certificates (Certificados académicos)
-- --------------------------------------------------------
CREATE TABLE certificates (
  id              VARCHAR(36)   PRIMARY KEY,
  recipient_name  VARCHAR(200)  NOT NULL,
  recipient_type  ENUM('estudiante','profesor') NOT NULL,
  certificate_type ENUM('excelencia_academica','mejor_promedio','conducta_excelente','participacion_destacada','reconocimiento_docente','tiempo_servicio') NOT NULL,
  academic_year   VARCHAR(20),
  grade_level     VARCHAR(50),
  average_grade   DECIMAL(4,2),
  years_of_service INT,
  department      VARCHAR(100),
  issue_date      DATE          NOT NULL,
  issued_by       VARCHAR(200),
  issued_role     VARCHAR(100),
  description     TEXT,
  verification_code VARCHAR(50) UNIQUE,
  status          ENUM('borrador','emitido','entregado') DEFAULT 'emitido',
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: id_cards (Carnets de identificación)
-- --------------------------------------------------------
CREATE TABLE id_cards (
  id              VARCHAR(36)   PRIMARY KEY,
  card_code       VARCHAR(50)   UNIQUE NOT NULL,
  recipient_type  ENUM('estudiante','profesor','administrativo','obrero','profesional') NOT NULL,
  recipient_id    VARCHAR(36),
  recipient_name  VARCHAR(200)  NOT NULL,
  recipient_id_card VARCHAR(20),
  photo_url       TEXT,
  position        VARCHAR(100),
  department      VARCHAR(100),
  grade_level     VARCHAR(50),
  blood_type      VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(30),
  phone           VARCHAR(30),
  address         TEXT,
  email           VARCHAR(255),
  issue_date      DATE,
  expiry_date     DATE,
  status          ENUM('activo','vencido','suspendido') DEFAULT 'activo',
  is_printed      BOOLEAN DEFAULT FALSE,
  created_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_date    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id   VARCHAR(36)
);

-- ============================================================
-- ÍNDICES RECOMENDADOS
-- ============================================================
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_grades_student_subject ON grades(student_id, subject_id);
CREATE INDEX idx_grades_semester ON grades(semester);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_report_cards_student_period ON report_cards(student_id, academic_year, period);
CREATE INDEX idx_schedules_teacher_day ON schedules(teacher_id, day_of_week);
CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_id_cards_recipient ON id_cards(recipient_type, recipient_id);
