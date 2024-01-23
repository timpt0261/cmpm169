// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

const BTN_X = 30;
const BTN_Y = 1200;

var MAX_SEGMENTS = 30;
var MIN_SEGMENTS = 3;

var MAX_SIZE = 200;
var MIN_SIZE = 40;

var OFFSET = 15;
var SPEED = 0;

var r_slider, c_slider, step_slider;
var ROWS = 250, COLUMS = 250 ,STEP = 50;


var PEN_WEIGHT = .5
var SHAPE_ROTATION;
var COLOR_1, COLOR_2;


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
    // // create an instance of the class
    // myInstance = new MyClass(VALUE1, VALUE2);

    var centerHorz = windowWidth / 2;
    var centerVert = windowHeight / 2;

    COLOR_1 = randomColor();
    COLOR_2 = inverseColor(COLOR_1);
    SHAPE_ROTATION = 90;

    let RAND_COL_BTN = createButton("Color");
    RAND_COL_BTN.position(40, 1700)
    RAND_COL_BTN.mousePressed(() => {
        COLOR_1 = randomColor();
        COLOR_2 = inverseColor(COLOR_1);

    });

    let START_ROT_BTN = createButton("Start Rotation");
    START_ROT_BTN.position(40, 1750);

    START_ROT_BTN.mousePressed(() => {
        SPEED = SPEED == 0 ? 0.0001 : 0;
    });

    let ROTATION_BTN = createButton("Change Rotation")
    ROTATION_BTN.position(40, 1800)


    ROTATION_BTN.mousePressed(() => {
        if (SPEED == 0) return;
        SPEED *= -1;
    });

    r_slider = createSlider(10, 250, 250);
    r_slider.position(40, 1860)
    r_slider.input(()=>{
        ROWS = r_slider.value();
    });

    c_slider = createSlider(10, 250, 250);
    c_slider.position(40, 1875)
    c_slider.input(()=>{
        COLUMS = c_slider.value();
    });

    step_slider = createSlider(25, 200, 50);
    step_slider.position(40, 1890);

    step_slider.input(()=>{
        let st = step_slider.value();
        STEP = st;
    });



}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    clear();
    background(COLOR_2)
    strokeWeight(PEN_WEIGHT);

    // Calculate mouse distance from the center
    var distance = dist(mouseX, mouseY, width / 2, height / 2);

    // Inverse the mapping so that more segments are drawn as you get closer to the center
    var numSegments = int(map(distance, 0, width / 2, MAX_SEGMENTS, MIN_SEGMENTS));

    // Ensure the number of sides stays within the specified range
    numSegments = constrain(numSegments, MIN_SEGMENTS, MAX_SEGMENTS);
    // Draw the dynamic shapes with dynamic sides and store vertices

    
    for (let i = -ROWS; i < ROWS; i += STEP) {
        for (let j = -COLUMS; j < COLUMS; j += STEP) {
            drawShapeRing(numSegments, width / 2 + i, height / 2 + j);
        }

    }

    let DELTA_R = SPEED * deltaTime;
    SHAPE_ROTATION += DELTA_R;

}

function drawShapeRing(numSegments, x, y) {
    for (let i = MAX_SIZE; i > MIN_SIZE; i -= OFFSET) {
        var diff = (i - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);
        let SHAPE_COLOR = lerpColor(COLOR_1, COLOR_2, diff);
        drawDynamicShape(x, y, i, numSegments, SHAPE_ROTATION, SHAPE_COLOR);
    }
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function drawDynamicShape(x, y, radius, numSegments, rotationAngle, shapeColor) {
    var angleIncrement = TWO_PI / numSegments;
    var vertices = [];

    fill(shapeColor)
    beginShape();
    for (var i = 0; i < numSegments; i++) {
        var angle = i * angleIncrement + rotationAngle;
        var xPos = x + cos(angle) * radius;
        var yPos = y + sin(angle) * radius;
        vertex(xPos, yPos);
        vertices.push(createVector(xPos, yPos));
    }
    endShape(CLOSE);
    return vertices;
}


function randomColor() {
    return color(random(256), random(256), random(256));
}

function inverseColor(I_COLOR) {
    var r = red(I_COLOR);
    var g = green(I_COLOR);
    var b = blue(I_COLOR);
    return color(255 - r, 255 - g, 255 - b);
}