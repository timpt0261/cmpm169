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
let font, style, textColor, size;

let head;
let start_X;
let start_Y;
let stepCounter = 0;
let extensionRate = 10; // Increase rate of extension
let currentCharacter;

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

  characterGrid = new CharacterGrid(60, 40); // Pass width and height as arguments, assuming 10x10 characters

  // Randomly initialize text style
  font = getRandomFont();
  style = getRandomStyle();
  textColor = getRandomColor();
  size = getRandomSize();

  start_X = random(width - 1);
  start_Y = random(height - 1);
  currentCharacter = getRandomCharacter(); // Initialize with a random character

  head = new Snake(start_X, start_Y);

  snake = [width * height];
}

function leaveTrail() {
  // Set character on the grid at walker's current position
  let gridX = floor(head.x / characterGrid.textSize);
  let gridY = floor(head.y / characterGrid.textSize);
  characterGrid.setCharacter(currentCharacter, gridX, gridY);

  // Fade out characters on the grid over time
  for (let y = 0; y < characterGrid.height; y++) {
    for (let x = 0; x < characterGrid.width; x++) {
      if (characterGrid.getCharacter(x, y) !== " ") {
        let col = characterGrid.textColor;
        let newAlpha = alpha(col) - 1; // Decrease alpha value
        if (newAlpha < 0) newAlpha = 0; // Ensure alpha doesn't go below 0
        let newColor = color(red(col), green(col), blue(col), newAlpha);
        characterGrid.setTextColor(newColor);
        characterGrid.setCharacter(" ", x, y); // Clear character
      }
    }
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(220);
  // call a method on the instance
  myInstance.myMethod();

  // Put drawings here
  var centerHorz = canvasContainer.width() / 2 - 125;
  var centerVert = canvasContainer.height() / 2 - 125;

  clear();
  background("orange");
  head.step();
  head.display();
  leaveTrail();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}

class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    fill(255);
    //ellipse(this.x, this.y, 10, 10); // Draw a circle at current position
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

function getRandomStyle() {
  let styles = [NORMAL, ITALIC, BOLD];
  return random(styles);
}

function getRandomColor() {
  return color(random(255), random(255), random(255));
}

function getRandomSize() {
  return floor(random(20, 100));
}

function getRandomCharacter() {
  return String.fromCharCode(floor(random(33, 126)));
}

class CharacterGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.textFont = "Arial";
    this.textStyle = NORMAL;
    this.textSize = 16;
    this.textColor = "black";

    // Initialize the grid with empty characters
    for (let y = 0; y < this.height; y++) {
      let row = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          character: " ",
          visited: false,
        });
      }
      this.grid.push(row);
    }
  }

  // Get the character at a specific position
  getCharacter(x, y) {
    return this.grid[y][x].character;
  }

  // Set the character at a specific position
  setCharacter(character, x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].character = character;
      if (character !== " ") {
        // Only draw if character is not empty
        textFont(this.textFont);
        textStyle(this.textStyle);
        textSize(this.textSize);
        fill(this.textColor);
        text(character, x * this.textSize, y * this.textSize);
      }
    }
  }

  // Clear the character at a specific position
  clearCharacter(x, y) {
    this.setCharacter(" ", x, y); // Set character to empty space to clear it
  }

  // Clear the entire grid
  clearGrid() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.clearCharacter(x, y);
      }
    }
  }

  // Set text font
  setTextFont(font) {
    this.textFont = font;
  }

  // Set text style
  setTextStyle(style) {
    this.textStyle = style;
  }

  // Set text size
  setTextSize(size) {
    this.textSize = size;
  }

  // Set text color
  setTextColor(color) {
    this.textColor = color;
  }
}
