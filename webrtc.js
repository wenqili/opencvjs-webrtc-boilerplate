/**
 * Authur: Wenqi Li @ ITP
 * 2018-11-13
 * 
 * Credit
 * Opencv.js - https://docs.opencv.org/3.4/d4/da1/tutorial_js_setup.html
 * WwebRTC - https://webrtc.github.io/samples/src/content/getusermedia/gum/
 */


 // webRTC part
const video = document.querySelector('video');
const canvas = window.canvas = document.getElementById('canvas-rtc');
let rtcImg = document.getElementById('canvas-img')
canvas.width = 240;
canvas.height = 180;


const constraints = {
  audio: false,
  video: true
};


function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}


function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}


navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);



// opencv contour
function drawCanvas(){

    //draw live stream on canvas
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    //draw cv contour
    let src = cv.imread("canvas-rtc");
    let dst = cv.Mat.zeros(src.rows,src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);


    let threshCV =  Number(thresholdSlider.value)// default to 180
    let maxvalCV =  Number(maxvalSlider.value) // default to 220


    cv.threshold(src, src, threshCV, maxvalCV, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(255, 255, 255)
        cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    }
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete(); contours.delete(); hierarchy.delete();

    //animating
    requestAnimationFrame(drawCanvas);
}


// controls
const button = document.getElementById('run');
button.onclick = function() {
    drawCanvas()
};


let thresholdSlider = document.getElementById('thresh')
let thresholdValue = document.getElementById('thresh-value')
thresholdValue.innerHTML = thresholdSlider.value

thresholdSlider.oninput = function(){
    thresholdValue.innerHTML = thresholdSlider.value
}


let maxvalSlider = document.getElementById('maxval')
let maxvalValue = document.getElementById('maxval-value')
maxvalValue.innerHTML = maxvalSlider.value

maxvalSlider.oninput = function(){
    maxvalValue.innerHTML = maxvalSlider.value
}