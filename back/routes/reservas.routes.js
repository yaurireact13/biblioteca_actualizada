
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

router.post('/', reservaController.crearReserva);
router.get('/', reservaController.obtenerReservas);
router.put('/:id', reservaController.actualizarReserva);
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;
