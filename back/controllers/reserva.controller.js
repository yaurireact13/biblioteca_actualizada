const db = require('../config/db');

// Controlador para manejar las reservas
const reservaController = {
  // Crear una nueva reserva
  crearReserva: async (req, res) => {
    try {
      const { usuario_id, libro_id, fecha } = req.body;
      if (!usuario_id || !libro_id || !fecha) {
        return res.status(400).json({ error: 'Campos incompletos' });
      }
      const [result] = await db.query(
        'INSERT INTO reservas (usuario_id, libro_id, fecha) VALUES (?, ?, ?)',
        [usuario_id, libro_id, fecha]
      );
      res.status(201).json({ message: 'Reserva creada', reservaId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la reserva', details: error.message });
    }
  },

  // Obtener todas las reservas con nombres de usuario y títulos de libros
  obtenerReservas: async (req, res) => {
    try {
      const [reservas] = await db.query(`
        SELECT r.id, r.fecha, u.nombre AS usuario_nombre, l.titulo AS libro_titulo
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN libros l ON r.libro_id = l.id
      `);
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservas', details: error.message });
    }
  },

  // Actualizar una reserva
  actualizarReserva: async (req, res) => {
    try {
      const { id } = req.params;
      const { usuario_id, libro_id, fecha } = req.body;
      await db.query(
        'UPDATE reservas SET usuario_id = ?, libro_id = ?, fecha = ? WHERE id = ?',
        [usuario_id, libro_id, fecha, id]
      );
      res.json({ message: 'Reserva actualizada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la reserva', details: error.message });
    }
  },

  // Eliminar una reserva
  eliminarReserva: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM reservas WHERE id = ?', [id]);
      res.json({ message: 'Reserva eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la reserva', details: error.message });
    }
  }
};

module.exports = reservaController;
