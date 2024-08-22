let raquetaJugador, raquetaComputadora, pelota;
let anchoRaqueta = 20,
  altoRaqueta = 120,
  diametroPelota = 25;
let velocidadPelotaX, velocidadPelotaY;
let velocidadComputadoraFacil = 6;
let velocidadComputadoraMedio = 8;
let velocidadComputadoraDificil = 10;
let velocidadComputadoraEpico = 12;
let velocidadComputadora = velocidadComputadoraFacil;
let puntuacionJugador = 0,
  puntuacionComputadora = 0;
let sonidoColision, sonidoPunto, musicaFondo;
let dificultad = "facil";
let juegoActivo = false;
let botonFacil, botonMedio, botonDificil, botonEpico;
let nombreUsuario = "Jugador";
let puntosParaGanar = 5;
let mensajeFinal = "";
let inputNombre, selectPuntos, selectObstaculos;
const nombreCPU = "CPU";
let mostrarTextoInicio = true;
let juegoPausado = false; // Variable para controlar el estado de pausa
let botonPlay, botonPausa, botonReiniciar;
let sonidoClic;
let sonidoHover;
let sonidoFinJuego;
let mensajeDesarrollador = "Este proyecto fue desarrollado por Julia Rodriguez";
let obstaculos = []; // Array para almacenar obstáculos
let numObstaculos = 0;
let tamañoObstaculo = 50;
let imgPelotaEpico, imgFondoEpico, imgRaquetaEpico, imgRaquetaObstaculosEpico;
let anguloPelota = 0; // Ángulo de rotación de la pelota
let velocidadRotacion = 0.05; // Velocidad de rotación

function preload() {
  imgPelotaEpico = loadImage("bola.png");
  imgFondoEpico = loadImage("fondo1.png");
  imgRaquetaObstaculosEpico = loadImage("barra2.png");
  imgRaquetaEpico = loadImage("barra1.png");
}

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 150);
  inicializarElementos();
  cargarSonidos();
  crearBotones();
  seleccionarDificultad(dificultad);
  actualizarBotones();
  numObstaculos = 0;
  generarObstaculos();
}

function draw() {
  background(0);
  if (juegoActivo) {
    if (juegoPausado) {
      mostrarPantallaPausa();
      botonPlay.attribute("disabled", "");
    } else {
      botonPlay.attribute("disabled", "");
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
      botonPlay.attribute("disabled", "");
      botonReiniciar.removeAttribute("disabled");
      botonDificil.attribute("disabled", "");
      botonEpico.attribute("disabled", "");
      botonFacil.attribute("disabled", "");
      botonMedio.attribute("disabled", "");
      botonPausa.attribute("disabled", "");
    } else if (mostrarTextoInicio) {
      mostrarPantallaInicial();
      botonPlay.removeAttribute("disabled");
      botonReiniciar.attribute("disabled", "");
      botonDificil.removeAttribute("disabled");
      botonEpico.removeAttribute("disabled");
      botonFacil.removeAttribute("disabled");
      botonMedio.removeAttribute("disabled");
      botonPausa.attribute("disabled", "");
    }
  }
  textSize(20);
  fill(255);
  textAlign(RIGHT, BOTTOM);
  text(mensajeDesarrollador, width - 10, height - 10);
}

function inicializarElementos() {
  raquetaJugador = createVector(10, height / 2 - altoRaqueta / 2);
  raquetaComputadora = createVector(
    width - anchoRaqueta - 10,
    height / 2 - altoRaqueta / 2
  );
  pelota = createVector(width / 2, height / 2);
  velocidadPelotaX = 6;
  velocidadPelotaY = 4;

  if (dificultad === "epico" || dificultad === "dificil") {
    obstaculos = [];
    for (let i = 0; i < numObstaculos; i++) {
      obstaculos.push({
        x: random(width / 4, width / 2),
        y: random(0, height - tamañoObstaculo),
        w: tamañoObstaculo,
        h: tamañoObstaculo,
      });
    }
  }
}

