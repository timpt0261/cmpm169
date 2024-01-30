// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const OFFSET = 20;
const NOISE_SCALE_MAX = 100;
const NOISE_SCALE_MIN = 0.001;

const NOISE_SCALE = 0.5;
const MIN_SIZE = 1;
const MAX_SIZE = 5;
const SHAPE_ROTATION = 0;

let nx, ny;

let colorPallet = [];
let x = 300;
let y = 300;
let rings = [];
let currentMode = "goldenSpiral";

// Globals
let myInstance;
let canvasContainer;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
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

   colorPallet = [
     color("#F23D4C"),
     color("#6387F2"),
     color("#F2D335"),
     color("#3DD9BC"),
     color("#F28066"),
   ];
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  clear();
  background(234);
  // call a method on the instance
  myInstance.myMethod();

  // Calculate mouse distance from the center
  nx = int(map(mouseX, 0, width, NOISE_SCALE_MIN, NOISE_SCALE_MAX));
  ny = int(map(mouseY, 0, height, NOISE_SCALE_MIN, NOISE_SCALE_MAX));

  if (currentMode === "randomWalk") {
    randomWalk();
  } else if (currentMode === "goldenSpiral") {
    goldenSpiral();
  } else if (currentMode === "randomRing") {
    randomRing();
  }

  drawRings();

}

function drawRings() {
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];

    // Draw and update existing rings
    drawDynamicShapeRing(
      ring.x,
      ring.y,
      ring.size,
      ring.numSegments,
      SHAPE_ROTATION,
      ring.color,
      ring.alpha
    );

    // Reduce the alpha of the ring over time
    ring.alpha -= deltaTime * 0.01;
    if (ring.alpha <= 0) {
      // Remove the ring from the array when alpha becomes 0
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
  var angleIncrement = TWO_PI / numSegments;
  noStroke();
  fill(shapeColor.levels[0], shapeColor.levels[1], shapeColor.levels[2], alpha);
  beginShape();
  for (var i = 0; i < numSegments; i++) {
    var angle = i * angleIncrement + rotationAngle;

    // Use noise to create irregular shapes
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
  strokeWeight(2);

  // Add the current point to the array
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

  // Draw the current point
  point(x, y);

  // Generate a random step
  let stepX = floor(random(-OFFSET, OFFSET));
  let stepY = floor(random(-OFFSET, OFFSET));

  // Update position
  x += stepX;
  y += stepY;

  // Constrain the position to stay within the canvas
  x = constrain(x, 0, width - 1);
  y = constrain(y, 0, height - 1);
}

function goldenSpiral() {
  stroke(0);
  strokeWeight(2);

  // Add the current point to the array
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

  // Draw the current point
  point(x, y);

  // Calculate the next point using the golden ratio with a larger scale
  let goldenRatio = 1.618;
  let angle = atan2(y - height / 2, x - width / 2);
  let radius = dist(x, y, width / 2, height / 2);
  let nextRadius = radius * goldenRatio * 0.617; // range (0.590 - 0.617)
  angle += radians(TWO_PI); // range (5 - 20)

  // Update position based on polar to Cartesian coordinates conversion
  x = width / 2 + nextRadius * cos(angle);
  y = height / 2 + nextRadius * sin(angle);

  // Constrain the position to stay within the canvas
  x = constrain(x, 0, width - 1);
  y = constrain(y, 0, height - 1);
}

function randomRing() {
  // Implement the logic for creating a ring based on a random point
  // Adjust x, y, rings, etc. accordingly
  stroke(0);
  strokeWeight(2);

  // Add the current point to the array
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

  // Draw the current point
  point(x, y);
}

