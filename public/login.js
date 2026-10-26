/* eslint-env browser */

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    correo: document.getElementById('login-correo').value,
    password: document.getElementById('login-password').value
  };

  try {
    const respuesta = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok && resultado.estado === 'exitoso') {
      // 1. Guardar la información del usuario en el navegador
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

      // 2. Redirigir según el rol
      if (resultado.usuario.rol === 'administrador') {
        window.location.href = '/admin.html';
      } else if (resultado.usuario.rol === 'expositor') {
        window.location.href = '/expositor.html'; // <--- Redirección a la interfaz de expositor
      } else {
        window.location.href = '/cliente.html';
      }
    } else {
      alert(resultado.mensaje || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    alert('No se pudo conectar con el servidor.');
  }
});