const dropzone = document.getElementById("dropzone");
const imageInput = document.getElementById("imageInput");

dropzone.addEventListener("click", () => imageInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  if (e.dataTransfer.files.length) {
    imageInput.files = e.dataTransfer.files;
    console.log("seçilen dosya:", imageInput.files[0]);
  }
});

imageInput.addEventListener("change", () => {
  console.log("seçilen dosya:", imageInput.files[0]);
});
