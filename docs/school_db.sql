-- ============================================================
--  SCHOOL MANAGEMENT SYSTEM - PostgreSQL
--  Módulos: Teachers, Students, Parents, Subjects, Classes,
--           Lessons, Exams, Assignments, Results, Attendance,
--           Events, Messages, Announcements, Profile, Settings
--  Con campos de auditoría completos
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SCHEMA
-- ============================================================
CREATE SCHEMA IF NOT EXISTS school;
SET search_path TO school, public;

-- ============================================================
-- TIPOS ENUMERADOS
-- ============================================================
CREATE TYPE gender_type       AS ENUM ('male','female','other','prefer_not_to_say');
CREATE TYPE user_role         AS ENUM ('admin','teacher','student','parent','staff','planner','teacher_coordinator');
CREATE TYPE user_status       AS ENUM ('active','inactive','suspended','pending','graduated');
CREATE TYPE day_of_week       AS ENUM ('monday','tuesday','wednesday','thursday','friday','saturday','sunday');
CREATE TYPE exam_type         AS ENUM ('written','oral','practical','online','take_home');
CREATE TYPE assignment_type   AS ENUM ('homework','project','lab','research','presentation');
CREATE TYPE submission_status AS ENUM ('pending','submitted','late','graded','resubmit');
CREATE TYPE attendance_status AS ENUM ('present','absent','late','excused','half_day');
CREATE TYPE event_type        AS ENUM ('academic','cultural','sports','holiday','meeting','workshop','other');
CREATE TYPE message_status    AS ENUM ('sent','delivered','read','deleted','archived');
CREATE TYPE notif_priority    AS ENUM ('low','normal','high','urgent');
CREATE TYPE grade_system      AS ENUM ('numeric','letter','percentage','pass_fail','gpa');
CREATE TYPE blood_type        AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-','unknown');
CREATE TYPE marital_status    AS ENUM ('single','married','divorced','widowed','other');
CREATE TYPE term_type         AS ENUM ('semester','trimester','quarter','annual');

-- ============================================================
-- TABLA BASE DE AUDITORÍA (campos comunes)
-- ============================================================
-- Se incluirán estos campos en TODAS las tablas:
--   created_at, created_by, updated_at, updated_by,
--   deleted_at, deleted_by, is_deleted, version, ip_address, user_agent

-- ============================================================
-- 1. COUNTRIES / STATES / CITIES (Geografía)
-- ============================================================
CREATE TABLE countries (
    id            SERIAL PRIMARY KEY,
    code          CHAR(2)       NOT NULL UNIQUE,
    name          VARCHAR(100)  NOT NULL,
    phone_code    VARCHAR(10),
    currency_code CHAR(3),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by    INT,
    updated_at    TIMESTAMPTZ,
    updated_by    INT,
    deleted_at    TIMESTAMPTZ,
    deleted_by    INT,
    is_deleted    BOOLEAN       NOT NULL DEFAULT FALSE,
    version       INT           NOT NULL DEFAULT 1,
    ip_address    INET,
    user_agent    TEXT
);

CREATE TABLE states (
    id          SERIAL PRIMARY KEY,
    country_id  INT          NOT NULL REFERENCES countries(id),
    code        VARCHAR(10),
    name        VARCHAR(100) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by  INT,
    updated_at  TIMESTAMPTZ,
    updated_by  INT,
    deleted_at  TIMESTAMPTZ,
    deleted_by  INT,
    is_deleted  BOOLEAN      NOT NULL DEFAULT FALSE,
    version     INT          NOT NULL DEFAULT 1,
    ip_address  INET,
    user_agent  TEXT
);

CREATE TABLE cities (
    id          SERIAL PRIMARY KEY,
    state_id    INT          NOT NULL REFERENCES states(id),
    name        VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by  INT,
    updated_at  TIMESTAMPTZ,
    updated_by  INT,
    deleted_at  TIMESTAMPTZ,
    deleted_by  INT,
    is_deleted  BOOLEAN      NOT NULL DEFAULT FALSE,
    version     INT          NOT NULL DEFAULT 1,
    ip_address  INET,
    user_agent  TEXT
);

