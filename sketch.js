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
let mostrarTextoInicio = true;
let juegoPausado = false; // Variable para controlar el estado de pausa
let botonPlay, botonPausa, botonReiniciar;
let sonidoClic;
let sonidoHover;

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 150);
  inicializarElementos();
  cargarSonidos();
  crearBotones();
  seleccionarDificultad(dificultad);
  actualizarBotones();
}

function draw() {
  background(0);
  if (juegoActivo) {
    if (juegoPausado) {
      mostrarPantallaPausa(); // Muestra el mensaje de pausa
      botonPlay.attribute("disabled", ""); // Deshabilita el botón Play
    } else {
      botonPlay.removeAttribute("disabled"); // Habilita el botón Play
      dibujarElementos();
      moverPelota();
      manejarRebotes();
      moverRaquetaJugador();
      moverRaquetaComputadora();
      verificarPuntos();
      mostrarPuntuacion();
    }
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
  velocidadPelotaX = 5; // Ajuste inicial de la velocidad de la pelota
  velocidadPelotaY = 3;
}

function cargarSonidos() {
  sonidoColision = loadSound("colision.mp3");
  sonidoPunto = loadSound("punto.wav");
  musicaFondo = loadSound("musica-fondo2.mp3");
  sonidoClic = loadSound("click.mp3");
  sonidoHover = loadSound("hover.mp3");
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
  botonFacil.position(20, height + 25);
  botonFacil.class("dificultad");
  botonFacil.mousePressed(() => {
    seleccionarDificultad("facil");
    sonidoClic.play(); // Sonido de clic
  });
  botonFacil.mouseOver(() => sonidoHover.play());

  // Crear botón de dificultad Medio
  botonMedio = createButton("Medio");
  botonMedio.position(100, height + 25);
  botonMedio.class("dificultad");
  botonMedio.mousePressed(() => {
    seleccionarDificultad("medio");
    sonidoClic.play(); // Sonido de clic
  });
  botonMedio.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });

  // Crear botón de dificultad Difícil
  botonDificil = createButton("Difícil");
  botonDificil.position(190, height + 25);
  botonDificil.class("dificultad");
  botonDificil.mousePressed(() => {
    seleccionarDificultad("dificil");
    sonidoClic.play(); // Sonido de clic
  });
  botonDificil.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });

  // Crear botón de Play
  botonPlay = createButton("Play");
  botonPlay.position(20, height + 80);
  botonPlay.mousePressed(() => {
    iniciarJuego();
    sonidoClic.play();
  });
  botonPlay.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });
  botonPlay.class("control");

  // Crear botón de Pausa
  botonPausa = createButton("Pausa");
  botonPausa.position(105, height + 80);
  botonPausa.mousePressed(() => {
    pausarJuego();
    sonidoClic.play();
  });
  botonPausa.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });
  botonPausa.class("control");

  // Crear botón de Reiniciar
  botonReiniciar = createButton("Reiniciar");
  botonReiniciar.position(205, height + 80);
  botonReiniciar.mousePressed(() => {
    reiniciarJuego();
    sonidoClic.play();
  });
  botonReiniciar.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });
  botonReiniciar.class("control");
}

