const express = require('express');
const router = express.Router();
const controlador = require('../controllers/expositorControlador');
const middleware = require('../middlewares/autorizacionMiddleware');

// Ruta pública para nuevos registros
router.post('/registrar', controlador.registrar);

// --- RUTAS DEL ADMINISTRADOR (Protegidas) ---
// (Nota: Si aún no tienes activo el login en el frontend, puedes probar quitar 'middleware.verificarAdministrador' temporalmente)


// Comenta la línea protegida y quita el middleware temporalmente:
// router.get('/listar-todos', middleware.verificarAdministrador, controlador.obtenerTodos);

router.get('/listar-todos', controlador.obtenerTodos);
router.patch('/cambiar-estado/:id', controlador.cambiarEstado);
router.delete('/eliminar/:id', controlador.eliminar);

module.exports = router;