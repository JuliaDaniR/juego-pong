let raquetaJugador, raquetaComputadora, pelota;
let anchoRaqueta = 20,
  altoRaqueta = 120,
  diametroPelota = 30;
let velocidadPelotaX, velocidadPelotaY;
let velocidadComputadoraFacil = 6;
let velocidadComputadoraMedio = 8;
let velocidadComputadoraDificil = 11;
let velocidadComputadora = velocidadComputadoraFacil;
let puntuacionJugador = 0,
  puntuacionComputadora = 0;
let sonidoColision, sonidoPunto, musicaFondo;
let dificultad = "facil";
let juegoActivo = false;
let botonFacil, botonMedio, botonDificil;
let nombreUsuario = "Jugador";
let puntosParaGanar = 5;
let mensajeFinal = "";
let inputNombre, selectPuntos;
const nombreCPU = "CPU";
let mostrarTextoInicio = true; // Variable para controlar la visibilidad del texto de inicio

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 150);
  inicializarElementos();
  cargarSonidos();
  crearBotones();
  seleccionarDificultad(dificultad); // Inicializar velocidad según la dificultad por defecto
  actualizarBotones();
}

function draw() {
  background(0);
  if (juegoActivo) {
    dibujarElementos();
    moverPelota();
    manejarRebotes();
    moverRaquetaJugador();
    moverRaquetaComputadora();
    verificarPuntos();
    mostrarPuntuacion();
  } else {
    if (mensajeFinal) {
      mostrarMensajeFinal();
    } else if (mostrarTextoInicio) {
      mostrarPantallaInicial();
    }
  }
}

function inicializarElementos() {
  raquetaJugador = createVector(10, height / 2 - altoRaqueta / 2);
  raquetaComputadora = createVector(
    width - anchoRaqueta - 10,
    height / 2 - altoRaqueta / 2
  );
  pelota = createVector(width / 2, height / 2);
}

function cargarSonidos() {
  sonidoColision = loadSound("colision.mp3");
  sonidoPunto = loadSound("punto.wav");
  musicaFondo = loadSound("musica-fondo2.mp3");
}

function crearBotones() {
  // Crear campo de entrada para el nombre del jugador
  inputNombre = createInput("");
  inputNombre.position(20, height + -30);
  inputNombre.attribute("placeholder", "Ingresa tu nombre");
  inputNombre.class("input-nombre");
  inputNombre.input(() => (nombreUsuario = inputNombre.value()));

  // Crear selector de puntos para ganar
  selectPuntos = createSelect();
  selectPuntos.position(200, height + -30);
  selectPuntos.option("5");
  selectPuntos.option("7");
  selectPuntos.option("10");
  selectPuntos.class("select-puntos");
  selectPuntos.changed(() => (puntosParaGanar = int(selectPuntos.value())));

  // Crear botón de dificultad Fácil
  botonFacil = createButton("Fácil");
  botonFacil.position(20, height + 60);
  botonFacil.class("dificultad");
  botonFacil.mousePressed(() => seleccionarDificultad("facil"));

  // Crear botón de dificultad Medio
  botonMedio = createButton("Medio");
  botonMedio.position(100, height + 60);
  botonMedio.class("dificultad");
  botonMedio.mousePressed(() => seleccionarDificultad("medio"));

  // Crear botón de dificultad Difícil
  botonDificil = createButton("Difícil");
  botonDificil.position(190, height + 60);
  botonDificil.class("dificultad");
  botonDificil.mousePressed(() => seleccionarDificultad("dificil"));

  // Crear botón de Play
  let botonPlay = createButton("Play");
  botonPlay.position(280, height + 60);
  botonPlay.mousePressed(iniciarJuego);
  botonPlay.class("control");

  // Crear botón de Reiniciar
  let botonReiniciar = createButton("Reiniciar");
  botonReiniciar.position(380, height + 60);
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.class("control");
}

