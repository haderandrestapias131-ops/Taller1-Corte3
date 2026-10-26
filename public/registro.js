/* eslint-env browser */

document.addEventListener('DOMContentLoaded', () => {
  const selectRol = document.getElementById('reg-rol');
  const camposExpositor = document.querySelectorAll('.campo-expositor');

  // Mostrar u ocultar campos según la opción elegida
  selectRol.addEventListener('change', () => {
    const esExpositor = selectRol.value === 'expositor';
    camposExpositor.forEach(campo => {
      campo.style.display = esExpositor ? 'block' : 'none';
    });
  });

  // Enviar el formulario
  document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const rol = selectRol.value;
    const datos = {
      rol: rol,
      nombre: document.getElementById('reg-nombre').value,
      correo: document.getElementById('reg-correo').value,
      password: document.getElementById('reg-password').value
    };

    // Agregar campos del emprendimiento solo si es Expositor
    if (rol === 'expositor') {
      datos.nombre_emprendimiento = document.getElementById('reg-emprendimiento').value;
      datos.categoria = document.getElementById('reg-categoria').value;

      if (!datos.nombre_emprendimiento) {
        alert('Por favor ingresa el nombre de tu emprendimiento.');
        return;
      }
    }

    try {
      const respuesta = await fetch('/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok && resultado.estado === 'exitoso') {
        alert('¡Registro completado con éxito! Ahora puedes iniciar sesión.');
        window.location.href = '/login.html';
      } else {
        alert(resultado.mensaje || 'Ocurrió un error durante el registro.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  });
});