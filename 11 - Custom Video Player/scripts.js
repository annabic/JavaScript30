const videoPlayer = document.querySelector(".viewer");
const toggleButton = document.querySelector(".toggle");
const sliders = document.querySelectorAll(".player__slider");
const skipButtons = document.querySelectorAll(".player__button[data-skip]");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");


function handleToggle() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

videoPlayer.addEventListener("click", handleToggle);
toggleButton.addEventListener("click", handleToggle);

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggleButton.textContent = icon;
}

videoPlayer.addEventListener("play", updateButton);
videoPlayer.addEventListener("pause", updateButton);

function handleSliderChange() {
    videoPlayer[this.name] = this.value;
}

sliders.forEach((slider) => {
    slider.addEventListener("input", handleSliderChange);
})

function handleSkip() {
    videoPlayer.currentTime = videoPlayer.currentTime + parseFloat(this.dataset.skip);
}

skipButtons.forEach((button) => {
    button.addEventListener("click", handleSkip);
})

function handleProgress() {
    const percent = videoPlayer.currentTime / videoPlayer.duration * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

videoPlayer.addEventListener("timeupdate", handleProgress);

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * videoPlayer.duration;
    videoPlayer.currentTime = scrubTime;
}

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);