function cargarSonidos() {
  sonidoColision = loadSound("colision.mp3", soundLoaded);
  sonidoPunto = loadSound("punto.wav");
  musicaFondo = loadSound("musica-fondo2.mp3");
  sonidoClic = loadSound("click.mp3");
  sonidoHover = loadSound("hover.mp3", soundLoaded);
  sonidoFinJuego = loadSound("fin-juego.wav");
}
function soundLoaded(sound) {
  sonidoColision.setVolume(0.3);
  sonidoHover.setVolume(0.5);
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
  selectPuntos.position(240, height + -30);
  selectPuntos.option("5");
  selectPuntos.option("7");
  selectPuntos.option("10");
  selectPuntos.option("15");
  selectPuntos.option("20");
  selectPuntos.class("select-puntos");
  selectPuntos.changed(() => (puntosParaGanar = int(selectPuntos.value())));

  // Crear selector de obstáculos
  selectObstaculos = createSelect();
  selectObstaculos.position(380, height - 30);
  selectObstaculos.option("0 Obstáculos");
  selectObstaculos.option("2 Obstáculos");
  selectObstaculos.option("4 Obstáculos");
  selectObstaculos.option("6 Obstáculos");
  selectObstaculos.option("8 Obstáculos");
  selectObstaculos.class("select-obstaculos");
  selectObstaculos.hide();

  // Función para manejar el cambio en la selección de obstáculos
  selectObstaculos.changed(() => {
    // Convertir el texto a número para el número de obstáculos
    let numSeleccionados = parseInt(selectObstaculos.value());
    numObstaculos = numSeleccionados; // Actualizar el número de obstáculos
    generarObstaculos(); // Regenerar obstáculos según la selección
  });

  // Crear botón de dificultad Fácil
  botonFacil = createButton("Fácil");
  botonFacil.position(20, height + 25);
  botonFacil.class("dificultad");
  botonFacil.mousePressed(() => {
    seleccionarDificultad("facil");
    sonidoClic.play();
  });
  botonFacil.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });

  // Crear botón de dificultad Medio
  botonMedio = createButton("Medio");
  botonMedio.position(100, height + 25);
  botonMedio.class("dificultad");
  botonMedio.mousePressed(() => {
    seleccionarDificultad("medio");
    sonidoClic.play();
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
    sonidoClic.play();
  });
  botonDificil.mouseOver(() => {
    sonidoHover.play();
    sonidoHover.setVolume(0.5);
  });

  // Crear botón de Modo Epico
  botonEpico = createButton("Épico");
  botonEpico.position(280, height + 25);
  botonEpico.class("dificultad");
  botonEpico.mousePressed(() => {
    seleccionarDificultad("epico");
    sonidoClic.play();
  });
  botonEpico.mouseOver(() => {
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
        selectObstaculos.hide();
        document.body.classList.remove("epico");
        document.body.classList.remove("dificil");
        document.body.classList.remove("medio");
        document.body.classList.add("facil");
        break;
      case "medio":
        velocidadComputadora = velocidadComputadoraMedio;
        selectObstaculos.hide();
        document.body.classList.remove("epico");
        document.body.classList.remove("dificil");
        document.body.classList.remove("facil");
        document.body.classList.add("medio");
        break;
      case "dificil":
        velocidadComputadora = velocidadComputadoraDificil;
        document.body.classList.remove("epico");
        document.body.classList.add("dificil");
        document.body.classList.remove("medio");
        document.body.classList.remove("facil");
        selectObstaculos.show();
        break;
      case "epico":
        velocidadComputadora = velocidadComputadoraEpico;
        selectObstaculos.show();
        document.body.classList.add("epico");
        document.body.classList.remove("dificil");
        document.body.classList.remove("medio");
        document.body.classList.remove("facil");
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
    botonEpico.elt.classList.remove("selected");
  } else if (dificultad === "medio") {
    botonFacil.elt.classList.remove("selected");
    botonMedio.elt.classList.add("selected");
    botonDificil.elt.classList.remove("selected");
    botonEpico.elt.classList.remove("selected");
  } else if (dificultad === "dificil") {
    botonFacil.elt.classList.remove("selected");
    botonMedio.elt.classList.remove("selected");
    botonDificil.elt.classList.add("selected");
    botonEpico.elt.classList.remove("selected");
  } else if (dificultad === "epico") {
    botonFacil.elt.classList.remove("selected");
    botonMedio.elt.classList.remove("selected");
    botonDificil.elt.classList.remove("selected");
    botonEpico.elt.classList.add("selected");
  }
}

