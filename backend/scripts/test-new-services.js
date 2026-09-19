const app = require('../src/app');
const db = require('../src/database');

app.set('knexClient', db);

require('../src/services/supply-lists')(app);
require('../src/services/supply-suggestions')(app);
require('../src/services/system-feedback')(app);

async function testServices() {
  try {
    console.log('🧪 Probando servicio supply-lists con allow_suggestions...');
    const lists = await app.service('supply-lists').find({ query: { grade_level: 'secundaria_3' } });
    console.log('✅ Listas encontradas:', lists.length);
    if (lists.length > 0) {
      console.log('Lista 3er Año allow_suggestions:', lists[0].allow_suggestions, 'suggestions_meta:', lists[0].suggestions_meta);
      const listId = lists[0].id;

      console.log('🧪 Probando crear sugerencia en supply-suggestions...');
      const createdSuggestion = await app.service('supply-suggestions').create({
        list_id: listId,
        user_name: 'Juan Pérez (Representante de Prueba)',
        user_email: 'juan.perez@example.com',
        user_role: 'parent',
        suggested_item_name: 'Juego de Escuadras y Transportador Metálico',
        suggested_category: 'stationery',
        suggestion_text: 'Sugerimos permitir escuadras plásticas o metálicas dado que en librerías del este de Caracas se consiguen más fácilmente.'
      });
      console.log('✅ Sugerencia creada exitosamente con ID:', createdSuggestion.id);

      console.log('🧪 Probando acción de incorporar a la lista oficial con 1 clic...');
      const incorporateRes = await app.service('supply-suggestions').patch(createdSuggestion.id, {
        action: 'incorporate',
        specification: 'Permitido plástico o metálico sin bordes afilados',
        quantity: '1',
        unit: 'juego'
      });
      console.log('✅ Incorporación exitosa:', incorporateRes.message);
      console.log('Artículo incorporado ID:', incorporateRes.incorporated_item?.id, 'Nombre:', incorporateRes.incorporated_item?.item_name);

      // Limpiar ítem de prueba para no ensuciar la lista oficial
      if (incorporateRes.incorporated_item?.id) {
        await db('school.supply_items').where({ id: incorporateRes.incorporated_item.id }).delete();
        console.log('🧹 Ítem de prueba limpiado de supply_items');
      }
      // Limpiar sugerencia de prueba
      await db('school.supply_suggestions').where({ id: createdSuggestion.id }).delete();
      console.log('🧹 Sugerencia de prueba limpiada de supply_suggestions');
    }

    console.log('🧪 Probando servicio system-feedback...');
    const feedbackData = await app.service('system-feedback').find({});
    console.log('✅ Feedbacks encontrados:', feedbackData.total);
    console.log('📊 Métricas agregadas:', feedbackData.metrics);

    console.log('🎉 Todos los servicios backend funcionan al 100%!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error probando servicios:', err);
    process.exit(1);
  }
}

testServices();
