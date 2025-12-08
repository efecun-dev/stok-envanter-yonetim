const dropzone = document.getElementById("dropzone");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const uploadProgress = document.getElementById("uploadProgress");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const dropzoneText = document.querySelector(".dropzone-text");
const form = document.getElementById("productForm");

dropzone.addEventListener("click", () => imageInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (!files || !files.length) return;

  setInputFiles(files);
  handleSelectedFile(files[0]);
});

imageInput.addEventListener("change", () => {
  if (!imageInput.files || !imageInput.files[0]) return;
  handleSelectedFile(imageInput.files[0]);
});

function setInputFiles(files) {
  const dt = new DataTransfer();
  for (let i = 0; i < files.length; i++) {
    dt.items.add(files[i]);
  }
  imageInput.files = dt.files;
}

function handleSelectedFile(file) {
  dropzoneText.textContent = file.name;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", form.action);

  xhr.upload.onprogress = (event) => {
    if (!event.lengthComputable) return;
    const percent = Math.round((event.loaded / event.total) * 100);

    uploadProgress.style.display = "block";
    uploadProgressBar.style.width = percent + "%";
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      uploadProgressBar.style.width = "100%";
      setTimeout(() => {
        uploadProgress.style.display = "none";
        uploadProgressBar.style.width = "0%";
      }, 800);
    } else {
      console.error("Yükleme hatası:", xhr.status, xhr.responseText);
    }
  };

  xhr.onerror = () => {
    console.error("XHR error");
  };

  xhr.send(formData);
});
