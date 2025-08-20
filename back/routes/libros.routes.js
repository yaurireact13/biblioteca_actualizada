// routes/libro.router.js
const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');
const auth = require("../middlewares/auth");

// ✅ Rutas protegidas con JWT
router.get("/", auth, libroController.obtenerLibros);
router.get("/:id", auth, libroController.obtenerLibroPorId);
router.post("/", auth, libroController.crearLibro);
router.put("/:id", auth, libroController.actualizarLibro);
router.delete("/:id", auth, libroController.eliminarLibro);

module.exports = router;
