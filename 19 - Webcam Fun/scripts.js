const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const button = document.querySelector('button');


let stream = null;

const getStream = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
        });

        video.srcObject = stream;

        video.onloadedmetadata = () => {
            video.play();
            paintCanvas();
        };
    /* use the stream */
    } catch (err) {
    /* handle the error */
        alert("Camera permissions not provided");
    }
}

getStream();

function handleTakePhoto(e) {
    snap.currentTime = 0;
    snap.play();
  
    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "screenshot");
    link.textContent = "Download Image";
    link.innerHTML = `<img src="${data}" alt="screenshot" />`
    strip.insertBefore(link, strip.firstChild);
}

function paintCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        // take the pixels out
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // pixels = greenScreen(pixels);

        // ctx.globalAlpha = 0.1;
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] + -50; // Blue
    }

    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0] + 100; // RED
        pixels.data[i + 100] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i - 150] = pixels.data[i + 2] + 100; // Blue
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}
  

button.addEventListener("click", handleTakePhoto);
video.addEventListener("canplay", paintCanvas);


