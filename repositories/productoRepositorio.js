const { cliente_supabase } = require('../config/supabase');

const productoRepositorio = {
  guardar: async function (datos) {
    const { data, error } = await cliente_supabase
      .from('productos')
      .insert([datos])
      .select();

    if (error) throw new Error('No se pudo guardar el producto: ' + error.message);
    return data;
  },

  obtenerPorExpositor: async function (id_expositor) {
    const { data, error } = await cliente_supabase
      .from('productos')
      .select('*')
      .eq('id_expositor', id_expositor)
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error('Error al consultar los productos');
    return data;
  },

  // Para la vista pública del cliente
  obtenerTodosConExpositor: async function () {
    const { data, error } = await cliente_supabase
      .from('productos')
      .select('*, expositores(nombre_emprendimiento, categoria, estado)')
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error('Error al obtener los productos públicos');
    
    // Filtrar para mostrar solo los de expositores cuya solicitud fue APROBADA
    return data.filter(p => p.expositores && p.expositores.estado === 'aprobado');
  },

  eliminar: async function (id) {
    const { error } = await cliente_supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error al eliminar el producto');
    return true;
  }
};

module.exports = productoRepositorio;