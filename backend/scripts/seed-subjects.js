const db = require('../src/database')

async function seed() {
  console.log('🌱 Sembrando categorías y materias de referencia...')

  try {
    // 1. Seed categories if empty
    const existingCategories = await db('school.subject_categories').select('*')
    let categoryMap = {}

    if (existingCategories.length === 0) {
      const insertedCategories = await db('school.subject_categories').insert([
        { name: 'Ciencias Naturales y Exactas', description: 'Biología, Química, Física y Geología', color_hex: '#10B981', icon: 'leaf' },
        { name: 'Lengua, Humanidades y Arte', description: 'Castellano, Literatura, Historia, Idiomas', color_hex: '#3B82F6', icon: 'book' },
        { name: 'Matemática y Lógica', description: 'Álgebra, Geometría, Cálculo y Estadística', color_hex: '#6366F1', icon: 'calculator' },
        { name: 'Formación Integral y Valores', description: 'Educación Religiosa, Ética y Educación Física', color_hex: '#8B5CF6', icon: 'heart' }
      ]).returning('*')
      insertedCategories.forEach(c => { categoryMap[c.name] = c.id })
      console.log(`✓ Creados ${insertedCategories.length} departamentos/categorías.`)
    } else {
      existingCategories.forEach(c => { categoryMap[c.name] = c.id })
    }

    // 2. Check existing subjects
    const existingSubjects = await db('school.subjects').where({ is_deleted: false })
    if (existingSubjects.length > 0) {
      console.log(`ℹ️ Ya existen ${existingSubjects.length} materias en la base de datos. Omitiendo siembra.`)
      process.exit(0)
    }

    const defaultCatId = Object.values(categoryMap)[0] || 1

    const subjectsData = [
      {
        institution_id: 1,
        category_id: categoryMap['Ciencias Naturales y Exactas'] || defaultCatId,
        code: 'CNAT-M',
        name: 'Ciencias Naturales',
        short_name: 'CNAT',
        description: 'Ciencias Naturales para bachillerato',
        grade_level: 'media',
        credits: 4,
        hours_per_week: 4,
        is_active: true,
        color_hex: '#0D9488'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Lengua, Humanidades y Arte'] || defaultCatId,
        code: 'CAST-M',
        name: 'Castellano',
        short_name: 'CAST',
        description: 'Lengua y Literatura para bachillerato',
        grade_level: 'media',
        credits: 4,
        hours_per_week: 4,
        is_active: true,
        color_hex: '#3B82F6'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Matemática y Lógica'] || defaultCatId,
        code: 'MAT-M',
        name: 'Matemática',
        short_name: 'MAT',
        description: 'Matemática para bachillerato',
        grade_level: 'media',
        credits: 5,
        hours_per_week: 5,
        is_active: true,
        color_hex: '#6366F1'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Formación Integral y Valores'] || defaultCatId,
        code: 'EDFE-M',
        name: 'Educación de la Fe',
        short_name: 'EDFE',
        description: 'Educación Religiosa y de la Fe',
        grade_level: 'media',
        credits: 2,
        hours_per_week: 2,
        is_active: true,
        color_hex: '#8B5CF6'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Ciencias Naturales y Exactas'] || defaultCatId,
        code: 'QUIM-M',
        name: 'Química',
        short_name: 'QUIM',
        description: 'Química para bachillerato (4to-5to año)',
        grade_level: 'media',
        credits: 4,
        hours_per_week: 4,
        is_active: true,
        color_hex: '#0284C7'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Ciencias Naturales y Exactas'] || defaultCatId,
        code: 'FIS-M',
        name: 'Física',
        short_name: 'FIS',
        description: 'Física para bachillerato (4to-5to año)',
        grade_level: 'media',
        credits: 4,
        hours_per_week: 4,
        is_active: true,
        color_hex: '#2563EB'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Ciencias Naturales y Exactas'] || defaultCatId,
        code: 'BIO-M',
        name: 'Biología',
        short_name: 'BIO',
        description: 'Biología celular y vegetal',
        grade_level: 'media',
        credits: 3,
        hours_per_week: 3,
        is_active: true,
        color_hex: '#059669'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Lengua, Humanidades y Arte'] || defaultCatId,
        code: 'ING-M',
        name: 'Inglés',
        short_name: 'ING',
        description: 'Inglés comunicativo y gramática',
        grade_level: 'media',
        credits: 3,
        hours_per_week: 3,
        is_active: true,
        color_hex: '#D97706'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Matemática y Lógica'] || defaultCatId,
        code: 'MAT-P',
        name: 'Matemática Primaria',
        short_name: 'MAT-P',
        description: 'Aritmética y nociones de geometría',
        grade_level: 'primaria',
        credits: 5,
        hours_per_week: 5,
        is_active: true,
        color_hex: '#4F46E5'
      },
      {
        institution_id: 1,
        category_id: categoryMap['Lengua, Humanidades y Arte'] || defaultCatId,
        code: 'LENG-P',
        name: 'Lenguaje y Comunicación',
        short_name: 'LENG-P',
        description: 'Lectura comprensiva y ortografía',
        grade_level: 'primaria',
        credits: 5,
        hours_per_week: 5,
        is_active: true,
        color_hex: '#0891B2'
      }
    ]

    const inserted = await db('school.subjects').insert(subjectsData).returning('*')
    console.log(`✅ ¡Éxito! Se sembraron ${inserted.length} materias de referencia en school.subjects.`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error sembrando materias:', err)
    process.exit(1)
  }
}

seed()
