const { cliente_supabase } = require('../config/supabase');

const authControlador = {
  /**
   * Inicia sesión para cualquier rol (Administrador, Expositor o Cliente)
   */
  iniciarSesion: async function (solicitud, respuesta) {
    try {
      const { correo, password } = solicitud.body;

      if (!correo || !password) {
        return respuesta.status(400).json({
          estado: 'error',
          mensaje: 'El correo y la contraseña son obligatorios.'
        });
      }

      // 1. Autenticar credenciales en Supabase Auth
      const { data: authData, error: authError } = await cliente_supabase.auth.signInWithPassword({
        email: correo,
        password: password
      });

      if (authError) {
        return respuesta.status(401).json({
          estado: 'error',
          mensaje: 'Credenciales inválidas: ' + authError.message
        });
      }

      const id_usuario = authData.user.id;

      // 2. Consultar el rol y datos asociados en la tabla 'perfiles'
      const { data: perfil, error: perfilError } = await cliente_supabase
        .from('perfiles')
        .select('*')
        .eq('id_usuario', id_usuario)
        .single();

      if (perfilError || !perfil) {
        return respuesta.status(404).json({
          estado: 'error',
          mensaje: 'No se encontró un perfil asociado a esta cuenta.'
        });
      }

      // 3. Responder con la información del usuario y su rol
      respuesta.status(200).json({
        estado: 'exitoso',
        mensaje: 'Inicio de sesión correcto',
        usuario: {
          id_usuario: perfil.id_usuario,
          nombre: perfil.nombre,
          rol: perfil.rol,
          id_expositor: perfil.id_expositor
        }
      });

    } catch (error) {
      respuesta.status(500).json({
        estado: 'error',
        mensaje: 'Error interno del servidor: ' + error.message
      });
    }
  },

  /**
   * Registra un nuevo usuario permitiendo elegir su rol ('cliente' o 'expositor')
   */
  registrarUsuario: async function (solicitud, respuesta) {
    try {
      const { rol, nombre, correo, password, nombre_emprendimiento, categoria } = solicitud.body;

      if (!correo || !password || !nombre || !rol) {
        return respuesta.status(400).json({
          estado: 'error',
          mensaje: 'Todos los campos básicos son obligatorios.'
        });
      }

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await cliente_supabase.auth.signUp({
        email: correo,
        password: password
      });

      if (authError) {
        return respuesta.status(400).json({
          estado: 'error',
          mensaje: 'Error al registrar usuario: ' + authError.message
        });
      }

      const id_usuario = authData.user.id;
      let id_expositor = null;

      // 2. Si eligió 'expositor', crear la entrada con estado 'pendiente'
      if (rol === 'expositor') {
        const { data: expositorData, error: expositorError } = await cliente_supabase
          .from('expositores')
          .insert([{
            nombre,
            correo,
            nombre_emprendimiento: nombre_emprendimiento || 'Emprendimiento de ' + nombre,
            categoria: categoria || 'General',
            estado: 'pendiente' // <--- Requiere aval del Administrador
          }])
          .select()
          .single();

        if (expositorError) {
          return respuesta.status(400).json({
            estado: 'error',
            mensaje: 'Error al registrar el emprendimiento: ' + expositorError.message
          });
        }

        id_expositor = expositorData.id;
      }

      // 3. Crear el perfil asociando el usuario
      const { error: perfilError } = await cliente_supabase
        .from('perfiles')
        .insert([{
          id_usuario: id_usuario,
          nombre: nombre,
          rol: rol,
          id_expositor: id_expositor
        }]);

      if (perfilError) {
        return respuesta.status(400).json({
          estado: 'error',
          mensaje: 'Error al crear el perfil: ' + perfilError.message
        });
      }

      respuesta.status(201).json({
        estado: 'exitoso',
        mensaje: 'Registro completado correctamente.'
      });

    } catch (error) {
      respuesta.status(500).json({
        estado: 'error',
        mensaje: 'Error interno del servidor: ' + error.message
      });
    }
  }
};

module.exports = authControlador;