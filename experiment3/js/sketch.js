// Constants - User-servicable parts
const VALUE1 = 1;
const VALUE2 = 2;

const OFFSET = 20;
const NOISE_SCALE_MAX = 100;
const NOISE_SCALE_MIN = 0.001;

const NOISE_SCALE = 0.5;
let MIN_SIZE = 1;
let MAX_SIZE = 300;
const SHAPE_ROTATION = 0;

const GOLDEN_RATIO = 1.618;
let SPIRAL_SCALE = 0.617;
const MIN_SPIRAL_RADIUS = 30.0;
const RESET_SPIRAL_RADIUS = 300;

const RING_DRAW_SIZE = 2;

// Other Constants
const RING_DRAW_STEP = 10;

let nx, ny;
let colorPallet = [];
let x = 300;
let y = 300;
let rings = [];
let currentMode = "randomWalk";

let myInstance;
let canvasContainer;

//sliders
let minSizeSlider, maxSizeSlider, spiralScaleSlider;

//buttons
let randomWalkButton, goldenSpiralButton, randomPlacmentButton;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });

  myInstance = new MyClass(VALUE1, VALUE2);

  colorPallet = [
    color("#F23D4C"),
    color("#6387F2"),
    color("#F2D335"),
    color("#3DD9BC"),
    color("#F28066"),
  ];

  randomWalkButton = createButton("Random Walk");
  const UI_HEIGHT = 1570;
  randomWalkButton.position(120, UI_HEIGHT);
  randomWalkButton.mousePressed(() => setMode("randomWalk"));

  goldenSpiralButton = createButton("Golden Spiral");
  goldenSpiralButton.position(240, UI_HEIGHT);
  goldenSpiralButton.mousePressed(() => setMode("goldenSpiral"));

  randomPlacmentButton = createButton("Random Placment");
  randomPlacmentButton.position(360, UI_HEIGHT);
  randomPlacmentButton.mousePressed(() => setMode("randomPlacment"));

  // Create sliders
  minSizeSlider = createSlider(1, 300, MIN_SIZE);
  minSizeSlider.position(500, UI_HEIGHT);

  maxSizeSlider = createSlider(1, 300, MAX_SIZE);
  maxSizeSlider.position(650, UI_HEIGHT);

  spiralScaleSlider = createSlider(0.59, 0.617, SPIRAL_SCALE, 0.001);
  spiralScaleSlider.position(800,UI_HEIGHT);
}

function draw() {
  clear();
  background(234);
  myInstance.myMethod();

    MIN_SIZE = minSizeSlider.value();
    MAX_SIZE = maxSizeSlider.value();
    SPIRAL_SCALE = spiralScaleSlider.value();

  nx = int(map(mouseX, 0, width, NOISE_SCALE_MIN, NOISE_SCALE_MAX));
  ny = int(map(mouseY, 0, height, NOISE_SCALE_MIN, NOISE_SCALE_MAX));

  if (currentMode === "randomWalk") {
    randomWalk();
  } else if (currentMode === "goldenSpiral") {
    goldenSpiral();
  } else if (currentMode === "randomPlacment") {
    randomPlacment();
  }

  drawRings();
}

function setMode(mode) {
  currentMode = mode;
  rings = []; // Clear existing rings when switching mode
}


function drawRings() {
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];

    drawDynamicShapeRing(
      ring.x,
      ring.y,
      ring.size,
      ring.numSegments,
      SHAPE_ROTATION,
      ring.color,
      ring.alpha
    );

    ring.alpha -= deltaTime * 0.1;
    if (ring.alpha <= 0) {
      rings.splice(i, 1);
    }
  }
}

function drawDynamicShapeRing(
  x,
  y,
  size,
  numSegments,
  rotationAngle,
  shapeColor,
  alpha
) {
  const alphaReduction = deltaTime * 0.1;
  var angleIncrement = TWO_PI / numSegments;
  noStroke();
  fill(shapeColor.levels[0], shapeColor.levels[1], shapeColor.levels[2], alpha);
  beginShape();
  for (var i = 0; i < numSegments; i++) {
    var angle = i * angleIncrement + rotationAngle;
    var noiseFactor = map(
      noise(x * nx, y * ny, i * NOISE_SCALE),
      0,
      1,
      0.5,
      1.5
    );
    var xPos = x + cos(angle) * size * noiseFactor;
    var yPos = y + sin(angle) * size * noiseFactor;
    vertex(xPos, yPos);
  }
  endShape(CLOSE);
}

function randomWalk() {
  stroke(0);
  strokeWeight(RING_DRAW_SIZE);

  let ringSize = random(MIN_SIZE, MAX_SIZE);
  let ringColor = random(colorPallet);
  rings.push({
    x: x,
    y: y,
    size: ringSize,
    numSegments: floor(random(10, 30)),
    color: ringColor,
    alpha: 255,
  });

  point(x, y);

  let stepX = floor(random(-OFFSET, OFFSET));
  let stepY = floor(random(-OFFSET, OFFSET));

  x += stepX * RING_DRAW_STEP;
  y += stepY * RING_DRAW_STEP;

  x = constrain(x, 0, width - 1);
  y = constrain(y, 0, height - 1);
}

function goldenSpiral() {
  stroke(0);
  strokeWeight(RING_DRAW_SIZE);

  let ringSize = random(MIN_SIZE, MAX_SIZE);
  let ringColor = random(colorPallet);
  rings.push({
    x: x,
    y: y,
    size: ringSize,
    numSegments: floor(random(10, 30)),
    color: ringColor,
    alpha: 255,
  });

  point(x, y);

  let angle = atan2(y - height / 2, x - width / 2);
  let radius = dist(x, y, width / 2, height / 2);
  let nextRadius = radius * GOLDEN_RATIO * SPIRAL_SCALE;

  angle += radians(TWO_PI);

  if (nextRadius < MIN_SPIRAL_RADIUS) {
    nextRadius = RESET_SPIRAL_RADIUS;
  }

  x = width / 2 + nextRadius * cos(angle);
  y = height / 2 + nextRadius * sin(angle);

  x = constrain(x, 0, width - 1);
  y = constrain(y, 0, height - 1);
}

function randomPlacment() {
  stroke(0);
  strokeWeight(RING_DRAW_SIZE);

  let ringSize = random(MIN_SIZE, MAX_SIZE);
  let ringColor = random(colorPallet);
  rings.push({
    x: x,
    y: y,
    size: ringSize,
    numSegments: floor(random(10, 30)),
    color: ringColor,
    alpha: 255,
  });

  x = random(0, width-1);
  y = random(0, height-1);



  point(x, y);
}
