-- ============================================================
-- EduFlow / EduManager — PostgreSQL Database Schema
-- Compatible con PostgreSQL 14, 15, 16
-- Schema: school
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS school;
SET search_path TO school, public;

-- Función trigger para updated_date / updated_at automático
CREATE OR REPLACE FUNCTION school.set_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- TABLA: staff (Personal administrativo, obrero y profesional)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.staff (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  staff_id          VARCHAR(50) UNIQUE NOT NULL,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  id_card           VARCHAR(20),
  staff_type        VARCHAR(50) NOT NULL CHECK (staff_type IN ('administrativo','obrero','profesional')),
  position          VARCHAR(100),
  department        VARCHAR(100),
  phone             VARCHAR(30),
  email             VARCHAR(255),
  address           TEXT,
  photo_url         TEXT,
  hire_date         DATE,
  blood_type        VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone   VARCHAR(30),
  status            VARCHAR(20) DEFAULT 'activo' CHECK (status IN ('activo','inactivo','licencia')),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: classrooms (Aulas y laboratorios)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.classrooms (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  room_number       VARCHAR(20) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  capacity          INT NOT NULL,
  type              VARCHAR(50) CHECK (type IN ('aula_regular','laboratorio','biblioteca','auditorio','gimnasio')),
  floor             INT,
  building          VARCHAR(100),
  equipment         TEXT,
  status            VARCHAR(30) DEFAULT 'disponible' CHECK (status IN ('disponible','ocupada','mantenimiento')),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: schedules (Horarios de clases)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.schedules (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  subject_id        INTEGER NOT NULL,
  teacher_id        INTEGER NOT NULL,
  classroom_id      VARCHAR(36),
  grade             VARCHAR(50),
  section           VARCHAR(10),
  day_of_week       VARCHAR(20) NOT NULL CHECK (day_of_week IN ('lunes','martes','miércoles','jueves','viernes','monday','tuesday','wednesday','thursday','friday')),
  start_time        VARCHAR(10) NOT NULL,
  end_time          VARCHAR(10) NOT NULL,
  semester          VARCHAR(50),
  academic_year     VARCHAR(20),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36),
  FOREIGN KEY (subject_id) REFERENCES school.subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES school.teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES school.classrooms(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: schedule_templates (Plantillas de horario docente)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.schedule_templates (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  teacher_id        INTEGER NOT NULL,
  academic_year     VARCHAR(20) NOT NULL,
  education_level   VARCHAR(30) NOT NULL CHECK (education_level IN ('primaria','media')),
  schedule_type     VARCHAR(30) NOT NULL CHECK (schedule_type IN ('mañana','tarde','mañana-tarde')),
  max_hours         DECIMAL(4,1),
  current_hours     DECIMAL(4,1) DEFAULT 0,
  schedule_slots    JSONB,
  status            VARCHAR(20) DEFAULT 'borrador' CHECK (status IN ('borrador','aprobado','finalizado')),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36),
  FOREIGN KEY (teacher_id) REFERENCES school.teachers(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: report_cards (Boletas de calificaciones)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.report_cards (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  student_id        INTEGER NOT NULL,
  academic_year     VARCHAR(20) NOT NULL,
  period            VARCHAR(30) NOT NULL CHECK (period IN ('1er lapso','2do lapso','3er lapso','1er momento','2do momento','3er momento','final')),
  education_level   VARCHAR(30) NOT NULL CHECK (education_level IN ('preescolar','primaria','media')),
  subject_grades    JSONB,
  final_average     DECIMAL(4,2),
  final_letter      VARCHAR(5) CHECK (final_letter IN ('A','B','C','D','E')),
  attendance_present INT DEFAULT 0,
  attendance_absent INT DEFAULT 0,
  attendance_late   INT DEFAULT 0,
  conduct_grade     VARCHAR(10),
  participation_grade VARCHAR(10),
  teacher_observations TEXT,
  verification_code VARCHAR(50) UNIQUE,
  status            VARCHAR(20) DEFAULT 'borrador' CHECK (status IN ('borrador','emitida','entregada')),
  issue_date        DATE,
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36),
  FOREIGN KEY (student_id) REFERENCES school.students(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: academic_plannings (Planificaciones académicas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.academic_plannings (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  teacher_id        INTEGER NOT NULL,
  subject_id        INTEGER NOT NULL,
  academic_year     VARCHAR(20) NOT NULL,
  period            VARCHAR(30) NOT NULL CHECK (period IN ('1er lapso','2do lapso','3er lapso')),
  grade             VARCHAR(50) NOT NULL,
  section           VARCHAR(10),
  group_schedule    VARCHAR(200),
  indispensable_theme TEXT,
  project_theme     TEXT,
  weekly_planning   JSONB,
  general_objectives JSONB,
  evaluation_plan   JSONB,
  student_list      JSONB,
  additional_resources JSONB,
  evaluation_criteria JSONB,
  status            VARCHAR(20) DEFAULT 'borrador' CHECK (status IN ('borrador','finalizada','aprobada')),
  submission_date   DATE,
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36),
  FOREIGN KEY (teacher_id) REFERENCES school.teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES school.subjects(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TABLA: payments (Pagos y comprobantes)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.payments (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  payer_first_name  VARCHAR(100) NOT NULL,
  payer_last_name   VARCHAR(100) NOT NULL,
  payer_id_card     VARCHAR(20) NOT NULL,
  payer_phone       VARCHAR(30),
  payment_type      VARCHAR(50) NOT NULL CHECK (payment_type IN ('pago movil','transferencia','efectivo','tarjeta','otro')),
  bank_name         VARCHAR(100),
  reference_number  VARCHAR(50) NOT NULL,
  amount            DECIMAL(10,2) NOT NULL,
  payment_date      DATE NOT NULL,
  receipt_image_url TEXT NOT NULL,
  status            VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente','verificado','rechazado')),
  admin_notes       TEXT,
  student_id        INTEGER,
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36),
  FOREIGN KEY (student_id) REFERENCES school.students(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- TABLA: certificates (Certificados académicos y menciones)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.certificates (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  recipient_name    VARCHAR(200) NOT NULL,
  recipient_type    VARCHAR(30) NOT NULL CHECK (recipient_type IN ('estudiante','profesor')),
  certificate_type  VARCHAR(50) NOT NULL CHECK (certificate_type IN ('excelencia_academica','mejor_promedio','conducta_excelente','participacion_destacada','reconocimiento_docente','tiempo_servicio')),
  academic_year     VARCHAR(20),
  grade_level       VARCHAR(50),
  average_grade     DECIMAL(4,2),
  years_of_service  INT,
  department        VARCHAR(100),
  issue_date        DATE NOT NULL,
  issued_by         VARCHAR(200),
  issued_role       VARCHAR(100),
  description       TEXT,
  verification_code VARCHAR(50) UNIQUE,
  status            VARCHAR(20) DEFAULT 'emitido' CHECK (status IN ('borrador','emitido','entregado')),
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36)
);

-- --------------------------------------------------------
-- TABLA: id_cards (Carnets de identificación)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS school.id_cards (
  id                SERIAL PRIMARY KEY,
  uuid              UUID NOT NULL DEFAULT gen_random_uuid(),
  card_code         VARCHAR(50) UNIQUE NOT NULL,
  recipient_type    VARCHAR(30) NOT NULL CHECK (recipient_type IN ('estudiante','profesor','administrativo','obrero','profesional')),
  recipient_id      VARCHAR(36),
  recipient_name    VARCHAR(200) NOT NULL,
  recipient_id_card VARCHAR(20),
  photo_url         TEXT,
  position          VARCHAR(100),
  department        VARCHAR(100),
  grade_level       VARCHAR(50),
  blood_type        VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone   VARCHAR(30),
  phone             VARCHAR(30),
  address           TEXT,
  email             VARCHAR(255),
  issue_date        DATE,
  expiry_date       DATE,
  status            VARCHAR(20) DEFAULT 'activo' CHECK (status IN ('activo','vencido','suspendido')),
  is_printed        BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by_id     VARCHAR(36)
);

-- --------------------------------------------------------
-- COLUMNAS ADICIONALES EN TABLAS EXISTENTES
-- --------------------------------------------------------
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'admin';
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS student_id VARCHAR(36);
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS teacher_id VARCHAR(36);
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS parent_id VARCHAR(36);
ALTER TABLE school.users ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);

ALTER TABLE school.parents ADD COLUMN IF NOT EXISTS parent_id VARCHAR(50);
ALTER TABLE school.parents ADD COLUMN IF NOT EXISTS relationship VARCHAR(50);
ALTER TABLE school.parents ADD COLUMN IF NOT EXISTS occupation VARCHAR(255);
ALTER TABLE school.parents ADD COLUMN IF NOT EXISTS emergency_contact BOOLEAN DEFAULT TRUE;

ALTER TABLE school.students ADD COLUMN IF NOT EXISTS id_card VARCHAR(20);
ALTER TABLE school.students ADD COLUMN IF NOT EXISTS section VARCHAR(10);
ALTER TABLE school.students ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20);
ALTER TABLE school.students ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES school.parents(id) ON DELETE SET NULL;

ALTER TABLE school.teachers ADD COLUMN IF NOT EXISTS id_card VARCHAR(20);
ALTER TABLE school.teachers ADD COLUMN IF NOT EXISTS max_hours DECIMAL(4,1);

ALTER TABLE school.subjects ADD COLUMN IF NOT EXISTS grade_level VARCHAR(50);
ALTER TABLE school.subjects ADD COLUMN IF NOT EXISTS prerequisites TEXT;

-- --------------------------------------------------------
-- TRIGGERS PARA UPDATED_AT (Solo para tablas BASE)
-- --------------------------------------------------------
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'school' AND table_type = 'BASE TABLE'
    LOOP
        BEGIN
            EXECUTE format('
                DROP TRIGGER IF EXISTS trigger_set_updated_at ON school.%I;
                CREATE TRIGGER trigger_set_updated_at
                BEFORE UPDATE ON school.%I
                FOR EACH ROW
                EXECUTE FUNCTION school.set_updated_date();
            ', t, t);
        EXCEPTION WHEN OTHERS THEN
            NULL; -- continuar si alguna tabla no tiene columna updated_at
        END;
    END LOOP;
END;
$$;

-- --------------------------------------------------------
-- ÍNDICES DE RENDIMIENTO
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_staff_status ON school.staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_type ON school.staff(staff_type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON school.payments(status);
CREATE INDEX IF NOT EXISTS idx_id_cards_recipient ON school.id_cards(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON school.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_academic_plannings_teacher ON school.academic_plannings(teacher_id, academic_year, period);
CREATE INDEX IF NOT EXISTS idx_report_cards_student_period ON school.report_cards(student_id, academic_year, period);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_day ON school.schedules(teacher_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_classrooms_status ON school.classrooms(status);