function seleccionarDificultad(nuevaDificultad) {
  if (!juegoActivo) {
    dificultad = nuevaDificultad;
    switch (dificultad) {
      case "facil":
        if (windowWidth < 800) {
          velocidadComputadora = 0.8;
        } else {
          velocidadComputadora = velocidadComputadoraFacil;
        }
        break;
      case "medio":
        if (windowWidth < 800) {
          velocidadComputadora = 1;
        } else {
          velocidadComputadora = velocidadComputadoraMedio;
        }
        break;
      case "dificil":
        if (windowWidth < 800) {
          velocidadComputadora = 2;
        } else {
          velocidadComputadora = velocidadComputadoraDificil;
        }
        break;
    }
    resetPelota();
    actualizarBotones();
  }
}

function actualizarBotones() {
  if (dificultad === "facil") {
    botonFacil.elt.classList.add("selected");
    botonMedio.elt.classList.remove("selected");
    botonDificil.elt.classList.remove("selected");
  } else if (dificultad === "medio") {
    botonFacil.elt.classList.remove("selected");
    botonMedio.elt.classList.add("selected");
    botonDificil.elt.classList.remove("selected");
  } else if (dificultad === "dificil") {
    botonFacil.elt.classList.remove("selected");
    botonMedio.elt.classList.remove("selected");
    botonDificil.elt.classList.add("selected");
  }
}

function iniciarJuego() {
  juegoActivo = true;
  mensajeFinal = "";
  mostrarTextoInicio = false;
  inputNombre.hide();
  selectPuntos.hide();
  if (!musicaFondo.isPlaying()) {
    musicaFondo.setVolume(0.5);
    musicaFondo.loop();
  }
  puntuacionJugador = 0;
  puntuacionComputadora = 0;
  resetPelota();
}

function reiniciarJuego() {
  juegoActivo = false;
  seleccionarDificultad(dificultad); // Reiniciar la velocidad según la dificultad actual
  musicaFondo.stop();
  inicializarElementos();
  resetPelota();
  puntuacionJugador = 0;
  puntuacionComputadora = 0;
  inputNombre.value("");
  inputNombre.show();
  selectPuntos.show();
  mostrarTextoInicio = true;
  mensajeFinal = "";
}

function mostrarPantallaInicial() {
  let tamanoTexto;
  if (windowWidth < 800) {
    // Pantallas pequeñas
    tamanoTexto = 24;
  } else {
    tamanoTexto = 56;
  }

  textSize(tamanoTexto);
  textAlign(CENTER, CENTER);

  // Colores de las capas
  let colores = [
    color(0, 0, 0), // Negro (capa más baja)
    color(255, 165, 0), // Naranja
    color(255, 255, 0), // Amarillo
    color(255, 255, 255), // Blanco (capa más alta)
  ];

  let desplazamientos = [
    { x: 5, y: 5 }, // Desplazamiento para la sombra negra
    { x: 4, y: 4 }, // Desplazamiento para la capa naranja
    { x: 2, y: 2 }, // Desplazamiento para la capa amarilla
    { x: 0, y: 0 }, // Texto principal en blanco
  ];

  // Dibuja cada capa
  for (let i = 0; i < colores.length; i++) {
    fill(colores[i]);
    text(
      "Pulsa Play para Iniciar",
      width / 2 + desplazamientos[i].x,
      height / 2 + desplazamientos[i].y
    );
  }
}

function dibujarElementos() {
  dibujarRaqueta(raquetaJugador.x, raquetaJugador.y);
  dibujarRaqueta(raquetaComputadora.x, raquetaComputadora.y);
  dibujarPelota();
}

function dibujarPelota() {
  if (windowWidth < 800) {
    diametroPelota = 15;
  }
  fill("#f00"); // Color de la pelota (rojo)
  stroke("#fff"); // Color del borde de la pelota (blanco)
  strokeWeight(2); // Ancho del borde de la pelota
  ellipse(pelota.x, pelota.y, diametroPelota, diametroPelota);
}

function moverPelota() {
  pelota.x += velocidadPelotaX;
  pelota.y += velocidadPelotaY;

  if (windowWidth > 700) {
    velocidadPelotaX *= 1.001;
    velocidadPelotaY *= 1.001;
  }
}

