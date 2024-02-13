// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let cols, rows;
const scl = 20;
const w = 1500;
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
let smokeTexture;

const MAX_PARTICLE = 1000;
let particles = []; // Array to store fog particles

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
  towerTexture = loadImage("../img/experiment_5/dark-stone-texture.png");
  waveTexture = loadImage("../img/experiment_5/WaveTexture.png");
  smokeTexture = loadImage("../img/experiment_5/smoke-texture.jpg");
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


  cols = w / scl;
  rows = h / scl;
  waveColor = color(0, 0, 255); // Default color: blue
  initializeTerrain();

  initializeParticles();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(25);
  // call a method on the instance
  myInstance.myMethod();

  // Put drawings here

  // texture(skyTexture);
  // plane(canvasContainer.width(), canvasContainer.height());

  updateWaves();

  translate(-width / 2, 50); // Move towards left
  rotateX(PI / 3);

  dirX = (mouseX / width - 0.5) * 100;
  dirY = (mouseY / height - 0.5) * 100;
  directionalLight(250, 250, 250, -dirX, -dirY, -1); // Update directional light direction
  // Set fog color with low transparency
  renderFog();
  renderWaves();

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

function updateWaves() {
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

function renderWaves() {
  // Apply wave texture
  texture(waveTexture);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      let textureX = map(x, 0, cols, 0, waveTexture.width);
      let textureY = map(y, 0, rows, 0, waveTexture.height);
      vertex(x * scl, y * scl, terrain[x][y], textureX, textureY);
      textureX = map(x, 0, cols, 0, waveTexture.width);
      textureY = map(y + 1, 0, rows, 0, waveTexture.height);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1], textureX, textureY);
    }
    endShape();
  }
}


function renderFog() {
  fill(100, 100, 100, 50);

  // Render fog squares
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols; x++) {
      let posX = x * scl;
      let posY = y * scl;
      rect(posX, posY, scl, scl);
    }
  }
}

function drawTower() {
  // Tower
  rotateX(PI / 2); // Rotate to make tower vertical
  let bobHeight = map(sin(frameCount * 0.05), -1, 1, 40, 305); // Bobbing motion
  let rotationsAngle = map(sin(frameCount * 0.01), -1, 1, 0, 20);
  for (let i = 0; i < 6; i++) {
    push();
    translate(width / 2, -i * 50 + height / 2 + bobHeight - 340, 1000);
    rotateY(rotationsAngle);
    let boxSize = map(i, 0, 5, 150, 50); // Gradually increase size towards top
    texture(towerTexture);
    box(boxSize, 200, boxSize);
    pop();
  }
}

function initializeParticles() {
  for (let i = 0; i < MAX_PARTICLE; i++) { // Adjust the number of particles as needed
    let particle = new Particle(random(width), random(height), random(-1000, 1000));
    particles.push(particle);
  }
}

function renderFog() {
  for (let particle of particles) {
    particle.update(); // Update particle position
    if (!particle.isOnScreen()) { // Check if particle is off-screen
      particle.resetPosition(); // Reset particle position
    }
    particle.display(); // Display particle
  }
}

class Particle {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.velocity = p5.Vector.random3D().mult(random(0.1, 2)); // Random initial velocity
    this.size = random(30, 50); // Random size
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    texture(smokeTexture);
    noStroke();
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateX(PI / 2);
    plane(this.size);
    pop();
  }

  isOnScreen() {
    return this.position.x > 0 && this.position.x < width &&
      this.position.y > 0 && this.position.y < height &&
      this.position.z > -1000 && this.position.z < 1000;
  }

  resetPosition() {
    this.position.x = random(width);
    this.position.y = random(height);
    this.position.z = random(-1000, 1000);
  }
}