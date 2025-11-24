//======================= 
// TP FINAL PARTE 2 - Persefone y las flores
//Abril Morell comision 3
//https://youtu.be/4FnFWzojHug
// =======================


let gridSize = 32;


let imgPersefone;
let imgHades;
let imgSombra;
let imgFlor;
let musicaFondo;
let musicaIniciada = false;

let juego;


function preload() {
  imgPersefone = loadImage("assets/personaje.persefone.png");
  imgHades = loadImage("assets/enemigo.hades.png");
  imgSombra = loadImage("assets/enemigo.sombra.png");
  imgFlor = loadImage("assets/objeto.flores.png");
  musicaFondo = loadSound("assets/musicaFondo.mp3");
}


function setup() {
  createCanvas(640, 480);
  juego = new Juego();
  juego.iniciar();
}


function draw() {
  juego.dibujar();
}

function keyPressed() {
  juego.tecla(keyCode);
}

function mousePressed() {
  if (!musicaIniciada) {
    musicaFondo.loop();
    musicaIniciada = true;
  }
}


class Juego {
  constructor() {
    this.cols = width / gridSize;
    this.rows = height / gridSize;

    this.mapData = [];
    this.persefone = null;
    this.flowers = [];
    this.enemies = [];

    this.numFlowers = 10;
    this.numEnemies = 3;

    this.score = 0;
    this.gameState = "playing";

    this.tiempoMax = 30;
    this.tiempoInicio = 0;

    this.botonReiniciar = null;
  }

  iniciar() {
    this.generarMapa();

    this.persefone = new Player(1, 1);
    this.flowers = [];
    this.enemies = [];
    this.score = 0;
    this.gameState = "playing";
    this.tiempoInicio = millis();

   
    for (let i = 0; i < this.numFlowers; i++) {
      let x, y;
      do {
        x = floor(random(this.cols));
        y = floor(random(this.rows));
      } while (this.mapData[y][x] === 1 || (x === 1 && y === 1));

      this.flowers.push(new Flower(x, y));
    }

    
    for (let i = 0; i < this.numEnemies; i++) {
      let x, y;
      do {
        x = floor(random(this.cols));
        y = floor(random(this.rows));
      } while (this.mapData[y][x] === 1 || (x === 1 && y === 1));

      let tipo = random() < 0.5 ? "hades" : "sombra";
      this.enemies.push(new Enemy(x, y, tipo));
    }

    if (this.botonReiniciar) {
      this.botonReiniciar.remove();
      this.botonReiniciar = null;
    }
  }

  dibujar() {
    background(35, 20, 74);
    this.dibujarMapa();

    let tiempoTranscurrido = (millis() - this.tiempoInicio) / 1000;
    let tiempoRestante = max(0, this.tiempoMax - tiempoTranscurrido);

    fill(255);
    textSize(18);
    text(`Tiempo: ${tiempoRestante.toFixed(1)}`, width - 150, 20);

    if (tiempoRestante <= 0 && this.gameState === "playing") {
      this.gameState = "lose";
      this.mostrarBoton();
    }

    if (this.gameState === "playing") {
      
      
      for (let f of this.flowers) f.show();

      
      for (let e of this.enemies) {
        e.update(this.mapData);
        e.show();
        if (dist(e.x, e.y, this.persefone.x, this.persefone.y) < 1) {
          this.persefoneAtrapada();
        }
      }

      this.persefone.show();

     
      for (let i = this.flowers.length - 1; i >= 0; i--) {
        if (dist(this.persefone.x, this.persefone.y, this.flowers[i].x, this.flowers[i].y) < 1) {
          this.flowers.splice(i, 1);
          this.score++;
        }
      }

      fill(255);
      textSize(18);
      text(`Flores: ${this.score}/${this.numFlowers}`, 10, 20);

      if (this.flowers.length === 0) {
        this.gameState = "win";
        this.mostrarBoton();
      }

    } else if (this.gameState === "win") {
      fill(0, 200, 0);
      textSize(28);
      textAlign(CENTER);
      text("¡Ganaste! Persefone volvió a la superficie 🌸", width / 2, height / 2 - 30);

    } else if (this.gameState === "lose") {
      fill(200, 0, 0);
      textSize(28);
      textAlign(CENTER);
      text("El tiempo se agotó...", width / 2, height / 2 - 30);
    }
  }

  persefoneAtrapada() {
    this.persefone.x = 1;
    this.persefone.y = 1;

    this.score = 0;
    this.flowers = [];

    for (let i = 0; i < this.numFlowers; i++) {
      let x, y;
      do {
        x = floor(random(this.cols));
        y = floor(random(this.rows));
      } while (this.mapData[y][x] === 1 || (x === 1 && y === 1));

      this.flowers.push(new Flower(x, y));
    }
  }

  mostrarBoton() {
    if (!this.botonReiniciar) {
      this.botonReiniciar = createButton("Reiniciar");
      this.botonReiniciar.position(width / 2 - 50, height / 2 + 20);
      this.botonReiniciar.mousePressed(() => {
        this.iniciar();
      });
    }
  }

  tecla(key) {
    if (this.gameState === "playing") {
      this.persefone.move(key, this.mapData);
    }
  }

  generarMapa() {
    this.mapData = [];
    for (let y = 0; y < this.rows; y++) {
      let row = [];
      for (let x = 0; x < this.cols; x++) {
        if (x === 0 || y === 0 || x === this.cols - 1 || y === this.rows - 1) {
          row.push(1);
        } else {
          row.push(random() < 0.2 ? 1 : 0);
        }
      }
      this.mapData.push(row);
    }
  }

  dibujarMapa() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.mapData[y][x] === 1) {
          fill(61, 23, 179);
          rect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }
    }
  }
}


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(key, map) {
    let newX = this.x;
    let newY = this.y;

    if (key === UP_ARROW) newY--;
    else if (key === DOWN_ARROW) newY++;
    else if (key === LEFT_ARROW) newX--;
    else if (key === RIGHT_ARROW) newX++;

    if (map[newY] && map[newY][newX] === 0) {
      this.x = newX;
      this.y = newY;
    }
  }

  show() {
    image(imgPersefone, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}

class Enemy {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.dir = random([0, 1, 2, 3]);
    this.moveTimer = 0;
  }

  update(map) {
    this.moveTimer++;
    if (this.moveTimer % 10 === 0) {
      this.move(map);
    }
  }

  move(map) {
    if (random() < 0.1) {
      this.dir = random([0, 1, 2, 3]);
    }

    let newX = this.x;
    let newY = this.y;

    if (this.dir === 0) newY--;
    else if (this.dir === 1) newX++;
    else if (this.dir === 2) newY++;
    else if (this.dir === 3) newX--;

    if (map[newY] && map[newY][newX] === 0) {
      this.x = newX;
      this.y = newY;
    } else {
      this.dir = random([0, 1, 2, 3]);
    }
  }

  show() {
    let sprite = this.tipo === "hades" ? imgHades : imgSombra;
    image(sprite, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    image(imgFlor, this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}