function manejarRebotes() {
  // Rebote en los bordes superior e inferior
  if (
    pelota.y - diametroPelota / 2 < 0 ||
    pelota.y + diametroPelota / 2 > height
  ) {
    velocidadPelotaY *= -1;
    pelota.y = constrain(
      pelota.y,
      diametroPelota / 2,
      height - diametroPelota / 2
    );
    sonidoColision.play();
  }

  // Rebote en la raqueta del jugador
  if (
    pelota.x - diametroPelota / 2 < raquetaJugador.x + anchoRaqueta &&
    pelota.y > raquetaJugador.y &&
    pelota.y < raquetaJugador.y + altoRaqueta
  ) {
    velocidadPelotaX *= -1;
    pelota.x = raquetaJugador.x + anchoRaqueta + diametroPelota / 2;
    sonidoColision.play();
  }

  // Rebote en la raqueta de la computadora
  if (
    pelota.x + diametroPelota / 2 > raquetaComputadora.x &&
    pelota.y > raquetaComputadora.y &&
    pelota.y < raquetaComputadora.y + altoRaqueta
  ) {
    velocidadPelotaX *= -1;
    pelota.x = raquetaComputadora.x - diametroPelota / 2;
    sonidoColision.play();
  }
}

function moverRaquetaJugador() {
  if (keyIsDown(UP_ARROW)) raquetaJugador.y -= 12;
  if (keyIsDown(DOWN_ARROW)) raquetaJugador.y += 12;

  raquetaJugador.y = constrain(raquetaJugador.y, 0, height - altoRaqueta);
}

function touchMoved() {
  raquetaJugador.y = mouseY - altoRaqueta / 2;
  raquetaJugador.y = constrain(raquetaJugador.y, 0, height - altoRaqueta);
  return false;
}

function moverRaquetaComputadora() {
  if (pelota.y < raquetaComputadora.y + altoRaqueta / 2) {
    raquetaComputadora.y -= velocidadComputadora;
  } else {
    raquetaComputadora.y += velocidadComputadora;
  }
  raquetaComputadora.y = constrain(
    raquetaComputadora.y,
    0,
    height - altoRaqueta
  );
}

function verificarPuntos() {
  if (pelota.x < 0) {
    puntuacionComputadora++;
    resetPelota();
    sonidoPunto.play();
    if (puntuacionComputadora >= puntosParaGanar) {
      terminarJuego(mensajeDerrota());
    }
  }

  if (pelota.x > width) {
    puntuacionJugador++;
    resetPelota();
    sonidoPunto.play();
    if (puntuacionJugador >= puntosParaGanar) {
      terminarJuego(mensajeVictoria());
    }
  }
}

function mostrarPuntuacion() {
  let tamanio = 32;
  if (windowWidth < 800) {
    textSize(16);
  } else {
    textSize(32);
  }
  fill(255);
  textAlign(LEFT);
  text(`${nombreUsuario}: ${puntuacionJugador}`, 32, 40);
  textAlign(RIGHT);
  text(`${nombreCPU}: ${puntuacionComputadora}`, width - 32, 40);
}

function dibujarRaqueta(x, y) {
  if (windowWidth < 800) {
    anchoRaqueta = 10;
    altoRaqueta = 80;
  }
  fill("#0f0"); // Color de la raqueta (verde)
  stroke("#fff"); // Color del borde de la raqueta (blanco)
  strokeWeight(4); // Ancho del borde de la raqueta
  rect(x, y, anchoRaqueta, altoRaqueta, 15);
}

