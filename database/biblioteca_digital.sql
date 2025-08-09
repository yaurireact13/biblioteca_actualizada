-- Script para crear la base de datos y tablas de Biblioteca Digital
CREATE DATABASE IF NOT EXISTS biblioteca_digital;
USE biblioteca_digital;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  contraseña VARCHAR(100) NOT NULL
);

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  anio INT NOT NULL,
  genero VARCHAR(50) NOT NULL
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  libro_id INT NOT NULL,
  fecha DATE NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);
