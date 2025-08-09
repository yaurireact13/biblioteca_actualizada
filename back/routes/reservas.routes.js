
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Crear una nueva reserva
router.post('/', reservaController.crearReserva);

// Obtener todas las reservas
router.get('/', reservaController.obtenerReservas);

// Actualizar el estado de una reserva
router.put('/:id', reservaController.actualizarReserva);

// Eliminar una reserva
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;
