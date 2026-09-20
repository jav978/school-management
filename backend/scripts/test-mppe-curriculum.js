/**
 * test-mppe-curriculum.js
 * Verificación automatizada de API del Pensum Oficial MPPE para Educación Media General (1er a 5to Año)
 */

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const knex = require('knex');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function runTests() {
  console.log('🧪 Iniciando pruebas de verificación del Pensum Oficial MPPE...\n');

  const app = express(feathers());
  const db = knex({ client: 'pg', connection: process.env.DATABASE_URL });
  app.set('knexClient', db);

  require('../src/services/subjects')(app);
  require('../src/services/schedules')(app);

  const subjectsService = app.service('subjects');
  const schedulesService = app.service('schedules');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Catálogo General de Materias
    const all = await subjectsService.find({ provider: undefined });
    assert(all.total >= 58, `Total materias activas registradas: ${all.total} (Esperado: >= 58)`);

    // 2. Materias por año escolar según MPPE
    const y1 = await subjectsService.find({ provider: undefined, query: { grade_level: '1er Año' } });
    assert(y1.total === 10, `1er Año tiene exactamente 10 materias oficiales (Obtenido: ${y1.total})`);

    const y2 = await subjectsService.find({ provider: undefined, query: { grade_level: '2do Año' } });
    assert(y2.total === 10, `2do Año tiene exactamente 10 materias oficiales (Obtenido: ${y2.total})`);

    const y3 = await subjectsService.find({ provider: undefined, query: { grade_level: '3er Año' } });
    assert(y3.total === 11, `3er Año tiene exactamente 11 materias oficiales (Obtenido: ${y3.total})`);
    const hasFis3 = y3.data.some(s => s.code === 'FIS-3');
    const hasQui3 = y3.data.some(s => s.code === 'QUI-3');
    const hasBio3 = y3.data.some(s => s.code === 'BIO-3');
    assert(hasFis3 && hasQui3 && hasBio3, '3er Año incluye Física, Química y Biología');

    const y4 = await subjectsService.find({ provider: undefined, query: { grade_level: '4to Año' } });
    assert(y4.total === 12, `4to Año tiene exactamente 12 materias oficiales (Obtenido: ${y4.total})`);
    const hasFsn4 = y4.data.some(s => s.code === 'FSN-4');
    assert(hasFsn4, '4to Año incluye Formación para la Soberanía Nacional (FSN-4)');

    const y5 = await subjectsService.find({ provider: undefined, query: { grade_level: '5to Año' } });
    assert(y5.total === 13, `5to Año tiene exactamente 13 materias oficiales (Obtenido: ${y5.total})`);
    const hasCt5 = y5.data.some(s => s.code === 'CT-5');
    const hasFsn5 = y5.data.some(s => s.code === 'FSN-5');
    const hasProj5 = y5.data.some(s => s.code === 'EDFE-5');
    assert(hasCt5 && hasFsn5 && hasProj5, '5to Año incluye Ciencias de la Tierra, FSN y Metodología de Proyecto');

    // 3. Materias Electivas / Opcionales
    const electives = await subjectsService.find({ provider: undefined, query: { is_elective: true } });
    assert(electives.total >= 2, `Cátedras opcionales encontradas: ${electives.total} (Esperado: >= 2)`);

    // 4. Horarios por Año de Media General
    const schedY1 = await schedulesService.find({ provider: undefined, query: { grade: '1er Año' } });
    assert(schedY1.total === 35, `Horario 1er Año: 35 bloques semanales (7 bloques x 5 días) (Obtenido: ${schedY1.total})`);

    const schedY3 = await schedulesService.find({ provider: undefined, query: { grade: '3er Año' } });
    assert(schedY3.total === 35, `Horario 3er Año: 35 bloques semanales (7 bloques x 5 días) (Obtenido: ${schedY3.total})`);

    const schedY5 = await schedulesService.find({ provider: undefined, query: { grade: '5to Año', section: 'A' } });
    assert(schedY5.total === 35, `Horario 5to Año Sección A: 35 bloques semanales (Obtenido: ${schedY5.total})`);

    // 5. Test CRUD de Asignatura Opcional Nueva
    const testCode = 'TEST-ELEC';
    const createdElec = await subjectsService.create({
      code: testCode,
      name: 'Ajedrez y Estrategia Escolar',
      grade_level: '1er Año',
      is_elective: true,
      credits: 2,
      hours_per_week: 2,
      category_name: 'Formación Integral y Valores',
      description: 'Materia electiva demostrativa'
    }, { provider: undefined });

    assert(createdElec.id && createdElec.is_elective === true, 'Creación de Cátedra Opcional con is_elective = true exitosa');

    // Limpieza
    await db('school.subjects').where({ id: createdElec.id }).del();
    assert(true, 'Limpieza de materia de prueba exitosa');

    console.log(`\n📊 RESULTADO: ${passed}/${total} pruebas pasaron satisfactoriamente (${Math.round(passed/total*100)}%).`);

  } catch (err) {
    console.error('Error durante ejecución de pruebas:', err);
  } finally {
    await db.destroy();
  }
}

runTests().catch(console.error);
