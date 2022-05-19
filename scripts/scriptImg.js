
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URLimage = "https://teachablemachine.withgoogle.com/models/FAcKxaqIA/";

let model, webcam, labelContainer, maxPredictions;
let btnImg = document.getElementById("btn-img")
let btnSound = document.getElementById("btn-sound")
let btnMove = document.getElementById("btn-move")
// Load the image model and setup the webcam
async function img() {
    btnImg.style.display = "none"
    btnSound.style.display = "none"
    btnMove.style.display = "none"

    const modelURL = URLimage + "model.json";
    const metadataURL = URLimage + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(560, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
        labelContainer.classList.add('label')
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const percente = prediction[i].probability * 100
        const classPrediction =
            `<span class="classPrediction">${prediction[i].className} : </span>
            <span class="percent">${percente.toFixed(2)}"%"</span>
            `
        // prediction[i].className + ": " + percente.toFixed(2) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}