function resetPelota() {
  pelota.x = width / 2;
  pelota.y = height / 2;
  // Velocidad aleatoria basada en la dificultad
  let velocidadMaximaX, velocidadMaximaY;
  switch (dificultad) {
    case "facil":
      if (windowWidth < 800) {
        velocidadMaximaX = 2.3;
        velocidadMaximaY = 1.5;
      } else {
        velocidadMaximaX = 6;
        velocidadMaximaY = 3;
      }
      break;
    case "medio":
      if (windowWidth < 800) {
        velocidadMaximaX = 2.8;
        velocidadMaximaY = 1.8;
      } else {
        velocidadMaximaX = 8;
        velocidadMaximaY = 4;
      }
      break;
    case "dificil":
      if (windowWidth < 800) {
        velocidadMaximaX = 4;
        velocidadMaximaY = 2;
      } else {
        velocidadMaximaX = 10;
        velocidadMaximaY = 6;
      }
      break;
  }

  if (windowWidth < 800) {
    velocidadPelotaX =
      random(velocidadMaximaX * 0.8, velocidadMaximaX * 1.2) *
      (random() > 0.5 ? 1 : -1);
    velocidadPelotaY =
      random(velocidadMaximaY * 0.8, velocidadMaximaY * 1.2) *
      (random() > 0.5 ? 1 : -1);
  } else {
    velocidadPelotaX =
      random(velocidadMaximaX * 0.8, velocidadMaximaX * 1.3) *
      (random() > 0.5 ? 1 : -1);
    velocidadPelotaY =
      random(velocidadMaximaY * 0.8, velocidadMaximaY * 1.3) *
      (random() > 0.5 ? 1 : -1);
  }
}

function terminarJuego(mensaje) {
  juegoActivo = false;
  mensajeFinal = mensaje;
  musicaFondo.stop();
}

function mostrarMensajeFinal() {
  let tamanoTexto;
  if (windowWidth < 800) {
    // Pantallas pequeñas
    tamanoTexto = 24;
  } else {
    tamanoTexto = 48;
  }

  textSize(tamanoTexto);
  textAlign(CENTER, CENTER);

  // Colores para las capas del mensaje final
  let colores = [color(0, 255, 255), color(9, 60, 91), color(0, 0, 255)];

  let desplazamientos = [
    { x: 4, y: 4 },
    { x: 2, y: 2 },
    { x: 0, y: 0 },
  ];

  // Determina el mensaje a mostrar basado en el resultado
  let textoFinal = mensajeFinal;

  // Asegúrate de que el texto se ajuste al canvas
  let margen = 20;
  let maxAncho = width - 2 * margen;
  let maxAltura = height - 2 * margen;

  if (textWidth(textoFinal) > maxAncho) {
    textoFinal = ajustarTextoParaCanvas(textoFinal, maxAncho);
  }

  // Dibuja cada capa
  for (let i = 0; i < colores.length; i++) {
    fill(colores[i]);
    text(
      textoFinal,
      width / 2 + desplazamientos[i].x,
      height / 2 + desplazamientos[i].y
    );
  }
}

// Función para ajustar el texto si es demasiado largo
function ajustarTextoParaCanvas(texto, maxAncho) {
  let palabras = texto.split(" ");
  let lineas = [];
  let lineaActual = "";

  for (let i = 0; i < palabras.length; i++) {
    let pruebaLinea = lineaActual + palabras[i] + " ";
    if (textWidth(pruebaLinea) > maxAncho) {
      lineas.push(lineaActual);
      lineaActual = palabras[i] + " ";
    } else {
      lineaActual = pruebaLinea;
    }
  }

  lineas.push(lineaActual); // Añadir la última línea
  return lineas.join("\n");
}

function mensajeVictoria() {
  switch (dificultad) {
    case "facil":
      return `🎉 Felicidades ${nombreUsuario} 🎉\nGanaste en el primer nivel.\n¡Prueba con una dificultad diferente!`;
    case "medio":
      return `🎉 Felicidades ${nombreUsuario} 🎉\nGanaste en la dificultad media.\n¡Sigue subiendo el desafío!`;
    case "dificil":
      return `🏆 ¡Espectacular, ${nombreUsuario} 🏆\nSuperaste nuestro mayor nivel.\n¡Eres un experto, sigue jugando!`;
  }
}

function mensajeDerrota() {
  switch (dificultad) {
    case "facil":
      return `😢 ¡Oh no, ${nombreUsuario} Perdiste! 😢\nIntenta nuevamente`;
    case "medio":
      return `🤔 ¡Vamos subiendo de nivel!\nSigue intentando, ${nombreUsuario}! 🤔`;
    case "dificil":
      return `😓 Qué desafiante, ${nombreUsuario} 😓\nSigue intentando.\n¡Seguro lo lograrás!`;
  }
}
