/* eslint-env browser */

function mostrarAlerta(mensaje, esError = false) {
  const alerta = document.getElementById('alerta');
  if (!alerta) return;
  alerta.className = `alert ${esError ? 'alert-error' : 'alert-success'}`;
  alerta.innerText = mensaje;
  alerta.style.display = 'block';
  setTimeout(() => { alerta.style.display = 'none'; }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    if (usuario.rol === 'expositor' && usuario.id_expositor) {
      const inputID = document.getElementById('input-id-expositor');
      if (inputID) {
        inputID.value = usuario.id_expositor;
        cargarCatalogoExpositor();
      }
    }
  }
});

async function cargarCatalogoExpositor() {
  const idExpositor = document.getElementById('input-id-expositor').value;
  if (!idExpositor) {
    mostrarAlerta('Por favor ingresa un ID de expositor válido', true);
    return;
  }

  try {
    const respuesta = await fetch(`/productos/expositor/${idExpositor}`);
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || 'Error al obtener productos');
    }

    document.getElementById('panel-productos').style.display = 'block';
    const tabla = document.getElementById('tabla-productos');
    tabla.innerHTML = '';

    const productos = resultado.datos || resultado;

    if (!Array.isArray(productos) || productos.length === 0) {
      tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">No has publicado productos todavía.</td></tr>';
      return;
    }

    productos.forEach(prod => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${prod.id}</td>
        <td><img src="${prod.imagen_url || 'https://via.placeholder.com/50'}" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>
        <td><strong>${prod.nombre}</strong></td>
        <td>${prod.descripcion || 'Sin descripción'}</td>
        <td>$${parseFloat(prod.precio).toFixed(2)}</td>
        <td>
          <button class="btn btn-eliminar" onclick="eliminarProducto(${prod.id})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });

  } catch (error) {
    mostrarAlerta('Error al obtener productos: ' + error.message, true);
  }
}

const formProducto = document.getElementById('form-producto');
if (formProducto) {
  formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idExpositor = document.getElementById('input-id-expositor').value;

    const datos = {
      id_expositor: parseInt(idExpositor),
      nombre: document.getElementById('prod-nombre').value,
      precio: parseFloat(document.getElementById('prod-precio').value),
      imagen_url: document.getElementById('prod-imagen').value,
      descripcion: document.getElementById('prod-descripcion').value
    };

    try {
      const respuesta = await fetch('/productos/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        mostrarAlerta('¡Producto publicado con éxito!');
        formProducto.reset();
        cargarCatalogoExpositor();
      } else {
        throw new Error(resultado.mensaje || 'No se pudo guardar el producto');
      }
    } catch (error) {
      mostrarAlerta(error.message, true);
    }
  });
}

async function eliminarProducto(id) {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

  try {
    const respuesta = await fetch(`/productos/eliminar/${id}`, { method: 'DELETE' });
    const resultado = await respuesta.json();

    if (respuesta.ok) {
      mostrarAlerta('Producto eliminado');
      cargarCatalogoExpositor();
    } else {
      throw new Error(resultado.mensaje || 'Error al eliminar');
    }
  } catch (error) {
    mostrarAlerta(error.message, true);
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = '/login.html';
}