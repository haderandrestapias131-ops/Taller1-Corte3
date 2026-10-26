const express = require('express');
const router = express.Router();
const controlador = require('../controllers/productoControlador');

// Ruta pública (para clientes sin login)
router.get('/publicos', controlador.obtenerTodosPublicos);

// Rutas de expositores
router.post('/guardar', controlador.crear);
router.get('/expositor/:id_expositor', controlador.obtenerPorExpositor);
router.delete('/eliminar/:id', controlador.eliminar);

module.exports = router;