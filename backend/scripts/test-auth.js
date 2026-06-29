const assert = require('assert');

const API_URL = 'http://localhost:3030';

async function runTests() {
  console.log('🧪 Iniciando pruebas de integración de autenticación y roles...');

  // 1. Probar acceso a /users sin autenticar
  try {
    const res = await fetch(`${API_URL}/users`);
    assert.strictEqual(res.status, 401, 'El acceso sin token debe retornar 401');
    console.log('✅ Prueba 1: Acceso no autenticado bloqueado correctamente (401).');
  } catch (err) {
    console.error('❌ Falló Prueba 1:', err.message);
    process.exit(1);
  }

  // 2. Iniciar sesión como Admin
  let adminToken;
  try {
    const res = await fetch(`${API_URL}/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strategy: 'local',
        email: 'admin@colegiosanmartin.edu',
        password: 'password123'
      })
    });
    assert.strictEqual(res.status, 201, 'Login de administrador falló');
    const data = await res.json();
    adminToken = data.accessToken;
    assert.ok(adminToken, 'No se recibió el token de acceso');
    console.log('✅ Prueba 2: Autenticación de Admin exitosa.');
  } catch (err) {
    console.error('❌ Falló Prueba 2:', err.message);
    process.exit(1);
  }

  // 3. Consultar /users como Admin (debe tener éxito y no mostrar password_hash)
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200, 'El administrador debería poder consultar /users');
    const data = await res.json();
    const users = data.data || data;
    assert.ok(users.length > 0, 'No se devolvieron usuarios');
    assert.strictEqual(users[0].password_hash, undefined, 'password_hash no debe estar expuesto');
    console.log('✅ Prueba 3: Consulta de /users por Admin autorizada y password_hash protegido.');
  } catch (err) {
    console.error('❌ Falló Prueba 3:', err.message);
    process.exit(1);
  }

  // 4. Iniciar sesión como Profesor
  let teacherToken;
  try {
    const res = await fetch(`${API_URL}/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strategy: 'local',
        email: 'roberto@colegiosanmartin.edu',
        password: 'password123'
      })
    });
    assert.strictEqual(res.status, 201, 'Login de profesor falló');
    const data = await res.json();
    teacherToken = data.accessToken;
    console.log('✅ Prueba 4: Autenticación de Profesor exitosa.');
  } catch (err) {
    console.error('❌ Falló Prueba 4:', err.message);
    process.exit(1);
  }

  // 5. Intentar consultar /users como Profesor (debe retornar 403)
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    assert.strictEqual(res.status, 403, 'Un profesor no debe tener acceso a /users (403)');
    console.log('✅ Prueba 5: Acceso de profesor a /users bloqueado correctamente (403).');
  } catch (err) {
    console.error('❌ Falló Prueba 5:', err.message);
    process.exit(1);
  }

  // 6. Consultar /students como Profesor (debe tener éxito)
  try {
    const res = await fetch(`${API_URL}/students`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    assert.strictEqual(res.status, 200, 'Un profesor debe poder consultar /students');
    console.log('✅ Prueba 6: Consulta de /students por Profesor autorizada.');
  } catch (err) {
    console.error('❌ Falló Prueba 6:', err.message);
    process.exit(1);
  }

  console.log('\n✨ ¡Todas las pruebas de autenticación y roles pasaron exitosamente!');
}

runTests();
