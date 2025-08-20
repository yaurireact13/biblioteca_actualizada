const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Acceso denegado, token requerido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, "secreto123");
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token no válido o expirado" });
  }
};
