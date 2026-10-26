const { cliente_supabase } = require('../config/supabase');

const perfilRepositorio = {
  // Obtener perfil por ID de usuario Supabase
  obtenerPorIdUsuario: async function (id_usuario) {
    const { data, error } = await cliente_supabase
      .from('perfiles')
      .select('*')
      .eq('id_usuario', id_usuario)
      .single();

    if (error) throw new Error('Error al obtener perfil: ' + error.message);
    return data;
  },

  // Obtener perfil asociándolo con el correo de la tabla expositores o por nombre/rol
  obtenerPerfilPorRolYExpositor: async function (id_expositor) {
    const { data, error } = await cliente_supabase
      .from('perfiles')
      .select('*')
      .eq('id_expositor', id_expositor)
      .single();

    if (error) return null;
    return data;
  }
};

module.exports = perfilRepositorio;