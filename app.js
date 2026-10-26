const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const rutas_expositores = require('./routes/expositorRutas');
const rutas_productos = require('./routes/productoRutas');
const rutas_auth = require('./routes/authRutas');

// Registrar prefijos de rutas
app.use('/feria', rutas_expositores);
app.use('/productos', rutas_productos);
app.use('/auth', rutas_auth);

// Redirigir la raíz (/) directamente al login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

const puerto = process.env.PUERTO_SERVIDOR || 3000;
app.listen(puerto, () => {
  console.log('--- Servidor corriendo en http://localhost:' + puerto + ' ---');
});