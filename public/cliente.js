/* eslint-env browser */

document.addEventListener('DOMContentLoaded', cargarProductosPublicos);

async function cargarProductosPublicos() {
  const container = document.getElementById('grid-productos');

  try {
    const respuesta = await fetch('/productos/publicos');
    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.estado !== 'exitoso') {
      throw new Error(resultado.mensaje || 'Error al cargar catálogo');
    }

    container.innerHTML = '';
    const productos = resultado.datos;

    if (productos.length === 0) {
      container.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
      return;
    }

    productos.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card-prod';

      const nombreEmprendimiento = prod.expositores ? prod.expositores.nombre_emprendimiento : 'Emprendimiento';
      const categoria = prod.expositores ? prod.expositores.categoria : 'General';

      card.innerHTML = `
        <img src="${prod.imagen_url || 'https://via.placeholder.com/300x180?text=Sin+Imagen'}" alt="${prod.nombre}">
        <div class="card-body">
          <span class="emprendimiento-tag" style="color:#c9b28a;">${categoria} | ${nombreEmprendimiento}</span>
          <h3 style="font-size:1.1rem; margin-bottom:5px;">${prod.nombre}</h3>
          <p style="color:#e8e2d8; font-size:0.9rem; flex-grow:1; margin-bottom:10px;">${prod.descripcion || 'Sin descripción'}</p>
          <span style="font-size:1.2rem; font-weight:bold; color:#16a34a;">$${parseFloat(prod.precio).toFixed(2)}</span>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}