function iniciarJuego() {
  juegoActivo = true;
  juegoPausado = false; // Asegurar que el juego no esté pausado
  mensajeFinal = "";
  mostrarTextoInicio = false;
  inputNombre.hide();
  selectPuntos.hide();
  selectObstaculos.hide();
  if (!musicaFondo.isPlaying()) {
    musicaFondo.setVolume(0.3);
    musicaFondo.loop();
  }
  puntuacionJugador = 0;
  puntuacionComputadora = 0;
  velocidadPelotaX = velocidadPelotaX;
  velocidadPelotaY = velocidadPelotaY;
  resetPelota();
  botonPlay.attribute("disabled", "");
  botonPausa.removeAttribute("disabled");
  botonReiniciar.removeAttribute("disabled");
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
  if (dificultad === "epico" || dificultad === "dificil") {
    obstaculos = [];
    for (let i = 0; i < numObstaculos; i++) {
      obstaculos.push({
        x: random(width / 4, width / 2),
        y: random(0, height - tamañoObstaculo),
        w: tamañoObstaculo,
        h: tamañoObstaculo,
      });
    }
  }
  resetPelota();
  puntuacionJugador = 0;
  puntuacionComputadora = 0;
  diametroPelota = 25;
  numObstaculos = 0;
  inputNombre.value("");
  inputNombre.show();
  selectPuntos.show();
  selectObstaculos.hide();
  mostrarTextoInicio = true;
  mensajeFinal = "";
  botonPlay.removeAttribute("disabled");
  botonFacil.elt.classList.add("selected");
  botonMedio.elt.classList.remove("selected");
  botonDificil.elt.classList.remove("selected");
  botonEpico.elt.classList.remove("selected");
  botonPausa.removeAttribute("disabled");
  botonReiniciar.attribute("disabled", "");
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

function generarObstaculos() {
  obstaculos = [];

  // Ajustar el número de obstáculos basado en el ancho de la ventana
  numObstaculos = windowWidth > 800 ? numObstaculos : 2;

  for (let i = 0; i < numObstaculos; i++) {
    let x, y;
    let ancho, alto;
    let intento = 0;
    let maxIntentos = 100;
    let solapado = true;

    // Intentar colocar el obstáculo en una posición no solapada
    while (solapado && intento < maxIntentos) {
      x = random(width * 0.2, width * 0.8);
      y = random(height * 0.2, height * 0.8);
      ancho = random(20, 30);
      alto = random(100, 160);

      solapado = false;

      // Verificar si el nuevo obstáculo solapa con algún obstáculo existente
      for (let j = 0; j < obstaculos.length; j++) {
        let o = obstaculos[j];
        if (
          !(
            x + ancho < o.x ||
            x > o.x + o.ancho ||
            y + alto < o.y ||
            y > o.y + o.alto
          )
        ) {
          solapado = true;
          break;
        }
      }

      intento++;
    }

    if (!solapado) {
      obstaculos.push({ x, y, ancho, alto });
    } else {
      console.warn(
        "No se pudo colocar un obstáculo sin solapamiento después de varios intentos"
      );
    }
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
    case "epico":
      colorCancha = null;
      colorRaquetaJugador = null;
      colorRaquetaComputadora = null;
      break;
  }

  if (dificultad === "epico") {
    if (imgFondoEpico && imgRaquetaEpico) {
      anchoRaqueta = 30;
      altoRaqueta = 180;
      image(imgFondoEpico, 0, 0, width, height);
      image(
        imgRaquetaEpico,
        raquetaJugador.x,
        raquetaJugador.y,
        anchoRaqueta,
        altoRaqueta
      );
      image(
        imgRaquetaEpico,
        raquetaComputadora.x,
        raquetaComputadora.y,
        anchoRaqueta,
        altoRaqueta
      );
    } else {
      console.error("Las imágenes no se han cargado correctamente.");
    }
    dibujarObstaculos();
  } else {
    fill(colorCancha);
    rect(0, 0, width, height);

    dibujarRaqueta(raquetaJugador.x, raquetaJugador.y, colorRaquetaJugador);
    dibujarRaqueta(
      raquetaComputadora.x,
      raquetaComputadora.y,
      colorRaquetaComputadora
    );
  }
  if (dificultad === "dificil") {
    dibujarObstaculos();
  }
  dibujarPelota();
}

function dibujarObstaculos() {
  noStroke();
  for (let obstaculo of obstaculos) {
    image(
      imgRaquetaObstaculosEpico,
      obstaculo.x,
      obstaculo.y,
      obstaculo.ancho,
      obstaculo.alto
    );
  }
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
    case "epico":
      colorPelota = null; // No usar color en el modo épico
      break;
  }

  if (dificultad === "epico") {
    diametroPelota = 40;
    push();
    translate(pelota.x, pelota.y);
    rotate(anguloPelota); // Aplica la rotación
    imageMode(CENTER);
    image(
      imgPelotaEpico,
      0, // Ajustar a 0 ya que hemos trasladado el origen
      0, // Ajustar a 0 ya que hemos trasladado el origen
      diametroPelota,
      diametroPelota
    );
    pop();
  } else {
    fill(colorPelota); // Color de la pelota
    stroke("#fff"); // Color del borde de la pelota (blanco)
    strokeWeight(2); // Ancho del borde de la pelota
    push();
    translate(pelota.x, pelota.y);
    rotate(anguloPelota); // Aplica la rotación
    ellipse(0, 0, diametroPelota, diametroPelota); // Dibujar la pelota en la nueva posición
    pop();
  }
}

