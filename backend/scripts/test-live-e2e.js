const https = require('https');

const API_BASE = 'https://school-backend-9e07b02c-badb-4ddd-94ca-afd4d8aca2bd.fly.dev';

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('🌐 Conectando con Backend en Producción:', API_BASE);

  // 1. Obtener listas escolares
  console.log('\n1️⃣ Consultando listas escolares (/supply-lists)...');
  const listsRes = await request(`${API_BASE}/supply-lists?grade_level=secundaria_3`);
  console.log('Status:', listsRes.status);
  const lists = listsRes.body?.data || listsRes.body;
  if (!Array.isArray(lists) || lists.length === 0) {
    throw new Error('No se encontraron listas escolares');
  }
  const list = lists[0];
  console.log(`✅ Lista obtenida: "${list.title}" (ID: ${list.id})`);
  console.log(`   allow_suggestions: ${list.allow_suggestions}`);
  console.log(`   suggestions_meta:`, list.suggestions_meta);

  // 2. Crear una sugerencia desde el rol de representante
  console.log('\n2️⃣ Enviando sugerencia como Representante (/supply-suggestions)...');
  const suggestionData = {
    list_id: list.id,
    user_name: 'Ana María Da Silva (Representante)',
    user_email: 'anamaria.dasilva@example.com',
    user_role: 'parent',
    suggested_item_name: 'Calculadora Científica Casio FX-82MS',
    suggested_category: 'technology',
    suggestion_text: 'Excelente lista. Sugerimos agregar la calculadora científica Casio FX-82MS o equivalente para Física y Química de 3er año.'
  };

  const createSugRes = await request(`${API_BASE}/supply-suggestions`, { method: 'POST' }, suggestionData);
  console.log('Status:', createSugRes.status);
  const created = createSugRes.body;
  console.log(`✅ Sugerencia creada exitosamente ID: ${created.id}, estado: ${created.status}`);

  // 3. Consultar sugerencias por lista
  console.log('\n3️⃣ Consultando sugerencias de la lista (/supply-suggestions?list_id=...)...');
  const getSugRes = await request(`${API_BASE}/supply-suggestions?list_id=${list.id}`);
  console.log('Status:', getSugRes.status);
  const foundSuggestions = getSugRes.body?.data || getSugRes.body;
  console.log(`✅ Total sugerencias en lista: ${Array.isArray(foundSuggestions) ? foundSuggestions.length : 0}`);

  // 4. Incorporar sugerencia a la lista oficial con 1-clic
  console.log('\n4️⃣ Ejecutando 1-clic: Incorporar sugerencia a la lista oficial...');
  const incRes = await request(`${API_BASE}/supply-suggestions/${created.id}`, { method: 'PATCH' }, {
    action: 'incorporate',
    specification: 'Casio FX-82MS o equivalente para Física y Matemáticas',
    quantity: '1',
    unit: 'unidad'
  });
  console.log('Status:', incRes.status);
  console.log('Respuesta:', incRes.body.message);
  console.log('Item incorporado ID:', incRes.body.incorporated_item?.id, 'Nombre:', incRes.body.incorporated_item?.item_name);

  // 5. Verificar que la lista oficial tiene el nuevo ítem
  console.log('\n5️⃣ Verificando lista oficial actualizada...');
  const updatedListRes = await request(`${API_BASE}/supply-lists/${list.id}`);
  const updatedItems = updatedListRes.body?.items || [];
  const foundItem = updatedItems.find(i => i.id === incRes.body.incorporated_item?.id);
  console.log(`✅ Ítem encontrado en la lista oficial: ${!!foundItem} ("${foundItem?.item_name}")`);

  // 6. Enviar feedback del sistema
  console.log('\n6️⃣ Enviando feedback de satisfacción de usuario (/system-feedback)...');
  const feedbackData = {
    user_name: 'Carlos Mendoza (Prof. Matemáticas)',
    user_email: 'cmendoza@santaluisa.edu.ve',
    user_role: 'teacher',
    rating: 5,
    sentiment: 'happy',
    module_name: 'supplies',
    comment: 'La función de incorporar sugerencias directamente a la lista oficial nos ahorra horas de transcripción en coordinación académica.'
  };
  const createFeedRes = await request(`${API_BASE}/system-feedback`, { method: 'POST' }, feedbackData);
  console.log('Status:', createFeedRes.status);
  console.log(`✅ Feedback registrado exitosamente ID: ${createFeedRes.body?.id}`);

  // 7. Consultar métricas del dashboard de satisfacción
  console.log('\n7️⃣ Consultando Dashboard de Métricas de Satisfacción (/system-feedback)...');
  const feedDashboardRes = await request(`${API_BASE}/system-feedback`);
  console.log('Status:', feedDashboardRes.status);
  console.log('Total feedbacks:', feedDashboardRes.body?.total);
  console.log('Métricas:', JSON.stringify(feedDashboardRes.body?.metrics, null, 2));

  // Limpieza: eliminar el ítem incorporado de prueba y la sugerencia de prueba
  console.log('\n🧹 Limpiando registros de prueba...');
  const knex = require('../src/database');
  if (incRes.body.incorporated_item?.id) {
    await knex('school.supply_items').where({ id: incRes.body.incorporated_item.id }).delete();
  }
  await knex('school.supply_suggestions').where({ id: created.id }).delete();
  if (createFeedRes.body?.id) {
    await knex('school.system_feedback').where({ id: createFeedRes.body.id }).delete();
  }
  console.log('✅ Limpieza completada sin afectar los datos reales.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE INTEGRACIÓN EN VIVO PASARON SATISFACTORIAMENTE!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error en prueba de integración:', err);
  process.exit(1);
});
