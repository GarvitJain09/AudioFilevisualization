import "./styles.css";

function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
  document.getElementById("audio").classList.remove("hide");
}
document
  .getElementById("upload")
  .addEventListener("change", handleFiles, false);
