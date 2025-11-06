function toggleSidebar() {
  const icons = document.querySelectorAll(".list-item span");
  const sidebar = document.getElementById("sidebar");
  const invento = document.querySelector(".sidebar-title");
  const sb_text = document.querySelector(".sidebar-text");
  const listHeaders = document.querySelectorAll(".sidebar-list-header");
  const listItemTexts = document.querySelectorAll(".list-item p");
  const listItems = document.querySelectorAll(".list-item");
  const container = document.querySelector(".sidebar-list-container");
  const sidebarList = document.querySelectorAll(".sidebar-list");
  const sidebarImage = document.querySelector(".sidebar-header .row img");
  const divider = document.querySelectorAll(".divider");
  const userComponents = document.querySelectorAll(".sb-act-toggle");
  const userContainer = document.querySelector(".user-container");

  sidebar.classList.toggle("sidebar-toggled");
  invento.classList.toggle("hide");
  sb_text.classList.toggle("hide");
  listHeaders.forEach((item) => {
    item.classList.toggle("hide");
  });
  listItemTexts.forEach((item) => {
    item.classList.toggle("hide");
  });
  icons.forEach((icon) => {
    icon.classList.toggle("sb-icon-active");
  });
  listItems.forEach((item) => {
    item.classList.toggle("list-item-active");
  });
  container.classList.toggle("container-active");
  sidebarList.forEach((item) => {
    item.classList.toggle("sidebar-list-active");
  });
  sidebarImage.classList.toggle("image-active");

  divider.forEach((item) => {
    item.classList.toggle("hidden");
  });
  userComponents.forEach((item) => {
    item.classList.toggle("hidden");
  });
  userContainer.classList.toggle("user-container-active");
}
