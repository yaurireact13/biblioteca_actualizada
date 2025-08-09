const express = require('express');
const path = require('path');
const app = express();

const usuariosRoutes = require('./routes/usuarios.routes');
const librosRoutes = require('./routes/libros.routes');
const reservasRoutes = require('./routes/reservas.routes');

app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../front')));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/reservas', reservasRoutes);

// Redirigir la raíz al frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
