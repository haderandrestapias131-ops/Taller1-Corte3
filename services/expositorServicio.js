const repositorio = require('../repositories/expositorRepositorio');

const expositorServicio = {
  procesarInscripcion: async function(datos_formulario) {
    if (!datos_formulario.nombre_emprendimiento) {
      throw new Error('Debes asignar un nombre a tu emprendimiento.');
    }
    return await repositorio.guardar(datos_formulario);
  },

  // [ADMIN] Obtener todos los registros
  listarExpositores: async function() {
    return await repositorio.obtenerTodos();
  },

  // [ADMIN] Avalar o Cambiar Estado (Validando cupos si se va a aprobar)
  cambiarEstadoExpositor: async function(id, nuevoEstado, categoria) {
    if (nuevoEstado === 'aprobado') {
      const cuposOcupados = await repositorio.obtenerConteoPorCategoria(categoria);
      if (cuposOcupados >= 5) {
        throw new Error(`La categoría '${categoria}' ya alcanzó el límite máximo de 5 cupos.`);
      }
    }
    return await repositorio.actualizarEstado(id, nuevoEstado);
  },

  // [ADMIN] Editar Expositor
  editarExpositor: async function(id, datos) {
    return await repositorio.actualizar(id, datos);
  },

  // [ADMIN] Eliminar Expositor
  eliminarExpositor: async function(id) {
    return await repositorio.eliminar(id);
  }
};

module.exports = {
  expositorServicio: expositorServicio
};