const { expositorServicio } = require('../services/expositorServicio');

const expositorControlador = {
  registrar: async function(solicitud, respuesta) {
    try {
      const datos = solicitud.body;
      const resultado = await expositorServicio.procesarInscripcion(datos);
      respuesta.status(201).json({
        estado: 'exitoso',
        mensaje: '¡Te has registrado correctamente!',
        datos: resultado
      });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  },

  // [ADMIN] Listar todos
  obtenerTodos: async function(solicitud, respuesta) {
  try {
    const lista = await expositorServicio.listarExpositores();
    respuesta.status(200).json({ estado: 'exitoso', datos: lista });
  } catch (error) {
    respuesta.status(500).json({ estado: 'error', mensaje: error.message });
  }
},

  // [ADMIN] Cambiar estado (Avalar / Rechazar)
  cambiarEstado: async function(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      const { estado, categoria } = solicitud.body; // 'aprobado' o 'rechazado'
      
      const resultado = await expositorServicio.cambiarEstadoExpositor(id, estado, categoria);
      respuesta.status(200).json({
        estado: 'exitoso',
        mensaje: `El expositor ha sido ${estado} correctamente.`,
        datos: resultado
      });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  },

  // [ADMIN] Editar expositor
  actualizar: async function(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      const datos = solicitud.body;
      const resultado = await expositorServicio.editarExpositor(id, datos);
      respuesta.status(200).json({
        estado: 'exitoso',
        mensaje: 'Expositor actualizado correctamente.',
        datos: resultado
      });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  },

  // [ADMIN] Eliminar expositor
  eliminar: async function(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      await expositorServicio.eliminarExpositor(id);
      respuesta.status(200).json({
        estado: 'exitoso',
        mensaje: 'Expositor eliminado correctamente.'
      });
    } catch (error) {
      respuesta.status(400).json({ estado: 'error', mensaje: error.message });
    }
  }
  
};



module.exports = expositorControlador;