function moverPelota() {
  if (!juegoPausado) {
    pelota.x += velocidadPelotaX;
    pelota.y += velocidadPelotaY;
    verificarColisionesObstaculos();
  }
  // Aumenta la velocidad de la pelota ligeramente
  velocidadPelotaX *= 1.001;
  velocidadPelotaY *= 1.001;

  // Actualiza el ángulo de rotación basado en la velocidad
  anguloPelota += (velocidadPelotaX + velocidadPelotaY) * 0.01; // Ajusta el factor de escala según sea necesario

  // Asegúrate de que el ángulo esté en el rango adecuado
  anguloPelota = anguloPelota % TWO_PI;
}

function verificarColisionesObstaculos() {
  for (let obstaculo of obstaculos) {
    if (
      pelota.x + diametroPelota / 2 > obstaculo.x &&
      pelota.x - diametroPelota / 2 < obstaculo.x + obstaculo.ancho &&
      pelota.y + diametroPelota / 2 > obstaculo.y &&
      pelota.y - diametroPelota / 2 < obstaculo.y + obstaculo.alto
    ) {
      let deltaX = pelota.x - (obstaculo.x + obstaculo.ancho / 4);
      let deltaY = pelota.y - (obstaculo.y + obstaculo.alto / 4);

      if (abs(deltaY) > abs(deltaX)) {
        velocidadPelotaY *= -1;
      } else {
        velocidadPelotaX *= -1;
      }

      sonidoColision.play();
    }
  }
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

  // Rebote en los obstáculos
  if (dificultad === "epico" || dificultad === "dificil") {
    for (let obs of obstaculos) {
      if (
        pelota.x + diametroPelota / 2 > obs.x &&
        pelota.x - diametroPelota / 2 < obs.x + obs.w &&
        pelota.y + diametroPelota / 2 > obs.y &&
        pelota.y - diametroPelota / 2 < obs.y + obs.h
      ) {
        // Rebote en el obstáculo
        velocidadPelotaX *= -1;
        sonidoColision.play();
        break; // Salir del bucle si la pelota colide con un obstáculo
      }
    }
  }
}

function moverRaquetaJugador() {
  let velocidadJugador = 14;
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
    case "epico":
      velocidadComputadora = velocidadCPU * 2.5;
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

function narrarTexto(texto) {
  // Verifica si la API de síntesis de voz está disponible
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.rate = 1.2;
    utterance.pitch = 0.5;
    speechSynthesis.speak(utterance);
  } else {
    console.log('La síntesis de voz no está soportada en este navegador.');
  }
}

function verificarPuntos() {
  if (pelota.x < 0) {
    // Gol para la computadora
    puntuacionComputadora++;
    resetPelota();
    sonidoPunto.play();
    sonidoPunto.setVolume(0.3);
    narrarTexto(`${nombreUsuario} ${puntuacionJugador} compu ${puntuacionComputadora}`);
    if (puntuacionComputadora >= puntosParaGanar) {
      terminarJuego(mensajeDerrota());
    }
  }

  if (pelota.x > width) {
    // Gol para el jugador
    puntuacionJugador++;
    resetPelota();
    sonidoPunto.play();
      sonidoPunto.setVolume(0.3);
    narrarTexto(`${nombreUsuario} ${puntuacionJugador} compu ${puntuacionComputadora}`);
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
  anguloPelota = 0;

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
      velocidadPelotaX = baseVelocidadX * 2.5 * (random() > 0.5 ? 1 : -1);
      velocidadPelotaY = baseVelocidadY * 2.5 * (random() > 0.5 ? 1 : -1);
      break;
    case "epico":
      velocidadPelotaX = baseVelocidadX * 3.5 * (random() > 0.5 ? 1 : -1);
      velocidadPelotaY = baseVelocidadY * 3.5 * (random() > 0.5 ? 1 : -1);
      break;
  }
}

let mensajeFinalMostrado = false;

function terminarJuego(mensaje) {
  juegoActivo = false;
  mensajeFinal = mensaje;
  musicaFondo.stop();
  mensajeFinalMostrado = false;
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
 // Reproduce el sonido sólo una vez
 if (!mensajeFinalMostrado) {
  sonidoFinJuego.play();
  sonidoFinJuego.setVolume(0.5);
  mensajeFinalMostrado = true; // Marca el mensaje final como mostrado
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
    case "epico":
      return `🚀 ¡Increíble, ${nombreUsuario} 🚀\nHas dominado el nivel Épico.\n¡Eres una leyenda en el juego!`;
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
    case "epico":
      return `🔥 ¡Vaya, ${nombreUsuario} 🔥\nEl nivel Épico no es fácil.\nNo te rindas, ¡prueba otra vez y conquista el desafío!`;
  }
}
