// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let cols, rows;
const scl = 20;
const w = 1200;
const h = 800;

let flying = 0;
let terrain = [];
let waveColor;

// Globals
let myInstance;
let canvasContainer;

// Textures
let towerTexture;
let waveTexture;
let skyTexture;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function preload() {
  skyTexture = loadImage("../img/experiment_5/SkyTexture.png");
  towerTexture = loadImage("../img/experiment_5/TowerTexture/dark_stone.png");
  waveTexture = loadImage("../img/experiment_5/WaveTexture.png");
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(
    canvasContainer.width(),
    canvasContainer.height(),
    WEBGL
  );
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function () {
    console.log("Resizing...");
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  // create an instance of the class
  myInstance = new MyClass(VALUE1, VALUE2);

  var centerHorz = windowWidth / 2;
  var centerVert = windowHeight / 2;

  cols = w / scl;
  rows = h / scl;
  waveColor = color(0, 0, 255); // Default color: blue
  initializeTerrain();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(240);
  // call a method on the instance
  myInstance.myMethod();

  // Put drawings here
  var centerHorz = canvasContainer.width() / 2 - 125;
  var centerVert = canvasContainer.height() / 2 - 125;

  texture(skyTexture);
  plane(canvasContainer.width(), canvasContainer.height());

  updateTerrain();
  //drawSpheres();

  translate(-width / 2, 50); // Move towards left
  rotateX(PI / 3);

  renderTerrain();

  drawTower();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}

function initializeTerrain() {
  terrain = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => 0)
  );
}

function updateTerrain() {
  flying -= 0.001 * deltaTime;
  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  }
}

function renderTerrain() {
  texture(waveTexture); // Apply wave texture

  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let textureX = map(x, 0, cols, 0, waveTexture.width); // Map x to texture coordinates
      let textureY = map(y, 0, rows, 0, waveTexture.height); // Map y to texture coordinates
      vertex(x * scl, y * scl, terrain[x][y], textureX, textureY); // Pass texture coordinates to vertex
      textureX = map(x, 0, cols, 0, waveTexture.width); // Map x to texture coordinates for next vertex
      textureY = map(y + 1, 0, rows, 0, waveTexture.height); // Map y+1 to texture coordinates for next vertex
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1], textureX, textureY); // Pass texture coordinates to next vertex
    }
    endShape();
  }
}

function drawTower() {
  // Tower
  rotateX(PI / 2); // Rotate to make tower vertical
  for (let i = 0; i < 6; i++) {
    push();
    translate(width / 2, -i * 50 + height / 2, 20);
    let boxSize = map(i, 0, 5, 150, 50); // Gradually increase size towards top
    texture(towerTexture);
    box(boxSize, 50, boxSize);
    pop();
  }
}
