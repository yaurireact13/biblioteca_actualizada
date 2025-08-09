const db = require('../config/db');


exports.crearLibro = async (req, res) => {
  try {
    const { titulo, autor, anio, genero } = req.body;
    if (!titulo || !autor || !anio || !genero) {
      return res.status(400).json({ error: 'Campos incompletos' });
    }
    await db.query('INSERT INTO libros (titulo, autor, anio, genero) VALUES (?, ?, ?, ?)', [titulo, autor, anio, genero]);
    res.status(201).json({ mensaje: 'Libro creado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el libro' });
  }
};

exports.obtenerLibros = async (req, res) => {
  try {
    const [libros] = await db.query('SELECT * FROM libros');
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
};

exports.obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [libros] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    if (libros.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libros[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el libro' });
  }
};

exports.actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, anio, genero } = req.body;
    await db.query('UPDATE libros SET titulo = ?, autor = ?, anio = ?, genero = ? WHERE id = ?', [titulo, autor, anio, genero, id]);
    res.json({ mensaje: 'Libro actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
};

exports.eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM libros WHERE id = ?', [id]);
    res.json({ mensaje: 'Libro eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
};