function seleccionarDificultad(nuevaDificultad) {
  if (!juegoActivo) {
    dificultad = nuevaDificultad;
    switch (dificultad) {
      case "facil":
        velocidadComputadora = velocidadComputadoraFacil;
        break;
      case "medio":
        velocidadComputadora = velocidadComputadoraMedio;
        break;
      case "dificil":
        velocidadComputadora = velocidadComputadoraDificil;
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
  juegoPausado = false; // Asegurar que el juego no esté pausado
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
  velocidadPelotaX = 5; // Velocidad de la pelota al iniciar el juego
  velocidadPelotaY = 3;
  resetPelota();
}

function pausarJuego() {
  if (juegoActivo) {
    juegoPausado = !juegoPausado;
    if (juegoPausado) {
      musicaFondo.pause();
    } else {
      musicaFondo.loop();
    }
  }
}

function reiniciarJuego() {
  juegoActivo = false;
  juegoPausado = false; // Reiniciar la pausa también
  seleccionarDificultad(dificultad);
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
  botonPlay.removeAttribute("disabled");
}

function mostrarPantallaInicial() {
  let tamanoTexto;
  if (windowWidth < 800) {
    tamanoTexto = 24;
  } else {
    tamanoTexto = 56;
  }

  textSize(tamanoTexto);
  textAlign(CENTER, CENTER);

  let colores = [
    color(0, 0, 0),
    color(255, 165, 0),
    color(255, 255, 0),
    color(255, 255, 255),
  ];

  let desplazamientos = [
    { x: 5, y: 5 },
    { x: 4, y: 4 },
    { x: 2, y: 2 },
    { x: 0, y: 0 },
  ];

  for (let i = 0; i < colores.length; i++) {
    fill(colores[i]);
    text(
      "Pulsa Play para Iniciar",
      width / 2 + desplazamientos[i].x,
      height / 2 + desplazamientos[i].y
    );
  }
}

function mostrarPantallaPausa() {
  let tamanoTexto;
  if (windowWidth < 800) {
    tamanoTexto = 24;
  } else {
    tamanoTexto = 56;
  }

  textSize(tamanoTexto);
  textAlign(CENTER, CENTER);

  let colores = [
    color(0, 0, 0),
    color(255, 165, 0),
    color(255, 255, 0),
    color(255, 255, 255),
  ];

  let desplazamientos = [
    { x: 5, y: 5 },
    { x: 4, y: 4 },
    { x: 2, y: 2 },
    { x: 0, y: 0 },
  ];

  for (let i = 0; i < colores.length; i++) {
    fill(colores[i]);
    text(
      "Juego Pausado",
      width / 2 + desplazamientos[i].x,
      height / 2 + desplazamientos[i].y
    );
  }
}

function dibujarElementos() {
  // Cambiar el color de la cancha y las raquetas según la dificultad
  let colorCancha, colorRaquetaJugador, colorRaquetaComputadora;

  switch (dificultad) {
    case "facil":
      colorCancha = color(5, 5, 32);
      colorRaquetaJugador = color(255, 255, 0);
      colorRaquetaComputadora = color(200, 200, 0);
      break;
    case "medio":
      colorCancha = color(67, 6, 6);
      colorRaquetaJugador = color(0, 255, 0);
      colorRaquetaComputadora = color(0, 255, 0);
      break;
    case "dificil":
      colorCancha = color(3, 44, 3);
      colorRaquetaJugador = color(255, 0, 0);
      colorRaquetaComputadora = color(255, 0, 0);
      break;
  }

  fill(colorCancha);
  rect(0, 0, width, height);

  dibujarRaqueta(raquetaJugador.x, raquetaJugador.y, colorRaquetaJugador);
  dibujarRaqueta(
    raquetaComputadora.x,
    raquetaComputadora.y,
    colorRaquetaComputadora
  );
  dibujarPelota();
}

function dibujarPelota() {
  if (windowWidth < 800) {
    diametroPelota = 15;
  }
  let colorPelota;

  switch (dificultad) {
    case "facil":
      colorPelota = color(255, 0, 0);
      break;
    case "medio":
      colorPelota = color(255, 255, 0);
      break;
    case "dificil":
      colorPelota = color(0, 255, 0);
      break;
  }
  fill(colorPelota); // Color de la pelota (rojo)
  stroke("#fff"); // Color del borde de la pelota (blanco)
  strokeWeight(2); // Ancho del borde de la pelota
  ellipse(pelota.x, pelota.y, diametroPelota, diametroPelota);
}

function moverPelota() {
  if (!juegoPausado) {
    pelota.x += velocidadPelotaX;
    pelota.y += velocidadPelotaY;
  }
  velocidadPelotaX *= 1.001;
  velocidadPelotaY *= 1.001;
}

function manejarRebotes() {
  // Rebote en los bordes superior e inferior
  if (
    pelota.y - diametroPelota / 2 < 0 ||
    pelota.y + diametroPelota / 2 > height
  ) {
    velocidadPelotaY *= -1;
    sonidoColision.play();
  }

  // Rebote en la raqueta del jugador
  if (
    pelota.x - diametroPelota / 2 <= raquetaJugador.x + anchoRaqueta &&
    pelota.x - diametroPelota / 2 >= raquetaJugador.x &&
    pelota.y > raquetaJugador.y &&
    pelota.y < raquetaJugador.y + altoRaqueta
  ) {
    let deltaY = pelota.y - (raquetaJugador.y + altoRaqueta / 2);
    let angulo;
    if (abs(deltaY) < 10) {
      // Si la pelota golpea cerca del centro
      angulo = radians(random(-15, 15)); // Ángulo aleatorio
    } else {
      angulo = map(
        deltaY,
        -altoRaqueta / 2,
        altoRaqueta / 2,
        radians(-45),
        radians(45)
      );
    }

    let velocidad = sqrt(
      velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY
    );
    velocidadPelotaX = cos(angulo) * velocidad;
    velocidadPelotaY = sin(angulo) * velocidad;

    // Mueve la pelota fuera de la raqueta
    pelota.x = raquetaJugador.x + anchoRaqueta + diametroPelota / 2 + 1;

    sonidoColision.play();
  }

  // Rebote en la raqueta de la computadora
  if (
    pelota.x + diametroPelota / 2 >= raquetaComputadora.x &&
    pelota.x + diametroPelota / 2 <= raquetaComputadora.x + anchoRaqueta &&
    pelota.y > raquetaComputadora.y &&
    pelota.y < raquetaComputadora.y + altoRaqueta
  ) {
    let deltaY = pelota.y - (raquetaComputadora.y + altoRaqueta / 2);
    let angulo;
    if (abs(deltaY) < 10) {
      // Si la pelota golpea cerca del centro
      angulo = radians(random(-15, 15)); // Ángulo aleatorio
    } else {
      angulo = map(
        deltaY,
        -altoRaqueta / 2,
        altoRaqueta / 2,
        radians(-45),
        radians(45)
      );
    }

    let velocidad = sqrt(
      velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY
    );
    velocidadPelotaX = cos(angulo) * velocidad * -1;
    velocidadPelotaY = sin(angulo) * velocidad;

    // Mueve la pelota fuera de la raqueta
    pelota.x = raquetaComputadora.x - diametroPelota / 2 - 1;

    sonidoColision.play();
  }
}

function moverRaquetaJugador() {
  let velocidadJugador = 12;
  if (windowWidth < 800) {
    velocidadJugador = 6;
  }

  if (keyIsDown(UP_ARROW)) raquetaJugador.y -= velocidadJugador;
  if (keyIsDown(DOWN_ARROW)) raquetaJugador.y += velocidadJugador;

  raquetaJugador.y = constrain(raquetaJugador.y, 0, height - altoRaqueta);
}

function touchMoved() {
  raquetaJugador.y = mouseY - altoRaqueta / 2;
  raquetaJugador.y = constrain(raquetaJugador.y, 0, height - altoRaqueta);
  return false;
}

function moverRaquetaComputadora() {
  let velocidadCPU;

  if (windowWidth < 800) {
    velocidadCPU = 2; // Base para pantallas pequeñas
  } else {
    velocidadCPU = 6; // Base para pantallas grandes
  }

  switch (dificultad) {
    case "facil":
      velocidadComputadora = velocidadCPU;
      break;
    case "medio":
      velocidadComputadora = velocidadCPU * 1.5;
      break;
    case "dificil":
      velocidadComputadora = velocidadCPU * 2;
      break;
  }

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

function dibujarRaqueta(x, y, colorRaqueta) {
  if (windowWidth < 800) {
    anchoRaqueta = 10;
    altoRaqueta = 80;
  }
  fill(colorRaqueta); // Color de la raqueta (verde)
  stroke("#fff"); // Color del borde de la raqueta (blanco)
  strokeWeight(4); // Ancho del borde de la raqueta
  rect(x, y, anchoRaqueta, altoRaqueta, 15);
}

function resetPelota() {
  pelota.x = width / 2;
  pelota.y = height / 2;

  // Configuración base de las velocidades
  let baseVelocidadX, baseVelocidadY;

  if (windowWidth < 800) {
    // Pantallas pequeñas
    baseVelocidadX = 1.8;
    baseVelocidadY = 1.2;
  } else {
    // Pantallas grandes
    baseVelocidadX = 6;
    baseVelocidadY = 4;
  }

  // Escalar velocidades según la dificultad
  switch (dificultad) {
    case "facil":
      velocidadPelotaX = baseVelocidadX * 0.7 * (random() > 0.5 ? 1 : -1);
      velocidadPelotaY = baseVelocidadY * 0.7 * (random() > 0.5 ? 1 : -1);
      break;
    case "medio":
      velocidadPelotaX = baseVelocidadX * 1.5 * (random() > 0.5 ? 1 : -1);
      velocidadPelotaY = baseVelocidadY * 1.5 * (random() > 0.5 ? 1 : -1);
      break;
    case "dificil":
      velocidadPelotaX = baseVelocidadX * 2 * (random() > 0.5 ? 1 : -1);
      velocidadPelotaY = baseVelocidadY * 2 * (random() > 0.5 ? 1 : -1);
      break;
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
