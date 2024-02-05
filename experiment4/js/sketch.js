// sketch.js - To show diffrent visualization of the  
// Author: Reuben Chavez
// Date: 2/5/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const w = 640;
const h = 480;

let lineWeight = 1;
let video;
let POINTS = [];
const maxLines = 10000; //50 to 200000

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
    let canvas = createCanvas(w, h);
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
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
        POINTS.push(createRandomLine());
    }
}

function createRandomLine() {
    return {
        x: random(width),
        y: random(height),
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

}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}


function drawBackground() {
    video.loadPixels();
    tint(255, 1); // Adjust the transparency level
    image(video, 0, 0, 640, 480);
    filter(POSTERIZE, 20); // Apply posterize effect with 5 levels
    noTint();
}



function moveLines() {
    let mouseXPos = mouseX;
    let mouseYPos = mouseY;

    for (let i = 0; i < POINTS.length; i++) {
        let drawnPoint = POINTS[i];
        let index = floor(drawnPoint.x) + floor(drawnPoint.y) * width;

        let r = video.pixels[index * 4];
        let g = video.pixels[index * 4 + 1];
        let b = video.pixels[index * 4 + 2];

        stroke(r, g, b);
        strokeWeight(lineWeight);
        line(drawnPoint.x, drawnPoint.y, drawnPoint.x + random(-10, 10), drawnPoint.y + random(-10, 10));

        let angle = atan2(drawnPoint.y - mouseYPos, drawnPoint.x - mouseXPos);
        drawnPoint.x += cos(angle);
        drawnPoint.y += sin(angle);
    }
}

function ensureLinesWithinCanvas() {
    while (POINTS.length < maxLines) {
        POINTS.push(createRandomLine());
    }
    for (let i = POINTS.length - 1; i >= 0; i--) {
        let line = POINTS[i];
        if (line.x < 0 || line.x >= width || line.y < 0 || line.y >= height) {
            POINTS.splice(i, 1);
        }
    }
}
