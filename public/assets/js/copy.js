const copyButtons = document.querySelectorAll(".copy");

copyButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.textContent.trim();
    await navigator.clipboard.writeText(text);

    btn.classList.add("copied");
    setTimeout(() => btn.classList.remove("copied"), 600);
  });
});
