// Abril Morell comision 3   https://youtu.be/sKswJUXy0aA



let referencia;

const cols = 8;         
const blockSize = 50;   

let rows = 8;           
let offset = 0;         
let desplazamientoDerecha = true;
let color1;
let color2;

function preload() {
  
  referencia = loadImage("referencia.jpg");
}

function setup() {
  createCanvas(800, 400);
  noStroke();
  color1 = color(0);
  color2 = color(255);
}

function draw() {
  background(255);

  
  image(referencia, 0, 0, 400, 400);

  
  rows = height / blockSize;

  
  offset = map(mouseX, 0, width, -blockSize / 2, blockSize / 2);

  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if ((x + y) % 2 === 0) {
        fill(color1);
      } else {
        fill(color2);
      }

      let dx = (y % 2 === 0) ? offset : -offset;
      let posX = x * blockSize + dx + 400 + (400 - cols * blockSize) / 2;
      let posY = y * blockSize;

      push();
      rect(posX, posY, blockSize, blockSize);
      pop();
    }
  }
}

function keyPressed() {
  if (key === 'r') {
    resetAll();
  } else if (key === 'c') {
    color1 = color(random(255), random(255), random(255));
    color2 = color(random(255), random(255), random(255));
  }
}

function mousePressed() {
  desplazamientoDerecha = !desplazamientoDerecha;
  offset += desplazamientoDerecha ? 5 : -5;
}

function resetAll() {
  offset = 0;
  color1 = color(0);
  color2 = color(255);
}
