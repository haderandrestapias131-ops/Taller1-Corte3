const { cliente_supabase } = require('../config/supabase');

const expositorRepositorio = {
  // Guardar un nuevo expositor
  guardar: async function (datos) {
    const { data, error } = await cliente_supabase
      .from('expositores')
      .insert([datos])
      .select();

    if (error) throw new Error('No se pudo guardar en la base de datos: ' + error.message);
    return data;
  },

  // Contar cuántos inscritos hay en una categoría específica
  obtenerConteoPorCategoria: async function (nombre_categoria) {
    const { count, error } = await cliente_supabase
      .from('expositores')
      .select('*', { count: 'exact', head: true })
      .eq('categoria', nombre_categoria)
      .eq('estado', 'aprobado'); // Solo contamos los ya aprobados/avalados

    if (error) throw new Error('Error al consultar el conteo');
    return count;
  },

  // [ADMIN] Obtener todos los expositores (pendientes, aprobados, rechazados)
  obtenerTodos: async function () {
    const { data, error } = await cliente_supabase
      .from('expositores')
      .select('*')
      .order('fecha_registro', { ascending: false });

    if (error) throw new Error('Error al obtener la lista de expositores');
    return data;
  },

  // [ADMIN] Actualizar estado (ej: 'aprobado' o 'rechazado')
  actualizarEstado: async function (id, nuevoEstado) {
    const { data, error } = await cliente_supabase
      .from('expositores')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .select();

    if (error) throw new Error('Error al actualizar el estado del expositor');
    return data;
  },

  // [ADMIN] Actualizar datos generales de un expositor
  actualizar: async function (id, datos) {
    const { data, error } = await cliente_supabase
      .from('expositores')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw new Error('Error al actualizar el expositor');
    return data;
  },

  // [ADMIN] Eliminar un expositor
  eliminar: async function (id) {
    const { error } = await cliente_supabase
      .from('expositores')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error al eliminar el expositor');
    return true;
  }
};

module.exports = expositorRepositorio;