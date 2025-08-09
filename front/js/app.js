// Clases POO
class Usuario {
  constructor({id, nombre, correo}) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
  }
}

class Reserva {
  constructor({id, usuario_id, libro_id, fecha}) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.libro_id = libro_id;
    this.fecha = fecha;
  }
}
// Inicializar main y listeners de navegación
const main = document.getElementById('main-content');
document.getElementById('nav-libros').onclick = renderLibros;
document.getElementById('nav-usuarios').onclick = renderUsuarios;
document.getElementById('nav-reservas').onclick = renderReservas;
window.addEventListener('DOMContentLoaded', renderLibros);
// conexión con la API
// logica de la aplicación es para gestionar libros, usuarios y reservas
const API = {
  libros: 'http://localhost:3000/api/libros',
  usuarios: 'http://localhost:3000/api/usuarios',
  reservas: 'http://localhost:3000/api/reservas'
};

// Utilidades de UI
function showMessage(msg, type = 'success') {
  const div = document.createElement('div');
  div.className = type;
  div.setAttribute('role', type === 'error' ? 'alert' : 'status');
  div.textContent = msg;
  document.getElementById('main-content').prepend(div);
  setTimeout(() => div.remove(), 3500);
}

// Clases POO
class Libro {
  constructor({id, titulo, autor, anio, genero}) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
    this.genero = genero;
  }
}
// Usuarios
async function renderUsuarios() {
  main.innerHTML = '<h2>Usuarios</h2>' + usuarioFormHTML();
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Acciones</th></tr></thead><tbody></tbody>`;
  main.appendChild(table);
  try {
    const res = await fetch(API.usuarios);
    const usuarios = await res.json();
    const tbody = table.querySelector('tbody');
    usuarios.forEach(u => {
      const usuario = new Usuario(u);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${usuario.id}</td><td>${usuario.nombre}</td><td>${usuario.correo}</td><td><button data-id="${usuario.id}" class="edit">Editar</button> <button data-id="${usuario.id}" class="delete">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    table.onclick = handleUsuarioActions;
  } catch {
    showMessage('Error al cargar usuarios', 'error');
  }
  document.getElementById('usuario-form').onsubmit = handleUsuarioForm;
}

// Libros
async function renderLibros() {
  main.innerHTML = '<h2>Libros</h2>' + libroFormHTML();
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>ID</th><th>Título</th><th>Autor</th><th>Año</th><th>Género</th><th>Acciones</th></tr></thead><tbody></tbody>`;
  main.appendChild(table);
  try {
    const res = await fetch(API.libros);
    const libros = await res.json();
    const tbody = table.querySelector('tbody');
    libros.forEach(l => {
      const libro = new Libro(l);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${libro.id}</td><td>${libro.titulo}</td><td>${libro.autor}</td><td>${libro.anio}</td><td>${libro.genero}</td><td><button data-id="${libro.id}" class="edit">Editar</button> <button data-id="${libro.id}" class="delete">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    table.onclick = handleLibroActions;
  } catch {
    showMessage('Error al cargar libros', 'error');
  }
  document.getElementById('libro-form').onsubmit = handleLibroForm;
}
function libroFormHTML() {
  return `<form id="libro-form" aria-label="Formulario de libro">
    <input type="hidden" id="libro-id">
    <label for="titulo">Título</label>
    <input id="titulo" required maxlength="100">
    <label for="autor">Autor</label>
    <input id="autor" required maxlength="100">
    <label for="anio">Año</label>
    <input id="anio" type="number" min="1000" max="2100" required>
    <label for="genero">Género</label>
    <input id="genero" required maxlength="50">
    <button type="submit">Guardar</button>
  </form>`;
}
async function handleLibroForm(e) {
  e.preventDefault();
  const id = document.getElementById('libro-id').value;
  const data = {
    titulo: document.getElementById('titulo').value.trim(),
    autor: document.getElementById('autor').value.trim(),
    anio: document.getElementById('anio').value,
    genero: document.getElementById('genero').value.trim()
  };
  if (!data.titulo || !data.autor || !data.anio || !data.genero) {
    showMessage('Todos los campos son obligatorios', 'error');
    return;
  }
  try {
    let res;
    if (id) {
      res = await fetch(`${API.libros}/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    } else {
      res = await fetch(API.libros, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    }
    if (!res.ok) throw new Error();
    showMessage('Libro guardado');
    renderLibros();
  } catch {
    showMessage('Error al guardar libro', 'error');
  }
}
async function handleLibroActions(e) {
  if (e.target.classList.contains('edit')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API.libros}/${id}`);
      const libro = await res.json();
      document.getElementById('libro-id').value = libro.id;
      document.getElementById('titulo').value = libro.titulo;
      document.getElementById('autor').value = libro.autor;
      document.getElementById('anio').value = libro.anio;
      document.getElementById('genero').value = libro.genero;
    } catch {
      showMessage('Error al cargar libro', 'error');
    }
  }
  if (e.target.classList.contains('delete')) {
    if (!confirm('¿Eliminar este libro?')) return;
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API.libros}/${id}`, {method:'DELETE'});
      if (!res.ok) throw new Error();
      showMessage('Libro eliminado');
      renderLibros();
    } catch {
      showMessage('Error al eliminar libro', 'error');
    }
  }
}

// Usuarios
async function renderUsuarios() {
  main.innerHTML = '<h2>Usuarios</h2>' + usuarioFormHTML();
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Acciones</th></tr></thead><tbody></tbody>`;
  main.appendChild(table);
  try {
    const res = await fetch(API.usuarios);
    const usuarios = await res.json();
    const tbody = table.querySelector('tbody');
    usuarios.forEach(u => {
      const usuario = new Usuario(u);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${usuario.id}</td><td>${usuario.nombre}</td><td>${usuario.correo}</td><td><button data-id="${usuario.id}" class="edit">Editar</button> <button data-id="${usuario.id}" class="delete">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    table.onclick = handleUsuarioActions;
  } catch {
    showMessage('Error al cargar usuarios', 'error');
  }
  document.getElementById('usuario-form').onsubmit = handleUsuarioForm;
}
function usuarioFormHTML() {
  return `<form id="usuario-form" aria-label="Formulario de usuario">
    <input type="hidden" id="usuario-id">
    <label for="nombre">Nombre</label>
    <input id="nombre" required maxlength="100">
    <label for="correo">Correo</label>
    <input id="correo" type="email" required maxlength="100">
    <label for="contrasena">Contraseña</label>
    <input id="contrasena" type="password" required maxlength="100">
    <button type="submit">Guardar</button>
  </form>`;
}
async function handleUsuarioForm(e) {
  e.preventDefault();
  const id = document.getElementById('usuario-id').value;
  const data = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    contrasena: document.getElementById('contrasena').value.trim()
  };
  if (!data.nombre || !data.correo || !data.contrasena) {
    showMessage('Todos los campos son obligatorios', 'error');
    return;
  }
  try {
    let res;
    if (id) {
      res = await fetch(`${API.usuarios}/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    } else {
      res = await fetch(API.usuarios, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    }
    if (!res.ok) throw new Error();
    showMessage('Usuario guardado');
    renderUsuarios();
  } catch {
    showMessage('Error al guardar usuario', 'error');
  }
}
async function handleUsuarioActions(e) {
  if (e.target.classList.contains('edit')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API.usuarios}/${id}`);
      const usuario = await res.json();
      document.getElementById('usuario-id').value = usuario.id;
      document.getElementById('nombre').value = usuario.nombre;
      document.getElementById('correo').value = usuario.correo;
  document.getElementById('contrasena').value = '';
    } catch {
      showMessage('Error al cargar usuario', 'error');
    }
  }
  if (e.target.classList.contains('delete')) {
    if (!confirm('¿Eliminar este usuario?')) return;
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API.usuarios}/${id}`, {method:'DELETE'});
      if (!res.ok) throw new Error();
      showMessage('Usuario eliminado');
      renderUsuarios();
    } catch {
      showMessage('Error al eliminar usuario', 'error');
    }
  }
}

// Reservas
async function renderReservas() {
  main.innerHTML = '<h2>Reservas</h2>' + reservaFormHTML();
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>ID</th><th>Usuario</th><th>Libro</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody></tbody>`;
  main.appendChild(table);
  try {
    const [usuarios, libros, reservas] = await Promise.all([
      fetch(API.usuarios).then(r=>r.json()),
      fetch(API.libros).then(r=>r.json()),
      fetch(API.reservas).then(r=>r.json())
    ]);
    const tbody = table.querySelector('tbody');
    reservas.forEach(r => {
      const reserva = new Reserva(r);
      const usuario = usuarios.find(u => u.id === reserva.usuario_id);
      const libro = libros.find(l => l.id === reserva.libro_id);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${reserva.id}</td><td>${usuario ? usuario.nombre : ''}</td><td>${libro ? libro.titulo : ''}</td><td>${reserva.fecha ? reserva.fecha.substring(0,10) : ''}</td><td><button data-id="${reserva.id}" class="delete">Eliminar</button></td>`;
      tbody.appendChild(tr);
    });
    table.onclick = handleReservaActions;
    renderReservaFormOptions(usuarios, libros);
  } catch {
    showMessage('Error al cargar reservas', 'error');
  }
  document.getElementById('reserva-form').onsubmit = handleReservaForm;
}
function reservaFormHTML() {
  return `<form id="reserva-form" aria-label="Formulario de reserva">
    <label for="usuario_id">Usuario</label>
    <select id="usuario_id" required></select>
    <label for="libro_id">Libro</label>
    <select id="libro_id" required></select>
    <label for="fecha">Fecha</label>
    <input id="fecha" type="date" required>
    <button type="submit">Reservar</button>
  </form>`;
}
function renderReservaFormOptions(usuarios, libros) {
  const usuarioSel = document.getElementById('usuario_id');
  usuarioSel.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
  const libroSel = document.getElementById('libro_id');
  libroSel.innerHTML = libros.map(l => `<option value="${l.id}">${l.titulo}</option>`).join('');
}
async function handleReservaForm(e) {
  e.preventDefault();
  const data = {
    usuario_id: document.getElementById('usuario_id').value,
    libro_id: document.getElementById('libro_id').value,
    fecha: document.getElementById('fecha').value
  };
  if (!data.usuario_id || !data.libro_id || !data.fecha) {
    showMessage('Todos los campos son obligatorios', 'error');
    return;
  }
  try {
    const res = await fetch(API.reservas, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    if (!res.ok) throw new Error();
    showMessage('Reserva creada');
    renderReservas();
  } catch {
    showMessage('Error al crear reserva', 'error');
  }
}
async function handleReservaActions(e) {
  if (e.target.classList.contains('delete')) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API.reservas}/${id}`, {method:'DELETE'});
      if (!res.ok) throw new Error();
      showMessage('Reserva eliminada');
      renderReservas();
    } catch {
      showMessage('Error al eliminar reserva', 'error');
    }
  }
}
