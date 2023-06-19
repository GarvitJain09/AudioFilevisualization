let audioControl = document.getElementById("audio");
currentVolume = 25;
let volumneControl = document.getElementById("volume-control");
let seekslider = document.getElementById("seekslider");
var seekto, seeking;
let audioSource = null;
let analyser = null;
let audioCtx = null;
let audio1 = audioControl;
let r = 0,
  g = 0,
  b = 0;
audio1.crossOrigin = "anonymous";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

audioControl.addEventListener("timeupdate", function () {
  seekslider.value = "0";
  seektimeupdate();
});
seekslider.addEventListener("mousedown", function (event) {
  seeking = true;
  seek(event);
});
seekslider.addEventListener("mousemove", function (event) {
  seek(event);
});
seekslider.addEventListener("mouseup", function () {
  seeking = false;
});
function seek(event) {
  if (seeking) {
    seekslider.value = event.clientX - seekslider.offsetLeft;
    seekto = audioControl.duration * (seekslider.value / 100);
    audioControl.currentTime = seekto;
  }
}
function seektimeupdate() {
  var nt = audioControl.currentTime * (100 / audioControl.duration);
  if (isNaN(nt)) {
    seekslider.value = "0";
  } else {
    seekslider.value = nt;
  }
  if (audioControl.currentTime === audioControl.duration) {
    document.getElementById("play").classList.remove("fa-pause");
    document.getElementById("play").classList.add("fa-play");
  }
}
function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
  seekslider.value = "0";
  document.getElementById("audioDiv").classList.remove("hide");
  // event.preventDefault();
}
document.getElementById("uploadDiv").addEventListener("change", handleFiles);
function audioControls(event) {
  if (event.target.id === "play") {
    if (document.getElementById("play").classList.contains("fa-play")) {
      audioControl.play();
      document.getElementById("play").classList.remove("fa-play");
      document.getElementById("play").classList.add("fa-pause");
    } else if (document.getElementById("play").classList.contains("fa-pause")) {
      audioControl.pause();
      document.getElementById("play").classList.remove("fa-pause");
      document.getElementById("play").classList.add("fa-play");
    }
  }
  if (event.target.id === "forward") {
    audioControl.currentTime += 5;
  }
  if (event.target.id === "backward") {
    audioControl.currentTime -= 5;
  }
  if (event.target.id === "volume-icon") {
    if (
      document
        .getElementById("volume-icon")
        .classList.contains("fa-volume-xmark")
    ) {
      document
        .getElementById("volume-icon")
        .classList.remove("fa-volume-xmark");
      document.getElementById("volume-icon").classList.add("fa-volume-high");
      if (currentVolume === "0") {
        volumneControl.value = "25";
        audioControl.volume = "2.5";
      } else {
        audioControl.volume = currentVolume / 100;
        volumneControl.value = "" + currentVolume + "";
      }
    } else if (
      document
        .getElementById("volume-icon")
        .classList.contains("fa-volume-high")
    ) {
      audioControl.volume = 0;
      volumneControl.value = 0;
      document.getElementById("volume-icon").classList.remove("fa-volume-high");
      document.getElementById("volume-icon").classList.add("fa-volume-xmark");
    }
  }
}
function volumeChange(e) {
  currentVolume = volumneControl.value;
  audioControl.volume = e.currentTarget.value / 100;
  if (e.currentTarget.value === "0") {
    document.getElementById("volume-icon").classList.remove("fa-volume-high");
    document.getElementById("volume-icon").classList.add("fa-volume-xmark");
  } else if (
    document.getElementById("volume-icon").classList.contains("fa-volume-xmark")
  ) {
    document.getElementById("volume-icon").classList.remove("fa-volume-xmark");
    document.getElementById("volume-icon").classList.add("fa-volume-high");
  }
}
volumneControl.addEventListener("change", volumeChange);
function visual() {
  audioCtx = audioCtx || new AudioContext();
  const ctx = canvas.getContext("2d");

  var playPromise;

  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        if (!audioControl.paused) {
          audioControl.play();
        } else {
          audioControl.pause();
        }
      })
      .catch((error) => {});
  }
  if (!audioSource) {
    audioSource =
      audioSource ||
      audioCtx.createMediaElementSource(document.getElementById("audio"));
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / 2 / bufferLength;

  let x = 0;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer({ bufferLength, dataArray, barWidth });
    requestAnimationFrame(animate);
  }

  const drawVisualizer = ({ bufferLength, dataArray, barWidth }) => {
    let barHeight;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(
        canvas.width / 2 - x,
        canvas.height - barHeight,
        barWidth,
        barHeight
      );
      x += barWidth;
    }

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  };

  animate();
}
document
  .getElementById("colorforChart")
  .addEventListener("change", function (e) {
    r = parseInt(e.currentTarget.value.slice(1, 3), 16);
    g = parseInt(e.currentTarget.value.slice(3, 5), 16);
    b = parseInt(e.currentTarget.value.slice(5, 7), 16);
  });
document.getElementById("app").addEventListener("click", visual);
document.getElementById("play").addEventListener("click", audioControls);
document.getElementById("forward").addEventListener("click", audioControls);
document.getElementById("backward").addEventListener("click", audioControls);
document.getElementById("volume").addEventListener("click", audioControls);
document
  .getElementById("playBackSpeed")
  .addEventListener("change", function (e) {
    console.log(e.currentTarget.value);
    audioControl.playbackRate = e.currentTarget.value;
  });

// Show loading animation.
