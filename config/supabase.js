// Se importa la librería de supabase para crear el cliente
const { createClient } = require('@supabase/supabase-js');

// Se carga la configuración del archivo .env
require('dotenv').config();

// Se extraen los valores de las variables de entorno
const url_base_datos = process.env.URL_SUPABASE;
const clave_acceso = process.env.CLAVE_SUPABASE;

// Se validan que las variables existan para evitar errores extraños
if (!url_base_datos || !clave_acceso) {
  throw new Error('Faltan las credenciales de Supabase en el archivo .env');
}

const cliente = createClient(url_base_datos, clave_acceso);

module.exports = {
  cliente_supabase: cliente
};