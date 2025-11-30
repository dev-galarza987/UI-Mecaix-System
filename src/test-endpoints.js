// Prueba directa de endpoints de mecánicos
console.log('🔧 Probando endpoints de mecánicos...');

const baseUrl = 'https://3hlm3j3q-4000.brs.devtunnels.ms/api/v1';
const testCode = 'MECH001'; // Usar el código del primer mecánico

// Test 1: Ver mecánico individual
console.log('1. Probando GET mecánico individual...');
fetch(`${baseUrl}/mechanic/${testCode}`)
  .then(response => {
    console.log('GET /mechanic/{code} - Status:', response.status);
    return response.json();
  })
  .then(data => console.log('GET /mechanic/{code} - Data:', data))
  .catch(error => console.error('GET /mechanic/{code} - Error:', error));

// Test 2: Actualizar mecánico (PATCH)
console.log('2. Probando PATCH mecánico...');
const updateData = { firstName: 'TestUpdate' };

// Probar diferentes endpoints para actualizar
const updateEndpoints = [
  `${baseUrl}/mechanic/${testCode}`,
  `${baseUrl}/mechanic/${testCode}/update`,
  `${baseUrl}/mechanic/update/${testCode}`
];

updateEndpoints.forEach((endpoint, index) => {
  setTimeout(() => {
    console.log(`Probando PATCH endpoint ${index + 1}: ${endpoint}`);
    fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    .then(response => {
      console.log(`PATCH ${endpoint} - Status:`, response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    })
    .then(data => console.log(`PATCH ${endpoint} - Success:`, data))
    .catch(error => console.error(`PATCH ${endpoint} - Error:`, error));
  }, index * 1000);
});

// Test 3: Eliminar mecánico (DELETE)
console.log('3. Probando DELETE mecánico...');
const deleteEndpoints = [
  `${baseUrl}/mechanic/${testCode}`,
  `${baseUrl}/mechanic/${testCode}/delete`,
  `${baseUrl}/mechanic/delete/${testCode}`
];

deleteEndpoints.forEach((endpoint, index) => {
  setTimeout(() => {
    console.log(`Probando DELETE endpoint ${index + 1}: ${endpoint}`);
    fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log(`DELETE ${endpoint} - Status:`, response.status);
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    })
    .then(data => console.log(`DELETE ${endpoint} - Success:`, data))
    .catch(error => console.error(`DELETE ${endpoint} - Error:`, error));
  }, 3000 + (index * 1000));
});