-- ============================================================
-- 2. INSTITUTION (Institución escolar)
-- ============================================================
CREATE TABLE institutions (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    name             VARCHAR(200)  NOT NULL,
    legal_name       VARCHAR(200),
    tax_id           VARCHAR(50),
    logo_url         TEXT,
    website          VARCHAR(200),
    email            VARCHAR(150)  NOT NULL,
    phone_primary    VARCHAR(30),
    phone_secondary  VARCHAR(30),
    address_line1    VARCHAR(200),
    address_line2    VARCHAR(200),
    city_id          INT           REFERENCES cities(id),
    state_id         INT           REFERENCES states(id),
    country_id       INT           REFERENCES countries(id),
    postal_code      VARCHAR(20),
    principal_name   VARCHAR(150),
    founded_year     SMALLINT,
    accreditation_no VARCHAR(100),
    grade_system     grade_system  NOT NULL DEFAULT 'numeric',
    max_grade        NUMERIC(5,2)  NOT NULL DEFAULT 100,
    passing_grade    NUMERIC(5,2)  NOT NULL DEFAULT 60,
    timezone         VARCHAR(60)   NOT NULL DEFAULT 'UTC',
    locale           VARCHAR(10)   NOT NULL DEFAULT 'en_US',
    academic_year_start DATE,
    academic_year_end   DATE,
    settings         JSONB         DEFAULT '{}',
    is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- ============================================================
-- 3. ACADEMIC YEARS & TERMS
-- ============================================================
CREATE TABLE academic_years (
    id             SERIAL PRIMARY KEY,
    institution_id INT          NOT NULL REFERENCES institutions(id),
    name           VARCHAR(50)  NOT NULL,  -- e.g. "2024-2025"
    start_date     DATE         NOT NULL,
    end_date       DATE         NOT NULL,
    is_current     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT,
    CONSTRAINT chk_academic_year_dates CHECK (end_date > start_date)
);

CREATE TABLE terms (
    id               SERIAL PRIMARY KEY,
    academic_year_id INT          NOT NULL REFERENCES academic_years(id),
    name             VARCHAR(50)  NOT NULL,  -- e.g. "First Semester"
    term_type        term_type    NOT NULL DEFAULT 'semester',
    start_date       DATE         NOT NULL,
    end_date         DATE         NOT NULL,
    order_num        SMALLINT     NOT NULL DEFAULT 1,
    is_current       BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    CONSTRAINT chk_term_dates CHECK (end_date > start_date)
);

-- ============================================================
-- 4. USERS (tabla central de autenticación)
-- ============================================================
CREATE TABLE users (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    institution_id      INT          NOT NULL REFERENCES institutions(id),
    username            VARCHAR(80)  NOT NULL UNIQUE,
    email               VARCHAR(150) NOT NULL UNIQUE,
    email_verified_at   TIMESTAMPTZ,
    phone               VARCHAR(30),
    phone_verified_at   TIMESTAMPTZ,
    password_hash       TEXT         NOT NULL,
    password_changed_at TIMESTAMPTZ,
    role                user_role    NOT NULL DEFAULT 'student',
    status              user_status  NOT NULL DEFAULT 'active',
    avatar_url          TEXT,
    locale              VARCHAR(10)  DEFAULT 'en_US',
    timezone            VARCHAR(60)  DEFAULT 'UTC',
    last_login_at       TIMESTAMPTZ,
    last_login_ip       INET,
    login_attempts      SMALLINT     NOT NULL DEFAULT 0,
    locked_until        TIMESTAMPTZ,
    two_factor_enabled  BOOLEAN      NOT NULL DEFAULT FALSE,
    two_factor_secret   TEXT,
    remember_token      TEXT,
    reset_token         TEXT,
    reset_token_exp     TIMESTAMPTZ,
    preferences         JSONB        DEFAULT '{}',
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by          INT,
    updated_at          TIMESTAMPTZ,
    updated_by          INT,
    deleted_at          TIMESTAMPTZ,
    deleted_by          INT,
    is_deleted          BOOLEAN      NOT NULL DEFAULT FALSE,
    version             INT          NOT NULL DEFAULT 1,
    ip_address          INET,
    user_agent          TEXT
);

CREATE TABLE user_sessions (
    id           BIGSERIAL PRIMARY KEY,
    user_id      INT         NOT NULL REFERENCES users(id),
    token        TEXT        NOT NULL UNIQUE,
    ip_address   INET,
    user_agent   TEXT,
    device_type  VARCHAR(50),
    os           VARCHAR(50),
    browser      VARCHAR(50),
    started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMPTZ NOT NULL,
    ended_at     TIMESTAMPTZ,
    is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by   INT,
    updated_at   TIMESTAMPTZ,
    updated_by   INT,
    deleted_at   TIMESTAMPTZ,
    deleted_by   INT,
    is_deleted   BOOLEAN     NOT NULL DEFAULT FALSE,
    version      INT         NOT NULL DEFAULT 1
);

CREATE TABLE audit_logs (
    id           BIGSERIAL PRIMARY KEY,
    user_id      INT,
    session_id   BIGINT,
    action       VARCHAR(100) NOT NULL,
    table_name   VARCHAR(100),
    record_id    INT,
    old_values   JSONB,
    new_values   JSONB,
    ip_address   INET,
    user_agent   TEXT,
    notes        TEXT,
    occurred_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. TEACHERS (Módulo Teachers)
-- ============================================================
CREATE TABLE teachers (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id             INT           NOT NULL UNIQUE REFERENCES users(id),
    institution_id      INT           NOT NULL REFERENCES institutions(id),
    employee_id         VARCHAR(50)   UNIQUE,
    first_name          VARCHAR(80)   NOT NULL,
    middle_name         VARCHAR(80),
    last_name           VARCHAR(80)   NOT NULL,
    date_of_birth       DATE,
    gender              gender_type,
    blood_type          blood_type    DEFAULT 'unknown',
    nationality         VARCHAR(80),
    national_id         VARCHAR(50),
    passport_number     VARCHAR(50),
    marital_status      marital_status,
    photo_url           TEXT,
    bio                 TEXT,
    -- Contacto
    email_personal      VARCHAR(150),
    phone_mobile        VARCHAR(30),
    phone_home          VARCHAR(30),
    phone_work          VARCHAR(30),
    -- Dirección
    address_line1       VARCHAR(200),
    address_line2       VARCHAR(200),
    city_id             INT           REFERENCES cities(id),
    state_id            INT           REFERENCES states(id),
    country_id          INT           REFERENCES countries(id),
    postal_code         VARCHAR(20),
    -- Laboral
    hire_date           DATE,
    termination_date    DATE,
    contract_type       VARCHAR(50),  -- full-time, part-time, contract
    salary              NUMERIC(12,2),
    salary_currency     CHAR(3)       DEFAULT 'USD',
    department          VARCHAR(100),
    position_title      VARCHAR(100),
    office_location     VARCHAR(100),
    -- Académico
    highest_education   VARCHAR(100),
    specialization      VARCHAR(200),
    years_experience    SMALLINT,
    certifications      JSONB         DEFAULT '[]',
    languages           JSONB         DEFAULT '[]',
    -- Social
    linkedin_url        TEXT,
    emergency_contact_name  VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    emergency_contact_rel   VARCHAR(50),
    notes               TEXT,
    status              user_status   NOT NULL DEFAULT 'active',
    -- AUDITORÍA
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by          INT,
    updated_at          TIMESTAMPTZ,
    updated_by          INT,
    deleted_at          TIMESTAMPTZ,
    deleted_by          INT,
    is_deleted          BOOLEAN       NOT NULL DEFAULT FALSE,
    version             INT           NOT NULL DEFAULT 1,
    ip_address          INET,
    user_agent          TEXT
);

CREATE TABLE teacher_qualifications (
    id             SERIAL PRIMARY KEY,
    teacher_id     INT          NOT NULL REFERENCES teachers(id),
    degree         VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(150),
    institution    VARCHAR(200),
    country_id     INT          REFERENCES countries(id),
    start_year     SMALLINT,
    end_year       SMALLINT,
    is_verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    document_url   TEXT,
    notes          TEXT,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

-- ============================================================
-- 6. SUBJECTS (Módulo Subjects)
-- ============================================================
CREATE TABLE subject_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    color_hex   CHAR(7),
    icon        VARCHAR(50),
    -- AUDITORÍA
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by  INT,
    updated_at  TIMESTAMPTZ,
    updated_by  INT,
    deleted_at  TIMESTAMPTZ,
    deleted_by  INT,
    is_deleted  BOOLEAN      NOT NULL DEFAULT FALSE,
    version     INT          NOT NULL DEFAULT 1,
    ip_address  INET,
    user_agent  TEXT
);

CREATE TABLE subjects (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    institution_id   INT           NOT NULL REFERENCES institutions(id),
    category_id      INT           REFERENCES subject_categories(id),
    code             VARCHAR(20)   NOT NULL,
    name             VARCHAR(150)  NOT NULL,
    short_name       VARCHAR(50),
    description      TEXT,
    color_hex        CHAR(7),
    icon_url         TEXT,
    credits          NUMERIC(4,1),
    hours_per_week   NUMERIC(4,1),
    is_elective      BOOLEAN       NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
    syllabus_url     TEXT,
    prerequisites    JSONB         DEFAULT '[]',  -- array de subject IDs
    grade_level      VARCHAR(50),
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (institution_id, code)
);

-- ============================================================
-- 7. GRADES / SECTIONS (Grados y Secciones)
-- ============================================================
CREATE TABLE grades (
    id             SERIAL PRIMARY KEY,
    institution_id INT          NOT NULL REFERENCES institutions(id),
    name           VARCHAR(50)  NOT NULL,   -- e.g. "Grade 10", "Year 2"
    order_num      SMALLINT     NOT NULL,
    description    TEXT,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

-- ============================================================
-- 8. CLASSES (Módulo Classes = aulas/secciones)
-- ============================================================
CREATE TABLE rooms (
    id             SERIAL PRIMARY KEY,
    institution_id INT          NOT NULL REFERENCES institutions(id),
    name           VARCHAR(80)  NOT NULL,
    room_number    VARCHAR(20),
    building       VARCHAR(80),
    floor          VARCHAR(20),
    capacity       SMALLINT,
    room_type      VARCHAR(50),  -- classroom, lab, gym, auditorium
    facilities     JSONB         DEFAULT '[]',
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN       NOT NULL DEFAULT FALSE,
    version        INT           NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

CREATE TABLE classes (
    id               SERIAL PRIMARY KEY,
    uuid             UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    institution_id   INT          NOT NULL REFERENCES institutions(id),
    academic_year_id INT          NOT NULL REFERENCES academic_years(id),
    grade_id         INT          NOT NULL REFERENCES grades(id),
    name             VARCHAR(80)  NOT NULL,  -- e.g. "10-A", "Grade 5 Science"
    section          VARCHAR(20),
    room_id          INT          REFERENCES rooms(id),
    homeroom_teacher_id INT       REFERENCES teachers(id),
    capacity         SMALLINT,
    description      TEXT,
    color_hex        CHAR(7),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- Asignación de materias a clases (con profesor asignado)
CREATE TABLE class_subjects (
    id           SERIAL PRIMARY KEY,
    class_id     INT          NOT NULL REFERENCES classes(id),
    subject_id   INT          NOT NULL REFERENCES subjects(id),
    teacher_id   INT          NOT NULL REFERENCES teachers(id),
    term_id      INT          REFERENCES terms(id),
    hours_week   NUMERIC(4,1),
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by   INT,
    updated_at   TIMESTAMPTZ,
    updated_by   INT,
    deleted_at   TIMESTAMPTZ,
    deleted_by   INT,
    is_deleted   BOOLEAN      NOT NULL DEFAULT FALSE,
    version      INT          NOT NULL DEFAULT 1,
    ip_address   INET,
    user_agent   TEXT,
    UNIQUE (class_id, subject_id, teacher_id, term_id)
);

-- ============================================================
-- 9. PARENTS (Módulo Parents)
-- ============================================================
CREATE TABLE parents (
    id                 SERIAL PRIMARY KEY,
    uuid               UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id            INT           UNIQUE REFERENCES users(id),
    institution_id     INT           NOT NULL REFERENCES institutions(id),
    first_name         VARCHAR(80)   NOT NULL,
    middle_name        VARCHAR(80),
    last_name          VARCHAR(80)   NOT NULL,
    date_of_birth      DATE,
    gender             gender_type,
    national_id        VARCHAR(50),
    photo_url          TEXT,
    -- Contacto
    email_primary      VARCHAR(150),
    email_secondary    VARCHAR(150),
    phone_mobile       VARCHAR(30),
    phone_home         VARCHAR(30),
    phone_work         VARCHAR(30),
    whatsapp           VARCHAR(30),
    -- Dirección
    address_line1      VARCHAR(200),
    address_line2      VARCHAR(200),
    city_id            INT           REFERENCES cities(id),
    state_id           INT           REFERENCES states(id),
    country_id         INT           REFERENCES countries(id),
    postal_code        VARCHAR(20),
    -- Laboral
    occupation         VARCHAR(100),
    employer           VARCHAR(150),
    work_address       TEXT,
    annual_income_range VARCHAR(50),
    -- Información adicional
    education_level    VARCHAR(80),
    marital_status     marital_status,
    preferred_contact  VARCHAR(30)   DEFAULT 'phone',
    preferred_language VARCHAR(30)   DEFAULT 'English',
    notes              TEXT,
    status             user_status   NOT NULL DEFAULT 'active',
    -- AUDITORÍA
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by         INT,
    updated_at         TIMESTAMPTZ,
    updated_by         INT,
    deleted_at         TIMESTAMPTZ,
    deleted_by         INT,
    is_deleted         BOOLEAN       NOT NULL DEFAULT FALSE,
    version            INT           NOT NULL DEFAULT 1,
    ip_address         INET,
    user_agent         TEXT
);

-- ============================================================
-- 10. STUDENTS (Módulo Students)
-- ============================================================
CREATE TABLE students (
    id                      SERIAL PRIMARY KEY,
    uuid                    UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id                 INT           UNIQUE REFERENCES users(id),
    institution_id          INT           NOT NULL REFERENCES institutions(id),
    student_id              VARCHAR(50)   UNIQUE,  -- ID oficial del estudiante
    first_name              VARCHAR(80)   NOT NULL,
    middle_name             VARCHAR(80),
    last_name               VARCHAR(80)   NOT NULL,
    date_of_birth           DATE,
    gender                  gender_type,
    blood_type              blood_type    DEFAULT 'unknown',
    nationality             VARCHAR(80),
    national_id             VARCHAR(50),
    photo_url               TEXT,
    -- Contacto
    email_personal          VARCHAR(150),
    phone_mobile            VARCHAR(30),
    -- Dirección
    address_line1           VARCHAR(200),
    address_line2           VARCHAR(200),
    city_id                 INT           REFERENCES cities(id),
    state_id                INT           REFERENCES states(id),
    country_id              INT           REFERENCES countries(id),
    postal_code             VARCHAR(20),
    -- Académico
    admission_date          DATE,
    graduation_date         DATE,
    expected_graduation     DATE,
    current_class_id        INT           REFERENCES classes(id),
    current_grade_id        INT           REFERENCES grades(id),
    -- Médico
    medical_conditions      TEXT,
    allergies               TEXT,
    medications             TEXT,
    special_needs           TEXT,
    disability_info         TEXT,
    doctor_name             VARCHAR(150),
    doctor_phone            VARCHAR(30),
    insurance_provider      VARCHAR(100),
    insurance_policy_no     VARCHAR(80),
    -- Emergencia
    emergency_contact_name  VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    emergency_contact_rel   VARCHAR(50),
    -- Otros
    religion                VARCHAR(80),
    ethnicity               VARCHAR(80),
    first_language          VARCHAR(80),
    transport_route         VARCHAR(50),
    scholarship             BOOLEAN       NOT NULL DEFAULT FALSE,
    scholarship_details     TEXT,
    notes                   TEXT,
    status                  user_status   NOT NULL DEFAULT 'active',
    -- AUDITORÍA
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by              INT,
    updated_at              TIMESTAMPTZ,
    updated_by              INT,
    deleted_at              TIMESTAMPTZ,
    deleted_by              INT,
    is_deleted              BOOLEAN       NOT NULL DEFAULT FALSE,
    version                 INT           NOT NULL DEFAULT 1,
    ip_address              INET,
    user_agent              TEXT
);

-- Relación estudiante - padre/tutor
CREATE TABLE student_parents (
    id             SERIAL PRIMARY KEY,
    student_id     INT          NOT NULL REFERENCES students(id),
    parent_id      INT          NOT NULL REFERENCES parents(id),
    relationship   VARCHAR(50)  NOT NULL,  -- father, mother, guardian, uncle, etc.
    is_primary     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_emergency   BOOLEAN      NOT NULL DEFAULT FALSE,
    can_pickup     BOOLEAN      NOT NULL DEFAULT TRUE,
    has_custody    BOOLEAN      NOT NULL DEFAULT TRUE,
    notes          TEXT,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT,
    UNIQUE (student_id, parent_id)
);

-- Historial de clases del estudiante
CREATE TABLE student_class_history (
    id           SERIAL PRIMARY KEY,
    student_id   INT          NOT NULL REFERENCES students(id),
    class_id     INT          NOT NULL REFERENCES classes(id),
    term_id      INT          REFERENCES terms(id),
    enrolled_at  DATE         NOT NULL,
    left_at      DATE,
    reason       VARCHAR(200),
    is_current   BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by   INT,
    updated_at   TIMESTAMPTZ,
    updated_by   INT,
    deleted_at   TIMESTAMPTZ,
    deleted_by   INT,
    is_deleted   BOOLEAN      NOT NULL DEFAULT FALSE,
    version      INT          NOT NULL DEFAULT 1,
    ip_address   INET,
    user_agent   TEXT
);

-- ============================================================
-- 11. LESSONS (Módulo Lessons)
-- ============================================================
CREATE TABLE lesson_plans (
    id               SERIAL PRIMARY KEY,
    uuid             UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    class_subject_id INT          NOT NULL REFERENCES class_subjects(id),
    term_id          INT          REFERENCES terms(id),
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    objectives       TEXT,
    materials        JSONB        DEFAULT '[]',
    is_published     BOOLEAN      NOT NULL DEFAULT FALSE,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

CREATE TABLE lessons (
    id               SERIAL PRIMARY KEY,
    uuid             UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    plan_id          INT          REFERENCES lesson_plans(id),
    class_subject_id INT          NOT NULL REFERENCES class_subjects(id),
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    lesson_date      DATE         NOT NULL,
    start_time       TIME,
    end_time         TIME,
    duration_minutes SMALLINT,
    room_id          INT          REFERENCES rooms(id),
    topic            VARCHAR(300),
    objectives       TEXT,
    content          TEXT,
    methodology      TEXT,
    resources        JSONB        DEFAULT '[]',  -- URLs, archivos, links
    homework_notes   TEXT,
    is_online        BOOLEAN      NOT NULL DEFAULT FALSE,
    meeting_url      TEXT,
    meeting_id       VARCHAR(100),
    meeting_password VARCHAR(50),
    recording_url    TEXT,
    status           VARCHAR(30)  NOT NULL DEFAULT 'scheduled',  -- scheduled, in_progress, completed, cancelled
    cancellation_reason TEXT,
    notes            TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- Horario de clases (timetable)
CREATE TABLE timetable_slots (
    id               SERIAL PRIMARY KEY,
    institution_id   INT          NOT NULL REFERENCES institutions(id),
    class_subject_id INT          NOT NULL REFERENCES class_subjects(id),
    room_id          INT          REFERENCES rooms(id),
    day_of_week      day_of_week  NOT NULL,
    start_time       TIME         NOT NULL,
    end_time         TIME         NOT NULL,
    effective_from   DATE,
    effective_to     DATE,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- ============================================================
-- 12. EXAMS (Módulo Exams)
-- ============================================================
CREATE TABLE exams (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    class_subject_id INT           NOT NULL REFERENCES class_subjects(id),
    term_id          INT           REFERENCES terms(id),
    title            VARCHAR(200)  NOT NULL,
    description      TEXT,
    exam_type        exam_type     NOT NULL DEFAULT 'written',
    exam_date        DATE          NOT NULL,
    start_time       TIME,
    end_time         TIME,
    duration_minutes SMALLINT,
    room_id          INT           REFERENCES rooms(id),
    total_marks      NUMERIC(6,2)  NOT NULL DEFAULT 100,
    passing_marks    NUMERIC(6,2),
    weight_percent   NUMERIC(5,2),  -- % del total del curso
    instructions     TEXT,
    syllabus_topics  TEXT,
    is_published     BOOLEAN       NOT NULL DEFAULT FALSE,
    results_published BOOLEAN      NOT NULL DEFAULT FALSE,
    allow_retake     BOOLEAN       NOT NULL DEFAULT FALSE,
    max_retakes      SMALLINT      NOT NULL DEFAULT 1,
    is_online        BOOLEAN       NOT NULL DEFAULT FALSE,
    online_link      TEXT,
    status           VARCHAR(30)   NOT NULL DEFAULT 'scheduled',
    notes            TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- Preguntas de examen (para exámenes online/banco de preguntas)
CREATE TABLE exam_questions (
    id            SERIAL PRIMARY KEY,
    exam_id       INT          NOT NULL REFERENCES exams(id),
    question_text TEXT         NOT NULL,
    question_type VARCHAR(30)  NOT NULL DEFAULT 'multiple_choice',
    options       JSONB        DEFAULT '[]',
    correct_answer TEXT,
    marks         NUMERIC(5,2) NOT NULL DEFAULT 1,
    order_num     SMALLINT,
    explanation   TEXT,
    -- AUDITORÍA
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by    INT,
    updated_at    TIMESTAMPTZ,
    updated_by    INT,
    deleted_at    TIMESTAMPTZ,
    deleted_by    INT,
    is_deleted    BOOLEAN      NOT NULL DEFAULT FALSE,
    version       INT          NOT NULL DEFAULT 1,
    ip_address    INET,
    user_agent    TEXT
);

-- ============================================================
-- 13. ASSIGNMENTS (Módulo Assignments)
-- ============================================================
CREATE TABLE assignments (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    class_subject_id INT           NOT NULL REFERENCES class_subjects(id),
    term_id          INT           REFERENCES terms(id),
    title            VARCHAR(200)  NOT NULL,
    description      TEXT,
    assignment_type  assignment_type NOT NULL DEFAULT 'homework',
    assigned_date    DATE          NOT NULL,
    due_date         DATE          NOT NULL,
    due_time         TIME,
    total_marks      NUMERIC(6,2)  NOT NULL DEFAULT 100,
    passing_marks    NUMERIC(6,2),
    weight_percent   NUMERIC(5,2),
    instructions     TEXT,
    resources        JSONB         DEFAULT '[]',
    allow_late       BOOLEAN       NOT NULL DEFAULT FALSE,
    late_penalty_pct NUMERIC(5,2)  DEFAULT 0,
    is_published     BOOLEAN       NOT NULL DEFAULT FALSE,
    is_group_work    BOOLEAN       NOT NULL DEFAULT FALSE,
    max_group_size   SMALLINT,
    rubric_url       TEXT,
    notes            TEXT,
    status           VARCHAR(30)   NOT NULL DEFAULT 'active',  -- active, closed, archived
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    CONSTRAINT chk_assignment_dates CHECK (due_date >= assigned_date)
);

-- Entregas de assignments
CREATE TABLE assignment_submissions (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    assignment_id    INT           NOT NULL REFERENCES assignments(id),
    student_id       INT           NOT NULL REFERENCES students(id),
    submitted_at     TIMESTAMPTZ,
    content_text     TEXT,
    file_urls        JSONB         DEFAULT '[]',
    external_url     TEXT,
    status           submission_status NOT NULL DEFAULT 'pending',
    is_late          BOOLEAN       NOT NULL DEFAULT FALSE,
    late_minutes     INT,
    marks_obtained   NUMERIC(6,2),
    grade_letter     CHAR(2),
    feedback         TEXT,
    graded_at        TIMESTAMPTZ,
    graded_by        INT           REFERENCES teachers(id),
    attempt_number   SMALLINT      NOT NULL DEFAULT 1,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (assignment_id, student_id, attempt_number)
);

-- ============================================================
-- 14. RESULTS (Módulo Results)
-- ============================================================
CREATE TABLE exam_results (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    exam_id          INT           NOT NULL REFERENCES exams(id),
    student_id       INT           NOT NULL REFERENCES students(id),
    marks_obtained   NUMERIC(6,2)  NOT NULL,
    total_marks      NUMERIC(6,2)  NOT NULL,
    percentage       NUMERIC(5,2)  GENERATED ALWAYS AS (ROUND((marks_obtained / NULLIF(total_marks,0)) * 100, 2)) STORED,
    grade_letter     CHAR(2),
    is_passed        BOOLEAN,
    attempt_number   SMALLINT      NOT NULL DEFAULT 1,
    is_absent        BOOLEAN       NOT NULL DEFAULT FALSE,
    remarks          TEXT,
    graded_by        INT           REFERENCES teachers(id),
    graded_at        TIMESTAMPTZ,
    published_at     TIMESTAMPTZ,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (exam_id, student_id, attempt_number)
);

-- Resultado general por término (reporte de calificaciones)
CREATE TABLE term_report_cards (
    id                   SERIAL PRIMARY KEY,
    uuid                 UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    student_id           INT           NOT NULL REFERENCES students(id),
    class_id             INT           NOT NULL REFERENCES classes(id),
    term_id              INT           NOT NULL REFERENCES terms(id),
    total_marks_obtained NUMERIC(8,2),
    total_marks_possible NUMERIC(8,2),
    overall_percentage   NUMERIC(5,2),
    overall_grade        CHAR(2),
    gpa                  NUMERIC(4,2),
    rank_in_class        SMALLINT,
    total_students       SMALLINT,
    attendance_pct       NUMERIC(5,2),
    teacher_comment      TEXT,
    principal_comment    TEXT,
    parent_viewed_at     TIMESTAMPTZ,
    is_published         BOOLEAN       NOT NULL DEFAULT FALSE,
    published_at         TIMESTAMPTZ,
    -- AUDITORÍA
    created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by           INT,
    updated_at           TIMESTAMPTZ,
    updated_by           INT,
    deleted_at           TIMESTAMPTZ,
    deleted_by           INT,
    is_deleted           BOOLEAN       NOT NULL DEFAULT FALSE,
    version              INT           NOT NULL DEFAULT 1,
    ip_address           INET,
    user_agent           TEXT,
    UNIQUE (student_id, term_id)
);

-- Detalle por materia del reporte
CREATE TABLE report_card_subjects (
    id               SERIAL PRIMARY KEY,
    report_card_id   INT           NOT NULL REFERENCES term_report_cards(id),
    subject_id       INT           NOT NULL REFERENCES subjects(id),
    teacher_id       INT           REFERENCES teachers(id),
    exam_marks       NUMERIC(6,2),
    assignment_marks NUMERIC(6,2),
    attendance_marks NUMERIC(6,2),
    total_marks      NUMERIC(6,2),
    max_marks        NUMERIC(6,2),
    percentage       NUMERIC(5,2),
    grade_letter     CHAR(2),
    is_passed        BOOLEAN,
    rank             SMALLINT,
    teacher_remark   TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (report_card_id, subject_id)
);

-- Escala de calificaciones
CREATE TABLE grade_scales (
    id             SERIAL PRIMARY KEY,
    institution_id INT          NOT NULL REFERENCES institutions(id),
    name           VARCHAR(50)  NOT NULL,
    min_percent    NUMERIC(5,2) NOT NULL,
    max_percent    NUMERIC(5,2) NOT NULL,
    grade_letter   CHAR(2)      NOT NULL,
    grade_point    NUMERIC(3,1),
    description    VARCHAR(100),
    color_hex      CHAR(7),
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

-- ============================================================
-- 15. ATTENDANCE (Módulo Attendance)
-- ============================================================
CREATE TABLE attendance (
    id               SERIAL PRIMARY KEY,
    uuid             UUID             NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    student_id       INT              NOT NULL REFERENCES students(id),
    class_id         INT              NOT NULL REFERENCES classes(id),
    lesson_id        INT              REFERENCES lessons(id),
    teacher_id       INT              NOT NULL REFERENCES teachers(id),
    attendance_date  DATE             NOT NULL,
    status           attendance_status NOT NULL DEFAULT 'present',
    check_in_time    TIME,
    check_out_time   TIME,
    minutes_late     SMALLINT,
    excuse_reason    TEXT,
    excuse_document  TEXT,
    is_excused       BOOLEAN          NOT NULL DEFAULT FALSE,
    parent_notified  BOOLEAN          NOT NULL DEFAULT FALSE,
    notified_at      TIMESTAMPTZ,
    notes            TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN          NOT NULL DEFAULT FALSE,
    version          INT              NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (student_id, class_id, attendance_date)
);

-- Resumen de asistencia por período
CREATE TABLE attendance_summary (
    id               SERIAL PRIMARY KEY,
    student_id       INT          NOT NULL REFERENCES students(id),
    class_id         INT          NOT NULL REFERENCES classes(id),
    term_id          INT          NOT NULL REFERENCES terms(id),
    total_days       SMALLINT     NOT NULL DEFAULT 0,
    days_present     SMALLINT     NOT NULL DEFAULT 0,
    days_absent      SMALLINT     NOT NULL DEFAULT 0,
    days_late        SMALLINT     NOT NULL DEFAULT 0,
    days_excused     SMALLINT     NOT NULL DEFAULT 0,
    days_half        SMALLINT     NOT NULL DEFAULT 0,
    attendance_pct   NUMERIC(5,2) GENERATED ALWAYS AS
                     (ROUND((days_present::NUMERIC / NULLIF(total_days,0)) * 100, 2)) STORED,
    last_updated_at  TIMESTAMPTZ,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (student_id, class_id, term_id)
);

-- ============================================================
-- 16. EVENTS (Módulo Events)
-- ============================================================
CREATE TABLE events (
    id               SERIAL PRIMARY KEY,
    uuid             UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    institution_id   INT          NOT NULL REFERENCES institutions(id),
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    event_type       event_type   NOT NULL DEFAULT 'other',
    start_datetime   TIMESTAMPTZ  NOT NULL,
    end_datetime     TIMESTAMPTZ  NOT NULL,
    all_day          BOOLEAN      NOT NULL DEFAULT FALSE,
    location         VARCHAR(200),
    room_id          INT          REFERENCES rooms(id),
    is_online        BOOLEAN      NOT NULL DEFAULT FALSE,
    online_link      TEXT,
    cover_image_url  TEXT,
    organizer_id     INT          REFERENCES users(id),
    capacity         INT,
    registration_required BOOLEAN NOT NULL DEFAULT FALSE,
    registration_deadline TIMESTAMPTZ,
    is_public        BOOLEAN      NOT NULL DEFAULT TRUE,
    is_published     BOOLEAN      NOT NULL DEFAULT FALSE,
    color_hex        CHAR(7),
    recurrence_rule  TEXT,  -- iCal RRULE
    parent_event_id  INT          REFERENCES events(id),
    tags             JSONB        DEFAULT '[]',
    attachments      JSONB        DEFAULT '[]',
    status           VARCHAR(30)  NOT NULL DEFAULT 'upcoming',
    cancellation_reason TEXT,
    notes            TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    CONSTRAINT chk_event_dates CHECK (end_datetime >= start_datetime)
);

-- A quién va dirigido el evento
CREATE TABLE event_targets (
    id           SERIAL PRIMARY KEY,
    event_id     INT         NOT NULL REFERENCES events(id),
    target_type  VARCHAR(30) NOT NULL,  -- all, class, grade, role, specific_user
    target_id    INT,
    -- AUDITORÍA
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by   INT,
    updated_at   TIMESTAMPTZ,
    updated_by   INT,
    deleted_at   TIMESTAMPTZ,
    deleted_by   INT,
    is_deleted   BOOLEAN     NOT NULL DEFAULT FALSE,
    version      INT         NOT NULL DEFAULT 1,
    ip_address   INET,
    user_agent   TEXT
);

-- Participantes / inscripciones a eventos
CREATE TABLE event_attendees (
    id             SERIAL PRIMARY KEY,
    event_id       INT          NOT NULL REFERENCES events(id),
    user_id        INT          NOT NULL REFERENCES users(id),
    registered_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    attended       BOOLEAN,
    check_in_at    TIMESTAMPTZ,
    notes          TEXT,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT,
    UNIQUE (event_id, user_id)
);

-- ============================================================
-- 17. MESSAGES (Módulo Messages)
-- ============================================================
CREATE TABLE conversations (
    id             SERIAL PRIMARY KEY,
    uuid           UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    subject        VARCHAR(300),
    is_group       BOOLEAN      NOT NULL DEFAULT FALSE,
    group_name     VARCHAR(150),
    created_by     INT          NOT NULL REFERENCES users(id),
    last_message_at TIMESTAMPTZ,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

CREATE TABLE conversation_participants (
    id                SERIAL PRIMARY KEY,
    conversation_id   INT         NOT NULL REFERENCES conversations(id),
    user_id           INT         NOT NULL REFERENCES users(id),
    joined_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at           TIMESTAMPTZ,
    is_admin          BOOLEAN     NOT NULL DEFAULT FALSE,
    is_muted          BOOLEAN     NOT NULL DEFAULT FALSE,
    last_read_at      TIMESTAMPTZ,
    -- AUDITORÍA
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by        INT,
    updated_at        TIMESTAMPTZ,
    updated_by        INT,
    deleted_at        TIMESTAMPTZ,
    deleted_by        INT,
    is_deleted        BOOLEAN     NOT NULL DEFAULT FALSE,
    version           INT         NOT NULL DEFAULT 1,
    ip_address        INET,
    user_agent        TEXT,
    UNIQUE (conversation_id, user_id)
);

CREATE TABLE messages (
    id               SERIAL PRIMARY KEY,
    uuid             UUID             NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    conversation_id  INT              NOT NULL REFERENCES conversations(id),
    sender_id        INT              NOT NULL REFERENCES users(id),
    body             TEXT,
    body_html        TEXT,
    attachments      JSONB            DEFAULT '[]',
    status           message_status   NOT NULL DEFAULT 'sent',
    is_system_msg    BOOLEAN          NOT NULL DEFAULT FALSE,
    reply_to_id      INT              REFERENCES messages(id),
    edited_at        TIMESTAMPTZ,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN          NOT NULL DEFAULT FALSE,
    version          INT              NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

CREATE TABLE message_receipts (
    id             SERIAL PRIMARY KEY,
    message_id     INT          NOT NULL REFERENCES messages(id),
    recipient_id   INT          NOT NULL REFERENCES users(id),
    delivered_at   TIMESTAMPTZ,
    read_at        TIMESTAMPTZ,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,
    version        INT          NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT,
    UNIQUE (message_id, recipient_id)
);

-- ============================================================
-- 18. ANNOUNCEMENTS (Módulo Announcements)
-- ============================================================
CREATE TABLE announcements (
    id               SERIAL PRIMARY KEY,
    uuid             UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    institution_id   INT           NOT NULL REFERENCES institutions(id),
    author_id        INT           NOT NULL REFERENCES users(id),
    title            VARCHAR(300)  NOT NULL,
    body             TEXT          NOT NULL,
    body_html        TEXT,
    cover_image_url  TEXT,
    attachments      JSONB         DEFAULT '[]',
    priority         notif_priority NOT NULL DEFAULT 'normal',
    is_published     BOOLEAN       NOT NULL DEFAULT FALSE,
    published_at     TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ,
    is_pinned        BOOLEAN       NOT NULL DEFAULT FALSE,
    send_push        BOOLEAN       NOT NULL DEFAULT FALSE,
    send_email       BOOLEAN       NOT NULL DEFAULT FALSE,
    send_sms         BOOLEAN       NOT NULL DEFAULT FALSE,
    tags             JSONB         DEFAULT '[]',
    view_count       INT           NOT NULL DEFAULT 0,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- A quién va el anuncio
CREATE TABLE announcement_targets (
    id               SERIAL PRIMARY KEY,
    announcement_id  INT         NOT NULL REFERENCES announcements(id),
    target_type      VARCHAR(30) NOT NULL,  -- all, role, class, grade, specific_user
    target_id        INT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN     NOT NULL DEFAULT FALSE,
    version          INT         NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- Lectura de anuncios
CREATE TABLE announcement_reads (
    id               SERIAL PRIMARY KEY,
    announcement_id  INT         NOT NULL REFERENCES announcements(id),
    user_id          INT         NOT NULL REFERENCES users(id),
    read_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- AUDITORÍA
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN     NOT NULL DEFAULT FALSE,
    version          INT         NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (announcement_id, user_id)
);

-- ============================================================
-- 19. NOTIFICATIONS (Sistema de notificaciones)
-- ============================================================
CREATE TABLE notifications (
    id               BIGSERIAL PRIMARY KEY,
    user_id          INT           NOT NULL REFERENCES users(id),
    title            VARCHAR(200)  NOT NULL,
    body             TEXT,
    type             VARCHAR(50)   NOT NULL,
    priority         notif_priority NOT NULL DEFAULT 'normal',
    data             JSONB         DEFAULT '{}',
    is_read          BOOLEAN       NOT NULL DEFAULT FALSE,
    read_at          TIMESTAMPTZ,
    action_url       TEXT,
    icon             VARCHAR(50),
    expires_at       TIMESTAMPTZ,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN       NOT NULL DEFAULT FALSE,
    version          INT           NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT
);

-- ============================================================
-- 20. SETTINGS (Módulo Settings)
-- ============================================================
CREATE TABLE settings (
    id               SERIAL PRIMARY KEY,
    institution_id   INT          REFERENCES institutions(id),
    user_id          INT          REFERENCES users(id),
    category         VARCHAR(80)  NOT NULL,
    key              VARCHAR(100) NOT NULL,
    value            TEXT,
    value_json       JSONB,
    data_type        VARCHAR(20)  NOT NULL DEFAULT 'string',
    is_public        BOOLEAN      NOT NULL DEFAULT FALSE,
    description      TEXT,
    -- AUDITORÍA
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by       INT,
    updated_at       TIMESTAMPTZ,
    updated_by       INT,
    deleted_at       TIMESTAMPTZ,
    deleted_by       INT,
    is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    version          INT          NOT NULL DEFAULT 1,
    ip_address       INET,
    user_agent       TEXT,
    UNIQUE (institution_id, user_id, category, key)
);

-- ============================================================
-- 21. FEES / PAYMENTS (Pagos y matrículas)
-- ============================================================
CREATE TABLE fee_types (
    id             SERIAL PRIMARY KEY,
    institution_id INT           NOT NULL REFERENCES institutions(id),
    name           VARCHAR(100)  NOT NULL,
    description    TEXT,
    is_mandatory   BOOLEAN       NOT NULL DEFAULT TRUE,
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN       NOT NULL DEFAULT FALSE,
    version        INT           NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

CREATE TABLE student_fees (
    id             SERIAL PRIMARY KEY,
    uuid           UUID          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    student_id     INT           NOT NULL REFERENCES students(id),
    fee_type_id    INT           NOT NULL REFERENCES fee_types(id),
    academic_year_id INT         NOT NULL REFERENCES academic_years(id),
    term_id        INT           REFERENCES terms(id),
    amount         NUMERIC(12,2) NOT NULL,
    currency       CHAR(3)       NOT NULL DEFAULT 'USD',
    due_date       DATE          NOT NULL,
    paid_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_at        TIMESTAMPTZ,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    receipt_url    TEXT,
    is_paid        BOOLEAN       NOT NULL DEFAULT FALSE,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    discount_reason VARCHAR(200),
    notes          TEXT,
    -- AUDITORÍA
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by     INT,
    updated_at     TIMESTAMPTZ,
    updated_by     INT,
    deleted_at     TIMESTAMPTZ,
    deleted_by     INT,
    is_deleted     BOOLEAN       NOT NULL DEFAULT FALSE,
    version        INT           NOT NULL DEFAULT 1,
    ip_address     INET,
    user_agent     TEXT
);

-- ============================================================
-- ÍNDICES PRINCIPALES
-- ============================================================
-- Users
CREATE INDEX idx_users_institution  ON users(institution_id);
CREATE INDEX idx_users_role         ON users(role);
CREATE INDEX idx_users_status       ON users(status);
CREATE INDEX idx_users_email        ON users(email);

-- Teachers
CREATE INDEX idx_teachers_user      ON teachers(user_id);
CREATE INDEX idx_teachers_inst      ON teachers(institution_id);
CREATE INDEX idx_teachers_status    ON teachers(status);

-- Students
CREATE INDEX idx_students_user      ON students(user_id);
CREATE INDEX idx_students_inst      ON students(institution_id);
CREATE INDEX idx_students_class     ON students(current_class_id);
CREATE INDEX idx_students_status    ON students(status);

-- Parents
CREATE INDEX idx_parents_user       ON parents(user_id);

-- Classes
CREATE INDEX idx_classes_year       ON classes(academic_year_id);
CREATE INDEX idx_classes_grade      ON classes(grade_id);
CREATE INDEX idx_classes_teacher    ON classes(homeroom_teacher_id);

-- Lessons
CREATE INDEX idx_lessons_date       ON lessons(lesson_date);
CREATE INDEX idx_lessons_class_sub  ON lessons(class_subject_id);

-- Exams
CREATE INDEX idx_exams_date         ON exams(exam_date);
CREATE INDEX idx_exams_class_sub    ON exams(class_subject_id);

-- Assignments
CREATE INDEX idx_assign_due         ON assignments(due_date);
CREATE INDEX idx_assign_class_sub   ON assignments(class_subject_id);

-- Attendance
CREATE INDEX idx_attend_student     ON attendance(student_id);
CREATE INDEX idx_attend_date        ON attendance(attendance_date);
CREATE INDEX idx_attend_class       ON attendance(class_id);

-- Exam Results
CREATE INDEX idx_exam_res_student   ON exam_results(student_id);
CREATE INDEX idx_exam_res_exam      ON exam_results(exam_id);

-- Notifications
CREATE INDEX idx_notif_user         ON notifications(user_id);
CREATE INDEX idx_notif_read         ON notifications(is_read);

-- Messages
CREATE INDEX idx_msg_conversation   ON messages(conversation_id);
CREATE INDEX idx_msg_sender         ON messages(sender_id);

-- Announcements
CREATE INDEX idx_ann_institution    ON announcements(institution_id);
CREATE INDEX idx_ann_published      ON announcements(is_published, published_at);

-- Audit general: todos los is_deleted para soft-delete
CREATE INDEX idx_teachers_not_del   ON teachers(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_students_not_del   ON students(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_parents_not_del    ON parents(is_deleted)  WHERE is_deleted = FALSE;
CREATE INDEX idx_lessons_not_del    ON lessons(is_deleted)  WHERE is_deleted = FALSE;

-- ============================================================
-- FUNCIÓN DE AUDITORÍA AUTOMÁTICA (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_audit_updated()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := NOW();
    NEW.version    := OLD.version + 1;
    RETURN NEW;
END;
$$;

-- Aplicar trigger a las tablas principales
DO $$
DECLARE
    t TEXT;
    tables TEXT[] := ARRAY[
        'institutions','academic_years','terms','users',
        'teachers','teacher_qualifications',
        'subjects','subject_categories','grades','rooms','classes','class_subjects',
        'parents','students','student_parents','student_class_history',
        'lesson_plans','lessons','timetable_slots',
        'exams','exam_questions',
        'assignments','assignment_submissions',
        'exam_results','term_report_cards','report_card_subjects','grade_scales',
        'attendance','attendance_summary',
        'events','event_targets','event_attendees',
        'conversations','conversation_participants','messages','message_receipts',
        'announcements','announcement_targets','announcement_reads',
        'notifications','settings','fee_types','student_fees',
        'countries','states','cities'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE FORMAT(
            'CREATE TRIGGER trg_%s_audit
             BEFORE UPDATE ON %s
             FOR EACH ROW EXECUTE FUNCTION fn_set_audit_updated();',
            t, t
        );
    END LOOP;
END;
$$;

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: estudiantes con su clase actual
CREATE OR REPLACE VIEW v_students_current AS
SELECT
    s.id,
    s.student_id,
    s.first_name || ' ' || s.last_name AS full_name,
    s.date_of_birth,
    s.gender,
    s.status,
    c.name  AS class_name,
    g.name  AS grade_name,
    ay.name AS academic_year
FROM students s
LEFT JOIN classes c        ON c.id = s.current_class_id
LEFT JOIN grades g         ON g.id = s.current_grade_id
LEFT JOIN academic_years ay ON ay.id = c.academic_year_id
WHERE s.is_deleted = FALSE;

-- Vista: asistencia por estudiante (resumen)
CREATE OR REPLACE VIEW v_attendance_overview AS
SELECT
    s.id AS student_id,
    s.first_name || ' ' || s.last_name AS full_name,
    c.name AS class_name,
    t.name AS term,
    ats.total_days,
    ats.days_present,
    ats.days_absent,
    ats.days_late,
    ats.attendance_pct
FROM attendance_summary ats
JOIN students s ON s.id = ats.student_id
JOIN classes  c ON c.id = ats.class_id
JOIN terms    t ON t.id = ats.term_id
WHERE ats.is_deleted = FALSE;

-- Vista: ranking de resultados por examen
CREATE OR REPLACE VIEW v_exam_rankings AS
SELECT
    er.exam_id,
    e.title AS exam_title,
    s.first_name || ' ' || s.last_name AS student_name,
    er.marks_obtained,
    er.total_marks,
    er.percentage,
    er.grade_letter,
    RANK() OVER (PARTITION BY er.exam_id ORDER BY er.marks_obtained DESC) AS rank
FROM exam_results er
JOIN exams    e ON e.id = er.exam_id
JOIN students s ON s.id = er.student_id
WHERE er.is_deleted = FALSE AND er.is_absent = FALSE;

-- ============================================================
-- COMENTARIOS EN TABLAS
-- ============================================================
COMMENT ON TABLE institutions         IS 'Institución educativa principal';
COMMENT ON TABLE academic_years       IS 'Años académicos registrados';
COMMENT ON TABLE terms                IS 'Períodos/semestres dentro de un año académico';
COMMENT ON TABLE users                IS 'Tabla central de autenticación y acceso';
COMMENT ON TABLE teachers             IS 'Información completa de docentes';
COMMENT ON TABLE students             IS 'Información completa de estudiantes';
COMMENT ON TABLE parents              IS 'Padres y/o tutores de estudiantes';
COMMENT ON TABLE classes              IS 'Aulas/secciones por año y grado';
COMMENT ON TABLE subjects             IS 'Materias o asignaturas del currículum';
COMMENT ON TABLE lessons              IS 'Clases/lecciones impartidas';
COMMENT ON TABLE exams                IS 'Exámenes programados por materia';
COMMENT ON TABLE assignments          IS 'Tareas y trabajos asignados';
COMMENT ON TABLE attendance           IS 'Registro de asistencia diaria por estudiante';
COMMENT ON TABLE events               IS 'Eventos del calendario escolar';
COMMENT ON TABLE messages             IS 'Mensajes del sistema de mensajería interna';
COMMENT ON TABLE announcements        IS 'Comunicados y anuncios institucionales';
COMMENT ON TABLE notifications        IS 'Notificaciones push/in-app a usuarios';
COMMENT ON TABLE audit_logs           IS 'Log general de auditoría de acciones del sistema';
COMMENT ON TABLE settings             IS 'Configuraciones a nivel institución y usuario';

