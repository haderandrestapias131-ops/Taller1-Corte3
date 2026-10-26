const repositorio = require('../repositories/productoRepositorio');

const productoServicio = {
  agregarProducto: async function (datos) {
    if (!datos.nombre || !datos.precio) {
      throw new Error('El nombre y el precio del producto son obligatorios.');
    }
    if (datos.precio <= 0) {
      throw new Error('El precio debe ser mayor a 0.');
    }
    return await repositorio.guardar(datos);
  },

  obtenerProductosPorExpositor: async function (id_expositor) {
    return await repositorio.obtenerPorExpositor(id_expositor);
  },

  obtenerProductosPublicos: async function () {
    return await repositorio.obtenerTodosConExpositor();
  },

  eliminarProducto: async function (id) {
    return await repositorio.eliminar(id);
  }
};

module.exports = {
  productoServicio: productoServicio
};