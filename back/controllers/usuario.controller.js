const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ===============================
// ✅ Obtener todos los usuarios (sin contraseñas)
// ===============================
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, correo FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// ===============================
// ✅ Obtener un usuario por ID
// ===============================
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo FROM usuarios WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// ===============================
// ✅ Crear un nuevo usuario
// ===============================
exports.crearUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );

    res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// ===============================
// ✅ Actualizar un usuario
// ===============================
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena } = req.body;

  try {
    let hashedPassword = null;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    const [result] = await db.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, contrasena = IFNULL(?, contrasena) WHERE id = ?',
      [nombre, correo, hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// ===============================
// ✅ Eliminar un usuario
// ===============================
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// ===============================
// ✅ Login de usuario con JWT
// ===============================
exports.loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      "secreto123", // ⚠️ usa process.env.JWT_SECRET en producción
      { expiresIn: "1h" }
    );

    // ✅ Enviar token al cliente
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
