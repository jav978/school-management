const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:7731156883f923bd57704f98f2eaf328@sper2bt8.us-east.database.insforge.app:5432/insforge?sslmode=require';

const pool = new Pool({ connectionString });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🚀 Iniciando migración de Buzón de Sugerencias y Módulo de Feedback...');
    await client.query('BEGIN');

    // 1. Añadir allow_suggestions a school.supply_lists
    await client.query(`
      ALTER TABLE school.supply_lists 
      ADD COLUMN IF NOT EXISTS allow_suggestions BOOLEAN DEFAULT TRUE NOT NULL;
    `);
    console.log('✅ Columna allow_suggestions añadida o verificada en school.supply_lists');

    // 2. Crear tabla school.supply_suggestions
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.supply_suggestions (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() NOT NULL,
        list_id INTEGER REFERENCES school.supply_lists(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES school.users(id) ON DELETE SET NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        user_role VARCHAR(50) DEFAULT 'parent' NOT NULL,
        suggested_item_name VARCHAR(255),
        suggested_category VARCHAR(100),
        suggestion_text TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        admin_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_supply_suggestions_list_id ON school.supply_suggestions(list_id);
      CREATE INDEX IF NOT EXISTS idx_supply_suggestions_status ON school.supply_suggestions(status);
      CREATE INDEX IF NOT EXISTS idx_supply_suggestions_user_id ON school.supply_suggestions(user_id);
    `);
    console.log('✅ Tabla school.supply_suggestions e índices creados');

    // 3. Crear tabla school.system_feedback
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.system_feedback (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() NOT NULL,
        user_id INTEGER REFERENCES school.users(id) ON DELETE SET NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        user_role VARCHAR(50) DEFAULT 'parent' NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        sentiment VARCHAR(50),
        module_tag VARCHAR(100) DEFAULT 'general' NOT NULL,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT FALSE NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_system_feedback_rating ON school.system_feedback(rating);
      CREATE INDEX IF NOT EXISTS idx_system_feedback_role ON school.system_feedback(user_role);
      CREATE INDEX IF NOT EXISTS idx_system_feedback_module ON school.system_feedback(module_tag);
      CREATE INDEX IF NOT EXISTS idx_system_feedback_created ON school.system_feedback(created_at DESC);
    `);
    console.log('✅ Tabla school.system_feedback e índices creados');

    // 4. Sembrar feedbacks representativos si la tabla está vacía
    const countRes = await client.query('SELECT COUNT(*) FROM school.system_feedback');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      console.log('🌱 Sembrando feedbacks y calificaciones iniciales para el panel directivo...');
      const seedFeedbacks = [
        {
          user_name: 'María González (Representante)',
          user_email: 'maria.gonzalez@example.com',
          user_role: 'parent',
          rating: 5,
          sentiment: 'excellent',
          module_tag: 'supplies',
          comment: 'Excelente iniciativa tener la lista de útiles en línea y poder imprimirla en formato carta sin publicidad. Muy ordenado.'
        },
        {
          user_name: 'Carlos Mendoza (Representante)',
          user_email: 'carlos.mendoza@example.com',
          user_role: 'parent',
          rating: 5,
          sentiment: 'excellent',
          module_tag: 'report_cards',
          comment: 'La descarga de boletines en PDF con el sello oficial del colegio ahorra muchísimo tiempo en secretaría. Felicitaciones.'
        },
        {
          user_name: 'Prof. Luisa Terán (Docente Química)',
          user_email: 'luisa.teran@santaluisa.edu.ve',
          user_role: 'teacher',
          rating: 5,
          sentiment: 'excellent',
          module_tag: 'grades',
          comment: 'La carga de evaluaciones y calificaciones por lapsos es muy fluida y rápida. Me facilita mucho el trabajo académico.'
        },
        {
          user_name: 'Prof. Andrés Salazar (Docente Matemática)',
          user_email: 'andres.salazar@santaluisa.edu.ve',
          user_role: 'teacher',
          rating: 4,
          sentiment: 'good',
          module_tag: 'general',
          comment: 'La interfaz es intuitiva y moderna. Sugiero que en la versión móvil se pueda fijar la columna de nombres al registrar asistencia.'
        },
        {
          user_name: 'Lcda. Carmen Rivas (Coordinación)',
          user_email: 'carmen.rivas@santaluisa.edu.ve',
          user_role: 'staff',
          rating: 5,
          sentiment: 'excellent',
          module_tag: 'portal',
          comment: 'El sistema ha centralizado la comunicación entre docentes y directivos de manera impecable.'
        },
        {
          user_name: 'Roberto Valera (Representante)',
          user_email: 'roberto.valera@example.com',
          user_role: 'parent',
          rating: 4,
          sentiment: 'good',
          module_tag: 'supplies',
          comment: 'Muy buena lista para 3er año. Agradezco que dejen sugerir alternativas para el libro de física.'
        }
      ];

      for (const fb of seedFeedbacks) {
        await client.query(`
          INSERT INTO school.system_feedback (user_name, user_email, user_role, rating, sentiment, module_tag, comment)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [fb.user_name, fb.user_email, fb.user_role, fb.rating, fb.sentiment, fb.module_tag, fb.comment]);
      }
      console.log('✅ Sembradas 6 calificaciones y opiniones iniciales');
    }

    await client.query('COMMIT');
    console.log('🎉 Migración completada exitosamente.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
