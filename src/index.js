let audioControl = document.getElementById("audio");
currentVolume = 25;
let volumneControl = document.getElementById("volume-control");
function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
  document.getElementById("audioDiv").classList.remove("hide");
  e.preventDefault();
}
document.getElementById("uploadDiv").addEventListener("change", handleFiles);

volumneControl.addEventListener("change", function (e) {
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
});

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
  if (event.target.id === "increaseVolume") {
    console.log(audioControl.volume === 0);
    if (audioControl.volume === 0) {
      document.getElementById("mute").classList.remove("fa-volume-high");
      document.getElementById("mute").classList.add("fa-volume-xmark");
      audioControl.volume = currentVolume;
    } else {
      audioControl.volume += 0.1;
    }
  }
  if (event.target.id === "decreaseVolume") {
    if (audioControl.volume === 0) {
      document.getElementById("mute").classList.remove("fa-volume-high");
      document.getElementById("mute").classList.add("fa-volume-xmark");
      audioControl.volume = currentVolume;
    } else {
      audioControl.volume -= 0.1;
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

document.getElementById("play").addEventListener("click", audioControls);
document.getElementById("forward").addEventListener("click", audioControls);
document.getElementById("backward").addEventListener("click", audioControls);
document.getElementById("volume").addEventListener("click", audioControls);
