const { productoServicio } = require('../services/productoServicio');

const productoControlador = {
  crear: async function (solicitud, respuesta) {
    try {
      const datos = solicitud.body;
      const resultado = await productoServicio.agregarProducto(datos);
      respuesta.status(201).json({
        estado: 'exitoso',
        mensaje: 'Producto publicado correctamente',
        datos: resultado
      });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  },

  obtenerPorExpositor: async function (solicitud, respuesta) {
    try {
      const { id_expositor } = solicitud.params;
      const lista = await productoServicio.obtenerProductosPorExpositor(id_expositor);
      respuesta.status(200).json({ estado: 'exitoso', datos: lista });
    } catch (error) {
      respuesta.status(500).json({ estado: 'error', mensaje: error.message });
    }
  },

  obtenerTodosPublicos: async function (solicitud, respuesta) {
    try {
      const lista = await productoServicio.obtenerProductosPublicos();
      respuesta.status(200).json({ estado: 'exitoso', datos: lista });
    } catch (error) {
      respuesta.status(500).json({ estado: 'error', mensaje: error.message });
    }
  },

  eliminar: async function (solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      await productoServicio.eliminarProducto(id);
      respuesta.status(200).json({ estado: 'exitoso', mensaje: 'Producto eliminado' });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  }
};

module.exports = productoControlador;