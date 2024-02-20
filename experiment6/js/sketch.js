// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let characterGrid;
let fontName, snakeStyle, snakeColor, snakeSizeVal;

let head;
let start_X;
let start_Y;
let stepCounter = 0;
let extensionRate = 1; // Increase rate of extension
let currentCharacter;

let snakeSegments = []; // Array to hold snake segments

let updateInterval; // Interval for updating snake body
let removeInterval; 

// Globals
let myInstance;
let canvasContainer;

let snake;

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

  // Randomly initialize text style
  fontName = getRandomFont();

  snakeStyle = getRandomTextStyle();
  snakeColor = getRandomColor();
  snakeSizeVal = getRandomTextSize();

  start_X = random(width - 1);
  start_Y = random(height - 1);
  currentCharacter = getRandomCharacter(); // Initialize with a random character
  head = new Snake(start_X, start_Y, currentCharacter);

  // Add head as the first segment of the snake
  snakeSegments.push(head);

  updateInterval = setInterval(addSegment, 1500); // Add a segment every 3 seconds

  
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background('orange');
  // call a method on the instance
  myInstance.myMethod();

  // Move and display snake
  head.step();
  head.display();

  // Update snake segments positions
  for (let i = 1; i < snakeSegments.length; i++) {
    snakeSegments[i].step();
    snakeSegments[i].display();
  }
}

// Add a new segment to the snake
function addSegment() {
  let lastSegment = snakeSegments[snakeSegments.length - 1];
  let newSegment = new Snake(
    lastSegment.x - 1,
    lastSegment.y - 1,
    getRandomCharacter(),
    fontName,
    snakeStyle,
    snakeColor,
    random(20, 100)
  );
  snakeSegments.push(newSegment);
}

class Snake {
  constructor(x, y, character, font, style, color, size) {
    this.x = x;
    this.y = y;
    this.character = character;
    this.font = font;
    this.style = style;
    this.color = color;
    this.size = size;
    this.stepSize = 10;
    this.direction = floor(random(4)); // 0: up, 1: right, 2: down, 3: left
    this.changeDirectionTime = millis() + random(500, 2000); // Change direction after random time
  }

  step() {
    if (millis() > this.changeDirectionTime) {
      this.direction = floor(random(4)); // Randomly change direction
      this.changeDirectionTime = millis() + random(500, 2000); // Set next change direction time
    }

    if (this.direction === 0) {
      this.y -= this.stepSize;
    } else if (this.direction === 1) {
      this.x += this.stepSize;
    } else if (this.direction === 2) {
      this.y += this.stepSize;
    } else if (this.direction === 3) {
      this.x -= this.stepSize;
    }

    // Wrap around canvas edges
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;
  }

  display() {
    // textFont(this.font);
    // textStyle(this.style);
    textSize(this.size);
    fill('black');
    text(this.character, this.x, this.y);
  }
}

function getRandomFont() {
  let fonts = [
    "Arial",
    "Verdana",
    "Helvetica",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Courier",
  ];
  return random(fonts);
}

function getRandomTextStyle() {
  let styles = [NORMAL, ITALIC, BOLD];
  return random(styles);
}

function getRandomColor() {
  return String( color(random(255), random(255), random(255)));
}

function getRandomTextSize() {
  return floor(random(20, 100));
}

function getRandomCharacter() {
  return String.fromCharCode(floor(random(33, 126)));
}
