const db = require('../src/database');

async function updateStudentData() {
  console.log('🔄 Iniciando actualización de estudiante y carnet...');

  try {
    // 1. Asegurar grado "5to Año" y clase "5to Año Sección A" en school.grades y school.classes
    let grade5 = await db('school.grades')
      .whereILike('name', '%5to%')
      .first();

    if (!grade5) {
      console.log('Creando grado "5to Año" en school.grades...');
      const [insertedGrade] = await db('school.grades').insert({
        institution_id: 1,
        name: '5to Año',
        order_num: 5,
        description: '5to Año de Educación Media General (Bachillerato)',
        is_active: true,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }).returning('*');
      grade5 = insertedGrade;
    }
    console.log(`✅ Grado 5to Año listo (ID: ${grade5.id})`);

    let class5 = await db('school.classes')
      .where({ grade_id: grade5.id, section: 'A' })
      .first();

    if (!class5) {
      console.log('Creando clase "5to Año Sección A" en school.classes...');
      const [insertedClass] = await db('school.classes').insert({
        institution_id: 1,
        academic_year_id: 1,
        grade_id: grade5.id,
        name: '5to Año Sección A',
        section: 'A',
        is_active: true,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }).returning('*');
      class5 = insertedClass;
    }
    console.log(`✅ Clase 5to Año Sección A lista (ID: ${class5.id})`);

    // 2. Actualizar Estudiante ID 20: María Alejandra -> José Alejandro Vásquez Madrid (5to Año de Bachillerato)
    const student20Before = await db('school.students').where({ id: 20 }).first();
    if (!student20Before) {
      throw new Error('Estudiante ID 20 no encontrado en school.students');
    }
    console.log('Datos previos estudiante 20:', {
      id: student20Before.id,
      nombre_previo: `${student20Before.first_name} ${student20Before.last_name}`,
      student_id: student20Before.student_id
    });

    await db('school.students').where({ id: 20 }).update({
      first_name: 'José Alejandro',
      last_name: 'Vásquez Madrid',
      gender: 'male',
      current_grade_id: grade5.id,
      current_class_id: class5.id,
      notes: '5to año - Sección A | 5to año de bachillerato',
      emergency_contact_name: 'Priscilla Alejandra Madrid Tovar',
      emergency_contact_phone: '04269217118',
      emergency_contact_rel: 'Madre',
      updated_at: db.fn.now()
    });

    const student20After = await db('school.students').where({ id: 20 }).first();
    console.log('✅ Estudiante 20 actualizado con éxito:', {
      id: student20After.id,
      nombre_actual: `${student20After.first_name} ${student20After.last_name}`,
      genero: student20After.gender,
      codigo: student20After.student_id,
      notas: student20After.notes,
      grade_id: student20After.current_grade_id,
      class_id: student20After.current_class_id
    });

    // 3. Corregir y completar Estudiante ID 18 (Santiago José Vásquez Madrid)
    const student18Before = await db('school.students').where({ id: 18 }).first();
    if (student18Before) {
      await db('school.students').where({ id: 18 }).update({
        first_name: 'Santiago José',
        last_name: 'Vásquez Madrid',
        gender: 'male',
        emergency_contact_name: 'Priscilla Alejandra Madrid Tovar',
        emergency_contact_phone: '04269217118',
        emergency_contact_rel: 'Madre',
        updated_at: db.fn.now()
      });
      console.log('✅ Estudiante 18 actualizado con éxito: Santiago José Vásquez Madrid');
    }

    // 4. Actualizar Carnet Escolar en school.id_cards para José Alejandro (EST-2026-8891)
    const card20 = await db('school.id_cards')
      .where({ recipient_id_card: student20Before.student_id })
      .first();

    if (card20) {
      await db('school.id_cards').where({ id: card20.id }).update({
        recipient_name: 'José Alejandro Vásquez Madrid',
        position: '5to Año Sección A',
        department: 'Educación Media General',
        blood_type: 'O+',
        emergency_contact: 'Priscilla Alejandra Madrid Tovar',
        emergency_phone: '04269217118',
        address: 'Av. América, Las Acacias, Caracas',
        updated_at: db.fn.now()
      });
      console.log(`✅ Carnet Escolar ID ${card20.id} actualizado para José Alejandro Vásquez Madrid (5to Año Sección A)`);
    } else {
      console.log('ℹ️ No existía carnet previo para EST-2026-8891, emitiendo carnet nuevo...');
      await db('school.id_cards').insert({
        card_code: `CRD-EST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        recipient_name: 'José Alejandro Vásquez Madrid',
        recipient_id_card: student20After.student_id,
        recipient_type: 'estudiante',
        position: '5to Año Sección A',
        department: 'Educación Media General',
        blood_type: 'O+',
        emergency_contact: 'Priscilla Alejandra Madrid Tovar',
        emergency_phone: '04269217118',
        address: 'Av. América, Las Acacias, Caracas',
        issue_date: '2026-09-19',
        valid_until: '2027-07-31',
        status: 'activo',
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      });
      console.log('✅ Carnet Escolar nuevo emitido para José Alejandro Vásquez Madrid');
    }

    // 5. Actualizar Carnet Escolar en school.id_cards para Santiago José (EST-2026-4571)
    if (student18Before) {
      const card18 = await db('school.id_cards')
        .where({ recipient_id_card: student18Before.student_id })
        .first();

      if (card18) {
        await db('school.id_cards').where({ id: card18.id }).update({
          recipient_name: 'Santiago José Vásquez Madrid',
          emergency_contact: 'Priscilla Alejandra Madrid Tovar',
          emergency_phone: '04269217118',
          updated_at: db.fn.now()
        });
        console.log(`✅ Carnet Escolar ID ${card18.id} actualizado para Santiago José Vásquez Madrid`);
      }
    }

    // 6. Verificar vinculación de hijos en el perfil de la representante Priscilla Alejandra Madrid Tovar (ID 8)
    const parent8 = await db('school.parents').where({ id: 8 }).first();
    const children = await db('school.student_parents as sp')
      .join('school.students as s', 'sp.student_id', 's.id')
      .where({ 'sp.parent_id': 8, 'sp.is_deleted': false })
      .select('s.id', 's.student_id', 's.first_name', 's.last_name', 's.notes');

    console.log('\n👨‍👩‍👧 Resumen Representante:', `${parent8.first_name} ${parent8.last_name} (${parent8.national_id})`);
    console.log('Hijos vinculados verificados en PostgreSQL:');
    children.forEach((c, idx) => {
      console.log(`  ${idx + 1}. ${c.first_name} ${c.last_name} (${c.student_id}) - ${c.notes}`);
    });

    console.log('\n🎉 ¡TODOS LOS DATOS FUERON ACTUALIZADOS EXITOSAMENTE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error actualizando datos:', err);
    process.exit(1);
  }
}

updateStudentData();
