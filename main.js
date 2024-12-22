document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor');

  function mostrarPantallaUno() {
    contenedor.innerHTML = `
        <div id="bienvenida">
          <h1>¡Hola, bienvenido!</h1>
          <p>Pulsa Control + F10 o espera 5 segundos para continuar.</p>
        </div>
      `;

    setTimeout(() => {
      mostrarLogin();
    }, 5000);

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'F10') {
        mostrarLogin();
      }
    });
  }

  function mostrarLogin() {
    contenedor.innerHTML = `
        <div id="login">
          <h2>Inicia sesión</h2>
          <form id="formularioLogin">
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" placeholder="Escribe tu correo" required>
            <button type="submit">Entrar</button>
          </form>
          <p id="mensajeExito" style="color: green;"></p>
          <p id="mensajeError" style="color: red;"></p>
        </div>
      `;

    mostrarUltimoLogin();

    const formularioLogin = document.getElementById('formularioLogin');
    formularioLogin.addEventListener('submit', manejarLogin);
  }

  function mostrarUltimoLogin() {
    const emailGuardado = localStorage.getItem('email');
    const horaGuardada = localStorage.getItem('ultimaHora');

    if (emailGuardado && horaGuardada) {
      document.getElementById(
        'mensajeExito'
      ).textContent = `Hola ${emailGuardado}. Último acceso: ${horaGuardada}`;
    }
  }

  function manejarLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!email.includes('@') || !email.includes('.')) {
      document.getElementById('mensajeError').textContent =
        'Por favor, escribe un correo válido.';
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    localStorage.setItem('email', email);
    localStorage.setItem('ultimaHora', `${fecha} a las ${hora}`);

    mostrarPantallaPreguntas();
  }

  function mostrarPantallaPreguntas() {
    contenedor.innerHTML = `
        <div id="preguntas">
          <h2>Gestor de preguntas</h2>
          <form id="formularioPreguntas">
            <label for="pregunta">Escribe una pregunta:</label>
            <input type="text" id="pregunta" required>
            <br>
            <label>Respuesta:</label>
            <br>
            <input type="radio" id="verdadero" name="respuesta" value="verdadero" required>
            <label for="verdadero">Verdadero</label>
            <input type="radio" id="falso" name="respuesta" value="falso" required>
            <label for="falso">Falso</label>
            <br>
            <label for="puntos">Puntos:</label>
            <input type="number" id="puntos" min="1" max="10" required>
            <br>
            <button type="submit">Guardar pregunta</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
                <th>Puntos</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody id="tablaPreguntas"></tbody>
          </table>
        </div>
      `;

    const formularioPreguntas = document.getElementById('formularioPreguntas');
    formularioPreguntas.addEventListener('submit', manejarNuevaPregunta);

    cargarPreguntas();
  }

  function manejarNuevaPregunta(e) {
    e.preventDefault();

    const pregunta = document.getElementById('pregunta').value.trim();
    const respuesta = document.querySelector(
      'input[name="respuesta"]:checked'
    ).value;
    const puntos = document.getElementById('puntos').value;

    const nuevaPregunta = {
      pregunta: pregunta,
      respuesta: respuesta,
      puntos: puntos,
      estado: 'Guardando...',
    };

    agregarPregunta(nuevaPregunta);

    setTimeout(() => {
      nuevaPregunta.estado = 'OK';
      guardarPreguntas();
      mostrarPreguntas();
    }, 3000);

    e.target.reset();
  }

  const preguntas = [];

  function agregarPregunta(pregunta) {
    preguntas.push(pregunta);
    mostrarPreguntas();
  }

  function guardarPreguntas() {
    localStorage.setItem('preguntas', JSON.stringify(preguntas));
  }

  function cargarPreguntas() {
    const preguntasGuardadas =
      JSON.parse(localStorage.getItem('preguntas')) || [];
    preguntasGuardadas.forEach((pregunta) => preguntas.push(pregunta));
    mostrarPreguntas();
  }

  function mostrarPreguntas() {
    const tabla = document.getElementById('tablaPreguntas');
    tabla.innerHTML = '';

    preguntas.forEach((pregunta) => {
      const fila = document.createElement('tr');

      const celdaPregunta = document.createElement('td');
      celdaPregunta.textContent = pregunta.pregunta;

      const celdaRespuesta = document.createElement('td');
      celdaRespuesta.textContent = pregunta.respuesta;

      const celdaPuntos = document.createElement('td');
      celdaPuntos.textContent = pregunta.puntos;

      const celdaEstado = document.createElement('td');
      celdaEstado.textContent = pregunta.estado;

      fila.appendChild(celdaPregunta);
      fila.appendChild(celdaRespuesta);
      fila.appendChild(celdaPuntos);
      fila.appendChild(celdaEstado);

      tabla.appendChild(fila);
    });
  }

  mostrarPantallaUno();
});
