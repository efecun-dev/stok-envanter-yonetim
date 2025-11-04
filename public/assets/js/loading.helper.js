document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("[data-loading-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", () => {
      const button = form.querySelector("button[type='submit']");
      if (!button) return;

      const text = button.querySelector(".text");
      if (text) text.innerHTML = "";

      button.classList.add("loading");
      button.disabled = true;
    });
  });
});
