const express = require('express');
const router = express.Router();
const authControlador = require('../controllers/authControlador');

router.post('/login', authControlador.iniciarSesion);
router.post('/registro', authControlador.registrarUsuario);

module.exports = router;