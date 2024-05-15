// function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
//     ctx.beginPath()
//     ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
//     if (fill) {
//         ctx.fillStyle = fill
//         ctx.fill()
//     }
//     if (stroke) {
//         ctx.lineWidth = strokeWidth
//         ctx.strokeStyle = stroke
//         ctx.stroke()
//     }
// }

const canvas = document.getElementById("boundary");
const ctx = canvas.getContext("2d");

// Set canvas width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up image and boundary variables
const image = new Image();
image.src = "./assets/eyecloseup_pupil_sclera.png";
image.id = "pupil_sclera";

const eyeReflect = new Image();
eyeReflect.src = "./assets/eyecloseup_pupil_reflect_side.png";
eyeReflect.id = "reflect";

const boundaryWidth = 250 / 1.2;
const boundaryHeight = 200 / 2.4;
let boundaryX = canvas.width / 2 - boundaryWidth / 2;
let boundaryY = canvas.height / 2 - boundaryHeight / 2;

let topOffset = 0;
canvas.style.top = topOffset + "px";

// Calculate center of boundary
let boundaryCenterX;
let boundaryCenterY;

// Set up variables for image position
let imageX = boundaryCenterX;
let imageY = boundaryCenterY;

let reflectX = boundaryCenterX + 30 + 10;
let reflectY = boundaryCenterY - 30 - 7;

let targetImageX = imageX;
let targetImageY = imageY;
let targetReflectX = reflectX;
let targetReflectY = reflectY;

const lerpFactor = 0.02; // Adjust this value to control the smoothness

function lerp(start, end, t) {
    return start + t * (end - start);
}

// Add event listener to track mouse position
window.scrollTo({top: 400, left: 30, behavior: 'smooth'});
canvas.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX - boundaryWidth * 1.5;
    let mouseY = e.clientY + boundaryHeight;

    // Calculate distance between mouse and boundary center
    const distanceX = mouseX - boundaryCenterX;
    const distanceY = mouseY - boundaryCenterY;
    const distanceFromCenter = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Check if mouse is inside boundary
    if (
        (distanceX ** 2 / (boundaryWidth / 2) ** 2 +
        distanceY ** 2 / (boundaryHeight / 2) ** 2 <= 1.1)
    ) { // Give some leeway so the eye doesn't snap to boundary
        // Move image to mouse position
        targetImageX = mouseX;
        targetImageY = mouseY;
        targetReflectX = mouseX + 30 + 10 + 4;
        targetReflectY = mouseY - 30 - 4;
    } else {
        // Move image back to center of boundary
        const angle = Math.atan2(distanceY, distanceX);
        targetImageX = boundaryCenterX + (boundaryWidth / 2) * Math.cos(angle);
        targetImageY = boundaryCenterY + (boundaryHeight / 2) * Math.sin(angle);
        targetReflectX = boundaryCenterX + (boundaryWidth / 2) * Math.cos(angle) + 30 + 10;
        targetReflectY = boundaryCenterY + (boundaryHeight / 2) * Math.sin(angle) - 30 - 7;
    }
});

function recalculateBoundaries() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    boundaryX = canvas.width / 2 - boundaryWidth / 2;
    boundaryY = canvas.height / 2 - boundaryHeight / 2;

    boundaryCenterX = boundaryX + boundaryWidth / 2 - 300;
    boundaryCenterY = boundaryY + boundaryHeight / 2 + topOffset + 25;

    imageX = boundaryCenterX;
    imageY = boundaryCenterY;

    reflectX = boundaryCenterX + 30 + 10;
    reflectY = boundaryCenterY - 30 - 7;

    targetImageX = imageX;
    targetImageY = imageY;
    targetReflectX = reflectX;
    targetReflectY = reflectY;
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    recalculateBoundaries();
    // Recalculate boundary positions and center points
});
recalculateBoundaries();

function update() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Interpolate current position towards target position
    imageX = lerp(imageX, targetImageX, lerpFactor);
    imageY = lerp(imageY, targetImageY, lerpFactor);
    reflectX = lerp(reflectX, targetReflectX, lerpFactor);
    reflectY = lerp(reflectY, targetReflectY, lerpFactor);

    // Draw image
    ctx.drawImage(image, imageX - image.width / 2, imageY - image.height / 2);
    ctx.drawImage(eyeReflect, reflectX - eyeReflect.width / 2, reflectY - eyeReflect.height / 2);

    // drawCircle(ctx, boundaryCenterX, boundaryCenterY, 5, "purple", "black", 1);
    // drawCircle(ctx, boundaryCenterX + boundaryWidth / 2, boundaryCenterY + boundaryHeight / 2, 5, "orange", "black", 1);
    // drawCircle(ctx, boundaryCenterX - boundaryWidth / 2, boundaryCenterY - boundaryHeight / 2, 5, "orange", "black", 1);
    // drawCircle(ctx, boundaryCenterX + boundaryWidth / 2, boundaryCenterY - boundaryHeight / 2, 5, "orange", "black", 1);
    // drawCircle(ctx, boundaryCenterX - boundaryWidth / 2, boundaryCenterY + boundaryHeight / 2, 5, "orange", "black", 1);


    // Request next frame
    requestAnimationFrame(update);
}

// Start the animation loop
update();

/*
const resize = document.getElementById('eyeShine');
const xSlider = document.getElementById('left');
const ySlider = document.getElementById('top');

function updateImagePosition() {
    const x = xSlider.value;
    const y = ySlider.value;
    resize.style.transform = `translate(${x}px, ${y}px)`;
}

xSlider.addEventListener('input', updateImagePosition);
ySlider.addEventListener('input', updateImagePosition);
*/

var eye = document.getElementById("eyeLid");
var images = ["./assets/eyecloseup_lid_open(3).png", "./assets/eyecloseup_lid_closing(2).png", "./assets/eyecloseup_lid_closed(1).png"]; // Array of images
var currentState = 0;
var reverse = false;

// Define a function that updates the eye image
function updateImage() {
    if (currentState === images.length - 1) {
        reverse = true; // Reverse the animation if the last image is reached
    } else if (currentState === 0) {
        reverse = false; // Reset the animation if the first image is reached again
    }

    if (!reverse) {
        currentState++;
    } else {
        currentState--;
    }

    if (currentState == 2) {
        setTimeout(function () {}, 1);
    }

    eye.style.backgroundImage = "url('" + images[currentState] + "')";
    eye.style.zIndex = "411";
}

const blink = () => {
    let nestedInterval = setInterval(updateImage, 80);

    setTimeout(function () {
        clearInterval(nestedInterval);
    }, 640);
}

setInterval(blink, 10000);

addEventListener('dblclick', () => {
    blink();
})
