// sketch.js - To show different visualization
// Author: Reuben Chavez
// Date: 2/5/2024

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const w = 640;
const h = 480;

// Globals
let myInstance;
let canvasContainer;

let lineWeightSlider;
let lineCountSlider;
let video;
let SHAPES = [];

let maxLines = 10000;
let lineWeight = 1;

let currentMode = "circles";

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
    let canvas = createCanvas(w, h);
    canvas.parent("canvas-container");
    const UI_HEIGHT = 1430;

    // Slider for line weight
    lineWeightSlider = createSlider(1, 10, lineWeight, 1);
    lineWeightSlider.position(120, UI_HEIGHT);
    lineWeightSlider.style('width', '80px');

    // Slider for line count
    lineCountSlider = createSlider(1, 20000, maxLines, 1);
    lineCountSlider.position(20, UI_HEIGHT);
    lineCountSlider.style('width', '80px');

    // Buttons for different drawing modes
    let linesButton = createButton('Lines');
    linesButton.position(220, UI_HEIGHT);
    linesButton.mousePressed(() => currentMode = "lines");

    let squaresButton = createButton('Squares');
    squaresButton.position(280, UI_HEIGHT);
    squaresButton.mousePressed(() => currentMode = "squares");

    let circlesButton = createButton('Circles');
    circlesButton.position(340, UI_HEIGHT);
    circlesButton.mousePressed(() => currentMode = "circles");

    let trianglesButton = createButton('Triangles');
    trianglesButton.position(400, UI_HEIGHT);
    trianglesButton.mousePressed(() => currentMode = "triangles");

    let shapesButton = createButton('Shapes');
    shapesButton.position(460, UI_HEIGHT);
    shapesButton.mousePressed(() => currentMode = "shapes");

    // resize canvas if the page is resized
    $(window).resize(function () {
        console.log("Resizing...");
        resizeCanvas(w, h);
    });

    // create an instance of the class
    myInstance = new MyClass(VALUE1, VALUE2);

    var centerHorz = windowWidth / 2;
    var centerVert = windowHeight / 2;

    initializeVideoCapture();
    initializeLines();

}

function initializeVideoCapture() {
    video = createCapture(VIDEO);
    video.size(w, h);
    video.hide(); // Hide the original video element
}

function initializeLines() {
    for (let i = 0; i < maxLines; i++) {
        SHAPES.push(createRandomLine());
    }
}

function createRandomLine() {
    return {
        x: random(w),
        y: random(h),
        color: color(random(255), random(255), random(255))
    };
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    clear();
    background(100);
    // call a method on the instance
    myInstance.myMethod();

    // Put drawings here
    var centerHorz = canvasContainer.width() / 2 - 125;
    var centerVert = canvasContainer.height() / 2 - 125;

    drawBackground();
    moveLines();
    ensureLinesWithinCanvas();

    // Update lineWeight and maxLines based on sliders
    lineWeight = lineWeightSlider.value();
    maxLines = lineCountSlider.value();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function drawBackground() {
    video.loadPixels();
    tint(255, 1); // Adjust the transparency level
    image(video, 0, 0, 640, 480);
    filter(POSTERIZE, 20); // Apply posterize effect with 20 levels
    noTint();
}

function moveLines() {
    let mouseXPos = mouseX;
    let mouseYPos = mouseY;

    for (let i = 0; i < SHAPES.length; i++) {
        let drawnPoint = SHAPES[i];
        let index = floor(drawnPoint.x) + floor(drawnPoint.y) * width;

        let r = video.pixels[index * 4];
        let g = video.pixels[index * 4 + 1];
        let b = video.pixels[index * 4 + 2];

        stroke(r, g, b);
        fill(r, g, b);
        drawShapes(drawnPoint);

        let angle = atan2(drawnPoint.y - mouseYPos, drawnPoint.x - mouseXPos);
        drawnPoint.x += cos(angle);
        drawnPoint.y += sin(angle);
    }
}

function drawShapes(drawnPoint) {
    switch (currentMode) {
        case "lines":
            strokeWeight(lineWeight);
            line(drawnPoint.x, drawnPoint.y, drawnPoint.x + random(-10, 10), drawnPoint.y + random(-10, 10));
            break;
        case "squares":
            square(drawnPoint.x, drawnPoint.y, random(lineWeight))
            break;
        case "circles":
            circle(drawnPoint.x, drawnPoint.y, random(lineWeight));
            break;
        case "triangles":
            let x1 = drawnPoint.x + random(-10, 10);
            let y1 = drawnPoint.y + random(-10, 10);
            let x2 = drawnPoint.x + random(-10, 10);
            let y2 = drawnPoint.y + random(-10, 10);
            triangle(drawnPoint.x, drawnPoint.y, x1, y1, x2, y2);
            break;
        case "shapes":
            // Generate random shapes (e.g., polygons)
            // You can add your own implementation here
            let sides = floor(random(3, 7)); // Random number of sides between 3 and 6
            let angleIncrement = TWO_PI / sides;
            beginShape();
            for (let i = 0; i < sides; i++) {
                let angle = i * angleIncrement;
                let radius = random(lineWeight * 2, lineWeight * 5);
                let x = drawnPoint.x + cos(angle) * radius;
                let y = drawnPoint.y + sin(angle) * radius;
                vertex(x, y);
            }
            endShape(CLOSE);
            break;
        default:
            strokeWeight(lineWeight);
            line(drawnPoint.x, drawnPoint.y, drawnPoint.x + random(-10, 10), drawnPoint.y + random(-10, 10));
            break;
    }
}


function ensureLinesWithinCanvas() {
    while (SHAPES.length < maxLines) {
        SHAPES.push(createRandomLine());
    }
    for (let i = SHAPES.length - 1; i >= 0; i--) {
        let line = SHAPES[i];
        if (line.x < 0 || line.x >= width || line.y < 0 || line.y >= height) {
            SHAPES.splice(i, 1);
        }
    }
}
