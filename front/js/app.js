// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  // Vistas
  const authView = document.getElementById("auth-view");
  const appView = document.getElementById("app-view");

  // Formularios
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const usuarioForm = document.getElementById("usuario-form");
  const libroForm = document.getElementById("libro-form");
  const reservaForm = document.getElementById("reserva-form");

  // Botones
  const logoutBtn = document.getElementById("logout");

  // Tablas
  const usuariosList = document.getElementById("usuarios-list");
  const librosList = document.getElementById("libros-list");
  const reservasList = document.getElementById("reservas-list");

  // Selects para reservas
  const usuarioSelect = document.getElementById("usuario_id");
  const libroSelect = document.getElementById("libro_id");

  const API = "http://localhost:3000/api";

  // ==============================
  // 🔑 Función helper para incluir token en headers
  // ==============================
  function authHeaders(extraHeaders = {}) {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders
    };
  }

  // ==============================
  // Función para formatear fechas
  // ==============================
  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`; // DD/MM/YYYY
  }

  // --- AUTENTICACIÓN ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password })
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();

      localStorage.setItem("token", data.token);
      authView.classList.add("hidden");
      appView.classList.remove("hidden");

      cargarUsuarios();
      cargarLibros();
      cargarReservas();
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("reg-nombre").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo: email, contrasena: password })
      });
      if (!res.ok) throw new Error("Error en el registro");
      alert("Usuario registrado con éxito, ahora inicia sesión.");
      document.getElementById("btn-login").click();
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    authView.classList.remove("hidden");
    appView.classList.add("hidden");
  });

  // --- CRUD USUARIOS ---
  async function cargarUsuarios() {
    usuariosList.innerHTML = "";
    const res = await fetch(`${API}/usuarios`, { headers: authHeaders() });
    const usuarios = await res.json();
    usuarios.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td><button data-id="${u.id}" class="eliminar-usuario">❌</button></td>
      `;
      usuariosList.appendChild(tr);
    });
    actualizarSelectUsuarios();
  }

  usuarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;

    await fetch(`${API}/usuarios`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ nombre, correo, contrasena: "123456" })
    });
    usuarioForm.reset();
    cargarUsuarios();
  });

  usuariosList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar-usuario")) {
      const id = e.target.dataset.id;
      await fetch(`${API}/usuarios/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      cargarUsuarios();
    }
  });

  // --- CRUD LIBROS ---
  async function cargarLibros() {
    librosList.innerHTML = "";
    const res = await fetch(`${API}/libros`, { headers: authHeaders() });
    const libros = await res.json();
    libros.forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.id}</td>
        <td>${l.titulo}</td>
        <td>${l.autor}</td>
        <td><button data-id="${l.id}" class="eliminar-libro">❌</button></td>
      `;
      librosList.appendChild(tr);
    });
    actualizarSelectLibros();
  }

  libroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const anio = document.getElementById("anio")?.value || 0;
    const genero = document.getElementById("genero")?.value || '';

    await fetch(`${API}/libros`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ titulo, autor, anio, genero })
    });

    libroForm.reset();
    cargarLibros();
  });

  librosList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar-libro")) {
      const id = e.target.dataset.id;
      await fetch(`${API}/libros/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      cargarLibros();
    }
  });

  // --- CRUD RESERVAS ---
  async function cargarReservas() {
    reservasList.innerHTML = "";
    const res = await fetch(`${API}/reservas`, { headers: authHeaders() });
    const reservas = await res.json();
    reservas.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.usuario_nombre}</td>
        <td>${r.libro_titulo}</td>
        <td>${formatearFecha(r.fecha)}</td>
        <td><button data-id="${r.id}" class="eliminar-reserva">❌</button></td>
      `;
      reservasList.appendChild(tr);
    });
  }

  reservaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario_id = usuarioSelect.value;
    const libro_id = libroSelect.value;
    const fecha = document.getElementById("fecha").value;

    if (!fecha) {
      alert("Por favor, selecciona una fecha");
      return;
    }

    await fetch(`${API}/reservas`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ usuario_id, libro_id, fecha })
    });
    reservaForm.reset();
    cargarReservas();
  });

  reservasList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar-reserva")) {
      const id = e.target.dataset.id;
      await fetch(`${API}/reservas/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      cargarReservas();
    }
  });

  // --- Selects dinámicos ---
  async function actualizarSelectUsuarios() {
    usuarioSelect.innerHTML = "";
    const res = await fetch(`${API}/usuarios`, { headers: authHeaders() });
    const usuarios = await res.json();
    usuarios.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.nombre;
      usuarioSelect.appendChild(option);
    });
  }

  async function actualizarSelectLibros() {
    libroSelect.innerHTML = "";
    const res = await fetch(`${API}/libros`, { headers: authHeaders() });
    const libros = await res.json();
    libros.forEach((l) => {
      const option = document.createElement("option");
      option.value = l.id;
      option.textContent = l.titulo;
      libroSelect.appendChild(option);
    });
  }

  // --- Cambio de pestañas ---
  const tabButtons = document.querySelectorAll(".tab-nav button[data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.add("hidden"));

      btn.classList.add("active");
      const tab = btn.getAttribute("data-tab");
      document.getElementById(tab).classList.remove("hidden");
    });
  });
});
